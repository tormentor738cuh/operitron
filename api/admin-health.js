import {
  isServiceRoleKey,
  jwtRole,
  serverEnvDiagnostics,
  stripeAnnualPriceId,
  stripeMonthlyPriceId,
  stripeSecretKey,
  stripeWebhookSecret,
  supabaseServiceKey,
} from "./_server-env.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed." });
  const serviceKey = supabaseServiceKey();
  const serviceRole = jwtRole(serviceKey);
  const serviceRoleReady = isServiceRoleKey(serviceKey);
  const stripeKey = stripeSecretKey();
  const monthlyPrice = stripeMonthlyPriceId();
  const annualPrice = stripeAnnualPriceId();
  const webhookSecret = stripeWebhookSecret();
  const environment = serverEnvDiagnostics();
  const stripeConfig = [
    { name: "Stripe keys loaded", ok: Boolean(stripeKey), detail: stripeKey ? "STRIPE_SECRET_KEY is available server-side." : "Missing STRIPE_SECRET_KEY." },
    { name: "Monthly price ID loaded", ok: Boolean(monthlyPrice), detail: monthlyPrice ? "Monthly subscription price ID is configured." : "Missing STRIPE_MONTHLY_PRICE_ID or VITE_STRIPE_MONTHLY_PRICE_ID." },
    { name: "Annual price ID loaded", ok: Boolean(annualPrice), detail: annualPrice ? "Annual subscription price ID is configured." : "Missing STRIPE_ANNUAL_PRICE_ID or VITE_STRIPE_ANNUAL_PRICE_ID." },
    { name: "Webhook secret configured", ok: Boolean(webhookSecret), detail: webhookSecret ? "STRIPE_WEBHOOK_SECRET is configured for subscription sync." : "Missing STRIPE_WEBHOOK_SECRET." },
    { name: "Supabase service role configured", ok: serviceRoleReady, detail: serviceRoleReady ? "Server key is present and has service_role permissions." : serviceKey ? `Server key is present but JWT role is "${serviceRole}". Use the Supabase service_role key, not anon.` : "Missing SUPABASE_SERVICE_ROLE_KEY." },
  ];

  return response.status(200).json({
    mode: "read_only_environment_diagnostics",
    diagnostics: {
      serviceRoleConfigured: Boolean(serviceKey),
      serviceRoleJwtRole: serviceRole,
      environment,
    },
    stripeConfig,
    checks: [
      { name: "Supabase URL", ok: Boolean(process.env.VITE_SUPABASE_URL), detail: process.env.VITE_SUPABASE_URL ? "VITE_SUPABASE_URL is visible to this serverless function." : "Missing VITE_SUPABASE_URL." },
      { name: "Supabase anon key", ok: Boolean(process.env.VITE_SUPABASE_ANON_KEY), detail: process.env.VITE_SUPABASE_ANON_KEY ? "VITE_SUPABASE_ANON_KEY is visible to this serverless function." : "Missing VITE_SUPABASE_ANON_KEY." },
      { name: "Database service key", ok: serviceRoleReady, detail: serviceRoleReady ? "SUPABASE_SERVICE_ROLE_KEY is visible and has service_role permissions." : serviceKey ? `Configured key role is "${serviceRole}".` : "Missing SUPABASE_SERVICE_ROLE_KEY or accepted alias." },
      { name: "AI configuration", ok: Boolean(process.env.OPENAI_API_KEY), detail: process.env.OPENAI_API_KEY ? "Server-side AI enabled." : "Add OPENAI_API_KEY in Vercel." },
      { name: "Stripe checkout", ok: Boolean(stripeKey && monthlyPrice && annualPrice), detail: "Monthly and annual billing keys." },
      { name: "Stripe webhooks", ok: Boolean(webhookSecret), detail: webhookSecret ? "Subscription sync configured." : "Add STRIPE_WEBHOOK_SECRET in Vercel." },
      { name: "RentCast API key", ok: Boolean(process.env.RENTCAST_API_KEY), detail: process.env.RENTCAST_API_KEY ? "RENTCAST_API_KEY is visible to this serverless function." : "Missing RENTCAST_API_KEY." },
    ],
  });
}
