import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

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

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecretKey || !supabaseUrl || !anonKey) {
    console.error("[portal] Missing server configuration.");
    return response.status(503).json({ error: "Billing setup is incomplete. Please contact support@operitron.com." });
  }
  const stripe = new Stripe(stripeSecretKey);
  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return response.status(401).json({ error: "Invalid session." });

  try {
    let adminClient = null;
    let customerId = null;
    if (serviceKey) {
      try {
        adminClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
        await ensureProfile(adminClient, data.user);
        const { data: profile, error: profileError } = await adminClient.from("profiles").select("stripe_customer_id").eq("id", data.user.id).maybeSingle();
        if (profileError) throw profileError;
        customerId = profile?.stripe_customer_id;
      } catch (profileError) {
        console.error("[portal] Profile lookup unavailable; resolving customer by email.", {
          message: profileError?.message,
          userId: data.user.id,
        });
      }
    } else {
      console.warn("[portal] SUPABASE_SERVICE_ROLE_KEY is not configured; resolving customer by email.");
    }
    if (!customerId) {
      const matchingCustomers = await stripe.customers.list({ email: data.user.email, limit: 1 });
      customerId = matchingCustomers.data[0]?.id;
      if (customerId && adminClient) {
        const { error: customerSaveError } = await adminClient.from("profiles").update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() }).eq("id", data.user.id);
        if (customerSaveError) console.error("[portal] Unable to persist Stripe customer ID.", { message: customerSaveError.message, userId: data.user.id });
      }
    }
    if (!customerId) return response.status(400).json({ error: "Start a subscription first." });
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL || "https://operitron.com"}/profile`,
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
