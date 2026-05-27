import { createClient } from "@supabase/supabase-js";

const allowedStatuses = new Set(["active", "trialing"]);
const ownerAdminEmails = ["tormentor738@gmail.com"];

function adminEmails() {
  return [...new Set([
    ...ownerAdminEmails,
    ...String(process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "")
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
  if (!adminClient) return { allowed: ownerOverride, isAdmin: ownerOverride, warning: ownerOverride ? "Owner access active, but project saving requires Supabase service role configuration." : "" };

  await ensureProfile(adminClient, user);
  if (ownerOverride) {
    await adminClient.from("profiles").update({ role: "admin", updated_at: new Date().toISOString() }).eq("id", user.id);
  }
  const { data: profile, error } = await adminClient.from("profiles").select("subscription_status, role").eq("id", user.id).maybeSingle();
  if (error) throw error;
  const isAdmin = ownerOverride || profile?.role === "admin";
  return { allowed: isAdmin || allowedStatuses.has(profile?.subscription_status), isAdmin };
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

function number(value) {
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function addressParts(record = {}, fallback = "") {
  const formatted = pick(record.formattedAddress, record.addressLine1, record.address, fallback);
  const state = pick(record.state, record.stateCode);
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

async function rentcast(path, params, warnings) {
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
    warnings.push(`${path} returned an unexpected response.`);
  }
  if (!response.ok) {
    const message = payload?.message || payload?.error || `${path} failed (${response.status})`;
    warnings.push(message);
    return null;
  }
  return payload;
}

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, 405, { error: "Method not allowed." });

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return json(response, 503, { error: "Property data is temporarily unavailable. Please contact support@operitron.com." });

  const { authClient, adminClient } = serverClients();
  if (!authClient) return json(response, 503, { error: "Account services are not configured. Please contact support@operitron.com." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return json(response, 401, { error: "Sign in required." });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return json(response, 401, { error: "Invalid session." });

  let access;
  try {
    access = await getAccess(adminClient, data.user);
  } catch (error) {
    console.error("[rentcast] Access lookup failed.", { code: error?.code, message: error?.message, userId: data.user.id });
    return json(response, 503, { error: "Account setup is not ready. Please contact support@operitron.com." });
  }
  if (!access.allowed) return json(response, 403, { error: "Start your 3-day free trial to access property intelligence." });

  const address = cleanAddress(request.body?.address);
  if (address.length < 6) return json(response, 400, { error: "Enter a complete property address." });

  const warnings = [];
  try {
    const properties = await rentcast("properties", { address, limit: 1 }, warnings);
    const property = Array.isArray(properties) ? properties[0] : properties;
    if (!property) return json(response, 404, { error: "No property record found for that address.", warnings });

    const { formatted, state, zipCode } = addressParts(property, address);
    const common = { address: formatted || address, compCount: 10, lookupSubjectAttributes: true };
    const [valueEstimate, rentEstimate, saleListings, rentalListings, marketData] = await Promise.all([
      rentcast("avm/value", common, warnings),
      rentcast("avm/rent/long-term", common, warnings),
      rentcast("listings/sale", { zipCode, state, limit: 10, status: "Active" }, warnings),
      rentcast("listings/rental/long-term", { zipCode, state, limit: 10, status: "Active" }, warnings),
      zipCode ? rentcast("markets", { zipCode }, warnings) : Promise.resolve(null),
    ]);

    const saleComps = asArray(pick(valueEstimate?.comparables, valueEstimate?.comps, valueEstimate?.comparableProperties)).map(compactComp).filter((comp) => comp.address || comp.price);
    const rentalComps = asArray(pick(rentEstimate?.comparables, rentEstimate?.comps, rentEstimate?.comparableProperties)).map(compactComp).filter((comp) => comp.address || comp.rent);
    const saleMarket = asArray(saleListings).slice(0, 10).map(compactComp).filter((comp) => comp.address || comp.price);
    const rentalMarket = asArray(rentalListings).slice(0, 10).map(compactComp).filter((comp) => comp.address || comp.rent);

    return json(response, 200, {
      property,
      valueEstimate,
      rentEstimate,
      saleComps,
      rentalComps,
      saleMarket,
      rentalMarket,
      marketData,
      warnings: [...new Set(warnings)].slice(0, 6),
      accessWarning: access.warning || undefined,
    });
  } catch (error) {
    console.error("[rentcast] Request failed.", { message: error?.message, userId: data.user.id });
    return json(response, 500, { error: "Property intelligence could not be loaded. Please try again." });
  }
}
