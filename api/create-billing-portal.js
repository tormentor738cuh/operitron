import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const authClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const adminClient = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const { data } = await authClient.auth.getUser(token);
  if (!data.user) return response.status(401).json({ error: "Sign in required." });

  const { data: profile } = await adminClient.from("profiles").select("stripe_customer_id").eq("id", data.user.id).single();

  try {
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const matchingCustomers = await stripe.customers.list({ email: data.user.email, limit: 1 });
      customerId = matchingCustomers.data[0]?.id;
      if (customerId) {
        await adminClient.from("profiles").update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() }).eq("id", data.user.id);
      }
    }
    if (!customerId) return response.status(400).json({ error: "Start a subscription first." });
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL || "https://operitron.com"}/profile`,
    });
    return response.status(200).json({ url: portal.url });
  } catch (_error) {
    return response.status(500).json({ error: "Billing portal could not be created." });
  }
}
