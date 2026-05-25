import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getSupabase() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getAdminSupabase() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });

  const { data, error } = await getSupabase().auth.getUser(token);
  if (error || !data.user) return response.status(401).json({ error: "Invalid session." });

  const { priceId, plan } = request.body || {};
  const priceByPlan = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || process.env.VITE_STRIPE_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_ANNUAL_PRICE_ID || process.env.VITE_STRIPE_ANNUAL_PRICE_ID,
  };
  if (!priceByPlan[plan] || priceByPlan[plan] !== priceId) {
    return response.status(400).json({ error: "Invalid plan." });
  }

  try {
    const adminClient = getAdminSupabase();
    const { data: profile } = await adminClient.from("profiles").select("stripe_customer_id").eq("id", data.user.id).maybeSingle();
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const matchingCustomers = await stripe.customers.list({ email: data.user.email, limit: 1 });
      const customer = matchingCustomers.data[0] || await stripe.customers.create({
        email: data.user.email,
        metadata: { user_id: data.user.id },
      });
      customerId = customer.id;
      await adminClient.from("profiles").update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() }).eq("id", data.user.id);
    }
    const appUrl = process.env.APP_URL || "https://operitron.com";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: data.user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        // Both supported subscription plans start with the same three-day trial.
        trial_period_days: 3,
        metadata: { user_id: data.user.id, plan },
      },
      metadata: { user_id: data.user.id, plan },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    });
    return response.status(200).json({ url: session.url });
  } catch (_error) {
    return response.status(500).json({ error: "Checkout could not be created." });
  }
}
