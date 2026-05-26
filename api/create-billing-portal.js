import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const authClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const adminClient = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureProfile(user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error("profile_setup_failed");
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const { data } = await authClient.auth.getUser(token);
  if (!data.user) return response.status(401).json({ error: "Sign in required." });

  try {
    await ensureProfile(data.user);
    const { data: profile, error: profileError } = await adminClient.from("profiles").select("stripe_customer_id").eq("id", data.user.id).maybeSingle();
    if (profileError) throw new Error("profile_lookup_failed");
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const matchingCustomers = await stripe.customers.list({ email: data.user.email, limit: 1 });
      customerId = matchingCustomers.data[0]?.id;
      if (customerId) {
        const { error: customerSaveError } = await adminClient.from("profiles").update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() }).eq("id", data.user.id);
        if (customerSaveError) throw new Error("customer_save_failed");
      }
    }
    if (!customerId) return response.status(400).json({ error: "Start a subscription first." });
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL || "https://operitron.com"}/profile`,
    });
    return response.status(200).json({ url: portal.url });
  } catch (error) {
    if (String(error?.message).includes("profile_")) {
      return response.status(503).json({ error: "Account setup is not ready. Please contact support@operitron.com." });
    }
    return response.status(500).json({ error: "Billing portal could not be created. Please contact support@operitron.com." });
  }
}
