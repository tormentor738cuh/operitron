import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function appUrl() {
  return (process.env.APP_URL || "https://operitron.com").replace(/\/+$/, "");
}

function adminEmails() {
  return String(process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "tormentor738@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email) {
  return adminEmails().includes(String(email || "").toLowerCase());
}

function diagnosticsBase() {
  return {
    stripeSecretLoaded: Boolean(process.env.STRIPE_SECRET_KEY),
    supabaseUrlLoaded: Boolean(process.env.VITE_SUPABASE_URL),
    supabaseAnonKeyLoaded: Boolean(process.env.VITE_SUPABASE_ANON_KEY),
    supabaseServiceRoleLoaded: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    stripeInitialized: false,
    supabaseUserStatus: "unchecked",
    stripeCustomerId: null,
    subscriptionStatuses: [],
    apiResponseCode: null,
    errorMessage: "",
  };
}

async function ensureProfile(adminClient, user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
}

async function findCustomerId(stripe, adminClient, user, diagnostics) {
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (profile?.stripe_customer_id) {
    diagnostics.stripeCustomerId = profile.stripe_customer_id;
    return profile.stripe_customer_id;
  }

  const { data: subscriptionRows, error: subError } = await adminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .not("stripe_customer_id", "is", null)
    .limit(1);
  if (subError) console.error("[portal] Subscription customer lookup failed", { message: subError.message, userId: user.id });
  const fromSubscription = subscriptionRows?.[0]?.stripe_customer_id;
  if (fromSubscription) {
    diagnostics.stripeCustomerId = fromSubscription;
    await adminClient.from("profiles").update({ stripe_customer_id: fromSubscription }).eq("id", user.id);
    return fromSubscription;
  }

  if (user.email) {
    const matchingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = matchingCustomers.data[0];
    if (customer) {
      diagnostics.stripeCustomerId = customer.id;
      await adminClient.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", user.id);
      return customer.id;
    }
  }

  return null;
}

async function subscriptionStatuses(stripe, customerId) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 20,
  });
  return subscriptions.data.map((subscription) => subscription.status);
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });

  const diagnostics = diagnosticsBase();
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey || !supabaseUrl || !anonKey || !serviceKey) {
    diagnostics.apiResponseCode = 503;
    diagnostics.errorMessage = "Missing required server environment variables.";
    console.error("[portal] Missing server configuration.", diagnostics);
    return response.status(503).json({ error: "Billing setup is incomplete. Please contact support@operitron.com.", diagnostics });
  }

  const stripe = new Stripe(stripeSecretKey);
  diagnostics.stripeInitialized = true;
  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    diagnostics.apiResponseCode = 401;
    diagnostics.supabaseUserStatus = "missing_token";
    return response.status(401).json({ error: "Sign in required.", diagnostics });
  }

  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) {
    diagnostics.apiResponseCode = 401;
    diagnostics.supabaseUserStatus = authError?.message || "invalid_session";
    return response.status(401).json({ error: "Invalid session.", diagnostics });
  }

  const adminVisible = isAdminEmail(data.user.email);
  diagnostics.supabaseUserStatus = "authenticated";

  try {
    const adminClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    await ensureProfile(adminClient, data.user);
    const customerId = await findCustomerId(stripe, adminClient, data.user, diagnostics);

    if (!customerId) {
      diagnostics.apiResponseCode = 400;
      diagnostics.errorMessage = "No Stripe customer exists for this user.";
      return response.status(400).json({ error: "Start a subscription first.", ...(adminVisible ? { diagnostics } : {}) });
    }

    const statuses = await subscriptionStatuses(stripe, customerId);
    diagnostics.subscriptionStatuses = statuses;
    const supportedStatuses = new Set(["active", "trialing", "canceled", "past_due", "unpaid"]);
    if (!statuses.some((status) => supportedStatuses.has(status))) {
      diagnostics.apiResponseCode = 400;
      diagnostics.errorMessage = "Stripe customer exists, but no subscription was found.";
      return response.status(400).json({ error: "Start a subscription first.", ...(adminVisible ? { diagnostics } : {}) });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: appUrl() + "/profile",
    });
    diagnostics.apiResponseCode = 200;
    return response.status(200).json({ url: portal.url, ...(adminVisible ? { diagnostics } : {}) });
  } catch (error) {
    diagnostics.apiResponseCode = 500;
    diagnostics.errorMessage = error?.message || "Unknown billing portal error.";
    console.error("[portal] Session creation failed", {
      name: error?.name,
      type: error?.type,
      code: error?.code,
      message: error?.message,
      userId: data.user.id,
      diagnostics,
    });
    return response.status(500).json({
      error: adminVisible ? diagnostics.errorMessage : "Billing portal could not be created. Please contact support@operitron.com.",
      ...(adminVisible ? { diagnostics } : {}),
    });
  }
}
