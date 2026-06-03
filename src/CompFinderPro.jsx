import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  Calculator,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  Copy,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Globe2,
  Hammer,
  HelpCircle,
  Home,

  Layers,
  LineChart,
  ListChecks,
  LogOut,
  MapPin,
  Mail,
  Maximize2,
  Menu,
  Mic,
  MoreVertical,
  MousePointer2,
  Move,
  Phone,
  PlayCircle,
  Plus,
  Printer,
  Ruler,
  Save,
  Search,
  Settings,
  Share2,
  Sparkles,
  StickyNote,
  Trash2,
  Undo2,
  Upload,
  UserCircle,
  Users,
  WalletCards,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: { detectSessionInUrl: true, persistSession: true, autoRefreshToken: true },
}) : null;
const checkoutEndpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT || "/api/create-checkout-session";
const portalEndpoint = import.meta.env.VITE_STRIPE_PORTAL_ENDPOINT || "/api/create-billing-portal";
const productionUrl = (import.meta.env.VITE_APP_URL || "https://operitron.com").replace(/\/+$/, "");
const ownerAdminEmails = ["tormentor738@gmail.com"];
const testCustomerEmails = ["gamuelgotgame@gmail.com"];
const adminEmails = [...new Set([
  ...ownerAdminEmails,
  ...String(import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
])];
const customerBypassEmails = [...new Set([
  ...testCustomerEmails,
  ...String(import.meta.env.VITE_TEST_CUSTOMER_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
])];
const LazyAIAnalyzerPanel = lazy(() => import("./AIAnalyzerPanel.jsx"));

const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID;
const googleAdsLabels = {
  signup: import.meta.env.VITE_GOOGLE_ADS_SIGNUP_LABEL,
  trialStarted: import.meta.env.VITE_GOOGLE_ADS_TRIAL_LABEL,
  subscriptionStarted: import.meta.env.VITE_GOOGLE_ADS_SUBSCRIPTION_LABEL,
  checkoutCompleted: import.meta.env.VITE_GOOGLE_ADS_CHECKOUT_LABEL,
};

function trackGoogleAdsConversion(name) {
  const label = googleAdsLabels[name];
  if (!googleAdsId || !label || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: `${googleAdsId}/${label}` });
}

async function readApiJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    return { error: "A server error occurred. Please try again or contact support@operitron.com." };
  }
}

function subscriptionPlanLabel(plan, language) {
  const normalized = String(plan || "").trim().toLowerCase();
  if (normalized === "monthly") return language === "es" ? "Mensual" : "Monthly";
  if (normalized === "annual") return language === "es" ? "Anual" : "Annual";
  if (["no subscription", "inactive", ""].includes(normalized)) return language === "es" ? "Sin suscripción" : "No subscription";
  if (normalized === "subscribed") return language === "es" ? "Suscripción activa" : "Active subscription";
  return plan;
}

const articlePages = new Set(["brrrCalculator", "dscrLoans", "constructionBudgets", "fixFlipAnalysis", "airbnbRoi", "houseBuildCosts", "framingTimelines"]);
const publicPages = new Set(["home", "pricing", "settings", "privacy", "terms", "refund", "disclaimer", ...articlePages]);
const pagePaths = {
  home: "/",
  brrrCalculator: "/brrr-calculator",
  dscrLoans: "/dscr-loans",
  constructionBudgets: "/construction-budgets",
  fixFlipAnalysis: "/fix-and-flip-analysis",
  airbnbRoi: "/airbnb-roi",
  houseBuildCosts: "/house-build-costs",
  framingTimelines: "/framing-timelines",
  dashboard: "/dashboard",
  pricing: "/pricing",
  settings: "/login",
  profile: "/profile",
  projectTools: "/project-tools",
  projectDetails: "/project",
  propertySearch: "/property-search",
  dropbox: "/dropbox",
  learning: "/learning-center",
  knowledge: "/knowledge-base",
  tutorials: "/tutorials",
  tours: "/tours",
  admin: "/owner-console",
  privacy: "/privacy-policy",
  terms: "/terms-of-service",
  refund: "/refund-policy",
  disclaimer: "/disclaimer",
};
const pathPages = Object.fromEntries(Object.entries(pagePaths).map(([page, path]) => [path, page]));
const getPageFromPath = () => pathPages[window.location.pathname.replace(/\/+$/, "") || "/"] || "home";

const seoArticles = {
  brrrCalculator: {
    category: "BRRR Strategy",
    title: "BRRR Calculator: How to Calculate ROI, Refinance Proceeds, and Cash Left in a Deal",
    description: "Learn how to calculate BRRR ROI, equity captured, refinance proceeds, cash left in the deal, DSCR, and monthly cash flow before you buy.",
    readTime: "9 min read",
    icon: WalletCards,
    keywords: ["BRRR calculator", "BRRR ROI", "cash-out refinance", "rental cash flow"],
    intro: "A BRRR deal only works when the numbers survive every phase: buy, rehab, rent, refinance, and repeat. The goal is not just to create equity. The goal is to know how much cash stays trapped in the project, whether the refinance supports the debt, and whether the property still cash flows after the dust settles.",
    formulaBlocks: [
      ["Equity Captured", "New Appraised Value - Total Project Cost"],
      ["Cash Left in Deal", "Cash Invested - Refinance Cash Returned"],
      ["Cash-on-Cash Return", "Annual Cash Flow / Cash Left in Deal"],
      ["DSCR", "Net Operating Income / Annual Debt Service"],
    ],
    sections: [
      ["The BRRR inputs that matter", "Start with purchase price, rehab budget, closing costs, holding costs, projected rent, taxes, insurance, vacancy, repairs, property management, refinance LTV, interest rate, and loan term. If any one of these is guessed too optimistically, the repeat part of BRRR gets harder."],
      ["How to think about refinance proceeds", "Most investors model the refinance as a percentage of the new appraised value. For example, a 75% refinance on a $300,000 appraisal produces a $225,000 loan. That does not mean you receive $225,000 in cash. You must subtract the existing debt payoff, closing costs, reserves, and any lender holdbacks."],
      ["What a good BRRR result looks like", "A strong BRRR often returns most or all invested cash while leaving positive monthly cash flow and a DSCR that lenders can support. A weak BRRR may show profit on paper but trap too much cash or create thin coverage after debt service."],
    ],
    checklist: ["Verify ARV with sold comps, not wishful listings.", "Stress-test refinance value at 70%, 75%, and 80% LTV.", "Include vacancy, repairs, management, taxes, insurance, and reserves.", "Confirm lender DSCR and seasoning requirements before closing.", "Compare cash left in deal against your next acquisition goal."],
    cta: "Run BRRR, DSCR, and cash-out assumptions inside Operitron before you commit capital.",
  },
  dscrLoans: {
    category: "Financing",
    title: "DSCR Loans: How Investors Calculate Debt-Service Coverage Before Applying",
    description: "Understand DSCR loan calculations, rental income coverage, lender thresholds, and how to improve a deal before sending it to a lender.",
    readTime: "8 min read",
    icon: Calculator,
    keywords: ["DSCR loans", "DSCR calculator", "rental property loan", "debt service coverage"],
    intro: "A DSCR loan is built around the income of the property instead of traditional borrower income. That makes it powerful for investors, but it also means one number can make or break the deal: the debt-service coverage ratio.",
    formulaBlocks: [
      ["DSCR", "Net Operating Income / Annual Debt Service"],
      ["NOI", "Annual Rent - Operating Expenses"],
      ["Annual Debt Service", "Monthly Principal and Interest x 12"],
      ["Monthly Mortgage Payment", "Loan amortization using rate, term, and balance"],
    ],
    sections: [
      ["What lenders are measuring", "DSCR tells a lender whether the rental income can support the debt. A DSCR of 1.00 means the property breaks even before reserves. Many lenders prefer 1.15 to 1.25 or higher, depending on asset type, borrower profile, market, and loan structure."],
      ["Expenses investors often miss", "Taxes, insurance, HOA, repairs, vacancy, management, utilities, and reserves all affect DSCR. If you only subtract the mortgage payment from rent, you are not underwriting the same way a lender will."],
      ["How to improve DSCR", "Lower the purchase price, increase the down payment, negotiate seller credits, reduce insurance costs, improve rent, or choose a loan structure with a lower payment. Each option changes both risk and return."],
    ],
    checklist: ["Use market rent, not best-case rent.", "Confirm taxes after sale or reassessment.", "Quote insurance before final underwriting.", "Model DSCR at multiple interest rates.", "Keep reserves for vacancy and repairs."],
    cta: "Use Operitron's investment loan calculator to compare DSCR, cash-out, and construction loan scenarios.",
  },
  constructionBudgets: {
    category: "Construction",
    title: "Construction Budgets: How Investors Build a Reliable Scope, Contingency, and Cost Tracker",
    description: "A practical guide to construction budgeting for investors, builders, and developers managing rehabs or ground-up projects.",
    readTime: "10 min read",
    icon: Hammer,
    keywords: ["construction budget", "rehab budget", "construction cost tracker", "builder budget"],
    intro: "A construction budget is more than a list of prices. It is a control system for scope, bids, change orders, contingency, timing, and cash requirements. Good budgets prevent small misses from becoming deal-killing surprises.",
    formulaBlocks: [
      ["Total Project Cost", "Purchase/Land + Hard Costs + Soft Costs + Financing + Holding + Selling"],
      ["Contingency", "Direct Construction Cost x 10% to 20%"],
      ["Cost per Sq Ft", "Construction Cost / Finished Square Footage"],
      ["Budget Variance", "Actual Cost - Original Budget"],
    ],
    sections: [
      ["Separate hard costs and soft costs", "Hard costs include labor and materials. Soft costs include permits, surveys, engineering, design, insurance, utilities, lender fees, and professional services. Mixing them together makes it harder to see what is actually moving."],
      ["Use bid comparison, not one quote", "A single quote tells you what one contractor wants to charge. A bid comparison tells you where scope is missing, where allowances are thin, and where one subcontractor is including something another excluded."],
      ["Track committed, spent, and remaining", "The budget should show original budget, approved quote, amount paid, remaining commitment, change orders, and contingency used. Investors need a real-time view of where the project stands."],
    ],
    checklist: ["Create categories before collecting bids.", "Require written scopes from every subcontractor.", "Add contingency before judging profitability.", "Track change orders separately.", "Review budget variance weekly."],
    cta: "Build a cleaner construction budget in Operitron with quotes, takeoffs, linked files, and project tools in one workspace.",
  },
  fixFlipAnalysis: {
    category: "Deal Analysis",
    title: "Fix and Flip Analysis: How to Calculate Profit, ROI, Max Offer, and Risk",
    description: "Learn the core fix-and-flip formulas investors use to estimate ARV, rehab costs, holding costs, selling costs, profit, ROI, and max offer.",
    readTime: "8 min read",
    icon: LineChart,
    keywords: ["fix and flip analysis", "flip calculator", "70 percent rule", "max offer"],
    intro: "Fix-and-flip analysis is a speed game and a risk game. You need to screen deals quickly, but you also need enough discipline to avoid buying a property where rehab, timeline, or resale assumptions are doing all the heavy lifting.",
    formulaBlocks: [
      ["Profit", "ARV - Purchase Price - Rehab - Closing - Holding - Selling"],
      ["ROI", "Profit / Total Cash or Total Cost"],
      ["70% Rule Max Offer", "ARV x 70% - Repairs"],
      ["Price per Sq Ft", "Sale Price / Square Footage"],
    ],
    sections: [
      ["Start with ARV, then attack it", "ARV should come from nearby, recent, similar sold comps. The best investors try to disprove their ARV before they trust it. Listings, old sales, and oversized comps can make a deal look better than it is."],
      ["Rehab budget needs a scope", "A rehab number without scope is just a guess. Break repairs into trades: demo, framing, electrical, plumbing, HVAC, roofing, windows, drywall, paint, flooring, cabinets, countertops, exterior, landscaping, permits, and cleanup."],
      ["Holding and selling costs are real", "Taxes, utilities, insurance, interest, staging, agent commissions, seller credits, closing costs, and extra months can erase a deal. Model time honestly."],
    ],
    checklist: ["Use sold comps inside the same buyer pool.", "Add resale fees and seller concessions.", "Stress-test the timeline by 30 to 60 days.", "Get contractor bids before hard money draws begin.", "Set a minimum profit target before negotiating."],
    cta: "Use Operitron's deal underwriter to calculate profit, ROI, 70% rule, and max offer before making an offer.",
  },
  airbnbRoi: {
    category: "Short-Term Rentals",
    title: "Airbnb ROI: How to Calculate Short-Term Rental Cash Flow Before Buying",
    description: "Learn how to estimate Airbnb ROI using revenue, occupancy, expenses, furnishing costs, debt service, cash invested, and seasonality.",
    readTime: "9 min read",
    icon: Home,
    keywords: ["Airbnb ROI", "short term rental calculator", "STR cash flow", "vacation rental return"],
    intro: "Airbnb ROI can look incredible when investors use peak-season revenue and forget the operational costs. A durable short-term rental analysis must include occupancy swings, cleaning, supplies, utilities, platform fees, furnishings, maintenance, local taxes, and regulation risk.",
    formulaBlocks: [
      ["Gross Revenue", "Average Daily Rate x Occupied Nights"],
      ["NOI", "Gross Revenue - Operating Expenses"],
      ["Cash Flow", "NOI - Annual Debt Service"],
      ["Cash-on-Cash Return", "Annual Cash Flow / Cash Invested"],
    ],
    sections: [
      ["Revenue is not just ADR", "Average daily rate matters, but occupancy and seasonality matter just as much. Model conservative, base, and strong cases so you understand downside risk."],
      ["Operating costs are higher than long-term rentals", "Short-term rentals often include utilities, internet, furniture replacement, cleaning coordination, supplies, platform fees, local occupancy taxes, licensing, landscaping, pool service, and higher maintenance."],
      ["Regulation can change the deal", "City rules, HOA restrictions, permit caps, insurance requirements, and tax registration can change whether the property can legally operate as planned."],
    ],
    checklist: ["Confirm zoning, HOA, and permit rules.", "Model occupancy by season.", "Include furniture and replacement reserves.", "Quote short-term-rental insurance.", "Compare STR returns against long-term rent fallback."],
    cta: "Use Operitron to compare rental cash flow, debt service, reserves, and investor return before buying an Airbnb-style property.",
  },
  houseBuildCosts: {
    category: "Ground-Up Construction",
    title: "House Build Costs: What Investors Should Include Before Starting a New Construction Project",
    description: "Understand house build costs from land and site work to foundation, framing, MEP, finishes, soft costs, financing, and contingency.",
    readTime: "11 min read",
    icon: Building2,
    keywords: ["house build costs", "cost to build a house", "new construction budget", "ground up construction"],
    intro: "The cost to build a house is not just sticks, bricks, and labor. Investors need to model land, site work, utilities, foundation, framing, roofing, MEP systems, finishes, permits, insurance, engineering, financing, carrying costs, and contingency.",
    formulaBlocks: [
      ["All-In Build Cost", "Land + Site Work + Hard Costs + Soft Costs + Financing + Contingency"],
      ["Cost per Sq Ft", "Total Build Cost / Finished Sq Ft"],
      ["Interest Reserve", "Expected Construction Interest x Safety Buffer"],
      ["Projected Profit", "Sale Price or ARV - All-In Build Cost"],
    ],
    sections: [
      ["Site work can surprise new builders", "Clearing, grading, fill, drainage, driveway, utilities, septic, well, erosion control, and retaining walls can change the budget before the house even comes out of the ground."],
      ["Finish level drives the spread", "Basic, upgraded, and luxury finishes can create very different budgets for cabinets, flooring, tile, fixtures, appliances, trim, exterior materials, windows, doors, and landscaping."],
      ["Soft costs deserve their own line items", "Plans, engineering, surveys, permits, utility taps, builder risk insurance, legal, accounting, lender fees, appraisal, inspections, and project management all belong in the budget."],
    ],
    checklist: ["Confirm utility availability before buying land.", "Price site work separately from vertical construction.", "Choose finish level before collecting bids.", "Add contingency for unknown conditions.", "Model construction interest and sale time."],
    cta: "Use Operitron's construction wizard and budget estimator to turn build assumptions into a project checklist and cost model.",
  },
  framingTimelines: {
    category: "Project Management",
    title: "Framing Timelines: How Long Wood Framing Takes and What Delays a Build",
    description: "Learn how framing timelines work, what needs to happen before framing starts, and how truss, lumber, inspection, and weather delays affect a build.",
    readTime: "7 min read",
    icon: Layers,
    keywords: ["framing timeline", "wood framing schedule", "construction timeline", "roof truss lead time"],
    intro: "Framing is one of the most visible phases of construction, but the timeline depends on decisions made weeks earlier. Slab cure, lumber delivery, truss lead times, framing crew availability, weather, inspections, and plan changes all shape how fast the structure goes vertical.",
    formulaBlocks: [
      ["Framing Duration", "Crew Productivity x House Complexity x Weather/Inspection Buffer"],
      ["Dry-In Path", "Foundation -> Framing -> Trusses -> Sheathing -> Roofing"],
      ["Lead-Time Risk", "Order Date vs Required Install Date"],
      ["Schedule Buffer", "Base Duration + Weather + Inspection + Material Delay"],
    ],
    sections: [
      ["What must happen before framing", "The foundation needs to be complete, cured, inspected, and ready. Anchor bolts, slab dimensions, underground utilities, and lumber delivery need to line up before the crew arrives."],
      ["Trusses are a critical order", "Roof trusses often require engineering and can have multi-week lead times. Waiting to order trusses until framing starts can delay dry-in and expose the project to weather risk."],
      ["Complexity changes productivity", "A simple rectangle frames faster than a custom design with multiple rooflines, tall walls, balconies, steel beams, or unusual window and door layouts."],
    ],
    checklist: ["Order trusses before the framing crew needs them.", "Verify rough openings before window and door delivery.", "Confirm lumber package completeness.", "Schedule inspections early.", "Track weather risk during framing and dry-in."],
    cta: "Use Operitron's construction progress tools to track framing tasks, critical orders, risk alerts, and schedule dependencies.",
  },
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
const formatMoneyCents = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatNumber = (value, digits = 2) =>
  Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: digits });

const cleanNumber = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  const negative = raw.includes("-") ? "-" : "";
  const cleaned = raw.replace(/,/g, "").replace(/[^0-9.]/g, "");
  const [whole, ...decimalParts] = cleaned.split(".");
  const normalized = `${negative}${whole || "0"}${decimalParts.length ? `.${decimalParts.join("")}` : ""}`;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
};
const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") ?? "";
const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const formulas = {
  arv: (comps) => {
    const valid = comps.map(Number).filter(Boolean);
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
  },
  cashFlow: (income, expenses) => cleanNumber(income) - cleanNumber(expenses),
  noi: (grossIncome, operatingExpenses) => cleanNumber(grossIncome) - cleanNumber(operatingExpenses),
  roi: (profit, totalCost) => (totalCost ? (profit / totalCost) * 100 : 0),
  profit: (salePrice, purchase, repairs, closingCosts = 0, holdingCosts = 0, sellingCosts = 0) =>
    cleanNumber(salePrice) - cleanNumber(purchase) - cleanNumber(repairs) - cleanNumber(closingCosts) - cleanNumber(holdingCosts) - cleanNumber(sellingCosts),
  maxOffer70: (arv, repairs) => cleanNumber(arv) * 0.7 - cleanNumber(repairs),
  monthlyMortgage: (loan, annualRate, years) => {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (!loan || !n) return 0;
    return r ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
  },
  capRate: (noi, purchasePrice) => (purchasePrice ? (noi / purchasePrice) * 100 : 0),
  cashOnCash: (annualCashFlow, cashInvested) => (cashInvested ? (annualCashFlow / cashInvested) * 100 : 0),
  dscr: (noi, annualDebtService) => (annualDebtService ? noi / annualDebtService : 0),
  onePercentRule: (monthlyRent, purchasePrice) => cleanNumber(monthlyRent) >= cleanNumber(purchasePrice) * 0.01,
  costPerSqft: (totalBuildCost, squareFeet) => (squareFeet ? totalBuildCost / squareFeet : 0),
  buildCost: (squareFeet, costPerSqft) => cleanNumber(squareFeet) * cleanNumber(costPerSqft),
  concreteYards: (length, width, thicknessFeet) => (cleanNumber(length) * cleanNumber(width) * cleanNumber(thicknessFeet)) / 27,
  roofingSquares: (roofArea) => cleanNumber(roofArea) / 100,
  framingLinearFeet: (wallLength, studSpacingFeet) => (studSpacingFeet ? cleanNumber(wallLength) / cleanNumber(studSpacingFeet) : 0),
  drywallSheets: (wallArea, sheetArea = 32) => (sheetArea ? cleanNumber(wallArea) / cleanNumber(sheetArea) : 0),
  paintGallons: (wallArea, coverage = 350) => (coverage ? cleanNumber(wallArea) / cleanNumber(coverage) : 0),
  tileCount: (area, tileArea) => (tileArea ? cleanNumber(area) / cleanNumber(tileArea) : 0),
  occupancyRate: (bookedNights, availableNights) => (availableNights ? (bookedNights / availableNights) * 100 : 0),
  adr: (revenue, bookedNights) => (bookedNights ? revenue / bookedNights : 0),
  revPar: (adr, occupancyRate) => cleanNumber(adr) * (cleanNumber(occupancyRate) / 100),
  annualRevenue: (adr, occupancyRate) => cleanNumber(adr) * (cleanNumber(occupancyRate) / 100) * 365,
  ltv: (loanAmount, propertyValue) => (propertyValue ? (loanAmount / propertyValue) * 100 : 0),
  dti: (monthlyDebt, monthlyIncome) => (monthlyIncome ? (monthlyDebt / monthlyIncome) * 100 : 0),
  lotCoverage: (buildingFootprint, lotSize) => (lotSize ? (buildingFootprint / lotSize) * 100 : 0),
  profitMargin: (profit, revenue) => (revenue ? (profit / revenue) * 100 : 0),
  pricePerAcre: (purchasePrice, acres) => (acres ? purchasePrice / acres : 0),
  pricePerLot: (landCost, lots) => (lots ? landCost / lots : 0),
  density: (units, acres) => (acres ? units / acres : 0),
  grm: (propertyPrice, annualRent) => (annualRent ? propertyPrice / annualRent : 0),
  rentToValue: (monthlyRent, propertyValue) => (propertyValue ? (monthlyRent / propertyValue) * 100 : 0),
  expenseRatio: (operatingExpenses, grossIncome) => (grossIncome ? (operatingExpenses / grossIncome) * 100 : 0),
  equity: (propertyValue, loanBalance) => cleanNumber(propertyValue) - cleanNumber(loanBalance),
  interestCost: (monthlyPayment, numberOfPayments, principal) => cleanNumber(monthlyPayment) * cleanNumber(numberOfPayments) - cleanNumber(principal),
  refinanceCashOut: (newLoan, currentBalance) => cleanNumber(newLoan) - cleanNumber(currentBalance),
  breakEvenOccupancy: (annualExpenses, adr) => (adr ? (annualExpenses / (adr * 365)) * 100 : 0),
  cac: (marketingSpend, customersAcquired) => (customersAcquired ? marketingSpend / customersAcquired : 0),
  ltvCac: (lifetimeValue, acquisitionCost) => (acquisitionCost ? lifetimeValue / acquisitionCost : 0),
  ruleOf72: (interestRate) => (interestRate ? 72 / interestRate : 0),
};

const copy = {
  en: {
    dashboard: "Dashboard",
    projectTools: "Project Tools",
    propertySearch: "Property Search",
    learning: "Learning Center",
    knowledge: "Investor Knowledge Base",
    tutorials: "Tutorials",
    tours: "Tours",
    dropbox: "Dropbox",
    pricing: "Pricing",
    settings: "Settings",
    profile: "Profile",
    startTrial: "Start 3-Day Free Trial",
    command: "AI Real Estate Operating System",
    welcome: "Welcome back, Brandon",
    savedProjects: "Saved Projects",
    projectedProfit: "Projected Profit",
    reportsReady: "Reports Ready",
    newAnalysis: "New Analysis",
    openProject: "Open Project",
    createProject: "Create Project",
    quickTools: "Quick Tools",
    trialNote: "3-day free trial. Cancel anytime.",
    comingSoon: "Coming Soon",
    back: "Back",
  },
  es: {
    dashboard: "Panel",
    projectTools: "Herramientas",
    propertySearch: "Búsqueda de Propiedad",
    learning: "Centro de Aprendizaje",
    knowledge: "Base de Conocimiento",
    tutorials: "Tutoriales",
    tours: "Recorridos",
    dropbox: "Dropbox",
    pricing: "Precios",
    settings: "Configuración",
    profile: "Perfil",
    startTrial: "Iniciar prueba gratis de 3 días",
    command: "AI Real Estate Operating System",
    welcome: "Bienvenido, Brandon",
    savedProjects: "Proyectos Guardados",
    projectedProfit: "Ganancia Proyectada",
    reportsReady: "Reportes Listos",
    newAnalysis: "Nuevo Análisis",
    openProject: "Abrir Proyecto",
    createProject: "Crear Proyecto",
    quickTools: "Herramientas Rápidas",
    trialNote: "Prueba gratis de 3 días. Cancela cuando quieras.",
    comingSoon: "Próximamente",
    back: "Volver",
  },
};

const enhancedCopy = {
  en: {
    ...copy.en,
    brand: "OPERITRON.COM",
    privacy: "Privacy Policy",
    terms: "Terms",
    refund: "Refund Policy",
    disclaimer: "Disclaimer",
    earlyAccess: "Early Access",
    earlyAccessText: "3-day free trial for investors, builders, and operators.",
    myProjects: "My Projects",
    projectHint: "Click any project to open tools, calculations, and linked records.",
    createProjectHint: "Create a deal, build, flip, rental, or construction workspace.",
    projectName: "Project name",
    propertyAddress: "Property address",
    addProject: "Add Project",
    heroTitle: "One original workspace for deal analysis, property records, construction tools, and investor reports.",
    heroText: "Built for real estate investors, builders, and operators who need clear numbers and cleaner execution.",
    viewLearning: "View Learning Center",
    whatsInside: "What's inside",
    everyCard: "Every card opens a working tool panel.",
    activeProject: "Active Project",
    projectToolsDetail: "Click any tool to open its working panel. Hover over ? for guidance.",
    profileDetail: "Manage your operator identity, account status, and workspace preferences.",
    name: "Name",
    email: "Email",
    plan: "Plan",
    language: "Language",
    workspace: "Workspace",
    trial: "Trial",
    accountSettings: "Account Settings",
    login: "Login",
    signUp: "Sign up",
    password: "Password",
    checkEmail: "Check your email to confirm your account.",
    loggedIn: "Logged in.",
    confirmEmail: "Confirm email address",
    forgotPassword: "Forgot password?",
    resetPassword: "Send reset link",
    resetSent: "Password reset instructions have been sent to your email.",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    updatePassword: "Update password",
    passwordMismatch: "Passwords do not match.",
    passwordUpdated: "Password updated. You can continue to your dashboard.",
    emailMismatch: "Email addresses do not match.",
    authUnavailable: "Account access is unavailable in this preview. Contact support@operitron.com for assistance.",
    loginReady: "Secure account access.",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
    sessionConfirmed: "Account confirmed. You can now sign in.",
    propertyReady: "Ready to search.",
    rentcastKeyRequired: "Property records are temporarily unavailable. Contact support@operitron.com.",
    searchingRecords: "Searching property records...",
    propertyLoaded: "Property intelligence loaded.",
    search: "Search",
    mortgageBalance: "Mortgage Balance",
    propertySummary: "Property Summary",
    owner: "Owner",
    bedsBaths: "Beds / Baths",
    squareFeet: "Square Feet",
    lotSize: "Lot Size",
    yearBuilt: "Year Built",
    lastSale: "Last Sale",
    coordinates: "Coordinates",
    assessments: "Assessments",
    propertyTaxes: "Property Taxes",
    availableAfterSearch: "Available after search",
    unavailable: "Unavailable",
    aiAssistant: "AI Deal Assistant",
    aiPrompt: "Review this deal for risk, upside, and next steps.",
    aiPreview: "AI preview: verify comps, rehab scope, taxes, insurance, permits, days on market, and lender terms before proceeding.",
    aiPreviewNext: "AI preview: the strongest next steps are validating comparable sales, reviewing permit requirements, confirming contractor pricing, and stress-testing DSCR at a higher interest rate.",
    analyzeWithAi: "Analyze with AI",
    connectDropbox: "Connect Dropbox",
    startTour: "Start tour",
    readGuide: "Read guide",
    dropboxDetail: "Connect plans, permits, draw requests, quotes, photos, and closeout packets.",
    connection: "Connection",
    folders: "Folders",
    sync: "Sync",
    manualUpload: "Manual upload available",
    propertySearchDetail: "Search property records, comps, owner information, taxes, sale history, features, coordinates, and investor math.",
    equity: "Equity",
    pricePerSqft: "Price / Sqft",
    taxRate: "Tax Rate",
    arvHelp: "Average comparable sale price when comps are available.",
    equityHelp: "Estimated value minus mortgage balance.",
    pricePerSqftHelp: "Sale price divided by square footage.",
    taxRateHelp: "Yearly taxes divided by assessed value.",
    savedProjectsHelp: "Number of saved property analyses in your workspace.",
    projectedProfitHelp: "Combined expected profit from current projects.",
    reportsReadyHelp: "Reports available for PDF export or partner review.",
  },
  es: {
    ...copy.es,
    brand: "OPERITRON.COM",
    dashboard: "Panel",
    projectTools: "Herramientas",
    propertySearch: "Búsqueda de Propiedad",
    learning: "Centro de Aprendizaje",
    knowledge: "Base de Conocimiento",
    tutorials: "Tutoriales",
    tours: "Recorridos",
    dropbox: "Dropbox",
    pricing: "Precios",
    settings: "Configuración",
    profile: "Perfil",
    privacy: "Política de Privacidad",
    terms: "Términos",
    refund: "Política de Reembolsos",
    disclaimer: "Aviso Legal",
    startTrial: "Iniciar prueba gratis de 3 días",
    command: "AI Real Estate Operating System",
    welcome: "Bienvenido, Brandon",
    savedProjects: "Proyectos Guardados",
    projectedProfit: "Ganancia Proyectada",
    reportsReady: "Reportes Listos",
    newAnalysis: "Nuevo Análisis",
    openProject: "Abrir Proyecto",
    createProject: "Crear Proyecto",
    quickTools: "Herramientas Rápidas",
    trialNote: "Prueba gratis de 3 días. Cancela cuando quieras.",
    comingSoon: "Próximamente",
    back: "Volver",
    earlyAccess: "Acceso Anticipado",
    earlyAccessText: "Prueba gratis de 3 días para inversionistas, constructores y operadores.",
    myProjects: "Mis Proyectos",
    projectHint: "Haz clic en cualquier proyecto para abrir herramientas, cálculos y registros vinculados.",
    createProjectHint: "Crea un deal, construcción, flip, renta o espacio de trabajo de obra.",
    projectName: "Nombre del proyecto",
    propertyAddress: "Dirección de la propiedad",
    addProject: "Agregar Proyecto",
    heroTitle: "Un espacio original para análisis de deals, registros de propiedades, herramientas de construcción y reportes para inversionistas.",
    heroText: "Creado para inversionistas, constructores y operadores que necesitan números claros y ejecución más ordenada.",
    viewLearning: "Ver Centro de Aprendizaje",
    whatsInside: "Qué incluye",
    everyCard: "Cada tarjeta abre un panel de herramienta funcional.",
    activeProject: "Proyecto Activo",
    projectToolsDetail: "Haz clic en cualquier herramienta para abrir su panel. Pasa el cursor sobre ? para ver ayuda.",
    profileDetail: "Administra tu identidad de operador, estado de cuenta y preferencias del espacio de trabajo.",
    name: "Nombre",
    email: "Correo",
    plan: "Plan",
    language: "Idioma",
    workspace: "Espacio de Trabajo",
    trial: "Prueba",
    accountSettings: "Configuración de Cuenta",
    login: "Iniciar sesión",
    signUp: "Registrarse",
    password: "Contraseña",
    checkEmail: "Revisa tu correo para confirmar la cuenta.",
    loggedIn: "Sesión iniciada.",
    confirmEmail: "Confirmar correo electrónico",
    forgotPassword: "¿Olvidaste tu contraseña?",
    resetPassword: "Enviar enlace de recuperación",
    resetSent: "Las instrucciones para restablecer tu contraseña se enviaron a tu correo.",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    updatePassword: "Actualizar contraseña",
    passwordMismatch: "Las contraseñas no coinciden.",
    passwordUpdated: "Contraseña actualizada. Puedes continuar a tu panel.",
    emailMismatch: "Los correos electrónicos no coinciden.",
    authUnavailable: "El acceso a cuentas no está disponible en esta vista previa. Escribe a support@operitron.com para recibir ayuda.",
    loginReady: "Acceso seguro a tu cuenta.",
    signingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    sessionConfirmed: "Cuenta confirmada. Ya puedes iniciar sesión.",
    propertyReady: "Listo para buscar.",
    rentcastKeyRequired: "Los registros de propiedad no están disponibles temporalmente. Contacta support@operitron.com.",
    searchingRecords: "Buscando registros de propiedad...",
    propertyLoaded: "Inteligencia de propiedad cargada.",
    search: "Buscar",
    mortgageBalance: "Saldo Hipotecario",
    propertySummary: "Resumen de Propiedad",
    owner: "Propietario",
    bedsBaths: "Recámaras / Baños",
    squareFeet: "Pies Cuadrados",
    lotSize: "Tamaño del Lote",
    yearBuilt: "Año de Construcción",
    lastSale: "Última Venta",
    coordinates: "Coordenadas",
    assessments: "Avalúos Fiscales",
    propertyTaxes: "Impuestos de Propiedad",
    availableAfterSearch: "Disponible después de buscar",
    unavailable: "No disponible",
    aiAssistant: "Asistente IA de Deals",
    aiPrompt: "Revisa este deal por riesgo, oportunidad y próximos pasos.",
    aiPreview: "Vista IA: verifica comps, alcance de rehabilitación, impuestos, seguro, permisos, días en mercado y términos del prestamista antes de avanzar.",
    aiPreviewNext: "Vista IA: los siguientes pasos más fuertes son validar ventas comparables, revisar permisos, confirmar precios de contratistas y probar el DSCR con una tasa más alta.",
    analyzeWithAi: "Analizar con IA",
    connectDropbox: "Conectar Dropbox",
    startTour: "Iniciar recorrido",
    readGuide: "Leer guía",
    dropboxDetail: "Conecta planos, permisos, solicitudes de desembolso, cotizaciones, fotos y paquetes de cierre.",
    connection: "Conexión",
    folders: "Carpetas",
    sync: "Sincronización",
    manualUpload: "Carga manual disponible",
    propertySearchDetail: "Busca registros de propiedad, comps, propietario, impuestos, historial de ventas, características, coordenadas y cálculos para inversionistas.",
    equity: "Equidad",
    pricePerSqft: "Precio / Pie Cuadrado",
    taxRate: "Tasa Fiscal",
    arvHelp: "Promedio de precios de ventas comparables cuando hay comps disponibles.",
    equityHelp: "Valor estimado menos saldo hipotecario.",
    pricePerSqftHelp: "Precio de venta dividido entre pies cuadrados.",
    taxRateHelp: "Impuestos anuales divididos entre valor fiscal.",
    savedProjectsHelp: "Número de análisis de propiedades guardados en tu espacio de trabajo.",
    projectedProfitHelp: "Ganancia estimada combinada de los proyectos actuales.",
    reportsReadyHelp: "Reportes disponibles para exportar en PDF o revisar con socios.",
  },
};

const initialProjects = [
  {
    id: 1,
    name: "Santa Rosa Flip",
    type: "Fix & Flip",
    address: "123 Bay Dr, Santa Rosa Beach, FL",
    arv: 425000,
    profit: 74500,
    purchase: 286000,
    repairs: 46000,
    expenses: 18500,
    progress: 61,
    status: "Active",
  },
  {
    id: 2,
    name: "DeFuniak Rental",
    type: "Rental Analysis",
    address: "45 Live Oak Ave, DeFuniak Springs, FL",
    arv: 235000,
    profit: 13000,
    purchase: 194000,
    repairs: 15500,
    expenses: 12500,
    progress: 44,
    status: "Underwriting",
  },
  {
    id: 3,
    name: "Walton Lot Build",
    type: "New Construction",
    address: "Lot 18 County Hwy, Walton County, FL",
    arv: 589000,
    profit: 92000,
    purchase: 372000,
    repairs: 82000,
    expenses: 43000,
    progress: 38,
    status: "Active",
  },
];

const tools = [
  ["wizard", "Construction Wizard", "Plan phases and track schedule, budget, photos, and completion.", Hammer, "Pro"],
  ["underwriter", "Deal Underwriter", "Review ARV, repairs, offer price, ROI, and risk.", LineChart, "Core"],
  ["loan", "Investment Loan Calculator", "Model leverage, points, payment, and DSCR.", Calculator, "DSCR"],
  ["todo", "To Do List", "Track investor, lender, and contractor next steps.", ListChecks, "Live"],
  ["punch", "Punch List", "Log final inspection items before closeout.", ClipboardCheck, "Trades"],
  ["takeoff", "Material Takeoff Beta", "Estimate quantities from room and scope assumptions.", Layers, "Beta"],
  ["subs", "Subs / Quotes New", "Compare bids and assign subcontractor packages.", Users, "New"],
  ["budget", "Budget Estimator", "Build detailed construction cost estimates.", DollarSign, "New"],
];

const toolsEs = [
  ["wizard", "Asistente de Construcción", "Planifica fases y rastrea cronograma, presupuesto, fotos y avance.", Hammer, "Pro"],
  ["underwriter", "Analizador de Deals", "Revisa ARV, reparaciones, oferta, ROI y riesgo.", LineChart, "Core"],
  ["loan", "Calculadora de Préstamo de Inversión", "Modela apalancamiento, puntos, pago y DSCR.", Calculator, "DSCR"],
  ["todo", "Lista de Tareas", "Rastrea próximos pasos de inversionistas, prestamistas y contratistas.", ListChecks, "Live"],
  ["punch", "Lista de Pendientes", "Registra detalles de inspección final antes del cierre.", ClipboardCheck, "Oficios"],
  ["takeoff", "Cálculo de Materiales Beta", "Estima cantidades desde áreas, habitaciones y alcance.", Layers, "Beta"],
  ["subs", "Subcontratistas / Cotizaciones Nuevo", "Compara ofertas y asigna paquetes de trabajo.", Users, "Nuevo"],
  ["budget", "Estimador de Presupuesto", "Construye estimaciones detalladas de costos.", DollarSign, "Nuevo"],
];

const getTools = (language) => (language === "es" ? toolsEs : tools);

const learningArticles = [
  ["Deal Analysis", "7 min", "How to Analyze a Real Estate Deal Faster"],
  ["Financing", "8 min", "DSCR vs BRRR: What Real Estate Investors Should Know"],
  ["Deal Analysis", "12 min", "The Complete Guide to Real Estate Deal Analysis"],
  ["Construction", "9 min", "How to Estimate Construction Costs From Plans"],
  ["Financing", "14 min", "DSCR & BRRR Strategies for Real Estate Investors"],
  ["Takeoffs", "6 min", "Common Takeoff Mistakes That Hurt Your Profit"],
  ["Construction", "11 min", "Construction Budgeting & Estimating for Investors"],
  ["Project Management", "8 min", "What to Track During a Ground-Up Construction Project"],
  ["Takeoffs", "10 min", "Construction Takeoffs & Plan-Based Estimating"],
  ["Closeout", "7 min", "How Punch Lists Reduce Delays and Rework"],
  ["Project Management", "13 min", "Project Management for Ground-Up Construction"],
  ["Closeout", "9 min", "Punch Lists & Construction Closeout"],
];

