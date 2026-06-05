import { createClient } from "@supabase/supabase-js";

const allowedStatuses = new Set(["active", "trialing"]);
const ownerAdminEmails = [];
const testCustomerEmails = [];

function adminEmails() {
  return [...new Set([
    ...ownerAdminEmails,
    ...String([
      process.env.ADMIN_OWNER_EMAIL,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_EMAILS,
      process.env.OWNER_EMAIL,
      process.env.OPERITRON_ADMIN_EMAILS,
      process.env.VITE_ADMIN_EMAILS,
    ].filter(Boolean).join(","))
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  ])];
}

function bypassCustomerEmails() {
  return [...new Set([
    ...testCustomerEmails,
    ...String([process.env.TEST_CUSTOMER_EMAILS, process.env.VITE_TEST_CUSTOMER_EMAILS].filter(Boolean).join(","))
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  ])];
}

function json(response, status, payload) {
  return response.status(status).json(payload);
}

function serverClients() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey) return {};
  return {
    authClient: createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } }),
    adminClient: serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null,
  };
}

async function ensureProfile(adminClient, user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
}

async function getAccess(adminClient, user) {
  const email = String(user.email || "").toLowerCase();
  const ownerOverride = adminEmails().includes(email);
  const customerOverride = bypassCustomerEmails().includes(email);
  if (!adminClient) return { allowed: ownerOverride || customerOverride, isAdmin: ownerOverride, isTestCustomer: customerOverride, warning: ownerOverride || customerOverride ? "Access override active, but project saving requires Supabase service role configuration." : "" };

  await ensureProfile(adminClient, user);
  if (ownerOverride) {
    await adminClient.from("profiles").update({ role: "admin", updated_at: new Date().toISOString() }).eq("id", user.id);
  }
  const { data: profile, error } = await adminClient.from("profiles").select("subscription_status, role").eq("id", user.id).maybeSingle();
  if (error) throw error;
  const status = profile?.subscription_status;
  const isAdmin = ownerOverride || profile?.role === "admin";
  return { allowed: isAdmin || customerOverride || allowedStatuses.has(status), isAdmin, isTestCustomer: customerOverride, status, role: profile?.role || "user" };
}

function cleanAddress(address) {
  return String(address || "").replace(/\s+/g, " ").trim().slice(0, 220);
}

function pick(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") ?? "";
}

function asArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function resultArray(value) {
  if (Array.isArray(value)) return value;
  return asArray(pick(value?.listings, value?.properties, value?.results, value?.data, value?.records, value));
}

