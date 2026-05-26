import { createClient } from "@supabase/supabase-js";

const authClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const adminClient = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const allowedStatuses = new Set(["active", "trialing"]);
const ownerAdminEmails = ["tormentor738@gmail.com"];
const recentRequests = new Map();

const numericFields = [
  "purchasePrice", "arv", "rehabBudget", "closingCosts", "holdingCosts", "sellingCosts",
  "taxes", "insurance", "monthlyRent", "expenses", "cashInvested", "loanAmount",
  "interestRate", "loanYears",
];

function adminEmails() {
  return [...new Set([
    ...ownerAdminEmails,
    ...String(process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  ])];
}

async function ensureProfile(user) {
  const { error } = await adminClient.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    console.error("[analysis] Profile setup failed", { code: error.code, message: error.message, userId: user.id });
    throw new Error("profile_setup_failed");
  }
}

function rateLimited(key) {
  const now = Date.now();
  const current = (recentRequests.get(key) || []).filter((timestamp) => now - timestamp < 60000);
  if (current.length >= 8) return true;
  recentRequests.set(key, [...current, now]);
  if (recentRequests.size > 1000) recentRequests.clear();
  return false;
}

function validateInputs(body) {
  const input = {};
  for (const field of numericFields) {
    const value = Number(body[field]);
    if (!Number.isFinite(value) || value < 0 || value > 100000000) {
      throw new Error(`Invalid ${field}.`);
    }
    input[field] = value;
  }
  if (input.interestRate > 50 || input.loanYears > 50) throw new Error("Invalid loan terms.");
  input.notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) : "";
  input.projectId = body.projectId ? Number(body.projectId) : null;
  if (input.projectId !== null && (!Number.isSafeInteger(input.projectId) || input.projectId <= 0)) {
    throw new Error("Invalid projectId.");
  }
  return input;
}

function outputText(payload) {
  return payload.output_text || payload.output?.flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("") || "";
}

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["dealSummary", "investmentScore", "roiAnalysis", "dscrCommentary", "flipRiskAnalysis", "rentalRiskAnalysis", "contractorWarningSigns", "financingConcerns", "recommendedMaxOffer", "nextSteps", "investorRecommendations", "redFlags", "marketCommentary"],
  properties: {
    dealSummary: { type: "string" },
    investmentScore: { type: "integer", minimum: 0, maximum: 100 },
    roiAnalysis: { type: "string" },
    dscrCommentary: { type: "string" },
    flipRiskAnalysis: { type: "array", items: { type: "string" } },
    rentalRiskAnalysis: { type: "array", items: { type: "string" } },
    contractorWarningSigns: { type: "array", items: { type: "string" } },
    financingConcerns: { type: "array", items: { type: "string" } },
    recommendedMaxOffer: { type: "string" },
    nextSteps: { type: "array", items: { type: "string" } },
    investorRecommendations: { type: "array", items: { type: "string" } },
    redFlags: { type: "array", items: { type: "string" } },
    marketCommentary: { type: "string" },
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: "AI analysis is temporarily unavailable." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in required." });
  const { data, error: authError } = await authClient.auth.getUser(token);
  if (authError || !data.user) return response.status(401).json({ error: "Invalid session." });

  const email = String(data.user.email || "").toLowerCase();
  try {
    await ensureProfile(data.user);
  } catch (_error) {
    return response.status(503).json({ error: "Account setup is not ready. Please contact support@operitron.com." });
  }
  const { data: profile, error: profileError } = await adminClient.from("profiles").select("subscription_status, role").eq("id", data.user.id).maybeSingle();
  if (profileError) return response.status(503).json({ error: "Account setup is not ready. Please contact support@operitron.com." });
  const isAdmin = profile?.role === "admin" || adminEmails().includes(email);
  if (!isAdmin && !allowedStatuses.has(profile?.subscription_status)) {
    return response.status(403).json({ error: "Start your 3-day free trial to access AI analysis." });
  }
  if (rateLimited(data.user.id)) return response.status(429).json({ error: "Too many requests. Please wait a minute and try again." });

  let input;
  try {
    input = validateInputs(request.body || {});
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
  if (input.projectId) {
    const { data: ownedProject } = await adminClient.from("projects").select("id").eq("id", input.projectId).eq("user_id", data.user.id).maybeSingle();
    if (!ownedProject) return response.status(400).json({ error: "Project not found." });
  }

  const prompt = [
    "Act as a conservative real estate investment underwriting assistant for Operitron.",
    "Analyze only the supplied assumptions. Do not present estimates as guarantees, legal advice, lending approval, or an appraisal.",
    "Call out missing market verification, comp validation, contractor bids, permits, insurance, taxes, financing and exit-risk checks when relevant.",
    `Inputs: ${JSON.stringify(input)}`,
  ].join("\n");

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "operitron_deal_analysis",
            strict: true,
            schema,
          },
        },
      }),
    });
    const payload = await aiResponse.json();
    if (!aiResponse.ok) return response.status(502).json({ error: "AI analysis could not be generated." });
    const analysis = JSON.parse(outputText(payload));
    const { data: saved, error: saveError } = await adminClient.from("analyses").insert({
      user_id: data.user.id,
      project_id: input.projectId,
      inputs: input,
      analysis,
    }).select("id").single();
    if (saveError) return response.status(500).json({ error: "Analysis generated but could not be saved." });
    return response.status(200).json({ id: saved.id, analysis });
  } catch (_error) {
    return response.status(500).json({ error: "AI analysis could not be generated." });
  }
}