function AppShell() {
  const [language, setLanguage] = useState("en");
  const [activePage, setActivePage] = useState(getPageFromPath);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [activeTool, setActiveTool] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const checkoutTrackedRef = useRef(false);
  const t = enhancedCopy[language];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleNavigation = () => setActivePage(getPageFromPath());
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  useEffect(() => {
    if (checkoutTrackedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;
    checkoutTrackedRef.current = true;
    trackGoogleAdsConversion("checkoutCompleted");
    trackGoogleAdsConversion("trialStarted");
    trackGoogleAdsConversion("subscriptionStarted");
    window.history.replaceState({}, "", pagePaths.dashboard);
    setActivePage("dashboard");
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
        window.history.replaceState({}, "", pagePaths.settings);
        setActivePage("settings");
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authLoading || user || publicPages.has(activePage)) return;
    window.history.replaceState({}, "", pagePaths.settings);
    setActivePage("settings");
  }, [activePage, authLoading, user]);

  useEffect(() => {
    if (!supabase || !user) {
      setSubscription(null);
      setSubscriptionLoading(false);
      return;
    }
    let active = true;
    setSubscriptionLoading(true);
    supabase.from("profiles").select("subscription_status, subscription_plan, trial_ends_at, current_period_end, role").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (active) {
        setSubscription(data || { subscription_status: "inactive", subscription_plan: "No subscription" });
        setSubscriptionLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user]);
  const isAdmin = Boolean(subscription?.role === "admin" || (user?.email && adminEmails.includes(user.email.toLowerCase())));
  const isTestCustomer = Boolean(user?.email && customerBypassEmails.includes(user.email.toLowerCase()));
  const hasPremium = ["active", "trialing"].includes(subscription?.subscription_status);
  const hasProductAccess = hasPremium || isAdmin || isTestCustomer;

  useEffect(() => {
    if (!supabase || !user || !isAdmin) return;
    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token;
      if (token) fetch("/api/admin-health", { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    });
  }, [user, isAdmin]);

  useEffect(() => {
    if (!supabase || !user || !hasProductAccess) return;
    let active = true;
    supabase.from("projects").select("id, title, address, data, created_at").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (active && !error) setProjects((data || []).map((row) => ({ ...(row.data || {}), id: row.id, name: row.title, address: row.address })));
    });
    return () => {
      active = false;
    };
  }, [user, hasProductAccess]);

  const go = (page, replace = false) => {
    setHistory((old) => [...old, activePage]);
    const target = pagePaths[page] || "/";
    window.history[replace ? "replaceState" : "pushState"]({}, "", target);
    setActivePage(page);
    setMobileOpen(false);
  };

  const back = () => {
    const previous = history[history.length - 1];
    if (!previous) {
      window.history.back();
      return;
    }
    setHistory((old) => old.slice(0, -1));
    window.history.pushState({}, "", pagePaths[previous] || "/");
    setActivePage(previous);
  };

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSubscription(null);
    setSubscriptionLoading(false);
    setPasswordRecovery(false);
    setProjects(initialProjects);
    go("home", true);
  }

  async function saveProject(project) {
    setProjects((current) => [project, ...current]);
    if (!supabase || !user) return { error: "Account storage is unavailable." };
    const { error } = await supabase.from("projects").insert({
      id: project.id,
      user_id: user.id,
      title: project.name,
      address: project.address,
      data: project,
    });
    return error ? { error: error.message } : { error: "" };
  }

  async function saveOrUpdateProject(project) {
    const normalized = { ...project, id: project.id || Date.now(), updatedAt: new Date().toISOString() };
    setProjects((current) => {
      const exists = current.some((item) => String(item.id) === String(normalized.id));
      return exists ? current.map((item) => String(item.id) === String(normalized.id) ? { ...item, ...normalized } : item) : [normalized, ...current];
    });
    setActiveProject((current) => current && String(current.id) === String(normalized.id) ? { ...current, ...normalized } : current);
    if (!supabase || !user) return { error: "Account storage is unavailable.", project: normalized };
    const { error } = await supabase.from("projects").upsert({
      id: normalized.id,
      user_id: user.id,
      title: normalized.name || normalized.title || "Untitled Project",
      address: normalized.address || "",
      data: normalized,
    }, { onConflict: "id" });
    return error ? { error: error.message, project: normalized } : { error: "", project: normalized };
  }

  async function getAccessToken() {
    if (!supabase) return "";
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }

  const page = useMemo(() => {
    const props = { t, language, go, back, projects, setProjects, setActiveTool, user, setUser, signOut, subscription, passwordRecovery, setPasswordRecovery, isAdmin, isTestCustomer, hasProductAccess, getAccessToken, activeProject, setActiveProject, onSaveProject: saveOrUpdateProject };
    if (activePage === "home") return user ? (hasProductAccess ? <Dashboard {...props} onAddProject={saveProject} /> : <PremiumPaywall language={language} user={user} go={go} />) : <PublicHome t={t} go={go} />;
    if (activePage === "dashboard" && !user) return <SettingsPage {...props} />;
    if (activePage === "dashboard") return hasProductAccess ? <Dashboard {...props} onAddProject={saveProject} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "projectTools") return hasProductAccess ? <ProjectTools {...props} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "projectDetails") return hasProductAccess ? <ProjectDetails {...props} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "propertySearch") return hasProductAccess ? <PropertySearch t={t} language={language} getAccessToken={getAccessToken} onAddProject={saveProject} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "learning") return hasProductAccess ? <LearningCenter t={t} language={language} go={go} /> : (user ? <PremiumPaywall language={language} user={user} go={go} /> : <PublicHome t={t} go={go} />);
    if (activePage === "knowledge") return hasProductAccess ? <KnowledgeBase t={t} language={language} /> : (user ? <PremiumPaywall language={language} user={user} go={go} /> : <PublicHome t={t} go={go} />);
    if (activePage === "tutorials") return hasProductAccess ? <Tutorials t={t} language={language} /> : (user ? <PremiumPaywall language={language} user={user} go={go} /> : <PublicHome t={t} go={go} />);
    if (activePage === "tours") return hasProductAccess ? <Tours t={t} language={language} /> : (user ? <PremiumPaywall language={language} user={user} go={go} /> : <PublicHome t={t} go={go} />);
    if (activePage === "dropbox") return hasProductAccess ? <DropboxPage t={t} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "admin") return isAdmin ? <OwnerConsole language={language} user={user} go={go} setActiveTool={setActiveTool} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "pricing") return <PricingPlans language={language} user={user} go={go} />;
    if (activePage === "settings") return <SettingsPage {...props} />;
    if (activePage === "profile") return <ProfilePage t={t} language={language} user={user} back={back} isAdmin={isAdmin} go={go} />;
    if (articlePages.has(activePage)) return <SEOArticlePage page={activePage} go={go} />;
    if (["privacy", "terms", "refund", "disclaimer"].includes(activePage)) return <LegalPage type={activePage} language={language} />;
    return <Dashboard {...props} />;
  }, [activePage, language, projects, user, subscription, passwordRecovery, hasProductAccess, isAdmin, isTestCustomer, activeProject]);

  if (loading || authLoading || (user && subscriptionLoading && !isAdmin)) return <LoadingScreen />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050817] text-slate-200">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute -left-32 -top-28 h-[440px] w-[440px] rounded-full bg-cyan-500/16 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-[460px] w-[460px] rounded-full bg-amber-400/18 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[34%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      {user && hasProductAccess && <Sidebar t={t} user={user} activePage={activePage} go={go} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} isAdmin={isAdmin} openContact={() => setContactOpen(true)} />}
      {user && hasProductAccess && mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/70 lg:hidden" />}
      <Header t={t} language={language} setLanguage={setLanguage} setMobileOpen={setMobileOpen} go={go} user={user} signOut={signOut} hasProductAccess={hasProductAccess} isAdmin={isAdmin} collapsed={sidebarCollapsed} openContact={() => setContactOpen(true)} />
      <main className={`relative z-10 p-4 pb-28 sm:p-5 sm:pb-28 lg:p-8 lg:pb-8 ${user && hasProductAccess ? (sidebarCollapsed ? "lg:ml-20" : "lg:ml-72") : "mx-auto max-w-7xl"}`}>
        {user && hasProductAccess && history.length > 0 && activePage !== "dashboard" && <button onClick={back} className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-amber-400/50 hover:text-white">
          <ChevronRight size={16} className="rotate-180" />{t.back}
        </button>}
        <motion.div key={activePage} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {page}
        </motion.div>
      </main>
      {!user && activePage !== "home" && <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 sm:px-5 lg:px-8 lg:pb-8"><PublicFooter isEs={language === "es"} go={go} /></div>}
      <MobileNavigation t={t} language={language} activePage={activePage} go={go} user={user} hasProductAccess={hasProductAccess} />
      {activeTool && (hasProductAccess ? <ToolModal t={t} language={language} toolId={activeTool} projects={projects} onSaveProject={saveOrUpdateProject} onClose={() => setActiveTool(null)} /> : <ToolModalFrame onClose={() => setActiveTool(null)}><SubscriptionGate language={language} go={(page) => { setActiveTool(null); go(page); }} /></ToolModalFrame>)}
      {contactOpen && <ContactModal language={language} user={user} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

function LoadingScreen() {
  return <div className="grid min-h-screen place-items-center bg-[#050817] p-6 text-slate-200"><div className="text-center"><BrandLogo size="splash" /><p className="mt-7 text-xs font-black uppercase tracking-[0.24em] text-slate-400">AI Real Estate Operating System</p><div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="h-full w-1/2 rounded-full bg-gradient-to-r from-slate-100 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,.7)]" /></div></div></div>;
}

function Sidebar({ t, user, activePage, go, mobileOpen, setMobileOpen, collapsed, setCollapsed, isAdmin }) {
  const items = [
    ["dashboard", Home, t.dashboard],
    ["projectTools", Hammer, t.projectTools],
    ["propertySearch", MapPin, t.propertySearch],
    ["learning", BookOpen, t.learning],
    ["knowledge", Sparkles, t.knowledge],
    ["tutorials", PlayCircle, t.tutorials],
    ["tours", Globe2, t.tours],
    ["dropbox", Cloud, t.dropbox],
    ["pricing", DollarSign, t.pricing],
    ["settings", Settings, t.settings],
  ];
  if (isAdmin) items.splice(1, 0, ["admin", Sparkles, "Owner Console"]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950/90 p-5 backdrop-blur-xl transition-all duration-300 lg:translate-x-0 ${collapsed ? "lg:w-20 lg:p-3" : "lg:w-72"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className={collapsed ? "lg:hidden" : ""}><BrandLogo onClick={() => go("dashboard")} size="sidebar" /></div>
        {collapsed && <button type="button" onClick={() => go("dashboard")} aria-label="OPERITRON.COM" className="hidden h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-slate-900/70 transition hover:border-cyan-300/60 hover:shadow-[0_0_22px_rgba(34,211,238,.24)] lg:grid"><img loading="eager" decoding="async" src="/operitron-mark.png" className="h-10 w-10 rounded-xl object-cover" alt="" /></button>}
        <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:border-cyan-300/40 hover:text-white lg:grid">
          <ChevronRight size={18} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </div>

      <div className={collapsed ? "lg:hidden" : ""}><ProfileMini t={t} user={user} go={go} /></div>

      <nav className="mt-6 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map(([id, Icon, label]) => (
          <button key={id} title={collapsed ? label : undefined} onClick={() => { go(id); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition-all ${collapsed ? "lg:justify-center lg:px-0" : ""} ${activePage === id ? "bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.25)]" : "text-slate-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,.10)]"}`}>
            <Icon className="shrink-0" size={20} />
            <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
            {!collapsed && <ChevronRight className="ml-auto opacity-0 transition group-hover:opacity-100" size={16} />}
          </button>
        ))}
      </nav>

      <div className={`mt-5 shrink-0 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-purple-400/5 p-4 shadow-[0_0_40px_rgba(34,211,238,.12)] ${collapsed ? "lg:hidden" : ""}`}>
        <div className="mb-2 flex items-center gap-2 text-cyan-300"><Sparkles size={18} /><p className="font-black">{isAdmin ? "Builder Access" : t.earlyAccess}</p></div>
        <p className="text-sm leading-6 text-slate-400">{t.earlyAccessText}</p>
      </div>
    </aside>
  );
}

function Header({ t, language, setLanguage, setMobileOpen, go, user, signOut, hasProductAccess, isAdmin, collapsed, openContact }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [billingStatus, setBillingStatus] = useState("");
  async function manageBilling() {
    if (!supabase || !user) {
      setBillingStatus(language === "es" ? "Inicia sesión primero." : "Sign in first.");
      return;
    }
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "es" ? "Sesión no encontrada." : "Session not found.");
      const response = await fetch(portalEndpoint, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const result = await readApiJson(response);
      if (!response.ok) throw new Error(result.error || (language === "es" ? "Primero inicia una suscripción." : "Start a subscription first."));
      window.location.assign(result.url);
    } catch (error) {
      setBillingStatus(error.message || (language === "es" ? "No se pudo abrir facturación." : "Billing portal could not be opened."));
    }
  }
  return (
    <header className={`sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 px-3 py-3 backdrop-blur-xl transition-[margin] duration-300 sm:px-5 ${user && hasProductAccess ? (collapsed ? "lg:ml-20" : "lg:ml-72") : ""}`}>
      <div className={`mx-auto flex items-center justify-between gap-2 sm:gap-4 ${user ? "" : "max-w-7xl"}`}>
        <div className="flex min-w-0 items-center gap-3">
          {user && hasProductAccess && <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-white/10 p-2 text-white lg:hidden"><Menu /></button>}
          <div className={user && hasProductAccess ? "lg:hidden" : ""}>
            <BrandLogo onClick={() => go(user && hasProductAccess ? "dashboard" : "home")} compact />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button onClick={() => setLanguage(language === "en" ? "es" : "en")} aria-label={language === "en" ? "Switch to Spanish" : "Cambiar a inglés"} className="group flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-slate-950/55 px-3 py-2 text-sm font-black text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition hover:border-cyan-300/45 hover:bg-cyan-300/[.07] hover:text-white hover:shadow-[0_0_22px_rgba(34,211,238,.12)] sm:px-4">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-white text-base shadow-sm ring-1 ring-white/20">{language === "es" ? "🇪🇸" : "🇺🇸"}</span>
            <span>{language === "es" ? "Español" : "English"}</span>
          </button>
          {user ? <div className="relative">
            <button onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} className="flex items-center gap-2 rounded-xl border border-white/10 p-2 text-slate-300 hover:border-cyan-300/50 hover:text-white sm:px-3"><UserCircle /><span className="hidden max-w-40 truncate text-sm font-bold xl:block">{user.email}</span></button>
            {accountOpen && <div className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-64 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl shadow-black/50">
              <p className="truncate px-3 py-2 text-xs font-bold text-slate-500">{user.email}</p>
              {hasProductAccess && <button onClick={() => { setAccountOpen(false); go("dashboard"); }} className="w-full rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5">{t.dashboard}</button>}
              {isAdmin && <button onClick={() => { setAccountOpen(false); go("admin"); }} className="w-full rounded-xl px-3 py-2 text-left font-bold text-cyan-200 hover:bg-cyan-300/10">Owner Console</button>}
              <button onClick={() => { setAccountOpen(false); go("profile"); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5"><UserCircle size={16} />{language === "es" ? "Editar perfil" : "Edit Profile"}</button>
              <button onClick={() => { setAccountOpen(false); manageBilling(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5"><WalletCards size={16} />{language === "es" ? "Administrar suscripción" : "Manage Subscription"}{(hasProductAccess || isAdmin) && <span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">{isAdmin ? "Admin" : "Active"}</span>}</button>
              <button onClick={() => { setAccountOpen(false); setFeedbackOpen(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5"><StickyNote size={16} />{language === "es" ? "Enviar comentarios" : "Send Feedback"}</button>
              <button onClick={() => { setAccountOpen(false); setFeatureOpen(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5"><Sparkles size={16} />{language === "es" ? "Solicitar función" : "Request a Feature"}</button>
              <button onClick={() => { setAccountOpen(false); openContact?.(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5"><Mail size={16} />{language === "es" ? "Contáctanos" : "Contact Us"}</button>
              <button onClick={() => { setAccountOpen(false); go("pricing"); }} className="w-full rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-white/5">{t.pricing}</button>
              <div className="my-2 border-t border-white/10" />
              <button onClick={() => { setAccountOpen(false); go("privacy"); }} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">{t.privacy}</button>
              <button onClick={() => { setAccountOpen(false); go("terms"); }} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">{t.terms}</button>
              <button onClick={() => { setAccountOpen(false); go("refund"); }} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">{t.refund}</button>
              <button onClick={() => { setAccountOpen(false); go("disclaimer"); }} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">{t.disclaimer}</button>
              <button onClick={() => setLanguage(language === "en" ? "es" : "en")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-bold text-slate-300 hover:bg-white/5"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-base shadow-sm">{language === "es" ? "🇪🇸" : "🇺🇸"}</span><span>{language === "es" ? "Español" : "English"}</span></button>
              <button onClick={() => { setAccountOpen(false); signOut(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-red-300 hover:bg-red-400/10"><LogOut size={16} />{language === "es" ? "Cerrar sesión" : "Sign out"}</button>
            </div>}
          </div> : <button onClick={() => go("settings")} className="whitespace-nowrap rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-300 hover:border-cyan-300/50 hover:text-white sm:rounded-2xl sm:px-4 sm:py-3">{t.login}</button>}
          {!user && <button onClick={() => go("pricing")} className="hidden whitespace-nowrap rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 shadow-[0_0_35px_rgba(251,191,36,.35)] transition hover:-translate-y-0.5 hover:bg-amber-300 lg:block xl:px-5 xl:text-base">{language === "es" ? "Prueba gratis de 3 días" : t.startTrial}</button>}
        </div>
      </div>
      {billingStatus && <button onClick={() => setBillingStatus("")} className="fixed right-4 top-20 z-[80] max-w-sm rounded-2xl border border-amber-300/30 bg-slate-950 p-4 text-left text-sm font-bold text-amber-100 shadow-2xl">{billingStatus}</button>}
      {feedbackOpen && <FeedbackModal language={language} user={user} onClose={() => setFeedbackOpen(false)} />}
      {featureOpen && <FeatureRequestModal language={language} user={user} onClose={() => setFeatureOpen(false)} />}
    </header>
  );
}

function SupportModalFrame({ title, subtitle, icon: Icon = Mail, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-cyan-200/15 bg-slate-950 p-6 shadow-[0_24px_90px_rgba(0,0,0,.65)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-3 text-2xl font-black text-white"><Icon className="text-amber-300" />{title}</h3>
            {subtitle && <p className="mt-3 text-lg leading-7 text-slate-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close"><X /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ContactModal({ language, user, onClose }) {
  const isEs = language === "es";
  const [form, setForm] = useState({ name: user?.user_metadata?.full_name || "", email: user?.email || "", message: "" });
  const [status, setStatus] = useState("");
  async function submit() {
    if (!form.email.trim() || !form.message.trim()) {
      setStatus(isEs ? "Agrega tu correo y mensaje." : "Add your email and message.");
      return;
    }
    if (supabase) {
      await supabase.from("contact_messages").insert({ name: form.name, email: form.email, message: form.message, type: "contact", recipient: "support@operitron.com" });
    }
    setStatus(isEs ? "Mensaje enviado. Te responderemos en support@operitron.com." : "Message sent. We will reply from support@operitron.com.");
    setTimeout(onClose, 900);
  }
  return <SupportModalFrame title={isEs ? "Contáctanos" : "Contact Us"} subtitle={isEs ? "¿Tienes una pregunta o comentario? Nos encantaría escucharte." : "Have a question or feedback? We'd love to hear from you."} icon={Mail} onClose={onClose}>
    <div className="mt-8 grid gap-5">
      <label><span className="label">{isEs ? "Nombre" : "Name"}</span><input className="field text-lg" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={isEs ? "Tu nombre" : "Your name"} /></label>
      <label><span className="label">Email</span><input className="field text-lg" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="your@email.com" /></label>
      <label><span className="label">{isEs ? "Mensaje" : "Message"}</span><textarea maxLength={1000} className="field min-h-40 text-lg" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={isEs ? "?C?mo podemos ayudarte?" : "How can we help you?"} /><span className="mt-2 block text-right text-sm text-slate-500">{form.message.length}/1000</span></label>
    </div>
    {status && <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">{status}</p>}
    <button onClick={submit} className="primary-button mt-6 w-full justify-center"><Mail size={18} />{isEs ? "Enviar mensaje" : "Send Message"}</button>
  </SupportModalFrame>;
}

function FeedbackModal({ language, user, onClose }) {
  const isEs = language === "es";
  const [category, setCategory] = useState("General");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  async function submit() {
    if (!message.trim()) {
      setStatus(isEs ? "Escribe tu comentario antes de enviar." : "Write your feedback before submitting.");
      return;
    }
    if (supabase) {
      await supabase.from("contact_messages").insert({ name: user?.user_metadata?.full_name || "", email: user?.email || "", message, type: "feedback", category, rating, recipient: "support@operitron.com" });
    }
    setStatus(isEs ? "Gracias. Tu comentario fue recibido." : "Thanks. Your feedback was received.");
    setTimeout(onClose, 900);
  }
  return <SupportModalFrame title={isEs ? "Enviar comentarios" : "Send Feedback"} subtitle={isEs ? "Ayudanos a mejorar Operitron compartiendo tus ideas." : "Help us improve Operitron by sharing your thoughts."} icon={StickyNote} onClose={onClose}>
    <div className="mt-8 space-y-6">
      <div><p className="label">{isEs ? "Categoria" : "Category"}</p><div className="mt-3 flex flex-wrap gap-3">{["Bug Report", "General"].map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-2xl border px-5 py-3 font-bold ${category === item ? "border-amber-400 bg-amber-400/15 text-amber-200" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>{isEs && item === "Bug Report" ? "Reporte de error" : item}</button>)}</div></div>
      <div><p className="label">{isEs ? "?C?mo calificas tu experiencia?" : "How would you rate your experience?"}</p><div className="mt-3 flex gap-2">{[1,2,3,4,5].map((value) => <button key={value} onClick={() => setRating(value)} className={`text-4xl ${rating >= value ? "text-amber-300" : "text-slate-600"}`}>☆</button>)}</div></div>
      <label><span className="label">{isEs ? "Tu comentario" : "Your feedback"}</span><textarea className="field min-h-44 text-lg" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={isEs ? "Cuéntanos que piensas..." : "Tell us what you think..."} /></label>
    </div>
    {status && <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">{status}</p>}
    <div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="secondary-button">{isEs ? "Cancelar" : "Cancel"}</button><button onClick={submit} className="primary-button">{isEs ? "Enviar comentarios" : "Submit Feedback"}</button></div>
  </SupportModalFrame>;
}

function FeatureRequestModal({ language, user, onClose }) {
  const isEs = language === "es";
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  async function submit() {
    if (!title.trim() || !message.trim()) {
      setStatus(isEs ? "Agrega titulo y descripcion." : "Add a title and description.");
      return;
    }
    if (supabase) {
      await supabase.from("contact_messages").insert({ name: user?.user_metadata?.full_name || "", email: user?.email || "", message, type: "feature_request", category: title, recipient: "support@operitron.com" });
    }
    setStatus(isEs ? "Solicitud enviada. Gracias por ayudar a mejorar Operitron." : "Request submitted. Thanks for helping improve Operitron.");
    setTimeout(onClose, 900);
  }
  return <SupportModalFrame title={isEs ? "Solicitar una función" : "Request a Feature"} subtitle={isEs ? "¿Tienes una idea para mejorar Operitron? Queremos escucharla." : "Have an idea to make Operitron better? We'd love to hear it."} icon={Sparkles} onClose={onClose}>
    <div className="mt-8 grid gap-5">
      <label><span className="label">{isEs ? "Título de la función" : "Feature Title"}</span><input className="field text-lg" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={isEs ? "Dale un nombre corto..." : "Give your idea a short name..."} /></label>
      <label><span className="label">{isEs ? "Describe tu idea" : "Describe your idea"}</span><textarea className="field min-h-52 text-lg" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={isEs ? "?Qué har?a esta funci?n? ?C?mo ayudar?a?" : "What would this feature do? How would it help you?"} /></label>
    </div>
    {status && <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">{status}</p>}
    <div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="secondary-button">{isEs ? "Cancelar" : "Cancel"}</button><button onClick={submit} className="primary-button">{isEs ? "Enviar solicitud" : "Submit Request"}</button></div>
  </SupportModalFrame>;
}

function MobileNavigation({ t, language, activePage, go, user, hasProductAccess }) {
  const isEs = language === "es";
  const items = user && hasProductAccess
    ? [["dashboard", Home, isEs ? "Inicio" : "Home"], ["projectTools", Hammer, isEs ? "Obra" : "Tools"], ["propertySearch", Search, isEs ? "Buscar" : "Search"], ["profile", UserCircle, isEs ? "Perfil" : "Profile"]]
    : [["home", Home, isEs ? "Inicio" : "Home"], ["pricing", DollarSign, isEs ? "Planes" : "Plans"], ["settings", UserCircle, isEs ? "Cuenta" : "Account"], ["disclaimer", FileText, isEs ? "Legal" : "Legal"]];
  return <nav aria-label={isEs ? "Navegaci?n m?vil" : "Mobile navigation"} className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 gap-1 rounded-[1.45rem] border border-white/10 bg-slate-950/95 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.5)] backdrop-blur-xl lg:hidden">{items.map(([page, Icon, label]) => {
    const active = activePage === page || (!(user && hasProductAccess) && page === "home" && activePage === "dashboard");
    return <button key={page} type="button" onClick={() => go(page)} className={`flex min-h-[3.6rem] flex-col items-center justify-center gap-1 rounded-[1.05rem] px-1 py-2 text-[0.68rem] font-bold transition ${active ? "bg-cyan-300/15 text-cyan-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={19} /><span className="truncate">{label}</span></button>;
  })}</nav>;
}

function BrandLogo({ onClick, compact = false, size = "default" }) {
  const isFull = size === "splash";
  if (isFull) {
    return (
      <button type="button" onClick={onClick} className="inline-flex justify-center rounded-3xl p-1" aria-label="Operitron home">
        <img src="/operitron-logo-original.png" alt="OPERITRON.COM" width="1536" height="1024" decoding="async" loading="eager" className="h-auto w-[min(82vw,34rem)] rounded-2xl object-contain shadow-[0_0_45px_rgba(37,99,235,.15)]" />
      </button>
    );
  }

  const iconSize = compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-14 w-14";
  const titleSize = compact ? "text-xl sm:text-2xl" : "text-lg xl:text-xl";
  const subtitleSize = compact ? "text-[0.6rem] sm:text-[0.68rem]" : "text-[0.58rem] xl:text-[0.62rem]";
  return (
    <button type="button" onClick={onClick} className="group flex min-w-0 shrink-0 items-center gap-3 rounded-2xl px-1 py-1 text-left transition hover:bg-white/[.04]" aria-label="Operitron home">
      <img src="/operitron-mark.png" alt="" width="512" height="512" decoding="async" loading="eager" className={`${iconSize} shrink-0 rounded-2xl object-contain shadow-[0_0_28px_rgba(37,99,235,.18)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(34,211,238,.35)]`} />
      <span className="block min-w-0">
        <span className={`block truncate font-black tracking-wide text-white ${titleSize}`}>OPERITRON.COM</span>
        <span className={`block truncate font-bold uppercase tracking-[0.18em] text-cyan-300 xl:tracking-[0.24em] ${subtitleSize}`}>AI Real Estate Operating System</span>
      </span>
    </button>
  );
}

function Dashboard({ t, language, projects, setProjects, setActiveTool, go, onAddProject, isAdmin }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);

  async function addProject() {
    if (!name.trim()) return;
    const project = { id: Date.now(), name, type: t.newAnalysis, address: address || t.propertyAddress, arv: 0, profit: 0, purchase: 0, repairs: 0, expenses: 0, progress: 0, status: t.earlyAccess };
    if (onAddProject) {
      const result = await onAddProject(project);
      setSaveStatus(result?.error ? (language === "es" ? "Proyecto visible en esta sesión, pero no se pudo guardar. Revisa Owner Console." : "Project is visible this session, but could not be saved. Review Owner Console.") : (language === "es" ? "Proyecto guardado." : "Project saved."));
    }
    else setProjects([project, ...projects]);
    setName("");
    setAddress("");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Hero t={t} go={go} />
      {isAdmin && <section className="flex flex-col justify-between gap-4 rounded-3xl border border-cyan-300/25 bg-cyan-300/[.07] p-5 sm:flex-row sm:items-center">
        <div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{language === "es" ? "Acceso del Propietario" : "Owner Access"}</p><p className="mt-2 font-bold text-white">{language === "es" ? "Todas las herramientas están habilitadas para tu cuenta administrativa." : "All paid workspace tools are enabled for your administrator account."}</p></div>
        <button onClick={() => go("admin")} className="secondary-button whitespace-nowrap">{language === "es" ? "Abrir Control" : "Open Owner Console"}</button>
      </section>}

      <section className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        <Stat onClick={() => go("projectTools")} title={t.savedProjects} value={projects.length} icon={FolderOpen} help={t.savedProjectsHelp || "Number of saved property analyses in your workspace."} />
        <Stat onClick={() => setActiveTool("underwriter")} title={t.projectedProfit} value={formatMoney(totalProfit)} icon={WalletCards} help={t.projectedProfitHelp || "Combined expected profit from current projects."} />
        <div className="col-span-2 md:col-span-1"><Stat onClick={() => setActiveTool("reports")} title={t.reportsReady} value="8" icon={FileText} help={t.reportsReadyHelp || "Reports available for PDF export or partner review."} /></div>
      </section>

      <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
        <GlassPanel className="self-start">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-white sm:text-3xl">{t.myProjects}</h3>
              <p className="text-slate-400">{t.projectHint}</p>
            </div>
            <button onClick={() => setActiveTool("underwriter")} className="primary-button">{t.newAnalysis}</button>
          </div>
          {projects.length ? <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} open={() => go("projectTools")} t={t} />
            ))}
          </div> : <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/35 px-5 py-10 text-center">
            <FolderOpen className="mx-auto text-cyan-300" />
            <p className="mt-3 font-black text-white">{language === "es" ? "Aún no hay proyectos guardados" : "No saved projects yet"}</p>
            <p className="mt-1 text-sm text-slate-400">{language === "es" ? "Crea un proyecto o inicia un nuevo análisis." : "Create a project or begin a new analysis."}</p>
          </div>}
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <h3 className="text-xl font-black text-white">{t.createProject}</h3>
            <p className="mt-1 text-sm text-slate-400">{t.createProjectHint}</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.projectName} className="field mt-5" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.propertyAddress} className="field mt-3" />
            <button onClick={addProject} className="primary-button mt-4 flex w-full items-center justify-center gap-2"><Plus size={18} /> {t.addProject}</button>
            {saveStatus && <p className="mt-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[.06] p-3 text-sm leading-6 text-slate-300">{saveStatus}</p>}
          </GlassPanel>
        </div>
      </section>

      <AIAssistant t={t} large />

      <SectionHeader title={t.quickTools} detail={t.everyCard} />
      <ToolGrid language={language} setActiveTool={setActiveTool} />
    </div>
  );
}

