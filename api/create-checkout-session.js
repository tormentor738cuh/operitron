import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  adminEmails,
  stripeAnnualPriceId,
  stripeMonthlyPriceId,
  stripeSecretKey,
  supabaseServiceKey,
} from "./_server-env.js";

function serverConfig(plan) {
  const stripeKey = stripeSecretKey();
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = supabaseServiceKey();
  const priceByPlan = {
    monthly: stripeMonthlyPriceId(),
    annual: stripeAnnualPriceId(),
  };
  const priceId = priceByPlan[plan];
  const missing = [
    !stripeKey && "STRIPE_SECRET_KEY",
    !supabaseUrl && "VITE_SUPABASE_URL",
    !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
    !serviceKey && "SUPABASE_SERVICE_ROLE_KEY",
    !priceId && `${plan === "annual" ? "STRIPE_ANNUAL_PRICE_ID" : "STRIPE_MONTHLY_PRICE_ID"}`,
  ].filter(Boolean);
  return { stripeSecretKey: stripeKey, supabaseUrl, supabaseAnonKey, supabaseServiceKey: serviceKey, priceId, missing };
}

function getSupabase(config) {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getAdminSupabase(config) {
  return createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function configuredAdminEmails() {
  return adminEmails();
}

function isAdminUser(user, profile) {
  const email = String(user?.email || "").trim().toLowerCase();
  return Boolean(email && (configuredAdminEmails().includes(email) || profile?.role === "admin"));
}

function diagnostics({ config, stripeStatus, supabaseUserStatus, apiResponseCode, errorMessage, extra = {} }) {
  return {
    stripeInitializationStatus: stripeStatus || "not_attempted",
    priceIdBeingUsed: config?.priceId || "Not loaded",
    supabaseUserStatus: supabaseUserStatus || "unknown",
    apiResponseCode,
    errorMessage: errorMessage || "No server error message was provided.",
    missingConfiguration: config?.missing || [],
    ...extra,
  };
}

function sendCheckoutError(response, status, publicMessage, context = {}) {
  const payload = { error: publicMessage };
  if (context.isAdmin) {
    payload.diagnostics = diagnostics({
      config: context.config,
      stripeStatus: context.stripeStatus,
      supabaseUserStatus: context.supabaseUserStatus,
      apiResponseCode: status,
      errorMessage: context.errorMessage || publicMessage,
      extra: context.extra,
    });
  }
  return response.status(status).json(payload);
}

async function ensureProfile(adminClient, user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    console.error("[checkout] Profile setup failed", { code: error.code, message: error.message, userId: user.id });
    throw new Error(`profile_setup_failed: ${error.message}`);
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });

  const { plan } = request.body || {};
  if (!["monthly", "annual"].includes(plan)) {
    return response.status(400).json({ error: "Invalid plan." });
  }

  const config = serverConfig(plan);
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    console.error("[checkout] Missing Supabase auth configuration", { missing: config.missing });
    return response.status(503).json({ error: "Billing setup is incomplete. Please contact support@operitron.com." });
  }

  const { data, error: userError } = await getSupabase(config).auth.getUser(token);
  if (userError || !data.user) {
    return response.status(401).json({ error: "Invalid session." });
  }

  const supabaseUserStatus = `authenticated:${data.user.email || data.user.id}`;
  let adminClient = null;
  let profile = null;
  let profileError = null;

  if (config.supabaseServiceKey) {
    adminClient = getAdminSupabase(config);
    const profileResponse = await adminClient
      .from("profiles")
      .select("stripe_customer_id, role")
      .eq("id", data.user.id)
      .maybeSingle();
    profile = profileResponse.data;
    profileError = profileResponse.error;
  }

  const isAdmin = isAdminUser(data.user, profile);

  if (config.missing.length) {
    const message = `Missing server configuration: ${config.missing.join(", ")}`;
    console.error("[checkout]", message);
    return sendCheckoutError(response, 503, "Billing setup is incomplete. Please contact support@operitron.com.", {
      isAdmin,
      config,
      stripeStatus: config.stripeSecretKey ? "ready_to_initialize" : "missing_STRIPE_SECRET_KEY",
      supabaseUserStatus,
      errorMessage: message,
    });
  }

  let stripeStatus = "not_attempted";

  try {
    let stripe;
    try {
      stripe = new Stripe(config.stripeSecretKey);
      stripeStatus = "initialized";
    } catch (stripeError) {
      stripeStatus = "initialization_failed";
      throw stripeError;
    }

    if (!adminClient) adminClient = getAdminSupabase(config);
    await ensureProfile(adminClient, data.user);
    if (profileError) throw profileError;

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const matchingCustomers = await stripe.customers.list({ email: data.user.email, limit: 1 });
      const customer = matchingCustomers.data[0] || await stripe.customers.create({
        email: data.user.email,
        metadata: { user_id: data.user.id },
      });
      customerId = customer.id;
      const { error: customerSaveError } = await adminClient
        .from("profiles")
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq("id", data.user.id);
      if (customerSaveError) throw customerSaveError;
    }

    console.info("[checkout] Creating Stripe checkout session", {
      userId: data.user.id,
      email: data.user.email,
      plan,
      priceId: config.priceId,
      customerId,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: data.user.id,
      line_items: [{ price: config.priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 3,
        metadata: { user_id: data.user.id, plan },
      },
      metadata: { user_id: data.user.id, plan },
      success_url: `https://operitron.com/dashboard?checkout=success&plan=${plan}`,
      cancel_url: "https://operitron.com/pricing",
    });
    return response.status(200).json({ url: session.url });
  } catch (error) {
    const status = error?.type === "StripeInvalidRequestError" ? 400 : 500;
    const publicMessage = error?.type === "StripeInvalidRequestError"
      ? "This billing plan is unavailable. Please contact support@operitron.com."
      : "Checkout could not be created. Please try again or contact support@operitron.com.";

    console.error("[checkout] Session creation failed", {
      name: error?.name,
      type: error?.type,
      code: error?.code,
      message: error?.message,
      requestId: error?.requestId,
      userId: data.user.id,
      plan,
      priceId: config.priceId,
      status,
    });

    return sendCheckoutError(response, status, publicMessage, {
      isAdmin,
      config,
      stripeStatus,
      supabaseUserStatus,
      errorMessage: error?.message || publicMessage,
      extra: {
        stripeErrorType: error?.type || "",
        stripeErrorCode: error?.code || "",
        stripeRequestId: error?.requestId || "",
      },
    });
  }
}
