import { createClient } from "@supabase/supabase-js";
import {
  adminEmails,
  isServiceRoleKey,
  jwtRole,
  stripeAnnualPriceId,
  stripeMonthlyPriceId,
  stripeSecretKey,
  stripeWebhookSecret,
  supabaseServiceKey,
} from "./_server-env.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = supabaseServiceKey();
  const serviceRole = jwtRole(serviceKey);
  const serviceRoleReady = isServiceRoleKey(serviceKey);
  const configuredAdmins = adminEmails();
  const stripeKey = stripeSecretKey();
  const monthlyPrice = stripeMonthlyPriceId();
  const annualPrice = stripeAnnualPriceId();
  const webhookSecret = stripeWebhookSecret();
  if (!url || !anonKey) return response.status(503).json({ error: "Account configuration is incomplete." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return response.status(401).json({ error: "Invalid session." });

  const email = String(data.user.email || "").toLowerCase();
  const ownerOverride = configuredAdmins.includes(email);
  const adminClient = serviceRoleReady ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  let profile = null;
  const schema = {};
  const schemaErrors = {};
  if (adminClient) {
    if (ownerOverride) {
      const upsertResult = await adminClient.from("profiles").upsert({ id: data.user.id, email: data.user.email || "", role: "admin" }, { onConflict: "id" });
      if (upsertResult.error) schemaErrors.profiles_upsert = upsertResult.error.message;
    }
    const profileResult = await adminClient.from("profiles").select("role, subscription_status").eq("id", data.user.id).maybeSingle();
    profile = profileResult.data;
    if (profileResult.error) schemaErrors.profiles_lookup = profileResult.error.message;
    for (const table of ["profiles", "projects", "analyses", "subscriptions"]) {
      const result = await adminClient.from(table).select("*", { count: "exact", head: true });
      schema[table] = !result.error;
      if (result.error) schemaErrors[table] = result.error.message;
    }
  }
  const isAdmin = ownerOverride || profile?.role === "admin";
  if (!isAdmin) return response.status(403).json({ error: "Admin access required." });
  const stripeConfig = [
    { name: "Stripe keys loaded", ok: Boolean(stripeKey), detail: stripeKey ? "STRIPE_SECRET_KEY is available server-side." : "Missing STRIPE_SECRET_KEY." },
    { name: "Monthly price ID loaded", ok: Boolean(monthlyPrice), detail: monthlyPrice ? "Monthly subscription price ID is configured." : "Missing STRIPE_MONTHLY_PRICE_ID or VITE_STRIPE_MONTHLY_PRICE_ID." },
    { name: "Annual price ID loaded", ok: Boolean(annualPrice), detail: annualPrice ? "Annual subscription price ID is configured." : "Missing STRIPE_ANNUAL_PRICE_ID or VITE_STRIPE_ANNUAL_PRICE_ID." },
    { name: "Webhook secret configured", ok: Boolean(webhookSecret), detail: webhookSecret ? "STRIPE_WEBHOOK_SECRET is configured for subscription sync." : "Missing STRIPE_WEBHOOK_SECRET." },
    { name: "Supabase service role configured", ok: serviceRoleReady, detail: serviceRoleReady ? "Server key is present and has service_role permissions." : serviceKey ? `Server key is present but JWT role is "${serviceRole}". Use the Supabase service_role key, not anon.` : "Missing SUPABASE_SERVICE_ROLE_KEY." },
  ];

  return response.status(200).json({
    email,
    role: profile?.role || (ownerOverride ? "owner override" : "user"),
    access: "all_features",
    diagnostics: {
      adminEnvConfigured: Boolean(configuredAdmins.length),
      serviceRoleConfigured: Boolean(serviceKey),
      serviceRoleJwtRole: serviceRole,
      schemaErrors,
    },
    stripeConfig,
    checks: [
      { name: "Owner access", ok: isAdmin, detail: "Authenticated admin bypass is enabled." },
      { name: "Database service key", ok: serviceRoleReady, detail: serviceRoleReady ? "Server-side persistence enabled." : serviceKey ? `Configured key role is "${serviceRole}". Replace it with the Supabase service_role key.` : "Add SUPABASE_SERVICE_ROLE_KEY in Vercel." },
      { name: "Admin database role", ok: profile?.role === "admin", detail: profile?.role === "admin" ? "RLS permits owner workspace writes." : "Apply supabase-admin-access.sql in Supabase." },
      { name: "AI configuration", ok: Boolean(process.env.OPENAI_API_KEY), detail: process.env.OPENAI_API_KEY ? "Server-side AI enabled." : "Add OPENAI_API_KEY in Vercel." },
      { name: "Stripe checkout", ok: Boolean(stripeKey && monthlyPrice && annualPrice), detail: "Monthly and annual billing keys." },
      { name: "Stripe webhooks", ok: Boolean(webhookSecret), detail: webhookSecret ? "Subscription sync configured." : "Add STRIPE_WEBHOOK_SECRET in Vercel." },
      { name: "Database schema", ok: ["profiles", "projects", "analyses", "subscriptions"].every((table) => schema[table]), detail: "Profiles, projects, analyses, and subscriptions tables." },
    ],
  });
}