function PublicHome({ t, go }) {
  const isEs = t.dashboard === "Panel";
  const publicCards = isEs
    ? [
      ["Análisis de Deals", "Analiza flips, rentas, BRRR y oportunidades de construcción con fórmulas para inversionistas.", LineChart],
      ["Inteligencia de Propiedades", "Conecta APIs para propietarios, impuestos, historial de ventas, comps y contexto de valuaci?n.", MapPin],
      ["Herramientas de Construcción", "Gestiona takeoffs, punch lists, cotizaciones, archivos vinculados y colaboradores en un solo espacio.", Hammer],
    ]
    : [
      ["Deal Analysis", "Underwrite flips, rentals, BRRR deals, and construction opportunities with investor-grade formulas.", LineChart],
      ["Property Intelligence", "Connect APIs for owner records, taxes, sales history, comps, and valuation context.", MapPin],
      ["Construction Tools", "Manage takeoffs, punch lists, quotes, linked files, and collaborators from one workspace.", Hammer],
    ];
  return (
    <div className="space-y-6 sm:space-y-8">
      <Hero t={t} go={go} />
      <section className="grid gap-5 lg:grid-cols-3">
        {publicCards.map(([title, text, Icon]) => (
          <GlassPanel key={title}>
            <GlowIcon><Icon /></GlowIcon>
            <h3 className="mt-5 text-2xl font-black text-white">{title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{text}</p>
          </GlassPanel>
        ))}
      </section>
      <VisitorWorkflow isEs={isEs} />
      <LandingCTA isEs={isEs} t={t} go={go} />
      <LandingStats isEs={isEs} />
      <LandingFeatureSections isEs={isEs} />
      <WhyChoose isEs={isEs} />
      <Testimonials isEs={isEs} />
      <ByNumbers isEs={isEs} />
      <PricingPlans language={isEs ? "es" : "en"} go={go} />
      <LandingFAQ isEs={isEs} />
      <LandingKnowledgeBase isEs={isEs} />
      <SEOArticleGrid go={go} />
      <PublicFooter isEs={isEs} go={go} />
    </div>
  );
}

function VisitorWorkflow({ isEs }) {
  const steps = isEs
    ? [
      ["1", "Filtra oportunidades", "Captura precio, ARV, renta, deuda y gastos para probar la viabilidad inicial."],
      ["2", "Valida el activo", "Revisa comps, impuestos, datos p?blicos, historial y riesgos antes de comprometer capital."],
      ["3", "Planifica la ejecución", "Convierte el alcance en presupuesto, cronograma, takeoff, cotizaciones y punch list."],
      ["4", "Comparte decisiones", "Exporta reportes, colabora con tu equipo y conserva supuestos en el proyecto."],
    ]
    : [
      ["1", "Screen opportunities", "Capture price, ARV, rent, debt, and costs to test initial feasibility."],
      ["2", "Validate the asset", "Review comps, taxes, public data, history, and risk before committing capital."],
      ["3", "Plan execution", "Turn scope into budget, schedule, takeoff, quotes, and closeout tracking."],
      ["4", "Share decisions", "Export reports, collaborate with your team, and preserve assumptions by project."],
    ];
  return <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 sm:p-7"><SectionHeader title={isEs ? "Del análisis a la ejecución" : "From analysis to execution"} detail={isEs ? "Un flujo claro para inversionistas, constructores y operadores que necesitan verificar antes de actuar." : "A clear operating path for investors and builders who need to verify before they act."} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{steps.map(([number, title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/10 font-black text-cyan-300">{number}</span><h3 className="mt-4 text-lg font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div><p className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[.05] p-4 text-sm leading-6 text-slate-300">{isEs ? "Operitron apoya decisiones; valida comparables, presupuestos, permisos, financiamiento y asesor?a profesional antes de invertir o construir." : "Operitron supports decisions; verify comps, budgets, permits, financing, and professional advice before investing or building."}</p></section>;
}

function LandingCTA({ isEs, t, go }) {
  return <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-gradient-to-r from-cyan-400/[.10] via-slate-950 to-purple-500/[.10] p-5 shadow-[0_0_42px_rgba(34,211,238,.08)] sm:p-7"><div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" /><div className="relative flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">{isEs ? "Comienza hoy" : "Start today"}</p><h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">{isEs ? "?Listo para empezar con OPERITRON.COM?" : "Ready to Start with OPERITRON.COM?"}</h3><p className="mt-3 leading-7 text-slate-300">{isEs ? "OPERITRON.COM te ofrece análisis de deals, herramientas de construcción, takeoffs, punch lists y colaboración en una sola plataforma. " : "OPERITRON.COM gives you deal analysis, construction tools, takeoffs, punch lists, and collaboration in one platform. "}{t.trialNote}</p></div><div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><button onClick={() => go("settings")} className="primary-button whitespace-nowrap">{isEs ? "Crear cuenta" : "Create Account"}</button><button onClick={() => go("pricing")} className="secondary-button whitespace-nowrap">{t.pricing}</button></div></div></section>;
}

function LandingStats({ isEs }) {
  const stats = isEs
    ? [["8", "Herramientas de Proyecto"], ["14", "Fases de Construcción"], ["2", "Planes Transparentes"], ["3 Días", "Prueba de Acceso Completo"]]
    : [["8", "Project Tools"], ["14", "Construction Phases"], ["2", "Transparent Plans"], ["3 Days", "Full-Access Trial"]];
  return <section className="grid gap-4 border-y border-white/10 py-8 md:grid-cols-4">{stats.map(([value, label]) => <div key={label} className="text-center"><p className="text-3xl font-black text-amber-300">{value}</p><p className="mt-1 text-sm font-bold text-slate-500">{label}</p></div>)}</section>;
}

function LandingFeatureSections({ isEs }) {
  const sections = isEs
    ? [
      ["Analiza Deals en Minutos", "Eval?a ARV, precio de compra, reparaciones, financiamiento, DSCR, ROI y flujo de caja sin vivir en hojas de cálculo.", ["ROI en tiempo real", "Regla del 70%", "Oferta m?xima", "Escenarios de salida"], LineChart],
      ["Rastrea Cada Fase de Construcción", "Organiza cronogramas, presupuestos, fotos, inspecciones y dependencias críticas desde una sola vista de obra.", ["Fases de construcción", "Riesgo de retrasos", "Control de presupuesto", "Progreso por hitos"], BarChart3],
      ["Mide Planos con IA", "Sube planos, estima cantidades, aplica factores de desperdicio y genera reportes de materiales para cotizar con más claridad.", ["PDFs multip?gina", "áreas y lineales", "Costos de materiales", "Exportaci?n PDF"], Layers],
      ["Cierra Proyectos con Punch Lists", "Documenta pendientes, asigna oficios, adjunta fotos y exporta reportes limpios para contratistas, compradores o prestamistas.", ["Fotos por partida", "Asignaci?n por oficio", "Estados abiertos/resueltos", "Reporte PDF"], ClipboardCheck],
    ]
    : [
      ["Underwrite Any Deal in Minutes", "Review ARV, purchase price, repairs, financing, DSCR, ROI, and cash flow without living inside spreadsheets.", ["Real-time ROI", "70% rule", "Max offer", "Exit scenarios"], LineChart],
      ["Track Every Build Phase", "Organize schedules, budgets, photos, inspections, and critical dependencies from one construction workspace.", ["Construction phases", "Delay risk", "Budget control", "Milestone progress"], BarChart3],
      ["Measure Blueprints With AI", "Upload plans, estimate quantities, apply waste factors, and generate material reports for cleaner bidding.", ["Multi-page PDFs", "Area and linear tools", "Material costs", "PDF export"], Layers],
      ["Close Out With Zero Confusion", "Document punch items, assign trades, attach photos, and export clean reports for contractors, buyers, or lenders.", ["Photo records", "Trade assignments", "Open/resolved status", "PDF report"], ClipboardCheck],
    ];
  return <div className="space-y-8">{sections.map(([title, text, points, Icon], index) => <section key={title} className={`grid items-center gap-6 lg:grid-cols-2 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}><div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/20"><div className="mb-4 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></div><div className="rounded-3xl bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-amber-400/10 p-6"><Icon className="text-cyan-300" size={34} /><div className="mt-6 grid gap-3">{points.map((point, i) => <div key={point} className="flex items-center justify-between rounded-2xl bg-slate-950/70 p-3"><span className="font-bold text-slate-300">{point}</span><span className={i % 2 ? "text-amber-300" : "text-emerald-300"}>{i % 2 ? "Ready" : "Live"}</span></div>)}</div></div></div><div><h2 className="text-3xl font-black text-white">{title}</h2><p className="mt-4 max-w-xl text-lg leading-8 text-slate-400">{text}</p><ul className="mt-5 grid gap-3">{points.map((point) => <li key={point} className="flex gap-3 text-slate-300"><CheckCircle2 className="text-cyan-300" size={18} /> {point}</li>)}</ul></div></section>)}</div>;
}

function WhyChoose({ isEs }) {
  const items = isEs
    ? [["Números Claros", "Fórmulas visibles para revisar supuestos antes de comprar."], ["Flujo Todo-en-Uno", "Deals, construcción, takeoffs y reportes sin cambiar de sistema."], ["Listo para Equipos", "Colabora con socios, contratistas, prestamistas y gerentes."], ["Dise?ado para Operadores", "Creado para decisiones reales de inversión y obra, no solo reportes bonitos."]]
    : [["Clear Numbers", "Visible formulas help you review assumptions before you buy."], ["All-in-One Workflow", "Deals, construction, takeoffs, and reports without switching systems."], ["Team Ready", "Collaborate with partners, contractors, lenders, and managers."], ["Built for Operators", "Designed for real investment and build decisions, not just pretty reports."]];
  return <section><SectionHeader title="Why Choose OPERITRON.COM?" detail={isEs ? "IA práctica, cálculos claros y control de proyecto en una plataforma original." : "Practical AI, clear calculations, and project control in one original platform."} /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{items.map(([title, text]) => <Info key={title} title={title} text={text} />)}</div></section>;
}

function Testimonials({ isEs }) {
  const quotes = isEs
    ? [
      { quote: "Operitron nos ayud? a revisar m?s deals sin perder control de los supuestos.", initial: "C", name: "Camila S.", role: "Desarrolladora de Vivienda", location: "Phoenix, AZ", color: "from-cyan-400 to-blue-600" },
      { quote: "La combinaci?n de underwriting y construcci?n es exactamente lo que necesitaba nuestro equipo.", initial: "A", name: "Adriana V.", role: "Constructora Residencial", location: "Raleigh, NC", color: "from-purple-400 to-indigo-600" },
      { quote: "Los reportes y punch lists hacen que las conversaciones con contratistas sean m?s limpias.", initial: "D", name: "Diego L.", role: "Operador BRRR", location: "Orlando, FL", color: "from-amber-300 to-orange-500" },
    ]
    : [
      { quote: "Operitron helps us review more deals without losing control of the assumptions.", initial: "C", name: "Camila S.", role: "Housing Developer", location: "Phoenix, AZ", color: "from-cyan-400 to-blue-600" },
      { quote: "The underwriting plus construction workflow is exactly what our team needed.", initial: "A", name: "Alyssa V.", role: "Residential Builder", location: "Raleigh, NC", color: "from-purple-400 to-indigo-600" },
      { quote: "Reports and punch lists make contractor conversations cleaner.", initial: "D", name: "Daniel L.", role: "BRRR Portfolio Operator", location: "Orlando, FL", color: "from-amber-300 to-orange-500" },
    ];
  return <section><SectionHeader title={isEs ? "Confiado por Operadores" : "Trusted by Investors"} detail={isEs ? "Software para equipos que viven entre números, obra y ejecución." : "Software for teams living between numbers, jobsites, and execution."} /><div className="grid gap-4 md:grid-cols-3">{quotes.map((review) => <motion.article key={review.name} whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-300/25 hover:shadow-[0_16px_45px_rgba(34,211,238,.08)]"><p className="text-amber-300" aria-label="5 out of 5 stars">?????</p><p className="mt-4 min-h-24 leading-7 text-slate-300">{review.quote}</p><div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${review.color} text-lg font-black text-white shadow-[0_0_22px_rgba(34,211,238,.18)]`}>{review.initial}</div><div><p className="font-black text-white">{review.name}</p><p className="text-sm text-cyan-200">{review.role} <span className="text-slate-500">|</span> {review.location}</p></div></div></motion.article>)}</div></section>;
}

function ByNumbers({ isEs }) {
  return <section><SectionHeader title={isEs ? "En Números" : "By the Numbers"} detail={isEs ? "Resultados reales impulsados por herramientas inteligentes." : "Real results powered by intelligent tools."} /><div className="grid gap-4 md:grid-cols-3"><Info title={isEs ? "15% Menos Retrasos" : "15% Fewer Delays"} text={isEs ? "La predicción de cuellos de botella con IA identifica riesgos de ruta crítica antes de que se conviertan en sobrecostos." : "AI bottleneck prediction flags critical-path risk before it becomes expensive schedule drift."} /><Info title={isEs ? "Precisión en Takeoff" : "Takeoff Accuracy"} text={isEs ? "Mediciones automatizadas con factores de desperdicio reducen errores de conteo manual y faltantes de material." : "Automated measurement logic with waste factors reduces manual counting mistakes and material gaps."} /><Info title={isEs ? "2x Más R?pido en Análisis" : "2x Faster Underwriting"} text={isEs ? "ROI, financiamiento y DSCR en tiempo real convierten horas de hojas de cálculo en minutos." : "Real-time ROI, financing, and DSCR calculations turn spreadsheet hours into minutes."} /></div></section>;
}

function LandingFAQ({ isEs }) {
  const faqs = isEs
    ? [["?Operitron reemplaza a mi contratista o asesor?", "No. OPERITRON.COM organiza cálculos y flujos de trabajo para apoyar decisiones; siempre valida con profesionales licenciados."], ["?Puedo usarlo para flips, rentals y BRRR?", "Sí. Incluye underwriting, DSCR, cash-out, construcción, takeoffs y reportes."], ["?Incluye prueba gratis?", "Sí. La prueba gratis de tres días comienza al iniciar una suscripción Mensual o Anual en el checkout seguro."], ["?Puedo colaborar con mi equipo?", "Sí. Puedes estructurar colaboradores, elementos vinculados, cotizaciones y reportes por proyecto."]]
    : [["Does Operitron replace my contractor or advisor?", "No. OPERITRON.COM organizes calculations and workflows for decision support; always validate with licensed professionals."], ["Can I use it for flips, rentals, and BRRR?", "Yes. It includes underwriting, DSCR, cash-out, construction tracking, takeoffs, and reports."], ["Is there a free trial?", "Yes. A three-day trial begins when you start a Monthly or Annual subscription in secure checkout."], ["Can I collaborate with my team?", "Yes. Structure collaborators, linked items, quotes, and reports by project."]];
  return <section><SectionHeader title={isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions"} detail={isEs ? "Respuestas r?pidas para inversionistas y constructores." : "Quick answers for investors and builders."} /><div className="space-y-3">{faqs.map(([q, a]) => <details key={q} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><summary className="cursor-pointer font-black text-white">{q}</summary><p className="mt-3 leading-7 text-slate-400">{a}</p></details>)}</div></section>;
}

function LandingKnowledgeBase({ isEs }) {
  const topics = isEs ? ["Cómo evaluar un deal más r?pido", "Cómo preparar una oferta m?xima", "Cómo organizar un cierre de construcción", "Cómo revisar DSCR antes de hablar con un prestamista"] : ["How to evaluate a deal faster", "How to prepare a max offer", "How to organize construction closeout", "How to review DSCR before calling a lender"];
  return <section><SectionHeader title={isEs ? "Base de Conocimiento para Inversionistas" : "Investor Knowledge Base"} detail={isEs ? "Guías originales para analizar, construir y operar con más claridad." : "Original guides for analyzing, building, and operating with more clarity."} /><div className="grid gap-4 md:grid-cols-2">{topics.map((topic) => <button key={topic} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-left font-black text-white hover:border-cyan-300/40">{topic}<ChevronRight className="float-right text-cyan-300" /></button>)}</div></section>;
}

function SEOArticleGrid({ go }) {
  return (
    <section>
      <SectionHeader
        title="Investor SEO Guides"
        detail="Practical search-focused guides for investors and builders comparing formulas, financing, construction costs, and project timelines."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(seoArticles).map(([page, article]) => {
          const Icon = article.icon;
          return (
            <motion.button
              key={page}
              whileHover={{ y: -4 }}
              onClick={() => go(page)}
              className="glow-card rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 text-left shadow-2xl shadow-black/20 transition hover:border-cyan-300/35"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300"><Icon size={22} /></div>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">{article.readTime}</span>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{article.category}</p>
              <h3 className="mt-3 text-xl font-black leading-snug text-white">{article.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{article.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-black text-amber-300">Read guide <ChevronRight size={18} /></span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function SEOArticlePage({ page, go }) {
  const article = seoArticles[page] || seoArticles.brrrCalculator;
  const Icon = article.icon;
  useEffect(() => {
    const originalTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const originalDescription = description?.getAttribute("content") || "";
    document.title = `${article.title} | OPERITRON.COM`;
    description?.setAttribute("content", article.description);
    return () => {
      document.title = originalTitle;
      description?.setAttribute("content", originalDescription);
    };
  }, [article]);

  const related = Object.entries(seoArticles).filter(([key]) => key !== page).slice(0, 3);
  const faqs = article.faqs || [
    [`How should I use this ${article.category.toLowerCase()} guide?`, "Use it as a screening framework first, then verify every assumption with current local data, lender requirements, contractor bids, and professional advice."],
    ["Can OPERITRON.COM calculate these numbers?", "Yes. Operitron includes deal analysis, loan calculations, construction budgeting, takeoffs, project tools, and AI-assisted review for paid, trialing, and administrator users."],
    ["Do these formulas guarantee a profitable investment?", "No. These formulas organize decision-making. Returns depend on market conditions, execution, financing, taxes, insurance, timelines, and your own assumptions."],
  ];
  return (
    <article className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[.12] via-slate-950 to-purple-500/[.12] p-6 shadow-2xl shadow-black/25 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
        <button onClick={() => go("home")} className="secondary-button relative mb-6">? Home</button>
        <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{article.category}</p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">{article.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{article.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {article.keywords.map((keyword) => <span key={keyword} className="rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-sm font-bold text-slate-300">{keyword}</span>)}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,.25)]"><Icon size={26} /></div>
            <p className="mt-5 text-sm font-black uppercase tracking-widest text-slate-500">Guide Length</p>
            <p className="mt-1 text-2xl font-black text-white">{article.readTime}</p>
            <button onClick={() => go("pricing")} className="primary-button mt-6 w-full">Start 3-Day Free Trial</button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <GlassPanel>
            <p className="text-lg leading-8 text-slate-300">{article.intro}</p>
          </GlassPanel>
          {article.sections.map(([title, text], index) => (
            <GlassPanel key={title}>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">Step {index + 1}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{title}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">{text}</p>
            </GlassPanel>
          ))}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5">
            <h2 className="text-xl font-black text-white">Core Formulas</h2>
            <div className="mt-4 space-y-3">
              {article.formulaBlocks.map(([label, formula]) => <div key={label} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[.045] p-4"><p className="font-black text-cyan-200">{label}</p><p className="mt-2 text-sm leading-6 text-slate-300">{formula}</p></div>)}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5">
            <h2 className="text-xl font-black text-white">Investor Checklist</h2>
            <ul className="mt-4 space-y-3">
              {article.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={18} />{item}</li>)}
            </ul>
          </div>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 sm:p-8">
        <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
        <div className="mt-5 space-y-3">
          {faqs.map(([question, answer]) => <details key={question} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><summary className="cursor-pointer font-black text-white">{question}</summary><p className="mt-3 leading-7 text-slate-300">{answer}</p></details>)}
        </div>
      </section>

      <section className="rounded-[2rem] border border-amber-300/20 bg-amber-300/[.06] p-6 sm:p-8">
        <h2 className="text-2xl font-black text-white">Put this into practice</h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">{article.cta}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => go("pricing")} className="primary-button">View Pricing</button>
          <button onClick={() => go("settings")} className="secondary-button">Create Account</button>
        </div>
      </section>

      <section>
        <SectionHeader title="Related Guides" detail="Continue with more Operitron investor and construction resources." />
        <div className="grid gap-4 md:grid-cols-3">
          {related.map(([key, relatedArticle]) => <button key={key} onClick={() => go(key)} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-left hover:border-cyan-300/35"><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{relatedArticle.category}</p><h3 className="mt-3 font-black text-white">{relatedArticle.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{relatedArticle.readTime}</p></button>)}
        </div>
      </section>
    </article>
  );
}

function Hero({ t, go }) {
  const isEs = t.dashboard === "Panel";
  const insideItems = isEs
    ? ["Analizador de Deals", "Calculadora DSCR", "Calculadora BRRR", "Rastreador de Construcción", "Takeoff de Materiales con IA", "Punch List", "Checklist de Construcción", "Colaboración de Equipo"]
    : ["Deal Underwriter", "DSCR Calculator", "BRRR Calculator", "Construction Tracker", "AI Material Takeoff", "Punch List", "Construction Checklist", "Team Collaboration"];
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-900/80 to-amber-400/10 p-5 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-7">
      <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1fr_430px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.23em] text-amber-300 sm:text-sm sm:tracking-[0.3em]">{t.brand}</p>
          <h1 className="mt-4 max-w-4xl text-[2rem] font-black leading-[1.18] text-white sm:text-4xl md:text-5xl">{t.heroTitle}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">{t.trialNote} {t.heroText}</p>
          <div className="mt-6 grid gap-3 sm:mt-7 sm:flex sm:flex-wrap">
            <button onClick={() => go("pricing")} className="primary-button w-full sm:w-auto">{t.startTrial}</button>
            <button onClick={() => go("learning")} className="secondary-button w-full sm:w-auto">{t.viewLearning}</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:rounded-3xl sm:p-5">
          <p className="font-black text-white">{t.whatsInside}</p>
          <div className="mt-4 grid gap-3">
            {insideItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-sm font-bold text-slate-300">
                <CheckCircle2 className="text-emerald-400" size={18} /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicFooter({ isEs, go }) {
  const toolLinks = isEs ? [["Análisis de Deals"], ["Calculadora DSCR"], ["Calculadora BRRR"], ["Rastreador de Construcción"]] : [["Deal Analysis"], ["DSCR Calculator"], ["BRRR Calculator"], ["Construction Tracker"]];
  const moreLinks = isEs ? [["Takeoff con IA"], ["Punch List"], ["Lista de Tareas"], ["Precios", "pricing"]] : [["AI Takeoff"], ["Punch List"], ["To-Do List"], ["Pricing", "pricing"]];
  const resourceLinks = isEs ? [["Aprende", "learning"], ["Tutoriales", "tutorials"], ["Base de Conocimiento", "knowledge"], ["Recorridos", "tours"]] : [["Learn", "learning"], ["Tutorials", "tutorials"], ["Knowledge Base", "knowledge"], ["Tours", "tours"]];
  const companyLinks = isEs ? [["Términos", "terms"], ["Privacidad", "privacy"], ["Reembolsos", "refund"], ["Aviso Legal", "disclaimer"]] : [["Terms", "terms"], ["Privacy", "privacy"], ["Refunds", "refund"], ["Disclaimer", "disclaimer"]];
  return (
    <footer className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20">
      <div className="grid gap-5 md:grid-cols-3">
        <Info title={isEs ? "15% Menos Retrasos" : "15% Fewer Delays"} text={isEs ? "La predicción de cuellos de botella con IA identifica riesgos de ruta crítica antes de que se conviertan en sobrecostos de cronograma." : "AI bottleneck prediction identifies critical-path risk before it becomes schedule overrun."} />
        <Info title={isEs ? "Precisión en Takeoff" : "Takeoff Accuracy"} text={isEs ? "Mediciones automatizadas con lógica de factores de desperdicio reducen errores de conteo manual y faltantes de material." : "Automated measurements with waste-factor logic reduce manual counting errors and material shortages."} />
        <Info title={isEs ? "2x Más R?pido en Análisis" : "2x Faster Analysis"} text={isEs ? "ROI en tiempo real, proyecciones de financiamiento y cálculos DSCR convierten horas de hojas de cálculo en minutos." : "Real-time ROI, financing projections, and DSCR calculations turn spreadsheet hours into minutes."} />
      </div>
      <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
        <p className="font-black text-amber-200">{isEs ? "Aviso Importante" : "Important Notice"}</p>
        <p className="mt-2 leading-7 text-slate-300">{isEs ? "Importante: Operitron es una herramienta de apoyo a la toma de decisiones, no una garant?a. Todas las proyecciones, presupuestos y rendimientos son estimaciones basadas en sus datos y suposiciones. Operitron no es responsable de pérdidas, retrasos, sobrecostos, problemas de cumplimiento de c?digos, resultados de financiamiento o resultados de inversión. Siempre verifique los datos y consulte a profesionales licenciados." : "Operitron is decision-support software, not a guarantee. All projections, budgets, and returns are estimates based on your inputs and assumptions. Always verify data and consult licensed professionals."}</p>
      </div>
      <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title={isEs ? "Herramientas" : "Tools"} items={toolLinks} go={go} />
        <FooterColumn title={isEs ? "Más" : "More"} items={moreLinks} go={go} />
        <FooterColumn title={isEs ? "Recursos" : "Resources"} items={resourceLinks} go={go} />
        <FooterColumn title={isEs ? "Empresa" : "Company"} items={companyLinks} go={go} />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-slate-500">
        <p>© 2026 Operitron. {isEs ? "Todos los derechos reservados." : "All rights reserved."}</p>
        <a href="mailto:support@operitron.com" className="font-bold text-cyan-300 transition hover:text-cyan-200">support@operitron.com</a>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items, go }) {
  return <div><p className="font-black text-white">{title}</p><div className="mt-3 grid gap-2">{items.map(([label, page]) => page ? <button key={label} onClick={() => go(page)} className="text-left text-sm text-slate-400 hover:text-cyan-300">{label}</button> : <span key={label} className="text-sm text-slate-500">{label}</span>)}</div></div>;
}

function ToolShell({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <h3 className="text-3xl font-black text-white">{title}</h3>
        {subtitle && <p className="mt-2 leading-7 text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ProjectCard({ project, open, t }) {
  const totalCost = project.purchase + project.repairs + project.expenses;
  const roi = formulas.roi(project.profit, totalCost);
  return (
    <motion.button onClick={open} whileHover={{ y: -6, scale: 1.01 }} className="glow-card rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.07] to-white/[.03] p-4 text-left shadow-2xl shadow-black/20 sm:rounded-3xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <GlowIcon><FolderOpen /></GlowIcon>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">{project.type}</span>
      </div>
      <h4 className="text-xl font-black text-white sm:text-2xl">{project.name}</h4>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin size={15} /> {project.address}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3">
        <MiniMetric label="ARV" value={formatMoney(project.arv)} />
        <MiniMetric label="Profit" value={formatMoney(project.profit)} green />
        <div className="col-span-2 sm:col-span-1"><MiniMetric label="ROI" value={`${roi.toFixed(1)}%`} /></div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-black text-amber-300">{t.openProject}</span>
        <ChevronRight className="text-amber-300" />
      </div>
    </motion.button>
  );
}

function ProjectTools({ t, language, setActiveTool }) {
  return (
    <div className="space-y-5 sm:space-y-7">
      <GlassPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-amber-300">{t.activeProject}</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Silva Construction</h2>
            <p className="mt-2 max-w-2xl text-slate-400">A professional workspace for build phases, budgets, loan calculations, documents, collaborators, and field execution.</p>
          </div>
          <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="secondary-button flex items-center gap-2"><Share2 size={18} /> Share</button>
        </div>
      </GlassPanel>
      <SectionHeader title={t.projectTools} detail={t.projectToolsDetail} />
      <ToolGrid language={language} setActiveTool={setActiveTool} />
    </div>
  );
}

function ToolGrid({ setActiveTool, language = "en" }) {
  const visibleTools = getTools(language);
  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visibleTools.map(([id, title, desc, Icon, badge], index) => (
        <motion.button key={id} whileHover={{ y: -7, scale: 1.015 }} onClick={() => setActiveTool(id)} className={`glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${toolGradient(index)} p-4 text-left shadow-2xl shadow-black/20 sm:rounded-3xl sm:p-6`}>
          <div className="absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-white/10 blur-2xl transition group-hover:bg-amber-400/20" />
          <div className="relative z-10 mb-4 flex items-start justify-between gap-4 sm:mb-6">
            <GlowIcon><Icon /></GlowIcon>
            <div className="flex items-center gap-2">
              <Tooltip text={desc} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-amber-300">{badge}</span>
            </div>
          </div>
          <h4 className="relative z-10 text-xl font-black text-white">{title}</h4>
          <p className="relative z-10 mt-2 text-sm leading-6 text-slate-400">{desc}</p>
          <div className="relative z-10 mt-4 flex items-center gap-2 font-black text-amber-300 sm:mt-6">Open tool <ChevronRight size={18} className="transition group-hover:translate-x-1" /></div>
        </motion.button>
      ))}
    </div>
  );
}

function ToolModal({ t, language, toolId, projects, onSaveProject, onClose }) {
  const tool = getTools(language).find(([id]) => id === toolId) || getTools(language)[0];
  const [, title, desc, Icon] = tool;
  const requiresProject = ["wizard", "underwriter", "loan", "loanCalcs", "todo", "punch", "takeoff", "budget", "subs", "linked", "collab"].includes(toolId);
  const [projectReady, setProjectReady] = useState(!requiresProject);
  const [showExisting, setShowExisting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-0 backdrop-blur-sm sm:p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="h-[100dvh] w-full overflow-y-auto bg-[#080d1f] p-4 pb-24 shadow-2xl shadow-black sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[2rem] sm:border sm:border-white/10 sm:p-6">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-start justify-between gap-3 border-b border-white/10 bg-[#080d1f]/95 p-4 backdrop-blur sm:static sm:mx-0 sm:mt-0 sm:mb-6 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex gap-4">
            <GlowIcon><Icon /></GlowIcon>
            <div>
              <h2 className="text-xl font-black text-white sm:text-3xl">{title}</h2>
              <p className="mt-1 hidden text-slate-400 sm:block">{desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-white/10 p-3 text-slate-300 hover:border-amber-400/50 hover:text-white"><X /></button>
        </div>
        {projectReady ? <ToolBody t={t} language={language} toolId={toolId} project={selectedProject} /> : <ProjectPicker language={language} toolTitle={title} projects={projects} showExisting={showExisting} setShowExisting={setShowExisting} onSaveProject={onSaveProject} selectProject={(project) => { setSelectedProject(project); setProjectReady(true); }} />}
      </motion.div>
    </div>
  );
}

function ProjectPicker({ language, toolTitle, projects = [], showExisting, setShowExisting, onSaveProject, selectProject }) {
  const isEs = language === "es";
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const filteredProjects = projects.filter((project) => `${project.name || ""} ${project.address || ""} ${project.description || ""}`.toLowerCase().includes(query.toLowerCase()));

  async function createProject() {
    const name = projectName.trim();
    if (!name) return;
    setSaving(true);
    const project = {
      id: Date.now(),
      name,
      title: name,
      type: "Project",
      address: "",
      description: description.trim(),
      notes: description.trim(),
      arv: 0,
      profit: 0,
      roi: 0,
      progress: 0,
      status: "Active",
      data: { description: description.trim(), createdFrom: toolTitle },
    };
    const saved = onSaveProject ? await onSaveProject(project) : project;
    setSaving(false);
    selectProject(saved?.project || saved || project);
  }

  if (creating) {
    return (
      <div className="mx-auto mt-6 max-w-xl rounded-[2rem] border border-white/10 bg-white/[.035] p-5 shadow-2xl shadow-black/30 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-white">{isEs ? "Nuevo Proyecto" : "New Project"}</h3>
          <button onClick={() => setCreating(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X size={18} /></button>
        </div>
        <label className="mt-6 block">
          <span className="label">{isEs ? "Nombre del proyecto" : "Project Name"}</span>
          <input autoFocus value={projectName} onChange={(event) => setProjectName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createProject(); }} className="field text-base" placeholder={isEs ? "Ej. Remodelaci?n Silva" : "Example: Silva Remodel"} />
        </label>
        <label className="mt-4 block">
          <span className="label">{isEs ? "Descripci?n (opcional)" : "Description (optional)"}</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="field min-h-24 resize-y text-base" placeholder={isEs ? "Notas, direcci?n, alcance o contexto..." : "Notes, address, scope, or context..."} />
        </label>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={() => setCreating(false)} className="secondary-button">{isEs ? "Cancelar" : "Cancel"}</button>
          <button onClick={createProject} disabled={!projectName.trim() || saving} className="primary-button disabled:cursor-not-allowed disabled:opacity-50">{saving ? (isEs ? "Guardando..." : "Saving...") : (isEs ? "Crear Proyecto" : "Create Project")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-[2rem] border border-white/10 bg-white/[.035] p-5 shadow-2xl shadow-black/30 sm:p-7">
      <h3 className="text-2xl font-black text-white">{isEs ? "Selecciona un Proyecto" : "Select a Project"}</h3>
      <p className="mt-2 text-slate-400">{isEs ? "Elige un proyecto para usar con" : "Choose a project to use with"} <span className="font-black text-cyan-300">{toolTitle}</span></p>
      {!showExisting ? <div className="mt-7 grid gap-3">
        <button onClick={() => setCreating(true)} className="primary-button flex items-center justify-center gap-2"><Plus size={18} />{isEs ? "Crear Nuevo Proyecto" : "Create New Project"}</button>
        <button onClick={() => setShowExisting(true)} className="secondary-button flex items-center justify-center gap-2"><FolderOpen size={18} />{isEs ? "Usar Proyecto Existente" : "Use Existing Project"}</button>
      </div> : <div className="mt-6 space-y-4">
        <label className="block">
          <span className="sr-only">{isEs ? "Buscar proyectos" : "Search projects"}</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/75 px-4 transition focus-within:border-cyan-300 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,.12)]">
            <Search className="text-slate-500" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500" placeholder={isEs ? "Buscar proyectos..." : "Search projects..."} />
          </div>
        </label>
        <div className="max-h-72 space-y-3 overflow-y-auto pr-2 [scrollbar-color:rgba(34,211,238,.55)_rgba(15,23,42,.75)] [scrollbar-width:thin]">
          {filteredProjects.length ? filteredProjects.map((project) => <button key={project.id} onClick={() => selectProject(project)} className="glow-card flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left hover:border-cyan-300/35">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-300/10 text-amber-300"><FolderOpen size={19} /></span>
            <span className="min-w-0 flex-1"><span className="block truncate font-black text-white">{project.name || project.title || "Untitled Project"}</span><span className="block truncate text-sm text-slate-400">{project.description || project.address || project.notes || (isEs ? "Sin descripci?n" : "No description")}</span></span>
            <ChevronRight className="shrink-0 text-cyan-300" size={18} />
          </button>) : <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-5 text-center text-sm text-slate-400">{isEs ? "No encontramos proyectos con esa b?squeda." : "No projects match that search."}</div>}
        </div>
        <button onClick={() => setShowExisting(false)} className="secondary-button w-full">{isEs ? "Volver" : "Back"}</button>
      </div>}
    </div>
  );
}

function ToolModalFrame({ children, onClose }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-0 backdrop-blur-sm sm:p-4"><motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative flex h-[100dvh] w-full items-center bg-[#080d1f] p-4 shadow-2xl shadow-black sm:h-auto sm:max-w-xl sm:rounded-[2rem] sm:border sm:border-white/10 sm:p-6"><button aria-label="Close" onClick={onClose} className="absolute right-5 top-5 z-10 rounded-xl border border-white/10 p-2 text-slate-300 hover:border-cyan-300/50"><X size={18} /></button>{children}</motion.div></div>;
}

function SubscriptionGate({ language, go }) {
  const isEs = language === "es";
  return <section className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 p-7"><DollarSign className="text-cyan-300" size={32} /><h2 className="mt-5 pr-8 text-2xl font-black text-white">{isEs ? "Activa tu prueba de 3 días" : "Activate your 3-day trial"}</h2><p className="mt-3 leading-7 text-slate-300">{isEs ? "Las herramientas profesionales se habilitan con un plan Mensual o Anual activo. Comienza de forma segura con Stripe Checkout." : "Professional tools unlock with an active Monthly or Annual plan. Start securely through Stripe Checkout."}</p><button onClick={() => go("pricing")} className="primary-button mt-6">{isEs ? "Ver planes" : "View plans"}</button></section>;
}

function OwnerConsole({ language, user, go, setActiveTool }) {
  const isEs = language === "es";
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("");
  const [checking, setChecking] = useState(false);
  const [stripeStatus, setStripeStatus] = useState("");
  const [stripeChecking, setStripeChecking] = useState(false);
  const toolsForOwner = getTools(language);

  async function fetchAdminHealth({ production = false, stripe = false } = {}) {
    if (production) setChecking(true);
    if (stripe) setStripeChecking(true);
    setStatus("");
    if (stripe) setStripeStatus("");
    try {
      if (!supabase) throw new Error(isEs ? "La autenticación no está configurada." : "Authentication is not configured.");
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(isEs ? "Inicia sesión para continuar." : "Sign in to continue.");
      const response = await fetch("/api/admin-health", { headers: { Authorization: `Bearer ${token}` } });
      const result = await readApiJson(response);
      if (!response.ok) throw new Error(result.error || (isEs ? "No se pudo verificar producción." : "Production check could not be completed."));
      setReport(result);
      if (stripe) setStripeStatus(isEs ? "Configuración de Stripe verificada. No se cre? ning?n cargo." : "Stripe configuration checked. No charge was created.");
    } catch (error) {
      if (stripe) setStripeStatus(error.message);
      else setStatus(error.message);
    } finally {
      if (production) setChecking(false);
      if (stripe) setStripeChecking(false);
    }
  }

  function checkProduction() {
    fetchAdminHealth({ production: true });
  }

  function checkStripeConfiguration() {
    fetchAdminHealth({ stripe: true });
  }

  useEffect(() => {
    checkProduction();
  }, []);

  const visibleChecks = report?.checks || [];
  const issues = visibleChecks.filter((check) => !check.ok);
  const stripeChecks = report?.stripeConfig || [];
  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-cyan-400/[.12] via-slate-950 to-purple-500/[.12] p-6 shadow-[0_0_48px_rgba(34,211,238,.1)] sm:p-8">
      <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">{isEs ? "Control del Propietario" : "Owner Console"}</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{isEs ? "Acceso total de Operitron" : "Operitron full-access control"}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">{isEs ? "Tu identidad administrativa omite el cobro para desarrollo, revisi?n y control de todas las herramientas del producto." : "Your administrator identity bypasses billing for product development, review, and control across every workspace tool."}</p>
          <p className="mt-3 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">{user?.email} | {isEs ? "Administrador" : "Administrator"}</p>
        </div>
        <button onClick={checkProduction} disabled={checking} className="primary-button whitespace-nowrap disabled:opacity-60">{checking ? (isEs ? "Verificando..." : "Checking...") : (isEs ? "Verificar sistema" : "Run system check")}</button>
      </div>
    </section>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <GlassPanel>
        <SectionHeader title={isEs ? "Acceso a Herramientas" : "Tool Access"} detail={isEs ? "Las ocho áreas profesionales están desbloqueadas para tu cuenta administrativa." : "All eight professional work areas are unlocked for your administrator account."} />
        <div className="grid gap-3 sm:grid-cols-2">
          {toolsForOwner.map(([id, title, detail, Icon]) => <button key={id} onClick={() => setActiveTool(id)} className="glow-card flex gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-left transition hover:border-cyan-300/35"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Icon size={19} /></span><span><span className="block font-black text-white">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{detail}</span></span></button>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => go("dashboard")} className="secondary-button">{isEs ? "Abrir panel" : "Open dashboard"}</button>
          <button onClick={() => go("projectTools")} className="secondary-button">{isEs ? "Abrir proyectos" : "Open project tools"}</button>
          <button onClick={() => go("propertySearch")} className="secondary-button">{isEs ? "Abrir propiedad" : "Open property search"}</button>
        </div>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader title={isEs ? "Estado de Producci?n" : "Production Readiness"} detail={isEs ? "Comprobaciones privadas para detectar configuraci?n faltante." : "Private checks to surface missing configuration."} />
        {status && <p className="rounded-xl border border-red-300/25 bg-red-400/10 p-3 text-sm leading-6 text-red-200">{status}</p>}
        {!status && !report && <p className="text-sm text-slate-400">{isEs ? "Cargando verificaciones..." : "Loading checks..."}</p>}
        <div className="space-y-3">
          {visibleChecks.map((check) => <div key={check.name} className={`rounded-2xl border p-3 ${check.ok ? "border-emerald-300/15 bg-emerald-300/[.06]" : "border-amber-300/20 bg-amber-300/[.07]"}`}>
            <p className={`flex items-center gap-2 text-sm font-black ${check.ok ? "text-emerald-300" : "text-amber-300"}`}>{check.ok ? <CheckCircle2 size={16} /> : <HelpCircle size={16} />}{check.name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{check.detail}</p>
          </div>)}
        </div>
        {issues.length > 0 && <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-3 text-sm leading-6 text-amber-100">{isEs ? "Los elementos en amarillo requieren configuraci?n antes de guardar datos o procesar servicios conectados." : "Yellow items require configuration before related data can save or connected services can run."}</p>}
      </GlassPanel>
    </div>

    <GlassPanel>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <SectionHeader title={isEs ? "Checklist de Lanzamiento" : "Launch Checklist"} detail={isEs ? "Verificaci?n segura y de solo lectura. No crea checkout ni cobra tarjetas." : "Safe read-only verification. It does not create checkout sessions or charge cards."} />
        <button onClick={checkStripeConfiguration} disabled={stripeChecking} className="primary-button whitespace-nowrap disabled:cursor-wait disabled:opacity-60">{stripeChecking ? (isEs ? "Verificando..." : "Checking...") : "Check Stripe Configuration"}</button>
      </div>
      {stripeStatus && <p className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[.08] p-3 text-sm leading-6 text-cyan-100">{stripeStatus}</p>}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {(stripeChecks.length ? stripeChecks : [
          { name: "Stripe keys loaded", ok: false, detail: "Click Check Stripe Configuration." },
          { name: "Monthly price ID loaded", ok: false, detail: "Click Check Stripe Configuration." },
          { name: "Annual price ID loaded", ok: false, detail: "Click Check Stripe Configuration." },
          { name: "Webhook secret configured", ok: false, detail: "Click Check Stripe Configuration." },
          { name: "Supabase service role configured", ok: false, detail: "Click Check Stripe Configuration." },
        ]).map((check) => <div key={check.name} className={`rounded-2xl border p-4 ${check.ok ? "border-emerald-300/20 bg-emerald-300/[.065]" : "border-red-300/20 bg-red-400/[.065]"}`}>
          <p className={`flex items-center gap-2 text-sm font-black ${check.ok ? "text-emerald-300" : "text-red-200"}`}>{check.ok ? <CheckCircle2 size={17} /> : <X size={17} />}{check.ok ? "PASS" : "FAIL"} | {check.name}</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">{check.detail}</p>
        </div>)}
      </div>
    </GlassPanel>
  </div>;
}

function PremiumPaywall({ language, user, go }) {
  const isEs = language === "es";
  const perks = isEs
    ? ["Analizador IA y underwriting avanzado", "Calculadoras DSCR, BRRR y cash-out", "Proyectos, reportes, Dropbox y colaboración", "Rastreo de construcción y takeoff de materiales"]
    : ["AI analysis and advanced underwriting", "DSCR, BRRR, and cash-out calculators", "Projects, reports, Dropbox, and collaboration", "Construction tracking and material takeoffs"];
  return <div className="mx-auto max-w-5xl space-y-7"><section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-cyan-400/12 via-slate-950 to-purple-500/12 p-6 text-center shadow-[0_0_55px_rgba(34,211,238,.12)] sm:p-10"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" /><Sparkles className="relative mx-auto text-cyan-300" size={38} /><p className="relative mt-5 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">OPERITRON.COM</p><h1 className="relative mx-auto mt-3 max-w-3xl text-3xl font-black text-white sm:text-5xl">{isEs ? "Comienza tu prueba gratis de 3 días" : "Start your 3-day free trial"}</h1><p className="relative mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{isEs ? "Tu cuenta está lista. Las herramientas profesionales se activan cuando inicias una suscripción Mensual o Anual mediante Stripe Checkout." : "Your account is ready. Professional tools activate when you start a Monthly or Annual subscription through secure Stripe Checkout."}</p><p className="relative mt-4 text-sm font-bold text-slate-400">{user?.email}</p><div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => go("pricing")} className="primary-button">{isEs ? "Ver planes e iniciar prueba" : "View plans and start trial"}</button><button onClick={() => go("profile")} className="secondary-button">{isEs ? "Mi cuenta" : "My account"}</button></div></section><div className="grid gap-4 md:grid-cols-2">{perks.map((perk) => <div key={perk} className="rounded-2xl border border-white/10 bg-white/[.045] p-5 text-slate-200"><CheckCircle2 className="mb-3 text-cyan-300" size={20} /><p className="font-bold">{perk}</p></div>)}</div></div>;
}

function ToolBody({ t, language, toolId, project }) {
  if (toolId === "wizard") return <ConstructionWizard language={language} project={project} />;
  if (toolId === "underwriter") return <DealUnderwriter language={language} project={project} />;
  if (toolId === "loan" || toolId === "loanCalcs") return <InvestmentLoanCalculator language={language} project={project} />;
  if (toolId === "todo") return <Checklist project={project} items={language === "es" ? ["Ordenar armaduras", "Confirmar inspección de cimentación", "Recopilar tres ofertas de HVAC", "Programar cuadrilla de drywall"] : ["Order trusses", "Confirm foundation inspection", "Collect three HVAC bids", "Schedule drywall crew"]} language={language} />;
  if (toolId === "punch") return <PunchListApp language={language} project={project} />;
  if (toolId === "takeoff") return <AITakeoff language={language} project={project} />;
  if (toolId === "budget") return <BudgetEstimator language={language} project={project} />;
  if (toolId === "subs") return <div className="space-y-6"><SubsQuotes language={language} project={project} /><section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"><Collaborators language={language} project={project} embedded /></section></div>;
  if (toolId === "linked") return <LinkedItems language={language} project={project} />;
  if (toolId === "collab") return <Collaborators language={language} project={project} />;
  return <AIAssistant t={t} large />;
}

function createConstructionPhases(answers) {
  return [
    { name: "Contracts", weeks: 2, tasks: ["Land Purchase", "Land Documents (Deeds, Title Insurance)", "Consult with insurance agent and obtain Builder's Risk policy", "Sign Construction Agreement"] },
    { name: "Pre-Construction Preparation and Design", weeks: 2, tasks: ["Buy plans or hire architect", "Request and verify plan modifications", "Verify municipal construction requirements", "Coordinate municipal sewer connection", "Order JD Manual (AC Manual)", "Order Land Survey", "Pay city or county fees", "Apply for construction permits and pay", "Obtain construction permits", "Install security cameras at construction site", "Install permit box with permits and plans", "Arrange debris container / roll-off dumpster delivery", "Arrange portable sanitation unit", "Order temporary electricity pole installation", "Pay water service fee", "Define interior design, finishes, and color palettes", "Choose cabinets and confirm lead time", "Order Windows and Exterior Doors - Critical Order", "Select appliances and confirm lead times"] },
    { name: "Land Preparation", weeks: 1, tasks: ["Evaluate land and soil conditions", "Mark trees to preserve", "Call 811 before excavation", "Clear additional trees for parking", "Remove approved trees", "Grade the land", "Perform soil compaction", "Commission professional soil compaction test", "Install erosion control barriers", "Develop an excavation plan"] },
    { name: `Foundation - ${answers.foundation.includes("Slab") ? "Slab" : answers.foundation}`, weeks: 2, tasks: ["Service portable sanitation unit if applicable", "Excavate foundation trenches (footings)", "Place slab-edge form boards", "Form underground plumbing", "Excavate interior and exterior beam trenches", "Pour gravel and sand per local code", "Install plastic moisture barrier", "Insert steel reinforcement in footings", "Form underground electricity", "Order lumber and schedule delivery - Critical Order", "Pour concrete", "Install drainage elements"] },
    { name: "Wood Framing", weeks: 3, tasks: ["Service portable sanitation unit", "Schedule debris container exchange", "Install sealed bottom plate for air and pest control", `Install ${answers.structure} framing structure`, "Verify exterior and interior door rough openings", "Order Interior Doors and Trim - Critical Order", "Install blocking for TVs, curtains, cabinets, and hood", "Install exterior doors and windows", "Measure and verify interior door sizes", "Order Roofing Materials and Delivery - Critical Order"] },
    { name: "Roofing", weeks: 1.5, tasks: ["Service portable sanitation unit if applicable", "Exchange debris container", `Install ${answers.roof}`, "Locate and prepare gutters"] },
    { name: "Rough-In (HVAC, Plumbing, Electrical)", weeks: 2.5, tasks: ["Service portable sanitation unit", "Order Garage Door - Critical Order", "Order Interior Doors and Trim Package - Critical Order", "Verify kitchen cabinet layout and clearances", "Order Cabinets - Critical Order", "Locate AC ducts", "Install secondary drain pan for air handler", "Install rough-in plumbing", "Define water heater size", "Rough in water outlets and drains", "Install rough-in electrical", "Install internet and cable pathways", "Install gas lines if required", "Verify cabinet layout locations", "Order Exterior Siding Materials - Critical Order"] },
    { name: "Insulation", weeks: 1, tasks: ["Service portable sanitation unit", "Install exterior insulation", "Install interior insulation", "Install attic and roof insulation", "Review plans before drywall", "Verify support wood blocking"] },
    { name: "Drywall", weeks: 2, tasks: ["Service portable sanitation unit", "Install water-resistant drywall in wet areas", "Install sheetrock / drywall", "Tape and mud coat 1, cure and sand", "Tape and mud coat 2, cure and sand", "Tape and mud coat 3, final cure and sand", "Prime drywall for paint", "Order Appliances - Critical Order", "Call electric company for permanent service"] },
    { name: "Exterior Siding", weeks: 2, tasks: ["Install selected exterior siding", "Install exterior trim and molding", "Complete exterior carpentry"] },
    { name: "Interior Trim", weeks: 3.5, tasks: ["Service portable sanitation unit", "Order Tile Materials and Schedule Delivery - Critical Order", "Order Flooring Delivery - Critical Order", "Install interior doors", "Install ceramic flooring in bathrooms and laundry", "Install shower wall tile", "Install cabinets", "Install cabinet hardware", "Measure countertop surfaces", "Install baseboards", "Install closet shelving", "Install pantry shelving", "Install flooring", "Order Carpet Materials and Delivery - Critical Order", "Install carpet", "Install shoe molding", "Install countertops", "Install backsplash"] },
    { name: "Paint", weeks: 1, tasks: ["Choose paint finish", "Test paint colors on small sections", "Apply primer", "Protect surfaces and paint", "Apply water-repellent exterior paint", "Stain, clear-coat, or paint woodwork"] },
    { name: "Final Finishes", weeks: 2, tasks: ["Service portable sanitation unit", "Complete HVAC trim-out and install condenser", "Install faucets and plumbing fixtures", "Install lights, fans, and electrical fixtures", "Install appliances", "Install hardware and pulls", "Install gutters", "Install concrete driveway", "Install walkway", "Connect and test gas appliances", "Complete gas pressure test and inspection", "Order preventive termite treatment", "Review final details and touch-ups", "Final portable sanitation service"] },
    { name: "Project Completion", weeks: 1, tasks: ["Complete final construction inspection", "Obtain certificate of occupancy", "Complete owner handover", "Choose and purchase home warranty"] },
  ];
}

function ConstructionWizard({ language = "en", project }) {
  const [step, setStep] = useState(1);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [operator, setOperator] = useState({
    type: "Builder / Remodeler",
    company: "Silva Construction",
    market: "Santa Rosa Beach, FL",
    goal: "Plan a profitable new build",
  });
  const [answers, setAnswers] = useState({
    foundation: "Slab (Losa)",
    finish: "Semi-Luxury",
    structure: "Wood Framing",
    stories: "1 Story",
    garage: "2-Car Garage",
    roof: "Asphalt Shingles",
    lot: "Flat Lot",
    driveway: "Concrete",
    water: "City Water",
    sewer: "City Sewer",
    heating: "Heat Pump",
    bathrooms: "2 Bathrooms",
    patio: "Medium (200-400 sq ft)",
    landscaping: "Small (up to 1/4 acre)",
    permit: "Standard Permits",
    sqft: 2000,
    fireplace: false,
    gas: false,
    carpet: false,
  });
  const [siding, setSiding] = useState({ "Vinyl Siding": 100, "Hardiboard / Fiber Cement": 0, Brick: 0, Stone: 0, Stucco: 0, "Wood Siding": 0 });
  const progress = Math.round((step / 9) * 100);
  const update = (key, value) => setAnswers((old) => ({ ...old, [key]: value }));
  const updateOperator = (key, value) => setOperator((old) => ({ ...old, [key]: value }));
  const sidingTotal = Object.values(siding).reduce((sum, value) => sum + cleanNumber(value), 0);
  const setSidingPct = (key, value) => setSiding((old) => ({ ...old, [key]: Math.max(0, Math.min(100, cleanNumber(value))) }));
  const checklist = [
    `Operator setup: ${operator.type}, ${operator.company}, market: ${operator.market}, goal: ${operator.goal}`,
    `Foundation: ${answers.foundation}`,
    `Finish level: ${answers.finish}`,
    `Structure: ${answers.structure}, ${answers.stories}, ${answers.garage}`,
    `Exterior siding: ${Object.entries(siding).filter(([, v]) => cleanNumber(v) > 0).map(([k, v]) => `${k} ${v}%`).join(" | ") || "Not assigned"}`,
    `Roof: ${answers.roof}`,
    `Site: ${answers.lot}, driveway: ${answers.driveway}`,
    `Utilities: ${answers.water}, ${answers.sewer}, ${answers.heating}`,
    `Bathrooms/extras: ${answers.bathrooms}, patio: ${answers.patio}, landscaping: ${answers.landscaping}`,
    `Permits: ${answers.permit}, square footage: ${formatNumber(answers.sqft, 0)} sqft`,
  ];
  function generateChecklist() {
    const sqft = Math.max(500, cleanNumber(answers.sqft));
    const highFinish = answers.finish === "Luxury" ? 1.22 : answers.finish === "Semi-Luxury" ? 1.1 : 1;
    const phases = createConstructionPhases(answers);
    const totalWeeks = phases.reduce((sum, phase) => sum + phase.weeks, 0);
    const baseCost = sqft * (answers.finish === "Luxury" ? 245 : answers.finish === "Semi-Luxury" ? 194 : 158);
    const extras = (answers.fireplace ? 6500 : 0) + (answers.gas ? 4800 : 0) + (answers.carpet ? 3200 : 0);
    setGeneratedPlan({
      phases,
      totalWeeks,
      estimatedCost: baseCost + extras,
      contingency: (baseCost + extras) * 0.1,
      risk: answers.permit !== "Standard Permits" || answers.lot !== "Flat Lot" ? "Moderate" : "Controlled",
    });
  }

  return (
    <div className="space-y-6">
      <ProjectContext project={project} language={language} />
      <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-amber-400/5 p-5 shadow-[0_0_40px_rgba(34,211,238,.10)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-cyan-300">OPERITRON.COM Pro Setup</p>
            <h3 className="mt-2 text-2xl font-black text-white">Tailor this build plan to your role</h3>
            <p className="mt-2 max-w-2xl leading-7 text-slate-400">Tell Operitron who is running the project so the checklist, budget prompts, and next steps fit the way you operate.</p>
          </div>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-200">AI Real Estate Operating System</span>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">What best describes you?</p>
            <Segmented options={["Investor", "Builder / Remodeler", "Developer", "General Contractor", "Property Owner"]} value={operator.type} onChange={(value) => updateOperator("type", value)} />
          </div>
          <div className="grid gap-3">
            <input className="field" value={operator.company} onChange={(e) => updateOperator("company", e.target.value)} placeholder="Company or project group" />
            <input className="field" value={operator.market} onChange={(e) => updateOperator("market", e.target.value)} placeholder="Primary market" />
            <select className="field" value={operator.goal} onChange={(e) => updateOperator("goal", e.target.value)}>
              <option>Plan a profitable new build</option>
              <option>Estimate construction scope</option>
              <option>Prepare lender draw schedule</option>
              <option>Coordinate subs and inspections</option>
              <option>Build an investor-ready report</option>
            </select>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-3xl font-black text-white">Construction Wizard</h3>
            <p className="mt-1 font-bold text-cyan-300">Step {step} of 9</p>
          </div>
          <motion.p key={progress} initial={{ opacity: 0.45, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="text-3xl font-black text-amber-300">{progress}%</motion.p>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
          <motion.div initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.45, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-purple-400 to-amber-300 shadow-[0_0_24px_rgba(34,211,238,.35)]" />
        </div>
      </div>

      {step === 1 && <WizardStep title="Foundation Type" detail="Select the type of foundation for your project"><OptionGrid options={[["Slab (Losa)", "Concrete poured directly on ground level"], ["Basement (Sótano)", "Full basement below ground level"], ["Crawlspace (Espacio de Acceso)", "Elevated foundation with access space"]]} value={answers.foundation} onChange={(value) => update("foundation", value)} /></WizardStep>}
      {step === 2 && <WizardStep title="Finish Level" detail="Select the quality level of finishes"><OptionGrid options={[["Basic", "Standard finishes, cost-effective"], ["Semi-Luxury", "Upgraded finishes, mid-range quality"], ["Luxury", "High-end finishes, premium quality"]]} value={answers.finish} onChange={(value) => update("finish", value)} /></WizardStep>}
      {step === 3 && <WizardStep title="Building Structure" detail="Configure the structure type, building size and garage"><WizardGroup title="Structure Type"><OptionGrid compact options={[["Wood Framing", "Traditional wood stud framing"], ["Concrete Block", "CMU / concrete block walls"]]} value={answers.structure} onChange={(value) => update("structure", value)} /></WizardGroup><WizardGroup title="Number of Stories"><OptionGrid compact options={[["1 Story", "Single-level home"], ["2 Stories", "Two-level home"], ["3+ Stories", "Three or more levels"]]} value={answers.stories} onChange={(value) => update("stories", value)} /></WizardGroup><WizardGroup title="Garage Size"><Segmented options={["No Garage", "1-Car Garage", "2-Car Garage", "3-Car Garage"]} value={answers.garage} onChange={(value) => update("garage", value)} /></WizardGroup></WizardStep>}
      {step === 4 && <WizardStep title="Exterior Siding" detail="Select one or more siding materials and drag each share to total 100%."><div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-4"><span className="font-black text-white">Total: {sidingTotal}%</span><span className={sidingTotal === 100 ? "font-black text-emerald-300" : "font-black text-amber-300"}>{sidingTotal === 100 ? "Ready" : "Adjust to 100%"}</span></div><div className="grid gap-3 md:grid-cols-2">{Object.entries(siding).map(([name, pct]) => <div key={name} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-white">{name}</p><p className="text-sm text-slate-400">{sidingDescription(name)}</p></div><span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-200">{pct}%</span></div><label className="mt-4 block"><span className="sr-only">{name} percentage</span><input type="range" min="0" max="100" step="1" value={pct} onChange={(e) => setSidingPct(name, e.target.value)} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-300" /></label></div>)}</div></WizardStep>}
      {step === 5 && <WizardStep title="Roof Type" detail="Select the roofing material"><Segmented options={["Asphalt Shingles", "Metal Roof", "Tile Roof"]} value={answers.roof} onChange={(value) => update("roof", value)} /></WizardStep>}
      {step === 6 && <WizardStep title="Site Conditions" detail="Describe your lot and driveway preferences"><WizardGroup title="Lot Condition"><OptionGrid options={[["Flat Lot", "Level ground, minimal grading needed"], ["Sloped Lot", "Requires grading and retaining walls"], ["Heavily Wooded", "Tree removal and clearing needed"], ["Requires Fill", "Low area requiring fill dirt"]]} value={answers.lot} onChange={(value) => update("lot", value)} /></WizardGroup><WizardGroup title="Driveway Type"><Segmented options={["No Driveway", "Gravel", "Asphalt", "Concrete", "Pavers"]} value={answers.driveway} onChange={(value) => update("driveway", value)} /></WizardGroup></WizardStep>}
      {step === 7 && <WizardStep title="Utilities & Systems" detail="Configure water source and heating system"><WizardGroup title="Water Source"><OptionGrid compact options={[["City Water", "Municipal water connection"], ["Well Water", "Private well drilling required"]]} value={answers.water} onChange={(value) => update("water", value)} /></WizardGroup><WizardGroup title="Sewer System"><OptionGrid options={[["City Sewer", "Connected to municipal sewer line"], ["Septic System", "Private on-site septic tank and drain field"], ["Engineered Septic System", "Engineered system for challenging soils (mound, drip, etc.)"]]} value={answers.sewer} onChange={(value) => update("sewer", value)} /></WizardGroup><WizardGroup title="Heating System"><OptionGrid options={[["Forced Air", "Standard HVAC system"], ["Radiant Floor", "In-floor heating system"], ["Heat Pump", "Energy-efficient heating and cooling"]]} value={answers.heating} onChange={(value) => update("heating", value)} /></WizardGroup></WizardStep>}
      {step === 8 && <WizardStep title="Bathrooms & Extras" detail="Configure bathroom count and outdoor living"><WizardGroup title="Number of Bathrooms"><Segmented options={["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4+ Bathrooms"]} value={answers.bathrooms} onChange={(value) => update("bathrooms", value)} /></WizardGroup><WizardGroup title="Deck/Patio Size"><Segmented options={["None", "Small (up to 200 sq ft)", "Medium (200-400 sq ft)", "Large (400+ sq ft)"]} value={answers.patio} onChange={(value) => update("patio", value)} /></WizardGroup><WizardGroup title="Landscaping Area Size"><Segmented options={["None", "Small (up to 1/4 acre)", "Medium (1/4-1/2 acre)", "Large (1/2+ acre)"]} value={answers.landscaping} onChange={(value) => update("landscaping", value)} /></WizardGroup></WizardStep>}
      {step === 9 && <WizardStep title="Permits & Regulations" detail="Indicate any special permit requirements"><WizardGroup title="Permit Complexity"><OptionGrid options={[["Standard Permits", "Regular building permits"], ["Historic District", "Additional historic preservation review"], ["Wetlands/Environmental", "Environmental impact studies required"], ["HOA Approval", "Homeowners association review needed"]]} value={answers.permit} onChange={(value) => update("permit", value)} /></WizardGroup><WizardGroup title="Additional Options"><div className="grid gap-3 md:grid-cols-3">{[["fireplace", "Fireplace"], ["gas", "Gas Lines"], ["carpet", "Carpet in Bedrooms"]].map(([key, label]) => <button key={key} onClick={() => update(key, !answers[key])} className={`rounded-2xl border p-4 text-left font-black transition ${answers[key] ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-cyan-300/30"}`}>{label}</button>)}</div></WizardGroup><NumberInput label="Square Footage" value={answers.sqft} setValue={(value) => update("sqft", value)} /></WizardStep>}

      <div className="flex flex-wrap justify-between gap-3">
        <button onClick={() => setStep(Math.max(1, step - 1))} className="secondary-button" disabled={step === 1}>Previous</button>
        {step < 9 ? <button onClick={() => setStep(Math.min(9, step + 1))} className="primary-button">Next</button> : <button onClick={generateChecklist} className="primary-button">Generate Checklist</button>}
      </div>

      <EmbeddedConstructionProgress plan={generatedPlan} language={language} />
      {step === 9 && !generatedPlan && <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5"><h4 className="text-xl font-black text-white">Ready to Generate</h4><p className="mt-2 text-slate-300">Your checklist will be built from the selections above, including schedule duration, estimated construction cost, contingency, and risk flags.</p></div>}
      {generatedPlan && <SmartConstructionChecklist plan={generatedPlan} assumptions={checklist} language={language} />}
    </div>
  );
}

function EmbeddedConstructionProgress({ plan, language }) {
  const isEs = language === "es";
  const phases = plan?.phases || [
    { name: "Contracts", weeks: 2 },
    { name: "Pre-Construction", weeks: 2 },
    { name: "Foundation", weeks: 2 },
    { name: "Framing", weeks: 3 },
    { name: "Rough-In", weeks: 2.5 },
    { name: "Final Finishes", weeks: 2 },
  ];
  const totalWeeks = plan?.totalWeeks || phases.reduce((sum, phase) => sum + phase.weeks, 0);
  const completed = plan ? Math.min(35, Math.round((phases.filter((phase) => phase.complete).length / Math.max(phases.length, 1)) * 100)) : 0;
  return <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300"><BarChart3 /></div>
        <div>
          <h4 className="text-xl font-black text-white">{isEs ? "Progreso de Construcción" : "Construction Progress"}</h4>
          <p className="text-sm text-slate-400">{isEs ? "Integrado dentro del asistente: cronograma, presupuesto, fotos y avance." : "Built into the wizard: schedule, budget, photos, and completion tracking."}</p>
        </div>
      </div>
      <MiniMetric label={isEs ? "Duración" : "Duration"} value={`${totalWeeks} ${isEs ? "sem" : "wks"}`} />
    </div>
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"><motion.div initial={false} animate={{ width: `${completed || 8}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-300" /></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {phases.slice(0, 6).map((phase, index) => <div key={phase.name} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><p className="text-xs font-black text-cyan-300">0{index + 1}</p><p className="mt-1 font-black text-white">{phase.name}</p><p className="mt-1 text-sm text-slate-400">~{phase.weeks} {isEs ? "semanas" : "weeks"}</p></div>)}
    </div>
  </section>;
}

function GeneratedConstructionChecklist({ plan, assumptions, language }) {
  const isEs = language === "es";
  const maxWeeks = Math.max(...plan.phases.map((phase) => phase.weeks), 1);
  return <section className="space-y-5 rounded-3xl border border-cyan-300/25 bg-slate-950/70 p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEs ? "Plan Generado" : "Generated Plan"}</p>
        <h4 className="mt-2 text-2xl font-black text-white">{isEs ? "Tu Lista de Construcción" : "Your Construction Checklist"}</h4>
        <p className="mt-2 text-sm text-slate-400">{isEs ? "Fases y tareas creadas desde las especificaciones de tu proyecto." : "Phases and tasks created from your project specifications."}</p>
      </div>
      <button className="secondary-button">{isEs ? "Guardar en Proyecto" : "Save to Project"}</button>
    </div>
    <div className="grid gap-3 sm:grid-cols-4">
      <MiniMetric label={isEs ? "Duración Estimada" : "Estimated Duration"} value={`${plan.totalWeeks} ${isEs ? "semanas" : "weeks"}`} />
      <MiniMetric label={isEs ? "Costo Construcción" : "Construction Cost"} value={formatMoney(plan.estimatedCost)} />
      <MiniMetric label={isEs ? "Contingencia 10%" : "10% Contingency"} value={formatMoney(plan.contingency)} />
      <MiniMetric label={isEs ? "Riesgo de Programa" : "Schedule Risk"} value={plan.risk} />
    </div>
    <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
      <div className="space-y-3">{plan.phases.map((phase, index) => <details key={phase.name} className="rounded-2xl border border-white/10 bg-white/[.03] p-4" open={index < 2}><summary className="flex cursor-pointer list-none items-center gap-3"><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${phase.complete ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>{index + 1}</span><span className="flex-1 font-black text-white">{phase.name}</span><span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">{phase.weeks} wk</span><span className="h-2 w-20 rounded-full bg-slate-800"><span className="block h-full rounded-full bg-cyan-300" style={{ width: `${phase.weeks / maxWeeks * 100}%` }} /></span></summary><div className="ml-10 mt-4 grid gap-2">{phase.tasks.map((task) => <label key={task} className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" className="accent-cyan-300" defaultChecked={phase.complete} />{task}</label>)}</div></details>)}</div>
      <div className="space-y-4">
        <Info title={isEs ? "Recomendaci?n de IA" : "AI Recommendation"} text={plan.risk === "Moderate" ? (isEs ? "Confirma permisos y condiciones del terreno antes de comprometer cuadrillas." : "Confirm permitting and site conditions before committing crews.") : (isEs ? "El alcance está preparado para programaci?n inicial y cotizaciones." : "Scope is ready for initial scheduling and quote collection.")} />
        <Info title={isEs ? "Supuestos Registrados" : "Recorded Assumptions"} text={assumptions.slice(1, 4).join(" | ")} />
      </div>
    </div>
  </section>;
}

function SmartConstructionChecklist({ plan, assumptions, language }) {
  const isEs = language === "es";
  const [checked, setChecked] = useState({});
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const totalTasks = plan.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completeTasks = Object.values(checked).filter(Boolean).length;
  const completion = totalTasks ? Math.round(completeTasks / totalTasks * 100) : 0;
  const totalWeeks = plan.phases.reduce((sum, phase) => sum + phase.weeks, 0);
  const maxWeeks = Math.max(...plan.phases.map((phase) => phase.weeks), 1);
  const taskKey = (phase, task) => `${phase}:${task}`;
  const recommendations = [
    ["Site Preparation & Staking", "Complete clearing and initial grading, stake house corners, and verify permitted setbacks."],
    ["Subcontractor Onboarding", "Finalize concrete and plumbing contracts for slab work, including licensing and insurance review."],
    ["Truss Package Submittal", "Submit engineered truss specifications now to protect the framing and dry-in schedule."],
  ];
  const coordination = [
    ["Foundation", "Plumber + Concrete Contractor", "Plumbing Rough-in -> Slab Reinforcement -> Concrete Pour", "Confirm all under-slab waste lines and sleeves before concrete placement."],
    ["Framing", "Framing Crew + Lumber Supplier", "Slab Cure -> Lumber Delivery -> First Floor Framing", "Deliver lumber before crew mobilization so framing starts without idle days."],
  ];
  const alerts = [
    ["HIGH", "Truss Lead Time Delay", "Engineering and delivery can affect the dry-in milestone.", "Place the truss deposit this week."],
    ["MEDIUM", "Utility Lateral Coordination", "Gas and utility scheduling can conflict with driveway placement.", "Apply for service lateral scheduling early."],
  ];
  const orders = [
    ["Lumber and Framing Package (Wood Framing)", "2 weeks", "June 9, 2026"],
    ["Engineered Roof Trusses (2-Story)", "4-6 weeks", "June 2, 2026"],
    ["Vinyl Siding and Accessories", "2 weeks", "June 23, 2026"],
  ];
  const optimizationTips = [
    ["Batch Concrete Mobilization", "Coordinate garage and main slab pours to reduce equipment and delivery mobilization charges.", "$500 - $1,000"],
    ["Value Engineered Framing", "Use standard framing spacing and stock window dimensions where plans allow to reduce waste.", "$1,500 - $2,500"],
  ];
  async function analyzeWeather() {
    if (!location.trim()) return;
    setWeatherLoading(true);
    setWeather(null);
    try {
      const lookup = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.trim())}&count=1&language=en&format=json`);
      const found = (await lookup.json()).results?.[0];
      if (!found) throw new Error("location");
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${found.latitude}&longitude=${found.longitude}&daily=precipitation_probability_max,wind_gusts_10m_max,temperature_2m_max&forecast_days=7&timezone=auto`);
      const data = await response.json();
      const rain = Math.max(...(data.daily?.precipitation_probability_max || [0]));
      const wind = Math.max(...(data.daily?.wind_gusts_10m_max || [0]));
      const severity = rain >= 65 || wind >= 55 ? "HIGH" : rain >= 40 || wind >= 35 ? "MEDIUM" : "LOW";
      setWeather({ place: `${found.name}, ${found.admin1 || found.country}`, rain, wind, severity, time: new Date().toLocaleTimeString() });
    } catch (_error) {
      setWeather({ error: isEs ? "No se pudo obtener el pron?stico para esta ubicaci?n." : "Forecast could not be found for this location." });
    } finally {
      setWeatherLoading(false);
    }
  }
  return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-3xl border border-cyan-300/25 bg-slate-950/70 p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEs ? "Plan Generado" : "Generated Plan"}</p><h4 className="mt-2 text-2xl font-black text-white">{isEs ? "Tu Lista de Construcción" : "Your Construction Checklist"}</h4><p className="mt-2 text-sm text-slate-400">{isEs ? "Plan operativo de 14 fases con recomendaciones y seguimiento." : "A 14-phase operating plan with recommendations and live tracking."}</p><p className="mt-2 text-xs text-slate-500">{isEs ? "Ultima actualizacion" : "Last updated"}: {new Date().toLocaleTimeString()}</p></div>
      <button className="secondary-button">{isEs ? "Guardar en Proyecto" : "Save to Project"}</button>
    </div>
    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[.06] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-black text-emerald-200">{isEs ? "Duración Total Estimada" : "Total Estimated Duration"}: {totalWeeks} {isEs ? "semanas" : "weeks"}</p><p className="font-black text-cyan-200">{completion}% {isEs ? "completo" : "complete"}</p></div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800"><motion.div animate={{ width: `${completion}%` }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300" /></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-4"><MiniMetric label={isEs ? "Costo Estimado" : "Estimated Cost"} value={formatMoney(plan.estimatedCost)} /><MiniMetric label={isEs ? "Contingencia" : "Contingency"} value={formatMoney(plan.contingency)} /><MiniMetric label={isEs ? "Tareas Completadas" : "Completed Tasks"} value={`${completeTasks} / ${totalTasks}`} green={completeTasks > 0} /><MiniMetric label={isEs ? "Riesgo" : "Schedule Risk"} value={plan.risk} /></div>
    <section className="rounded-3xl border border-purple-300/20 bg-purple-300/[.05] p-5">
      <div className="flex items-center gap-3"><Bot className="text-purple-300" /><div><h5 className="font-black text-white">{isEs ? "Recomendaciones de IA" : "AI Recommendations"}</h5><p className="text-xs text-slate-400">{isEs ? "Enfoque semanal para proteger calendario y presupuesto" : "Weekly focus to protect schedule and budget"}</p></div></div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">{recommendations.map(([title, text], index) => <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"><p className="text-xs font-black uppercase text-cyan-300">Weekly Focus {index + 1}</p><p className="mt-2 font-black text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></motion.div>)}</div>
    </section>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-3">{plan.phases.map((phase, index) => { const done = phase.tasks.filter((task) => checked[taskKey(phase.name, task)]).length; return <details key={phase.name} className="rounded-2xl border border-white/10 bg-white/[.03] p-4" open={index < 2}><summary className="flex cursor-pointer list-none flex-wrap items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${done === phase.tasks.length ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>{index + 1}</span><span className="min-w-40 flex-1 font-black text-white">{phase.name}</span><span className="text-xs font-bold text-slate-400">{phase.tasks.length} {isEs ? "tareas" : "tasks"}</span><span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">~{phase.weeks} {isEs ? "sem" : "wk"}</span></summary><div className="mt-4 grid gap-2 sm:ml-11">{phase.tasks.map((task) => { const critical = task.includes("Critical Order"); const key = taskKey(phase.name, task); return <label key={task} className="flex items-start gap-3 rounded-xl p-2 text-sm text-slate-300 hover:bg-white/[.03]"><input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} className="mt-1 accent-cyan-300" /><span className={checked[key] ? "text-slate-500 line-through" : ""}>{task.replace(" - Critical Order", "")}</span>{critical && <span className="ml-auto shrink-0 rounded-full bg-amber-300/10 px-2 py-1 text-[0.62rem] font-black text-amber-300">Critical Order</span>}</label>})}<button className="mt-2 rounded-xl border border-dashed border-white/10 p-2 text-left text-sm font-bold text-cyan-300"><Plus className="mr-2 inline" size={14} />{isEs ? "Agregar tarea" : "Add task"}</button></div></details>; })}</div>
      <div className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><h5 className="font-black text-white">{isEs ? "Coordinaci?n de Oficios" : "Trade Coordination"}</h5>{coordination.map(([title, crew, sequence, detail]) => <div key={title} className="mt-4 border-t border-white/10 pt-4"><p className="font-black text-white">{title}</p><p className="text-sm font-bold text-cyan-200">{crew}</p><p className="mt-2 text-xs font-black text-amber-300">{sequence}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p></div>)}</section>
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><h5 className="font-black text-white">{isEs ? "Alertas de Riesgo" : "Risk Alerts"}</h5>{alerts.map(([level, title, detail, mitigation]) => <div key={title} className="mt-4 rounded-xl bg-slate-950/60 p-3"><span className={`rounded-full px-2 py-1 text-[0.65rem] font-black ${level === "HIGH" ? "bg-rose-400/15 text-rose-300" : "bg-amber-300/15 text-amber-300"}`}>{level}</span><p className="mt-2 font-black text-white">{title}</p><p className="mt-1 text-sm text-slate-400">{detail}</p><p className="mt-2 text-sm text-emerald-300">Mitigation: {mitigation}</p></div>)}</section>
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><h5 className="font-black text-white">{isEs ? "Consejos de Optimizacion" : "Optimization Tips"}</h5>{optimizationTips.map(([title, detail, savings]) => <div key={title} className="mt-4 border-t border-white/10 pt-4"><p className="font-black text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p><p className="mt-2 text-sm font-black text-emerald-300">{isEs ? "Ahorro potencial" : "Potential savings"}: {savings}</p></div>)}</section>
        <section className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><h5 className="font-black text-white">{isEs ? "?rdenes de Material" : "Material Orders"}</h5>{orders.map(([title, lead, due]) => <div key={title} className="mt-3 rounded-xl bg-slate-950/60 p-3"><p className="font-bold text-white">{title}</p><p className="mt-1 text-xs text-slate-400">Lead time: {lead}</p><p className="mt-2 text-xs font-black text-cyan-300">Order by: {due}</p></div>)}</section>
      </div>
    </div>
    <section className="rounded-3xl border border-cyan-300/20 bg-white/[.03] p-5"><div className="flex flex-wrap justify-between gap-3"><h5 className="flex items-center gap-2 text-lg font-black text-white"><Globe2 className="text-cyan-300" />{isEs ? "Análisis Clim?tico" : "Weather Risk Analysis"}</h5>{weather?.time && <p className="text-xs text-slate-500">{isEs ? "Actualizado" : "Updated"}: {weather.time}</p>}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input className="field" value={location} onChange={(event) => setLocation(event.target.value)} placeholder={isEs ? "Buscar ciudad o direcci?n..." : "Search city or address..."} /><button onClick={analyzeWeather} disabled={weatherLoading} className="primary-button shrink-0">{weatherLoading ? (isEs ? "Analizando..." : "Analyzing...") : (isEs ? "Analizar" : "Analyze")}</button></div>{!weather && <p className="mt-3 text-sm text-slate-400">{isEs ? "Configura la ubicaci?n y analiza riesgos con pron?stico de siete días." : "Set the project location and analyze risks with a seven-day forecast."}</p>}{weather?.error && <p className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200">{weather.error}</p>}{weather && !weather.error && <div className="mt-4 grid gap-3 sm:grid-cols-4"><MiniMetric label={isEs ? "Ubicaci?n" : "Location"} value={weather.place} /><MiniMetric label={isEs ? "Riesgo" : "Risk"} value={weather.severity} green={weather.severity === "LOW"} /><MiniMetric label={isEs ? "Prob. lluvia" : "Rain Chance"} value={`${weather.rain}%`} /><MiniMetric label={isEs ? "R?faga m?x." : "Max Wind Gust"} value={`${weather.wind} km/h`} /></div>}</section>
    <section className="rounded-3xl border border-white/10 bg-white/[.03] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h5 className="text-lg font-black text-white">{isEs ? "Cronograma del Proyecto (Gantt)" : "Project Timeline (Gantt)"}</h5><div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span>{isEs ? "Agregar demoras" : "Add Delays"}</span><button className="rounded-lg border border-white/10 px-2 py-1" title="Weather delay">Weather</button><button className="rounded-lg border border-white/10 px-2 py-1" title="Inspection delay">Inspection</button><button className="rounded-lg border border-white/10 px-2 py-1" title="Alert">Alert</button></div></div><div className="mt-4 overflow-x-auto"><div className="min-w-[680px] space-y-2"><div className="ml-48 grid grid-cols-6 text-center text-xs font-bold text-slate-500">{[1, 2, 3, 4, 5, 6].map((month) => <span key={month}>{isEs ? "Mes" : "Month"} {month}</span>)}</div>{plan.phases.map((phase, index) => <div key={phase.name} className="grid grid-cols-[12rem_1fr] items-center gap-3 text-sm"><span className="truncate font-bold text-slate-300">{phase.name}</span><div className="relative h-8 rounded-lg bg-slate-800/70"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(12, phase.weeks / maxWeeks * 45)}%` }} transition={{ delay: index * 0.04, duration: 0.5 }} className={`absolute h-full rounded-lg ${index < 2 ? "bg-emerald-400/55" : "bg-cyan-300/45"}`} style={{ left: `${Math.min(76, index * 6)}%` }}><span className="flex h-full items-center justify-center text-[0.62rem] font-black text-white">{phase.weeks} wk</span></motion.div></div></div>)}</div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><div className="flex gap-4 text-slate-400"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-slate-700" />Pending</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-emerald-400/55" />Completed</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-cyan-300/45" />Phase Complete</span></div><p className="font-black text-cyan-200">{totalWeeks} {isEs ? "semanas totales" : "total weeks"} (~{Math.ceil(totalWeeks / 4.3)} {isEs ? "meses" : "months"})</p></div></section>
    <Info title={isEs ? "Supuestos Registrados" : "Recorded Assumptions"} text={assumptions.slice(1, 4).join(" | ")} />
  </motion.section>;
}

function WizardStep({ title, detail, children }) {
  const visual = { "Foundation Type": [Home, "text-emerald-300", "bg-emerald-300/10"], "Finish Level": [Sparkles, "text-amber-300", "bg-amber-300/10"], "Building Structure": [Building2, "text-blue-300", "bg-blue-300/10"], "Exterior Siding": [Layers, "text-orange-300", "bg-orange-300/10"], "Roof Type": [Home, "text-purple-300", "bg-purple-300/10"], "Site Conditions": [MapPin, "text-emerald-300", "bg-emerald-300/10"], "Utilities & Systems": [Globe2, "text-cyan-300", "bg-cyan-300/10"], "Bathrooms & Extras": [Building2, "text-violet-300", "bg-violet-300/10"], "Permits & Regulations": [FileText, "text-rose-300", "bg-rose-300/10"] }[title] || [Hammer, "text-cyan-300", "bg-cyan-300/10"];
  const [Icon, color, background] = visual;
  return <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-3xl border border-white/10 bg-white/[.04] p-5"><motion.div initial={{ scale: 0.75, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 280, damping: 18 }} className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${background} ${color}`}><Icon size={29} /></motion.div><h4 className="text-2xl font-black text-white">{title}</h4><p className="mt-2 text-slate-400">{detail}</p><div className="mt-5 space-y-5">{children}</div></motion.div>;
}

function WizardGroup({ title, children }) {
  return <div><p className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">{title}</p>{children}</div>;
}

function OptionGrid({ options, value, onChange, compact }) {
  return <div className={`grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`}>{options.map(([title, detail]) => <button key={title} onClick={() => onChange(title)} className={`rounded-3xl border p-5 text-left transition ${value === title ? "border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,.16)]" : "border-white/10 bg-slate-950/60 hover:border-cyan-300/30"}`}><p className="font-black text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p></button>)}</div>;
}

function Segmented({ options, value, onChange }) {
  return <div className="flex flex-wrap gap-3">{options.map((option) => <button key={option} onClick={() => onChange(option)} className={`rounded-2xl border px-4 py-3 font-black transition ${value === option ? "border-amber-300 bg-amber-300 text-slate-950 shadow-[0_0_24px_rgba(251,191,36,.22)]" : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-amber-300/40"}`}>{option}</button>)}</div>;
}

function sidingDescription(name) {
  return {
    "Vinyl Siding": "Affordable, low maintenance",
    "Hardiboard / Fiber Cement": "Durable fiber cement",
    Brick: "Classic, long-lasting",
    Stone: "Premium natural look",
    Stucco: "Smooth exterior finish",
    "Wood Siding": "Traditional, warm aesthetic",
  }[name];
}

function DealUnderwriter({ language = "en", project }) {
  const isEs = language === "es";
  const [purchase, setPurchase] = useState(190000);
  const [rehab, setRehab] = useState(45000);
  const [arv, setArv] = useState(295000);
  const [costs, setCosts] = useState(31700);
  const total = cleanNumber(purchase) + cleanNumber(rehab) + cleanNumber(costs);
  const profit = cleanNumber(arv) - total;
  const roi = formulas.roi(profit, total);
  const noi = 2800 * 12 - 8500;
  const debt = formulas.monthlyMortgage(cleanNumber(purchase) * 0.8, 7.25, 30) * 12;
  return <div className="space-y-5"><ProjectContext project={project} language={language} /><div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="grid gap-4 md:grid-cols-2"><MoneyInput label={isEs ? "Precio de compra" : "Purchase Price"} value={purchase} setValue={setPurchase} /><MoneyInput label={isEs ? "Presupuesto de rehabilitación" : "Rehab Budget"} value={rehab} setValue={setRehab} /><MoneyInput label="ARV" value={arv} setValue={setArv} /><MoneyInput label={isEs ? "Cierre / Mantenimiento / Venta" : "Closing / Holding / Selling"} value={costs} setValue={setCosts} /></div><ResultBox items={[[isEs ? "Costo total" : "Total Cost", formatMoney(total)], [isEs ? "Ganancia" : "Profit", formatMoney(profit), profit > 0], ["ROI", `${roi.toFixed(1)}%`, roi > 15], [isEs ? "Oferta m?xima al 70%" : "70% Max Offer", formatMoney(cleanNumber(arv) * 0.7 - cleanNumber(rehab)), true], [isEs ? "Tasa de capitalizaci?n" : "Cap Rate", `${formulas.capRate(noi, cleanNumber(purchase)).toFixed(2)}%`], ["DSCR", formulas.dscr(noi, debt).toFixed(2), formulas.dscr(noi, debt) >= 1.2], [isEs ? "Retorno sobre efectivo" : "Cash-on-Cash", `${formulas.cashOnCash(noi - debt, total * 0.25).toFixed(2)}%`]]} /></div></div>;
}

function InvestmentLoanCalculator({ language = "en", project }) {
  const isEs = language === "es";
  const [mode, setMode] = useState("dscr");
  const [dscr, setDscr] = useState({ value: 500000, loan: 400000, rate: 7.5, years: 30, rent: 4000, taxes: 6000, insurance: 2400, hoa: 0 });
  const [cashout, setCashout] = useState({ value: 600000, balance: 300000, amount: 100000, rate: 7, years: 30, closing: 3 });
  const [ground, setGround] = useState({ loan: 500000, rate: 12, construction: 9, sale: 3, schedule: "uniform" });
  const patch = (setter, field) => (value) => setter((current) => ({ ...current, [field]: value }));
  const dscrPI = formulas.monthlyMortgage(cleanNumber(dscr.loan), cleanNumber(dscr.rate), cleanNumber(dscr.years));
  const dscrTaxes = cleanNumber(dscr.taxes) / 12;
  const dscrInsurance = cleanNumber(dscr.insurance) / 12;
  const dscrPayment = dscrPI + dscrTaxes + dscrInsurance + cleanNumber(dscr.hoa);
  const dscrNoi = cleanNumber(dscr.rent) * 12 - cleanNumber(dscr.taxes) - cleanNumber(dscr.insurance) - cleanNumber(dscr.hoa) * 12;
  const dscrRatio = formulas.dscr(dscrNoi, dscrPI * 12);
  const dscrLtv = cleanNumber(dscr.value) ? cleanNumber(dscr.loan) / cleanNumber(dscr.value) * 100 : 0;
  const cashLoan = cleanNumber(cashout.balance) + cleanNumber(cashout.amount);
  const cashPayment = formulas.monthlyMortgage(cashLoan, cleanNumber(cashout.rate), cleanNumber(cashout.years));
  const cashClosing = cashLoan * cleanNumber(cashout.closing) / 100;
  const cashReceived = cleanNumber(cashout.amount) - cashClosing;
  const cashEquity = cleanNumber(cashout.value) - cashLoan;
  const cashLtv = cleanNumber(cashout.value) ? cashLoan / cleanNumber(cashout.value) * 100 : 0;
  const constructionMonths = Math.max(1, Math.round(cleanNumber(ground.construction)));
  const saleMonths = Math.max(0, Math.round(cleanNumber(ground.sale)));
  const duration = constructionMonths + saleMonths;
  const loan = cleanNumber(ground.loan);
  const monthlyRate = cleanNumber(ground.rate) / 100 / 12;
  const balances = Array.from({ length: duration }, (_, index) => index < constructionMonths ? loan * ((index + 1) / constructionMonths) : loan);
  const interestByMonth = balances.map((balance) => balance * monthlyRate);
  const constructionInterest = interestByMonth.reduce((sum, value) => sum + value, 0);
  const reserve = constructionInterest * 1.1;
  const effectiveRate = loan && duration ? constructionInterest / loan * (12 / duration) * 100 : 0;
  const reset = () => {
    if (mode === "dscr") setDscr({ value: 500000, loan: 400000, rate: 7.5, years: 30, rent: 4000, taxes: 6000, insurance: 2400, hoa: 0 });
    if (mode === "cashout") setCashout({ value: 600000, balance: 300000, amount: 100000, rate: 7, years: 30, closing: 3 });
    if (mode === "ground") setGround({ loan: 500000, rate: 12, construction: 9, sale: 3, schedule: "uniform" });
  };
  return (
    <div className="space-y-6">
      <ProjectContext project={project} language={language} />
      <div className="text-center">
        <h3 className="text-2xl font-black text-white sm:text-3xl">{isEs ? "Calculadora de Préstamos de Inversión" : "Investment Loan Calculator"}</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{isEs ? "Calcula pagos para pr?stamos DSCR, refinanciamiento cash-out y construcción desde cero." : "Calculate payments for DSCR, Cash-Out Refinance, and Ground-Up Construction loans."}</p>
      </div>
      <div className="mx-auto grid max-w-lg grid-cols-3 rounded-2xl bg-slate-900/80 p-1">
        {[["dscr", "DSCR"], ["cashout", "Cash-Out"], ["ground", isEs ? "Construcción" : "Ground Up"]].map(([id, label]) => <button key={id} onClick={() => setMode(id)} className={`rounded-xl px-3 py-3 text-sm font-black transition ${mode === id ? "bg-cyan-300 text-slate-950 shadow-[0_0_22px_rgba(34,211,238,.25)]" : "text-slate-400 hover:text-white"}`}>{label}</button>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div><h4 className="text-xl font-black text-white">{mode === "dscr" ? (isEs ? "Calculadora DSCR" : "DSCR Loan Calculator") : mode === "cashout" ? (isEs ? "Calculadora de Refinanciamiento Cash-Out" : "Cash-Out Refinance Calculator") : (isEs ? "Calculadora de Interés de Construcción" : "Construction Interest Calculator")}</h4>{mode === "ground" && <p className="mt-1 text-sm text-slate-400">{isEs ? "Construcción desde cero" : "Ground-Up Construction"}</p>}</div>
            <button onClick={reset} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-slate-400 hover:border-cyan-300/30 hover:text-white">{isEs ? "Limpiar" : "Clear"}</button>
          </div>
          {mode === "dscr" && <div className="grid gap-4 sm:grid-cols-2"><MoneyInput label={isEs ? "Valor de Propiedad" : "Property Value"} value={dscr.value} setValue={patch(setDscr, "value")} /><MoneyInput label={isEs ? "Monto del Préstamo" : "Loan Amount"} value={dscr.loan} setValue={patch(setDscr, "loan")} /><NumberInput label={isEs ? "Tasa de Interés (%)" : "Interest Rate (%)"} value={dscr.rate} setValue={patch(setDscr, "rate")} /><NumberInput label={isEs ? "Plazo (Años)" : "Loan Term (Years)"} value={dscr.years} setValue={patch(setDscr, "years")} /><MoneyInput label={isEs ? "Ingreso Mensual por Renta" : "Monthly Rental Income"} value={dscr.rent} setValue={patch(setDscr, "rent")} /><MoneyInput label={isEs ? "Impuestos Anuales" : "Annual Property Taxes"} value={dscr.taxes} setValue={patch(setDscr, "taxes")} /><MoneyInput label={isEs ? "Seguro Anual" : "Annual Insurance"} value={dscr.insurance} setValue={patch(setDscr, "insurance")} /><MoneyInput label="Monthly HOA" value={dscr.hoa} setValue={patch(setDscr, "hoa")} /></div>}
          {mode === "cashout" && <div className="grid gap-4 sm:grid-cols-2"><MoneyInput label={isEs ? "Valor Actual de Propiedad" : "Current Property Value"} value={cashout.value} setValue={patch(setCashout, "value")} /><MoneyInput label={isEs ? "Saldo Actual del Préstamo" : "Current Loan Balance"} value={cashout.balance} setValue={patch(setCashout, "balance")} /><div className="sm:col-span-2"><MoneyInput label={isEs ? "Monto Cash-Out" : "Cash-Out Amount"} value={cashout.amount} setValue={patch(setCashout, "amount")} /></div><NumberInput label={isEs ? "Tasa Nueva (%)" : "New Interest Rate (%)"} value={cashout.rate} setValue={patch(setCashout, "rate")} /><NumberInput label={isEs ? "Plazo (Años)" : "Loan Term (Years)"} value={cashout.years} setValue={patch(setCashout, "years")} /><NumberInput label={isEs ? "Costos de Cierre (%)" : "Estimated Closing Costs (%)"} value={cashout.closing} setValue={patch(setCashout, "closing")} /></div>}
          {mode === "ground" && <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><MoneyInput label={isEs ? "Monto Total del Préstamo" : "Total Loan Amount"} value={ground.loan} setValue={patch(setGround, "loan")} /></div><NumberInput label={isEs ? "Tasa de Interés (%)" : "Interest Rate (%)"} value={ground.rate} setValue={patch(setGround, "rate")} /><NumberInput label={isEs ? "Tiempo de Construcción (Meses)" : "Construction Time (Months)"} value={ground.construction} setValue={patch(setGround, "construction")} /><NumberInput label={isEs ? "Tiempo de Venta (Meses)" : "Sale Time (Months)"} value={ground.sale} setValue={patch(setGround, "sale")} /><MiniMetric label={isEs ? "Duración Total" : "Total Project Duration"} value={`${duration} mo`} /><label className="block sm:col-span-2"><span className="label">{isEs ? "Programa de Desembolsos" : "Draw Schedule"}</span><select value={ground.schedule} onChange={(event) => patch(setGround, "schedule")(event.target.value)} className="field"><option value="uniform">{isEs ? "Uniforme (Desembolsos Iguales)" : "Uniform (Equal Draws)"}</option></select><p className="mt-2 text-xs text-slate-500">{isEs ? `Los desembolsos ocurren solo durante la fase de construcción de ${constructionMonths} meses.` : `Draws occur during the ${constructionMonths}-month construction phase only.`}</p></label></div>}
        </section>
        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
          <h4 className="text-xl font-black text-white">{isEs ? "Resultados" : "Results"}</h4>
          {mode === "dscr" && <><div className="mt-5 grid gap-3 sm:grid-cols-2"><CalculatorMetric label={isEs ? "Pago Mensual" : "Monthly Payment"} value={formatMoneyCents(dscrPayment)} accent /><CalculatorMetric label="DSCR Ratio" value={`${dscrRatio.toFixed(2)} ${dscrRatio < 1.2 ? (isEs ? "(Precaución)" : "(Warning)") : ""}`} accent={dscrRatio >= 1.2} /><CalculatorMetric label={isEs ? "Interés Total" : "Total Interest"} value={formatMoneyCents(Math.max(0, dscrPI * cleanNumber(dscr.years) * 12 - cleanNumber(dscr.loan)))} /><CalculatorMetric label="LTV Ratio" value={`${dscrLtv.toFixed(1)}%`} /></div><PaymentBreakdown principal={dscrPI} escrows={dscrTaxes + dscrInsurance + cleanNumber(dscr.hoa)} language={language} /></>}
          {mode === "cashout" && <><div className="mt-5 grid gap-3 sm:grid-cols-2"><CalculatorMetric label={isEs ? "Nuevo Préstamo" : "New Loan Amount"} value={formatMoneyCents(cashLoan)} /><CalculatorMetric label={isEs ? "Nuevo Pago Mensual" : "New Monthly Payment"} value={formatMoneyCents(cashPayment)} accent /><CalculatorMetric label={isEs ? "Efectivo Recibido" : "Cash Received (after costs)"} value={formatMoneyCents(cashReceived)} positive /><CalculatorMetric label={isEs ? "Capital Restante" : "Equity Remaining"} value={formatMoneyCents(cashEquity)} /><CalculatorMetric label="New LTV Ratio" value={`${cashLtv.toFixed(1)}%`} /><CalculatorMetric label={isEs ? "Interés Total" : "Total Interest"} value={formatMoneyCents(Math.max(0, cashPayment * cleanNumber(cashout.years) * 12 - cashLoan))} /></div><ComparisonBars current={formulas.monthlyMortgage(cleanNumber(cashout.balance), 5.5, cleanNumber(cashout.years))} next={cashPayment} language={language} /></>}
          {mode === "ground" && <><div className="mt-5 grid gap-3 sm:grid-cols-2"><CalculatorMetric label={isEs ? "Costo Total de Interés" : "Total Interest Cost"} value={formatMoneyCents(constructionInterest)} accent /><CalculatorMetric label={isEs ? "Interés Mensual Promedio" : "Average Monthly Interest"} value={formatMoneyCents(constructionInterest / duration)} /><CalculatorMetric label={isEs ? "Reserva de Interés Necesaria" : "Interest Reserve Needed"} value={formatMoneyCents(reserve)} positive /><CalculatorMetric label={isEs ? "Tasa Anual Efectiva" : "Effective Annual Rate"} value={`${effectiveRate.toFixed(2)}%`} /></div><InterestTimeline balances={balances} constructionMonths={constructionMonths} saleMonths={saleMonths} language={language} /></>}
        </section>
      </div>
      <EmbeddedLoanCalculations language={language} mode={mode} metrics={{
        dscrPayment,
        dscrRatio,
        dscrLtv,
        cashLoan,
        cashPayment,
        cashReceived,
        cashLtv,
        constructionInterest,
        reserve,
        effectiveRate,
      }} />
    </div>
  );
}

function EmbeddedLoanCalculations({ language, mode, metrics }) {
  const isEs = language === "es";
  const rows = mode === "dscr"
    ? [["Monthly P&I + Escrows", formatMoneyCents(metrics.dscrPayment)], ["DSCR", metrics.dscrRatio.toFixed(2)], ["Loan-to-Value", `${metrics.dscrLtv.toFixed(1)}%`]]
    : mode === "cashout"
      ? [["New Loan", formatMoneyCents(metrics.cashLoan)], ["New Payment", formatMoneyCents(metrics.cashPayment)], ["Cash Received", formatMoneyCents(metrics.cashReceived)], ["New LTV", `${metrics.cashLtv.toFixed(1)}%`]]
      : [["Interest Cost", formatMoneyCents(metrics.constructionInterest)], ["Interest Reserve", formatMoneyCents(metrics.reserve)], ["Effective Rate", `${metrics.effectiveRate.toFixed(2)}%`]];
  return <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEs ? "Cálculos de Préstamo" : "Loan Calculations"}</p>
        <h4 className="mt-2 text-xl font-black text-white">{isEs ? "Supuestos guardables junto al proyecto" : "Project-ready loan assumption vault"}</h4>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{isEs ? "Esta secci?n integra los cálculos de pr?stamo dentro de la calculadora principal para mantener DSCR, cash-out y construcción en un solo lugar." : "This folds the old loan-calculations tool into the main calculator so DSCR, cash-out, and construction debt assumptions stay together."}</p>
      </div>
      <button className="secondary-button"><FileText size={18} /> {isEs ? "Guardar Resumen" : "Save Summary"}</button>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {rows.map(([label, value]) => <MiniMetric key={label} label={label} value={value} green={label.includes("Cash") || label.includes("DSCR")} />)}
    </div>
  </section>;
}

function ProjectContext({ project, language }) {
  if (!project) return null;
  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.06] px-4 py-3"><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{language === "es" ? "Proyecto Seleccionado" : "Selected Project"}</p><p className="font-black text-white">{project.name}</p></div>{project.address && <p className="text-sm text-slate-400">{project.address}</p>}</div>;
}

function CalculatorMetric({ label, value, accent, positive }) {
  return <div className="rounded-2xl border border-white/5 bg-slate-900/85 p-4"><p className="text-xs font-bold text-slate-400">{label}</p><p className={`mt-1 break-words text-xl font-black ${positive ? "text-emerald-300" : accent ? "text-cyan-300" : "text-white"}`}>{value}</p></div>;
}

function PaymentBreakdown({ principal, escrows, language }) {
  const total = principal + escrows || 1;
  const pPercent = principal / total * 100;
  return <div className="mt-7"><p className="mb-5 font-black text-white">{language === "es" ? "Desglose del Pago" : "Payment Breakdown"}</p><div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full" style={{ background: `conic-gradient(#22d3ee 0 ${pPercent}%, #818cf8 ${pPercent}% 100%)` }}><div className="h-20 w-20 rounded-full bg-[#080d1f]" /></div><div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-bold"><span className="inline-flex items-center gap-2 text-cyan-300"><span className="h-2 w-2 rounded-full bg-cyan-300" />{language === "es" ? "Principal e Interés" : "Principal & Interest"}</span><span className="inline-flex items-center gap-2 text-indigo-300"><span className="h-2 w-2 rounded-full bg-indigo-300" />{language === "es" ? "Impuestos y Seguro" : "Taxes & Insurance"}</span></div></div>;
}

function ComparisonBars({ current, next, language }) {
  const max = Math.max(current, next, 1);
  return <div className="mt-7"><p className="mb-4 font-black text-white">{language === "es" ? "Comparación de Pagos" : "Payment Comparison"}</p>{[[language === "es" ? "Actual" : "Current", current, "bg-indigo-400"], [language === "es" ? "Nuevo" : "New", next, "bg-cyan-300"]].map(([label, value, color]) => <div key={label} className="mb-4 grid grid-cols-[5rem_1fr] items-center gap-3"><span className="text-sm text-slate-400">{label}</span><div className="rounded-r-lg bg-slate-900"><div className={`${color} rounded-r-lg px-3 py-3 text-right text-xs font-black text-slate-950`} style={{ width: `${Math.max(16, value / max * 100)}%` }}>{formatMoneyCents(value)}</div></div></div>)}</div>;
}

function InterestTimeline({ balances, constructionMonths, saleMonths, language }) {
  const max = Math.max(...balances, 1);
  return <div className="mt-7"><p className="mb-5 font-black text-white">{language === "es" ? "Cronología de Acumulación de Interés" : "Interest Accumulation Timeline"}</p><div className="flex h-44 items-end gap-1.5 rounded-2xl border border-white/5 bg-slate-900/40 p-3 sm:gap-2">{balances.map((balance, index) => <div key={index} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"><div className={`w-full rounded-t-md ${index < constructionMonths ? "bg-gradient-to-t from-cyan-500/45 to-cyan-300" : "bg-gradient-to-t from-indigo-500/45 to-indigo-300"}`} style={{ height: `${Math.max(8, balance / max * 100)}%` }} title={formatMoney(balance)} /><span className="text-center text-[0.62rem] font-bold text-slate-500">{index + 1}</span></div>)}</div><div className="mt-4 flex flex-wrap justify-center gap-5 text-xs font-bold text-slate-400"><span className="text-cyan-300">{language === "es" ? `Construcción: 1-${constructionMonths} meses` : `Construction: 1-${constructionMonths} mo`}</span>{saleMonths > 0 && <span className="text-indigo-300">{language === "es" ? `Venta: ${constructionMonths + 1}-${constructionMonths + saleMonths} meses` : `Sale: ${constructionMonths + 1}-${constructionMonths + saleMonths} mo`}</span>}</div></div>;
}

function PropertySearch({ t, language = "en", getAccessToken, onAddProject }) {
  const isEs = language === "es";
  const [address, setAddress] = useState("5500 Grand Lake Dr, San Antonio, TX 78244");
  const [mortgage, setMortgage] = useState(225000);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(isEs ? "Listo para buscar registros reales de propiedad." : "Ready to search live property intelligence.");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const property = result?.property || null;
  const valuation = result?.valueEstimate || null;
  const rentEstimate = result?.rentEstimate || null;
  const comps = asArray(result?.saleComps);
  const rentalComps = asArray(result?.rentalComps);
  const saleMarket = asArray(result?.saleMarket);
  const rentalMarket = asArray(result?.rentalMarket);

  async function search() {
    setLoading(true);
    setStatus(isEs ? "Buscando RentCast de forma segura..." : "Searching RentCast securely...");
    try {
      const token = await getAccessToken?.();
      if (!token) throw new Error(isEs ? "Inicia sesión para continuar." : "Sign in to continue.");
      const response = await fetch("/api/rentcast-search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address }),
      });
      const payload = await readApiJson(response);
      if (!response.ok) throw new Error(payload.error || (isEs ? "No se pudo cargar la propiedad." : "Property intelligence could not be loaded."));
      setResult(payload);
      setStatus(payload.warnings?.length
        ? (isEs ? "Propiedad cargada. Algunos conjuntos de datos no estuvieron disponibles." : "Property loaded. Some provider datasets were not available.")
        : (isEs ? "Propiedad cargada con datos de RentCast." : "Property loaded with RentCast intelligence."));
    } catch (error) {
      setResult(null);
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function savePropertyProject() {
    if (!property || !onAddProject) return;
    setSaving(true);
    const project = {
      id: Date.now(),
      name: pick(property.formattedAddress, property.addressLine1, address),
      type: "Property Intelligence",
      address: pick(property.formattedAddress, property.addressLine1, address),
      arv,
      profit: equity,
      roi: arv ? (equity / arv) * 100 : 0,
      progress: 0,
      status: "Research",
      dataSource: "RentCast",
      rentcast: result,
    };
    const saved = await onAddProject(project);
    setSaving(false);
    setStatus(saved?.error
      ? saved.error
      : (isEs ? "Propiedad guardada en Mis Proyectos." : "Property saved to My Projects."));
  }

  const compPrices = comps.map((comp) => cleanNumber(comp.price)).filter(Boolean);
  const estimatedValue = cleanNumber(pick(valuation?.price, valuation?.value, valuation?.valueEstimate, property?.estimatedValue, property?.lastSalePrice));
  const arv = compPrices.length ? formulas.arv(compPrices) : estimatedValue;
  const sqft = cleanNumber(pick(property?.squareFootage, property?.livingArea, property?.features?.squareFootage));
  const salePrice = cleanNumber(pick(property?.lastSalePrice, property?.salePrice, valuation?.price, valuation?.value));
  const assessed = cleanNumber(pick(property?.taxAssessments?.[new Date().getFullYear()]?.value, property?.taxAssessments?.value, property?.taxAssessment?.value, property?.assessedValue));
  const taxes = cleanNumber(pick(property?.propertyTaxes?.[new Date().getFullYear()]?.total, property?.propertyTaxes?.total, property?.taxes?.amount, property?.taxAmount));
  const rent = cleanNumber(pick(rentEstimate?.rent, rentEstimate?.price, rentEstimate?.rentEstimate));
  const equity = estimatedValue - cleanNumber(mortgage);
  const ppsf = sqft ? salePrice / sqft : 0;
  const taxRate = assessed ? (taxes / assessed) * 100 : 0;
  const coords = `${pick(property?.latitude, property?.location?.latitude, "-")}, ${pick(property?.longitude, property?.location?.longitude, "-")}`;
  const features = property?.features && typeof property.features === "object"
    ? Object.entries(property.features).slice(0, 10).map(([key, value]) => [key.replace(/([A-Z])/g, " $1"), String(value)])
    : [];

  return (
    <div className="space-y-6">
      <GlassPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">RentCast</p>
            <h2 className="mt-2 text-3xl font-black text-white">{t.propertySearch}</h2>
            <p className="mt-2 max-w-4xl text-slate-400">{t.propertySearchDetail || "Search property records, owner information, value estimates, rent estimates, comparable sales, rental comps, market context, and investor calculations."}</p>
          </div>
          {property && <button onClick={savePropertyProject} disabled={saving} className="primary-button">{saving ? (isEs ? "Guardando..." : "Saving...") : (isEs ? "Guardar Propiedad" : "Save Property")}</button>}
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px_170px]">
          <label className="block">
            <span className="label">{isEs ? "Dirección" : "Address"}</span>
            <input value={address} onChange={(event) => setAddress(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") search(); }} className="field" placeholder="123 Main St, City, ST" />
          </label>
          <MoneyInput label={t.mortgageBalance} value={mortgage} setValue={setMortgage} />
          <button onClick={search} disabled={loading} className="primary-button self-end">{loading ? (isEs ? "Buscando..." : "Searching...") : t.search}</button>
        </div>
        <p className={`mt-4 rounded-2xl border p-4 text-sm ${result ? "border-emerald-300/20 bg-emerald-300/[.06] text-emerald-100" : "border-white/10 bg-slate-950/70 text-slate-400"}`}>{status}</p>
        {!!result?.warnings?.length && <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-4 text-sm leading-6 text-amber-100">{result.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>}
      </GlassPanel>

      {property ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Stat title="ARV" value={formatMoney(arv)} icon={BarChart3} help={t.arvHelp || "Average comparable sale price when comps are available."} />
            <Stat title={t.equity || "Equity"} value={formatMoney(equity)} icon={WalletCards} help={t.equityHelp || "Estimated value minus mortgage balance."} />
            <Stat title={t.pricePerSqft || "Price / Sqft"} value={formatMoney(ppsf)} icon={Calculator} help={t.pricePerSqftHelp || "Sale price divided by square footage."} />
            <Stat title={isEs ? "Renta Estimada" : "Rent Estimate"} value={rent ? formatMoney(rent) : t.unavailable} icon={Home} help={isEs ? "Estimación mensual de renta de RentCast." : "Monthly rent estimate from RentCast."} />
          </div>

          <GlassPanel>
            <SectionHeader title={t.propertySummary} detail={pick(property.formattedAddress, property.addressLine1, address)} />
            <div className="grid gap-4 md:grid-cols-3">
              <MiniMetric label={t.owner} value={pick(property.ownerName, property.ownerNames?.join?.(", "), property.owner?.names?.join?.(", "), t.availableAfterSearch)} />
              <MiniMetric label={t.bedsBaths} value={`${pick(property.bedrooms, property.beds, "-")} / ${pick(property.bathrooms, property.baths, "-")}`} />
              <MiniMetric label={t.squareFeet} value={sqft ? formatNumber(sqft, 0) : t.unavailable} />
              <MiniMetric label={t.lotSize} value={pick(property.lotSize, property.lotSizeSquareFeet, t.unavailable)} />
              <MiniMetric label={t.yearBuilt} value={pick(property.yearBuilt, t.unavailable)} />
              <MiniMetric label={t.lastSale} value={`${salePrice ? formatMoney(salePrice) : t.unavailable} ${pick(property.lastSaleDate, "")}`} />
              <MiniMetric label={t.coordinates} value={coords} />
              <MiniMetric label={t.assessments} value={assessed ? formatMoney(assessed) : t.unavailable} />
              <MiniMetric label={t.propertyTaxes} value={taxes ? formatMoney(taxes) : t.unavailable} />
              <MiniMetric label={t.taxRate || "Tax Rate"} value={`${taxRate.toFixed(2)}%`} />
              <MiniMetric label={isEs ? "Valor Estimado" : "Value Estimate"} value={estimatedValue ? formatMoney(estimatedValue) : t.unavailable} />
              <MiniMetric label={isEs ? "Registros de Mercado" : "Market Records"} value={`${saleMarket.length + rentalMarket.length}`} />
            </div>
          </GlassPanel>

          <div className="grid gap-6 xl:grid-cols-2">
            <CompList title={isEs ? "Ventas Comparables" : "Comparable Sales"} items={comps} empty={isEs ? "No se encontraron comps de venta." : "No sale comps returned."} mode="sale" />
            <CompList title={isEs ? "Rentas Comparables" : "Rental Comps"} items={rentalComps} empty={isEs ? "No se encontraron comps de renta." : "No rental comps returned."} mode="rent" />
            <CompList title={isEs ? "Mercado de Venta" : "Sale Market Data"} items={saleMarket} empty={isEs ? "Sin listados activos disponibles." : "No active sale listings returned."} mode="sale" />
            <CompList title={isEs ? "Mercado de Renta" : "Rental Market Data"} items={rentalMarket} empty={isEs ? "Sin rentas activas disponibles." : "No active rental listings returned."} mode="rent" />
          </div>

          <GlassPanel>
            <SectionHeader title={isEs ? "Caracter?sticas y Registros" : "Features & Records"} detail={isEs ? "Datos estructurados del registro de propiedad devuelto por RentCast." : "Structured property record details returned by RentCast."} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.length ? features.map(([label, value]) => <MiniMetric key={label} label={label} value={value} />) : <MiniMetric label={isEs ? "Caracter?sticas" : "Features"} value={t.unavailable} />}
            </div>
          </GlassPanel>
        </>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[.035] p-10 text-center">
          <Search className="mx-auto text-cyan-300" size={34} />
          <h3 className="mt-4 text-xl font-black text-white">{isEs ? "Busca una propiedad para comenzar" : "Search a property to begin"}</h3>
          <p className="mx-auto mt-2 max-w-2xl text-slate-400">{isEs ? "Los datos de RentCast se consultan en el servidor para mantener la llave segura y se muestran aqu? para análisis de inversión." : "RentCast data is requested on the server to keep the key secure, then displayed here for investor-grade review."}</p>
        </div>
      )}
    </div>
  );
}

function CompList({ title, items, empty, mode }) {
  return <GlassPanel>
    <h3 className="text-xl font-black text-white">{title}</h3>
    <div className="mt-4 space-y-3">
      {items.length ? items.slice(0, 8).map((item, index) => (
        <div key={`${item.address}-${index}`} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <div>
            <p className="font-black text-white">{item.address || "Address unavailable"}</p>
            <p className="text-sm text-slate-400">{[item.date, item.distance && `${item.distance} mi`, item.sqft && `${formatNumber(item.sqft, 0)} sqft`, item.beds && `${item.beds} bd`].filter(Boolean).join(" | ")}</p>
          </div>
          <p className={`text-lg font-black ${mode === "rent" ? "text-cyan-300" : "text-emerald-300"}`}>{formatMoney(mode === "rent" ? item.rent : item.price)}</p>
        </div>
      )) : <p className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">{empty}</p>}
    </div>
  </GlassPanel>;
}

function AITakeoff({ language = "en", project }) {
  const isEs = language === "es";
  const [started, setStarted] = useState(false);
  const [planUrl, setPlanUrl] = useState("/sample-floor-plan.pdf");
  const [fileName, setFileName] = useState("download_floor_plan.pdf");
  const [tool, setTool] = useState("select");
  const [measureMode, setMeasureMode] = useState("area");
  const [zoom, setZoom] = useState(41);
  const [scaleFeet, setScaleFeet] = useState(5);
  const [scaleLabel, setScaleLabel] = useState("1/4\" = 1'");
  const [scaleMultiplier, setScaleMultiplier] = useState(1);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [calibrationDistance, setCalibrationDistance] = useState("5");
  const [tourStep, setTourStep] = useState(1);
  const [showTour, setShowTour] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [takeoffMode, setTakeoffMode] = useState("manual");
  const [takeoffStatus, setTakeoffStatus] = useState("");
  const [aiChoiceView, setAiChoiceView] = useState("menu");
  const [aiResultType, setAiResultType] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("flooring");
  const [draftGroup, setDraftGroup] = useState({ name: "Custom", type: "Area (SF)", parent: "None", icon: "Layers", color: "#38bdf8", pitch: "Flat (0/12)", volume: false });
  const [groups, setGroups] = useState([
    { id: "flooring", name: "Flooring", type: "Area (SF)", icon: "Layers", color: "#3b82f6", waste: 8, unitCost: 3.25 },
    { id: "roofing", name: "Roofing", type: "Area (SF)", icon: "Home", color: "#ef4444", waste: 10, unitCost: 4.5 },
    { id: "siding", name: "Siding", type: "Area (SF)", icon: "Home", color: "#f97316", waste: 8, unitCost: 5.75 },
    { id: "drywall", name: "Drywall", type: "Area (SF)", icon: "Building2", color: "#a855f7", waste: 10, unitCost: 0.92 },
    { id: "trim", name: "Interior Trim", type: "Linear (LF)", icon: "Ruler", color: "#22d3ee", waste: 10, unitCost: 1.85 },
    { id: "electrical", name: "Electrical Fixtures", type: "Count", icon: "Sparkles", color: "#facc15", waste: 0, unitCost: 35 },
    { id: "concrete", name: "Concrete", type: "Volume (YD3)", icon: "Building2", color: "#94a3b8", waste: 5, unitCost: 155 },
  ]);
  const [measurements, setMeasurements] = useState([]);
  const [draftPoints, setDraftPoints] = useState([]);
  const [note, setNote] = useState("");
  const [takeoffNotes, setTakeoffNotes] = useState("Reference model: tile takeoff, shower walls, bathroom floors, laundry floors, and engineered hardwood by floor.");
  const [takeoffItems, setTakeoffItems] = useState([
    { id: "ref-shower-wall", description: "Tile - Shower Walls", quantity: 486, unit: "ft2", area: "Bathrooms / shower surrounds", materialType: "Tile", waste: 10, unitCost: 4.75, laborCost: 7.5 },
    { id: "ref-bath-floor", description: "Bathroom Floor Tile", quantity: 218, unit: "ft2", area: "Main + upper bath floors", materialType: "Tile", waste: 10, unitCost: 3.85, laborCost: 6.25 },
    { id: "ref-laundry-floor", description: "Laundry Floor Tile", quantity: 74, unit: "ft2", area: "Laundry rooms", materialType: "Tile", waste: 8, unitCost: 3.65, laborCost: 5.5 },
    { id: "ref-hardwood-main", description: "Engineered Hardwood - Main Floor", quantity: 1260, unit: "ft2", area: "Main floor living areas", materialType: "Engineered Hardwood", waste: 8, unitCost: 5.9, laborCost: 3.75 },
    { id: "ref-hardwood-upper", description: "Engineered Hardwood - Upper Floor", quantity: 980, unit: "ft2", area: "Upper floor bedrooms / halls", materialType: "Engineered Hardwood", waste: 8, unitCost: 5.9, laborCost: 3.75 },
  ]);
  const reportRef = useRef(null);
  const canvasRef = useRef(null);

  const activeGroup = groups.find((group) => group.id === activeGroupId) || groups[0];
  const groupMeasurements = measurements.filter((measurement) => measurement.groupId === activeGroupId);
  const totalsByGroup = groups.map((group) => {
    const groupItems = measurements.filter((measurement) => measurement.groupId === group.id);
    const quantity = groupItems.reduce((sum, item) => sum + item.quantity, 0);
    const withWaste = quantity * (1 + (cleanNumber(group.waste) || 0) / 100);
    return { ...group, quantity, withWaste, cost: withWaste * cleanNumber(group.unitCost), count: groupItems.length };
  });
  const totalCost = totalsByGroup.reduce((sum, group) => sum + group.cost, 0);
  const takeoffRows = takeoffItems.map((item) => {
    const quantity = cleanNumber(item.quantity);
    const waste = cleanNumber(item.waste);
    const unitCost = cleanNumber(item.unitCost);
    const laborCost = cleanNumber(item.laborCost);
    const orderQuantity = quantity * (1 + waste / 100);
    return {
      ...item,
      quantity,
      waste,
      unitCost,
      laborCost,
      orderQuantity,
      materialTotal: orderQuantity * unitCost,
      laborTotal: quantity * laborCost,
      total: orderQuantity * unitCost + quantity * laborCost,
    };
  });
  const takeoffTotal = takeoffRows.reduce((sum, item) => sum + item.total, 0);
  const materialTotal = takeoffRows.reduce((sum, item) => sum + item.materialTotal, 0);
  const laborTotal = takeoffRows.reduce((sum, item) => sum + item.laborTotal, 0);
  const wasteTotal = takeoffRows.reduce((sum, item) => sum + Math.max(item.orderQuantity - item.quantity, 0), 0);

  const tour = [
    { title: "Set Drawing Scale", text: "Choose a preset scale or calibrate manually with two known points." },
    { title: "Measurement Groups", text: "Create groups for flooring, drywall, roofing, trim, concrete, fixtures, and custom scopes." },
    { title: "Drawing Tools", text: "Use Select, Pan, Note, Area, Linear, or Count. Click the plan to create measurements." },
    { title: "AI Takeoff", text: "Generate a material summary from your groups, quantities, waste factors, and unit costs." },
    { title: "Save Your Work", text: "Export a professional report and keep takeoff notes with the selected project." },
  ];

  const iconOptions = ["Layers", "Ruler", "Building2", "Home", "Sparkles", "ClipboardCheck"];
  const colorOptions = ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#64748b"];
  const IconByName = { Layers, Ruler, Building2, Home, Sparkles, ClipboardCheck };
  const scalePresets = [
    { label: "1/8\" = 1'", detail: "Small residential", feet: 10, multiplier: 0.5 },
    { label: "3/16\" = 1'", detail: "Site plans", feet: 7, multiplier: 0.75 },
    { label: "1/4\" = 1'", detail: "Floor plans", feet: 5, multiplier: 1 },
    { label: "3/8\" = 1'", detail: "Detailed plans", feet: 4, multiplier: 1.5 },
    { label: "1/2\" = 1'", detail: "Large details", feet: 3, multiplier: 2 },
    { label: "3/4\" = 1'", detail: "Cabinet details", feet: 2, multiplier: 3 },
    { label: "1\" = 1'", detail: "Full details", feet: 1, multiplier: 4 },
    { label: "1 1/2\" = 1'", detail: "Large details", feet: 1, multiplier: 6 },
    { label: "3\" = 1'", detail: "Full size details", feet: 1, multiplier: 12 },
  ];

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPlanUrl(URL.createObjectURL(file));
    setStarted(true);
  }

  function pointFromEvent(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * 1000, y: ((event.clientY - rect.top) / rect.height) * 1000 };
  }

  function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  function polygonArea(points) {
    const area = points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0);
    return Math.abs(area / 2);
  }

  function convertQuantity(type, points) {
    if (type.includes("Count")) return 1;
    if (type.includes("Linear")) return points.length > 1 ? (distance(points[0], points[1]) / 16) * scaleMultiplier : 0;
    if (type.includes("Volume")) return points.length > 2 ? ((polygonArea(points) / 260) * Math.pow(scaleMultiplier, 2)) * 0.33 / 27 : 0;
    return points.length > 2 ? (polygonArea(points) / 12) * Math.pow(scaleMultiplier, 2) : 0;
  }

  function applyScalePreset(preset) {
    setScaleLabel(preset.label);
    setScaleFeet(preset.feet);
    setScaleMultiplier(preset.multiplier);
    setShowScaleModal(false);
    setCalibrationMode(false);
    setCalibrationPoints([]);
  }

  function startCalibration() {
    setShowScaleModal(false);
    setCalibrationMode(true);
    setCalibrationPoints([]);
    setTool("draw");
    setMeasureMode("linear");
  }

  function addMeasurement(points) {
    const quantity = convertQuantity(activeGroup.type, points);
    if (!quantity) return;
    setMeasurements((current) => [...current, { id: Date.now(), groupId: activeGroupId, mode: activeGroup.type, points, quantity, label: activeGroup.name }]);
    setDraftPoints([]);
  }

  function handlePlanClick(event) {
    if (calibrationMode) {
      const point = pointFromEvent(event);
      const nextPoints = [...calibrationPoints, point];
      setCalibrationPoints(nextPoints);
      if (nextPoints.length >= 2) {
        const drawnFeet = distance(nextPoints[0], nextPoints[1]) / 16;
        const realFeet = Math.max(cleanNumber(calibrationDistance), 0.1);
        setScaleMultiplier(realFeet / Math.max(drawnFeet, 0.1));
        setScaleFeet(realFeet);
        setScaleLabel(`Custom ${realFeet} ft`);
        setCalibrationMode(false);
        setCalibrationPoints([]);
      }
      return;
    }
    if (tool === "pan" || tool === "select") return;
    const point = pointFromEvent(event);
    if (tool === "note") {
      setMeasurements((current) => [...current, { id: Date.now(), groupId: activeGroupId, mode: "Note", points: [point], quantity: 0, label: note || "Field note" }]);
      setNote("");
      return;
    }
    if (measureMode === "count" || activeGroup.type.includes("Count")) {
      addMeasurement([point]);
      return;
    }
    const nextPoints = [...draftPoints, point];
    setDraftPoints(nextPoints);
    if (measureMode === "linear" || activeGroup.type.includes("Linear")) {
      if (nextPoints.length >= 2) addMeasurement(nextPoints.slice(0, 2));
    } else if (nextPoints.length >= 4) {
      addMeasurement(nextPoints);
    }
  }

  function finishArea() {
    if (draftPoints.length >= 3) addMeasurement(draftPoints);
  }

  function addGroup() {
    const id = `${draftGroup.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    setGroups((current) => [...current, { id, name: draftGroup.name || "Custom", type: draftGroup.type, icon: draftGroup.icon, color: draftGroup.color, waste: 10, unitCost: 1 }]);
    setActiveGroupId(id);
    setShowGroupModal(false);
  }

  function seedAiMeasurements() {
    if (!measurements.length) {
      setMeasurements([
        { id: Date.now() + 1, groupId: "flooring", mode: "Area (SF)", points: [{ x: 250, y: 620 }, { x: 390, y: 620 }, { x: 390, y: 820 }, { x: 250, y: 820 }], quantity: 324, label: "Living room flooring" },
        { id: Date.now() + 2, groupId: "trim", mode: "Linear (LF)", points: [{ x: 250, y: 620 }, { x: 390, y: 620 }], quantity: 72, label: "Baseboard trim" },
        { id: Date.now() + 3, groupId: "electrical", mode: "Count", points: [{ x: 320, y: 650 }], quantity: 14, label: "Outlets" },
      ]);
    }
  }

  function aiGenerate() {
    setAiChoiceView("menu");
    setAiOpen(true);
  }

  function runTakeoffAnalysis(type) {
    seedAiMeasurements();
    setTakeoffMode("ai");
    setAiOpen(false);
    setAiResultType(type);
    setAiLoading(true);
    setTakeoffStatus(type === "mep" ? "Starting MEP analysis..." : type === "custom" ? "Starting custom AI analysis..." : "Starting full AI analysis...");
    window.setTimeout(() => {
      setAiLoading(false);
      setTakeoffStatus(type === "mep" ? "MEP analysis complete. Verify counts against your drawings." : type === "custom" ? "Custom AI analysis complete. Review the focused quantities before ordering." : "Full AI analysis complete. Review quantities before ordering.");
    }, 1100);
  }

  function saveTakeoff() {
    setTakeoffStatus("Takeoff saved to this project workspace.");
    setMenuOpen(false);
  }

  function renderAiSummary() {
    if (aiLoading) {
      return <div className="mt-20 rounded-3xl border border-purple-400/20 bg-purple-400/5 p-8 text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-cyan-300/30 text-cyan-200"><Bot /></motion.div><p className="mt-5 font-black text-white">Analyzing plans...</p><p className="mt-2 text-sm text-slate-400">Preparing quantities, counts, and cost-ready takeoff notes.</p></div>;
    }
    if (!measurements.length && !aiResultType) {
      return <div className="mt-20 rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center"><Bot className="mx-auto text-cyan-300" size={34} /><p className="mt-5 font-black text-white">Run AI analysis to see results</p><p className="mt-2 text-sm leading-6 text-slate-400">Choose Full, Custom, or MEP analysis to organize plan quantities.</p><button onClick={aiGenerate} className="primary-button mt-5 w-full justify-center">Run AI Takeoff</button></div>;
    }
    if (aiResultType === "mep") {
      const mepSections = [
        ["Electrical", "0 items", [["Electrical Outlets", "0 count"], ["Switches", "0 count"], ["Light Fixtures", "0 count"]], "text-amber-300"],
        ["Plumbing", "28 items", [["Sinks", "14 count"], ["Toilets", "6 count"], ["Bathtubs", "6 count"], ["Showers", "0 count"], ["Laundry Connections", "2 count"]], "text-blue-300"],
        ["Mechanical (HVAC)", "4 items", [["Exhaust Fans", "4 count"], ["Thermostats", "0 count"]], "text-emerald-300"],
      ];
      return <div className="mt-6 space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-2xl font-black text-white">MEP Analysis</h3><p className="text-sm text-slate-500">Mechanical, electrical, and plumbing estimate.</p></div><span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-emerald-950">90% Excellent</span></div><div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm font-bold leading-6 text-amber-100">AI measurements are estimates and may not be accurate. Do not order materials based only on this analysis.</div>{mepSections.map(([title, total, rows, color]) => <div key={title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="mb-3 flex justify-between"><p className={`font-black ${color}`}>{title}</p><span className="rounded-full bg-white/5 px-3 py-1 text-xs font-black text-slate-300">{total}</span></div>{rows.map(([label, value]) => <div key={label} className="flex justify-between border-t border-white/10 py-2 text-sm"><span className="text-slate-300">{label}</span><span className="font-black text-white">{value}</span></div>)}</div>)}<div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><p className="font-black text-white">Estimated Ductwork</p><p className="mt-1 text-3xl font-black text-emerald-300">240 LF</p></div><div className="rounded-2xl bg-slate-900/70 p-4 text-sm leading-6 text-slate-400"><span className="font-black text-white">Notes: </span>Drawing is an architectural floor plan. Electrical symbols are not present on this sheet, so electrical counts are conservative. Plumbing counts are based on visible fixture rooms.</div></div>;
    }
    const fullRows = aiResultType === "custom"
      ? [["Focused Scope", customPrompt || "Architectural quantities"], ["Pages", "Page 1"], ["Confidence", "76% - Needs Review"]]
      : [["Heated Square Footage", "2,862"], ["Total Under Roof", "3,248"], ["Confidence", "73% - Good"]];
    return <div className="mt-6 space-y-4"><div className="flex items-center justify-between"><h3 className="text-2xl font-black text-white">{aiResultType === "custom" ? "Custom Analysis" : "AI Takeoff Summary"}</h3><span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">{aiResultType === "custom" ? "76% Needs Review" : "73% Good"}</span></div><div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm font-bold leading-6 text-amber-100">AI measurements are estimates. Always verify quantities against your actual drawings before ordering.</div><div className="grid grid-cols-2 gap-3">{fullRows.map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-900/70 p-4"><p className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</p><p className="mt-1 text-xl font-black text-white">{value}</p></div>)}</div>{[["Flooring", "2,862 sq ft", "Main Floor"], ["Drywall", "8,846 sq ft", "Wall and ceiling drywall less openings"], ["Roofing", "3,424 sq ft", "Main house plus covered porches"], ["Counts", "48 items", "Windows, exterior doors, and interior doors"], ["Interior Trim", "778 LF", "Window trim and door trim"], ["Baseboard", "936 LF", "Room-by-room baseboard estimate"]].map(([title, value, detail]) => <div key={title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"><div className="flex justify-between gap-3"><p className="font-black text-white">{title}</p><span className="rounded-full bg-white/5 px-3 py-1 text-sm font-black text-slate-300">{value}</span></div><p className="mt-2 text-sm text-slate-400">{detail}</p></div>)}</div>;
  }

  async function exportPdf() {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save("operitron-takeoff-report.pdf");
  }

  function resetMeasurements() {
    setMeasurements([]);
    setDraftPoints([]);
    setMenuOpen(false);
  }

  const intro = (
    <ToolShell title={isEs ? "Material Takeoff" : "Material Takeoff"} subtitle={isEs ? "Sube planos, mide areas y genera cantidades." : "Upload plans, measure areas, and generate quantities."}>
      <ProjectContext project={project} language={language} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-slate-950 to-purple-500/10 p-8">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-200">AI Takeoff Workspace</span>
          <h3 className="mt-5 text-4xl font-black text-white">Measure plans, organize scopes, and calculate material costs.</h3>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">Start with the included floor plan or upload your own PDF/image. Create measurement groups, set scale, draw areas, count fixtures, and export a contractor-ready takeoff report.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setStarted(true)} className="primary-button">Get Started</button>
            <label className="secondary-button cursor-pointer"><Upload size={18} /> Upload Plan<input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFile} /></label>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <h4 className="text-xl font-black text-white">What this tool does</h4>
          {["PDF/image plan viewer", "Measurement groups", "Area, linear, count and volume tools", "AI-style material summary", "PDF report export"].map((item) => <p key={item} className="mt-4 flex gap-3 text-slate-300"><CheckCircle2 className="text-emerald-300" size={18} /> {item}</p>)}
        </div>
      </div>
    </ToolShell>
  );

  if (!started) return intro;

  return (
    <div className="fixed inset-0 z-50 flex bg-[#050812] text-slate-100">
      <aside className="hidden w-28 shrink-0 border-r border-white/10 bg-slate-950/95 p-2 lg:block">
        <label className="block cursor-pointer rounded-xl border-2 border-amber-400/80 bg-amber-400/10 p-1 text-center text-xs font-bold text-amber-100">
          <div className="h-28 overflow-hidden rounded-lg bg-white/90"><object data={planUrl} type="application/pdf" className="h-full w-full" aria-label="Plan thumbnail" /></div>
          <span className="mt-1 block">1</span>
          <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFile} />
        </label>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-slate-950/95 px-3">
          <button onClick={() => setStarted(false)} className="secondary-button h-11 px-3"><ChevronRight className="rotate-180" size={18} /> Back to Takeoff</button>
          {[['select', MousePointer2, 'Select'], ['pan', Move, 'Pan'], ['note', StickyNote, 'Note']].map(([id, Icon, label]) => <button key={id} onClick={() => setTool(id)} className={`rounded-xl px-3 py-2 font-bold ${tool === id ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:bg-white/5'}`}><Icon className="mr-2 inline" size={18} />{label}</button>)}
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          {['area', 'linear', 'count'].map((mode) => <button key={mode} onClick={() => { setTool('draw'); setMeasureMode(mode); }} className={`rounded-xl px-3 py-2 text-sm font-black uppercase ${measureMode === mode && tool === 'draw' ? 'bg-amber-400 text-slate-950' : 'border border-white/10 text-slate-300'}`}>{mode}</button>)}
          <button onClick={() => setShowScaleModal(true)} className="secondary-button h-11 px-3"><Ruler size={18} /> Set Scale</button>
          <div className="ml-auto flex items-center gap-2"><button onClick={() => setZoom(Math.max(20, zoom - 5))} className="rounded-xl p-2 hover:bg-white/5"><ZoomOut /></button><span className="w-12 text-center font-bold text-slate-400">{zoom}%</span><button onClick={() => setZoom(Math.min(125, zoom + 5))} className="rounded-xl p-2 hover:bg-white/5"><ZoomIn /></button><span className="hidden rounded-xl border border-white/10 px-3 py-2 text-sm font-black text-amber-200 xl:inline-flex"><Ruler className="mr-2" size={16} />{scaleLabel} ? {scaleFeet} ft</span><button onClick={finishArea} className="secondary-button h-11 px-3">Finish</button><button onClick={aiGenerate} className="rounded-xl bg-purple-500 px-4 py-3 font-black text-white shadow-lg shadow-purple-500/20"><Bot className="mr-2 inline" size={18} />AI Takeoff</button><div className="relative"><button onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl border border-white/10 p-3"><MoreVertical /></button>{menuOpen && <div className="absolute right-0 top-14 z-20 w-56 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl"><button onClick={saveTakeoff} className="flex w-full gap-3 rounded-xl px-3 py-3 text-left text-slate-300 hover:bg-white/5"><Save size={18} /> Save</button><button onClick={resetMeasurements} className="flex w-full gap-3 rounded-xl px-3 py-3 text-left text-rose-200 hover:bg-rose-400/10"><Trash2 size={18} /> Reset Measurements</button><button onClick={exportPdf} className="flex w-full gap-3 rounded-xl px-3 py-3 text-left text-slate-300 hover:bg-white/5"><Printer size={18} /> Print / Export</button><button onClick={() => { setShowTour(true); setTourStep(1); setMenuOpen(false); }} className="flex w-full gap-3 rounded-xl px-3 py-3 text-left text-slate-300 hover:bg-white/5"><HelpCircle size={18} /> Start Tour</button></div>}</div></div>
        </div>
        <div className="flex min-h-0 flex-1">
          <section className="relative min-w-0 flex-1 overflow-auto bg-[#070b14] p-5">
            <div className="mx-auto grid min-h-full place-items-center">
              <div ref={canvasRef} onClick={handlePlanClick} onDoubleClick={finishArea} className={`relative bg-white shadow-2xl shadow-black/50 ${tool === 'pan' ? 'cursor-move' : tool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`} style={{ width: `${Math.max(520, zoom * 18)}px`, height: `${Math.max(680, zoom * 24)}px` }}>
                {planUrl.toLowerCase().includes('.pdf') ? <object data={planUrl} type="application/pdf" className="h-full w-full" aria-label="Uploaded floor plan"><div className="grid h-full place-items-center p-8 text-center text-slate-900">PDF preview unavailable. Click the canvas to measure anyway.</div></object> : <img src={planUrl} alt="Uploaded floor plan" className="h-full w-full object-contain" />}
                <svg viewBox="0 0 1000 1000" className="pointer-events-none absolute inset-0 h-full w-full">
                  {measurements.map((measurement) => {
                    const group = groups.find((item) => item.id === measurement.groupId) || activeGroup;
                    if (measurement.mode === "Note") return <text key={measurement.id} x={measurement.points[0].x} y={measurement.points[0].y} fill={group.color} fontSize="30" fontWeight="800">{measurement.label}</text>;
                    if (measurement.points.length === 1) return <circle key={measurement.id} cx={measurement.points[0].x} cy={measurement.points[0].y} r="12" fill={group.color} />;
                    if (measurement.points.length === 2) return <line key={measurement.id} x1={measurement.points[0].x} y1={measurement.points[0].y} x2={measurement.points[1].x} y2={measurement.points[1].y} stroke={group.color} strokeWidth="7" strokeDasharray="14 10" />;
                    return <polygon key={measurement.id} points={measurement.points.map((point) => `${point.x},${point.y}`).join(" | ")} fill={`${group.color}55`} stroke={group.color} strokeWidth="6" />;
                  })}
                  {draftPoints.length > 0 && <polyline points={draftPoints.map((point) => `${point.x},${point.y}`).join(" | ")} fill="none" stroke="#22d3ee" strokeWidth="6" strokeDasharray="10 8" />}
                  {calibrationPoints.length > 0 && <polyline points={calibrationPoints.map((point) => `${point.x},${point.y}`).join(" | ")} fill="none" stroke="#facc15" strokeWidth="8" strokeDasharray="12 8" />}
                </svg>
              </div>
            </div>
            {calibrationMode && <div className="absolute bottom-8 left-1/2 z-10 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-amber-400/30 bg-slate-950/95 p-4 text-center shadow-2xl"><p className="font-black text-amber-200">Calibration mode</p><p className="mt-1 text-sm text-slate-400">Click two known points on the plan. Distance: {calibrationDistance} ft. {calibrationPoints.length}/2 points selected.</p><button onClick={() => { setCalibrationMode(false); setCalibrationPoints([]); }} className="mt-3 rounded-xl border border-white/10 px-4 py-2 font-bold text-slate-200">Cancel</button></div>}
            {showTour && <div className="absolute right-8 top-8 z-10 w-[min(420px,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl"><div className="flex justify-between"><div className="flex gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-amber-400/15 text-amber-300"><HelpCircle /></div><h3 className="text-xl font-black text-white">{tour[tourStep - 1].title}</h3></div><button onClick={() => setShowTour(false)}><X /></button></div><p className="mt-4 text-lg leading-7 text-slate-400">{tour[tourStep - 1].text}</p><div className="mt-6 flex items-center justify-between"><span className="text-sm text-slate-400">Step {tourStep} of 5</span><div className="flex gap-2">{tourStep > 1 && <button onClick={() => setTourStep(tourStep - 1)} className="secondary-button h-11 px-3">Previous</button>}<button onClick={() => tourStep === 5 ? setShowTour(false) : setTourStep(tourStep + 1)} className="primary-button h-11 px-4">{tourStep === 5 ? "Get Started" : "Next"}</button></div></div><div className="mt-4 flex justify-center gap-2">{tour.map((_, index) => <span key={index} className={`h-2 w-2 rounded-full ${index + 1 === tourStep ? 'bg-amber-400' : 'bg-slate-600'}`} />)}</div></div>}
          </section>
          <aside className="hidden w-[380px] shrink-0 overflow-y-auto border-l border-white/10 bg-slate-950/95 lg:flex lg:flex-col">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/70 p-2">
                <button onClick={() => setTakeoffMode("manual")} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 font-black transition ${takeoffMode === "manual" ? "bg-amber-400 text-slate-950 shadow-[0_0_22px_rgba(251,191,36,.22)]" : "text-slate-300 hover:bg-white/5"}`}><Sparkles size={18} />Manual</button>
                <button type="button" aria-label="Toggle Manual and AI takeoff modes" onClick={() => setTakeoffMode(takeoffMode === "manual" ? "ai" : "manual")} className={`relative h-10 w-16 rounded-full border border-white/10 transition ${takeoffMode === "ai" ? "bg-purple-500" : "bg-amber-400"}`}>
                  <span className={`absolute top-1 h-8 w-8 rounded-full bg-slate-950 shadow-lg transition-transform ${takeoffMode === "ai" ? "translate-x-7" : "translate-x-1"}`} />
                </button>
                <button onClick={() => setTakeoffMode("ai")} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 font-black transition ${takeoffMode === "ai" ? "bg-purple-500 text-white shadow-[0_0_24px_rgba(168,85,247,.24)]" : "text-slate-300 hover:bg-white/5"}`}>AI <Bot size={18} /></button>
              </div>
            </div>

            {takeoffMode === "manual" ? (
              <>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-white">Measurement Groups</h3>
                    <button onClick={() => setShowGroupModal(true)} className="rounded-xl p-2 text-white hover:bg-white/5"><Plus /></button>
                  </div>
                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/60 p-2">
                    {groups.map((group) => {
                      const Icon = IconByName[group.icon] || Layers;
                      return <button key={group.id} onClick={() => setActiveGroupId(group.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${activeGroupId === group.id ? "bg-amber-400 text-slate-950" : "text-slate-200 hover:bg-white/5"}`}><Icon size={18} /><span className="flex-1 font-black">{group.name}</span><span className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} /><Eye size={16} /></button>;
                    })}
                  </div>
                  <button onClick={() => setShowGroupModal(true)} className="mt-3 w-full rounded-xl border border-white/10 py-3 font-black text-slate-200 hover:border-amber-400/40">Edit / Add Group</button>
                </div>
                <div className="border-t border-white/10 p-5">
                  <h3 className="text-xl font-black text-white">Project Summary</h3>
                  {measurements.length ? <div className="mt-4 space-y-3">{totalsByGroup.filter((group) => group.count).map((group) => <div key={group.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"><div className="flex justify-between"><span className="font-black text-white">{group.name}</span><span className="text-cyan-300">{formatMoney(group.cost)}</span></div><p className="mt-1 text-sm text-slate-400">{formatNumber(group.withWaste, 1)} units incl. {group.waste}% waste</p></div>)}<div className="rounded-2xl bg-cyan-300/10 p-4 text-lg font-black text-cyan-100">Total: {formatMoney(totalCost)}</div></div> : <p className="mt-8 text-center text-slate-500">No measurements yet<br />Select a group and start drawing</p>}
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col">
                                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                  {renderAiSummary()}
                  {takeoffStatus && <p className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100">{takeoffStatus}</p>}
                </div>                <div className="mt-auto grid grid-cols-2 gap-3 border-t border-white/10 p-4">
                  <button onClick={exportPdf} className="secondary-button justify-center"><Printer size={18} />PDF</button>
                  <button onClick={saveTakeoff} className="primary-button justify-center"><Save size={18} />Save</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      {showScaleModal && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-md"><div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h3 className="flex items-center gap-3 text-2xl font-black text-white"><Ruler className="text-amber-300" /> Set Drawing Scale</h3><p className="mt-3 max-w-2xl text-lg leading-7 text-slate-400">Choose a preset scale or calibrate manually by clicking two points on the plan.</p></div><button onClick={() => setShowScaleModal(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X /></button></div><div className="mt-6"><p className="mb-3 font-black text-white">Preset Scales</p><div className="grid gap-3 sm:grid-cols-3">{scalePresets.map((preset) => <button key={preset.label} onClick={() => applyScalePreset(preset)} className={`rounded-2xl border p-4 text-left transition hover:border-amber-400/60 hover:bg-amber-400/10 ${scaleLabel === preset.label ? "border-amber-400 bg-amber-400/10 shadow-[0_0_28px_rgba(251,191,36,.18)]" : "border-white/10 bg-slate-900/60"}`}><p className="text-lg font-black text-white">{preset.label}</p><p className="mt-1 text-sm font-bold text-slate-500">{preset.detail}</p></button>)}</div></div><div className="mt-7"><p className="mb-3 font-black text-white">Custom Calibration</p><div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-5"><p className="text-slate-400">Click two points on the plan and enter the real-world distance.</p><label className="mt-4 block"><span className="label">Known distance in feet</span><input inputMode="decimal" className="field" value={calibrationDistance} onChange={(event) => setCalibrationDistance(event.target.value)} /></label><button onClick={startCalibration} className="primary-button mt-4 w-full justify-center"><MousePointer2 size={18} /> Start Calibration</button></div></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-cyan-200">Current: {scaleLabel} ? {scaleFeet} ft</p><button onClick={() => setShowScaleModal(false)} className="secondary-button">Cancel</button></div></div></div>}
      {showGroupModal && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-2xl font-black text-white">Add Group</h3><button onClick={() => setShowGroupModal(false)}><X /></button></div><div className="mt-5 grid gap-4"><label><span className="label">Name</span><input className="field text-lg" value={draftGroup.name} onChange={(event) => setDraftGroup({ ...draftGroup, name: event.target.value })} /></label><label><span className="label">Type</span><select className="field" value={draftGroup.type} onChange={(event) => setDraftGroup({ ...draftGroup, type: event.target.value })}><option>Area (SF)</option><option>Linear (LF)</option><option>Count</option><option>Volume (YD3)</option></select></label><label><span className="label">Parent Group</span><select className="field" value={draftGroup.parent} onChange={(event) => setDraftGroup({ ...draftGroup, parent: event.target.value })}><option>None</option>{groups.map((group) => <option key={group.id}>{group.name}</option>)}</select></label><div className="grid gap-4 md:grid-cols-2"><div><span className="label">Icon</span><div className="grid grid-cols-6 gap-2 rounded-2xl bg-slate-900 p-3">{iconOptions.map((icon) => { const Icon = IconByName[icon] || Layers; return <button key={icon} onClick={() => setDraftGroup({ ...draftGroup, icon })} className={`grid h-10 place-items-center rounded-xl ${draftGroup.icon === icon ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}><Icon size={18} /></button>; })}</div></div><div><span className="label">Color</span><div className="grid grid-cols-7 gap-2 rounded-2xl bg-slate-900 p-3">{colorOptions.map((color) => <button key={color} onClick={() => setDraftGroup({ ...draftGroup, color })} className={`h-9 rounded-lg border-2 ${draftGroup.color === color ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: color }} />)}</div></div></div><label><span className="label">Pitch</span><select className="field" value={draftGroup.pitch} onChange={(event) => setDraftGroup({ ...draftGroup, pitch: event.target.value })}><option>Flat (0/12)</option><option>Low slope (3/12)</option><option>Standard (6/12)</option><option>Steep (9/12)</option></select></label><label className="flex items-center gap-3 text-white"><input type="checkbox" checked={draftGroup.volume} onChange={(event) => setDraftGroup({ ...draftGroup, volume: event.target.checked })} /> Calculate volume (yd3)</label></div><div className="mt-6 flex justify-end gap-3"><button onClick={() => setShowGroupModal(false)} className="secondary-button">Cancel</button><button onClick={addGroup} className="primary-button">Save</button></div></div></div>}
      {aiOpen && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-3 text-2xl font-black text-white"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-500/20 text-amber-300"><Bot /></span>AI Takeoff Analysis</h3>
            <button onClick={() => setAiOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X /></button>
          </div>
          {aiChoiceView === "menu" ? <>
            <p className="mt-5 text-lg text-slate-400">Choose how you want to analyze your floor plans.</p>
            <div className="mt-7 space-y-4">
              <button onClick={() => runTakeoffAnalysis("full")} className="group flex w-full gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left transition hover:border-cyan-300/50 hover:bg-cyan-300/10">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cyan-400 text-slate-950"><Sparkles /></span>
                <span><span className="text-xl font-black text-white">Full Analysis <span className="ml-2 rounded-full bg-amber-400/15 px-3 py-1 text-sm text-amber-300">1 page</span></span><span className="mt-2 block text-slate-400">Analyze all pages automatically</span><span className="mt-3 block leading-6 text-slate-500">Extract heated square footage, flooring, drywall, siding, roofing, door/window counts, and trim assumptions.</span></span>
              </button>
              <button onClick={() => setAiChoiceView("custom")} className="group flex w-full gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left transition hover:border-fuchsia-300/50 hover:bg-fuchsia-300/10">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-fuchsia-500 text-white"><Mail /></span>
                <span><span className="text-xl font-black text-white">Custom Analysis <Sparkles className="ml-2 inline text-fuchsia-300" size={18} /></span><span className="mt-2 block text-slate-400">Tell me what you need</span><span className="mt-3 block leading-6 text-slate-500">Specify pages and characteristics such as roofing only, window counts, trim, or selected rooms.</span></span>
              </button>
              <button onClick={() => runTakeoffAnalysis("mep")} className="group flex w-full gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left transition hover:border-emerald-300/50 hover:bg-emerald-300/10">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><Settings /></span>
                <span><span className="text-xl font-black text-white">MEP Analysis <span className="ml-2 rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">NEW</span></span><span className="mt-2 block text-slate-400">Mechanical, Electrical & Plumbing</span><span className="mt-3 block leading-6 text-slate-500">Identify and quantify outlets, switches, panels, light fixtures, plumbing fixtures, HVAC equipment, and duct assumptions.</span></span>
              </button>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={() => setAiOpen(false)} className="secondary-button">Cancel</button></div>
          </> : <>
            <button onClick={() => setAiChoiceView("menu")} className="mt-5 flex items-center gap-2 text-sm font-black text-slate-300 hover:text-white"><ChevronRight className="rotate-180" size={16} />Back</button>
            <div className="mt-5 rounded-3xl bg-slate-900/80 p-5 text-slate-200"><p className="leading-7">Hi! I can help you with a custom takeoff analysis. Tell me which page(s) you want to analyze and what you are looking for, like roofing measurements, window counts, drywall, or doors.</p></div>
            <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4"><p className="font-black text-white">Ready to start the analysis?</p><p className="mt-2 text-sm text-slate-400">I will analyze page(s): 1</p><p className="mt-1 text-sm text-slate-400">Looking for: {customPrompt || "Analyze all architectural elements, measurements, and counts."}</p></div>
            <div className="mt-5 flex gap-3"><textarea value={customPrompt} onChange={(event) => setCustomPrompt(event.target.value)} className="field min-h-28 flex-1" placeholder="Tell me which pages to analyze and what you're looking for..." /><button onClick={() => runTakeoffAnalysis("custom")} className="primary-button self-end"><Bot size={18} />Go</button></div>
          </>}
        </div>
      </div>}      <div ref={reportRef} className="fixed -left-[9999px] top-0 w-[794px] bg-white p-10 text-slate-950"><div className="flex justify-between border-b border-slate-300 pb-5"><h1 className="text-3xl font-black">Takeoff Report</h1><p>{new Date().toLocaleDateString()}</p></div>{totalsByGroup.filter((group) => group.count).map((group) => <div key={group.id} className="flex justify-between border-b border-slate-200 py-4"><span><strong>{group.name}</strong><br />{group.count} measurements</span><span>{formatNumber(group.withWaste, 1)} units<br /><small>{group.waste}% waste</small></span></div>)}<div className="flex justify-between pt-5 text-xl font-black"><span>Total</span><span>{formatMoney(totalCost)}</span></div><p className="mt-8 text-sm text-slate-500">Generated by Operitron</p></div>
    </div>
  );
}
function Checklist({ items, project, language = "en" }) {
  const isEs = language === "es";
  const [tasks, setTasks] = useState(items.map((item, index) => ({ title: item, done: index === 1, priority: index % 2 ? "High" : "Normal", due: index % 2 ? "Friday" : "Next week" })));
  const [newTask, setNewTask] = useState("");
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { title: newTask.trim(), done: false, priority: "Normal", due: "Unscheduled" }]);
      setNewTask("");
    }
  };
  const toggleTask = (index) => setTasks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item));
  const removeTask = (index) => setTasks((current) => current.filter((_, itemIndex) => itemIndex !== index));
  return <div className="space-y-5"><ProjectContext project={project} language={language} /><div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-2xl font-black text-white">{isEs ? "Lista de Tareas" : "To Do List"}</h3><p className="text-slate-400">{isEs ? "Coordina próximos pasos de inversión y obra." : "Coordinate investment and construction next steps."}</p></div><span className="rounded-full bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">{tasks.filter((task) => !task.done).length} {isEs ? "abiertas" : "open"}</span></div><div className="flex flex-col gap-3 sm:flex-row"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addTask(); }} className="field" placeholder={isEs ? "Nueva tarea..." : "New task..."} /><button onClick={addTask} className="primary-button shrink-0"><Plus size={18} /> {isEs ? "Agregar" : "Add"}</button></div><div className="space-y-3">{tasks.map((task, index) => <div key={`${task.title}-${index}`} className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/[.03] sm:gap-4 sm:p-4"><button type="button" onClick={() => toggleTask(index)} aria-label={task.done ? (isEs ? "Marcar como pendiente" : "Mark task open") : (isEs ? "Marcar como completada" : "Mark task complete")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-white/5 hover:text-emerald-300"><CheckCircle2 className={task.done ? "text-emerald-300" : "text-slate-600"} /></button><button type="button" onClick={() => toggleTask(index)} className="min-w-0 flex-1 text-left"><p className={`break-words font-black text-white ${task.done ? "line-through opacity-60" : ""}`}>{task.title}</p><p className="text-sm text-slate-400">{task.priority} | {task.due}</p></button><button type="button" onClick={() => removeTask(index)} aria-label={isEs ? `Eliminar ${task.title}` : `Remove ${task.title}`} title={isEs ? "Eliminar tarea" : "Remove task"} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-rose-300/15 text-rose-200 opacity-90 transition hover:border-rose-300/40 hover:bg-rose-400/10 hover:text-rose-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"><Trash2 size={18} /></button></div>)}</div></div>;
}

function PunchListApp({ language = "en", project }) {
  const isEs = language === "es";
  const [guideStep, setGuideStep] = useState(0);
  const [guideDismissed, setGuideDismissed] = useState(false);
  const guide = isEs
    ? [["Crear Lista", "Crea una lista por recorrido o fase de cierre."], ["Agregar Problemas", "Registra descripcion, oficio, responsable y fotos."], ["Filtrar por Oficio", "Comparte solo los pendientes de cada subcontratista."], ["Entrada por Voz", "Registra pendientes en el sitio con manos libres."], ["Exportar y Compartir", "Entrega un PDF profesional al equipo."]]
    : [["Create a Punch List", "Create a list for each walkthrough or closeout phase."], ["Add Issues", "Capture description, trade, assignee, and photos."], ["Filter by Trade", "Share each contractor's relevant open items."], ["Voice Input", "Log site observations hands-free."], ["Export & Share", "Deliver a professional PDF to the team."]];
  const [items, setItems] = useState([
    { title: "Leaking Kitchen Sink", trade: "Plumbing", location: "Unit B", status: "Open", color: "red", done: false },
    { title: "Non-Functional Lighting", trade: "Electrical", location: "Hallway 2F", status: "Open", color: "yellow", done: false },
    { title: "Drywall Patch - Master BR", trade: "Drywall", location: "Master Bedroom", status: "Resolved", color: "green", done: true },
  ]);
  const [tradeFilter, setTradeFilter] = useState("All");
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [draftItem, setDraftItem] = useState({ title: "", trade: "General", location: "", status: "Open" });
  const reportRef = useRef(null);
  const visibleItems = tradeFilter === "All" ? items : items.filter((item) => item.trade === tradeFilter);
  const trades = ["All", ...Array.from(new Set(items.map((item) => item.trade))).filter(Boolean)];
  const colorForStatus = (status) => status === "Resolved" ? "green" : status === "In Progress" ? "yellow" : "red";
  const toggle = (targetItem) => setItems((current) => current.map((item) => item === targetItem ? { ...item, done: !item.done, status: item.done ? "Open" : "Resolved", color: item.done ? "yellow" : "green" } : item));
  const removeItem = (targetItem) => setItems((current) => current.filter((item) => item !== targetItem));
  const tradeCounts = items.reduce((acc, item) => ({ ...acc, [item.trade]: (acc[item.trade] || 0) + 1 }), {});

  function createList() {
    if (!items.length || window.confirm(isEs ? "Esto iniciara una lista nueva y limpiara los elementos actuales." : "This will start a new list and clear current items.")) {
      setItems([]);
      setTradeFilter("All");
      setGuideDismissed(true);
      setVoiceStatus(isEs ? "Nueva lista creada." : "New punch list created.");
    }
  }

  function saveItem() {
    if (!draftItem.title.trim()) return;
    setItems((current) => [{
      ...draftItem,
      title: draftItem.title.trim(),
      trade: draftItem.trade.trim() || "General",
      location: draftItem.location.trim() || "Unassigned",
      done: draftItem.status === "Resolved",
      color: colorForStatus(draftItem.status),
    }, ...current]);
    setDraftItem({ title: "", trade: "General", location: "", status: "Open" });
    setItemModalOpen(false);
  }

  function startVoicePunch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus(isEs ? "Tu navegador no permite transcripcion por voz. Usa Chrome o Edge." : "Voice transcription is not available in this browser. Try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isEs ? "es-US" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setVoiceStatus(isEs ? "Escuchando... habla el pendiente." : "Listening... speak the punch item.");
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setItems((current) => [{ title: transcript, trade: "General", location: "Voice note", status: "Open", color: "yellow", done: false }, ...current]);
        setVoiceStatus(isEs ? `Agregado por voz: ${transcript}` : `Voice item added: ${transcript}`);
      }
    };
    recognition.onerror = (event) => setVoiceStatus(isEs ? `No se pudo grabar: ${event.error}` : `Voice capture failed: ${event.error}`);
    recognition.start();
  }

  async function exportPdf() {
    if (!items.length) {
      setVoiceStatus(isEs ? "Agrega al menos un elemento antes de generar PDF." : "Add at least one item before generating a PDF.");
      return;
    }
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save("operitron-punch-list-report.pdf");
  }

  return (
    <ToolShell title="Construction Punch List App" subtitle="Close out projects faster with mobile-first issue tracking, photos, voice input, trade assignments, and PDF reports.">
      <ProjectContext project={project} language={language} />
      <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-3"><h3 className="text-2xl font-black text-white">{isEs ? "Recorrido de Cierre" : "Closeout Walkthrough"}</h3><button onClick={createList} className="primary-button"><Plus size={18} />{isEs ? "Crear Lista" : "Create List"}</button></div>
      {!guideDismissed && <div className="mb-7 rounded-3xl border border-cyan-300/20 bg-cyan-300/[.06] p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEs ? `Paso ${guideStep + 1} de ${guide.length}` : `Step ${guideStep + 1} of ${guide.length}`}</p><h4 className="mt-2 text-lg font-black text-white">{guide[guideStep][0]}</h4><p className="mt-2 text-sm text-slate-300">{guide[guideStep][1]}</p></div></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2">{guide.map((_, index) => <span key={index} className={`h-2 w-2 rounded-full ${index === guideStep ? "bg-cyan-300" : "bg-slate-700"}`} />)}</div><div className="flex gap-2"><button onClick={() => setGuideStep(Math.max(0, guideStep - 1))} className="secondary-button">{isEs ? "Anterior" : "Previous"}</button><button onClick={() => guideStep === guide.length - 1 ? setGuideDismissed(true) : setGuideStep(Math.min(guide.length - 1, guideStep + 1))} className="primary-button">{guideStep === guide.length - 1 ? (isEs ? "Comenzar" : "Get Started") : (isEs ? "Siguiente" : "Next")}</button></div></div>
      </div>}
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4">
        <select value={tradeFilter} onChange={(event) => setTradeFilter(event.target.value)} className="field min-h-[3rem] w-full sm:w-56">{trades.map((trade) => <option key={trade} value={trade}>{trade === "All" ? (isEs ? "Todos los oficios" : "All Trades") : trade}</option>)}</select>
        <button onClick={exportPdf} className="secondary-button"><FileText size={18} />{isEs ? "Generar PDF" : "Generate PDF"}</button>
        <button onClick={startVoicePunch} className="secondary-button"><Mic size={18} />{isEs ? "Punch por Voz" : "Voice Punch"}</button>
        <button onClick={() => setItemModalOpen(true)} className="primary-button"><Plus size={18} />{isEs ? "Agregar Item" : "Add Item"}</button>
      </div>
      {voiceStatus && <p className="mb-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm font-bold text-cyan-100">{voiceStatus}</p>}
      <div className="grid gap-7 xl:grid-cols-[390px_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-4 shadow-2xl"><div className="rounded-[1.6rem] bg-[#0b1225] p-4">
          <div className="mb-4 flex items-center justify-between"><p className="font-black text-white">Punch List</p><p className="rounded-full bg-red-400/20 px-3 py-1 text-xs font-black text-red-300">{items.filter((i) => !i.done).length} open</p></div>
          <div className="space-y-3">{visibleItems.length ? visibleItems.map((item) => <div key={`${item.title}-${item.location}`} className={`group rounded-2xl border p-4 text-left ${item.color === "red" ? "border-red-400/30 bg-red-400/10" : item.color === "yellow" ? "border-amber-400/30 bg-amber-400/10" : "border-emerald-400/30 bg-emerald-400/10 opacity-75"}`}><div className="flex gap-3"><button onClick={() => toggle(item)} className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${item.done ? "border-emerald-300 bg-emerald-400 text-slate-950" : "border-white/30 text-slate-500"}`}>{item.done ? "?" : ""}</button><div className="min-w-0 flex-1"><p className={`break-words font-black text-white ${item.done ? "line-through" : ""}`}>{item.title}</p><p className="text-sm text-slate-400">{item.trade} | {item.location}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400"><Camera size={14} /></span><span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400">+3 photos</span></div></div><button onClick={() => removeItem(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-rose-200 transition hover:bg-rose-400/10"><Trash2 size={17} /></button></div></div>) : <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-400">{isEs ? "No hay elementos para este filtro." : "No punch items for this filter."}</div>}</div>
          <div className="mt-5 flex justify-between border-t border-white/10 pt-4 text-slate-400"><button onClick={() => setVoiceStatus(isEs ? "Contactos de contratistas proximamente." : "Contractor contact shortcuts coming soon.")}><Phone /></button><button onClick={() => setItemModalOpen(true)} className="grid h-12 w-12 place-items-center rounded-full bg-amber-400 text-slate-950"><Plus /></button><button onClick={() => setVoiceStatus(isEs ? "Las fotos se adjuntaran al guardar documentos del proyecto." : "Photo attachments will be saved with project documents.")}><Camera /></button></div>
        </div></div>
        <div className="space-y-5"><ResultBox items={[["Mobile-first walkthrough", "Voice + photo capture", true], ["One-click PDF export", "Ready"], ["Real-time team sync", "Coming Soon"], ["Open items", items.filter((i) => !i.done).length]]} /><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><div className="flex items-center gap-3 text-amber-300"><Mic /><p className="font-black">Voice transcription</p></div><p className="mt-3 text-slate-300">{voiceStatus || "Say: leaking pipe under kitchen sink, Unit 4B, assigned to plumbing."}</p><ul className="mt-4 space-y-2 text-sm text-slate-400"><li>? Hands-free voice logging</li><li>? Unlimited photo attachments per item</li><li>? Auto-categorized by trade, priority, and location</li></ul></div><div className="grid gap-3 md:grid-cols-4">{Object.entries(tradeCounts).map(([trade, count]) => <MiniMetric key={trade} label={trade} value={`${count} items`} />)}</div><button onClick={exportPdf} className="primary-button">Export Professional PDF Punch List Report</button></div>
      </div>
      {itemModalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-2xl font-black text-white">{isEs ? "Agregar Item" : "Add Punch Item"}</h3><button onClick={() => setItemModalOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/5"><X /></button></div><div className="mt-5 grid gap-4"><label><span className="label">{isEs ? "Descripcion" : "Description"}</span><input className="field" value={draftItem.title} onChange={(event) => setDraftItem({ ...draftItem, title: event.target.value })} placeholder={isEs ? "Ej. Fuga debajo del fregadero" : "Example: leaking sink supply line"} /></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="label">{isEs ? "Oficio" : "Trade"}</span><input className="field" value={draftItem.trade} onChange={(event) => setDraftItem({ ...draftItem, trade: event.target.value })} /></label><label><span className="label">{isEs ? "Ubicacion" : "Location"}</span><input className="field" value={draftItem.location} onChange={(event) => setDraftItem({ ...draftItem, location: event.target.value })} placeholder="Unit B / Kitchen" /></label></div><label><span className="label">{isEs ? "Estado" : "Status"}</span><select className="field" value={draftItem.status} onChange={(event) => setDraftItem({ ...draftItem, status: event.target.value })}><option>Open</option><option>In Progress</option><option>Resolved</option></select></label></div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => setItemModalOpen(false)} className="secondary-button">{isEs ? "Cancelar" : "Cancel"}</button><button onClick={saveItem} className="primary-button">{isEs ? "Guardar Item" : "Save Item"}</button></div></div></div>}
      <div ref={reportRef} className="fixed -left-[9999px] top-0 w-[794px] bg-white p-10 text-slate-950"><div className="flex justify-between border-b border-slate-300 pb-5"><h1 className="text-3xl font-black">Punch List Report</h1><p>Apr 12, 2026</p></div>{items.map((item) => <div key={item.title} className="flex justify-between border-b border-slate-200 py-4"><span><strong>{item.title}</strong><br />{item.trade}</span><span>{item.status}</span></div>)}<p className="mt-8 text-sm text-slate-500">Generated by Operitron</p></div>
    </ToolShell>
  );
}

function BudgetEstimator({ language = "en", project }) {
  const isEs = language === "es";
  const [wizardOpen, setWizardOpen] = useState(false);
  const [specStep, setSpecStep] = useState(1);
  const [formulaGroup, setFormulaGroup] = useState("investment");
  const [spec, setSpec] = useState({ type: "New Construction", city: "Santa Rosa Beach", sqft: "2,000", foundation: "Slab", finish: "Standard" });
  const [contingencyPct, setContingencyPct] = useState("10");
  const [assumptions, setAssumptions] = useState({ salePrice: "365,000", purchase: "190,000", repairs: "45,000", rent: "2,800", expenses: "650", cashInvested: "65,000", loan: "240,000", rate: "7.25", years: "30", adr: "225", booked: "220", available: "365", acres: "2.5", units: "8", lotSize: "10,000", footprint: "2,600", wallArea: "6,200", roofArea: "2,800", monthlyDebt: "2,100", monthlyIncome: "9,500", revenue: "120,000", netProfit: "36,000", marketingSpend: "2,500", customers: "10", customerLifetime: "24", averageRevenue: "79" });
  const [rows, setRows] = useState([
    { category: "Pre-Construction & Acquisition", item: "Plans and permits", qty: "1", unit: "allowance", price: "8,500" },
    { category: "Site Prep & Foundation", item: "Slab foundation", qty: "2,000", unit: "sq ft", price: "12.50" },
    { category: "Shell / Exterior", item: "Framing and dry-in", qty: "2,000", unit: "sq ft", price: "39.00" },
    { category: "MEP Systems", item: "Electrical, plumbing, HVAC", qty: "2,000", unit: "sq ft", price: "29.00" },
    { category: "Interiors", item: "Finishes and cabinetry", qty: "2,000", unit: "sq ft", price: "42.00" },
  ]);
  const updateRow = (index, key, value) => setRows((current) => current.map((row, itemIndex) => itemIndex === index ? { ...row, [key]: value } : row));
  const addRow = () => setRows((current) => [...current, { category: "Custom", item: "New line item", qty: "1", unit: "each", price: "0" }]);
  const removeRow = (index) => setRows((current) => current.filter((_, itemIndex) => itemIndex !== index));
  const patchAssumption = (key, value) => setAssumptions((current) => ({ ...current, [key]: value }));
  const direct = rows.reduce((sum, row) => sum + cleanNumber(row.qty) * cleanNumber(row.price), 0);
  const contingency = direct * cleanNumber(contingencyPct) / 100;
  const total = direct + contingency;
  const sqft = Math.max(cleanNumber(spec.sqft), 1);
  const monthlyMortgage = formulas.monthlyMortgage(cleanNumber(assumptions.loan), cleanNumber(assumptions.rate), cleanNumber(assumptions.years));
  const annualRent = cleanNumber(assumptions.rent) * 12;
  const noi = annualRent - cleanNumber(assumptions.expenses) * 12;
  const annualDebt = monthlyMortgage * 12;
  const profit = cleanNumber(assumptions.salePrice) - cleanNumber(assumptions.purchase) - cleanNumber(assumptions.repairs) - total;
  const formulaGroups = {
    investment: [
      ["Cash Flow", "Income - Expenses", formatMoney(cleanNumber(assumptions.rent) - cleanNumber(assumptions.expenses) - monthlyMortgage)],
      ["NOI", "Gross Income - Operating Expenses", formatMoney(noi)],
      ["Cap Rate", "NOI / Property Value x 100", `${formulas.capRate(noi, cleanNumber(assumptions.salePrice)).toFixed(2)}%`],
      ["Cash-on-Cash", "Annual Cash Flow / Cash Invested x 100", `${formulas.cashOnCash(noi - annualDebt, cleanNumber(assumptions.cashInvested)).toFixed(2)}%`],
      ["DSCR", "NOI / Annual Debt Service", formulas.dscr(noi, annualDebt).toFixed(2)],
      ["1% Rule", "Monthly Rent >= 1% x Purchase", cleanNumber(assumptions.rent) >= cleanNumber(assumptions.purchase) * 0.01 ? "Pass" : "Review"],
      ["ARV / Value", "Estimated value after repairs", formatMoney(cleanNumber(assumptions.salePrice))],
      ["70% Max Offer", "ARV x 70% - Repairs", formatMoney(cleanNumber(assumptions.salePrice) * 0.7 - cleanNumber(assumptions.repairs))],
      ["Flip Profit", "Sale - Purchase - Repairs - Costs", formatMoney(profit)],
      ["ROI", "Profit / Total Investment x 100", `${formulas.roi(profit, cleanNumber(assumptions.purchase) + cleanNumber(assumptions.repairs) + total).toFixed(2)}%`],
    ],
    construction: [
      ["Cost / Sq Ft", "Total Build Cost / Square Feet", formatMoney(total / sqft)],
      ["Total Build Cost", "Square Feet x Cost / Sq Ft", formatMoney(sqft * (total / sqft))],
      ["Concrete Yards", "Length x Width x Thickness(ft) / 27", `${formatNumber((40 * 30 * 0.33) / 27, 2)} yd3`],
      ["Roofing Squares", "Roof Area / 100", formatNumber(cleanNumber(assumptions.roofArea) / 100, 2)],
      ["Roof Bundles", "Roof Squares x 3", formatNumber((cleanNumber(assumptions.roofArea) / 100) * 3, 0)],
      ["Drywall Sheets", "Wall Area / 32", formatNumber(cleanNumber(assumptions.wallArea) / 32, 0)],
      ["Paint Gallons", "Wall Area / 350", formatNumber(cleanNumber(assumptions.wallArea) / 350, 1)],
      ["Building Efficiency", "Living Area / Total Built Area x 100", `${((sqft / Math.max(sqft * 1.18, 1)) * 100).toFixed(1)}%`],
      ["Cost Overrun", "(Actual - Budget) / Budget x 100", `${(((total - direct) / Math.max(direct, 1)) * 100).toFixed(1)}%`],
      ["Block Count", "Wall Area / 1.125", formatNumber(cleanNumber(assumptions.wallArea) / 1.125, 0)],
    ],
    airbnb: [
      ["Occupancy", "Booked Nights / Available Nights x 100", `${((cleanNumber(assumptions.booked) / Math.max(cleanNumber(assumptions.available), 1)) * 100).toFixed(1)}%`],
      ["ADR", "Revenue / Booked Nights", formatMoney(cleanNumber(assumptions.adr))],
      ["RevPAR", "ADR x Occupancy", formatMoney(cleanNumber(assumptions.adr) * (cleanNumber(assumptions.booked) / Math.max(cleanNumber(assumptions.available), 1)))],
      ["Annual Revenue", "ADR x Occupancy x 365", formatMoney(cleanNumber(assumptions.adr) * cleanNumber(assumptions.booked))],
      ["Break Even Occ.", "Annual Expenses / (ADR x 365)", `${((cleanNumber(assumptions.expenses) * 12 / Math.max(cleanNumber(assumptions.adr) * 365, 1)) * 100).toFixed(1)}%`],
      ["Cleaning Ratio", "Cleaning Costs / Revenue x 100", "12.0%"],
    ],
    land: [
      ["Price / Acre", "Purchase Price / Acres", formatMoney(cleanNumber(assumptions.purchase) / Math.max(cleanNumber(assumptions.acres), 1))],
      ["Price / Lot", "Land Cost / Number of Lots", formatMoney(cleanNumber(assumptions.purchase) / Math.max(cleanNumber(assumptions.units), 1))],
      ["Density", "Units / Acres", `${formatNumber(cleanNumber(assumptions.units) / Math.max(cleanNumber(assumptions.acres), 1), 2)} units/ac`],
      ["Lot Coverage", "Building Footprint / Lot Size x 100", `${((cleanNumber(assumptions.footprint) / Math.max(cleanNumber(assumptions.lotSize), 1)) * 100).toFixed(1)}%`],
      ["Break-Even Sale", "Land + Construction + Fees + Interest", formatMoney(cleanNumber(assumptions.purchase) + total + annualDebt * 0.25)],
    ],
    management: [
      ["Revenue / Door", "Monthly Revenue / Units", formatMoney(cleanNumber(assumptions.rent) * cleanNumber(assumptions.units) / Math.max(cleanNumber(assumptions.units), 1))],
      ["Vacancy Rate", "Vacant Units / Total Units x 100", `${(1 / Math.max(cleanNumber(assumptions.units), 1) * 100).toFixed(1)}%`],
      ["Expense Ratio", "Operating Expenses / Gross Income", `${((cleanNumber(assumptions.expenses) * 12 / Math.max(annualRent, 1)) * 100).toFixed(1)}%`],
      ["GRM", "Property Price / Annual Rent", (cleanNumber(assumptions.salePrice) / Math.max(annualRent, 1)).toFixed(2)],
      ["Equity", "Property Value - Loan Balance", formatMoney(cleanNumber(assumptions.salePrice) - cleanNumber(assumptions.loan))],
    ],
    finance: [
      ["Mortgage Payment", "P r(1+r)^n / ((1+r)^n - 1)", formatMoneyCents(monthlyMortgage)],
      ["LTV", "Loan Amount / Property Value x 100", `${((cleanNumber(assumptions.loan) / Math.max(cleanNumber(assumptions.salePrice), 1)) * 100).toFixed(1)}%`],
      ["DTI", "Monthly Debt / Monthly Income", `${formulas.dti(cleanNumber(assumptions.monthlyDebt), cleanNumber(assumptions.monthlyIncome)).toFixed(1)}%`],
      ["Interest Cost", "Payment x Months - Principal", formatMoney(monthlyMortgage * cleanNumber(assumptions.years) * 12 - cleanNumber(assumptions.loan))],
      ["Cash-Out Refi", "New Loan - Current Balance", formatMoney(Math.max(0, cleanNumber(assumptions.loan) - cleanNumber(assumptions.purchase)))],
      ["Monthly Interest", "APR / 12", `${(cleanNumber(assumptions.rate) / 12).toFixed(3)}%`],
      ["Rule of 72", "72 / Interest Rate", `${(72 / Math.max(cleanNumber(assumptions.rate), 1)).toFixed(1)} years`],
    ],
    business: [
      ["Profit Margin", "Profit / Revenue x 100", `${formulas.profitMargin(cleanNumber(assumptions.netProfit), cleanNumber(assumptions.revenue)).toFixed(1)}%`],
      ["CAC", "Marketing Spend / Customers", formatMoney(formulas.cac(cleanNumber(assumptions.marketingSpend), Math.max(cleanNumber(assumptions.customers), 1)))],
      ["LTV", "Average Revenue x Customer Lifetime", formatMoney(cleanNumber(assumptions.averageRevenue) * cleanNumber(assumptions.customerLifetime))],
      ["LTV:CAC", "Lifetime Value / CAC", formulas.ltvCac(cleanNumber(assumptions.averageRevenue) * cleanNumber(assumptions.customerLifetime), formulas.cac(cleanNumber(assumptions.marketingSpend), Math.max(cleanNumber(assumptions.customers), 1))).toFixed(2)],
      ["MRR", "Sum of Monthly Subscriptions", formatMoney(cleanNumber(assumptions.averageRevenue) * cleanNumber(assumptions.customers))],
      ["ARR", "MRR x 12", formatMoney(cleanNumber(assumptions.averageRevenue) * cleanNumber(assumptions.customers) * 12)],
    ],
    wealth: [
      ["Net Worth", "Assets - Liabilities", formatMoney(cleanNumber(assumptions.salePrice) + total - cleanNumber(assumptions.loan))],
      ["Savings Rate", "Savings / Income x 100", `${((cleanNumber(assumptions.netProfit) / Math.max(cleanNumber(assumptions.revenue), 1)) * 100).toFixed(1)}%`],
      ["Compound Interest", "A = P(1 + r/n)^(nt)", formatMoney(cleanNumber(assumptions.cashInvested) * Math.pow(1 + cleanNumber(assumptions.rate) / 100 / 12, 12 * 5))],
      ["Years to Double", "72 / Interest Rate", `${formulas.ruleOf72(Math.max(cleanNumber(assumptions.rate), 1)).toFixed(1)} years`],
    ],
  };
  function generateEstimate() {
    const safeSqft = Math.max(500, cleanNumber(spec.sqft));
    const premium = spec.finish === "Luxury" ? 1.35 : spec.finish === "Upgraded" ? 1.15 : 1;
    setRows([
      { category: "Pre-Construction & Acquisition", item: "Design, engineering, permits", qty: "1", unit: "allowance", price: "11200" },
      { category: "Site Prep & Foundation", item: `${spec.foundation} foundation package`, qty: String(safeSqft), unit: "sq ft", price: String(spec.foundation === "Basement" ? 34 : 14) },
      { category: "Shell / Exterior", item: "Framing, roofing and exterior", qty: String(safeSqft), unit: "sq ft", price: String(45 * premium) },
      { category: "MEP Systems", item: "Mechanical, electrical and plumbing", qty: String(safeSqft), unit: "sq ft", price: String(31 * premium) },
      { category: "Interiors", item: `${spec.finish} interiors`, qty: String(safeSqft), unit: "sq ft", price: String(46 * premium) },
      { category: "Exterior Completion", item: "Driveway and landscape allowance", qty: "1", unit: "allowance", price: "12800" },
    ]);
    setWizardOpen(false);
    setSpecStep(1);
  }
  return <div className="space-y-6"><ProjectContext project={project} language={language} /><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-2xl font-black text-white">{isEs ? "Estimador de Presupuesto" : "Budget Estimator"}</h3><p className="mt-2 text-slate-400">{isEs ? "Presupuesto editable con decimales, comas, partidas y formulas reales." : "Editable budget with decimals, commas, line items, and real investor formulas."}</p></div><div className="flex flex-wrap gap-3"><button onClick={addRow} className="secondary-button"><Plus size={18} />{isEs ? "Agregar linea" : "Add line"}</button><button onClick={() => setWizardOpen(true)} className="primary-button"><Sparkles size={18} />{isEs ? "Generar desde Especificaciones" : "Generate From Specs"}</button></div></div><div className="grid gap-3 sm:grid-cols-5"><MiniMetric label={isEs ? "Costo Directo" : "Direct Cost"} value={formatMoney(direct)} /><MiniMetric label={isEs ? "Contingencia" : "Contingency"} value={formatMoney(contingency)} /><MiniMetric label={isEs ? "Total Proyecto" : "Total Project Cost"} value={formatMoney(total)} /><MiniMetric label={isEs ? "Costo / Pie2" : "Cost / Sq Ft"} value={formatMoney(total / sqft)} /><label className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"><span className="text-xs font-black uppercase tracking-widest text-slate-500">Contingency %</span><input inputMode="decimal" className="mt-2 w-full bg-transparent text-2xl font-black text-white outline-none" value={contingencyPct} onChange={(event) => setContingencyPct(event.target.value)} /></label></div><p className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[.06] p-4 text-sm font-bold text-cyan-100">{isEs ? "Los campos aceptan comas y decimales: 1,250,000 | 12.5 | 7.25%." : "Fields accept commas and decimals: 1,250,000 | 12.5 | 7.25%."}</p><div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60 p-4"><table className="min-w-[900px] w-full text-left"><thead className="text-xs uppercase tracking-widest text-slate-500"><tr><th className="pb-4">Category</th><th className="pb-4">Line Item</th><th className="pb-4">Qty</th><th className="pb-4">Unit</th><th className="pb-4">Unit Price</th><th className="pb-4 text-right">Total</th><th className="pb-4 text-right">Remove</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.category}-${index}`} className="border-t border-white/10"><td className="py-3 pr-3"><input className="field min-w-56 py-2 text-sm font-bold text-cyan-100" value={row.category} onChange={(event) => updateRow(index, "category", event.target.value)} /></td><td className="py-3 pr-3"><input className="field min-w-60 py-2" value={row.item} onChange={(event) => updateRow(index, "item", event.target.value)} /></td><td className="py-3 pr-3"><input inputMode="decimal" className="field w-28 py-2" value={row.qty} onChange={(event) => updateRow(index, "qty", event.target.value)} /></td><td className="py-3 pr-3"><input className="field w-28 py-2" value={row.unit} onChange={(event) => updateRow(index, "unit", event.target.value)} /></td><td className="py-3 pr-3"><input inputMode="decimal" className="field w-32 py-2" value={row.price} onChange={(event) => updateRow(index, "price", event.target.value)} /></td><td className="py-3 text-right font-black text-emerald-300">{formatMoney(cleanNumber(row.qty) * cleanNumber(row.price))}</td><td className="py-3 text-right"><button onClick={() => removeRow(index)} className="rounded-xl border border-rose-300/20 p-3 text-rose-200 hover:bg-rose-400/10"><Trash2 size={17} /></button></td></tr>)}</tbody></table></div><section className="rounded-3xl border border-white/10 bg-white/[.04] p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h4 className="text-xl font-black text-white">{isEs ? "Biblioteca de Formulas" : "Investor Formula Library"}</h4><p className="text-sm text-slate-400">{isEs ? "Calculadoras utiles para inversionistas, constructores, Airbnb y financiamiento." : "Useful calculators for investors, builders, Airbnb hosts, land developers, and financing."}</p></div><div className="flex flex-wrap gap-2">{Object.keys(formulaGroups).map((group) => <button key={group} onClick={() => setFormulaGroup(group)} className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest transition ${formulaGroup === group ? "bg-cyan-300 text-slate-950" : "border border-white/10 text-slate-400 hover:text-white"}`}>{group}</button>)}</div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{formulaGroups[formulaGroup].map(([name, formula, result]) => <div key={name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"><p className="font-black text-white">{name}</p><p className="mt-1 text-xs text-slate-500">{formula}</p><p className="mt-3 text-xl font-black text-cyan-200">{result}</p></div>)}</div><details className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4"><summary className="cursor-pointer font-black text-white">{isEs ? "Editar supuestos de formulas" : "Edit formula assumptions"}</summary><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(assumptions).map(([key, value]) => <label key={key}><span className="label capitalize">{key.replace(/([A-Z])/g, " $1")}</span><input inputMode="decimal" className="field" value={value} onChange={(event) => patchAssumption(key, event.target.value)} /></label>)}</div></details></section>{wizardOpen && <div className="rounded-3xl border border-cyan-300/25 bg-cyan-300/[.05] p-5"><div className="flex justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEs ? `Paso ${specStep} de 3` : `Step ${specStep} of 3`}</p><h4 className="mt-2 text-xl font-black text-white">{isEs ? "Generar Estimacion desde Especificaciones" : "Generate Estimate from Specs"}</h4></div><button onClick={() => setWizardOpen(false)}><X /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{specStep === 1 && <><select className="field" value={spec.type} onChange={(event) => setSpec({ ...spec, type: event.target.value })}><option>New Construction</option><option>Remodel</option><option>Addition</option></select><input className="field" value={spec.city} onChange={(event) => setSpec({ ...spec, city: event.target.value })} placeholder="City / State" /><NumberInput label="Living Sq Ft" value={spec.sqft} setValue={(value) => setSpec({ ...spec, sqft: value })} /></>}{specStep === 2 && <><select className="field" value={spec.foundation} onChange={(event) => setSpec({ ...spec, foundation: event.target.value })}><option>Slab</option><option>Crawlspace</option><option>Basement</option><option>Pier / Raised</option></select><select className="field" value={spec.finish} onChange={(event) => setSpec({ ...spec, finish: event.target.value })}><option>Standard</option><option>Upgraded</option><option>Luxury</option></select></>}{specStep === 3 && <Info title={isEs ? "Listo para Calcular" : "Ready to Calculate"} text={`${spec.type} | ${spec.city} | ${formatNumber(spec.sqft, 0)} sq ft | ${spec.foundation} | ${spec.finish}`} />}</div><div className="mt-5 flex justify-between"><button onClick={() => setSpecStep(Math.max(1, specStep - 1))} className="secondary-button">{isEs ? "Anterior" : "Previous"}</button>{specStep < 3 ? <button onClick={() => setSpecStep(specStep + 1)} className="primary-button">{isEs ? "Siguiente" : "Next"}</button> : <button onClick={generateEstimate} className="primary-button">{isEs ? "Generar Presupuesto" : "Generate Budget"}</button>}</div></div>}</div>;
}function SubsQuotes({ language, project }) {
  const label = language === "es"
    ? { review: "Revisar Cotizaci?n", trade: "Oficio", vendor: "Proveedor", bid: "Monto de Oferta", scope: "Alcance", status: "Estado", quoteStatus: "Estado de cotizaci?n", pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada", total: "Total de Ofertas", contingency: "Contingencia 10%", budget: "Presupuesto con Contingencia", selected: "Oferta Seleccionada" }
    : { review: "Review Quote", trade: "Trade", vendor: "Vendor", bid: "Bid Amount", scope: "Scope", status: "Status", quoteStatus: "Quote status", pending: "Pending", approved: "Approved", rejected: "Rejected", total: "Bid Total", contingency: "10% Contingency", budget: "Budget With Contingency", selected: "Selected Bid" };
  const isEs = language === "es";
  const [subcontractors, setSubcontractors] = useState([]);
  const [search, setSearch] = useState("");
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", trade: "Other", customTrade: "", email: "", phone: "", notes: "" });
  const [quotes, setQuotes] = useState([
    { trade: "Foundation", vendor: "Gulf Coast Concrete", price: 18500, scope: "Slab, footings, vapor barrier", status: "Pending" },
    { trade: "Framing", vendor: "Walton Framing Co.", price: 42000, scope: "Labor and lumber package", status: "Approved" },
    { trade: "Roofing", vendor: "Emerald Roof Systems", price: 13800, scope: "Shingles, underlayment, vents", status: "Review" },
    { trade: "Electrical", vendor: "Brightline Electric", price: 16200, scope: "Rough-in, panel, fixtures", status: "Pending" },
  ]);
  const [active, setActive] = useState(0);
  const quote = quotes[active];
  const total = quotes.reduce((sum, item) => sum + cleanNumber(item.price), 0);
  const updateQuote = (field, value) => setQuotes(quotes.map((item, index) => index === active ? { ...item, [field]: value } : item));
  const addSub = () => { if (!newSub.name.trim()) return; setSubcontractors([...subcontractors, { ...newSub, id: Date.now() }]); setAddSubOpen(false); setNewSub({ name: "", trade: "Other", customTrade: "", email: "", phone: "", notes: "" }); };
  const filtered = subcontractors.filter((sub) => `${sub.name} ${sub.email} ${sub.phone}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-6"><ProjectContext project={project} language={language} /><section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-2xl font-black text-white">{isEs ? "Subcontratistas" : "Subcontractors"}</h3><p className="text-sm text-slate-400">{subcontractors.length} {isEs ? "subcontratistas" : "subcontractors"}</p></div><button onClick={() => setAddSubOpen(true)} className="primary-button"><Plus size={18} />{isEs ? "Agregar Subcontratista" : "Add Subcontractor"}</button></div><input className="field mt-5" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isEs ? "Buscar por nombre, correo o teléfono..." : "Search by name, email, phone..."} />{filtered.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{filtered.map((sub) => <div key={sub.id} className="rounded-2xl border border-white/10 p-4"><p className="font-black text-white">{sub.name}</p><p className="text-sm text-cyan-200">{sub.customTrade || sub.trade}</p><p className="mt-2 text-sm text-slate-400">{sub.email} {sub.phone}</p></div>)}</div> : <div className="py-10 text-center"><Users className="mx-auto text-slate-600" size={42} /><p className="mt-4 font-black text-white">{isEs ? "No se encontraron subcontratistas" : "No subcontractors found"}</p><p className="mt-2 text-sm text-slate-400">{isEs ? "Agrega tu primer subcontratista para comenzar." : "Add your first subcontractor to get started."}</p></div>}</section><div className="grid gap-5 xl:grid-cols-[1fr_390px]"><div className="space-y-3"><h3 className="mb-4 text-xl font-black text-white">{isEs ? "Ofertas / Comparación" : "Bids / Comparison"}</h3>{quotes.map((item, index) => <button key={item.trade} onClick={() => setActive(index)} className={`glow-card flex w-full items-center justify-between rounded-3xl border p-5 text-left transition ${active === index ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-slate-950/60 hover:border-cyan-300/30"}`}><div><p className="font-black text-white">{item.trade}</p><p className="text-sm text-slate-500">{item.vendor} | {label.quoteStatus}: {item.status}</p></div><p className="text-xl font-black text-cyan-200">{formatMoney(item.price)}</p></button>)}</div><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><h3 className="text-xl font-black text-white">{label.review}</h3><div className="mt-4 space-y-3"><label className="block"><span className="label">{label.trade}</span><input className="field" value={quote.trade} onChange={(e) => updateQuote("trade", e.target.value)} /></label><label className="block"><span className="label">{label.vendor}</span><input className="field" value={quote.vendor} onChange={(e) => updateQuote("vendor", e.target.value)} /></label><MoneyInput label={label.bid} value={quote.price} setValue={(value) => updateQuote("price", value)} /><label className="block"><span className="label">{label.scope}</span><textarea className="field min-h-24" value={quote.scope} onChange={(e) => updateQuote("scope", e.target.value)} /></label><label className="block"><span className="label">{label.status}</span><select className="field" value={quote.status} onChange={(e) => updateQuote("status", e.target.value)}><option>{label.pending}</option><option>Review</option><option>{label.approved}</option><option>{label.rejected}</option></select></label></div><ResultBox items={[[label.total, formatMoney(total), true], [label.contingency, formatMoney(total * 0.1)], [label.budget, formatMoney(total * 1.1), true], [label.selected, formatMoney(quote.price)]]} /></div></div>{addSubOpen && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4"><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#10182b] p-6"><div className="flex justify-between"><h3 className="text-xl font-black text-white">{isEs ? "Agregar Subcontratista" : "Add Subcontractor"}</h3><button onClick={() => setAddSubOpen(false)}><X /></button></div><div className="mt-5 grid gap-4"><input className="field" value={newSub.name} onChange={(event) => setNewSub({ ...newSub, name: event.target.value })} placeholder={isEs ? "Nombre de empresa o persona" : "Company or person name"} /><select className="field" value={newSub.trade} onChange={(event) => setNewSub({ ...newSub, trade: event.target.value })}><option>Other</option><option>Electrical</option><option>Plumbing</option><option>Concrete</option><option>Framing</option><option>Roofing</option></select>{newSub.trade === "Other" && <input className="field" value={newSub.customTrade} onChange={(event) => setNewSub({ ...newSub, customTrade: event.target.value })} placeholder={isEs ? "Oficio personalizado" : "Custom trade"} />}<div className="grid gap-3 sm:grid-cols-2"><input className="field" value={newSub.email} onChange={(event) => setNewSub({ ...newSub, email: event.target.value })} placeholder="Email" /><input className="field" value={newSub.phone} onChange={(event) => setNewSub({ ...newSub, phone: event.target.value })} placeholder={isEs ? "Teléfono" : "Phone"} /></div><textarea className="field min-h-24" value={newSub.notes} onChange={(event) => setNewSub({ ...newSub, notes: event.target.value })} placeholder={isEs ? "Notas" : "Notes"} /></div><div className="mt-5 flex justify-end gap-3"><button onClick={() => setAddSubOpen(false)} className="secondary-button">{isEs ? "Cancelar" : "Cancel"}</button><button onClick={addSub} className="primary-button">{isEs ? "Agregar" : "Add"}</button></div></div></div>}</div>;
}

function LinkedItems({ language, project, embedded = false }) {
  const ui = language === "es" ? { linked: "Registro Vinculado", review: "Revisión de Inversionista", linkedText: "Adjunta documentos, cálculos, contactos o notas del proyecto para mantener el espacio organizado.", reviewText: "Usa elementos vinculados para preparar paquetes para prestamistas, actualizaciones de inversionistas o revisiones de alcance.", attach: "Adjuntar Elemento" } : { linked: "Linked Record", review: "Investor Review", linkedText: "Attach documents, calculations, contacts, or project notes to keep the workspace organized.", reviewText: "Use linked items when preparing a lender packet, investor update, or contractor scope review.", attach: "Attach Item" };
  const items = [["Reports", "CMA PDF, lender summary, takeoff report", FileText], ["Comps", "Comparable sales, ARV range, price per sqft", Search], ["Quotes", "Subcontractor bids and awarded scopes", Users], ["Permits", "Permit numbers, inspection milestones, notes", ClipboardCheck], ["Dropbox Files", "Plans, photos, contracts, draw packets", Cloud], ["Loan Docs", "Term sheets, DSCR assumptions, payoff letters", WalletCards]];
  const [active, setActive] = useState(items[0]);
  const Icon = active[2];
  return <div className="space-y-5">{!embedded && <ProjectContext project={project} language={language} />}{embedded && <SectionHeader title={language === "es" ? "Elementos Vinculados" : "Linked Items"} detail={language === "es" ? "Integrado en el takeoff para conectar planos, reportes, cotizaciones, permisos y documentos." : "Integrated into takeoff so plans, reports, quotes, permits, and documents stay connected."} />}<div className="grid gap-5 xl:grid-cols-[1fr_380px]"><div className="grid gap-4 md:grid-cols-2">{items.map(([title, detail, CardIcon]) => <button key={title} onClick={() => setActive([title, detail, CardIcon])} className="glow-card rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-left hover:border-cyan-300/40"><CardIcon className="text-cyan-300" /><p className="mt-4 font-black text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p></button>)}</div><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><Icon className="text-cyan-300" /><h3 className="mt-4 text-2xl font-black text-white">{active[0]}</h3><p className="mt-2 leading-7 text-slate-400">{active[1]}</p><div className="mt-5 space-y-3"><Info title={ui.linked} text={ui.linkedText} /><Info title={ui.review} text={ui.reviewText} /></div><button className="primary-button mt-5">{ui.attach}</button></div></div></div>;
}

function Collaborators({ language, project, embedded = false }) {
  const ui = language === "es" ? { invite: "Invitar Colaborador", text: "Invita socios, prestamistas, contratistas o gerentes de proyecto con un rol claro.", owner: "Propietario", manager: "Gerente de Proyecto", finance: "Finanzas", construction: "Construcción", viewer: "Solo Lectura" } : { invite: "Invite Collaborator", text: "Invite partners, lenders, contractors, or project managers with a clear role.", owner: "Owner", manager: "Project Manager", finance: "Finance", construction: "Construction", viewer: "Viewer" };
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Project Manager");
  const [tab, setTab] = useState("members");
  const [modalOpen, setModalOpen] = useState(false);
  const [people, setPeople] = useState([]);
  const invite = () => { if (!email.trim()) return; setPeople([{ name: email.split("@")[0], email, role }, ...people]); setEmail(""); };
  const isEs = language === "es";
  return <div className="space-y-5">{!embedded && <ProjectContext project={project} language={language} />}<div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className={`${embedded ? "text-2xl" : "text-3xl"} font-black text-white`}>{isEs ? "Colaboradores" : "Collaborators"}</h3><p className="mt-2 text-slate-400">{embedded ? (isEs ? "Integrado con subcontratistas y cotizaciones para controlar qui?n ve cada paquete." : "Integrated with subs and quotes so each package has the right people attached.") : ui.text}</p></div><button onClick={() => setModalOpen(true)} className="primary-button"><Plus size={18} />{ui.invite}</button></div><div className="inline-flex rounded-2xl bg-slate-900 p-1"><button onClick={() => setTab("members")} className={`rounded-xl px-5 py-3 font-black ${tab === "members" ? "bg-cyan-300 text-slate-950" : "text-slate-400"}`}>{isEs ? "Miembros" : "Members"}</button><button onClick={() => setTab("access")} className={`rounded-xl px-5 py-3 font-black ${tab === "access" ? "bg-cyan-300 text-slate-950" : "text-slate-400"}`}>{isEs ? "Acceso a Proyectos" : "Project Access"}</button></div>{tab === "members" && (people.length ? <div className="grid gap-4 md:grid-cols-2">{people.map((person) => <div key={person.email} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"><Users className="text-cyan-300" /><p className="mt-4 text-lg font-black text-white">{person.name}</p><p className="text-sm text-slate-400">{person.email}</p><p className="mt-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">{person.role}</p></div>)}</div> : <div className="rounded-3xl border border-dashed border-white/10 py-16 text-center"><Users className="mx-auto text-slate-600" size={42} /><p className="mt-4 font-black text-white">{isEs ? "Todav?a no hay miembros" : "No team members yet"}</p><button onClick={() => setModalOpen(true)} className="primary-button mt-5"><Plus size={18} />{ui.invite}</button></div>)}{tab === "access" && <div className="rounded-3xl border border-dashed border-white/10 p-8"><p className="font-black text-white">{isEs ? "Permisos por Proyecto" : "Project Permissions"}</p><p className="mt-2 text-slate-400">{isEs ? "Invita miembros para asignar permisos de lectura, edici?n, finanzas y campo." : "Invite members to assign viewer, editor, finance, and field access."}</p></div>}{modalOpen && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10182b] p-6"><div className="flex justify-between"><h3 className="text-xl font-black text-white">{ui.invite}</h3><button onClick={() => setModalOpen(false)}><X /></button></div><input className="field mt-5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" /><select className="field mt-3" value={role} onChange={(e) => setRole(e.target.value)}><option>{ui.owner}</option><option>{ui.manager}</option><option>{ui.finance}</option><option>{ui.construction}</option><option>{ui.viewer}</option></select><div className="mt-5 flex justify-end gap-3"><button onClick={() => setModalOpen(false)} className="secondary-button">{isEs ? "Cancelar" : "Cancel"}</button><button onClick={() => { invite(); setModalOpen(false); }} className="primary-button">{ui.invite}</button></div></div></div>}</div>;
}

function DropboxPage({ t }) {
  const [status, setStatus] = useState("");
  return <div className="mx-auto max-w-4xl"><GlassPanel><SectionHeader title="Integrations" detail={t.dropboxDetail || "Connect your cloud storage accounts for plans, photos, quotes, and closeout packets."} /><div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-300"><Cloud /></div><div><h3 className="text-xl font-black text-white">Dropbox</h3><p className="text-sm text-slate-400">Import project files directly from your Dropbox account.</p></div></div><span className="rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">{t.comingSoon}</span></div><p className="mt-6 text-slate-400">Connect Dropbox authorization to select plans, draw packets, vendor quotes, and inspection photos from one workspace.</p><button onClick={() => setStatus("Dropbox authorization must be configured before importing files.")} className="secondary-button mt-5"><Cloud size={18} /> Test Picker</button>{status && <p className="mt-4 rounded-xl border border-cyan-300/15 bg-cyan-300/[.06] p-3 text-sm text-cyan-100">{status}</p>}</div></GlassPanel></div>;
}

function Tours({ t, language }) {
  const titles = language === "es" ? ["Analiza un flip en 5 minutos", "Configura un proyecto de construcción", "Exporta tu primer reporte para inversionistas"] : ["Analyze a flip in 5 minutes", "Set up a construction project", "Export your first investor report"];
  return <div className="grid gap-5 md:grid-cols-3">{titles.map((title, index) => <GlassPanel key={title}><PlayCircle className="text-amber-300" /><p className="mt-5 text-xl font-black text-white">{title}</p><p className="mt-2 text-slate-400">{language === "es" ? `Recorrido guiado ${index + 1} con pasos prácticos y puntos de control.` : `Guided tour ${index + 1} with practical steps and checkpoints.`}</p><button className="secondary-button mt-5">{t.startTour}</button></GlassPanel>)}</div>;
}

function Tutorials({ language }) {
  const isEs = language === "es";
  const groups = isEs ? [["General", ["Comenzando con Operitron", "Crear y organizar proyectos"]], ["Análisis de Deals", ["Analizador de Deals: vista general", "Analizar un flip", "Análisis avanzado"]], ["Construcción", ["Gestionar subcontratistas", "Lista de pendientes", "Asistente de construcción"]], ["Takeoffs", ["Configurar el m?dulo de cálculo", "Exportar el informe PDF"]]] : [["General", ["Getting Started with Operitron", "Create and organize projects"]], ["Deal Underwriter", ["Deal Underwriter overview", "Analyze a flip", "Advanced deal analysis"]], ["Construction Tools", ["Managing subcontractors", "Punch lists", "Construction wizard"]], ["Takeoffs", ["Configure material takeoff", "Export PDF report"]]];
  return <div className="space-y-7"><div><h2 className="text-3xl font-black text-white">{isEs ? "Tutoriales" : "Tutorials"}</h2><p className="mt-2 text-slate-400">{isEs ? "Aprende a obtener el m?ximo valor de cada herramienta." : "Learn how to get the most out of every Operitron workflow."}</p></div>{groups.map(([group, videos]) => <section key={group}><h3 className="mb-4 text-lg font-black text-cyan-200">{group}</h3><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{videos.map((title, index) => <button key={title} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 text-left hover:border-cyan-300/35"><div className="grid h-32 place-items-center bg-gradient-to-br from-blue-500/15 to-purple-500/10"><PlayCircle className="text-cyan-300" size={38} /></div><div className="p-4"><p className="font-black text-white">{title}</p><p className="mt-2 text-xs text-slate-500">{index === videos.length - 1 ? (isEs ? "Próximamente" : "Coming Soon") : (isEs ? "Ver tutorial" : "Watch tutorial")}</p></div></button>)}</div></section>)}</div>;
}

function LearningCenter({ t, language, go }) {
  const articles = language === "es"
    ? [["Análisis de Deals", "7 min", "Cómo Analizar un Deal Inmobiliario Más R?pido"], ["Financiamiento", "8 min", "DSCR vs BRRR: Lo Que Deben Saber los Inversionistas"], ["Análisis de Deals", "12 min", "Guía Completa de Análisis de Deals Inmobiliarios"], ["Construcción", "9 min", "Cómo Estimar Costos de Construcción Desde Planos"], ["Financiamiento", "14 min", "Estrategias DSCR y BRRR para Inversionistas"], ["Takeoffs", "6 min", "Errores Comunes de Takeoff que Dañan tu Ganancia"], ["Construcción", "11 min", "Presupuestos y Estimaciones de Construcción"], ["Gestión de Proyecto", "8 min", "Qué Rastrear Durante una Construcción Desde Cero"], ["Takeoffs", "10 min", "Takeoffs de Construcción y Estimación con Planos"], ["Cierre", "7 min", "Cómo las Punch Lists Reducen Retrasos"], ["Gestión de Proyecto", "13 min", "Gestión de Construcción Desde Cero"], ["Cierre", "9 min", "Punch Lists y Cierre de Construcción"]]
    : learningArticles;
  const [active, setActive] = useState(null);
  if (active) return <div className="space-y-6"><button onClick={() => setActive(null)} className="secondary-button">← {t.back}</button><GlassPanel><p className="text-sm font-black text-amber-300">{active[0]} | {active[1]}</p><h2 className="mt-3 text-4xl font-black text-white">{active[2]}</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><Info title={language === "es" ? "Fórmulas" : "Formulas"} text="ARV, ROI, cap rate, cash-on-cash, DSCR, 70% rule, max offer, mortgage payment, and rent cash flow." /><Info title={language === "es" ? "Proceso" : "Process"} text="Start with fast screening, verify comps, stress-test costs, document assumptions, and export a clean investor packet." /><Info title={language === "es" ? "Checklist" : "Checklist"} text="Comps, scope, permits, financing, insurance, taxes, contractor bids, timeline, exit strategy, and risk buffer." /></div><p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{language === "es" ? "Esta guía convierte el tema en pasos prácticos para operadores. Usa los cálculos de Operitron para revisar números, guardar supuestos, comparar escenarios y preparar decisiones con menos ruido." : "This guide turns the topic into practical operator steps. Use Operitron calculations to review numbers, save assumptions, compare scenarios, and prepare cleaner decisions with less noise."}</p><button onClick={() => go("projectTools")} className="primary-button mt-6">{language === "es" ? "Abrir herramientas" : "Open tools"}</button></GlassPanel></div>;
  return <div className="space-y-7"><GlassPanel><p className="text-sm font-black uppercase tracking-widest text-amber-300">{t.learning}</p><h2 className="mt-2 text-4xl font-black text-white">{language === "es" ? "Guías para Inversionistas y Constructores" : "Guides for Real Estate Investors & Builders"}</h2><p className="mt-3 max-w-3xl text-slate-400">{language === "es" ? "Estrategias prácticas, marcos de trabajo y herramientas para analizar deals, gestionar construcción y operar proyectos rentables." : "Practical strategies, frameworks, and tools for analyzing deals, managing construction, and operating profitable projects."}</p><button onClick={() => go("pricing")} className="primary-button mt-6">{t.startTrial}</button></GlassPanel><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{articles.map((article) => <button key={article[2]} onClick={() => setActive(article)} className="glow-card rounded-[2rem] border border-white/10 bg-white/[.055] p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl hover:border-amber-400/40"><p className="text-sm font-black text-amber-300">{article[0]} | {article[1]}</p><h3 className="mt-3 text-xl font-black text-white">{article[2]}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{language === "es" ? "Una guía práctica para operadores con ejemplos, fórmulas y puntos de control del proyecto." : "A practical operator-focused guide with examples, formulas, and project checkpoints."}</p><span className="mt-5 inline-flex font-black text-amber-300">{t.readGuide} →</span></button>)}</div></div>;
}

function KnowledgeBase({ t, language }) {
  const faqs = language === "es"
    ? [
      ["?C?mo automatiza la IA los c?lculos de materiales a partir de planos?", "La IA puede leer planos subidos, aplicar una escala, convertir mediciones a dimensiones reales y organizar cantidades por categor?a con factores de desperdicio configurables."],
      ["¿Cuál es el beneficio del rastreador de construcción por fases?", "Un rastreador por fases ayuda a visualizar dependencias críticas, evitar cuadrillas inactivas y reducir costos de financiamiento causados por retrasos."],
      ["?C?mo maneja el Analizador de Deals la estrategia BRRR?", "Modela compra, rehabilitación, renta, refinanciamiento, extracción de capital, DSCR y flujo de caja posterior al refinanciamiento."],
      ["?C?mo mejora la herramienta de punch list el cierre de proyectos?", "Organiza deficiencias por oficio, prioridad, responsable y estado para cerrar pendientes con menos fricción."],
    ]
    : [
      ["How does AI help estimate materials from plans?", "AI-assisted workflows can read uploaded plans, apply scale, convert measurements into real dimensions, and organize quantities by category with configurable waste factors."],
      ["What is the benefit of phase-based construction tracking?", "Phase tracking helps visualize critical dependencies, reduce idle crews, and limit financing costs caused by schedule delays."],
      ["How does the Deal Underwriter handle BRRR strategy?", "It models purchase, rehab, rent, refinance, equity capture, DSCR, and post-refinance cash flow."],
      ["How does the punch list tool improve closeout?", "It organizes deficiencies by trade, priority, owner, and status so final items close with less friction."],
    ];
  return <GlassPanel><h2 className="text-4xl font-black text-white">{t.knowledge}</h2><p className="mt-3 text-slate-400">{language === "es" ? `Respuestas detalladas sobre cómo ${t.brand} potencia cada fase de la inversión inmobiliaria.` : `Detailed answers about how ${t.brand} supports each phase of real estate investing.`}</p><div className="mt-8 space-y-4">{faqs.map(([q, a]) => <details key={q} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><summary className="cursor-pointer text-lg font-black text-white">{q}</summary><p className="mt-4 leading-7 text-slate-300">{a}</p></details>)}</div></GlassPanel>;
}

function AdminCheckoutDiagnostics({ diagnostics, language }) {
  if (!diagnostics) return null;
  const isEs = language === "es";
  const rows = [
    [isEs ? "Estado de Stripe" : "Stripe initialization status", diagnostics.stripeInitializationStatus],
    [isEs ? "Price ID usado" : "Price ID being used", diagnostics.priceIdBeingUsed],
    [isEs ? "Estado del usuario Supabase" : "Supabase user status", diagnostics.supabaseUserStatus],
    [isEs ? "C?digo de respuesta API" : "API response code", diagnostics.apiResponseCode],
    [isEs ? "Mensaje de error" : "Error message", diagnostics.errorMessage],
  ];
  if (diagnostics.missingConfiguration?.length) rows.push([isEs ? "Configuración faltante" : "Missing configuration", diagnostics.missingConfiguration.join(" | ")]);
  if (diagnostics.stripeErrorType) rows.push(["Stripe error type", diagnostics.stripeErrorType]);
  if (diagnostics.stripeErrorCode) rows.push(["Stripe error code", diagnostics.stripeErrorCode]);
  if (diagnostics.stripeRequestId) rows.push(["Stripe request ID", diagnostics.stripeRequestId]);
  return <div className="rounded-2xl border border-amber-300/30 bg-amber-300/[.08] p-4 text-left shadow-[0_0_30px_rgba(251,191,36,.08)]">
    <p className="text-sm font-black uppercase tracking-widest text-amber-200">{isEs ? "Diagn?stico administrativo de checkout" : "Admin checkout diagnostics"}</p>
    <div className="mt-4 grid gap-2">
      {rows.map(([label, value]) => <div key={label} className="grid gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm sm:grid-cols-[220px_1fr]">
        <span className="font-bold text-slate-400">{label}</span>
        <span className="break-words font-mono text-cyan-100">{String(value || "-")}</span>
      </div>)}
    </div>
  </div>;
}

function PricingPlans({ language, user, go }) {
  const isEs = language === "es";
  const [billingStatus, setBillingStatus] = useState("");
  const [billingLoading, setBillingLoading] = useState("");
  const [checkoutDiagnostics, setCheckoutDiagnostics] = useState(null);
  const monthlyFeatures = isEs
    ? ["Proyectos y deals ilimitados", "Analizador de deals y fix-and-flip", "Calculadoras DSCR, BRRR y cash-out", "Rastreador de construcción", "Takeoff de materiales con IA", "Punch list", "Gestión de subcontratistas y ofertas", "Compartir proyectos y colaborar", "Asistente IA en cada herramienta"]
    : ["Unlimited projects & deals", "Deal & Fix-and-Flip underwriter", "DSCR, BRRR & Cash-Out calculators", "Construction tracker", "AI material takeoff", "Punch list", "Subcontractor & bid management", "Project sharing & collaboration", "AI assistant on every tool"];
  const annualFeatures = isEs
    ? ["Todo lo incluido en Mensual", "Soporte prioritario", "Acceso anticipado a funciónes nuevas", "Historial de datos extendido"]
    : ["Everything in Monthly", "Priority support", "Early access to new features", "Extended data history"];
  const plans = [
    { id: "monthly", name: isEs ? "Mensual" : "Monthly", price: "$29.99", cadence: isEs ? "/mes" : "/month", note: isEs ? "Prueba gratis de 3 días" : "3-day free trial", detail: isEs ? "Acceso flexible mes a mes." : "Flexible month-to-month access.", features: monthlyFeatures },
    { id: "annual", name: isEs ? "Anual" : "Annual", price: "$249.99", cadence: isEs ? "/año" : "/year", note: isEs ? "Ahorra más de 30% | Prueba gratis de 3 días" : "Save over 30% | 3-day free trial", detail: isEs ? "El mejor valor para operadores activos." : "Best value for active operators.", features: annualFeatures, featured: true },
  ];
  async function beginCheckout(plan) {
    if (!user) {
      go("settings");
      return;
    }
    setBillingLoading(plan.id);
    setBillingStatus("");
    setCheckoutDiagnostics(null);
    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch(checkoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ plan: plan.id }),
      });
      const result = await readApiJson(response);
      if (!response.ok) {
        if (result.diagnostics) setCheckoutDiagnostics(result.diagnostics);
        throw new Error(result.error || "Checkout could not start.");
      }
      window.location.assign(result.url);
    } catch (error) {
      const genericServerError = error.message === "A server error occurred. Please try again or contact support@operitron.com.";
      setBillingStatus(genericServerError && isEs ? "Ocurrió un error del servidor. Intenta de nuevo o escribe a support@operitron.com." : (error.message || (isEs ? "No se pudo iniciar el pago. Intenta de nuevo." : "Checkout could not start. Please try again.")));
    } finally {
      setBillingLoading("");
    }
  }
  return <div className="space-y-8"><section className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-widest text-cyan-300">{isEs ? "Precios simples" : "Simple Pricing"}</p><h2 className="mt-3 text-4xl font-black text-white md:text-5xl">{isEs ? "Elige cómo quieres crecer con Operitron" : "Choose how you want to grow with Operitron"}</h2><p className="mt-4 text-lg leading-8 text-slate-400">{isEs ? "Dos planes claros para analizar deals, gestionar construcción y colaborar con tu equipo." : "Two clean plans for analyzing deals, managing construction, and collaborating with your team."}</p></section><div className="grid gap-6 lg:grid-cols-2">{plans.map((plan) => <motion.div key={plan.name} whileHover={{ y: -6 }} className={`relative overflow-hidden rounded-[2rem] border p-7 shadow-2xl backdrop-blur-xl ${plan.featured ? "border-cyan-300/50 bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-white/[.055] shadow-cyan-500/10" : "border-white/10 bg-white/[.055] shadow-black/20"}`}>{plan.featured && <div className="absolute right-5 top-5 rounded-full border border-cyan-300/30 bg-cyan-300 px-4 py-1 text-xs font-black uppercase tracking-widest text-slate-950 shadow-[0_0_30px_rgba(34,211,238,.35)]">{isEs ? "Mejor Valor" : "Best Value"}</div>}<div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" /><div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" /><div className="relative z-10"><p className="text-2xl font-black text-white">{plan.name}</p><p className="mt-2 min-h-12 max-w-md text-slate-400">{plan.detail}</p><div className="mt-6 flex items-end gap-2"><span className={`text-5xl font-black ${plan.featured ? "text-cyan-200" : "text-amber-300"}`}>{plan.price}</span><span className="pb-2 font-bold text-slate-500">{plan.cadence}</span></div><p className="mt-3 font-bold text-emerald-300">{plan.note}</p><button disabled={billingLoading === plan.id} onClick={() => beginCheckout(plan)} className={`mt-7 w-full rounded-2xl py-4 font-black transition disabled:cursor-wait disabled:opacity-70 ${plan.featured ? "bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.28)] hover:bg-cyan-200" : "bg-amber-400 text-slate-950 shadow-[0_0_35px_rgba(251,191,36,.22)] hover:bg-amber-300"}`}>{billingLoading === plan.id ? (isEs ? "Cargando..." : "Loading...") : (isEs ? "Comenzar" : "Get Started")}</button><ul className="mt-7 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-slate-300"><CheckCircle2 className={plan.featured ? "text-cyan-300" : "text-emerald-400"} size={19} /><span>{feature}</span></li>)}</ul></div></motion.div>)}</div>{billingStatus && <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-center text-sm text-cyan-100">{billingStatus}</p>}<AdminCheckoutDiagnostics diagnostics={checkoutDiagnostics} language={language} /></div>;
}

function PasswordField({ value, onChange, placeholder, autoComplete, visible, onToggle, language }) {
  const [capsLock, setCapsLock] = useState(false);
  const updateCapsLock = (event) => setCapsLock(Boolean(event.getModifierState?.("CapsLock")));
  return <div>
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        onKeyDown={updateCapsLock}
        onKeyUp={updateCapsLock}
        onBlur={() => setCapsLock(false)}
        className="field min-h-[3.35rem] pr-14 text-base"
        autoComplete={autoComplete}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
      />
      <button type="button" onClick={onToggle} aria-label={visible ? (language === "es" ? "Ocultar contraseña" : "Hide password") : (language === "es" ? "Mostrar contraseña" : "Show password")} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-cyan-200">{visible ? <EyeOff size={20} /> : <Eye size={20} />}</button>
    </div>
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
      <span className="text-slate-500">{language === "es" ? "Las contraseñas distinguen mayúsculas y minúsculas." : "Passwords are case-sensitive."}</span>
      {capsLock && <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-200">{language === "es" ? "Bloq Mayús activado" : "Caps Lock is on"}</span>}
    </div>
  </div>;
}

function SettingsPage({ t, language, user, setUser, go, back, signOut, passwordRecovery, setPasswordRecovery }) {
  const isEs = language === "es";
  const [mode, setMode] = useState(passwordRecovery ? "recover" : "register");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const ui = isEs
    ? { register: "Registrarse", login: "Iniciar sesión", details: "Crea tu cuenta de Operitron. Las herramientas se activan al iniciar una suscripción o prueba mediante Stripe.", recoveryDetails: "Crea una nueva contraseña segura para tu cuenta.", fullName: "Nombre completo", company: "Empresa", phone: "Teléfono", dashboard: "Volver al panel", signOut: "Cerrar sesión", back: "Volver", save: "Crear cuenta", secure: "Tu cuenta se protege mediante autenticación segura y verificación por correo." }
    : { register: "Register", login: "Login", details: "Create your Operitron account. Tools activate after starting a subscription or trial through Stripe.", recoveryDetails: "Create a new secure password for your account.", fullName: "Full name", company: "Company", phone: "Phone", dashboard: "Go to Dashboard", signOut: "Sign Out", back: "Back", save: "Create Account", secure: "Your account is protected with secure authentication and email verification." };

  useEffect(() => {
    if (passwordRecovery) setMode("recover");
  }, [passwordRecovery]);

  async function auth(action) {
    if (!supabase) return setStatus(t.authUnavailable);
    if (action === "signup" && email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) return setStatus(t.emailMismatch);
    setSubmitting(true);
    setStatus("");
    try {
      const result = action === "signup"
        ? await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim(), company: company.trim(), phone: phone.trim() },
            emailRedirectTo: `${productionUrl}/dashboard`,
          },
        })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) return setStatus(result.error.message);
      if (action === "signup" && !result.data.session) {
        setMode("login");
        trackGoogleAdsConversion("signup");
        return setStatus(t.checkEmail);
      }
      if (action === "signup") trackGoogleAdsConversion("signup");
      setUser(result.data.user);
      go("dashboard", true);
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword() {
    if (!supabase) return setStatus(t.authUnavailable);
    if (!email.trim()) return setStatus(isEs ? "Ingresa tu correo electrónico primero." : "Enter your email address first.");
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${productionUrl}/dashboard` });
    setStatus(error ? error.message : t.resetSent);
    setSubmitting(false);
  }

  async function updatePassword() {
    if (!supabase) return setStatus(t.authUnavailable);
    if (!password || password !== confirmPassword) return setStatus(t.passwordMismatch);
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return setStatus(error.message);
    setPasswordRecovery(false);
    setStatus(t.passwordUpdated);
    go("dashboard", true);
  }

  function submitAuth(event) {
    event.preventDefault();
    if (submitting) return;
    if (mode === "recover") {
      updatePassword();
      return;
    }
    auth(mode === "register" ? "signup" : "login");
  }

  if (user && mode !== "recover") return <GlassPanel><h2 className="text-3xl font-black text-white">{t.accountSettings}</h2><p className="mt-2 text-slate-400">{user.email}</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => go("dashboard")} className="primary-button">{ui.dashboard}</button><button onClick={signOut} className="secondary-button"><LogOut size={18} /> {ui.signOut}</button></div></GlassPanel>;

  return (
    <GlassPanel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">OPERITRON.COM</p>
          <h2 className="text-3xl font-black text-white">{mode === "recover" ? t.updatePassword : mode === "register" ? ui.register : ui.login}</h2>
          <p className="mt-2 max-w-xl leading-7 text-slate-400">{mode === "recover" ? ui.recoveryDetails : ui.details}</p>
        </div>
        <button onClick={back} className="secondary-button">← {ui.back}</button>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(280px,36rem)_1fr]">
        <form onSubmit={submitAuth} className="grid gap-3">
          {mode !== "recover" && <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-1">
            <button type="button" onClick={() => { setMode("register"); setStatus(""); }} className={`rounded-xl px-4 py-3 font-black ${mode === "register" ? "bg-amber-400 text-slate-950" : "text-slate-400"}`}>{ui.register}</button>
            <button type="button" onClick={() => { setMode("login"); setStatus(""); }} className={`rounded-xl px-4 py-3 font-black ${mode === "login" ? "bg-amber-400 text-slate-950" : "text-slate-400"}`}>{ui.login}</button>
          </div>}
          {mode === "register" && <><input value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" placeholder={ui.fullName} /><input value={company} onChange={(e) => setCompany(e.target.value)} className="field" autoComplete="organization" placeholder={ui.company} /><input value={phone} onChange={(e) => setPhone(e.target.value)} className="field" autoComplete="tel" placeholder={ui.phone} /></>}
          {mode !== "recover" && <input value={email} onChange={(e) => setEmail(e.target.value)} className="field" autoComplete="email" type="email" placeholder={t.email} />}
          {mode === "register" && <input value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="field" autoComplete="email" type="email" placeholder={t.confirmEmail} />}
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "recover" ? t.newPassword : t.password} visible={showPassword} onToggle={() => setShowPassword((current) => !current)} language={language} />
          {mode === "recover" && <PasswordField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" placeholder={t.confirmPassword} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((current) => !current)} language={language} />}
          {mode === "recover"
            ? <button type="submit" disabled={submitting} className="primary-button disabled:cursor-wait disabled:opacity-70">{t.updatePassword}</button>
            : <button type="submit" disabled={submitting} className="primary-button disabled:cursor-wait disabled:opacity-70">{submitting ? (mode === "register" ? t.creatingAccount : t.signingIn) : (mode === "register" ? ui.save : ui.login)}</button>}
          {mode === "login" && <div className="mt-1 rounded-2xl border border-white/10 bg-slate-950/40 p-3"><p className="text-sm font-bold text-slate-300">{t.forgotPassword}</p><button type="button" disabled={submitting} onClick={resetPassword} className="mt-2 text-left text-sm font-black text-cyan-300 hover:text-cyan-200">{t.resetPassword} →</button></div>}
          {status && <p role="status" className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm leading-6 text-cyan-100">{status}</p>}
          <p className="pt-2 text-sm text-slate-400">{isEs ? "?Necesitas ayuda?" : "Need help?"} <a className="font-bold text-cyan-300 hover:text-cyan-200" href="mailto:support@operitron.com">support@operitron.com</a></p>
        </form>
        <div className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-purple-500/10 p-7 lg:block">
          <h3 className="text-2xl font-black text-white">{isEs ? "Cuenta segura de Operitron" : "Secure Operitron account"}</h3>
          <p className="mt-3 leading-7 text-slate-300">{ui.secure}</p>
          <ul className="mt-6 space-y-3 text-sm font-bold text-slate-300">
            <li className="flex gap-2"><CheckCircle2 className="text-cyan-300" size={18} />{isEs ? "Proyectos privados protegidos por usuario" : "Private projects protected per user"}</li>
            <li className="flex gap-2"><CheckCircle2 className="text-cyan-300" size={18} />{isEs ? "Facturaci?n segura mediante Stripe" : "Secure billing through Stripe"}</li>
            <li className="flex gap-2"><CheckCircle2 className="text-cyan-300" size={18} />{isEs ? "Recuperaci?n de contraseña por correo" : "Email password recovery"}</li>
          </ul>
        </div>
      </div>
    </GlassPanel>
  );
}

function ProfileMini({ t, user, go }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || t.profile;
  return <button onClick={() => go("profile")} className="mt-5 flex w-full shrink-0 items-center gap-3 rounded-3xl border border-white/10 bg-white/[.04] p-4 text-left hover:border-cyan-300/40"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-slate-950"><UserCircle /></div><div className="min-w-0"><p className="truncate font-black text-white">{displayName}</p><p className="truncate text-xs font-bold text-slate-500">{user?.email}</p></div></button>;
}

function ProfilePage({ t, language, user, isAdmin, go }) {
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email] = useState(user?.email || "");
  const [plan, setPlan] = useState("No subscription");
  const [company, setCompany] = useState(user?.user_metadata?.company || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const ui = language === "es" ? { title: "Editar perfil", detail: "Actualiza tu información personal", displayName: "Nombre visible", namePlaceholder: "Ingresa tu nombre", company: "Empresa", companyPlaceholder: "Ingresa el nombre de tu empresa", phone: "Teléfono", phonePlaceholder: "Ingresa tu número de telefono", cancel: "Cancelar", ready: "Perfil listo", saved: "Perfil guardado.", trialEnds: "La prueba inicia al suscribirte", save: "Guardar cambios", billing: "Administrar suscripción", billingError: "Primero inicia una suscripción.", serverError: "Ocurrió un error del servidor. Intenta de nuevo o escribe a support@operitron.com." } : { title: "Edit Profile", detail: "Update your personal information", displayName: "Display Name", namePlaceholder: "Enter your name", company: "Company", companyPlaceholder: "Enter your company name", phone: "Phone", phonePlaceholder: "Enter your phone number", cancel: "Cancel", ready: "Profile ready", saved: "Profile saved.", trialEnds: "Trial starts after checkout", save: "Save Changes", billing: "Manage Subscription", billingError: "Start a subscription first.", serverError: "A server error occurred. Please try again or contact support@operitron.com." };
  const [status, setStatus] = useState(ui.ready);
  useEffect(() => {
    if (!supabase || !user) return;
    supabase.from("profiles").select("full_name, company, phone, subscription_plan").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!data) return;
      setName(data.full_name || name);
      setCompany(data.company || company);
      setPhone(data.phone || phone);
      setPlan(data.subscription_plan || "No subscription");
    });
  }, [user]);
  async function saveProfile() {
    if (supabase && user) {
      const { error } = await supabase.from("profiles").update({ full_name: name, company, phone, updated_at: new Date().toISOString() }).eq("id", user.id);
      if (error) return setStatus(error.message);
    }
    setStatus(ui.saved);
  }
  async function manageBilling() {
    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch(portalEndpoint, { method: "POST", headers: { Authorization: `Bearer ${data.session.access_token}` } });
      const result = await readApiJson(response);
      if (!response.ok) throw new Error(result.error || ui.billingError);
      window.location.assign(result.url);
    } catch (error) {
      setStatus(error.message === "Start a subscription first." ? ui.billingError : (error.message === "A server error occurred. Please try again or contact support@operitron.com." ? ui.serverError : (error.message || ui.billingError)));
    }
  }
  const displayPlan = isAdmin ? (language === "es" ? "Administrador | Acceso total" : "Administrator | Full Access") : subscriptionPlanLabel(plan, language);
  return <div className="space-y-6"><GlassPanel><SectionHeader title={ui.title} detail={ui.detail} />{isAdmin && <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-cyan-300/25 bg-cyan-300/[.07] p-4 sm:flex-row sm:items-center"><p className="font-bold text-cyan-100">{language === "es" ? "Acceso administrativo activo: herramientas premium y control de producción habilitados." : "Administrator access active: premium tools and production control are enabled."}</p><button onClick={() => go("admin")} className="secondary-button whitespace-nowrap">{language === "es" ? "Control del Propietario" : "Owner Console"}</button></div>}<div className="grid gap-6 xl:grid-cols-[1fr_360px]"><div className="grid gap-4 md:grid-cols-2"><label className="block"><span className="label">{t.email}</span><input className="field opacity-70" value={email} readOnly /></label><label className="block"><span className="label">{ui.displayName}</span><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder={ui.namePlaceholder} /></label><label className="block"><span className="label">{ui.phone}</span><input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={ui.phonePlaceholder} /></label><label className="block"><span className="label">{ui.company}</span><input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={ui.companyPlaceholder} /></label><label className="block md:col-span-2"><span className="label">{t.plan}</span><input className="field opacity-70" value={displayPlan} readOnly /></label></div><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><UserCircle className="text-cyan-300" size={42} /><h3 className="mt-4 text-2xl font-black text-white">{name || email}</h3><p className="break-all text-slate-400">{email}</p><div className="mt-5 grid gap-3"><MiniMetric label={t.plan} value={displayPlan} green /><MiniMetric label={t.trial} value={isAdmin ? (language === "es" ? "Omitida para administrador" : "Bypassed for administrator") : ui.trialEnds} /><MiniMetric label={t.workspace} value={company || "-"} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><button onClick={() => go("dashboard")} className="secondary-button w-full justify-center">{ui.cancel}</button><button onClick={saveProfile} className="primary-button w-full justify-center">{ui.save}</button></div>{!isAdmin && <button onClick={manageBilling} className="secondary-button mt-3 w-full justify-center">{ui.billing}</button>}<p className="mt-3 text-sm text-slate-500">{status}</p></div></div></GlassPanel></div>;
}

function LegalPage({ type, language }) {
  const english = {
    privacy: {
      title: "Privacy Policy",
      intro: "This Privacy Policy explains how OPERITRON.COM collects, uses, and safeguards information when you use our real estate investment and construction workflow software.",
      sections: [["Information We Collect", "We may collect account information such as name, email address, company, phone number, authentication activity, saved projects, calculations, uploaded records, collaborator details, and support communications."], ["How We Use Information", "We use information to authenticate users, operate your workspace, save analyses and project records, enable billing, provide customer support, improve security, and maintain service performance."], ["Payments and Service Providers", "Payments are processed by Stripe. Authentication and stored workspace data may be provided through Supabase. Authorized property and public data providers process searches requested by you. Each provider processes information under its own privacy terms."], ["Data Security and Retention", "We use access controls and row-level database policies intended to limit each user's access to their own records. No online service can guarantee absolute security. We retain information as needed to provide the service, meet legal obligations, or resolve disputes."], ["Your Choices", "You may request access, correction, or deletion of your account information by contacting Operitron support. Subscription cancellation does not automatically erase legally required transaction records."]],
    },
    terms: {
      title: "Terms of Service",
      intro: "These Terms govern your use of OPERITRON.COM, an investor and construction workflow platform.",
      sections: [["Account Responsibilities", "You must provide accurate account information, protect your login credentials, and remain responsible for activity performed through your account or invited collaborators."], ["Permitted Use", "You may use Operitron to organize projects, analyze investments, estimate construction scope, and prepare reports for your operations. You may not attempt unauthorized access, disrupt the service, resell the platform without permission, or misuse data providers."], ["Subscriptions and Trials", "Paid access is offered through monthly and annual subscriptions with a three-day free trial when presented at checkout. Billing, renewals, discounts, taxes, cancellation timing, and trial eligibility are controlled by your accepted Stripe checkout terms."], ["Customer Data", "You retain ownership of content you submit. You grant Operitron the limited permission needed to host, process, and display that content to deliver the service to you and your authorized collaborators."], ["Limitation of Liability", "To the maximum extent permitted by law, Operitron is not liable for investment losses, construction overruns, financing outcomes, missed opportunities, or indirect damages arising from reliance on platform outputs."]],
    },
    refund: {
      title: "Refund Policy",
      intro: "We aim to keep Operitron billing straightforward and predictable for active investors and builders.",
      sections: [["Three-Day Free Trial", "Eligible new subscriptions may include a three-day trial as displayed at checkout. Cancel before the trial period ends to avoid the first subscription charge."], ["Cancellations", "You may cancel a subscription through the billing portal. Cancellation prevents future renewals and ordinarily leaves access available until the end of the current paid billing period."], ["Refund Requests", "Subscription charges are generally non-refundable once a billing period begins, except where required by law or where a billing error occurred. Contact support promptly if you believe you were charged incorrectly."], ["Promotions", "Discounts and promotion codes are applied through Stripe Checkout and cannot be exchanged for cash or retroactively applied to previous charges."]],
    },
    disclaimer: {
      title: "Disclaimer",
      intro: "Operitron is decision-support software, not professional advice or a guarantee of results.",
      sections: [["Financial Estimates", "ARV, ROI, cap rate, cash-on-cash return, DSCR, mortgage payments, max-offer calculations, cash flow, budgets, and forecasts depend on user inputs and assumptions. Independently validate every input."], ["Property and Public Data", "Property records, comparable sales, tax information, HUD or Census data, and other third-party information may be delayed, incomplete, or inaccurate. Confirm important facts with authoritative records."], ["Construction Outputs", "Takeoffs, schedules, punch lists, scopes, cost estimates, and AI-assisted summaries are planning aids. Consult licensed contractors, engineers, inspectors, and permitting authorities before acting."], ["No Professional Relationship", "Operitron does not provide legal, tax, appraisal, brokerage, lending, architectural, engineering, or construction advice and does not create a professional-client relationship."]],
    },
  };
  const spanish = {
    privacy: { title: "Política de Privacidad", intro: "Esta Política de Privacidad explica cómo OPERITRON.COM recopila, usa y protege información al usar nuestro software inmobiliario y de construcción.", sections: [["Información que Recopilamos", "Podemos recopilar datos de cuenta, correo, empresa, teléfono, actividad de autenticación, proyectos guardados, cálculos, documentos, colaboradores y comunicaciones de soporte."], ["Uso de la Información", "Usamos la información para autenticar usuarios, operar espacios de trabajo, guardar análisis, habilitar facturación, brindar soporte y mantener la seguridad del servicio."], ["Pagos y Proveedores", "Stripe procesa los pagos. Supabase puede administrar autenticación y datos guardados. Los proveedores autorizados de datos procesan búsquedas solicitadas por usted bajo sus propias políticas."], ["Seguridad y Retención", "Usamos controles de acceso y políticas a nivel de fila para limitar el acceso de cada usuario a sus propios registros. Ningún servicio en línea garantiza seguridad absoluta."], ["Sus Opciones", "Puede solicitar acceso, corrección o eliminación de información de su cuenta comunic?ndose con soporte de Operitron."]]},
    terms: { title: "Términos de Servicio", intro: "Estos Términos regulan el uso de OPERITRON.COM, una plataforma para inversionistas y operadores de construcción.", sections: [["Responsabilidad de Cuenta", "Debe proporcionar información precisa, proteger sus credenciales y responsabilizarse por la actividad de su cuenta y colaboradores invitados."], ["Uso Permitido", "Puede usar Operitron para organizar proyectos, analizar inversiones, estimar construcción y preparar reportes. No puede interrumpir el servicio ni intentar acceso no autorizado."], ["Suscripciones y Pruebas", "El acceso pagado se ofrece mediante planes mensuales y anuales con prueba gratis de tres días cuando se muestre en checkout. Stripe controla la facturación aceptada por usted."], ["Datos del Cliente", "Usted conserva propiedad de su contenido y autoriza su procesamiento limitado para prestar el servicio."], ["Limitación de Responsabilidad", "En la medida permitida por ley, Operitron no responde por pérdidas de inversión, sobrecostos de construcción o resultados de financiamiento basados en resultados de la plataforma."]]},
    refund: { title: "Política de Reembolsos", intro: "Buscamos que la facturación de Operitron sea clara y predecible.", sections: [["Prueba Gratis de Tres Días", "Las nuevas suscripciones elegibles pueden incluir una prueba de tres días según se muestre en checkout. Cancele antes del fin de la prueba para evitar el primer cargo."], ["Cancelaciones", "Puede cancelar en el portal de facturación. La cancelaci?n evita renovaciones futuras y normalmente mantiene acceso hasta terminar el período pagado actual."], ["Solicitudes de Reembolso", "Los cargos de suscripción generalmente no son reembolsables una vez iniciado el período, salvo exigencia legal o error de facturación."], ["Promociones", "Los descuentos se aplican mediante Stripe Checkout y no se cambian por efectivo ni se aplican retroactivamente."]]},
    disclaimer: { title: "Aviso Legal", intro: "Operitron es software de apoyo para decisiones, no asesor?a profesional ni garant?a de resultados.", sections: [["Estimaciones Financieras", "ARV, ROI, cap rate, cash-on-cash, DSCR, pagos hipotecarios, ofertas m?ximas, flujos de efectivo y presupuestos dependen de datos y supuestos del usuario."], ["Datos P?blicos y de Propiedad", "Registros, comparables, impuestos y datos p?blicos pueden estar incompletos o atrasados. Confirme hechos importantes en fuentes autorizadas."], ["Resultados de Construcción", "Takeoffs, cronogramas, punch lists, alcances, estimaciones y res?menes asistidos por IA son ayudas de planeaci?n. Consulte profesionales licenciados."], ["Sin Relaci?n Profesional", "Operitron no proporciona asesor?a legal, fiscal, de aval?o, corretaje, pr?stamo, arquitectura, ingenier?a o construcción."]]},
  };
  const data = (language === "es" ? spanish : english)[type];
  return <article className="mx-auto max-w-4xl rounded-[1.5rem] border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-black/20 sm:rounded-[2rem] sm:p-6 md:p-10"><p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300 sm:text-sm">OPERITRON.COM</p><h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">{data.title}</h1><p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{data.intro}</p><p className="mt-4 text-sm font-bold text-slate-500">{language === "es" ? "Vigente: 25 de mayo de 2026" : "Effective: May 25, 2026"}</p><div className="mt-8 space-y-7 sm:mt-10 sm:space-y-8">{data.sections.map(([heading, text]) => <section key={heading} className="border-t border-white/10 pt-6 sm:pt-7"><h2 className="text-xl font-black text-white">{heading}</h2><p className="mt-3 whitespace-normal break-words text-base leading-7 text-slate-300 sm:leading-8">{text}</p></section>)}</div><p className="mt-8 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm leading-7 text-slate-400 sm:mt-10">{language === "es" ? "Contacto: Para preguntas sobre estas políticas, escriba a " : "Contact: For questions about these policies, email "}<a href="mailto:support@operitron.com" className="font-bold text-cyan-300 hover:text-cyan-200">support@operitron.com</a>.</p></article>;
}

function AIAssistant({ t = enhancedCopy.en, large }) {
  const language = t === enhancedCopy.es ? "es" : "en";
  async function getAccessToken() {
    if (!supabase) return "";
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }
  return <Suspense fallback={<div className="grid min-h-52 place-items-center rounded-3xl border border-cyan-300/20 bg-cyan-300/[.05] text-cyan-200"><Sparkles className="animate-pulse" /> Loading AI Analyzer...</div>}><LazyAIAnalyzerPanel language={language} large={large} getAccessToken={getAccessToken} /></Suspense>;
}

function SectionHeader({ title, detail }) {
  return <div className="mb-4 sm:mb-5"><h3 className="text-2xl font-black text-white sm:text-3xl">{title}</h3>{detail && <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">{detail}</p>}</div>;
}

function Stat({ title, value, icon: Icon, help, onClick }) {
  const content = <><div className="flex items-start justify-between"><GlowIcon><Icon /></GlowIcon>{help && <Tooltip text={help} />}</div><p className="mt-4 text-[0.68rem] font-black uppercase tracking-widest text-slate-500 sm:mt-5 sm:text-sm">{title}</p><p className="mt-2 break-words text-xl font-black text-white sm:text-3xl">{value}</p></>;
  if (onClick) return <motion.button type="button" onClick={onClick} whileHover={{ y: -5 }} className="glow-card h-full w-full rounded-2xl border border-white/10 bg-white/[.055] p-4 text-left shadow-2xl shadow-black/20 backdrop-blur-xl hover:border-amber-400/40 sm:rounded-3xl sm:p-6">{content}</motion.button>;
  return <motion.div whileHover={{ y: -5 }} className="glow-card rounded-2xl border border-white/10 bg-white/[.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-3xl sm:p-6">{content}</motion.div>;
}

function GlassPanel({ children, className = "" }) {
  return <section className={`glow-card rounded-[1.5rem] border border-white/10 bg-white/[.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[2rem] sm:p-6 ${className}`}>{children}</section>;
}

function GlowIcon({ children }) {
  return <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-[0_0_30px_rgba(251,191,36,.35)]">{children}</div>;
}

function MiniMetric({ label, value, green }) {
  return <div className="glow-card h-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 sm:p-4"><p className="text-[0.66rem] font-black uppercase tracking-widest text-slate-500 sm:text-xs">{label}</p><p className={`mt-1 break-words text-sm font-black sm:text-base ${green ? "text-emerald-400" : "text-white"}`}>{value}</p></div>;
}

function Step({ label, detail, done }) {
  return <div className="glow-card flex gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5"><div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}`}>{done ? <CheckCircle2 size={17} /> : null}</div><div><p className="font-black text-white">{label}</p><p className="mt-1 text-sm text-slate-400">{detail}</p></div></div>;
}

function ResultBox({ items }) {
  return <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><p className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">Results</p>{items.map(([label, value, green]) => <div key={label} className="flex items-center justify-between border-b border-white/10 py-4 last:border-0"><span className="font-bold text-slate-400">{label}</span><span className={`text-lg font-black ${green ? "text-emerald-400" : "text-white"}`}>{value}</span></div>)}</div>;
}

function Tooltip({ text }) {
  return <span title={text} aria-label={text} className="inline-flex shrink-0 text-slate-500 transition hover:text-cyan-300"><HelpCircle size={18} /></span>;
}

function Info({ title, text }) {
  return <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><p className="font-black text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>;
}

function MoneyInput({ label, value, setValue }) {
  return <label className="block"><span className="label">{label}</span><input inputMode="decimal" value={formatMoney(value)} onChange={(e) => setValue(cleanNumber(e.target.value))} className="field" /></label>;
}

function NumberInput({ label, value, setValue }) {
  return <label className="block"><span className="label">{label}</span><input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} className="field" /></label>;
}

function toolGradient(index) {
  return [
    "from-amber-400/20 to-orange-500/5",
    "from-emerald-400/20 to-cyan-500/5",
    "from-blue-400/20 to-indigo-500/5",
    "from-violet-400/20 to-fuchsia-500/5",
    "from-teal-400/20 to-emerald-500/5",
    "from-red-400/20 to-rose-500/5",
  ][index % 6];
}

export default function CompFinderPro() {
  return <AppShell />;
}
