import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const adminClient = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const config = { api: { bodyParser: false } };

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

async function syncSubscription(subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  await adminClient.from("profiles").update({
    stripe_customer_id: String(subscription.customer),
    subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_plan: subscription.metadata?.plan || "Subscribed",
    trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).end();
  let event;
  try {
    event = stripe.webhooks.constructEvent(await readBody(request), request.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (_error) {
    return response.status(400).json({ error: "Invalid webhook signature." });
  }

  if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    await syncSubscription(event.data.object);
  }
  return response.status(200).json({ received: true });
}
