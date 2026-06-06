import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripeSecretKey, supabaseServiceKey } from "./_server-env.js";

async function ensureProfile(adminClient, user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    console.error("[portal] Profile setup failed", { code: error.code, message: error.message, userId: user.id });
    throw new Error("profile_setup_failed");
  }
}

async function getOrCreateCustomer(stripe, adminClient, user, existingCustomerId) {
  if (existingCustomerId) return existingCustomerId;
  const matchingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customer = matchingCustomers.data[0] || await stripe.customers.create({
    email: user.email,
    metadata: { user_id: user.id },
  });
  if (adminClient) {
    const { error } = await adminClient
      .from("profiles")
      .update({ stripe_customer_id: customer.id, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) console.error("[portal] Unable to persist Stripe customer ID.", { message: error.message, userId: user.id });
  }
  return customer.id;
}

async function hasAnySubscription(stripe, customerId) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });
  const supportedStatuses = new Set(["active", "trialing", "canceled", "past_due", "unpaid"]);
  return subscriptions.data.some((subscription) => supportedStatuses.has(subscription.status));
}

function appUrl() {
  return (process.env.APP_URL || "https://operitron.com").replace(/\/+$/, "");
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const stripeKey = stripeSecretKey();
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = supabaseServiceKey();
  if (!stripeKey || !supabaseUrl || !anonKey || !serviceKey) {
    console.error("[portal] Missing server configuration.");
    return response.status(503).json({ error: "Billing setup is incomplete. Please contact support@operitron.com." });
  }
  const stripe = new Stripe(stripeKey);
  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return response.status(401).json({ error: "Invalid session." });

  try {
    const adminClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    let customerId = null;
    await ensureProfile(adminClient, data.user);
    const { data: profile, error: profileError } = await adminClient.from("profiles").select("stripe_customer_id").eq("id", data.user.id).maybeSingle();
    if (profileError) throw profileError;
    customerId = await getOrCreateCustomer(stripe, adminClient, data.user, profile?.stripe_customer_id);
    if (!await hasAnySubscription(stripe, customerId)) {
      return response.status(400).json({ error: "Start a subscription first." });
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl()}/profile`,
    });
    return response.status(200).json({ url: portal.url });
  } catch (error) {
    console.error("[portal] Session creation failed", {
      name: error?.name,
      type: error?.type,
      code: error?.code,
      message: error?.message,
      userId: data.user.id,
    });
    return response.status(500).json({ error: "Billing portal could not be created. Please contact support@operitron.com." });
  }
}
