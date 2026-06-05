import { createClient } from "@supabase/supabase-js";

const ownerEmail = String(process.env.ADMIN_OWNER_EMAIL || process.env.ADMIN_EMAILS || "").split(",")[0]?.trim().toLowerCase();

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey) return response.status(503).json({ error: "Account configuration is incomplete." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return response.status(401).json({ error: "Invalid session." });

  const email = String(data.user.email || "").toLowerCase();
  const adminClient = serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  let profile = null;
  const schema = {};
  if (adminClient) {
    if (email === ownerEmail) {
      await adminClient.from("profiles").upsert({ id: data.user.id, email: data.user.email || "", role: "admin" }, { onConflict: "id" });
    }
    const profileResult = await adminClient.from("profiles").select("role, subscription_status").eq("id", data.user.id).maybeSingle();
    profile = profileResult.data;
    for (const table of ["profiles", "projects", "analyses", "subscriptions"]) {
      const result = await adminClient.from(table).select("*", { count: "exact", head: true });
      schema[table] = !result.error;
    }
  }
  const isAdmin = email === ownerEmail || profile?.role === "admin";
  if (!isAdmin) return response.status(403).json({ error: "Admin access required." });
  const stripeConfig = [
    { name: "Stripe keys loaded", ok: Boolean(process.env.STRIPE_SECRET_KEY), detail: process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY is available server-side." : "Missing STRIPE_SECRET_KEY." },
    { name: "Monthly price ID loaded", ok: Boolean(process.env.STRIPE_MONTHLY_PRICE_ID || process.env.VITE_STRIPE_MONTHLY_PRICE_ID), detail: (process.env.STRIPE_MONTHLY_PRICE_ID || process.env.VITE_STRIPE_MONTHLY_PRICE_ID) ? "Monthly subscription price ID is configured." : "Missing monthly Stripe price ID." },
    { name: "Annual price ID loaded", ok: Boolean(process.env.STRIPE_ANNUAL_PRICE_ID || process.env.VITE_STRIPE_ANNUAL_PRICE_ID), detail: (process.env.STRIPE_ANNUAL_PRICE_ID || process.env.VITE_STRIPE_ANNUAL_PRICE_ID) ? "Annual subscription price ID is configured." : "Missing annual Stripe price ID." },
    { name: "Webhook secret configured", ok: Boolean(process.env.STRIPE_WEBHOOK_SECRET), detail: process.env.STRIPE_WEBHOOK_SECRET ? "STRIPE_WEBHOOK_SECRET is configured for subscription sync." : "Missing STRIPE_WEBHOOK_SECRET." },
    { name: "Supabase service role configured", ok: Boolean(serviceKey), detail: serviceKey ? "SUPABASE_SERVICE_ROLE_KEY is available server-side." : "Missing SUPABASE_SERVICE_ROLE_KEY." },
  ];

  return response.status(200).json({
    email,
    role: profile?.role || (email === ownerEmail ? "owner override" : "user"),
    access: "all_features",
    stripeConfig,
    checks: [
      { name: "Owner access", ok: isAdmin, detail: "Authenticated admin bypass is enabled." },
      { name: "Database service key", ok: Boolean(serviceKey), detail: serviceKey ? "Server-side persistence enabled." : "Add SUPABASE_SERVICE_ROLE_KEY in Vercel." },
      { name: "Admin database role", ok: profile?.role === "admin", detail: profile?.role === "admin" ? "RLS permits owner workspace writes." : "Apply supabase-admin-access.sql in Supabase." },
      { name: "AI configuration", ok: Boolean(process.env.OPENAI_API_KEY), detail: process.env.OPENAI_API_KEY ? "Server-side AI enabled." : "Add OPENAI_API_KEY in Vercel." },
      { name: "Stripe checkout", ok: Boolean(process.env.STRIPE_SECRET_KEY && (process.env.STRIPE_MONTHLY_PRICE_ID || process.env.VITE_STRIPE_MONTHLY_PRICE_ID) && (process.env.STRIPE_ANNUAL_PRICE_ID || process.env.VITE_STRIPE_ANNUAL_PRICE_ID)), detail: "Monthly and annual billing keys." },
      { name: "Stripe webhooks", ok: Boolean(process.env.STRIPE_WEBHOOK_SECRET), detail: process.env.STRIPE_WEBHOOK_SECRET ? "Subscription sync configured." : "Add STRIPE_WEBHOOK_SECRET in Vercel." },
      { name: "Database schema", ok: ["profiles", "projects", "analyses", "subscriptions"].every((table) => schema[table]), detail: "Profiles, projects, analyses, and subscriptions tables." },
    ],
  });
}
