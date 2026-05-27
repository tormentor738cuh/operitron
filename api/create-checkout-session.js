import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function serverConfig(plan) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priceByPlan = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || process.env.VITE_STRIPE_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_ANNUAL_PRICE_ID || process.env.VITE_STRIPE_ANNUAL_PRICE_ID,
  };
  const priceId = priceByPlan[plan];
  const missing = [
    !stripeSecretKey && "STRIPE_SECRET_KEY",
    !supabaseUrl && "VITE_SUPABASE_URL",
    !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
    !supabaseServiceKey && "SUPABASE_SERVICE_ROLE_KEY",
    !priceId && `${plan === "annual" ? "STRIPE_ANNUAL_PRICE_ID" : "STRIPE_MONTHLY_PRICE_ID"}`,
  ].filter(Boolean);
  if (missing.length) {
    console.error("[checkout] Missing server configuration:", missing.join(", "));
    return { error: "Billing setup is incomplete. Please contact support@operitron.com." };
  }
  return { stripeSecretKey, supabaseUrl, supabaseAnonKey, supabaseServiceKey, priceId };
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

async function ensureProfile(adminClient, user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    console.error("[checkout] Profile setup failed", { code: error.code, message: error.message, userId: user.id });
    throw new Error("profile_setup_failed");
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });

  const { plan } = request.body || {};
  if (!["monthly", "annual"].includes(plan)) {
    return response.status(400).json({ error: "Invalid plan." });
  }
  const config = serverConfig(plan);
  if (config.error) return response.status(503).json({ error: config.error });
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });

  const { data, error } = await getSupabase(config).auth.getUser(token);
  if (error || !data.user) return response.status(401).json({ error: "Invalid session." });

  try {
    const stripe = new Stripe(config.stripeSecretKey);
    const adminClient = getAdminSupabase(config);
    await ensureProfile(adminClient, data.user);
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", data.user.id)
      .maybeSingle();
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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: data.user.id,
      line_items: [{ price: config.priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        // Both supported subscription plans start with the same three-day trial.
        trial_period_days: 3,
        metadata: { user_id: data.user.id, plan },
      },
      metadata: { user_id: data.user.id, plan },
      success_url: `https://operitron.com/dashboard?checkout=success&plan=${plan}`,
      cancel_url: "https://operitron.com/pricing",
    });
    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Session creation failed", {
      name: error?.name,
      type: error?.type,
      code: error?.code,
      message: error?.message,
      requestId: error?.requestId,
      userId: data.user.id,
      plan,
    });
    if (error?.type === "StripeInvalidRequestError") {
      return response.status(400).json({ error: "This billing plan is unavailable. Please contact support@operitron.com." });
    }
    return response.status(500).json({ error: "Checkout could not be created. Please try again or contact support@operitron.com." });
  }
}
