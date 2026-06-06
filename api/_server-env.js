export function envValue(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function listEnv(...names) {
  return [...new Set(envValue(...names)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean))];
}

export function adminEmails() {
  return listEnv(
    "ADMIN_OWNER_EMAIL",
    "ADMIN_EMAIL",
    "ADMIN_EMAILS",
    "OWNER_EMAIL",
    "OPERITRON_ADMIN_EMAILS",
    "VITE_ADMIN_EMAILS",
  );
}

export function testCustomerEmails() {
  return listEnv("TEST_CUSTOMER_EMAILS", "VITE_TEST_CUSTOMER_EMAILS");
}

export function supabaseServiceKey() {
  return envValue(
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SERVICE_KEY",
    "SUPABASE_SERVICE_ROLE",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_SERVICE_ROLE_JWT",
  );
}

export function stripeSecretKey() {
  return envValue("STRIPE_SECRET_KEY");
}

export function stripeMonthlyPriceId() {
  return envValue("STRIPE_MONTHLY_PRICE_ID", "VITE_STRIPE_MONTHLY_PRICE_ID", "STRIPE_PRICE_MONTHLY");
}

export function stripeAnnualPriceId() {
  return envValue("STRIPE_ANNUAL_PRICE_ID", "VITE_STRIPE_ANNUAL_PRICE_ID", "STRIPE_PRICE_ANNUAL");
}

export function stripeWebhookSecret() {
  return envValue("STRIPE_WEBHOOK_SECRET");
}

export function jwtRole(token) {
  try {
    const payload = JSON.parse(Buffer.from(String(token || "").split(".")[1] || "", "base64url").toString("utf8"));
    return payload.role || "unknown";
  } catch (_error) {
    return token ? "unreadable" : "missing";
  }
}

export function isServiceRoleKey(token) {
  return Boolean(token && jwtRole(token) === "service_role");
}

export function userHasAdminMetadata(user = {}) {
  const appRole = String(user.app_metadata?.role || user.app_metadata?.user_role || "").toLowerCase();
  const userRole = String(user.user_metadata?.role || user.user_metadata?.user_role || "").toLowerCase();
  const appAdmin = user.app_metadata?.is_admin === true || user.app_metadata?.admin === true;
  const userAdmin = user.user_metadata?.is_admin === true || user.user_metadata?.admin === true;
  return appRole === "admin" || userRole === "admin" || appAdmin || userAdmin;
}
