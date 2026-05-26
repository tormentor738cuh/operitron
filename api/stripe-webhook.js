import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

async function ensureProfile(adminClient, userId) {
  const { data, error: userError } = await adminClient.auth.admin.getUserById(userId);
  if (userError || !data.user) throw userError || new Error("User not found.");
  const { error } = await adminClient.from("profiles").upsert({
    id: data.user.id,
    email: data.user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
}

async function syncSubscription(adminClient, subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  await ensureProfile(adminClient, userId);
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
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceKey) {
    console.error("[webhook] Missing server configuration.");
    return response.status(503).json({ error: "Webhook configuration is incomplete." });
  }
  const stripe = new Stripe(stripeSecretKey);
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  let event;
  try {
    event = stripe.webhooks.constructEvent(await readBody(request), request.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("[webhook] Invalid Stripe signature", { message: error?.message });
    return response.status(400).json({ error: "Invalid webhook signature." });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id || session.client_reference_id;
      if (userId && session.customer) {
        await ensureProfile(adminClient, userId);
        const { error } = await adminClient.from("profiles").update({
          stripe_customer_id: String(session.customer),
          updated_at: new Date().toISOString(),
        }).eq("id", userId);
        if (error) throw error;
      }
    }
    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      await syncSubscription(adminClient, event.data.object);
    }
  } catch (error) {
    console.error("[webhook] Failed to store event", { type: event.type, message: error?.message });
    return response.status(500).json({ error: "Subscription update could not be stored." });
  }
  return response.status(200).json({ received: true });
}