function number(value) {
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function addressParts(record = {}, fallback = "") {
  const formatted = pick(record.formattedAddress, record.addressLine1, record.address, fallback);
  const fallbackState = String(formatted).match(/,\s*([A-Z]{2})\s+\d{5}(?:-\d{4})?\b/)?.[1];
  const state = pick(record.state, record.stateCode, fallbackState);
  const zipCode = pick(record.zipCode, record.zip, String(formatted).match(/\b\d{5}(?:-\d{4})?\b/)?.[0]);
  return { formatted, state, zipCode };
}

function compactComp(comp = {}) {
  return {
    address: pick(comp.formattedAddress, comp.addressLine1, comp.address),
    price: number(pick(comp.price, comp.salePrice, comp.soldPrice, comp.lastSalePrice)),
    rent: number(pick(comp.rent, comp.price, comp.listedRent)),
    date: pick(comp.saleDate, comp.soldDate, comp.lastSaleDate, comp.listedDate),
    distance: pick(comp.distance, comp.distanceMiles),
    beds: pick(comp.bedrooms, comp.beds),
    baths: pick(comp.bathrooms, comp.baths),
    sqft: number(pick(comp.squareFootage, comp.livingArea)),
  };
}

function accessDiagnostics({ email, access = {}, apiKeyExists, lastEndpoint = "", lastStatus = "", lastBody = "" }) {
  const isActive = allowedStatuses.has(access.status);
  return {
    userEmail: email,
    profileRole: access.role || "unknown",
    subscriptionStatus: access.status || "unknown",
    isAdmin: Boolean(access.isAdmin),
    isActive,
    rentcastApiKeyExists: Boolean(apiKeyExists),
    rentcastApiKeyHeader: "X-Api-Key",
    endpoint: lastEndpoint,
    rentcastStatusCode: lastStatus,
    rentcastResponseBody: lastBody,
    adminEnvConfigured: Boolean(adminEmails().length),
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}

function rentcastMessage(path, status, payload, text) {
  const rawMessage = payload?.detail || payload?.message || payload?.error || payload?.errors?.[0]?.message || text || "No response body.";
  const message = String(rawMessage).slice(0, 900);
  if (status === 401) return `${path} returned 401 Unauthorized: ${message}. Verify RENTCAST_API_KEY in Vercel and confirm the key is active.`;
  if (status === 403) return `${path} returned 403 Forbidden: ${message}. This usually means the RentCast plan or key permissions do not include this endpoint.`;
  if (status === 402 || /upgrade|plan|permission|quota|limit/i.test(message)) return `${path} returned ${status}: ${message}. RentCast may require a plan upgrade, endpoint permission, or quota increase.`;
  return `${path} returned ${status}: ${message}`;
}

async function rentcast(path, params, warnings, debug = []) {
  const url = new URL(`https://api.rentcast.io/v1/${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Api-Key": process.env.RENTCAST_API_KEY,
    },
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (_error) {
    warnings.push(`${path} returned an unexpected non-JSON response.`);
  }
  debug.push({
    endpoint: path,
    status: response.status,
    url: `${url.origin}${url.pathname}?${url.searchParams.toString()}`,
    requestHeader: "X-Api-Key",
    body: text.slice(0, 1200),
  });
  if (!response.ok) {
    const message = rentcastMessage(path, response.status, payload, text);
    console.error("[rentcast] Endpoint failed.", {
      path,
      status: response.status,
      statusText: response.statusText,
      body: text.slice(0, 1200),
    });
    warnings.push(message);
    return null;
  }
  return payload;
}

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, 405, { error: "Method not allowed." });

  const { authClient, adminClient } = serverClients();
  if (!authClient) return json(response, 503, { error: "Account services are not configured. Please contact support@operitron.com." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return json(response, 401, { error: "Sign in required." });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return json(response, 401, { error: "Invalid session." });
  const email = String(data.user.email || "").toLowerCase();
  const ownerOverride = adminEmails().includes(email);
  const customerOverride = bypassCustomerEmails().includes(email);
  const wantsDiagnostics = Boolean(request.body?.diagnostics);

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    console.error("[rentcast] Missing RENTCAST_API_KEY.", {
      userId: data.user.id,
      email,
      hasViteRentcastKey: Boolean(process.env.VITE_RENTCAST_API_KEY),
    });
    return json(response, 503, {
      error: ownerOverride
        ? "Missing RENTCAST_API_KEY on the server. Vercel must define RENTCAST_API_KEY, not VITE_RENTCAST_API_KEY."
        : "RentCast API key is missing on the server. Please contact support@operitron.com.",
      adminDebug: ownerOverride ? { expectedEnv: "RENTCAST_API_KEY", viteEnvPresent: Boolean(process.env.VITE_RENTCAST_API_KEY) } : undefined,
    });
  }

  let access;
  try {
    access = await getAccess(adminClient, data.user);
  } catch (error) {
    console.error("[rentcast] Access lookup failed.", { code: error?.code, message: error?.message, userId: data.user.id, email });
    if (ownerOverride || customerOverride) {
      access = {
        allowed: true,
        isAdmin: ownerOverride,
        isTestCustomer: customerOverride,
        warning: `Access override used because profile lookup failed: ${error?.message || "Unknown Supabase error."}`,
      };
    } else {
      return json(response, 503, {
        error: `Access verification failed before RentCast was called: ${error?.message || "Unknown Supabase error."}`,
        supportCode: "rentcast-access-lookup-failed",
        adminDebug: wantsDiagnostics && ownerOverride ? accessDiagnostics({
          email,
          apiKeyExists: Boolean(apiKey),
          access: { role: "lookup failed", status: "lookup failed", isAdmin: false },
          lastEndpoint: "access-check",
          lastStatus: error?.code || "supabase-error",
          lastBody: error?.message || "Unknown Supabase error.",
        }) : undefined,
        adminNote: wantsDiagnostics && ownerOverride ? {
          code: error?.code,
          message: error?.message,
          reason: adminEmails().length
            ? "Supabase profile/subscription lookup failed before access could be verified."
            : "No server admin email environment variable was detected. Set ADMIN_OWNER_EMAIL or ADMIN_EMAILS in Vercel, or set profiles.role='admin' for this user.",
        } : undefined,
      });
    }
  }
  const showDiagnostics = wantsDiagnostics && (ownerOverride || access.isAdmin);
  if (!access.allowed) return json(response, 403, {
    error: "Start your 3-day free trial to access property intelligence.",
    adminDebug: showDiagnostics ? accessDiagnostics({
      email,
      apiKeyExists: Boolean(apiKey),
      access,
      lastEndpoint: "access-check",
      lastStatus: 403,
      lastBody: "User is not active, trialing, test customer, or profile admin.",
    }) : undefined,
    adminNote: showDiagnostics ? {
      reason: ownerOverride
        ? "Admin email matched, but access did not resolve as allowed."
        : "User is not active, trialing, test customer, or profile admin.",
    } : undefined,
  });

  const address = cleanAddress(request.body?.address);
  if (address.length < 6) return json(response, 400, { error: "Enter a complete property address." });

  const warnings = [];
  const debug = [];
  try {
    const properties = await rentcast("properties", { address }, warnings, debug);
    const property = Array.isArray(properties) ? properties[0] : properties;
    const { formatted, state, zipCode } = addressParts(property || {}, address);
    const common = { address: formatted || address, compCount: 10, lookupSubjectAttributes: true };
    const [valueEstimate, rentEstimate, saleListings, rentalListings, marketData] = await Promise.all([
      rentcast("avm/value", common, warnings, debug),
      rentcast("avm/rent/long-term", common, warnings, debug),
      zipCode ? rentcast("listings/sale", { zipCode, state, limit: 10, status: "Active" }, warnings, debug) : Promise.resolve(null),
      zipCode ? rentcast("listings/rental/long-term", { zipCode, state, limit: 10, status: "Active" }, warnings, debug) : Promise.resolve(null),
      zipCode ? rentcast("markets", { zipCode }, warnings, debug) : Promise.resolve(null),
    ]);

    if (!property && !valueEstimate && !rentEstimate) return json(response, 502, {
      error: access.isAdmin
        ? `RentCast returned no usable property, value, or rent data. ${warnings[0] || "See diagnostics for exact provider response."}`.trim()
        : "RentCast returned no usable property, value, or rent data.",
      warnings: [...new Set(warnings)].slice(0, 8),
      adminDebug: showDiagnostics ? accessDiagnostics({
        email,
        apiKeyExists: Boolean(apiKey),
        access,
        lastEndpoint: debug.at(-1)?.url || "rentcast",
        lastStatus: debug.at(-1)?.status || 502,
        lastBody: debug.at(-1)?.body || warnings.join(" | ") || "No usable RentCast data.",
      }) : undefined,
      rentcastDebug: showDiagnostics ? debug : undefined,
    });

    const saleComps = asArray(pick(valueEstimate?.comparables, valueEstimate?.comps, valueEstimate?.comparableProperties)).map(compactComp).filter((comp) => comp.address || comp.price);
    const rentalComps = asArray(pick(rentEstimate?.comparables, rentEstimate?.comps, rentEstimate?.comparableProperties)).map(compactComp).filter((comp) => comp.address || comp.rent);
    const saleMarket = resultArray(saleListings).slice(0, 10).map(compactComp).filter((comp) => comp.address || comp.price);
    const rentalMarket = resultArray(rentalListings).slice(0, 10).map(compactComp).filter((comp) => comp.address || comp.rent);

    return json(response, 200, {
      property: property || { formattedAddress: formatted || address },
      valueEstimate,
      rentEstimate,
      saleComps,
      rentalComps,
      saleMarket,
      rentalMarket,
      marketData,
      warnings: [...new Set(warnings)].slice(0, 6),
      adminDebug: showDiagnostics ? accessDiagnostics({
        email,
        apiKeyExists: Boolean(apiKey),
        access,
        lastEndpoint: debug.at(-1)?.url || "completed",
        lastStatus: debug.at(-1)?.status || 200,
        lastBody: debug.at(-1)?.body || "OK",
      }) : undefined,
      rentcastDebug: showDiagnostics ? debug : undefined,
      accessWarning: access.warning || undefined,
    });
  } catch (error) {
    console.error("[rentcast] Request failed.", { message: error?.message, stack: error?.stack, userId: data.user.id });
    return json(response, 500, {
      error: access.isAdmin ? `Property intelligence could not be loaded: ${error?.message || "Unknown server error."}` : "Property intelligence could not be loaded. Please try again.",
      adminDebug: showDiagnostics ? accessDiagnostics({
        email,
        apiKeyExists: Boolean(apiKey),
        access,
        lastEndpoint: debug.at(-1)?.url || "server-error",
        lastStatus: debug.at(-1)?.status || 500,
        lastBody: debug.at(-1)?.body || error?.message || "Unknown server error.",
      }) : undefined,
      rentcastDebug: showDiagnostics ? debug : undefined,
    });
  }
}
