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

async function ensureProfile(userId) {
  const { data, error: userError } = await adminClient.auth.admin.getUserById(userId);
  if (userError || !data.user) throw userError || new Error("User not found.");
  const { error } = await adminClient.from("profiles").upsert({
    id: data.user.id,
    email: data.user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
}

async function syncSubscription(subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  await ensureProfile(userId);
  const details = {
    stripe_customer_id: String(subscription.customer),
    subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_plan: subscription.metadata?.plan || "Subscribed",
    trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  const { error: profileError } = await adminClient.from("profiles").update(details).eq("id", userId);
  if (profileError) throw profileError;
  const { error: subscriptionError } = await adminClient.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: String(subscription.customer),
    stripe_subscription_id: subscription.id,
    price_id: subscription.items?.data?.[0]?.price?.id || null,
    plan: subscription.metadata?.plan || "Subscribed",
    status: subscription.status,
    trial_ends_at: details.trial_ends_at,
    current_period_end: details.current_period_end,
    updated_at: details.updated_at,
  }, { onConflict: "stripe_subscription_id" });
  if (subscriptionError) throw subscriptionError;
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).end();
  let event;
  try {
    event = stripe.webhooks.constructEvent(await readBody(request), request.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (_error) {
    return response.status(400).json({ error: "Invalid webhook signature." });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id || session.client_reference_id;
      if (userId && session.customer) {
        await ensureProfile(userId);
        const { error } = await adminClient.from("profiles").update({
          stripe_customer_id: String(session.customer),
          updated_at: new Date().toISOString(),
        }).eq("id", userId);
        if (error) throw error;
      }
    }
    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      await syncSubscription(event.data.object);
    }
  } catch (_error) {
    return response.status(500).json({ error: "Subscription update could not be stored." });
  }
  return response.status(200).json({ received: true });
}
