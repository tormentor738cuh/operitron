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
  Star,
  StickyNote,
  Trash2,
  Redo2,
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
  projectManager: "/projects",
  profitDashboard: "/profit-dashboard",
  reports: "/reports",
  billing: "/billing",
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

  async function deleteProject(projectId) {
    setProjects((prev) => prev.filter((item) => item.id !== projectId));
    if (activeProject?.id === projectId) setActiveProject(null);
    if (!supabase || !user) return { error: "" };
    const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", user.id);
    return { error: error?.message || "" };
  }

  async function getAccessToken() {
    if (!supabase) return "";
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }

  const page = useMemo(() => {
    const props = { t, language, go, back, projects, setProjects, setActiveTool, user, setUser, signOut, subscription, passwordRecovery, setPasswordRecovery, isAdmin, isTestCustomer, hasProductAccess, getAccessToken, activeProject, setActiveProject, onSaveProject: saveOrUpdateProject, onDeleteProject: deleteProject };
    if (activePage === "home") return user ? (hasProductAccess ? <Dashboard {...props} onAddProject={saveProject} /> : <PremiumPaywall language={language} user={user} go={go} />) : <PublicHome t={t} go={go} />;
    if (activePage === "dashboard" && !user) return <SettingsPage {...props} />;
    if (activePage === "dashboard") return hasProductAccess ? <Dashboard {...props} onAddProject={saveProject} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "projectManager") return hasProductAccess ? <ProjectManager {...props} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "profitDashboard") return hasProductAccess ? <ProfitDashboard {...props} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "reports") return hasProductAccess ? <ReportsPage {...props} /> : <PremiumPaywall language={language} user={user} go={go} />;
    if (activePage === "billing") return hasProductAccess ? <BillingPage {...props} /> : <PremiumPaywall language={language} user={user} go={go} />;
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
      {user && hasProductAccess && <Sidebar t={t} user={user} activePage={activePage} go={go} setActiveTool={setActiveTool} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} isAdmin={isAdmin} openContact={() => setContactOpen(true)} />}
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
      {activeTool && (hasProductAccess ? <ToolModal t={t} language={language} toolId={activeTool} projects={projects} onSaveProject={saveOrUpdateProject} activeProject={activeProject} onClose={() => setActiveTool(null)} /> : <ToolModalFrame onClose={() => setActiveTool(null)}><SubscriptionGate language={language} go={(page) => { setActiveTool(null); go(page); }} /></ToolModalFrame>)}
      {contactOpen && <ContactModal language={language} user={user} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

function LoadingScreen() {
  return <div className="grid min-h-screen place-items-center bg-[#050817] p-6 text-slate-200"><div className="text-center"><BrandLogo size="splash" /><p className="mt-7 text-xs font-black uppercase tracking-[0.24em] text-slate-400">AI Real Estate Operating System</p><div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="h-full w-1/2 rounded-full bg-gradient-to-r from-slate-100 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,.7)]" /></div></div></div>;
}

function Sidebar({ t, user, activePage, go, setActiveTool, mobileOpen, setMobileOpen, collapsed, setCollapsed, isAdmin, openContact }) {
  const isSpanish = t.dashboard === "Panel";
  const items = [
    ["dashboard", Home, t.dashboard],
    ["projectManager", FolderOpen, isSpanish ? "Mis Proyectos" : "My Projects"],
    ["createProject", Plus, isSpanish ? "Crear Proyecto" : "Create Project"],
    ["propertySearch", MapPin, t.propertySearch],
    ["reports", FileText, isSpanish ? "Reportes" : "Reports"],
    ["billing", WalletCards, isSpanish ? "Facturacion" : "Billing"],
    ["contact", Mail, isSpanish ? "Contacto" : "Contact Us"],
  ];
  const toolShortcuts = [
    ["underwriter", LineChart, isSpanish ? "Analizador de Deals" : "Deal Underwriter"],
    ["budget", DollarSign, isSpanish ? "Estimador de Presupuesto" : "Budget Estimator"],
    ["takeoff", Layers, isSpanish ? "Takeoff de Materiales" : "Material Takeoff"],
    ["wizard", Hammer, isSpanish ? "Asistente de Construcci?n" : "Construction Wizard"],
    ["loan", Calculator, isSpanish ? "Calculadora de Pr?stamo" : "Loan Calculator"],
  ];
  const resourceItems = [
    ["learning", BookOpen, t.learning],
    ["tutorials", PlayCircle, t.tutorials],
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
          <button key={id} title={collapsed ? label : undefined} onClick={() => { if (id === "contact") openContact?.(); else if (id === "createProject") go("projectManager"); else go(id); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition-all ${collapsed ? "lg:justify-center lg:px-0" : ""} ${activePage === id ? "bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.25)]" : "text-slate-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,.10)]"}`}>
            <Icon className="shrink-0" size={20} />
            <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
            {!collapsed && <ChevronRight className="ml-auto opacity-0 transition group-hover:opacity-100" size={16} />}
          </button>
        ))}
        {!collapsed && <p className="px-4 pt-4 text-[0.68rem] font-black uppercase tracking-[0.22em] text-slate-600">Tools</p>}
        {toolShortcuts.map(([id, Icon, label]) => (
          <button key={id} title={collapsed ? label : undefined} onClick={() => { setActiveTool?.(id); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold text-slate-400 transition-all hover:bg-white/5 hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,.10)] ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
            <Icon className="shrink-0" size={20} />
            <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
            {!collapsed && <ChevronRight className="ml-auto opacity-0 transition group-hover:opacity-100" size={16} />}
          </button>
        ))}
        {!collapsed && <p className="px-4 pt-4 text-[0.68rem] font-black uppercase tracking-[0.22em] text-slate-600">More</p>}
        {resourceItems.map(([id, Icon, label]) => (
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

function projectNotes(project = {}) {
  const notes = Array.isArray(project.notes) ? project.notes : [];
  return notes.map((note, index) => typeof note === "string" ? { id: index + 1, text: note, createdAt: "" } : note);
}

function projectAnalyses(project = {}) {
  return Array.isArray(project.analyses) ? project.analyses : [];
}

function projectReports(project = {}) {
  const reports = Array.isArray(project.reports) ? project.reports : [];
  const files = Array.isArray(project.files) ? project.files : [];
  const generated = [];
  if (project.takeoff || project.tools?.takeoff) generated.push({ id: "takeoff", title: "Material takeoff report", type: "Estimate report" });
  if (project.underwriter || project.tools?.underwriter || Number(project.profit)) generated.push({ id: "underwriting", title: "Underwriting report", type: "Deal report" });
  return [...reports, ...files, ...generated];
}

function hasProjectNumbers(project = {}) {
  return Boolean(Number(project.arv || project.summary?.arv || project.roiSummary?.arv) || Number(project.profit || project.summary?.profit || project.roiSummary?.profit));
}

function projectProfit(project = {}) {
  return Number(project.profit ?? project.summary?.profit ?? project.roiSummary?.profit ?? 0);
}

function projectTotalCost(project = {}) {
  return Number(project.totalCost ?? project.summary?.totalCost ?? project.purchase ?? 0) + Number(project.repairs ?? 0) + Number(project.expenses ?? 0);
}

function projectRoi(project = {}) {
  const stored = Number(project.roi ?? project.summary?.roi ?? project.roiSummary?.roi);
  if (Number.isFinite(stored) && stored) return stored;
  const cost = projectTotalCost(project);
  return cost ? formulas.roi(projectProfit(project), cost) : 0;
}

function approvalStatus(project = {}) {
  if (!hasProjectNumbers(project)) return { label: "No analysis yet", cls: "text-slate-400 border-slate-700 bg-slate-900/70" };
  const roi = projectRoi(project);
  if (roi >= 15 && projectProfit(project) > 0) return { label: "Approved", cls: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_24px_rgba(16,185,129,.16)]" };
  if (roi > 0) return { label: "Needs Review", cls: "text-amber-300 border-amber-400/40 bg-amber-400/10" };
  return { label: "Not Approved", cls: "text-red-300 border-red-400/40 bg-red-400/10 shadow-[0_0_24px_rgba(248,113,113,.12)]" };
}

function PremiumPaywall({ language = "en", user, go }) {
  const isSpanish = language === "es";
  return (
    <div className="space-y-5">
      <GlassPanel>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">OPERITRON.COM</p>
        <h2 className="mt-3 text-3xl font-black text-white">{isSpanish ? "Inicia tu prueba para acceder" : "Start your trial to unlock tools"}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">{isSpanish ? "Tu cuenta esta lista. Las herramientas premium se activan con una suscripcion en prueba o activa." : "Your account is ready. Premium tools unlock with a trialing or active subscription."}</p>
        {user?.email && <p className="mt-4 text-sm font-bold text-slate-300">{user.email}</p>}
      </GlassPanel>
      <PricingPlans language={language} go={go} user={user} />
    </div>
  );
}

function SettingsPage({ t, language = "en", user, authMode, setAuthMode, authEmail, setAuthEmail, authPassword, setAuthPassword, authName, setAuthName, authMessage, authLoading, handleAuth, handleForgotPassword, signOut }) {
  const isSpanish = language === "es";
  const mode = authMode || "login";
  return (
    <div className="mx-auto max-w-2xl">
      <GlassPanel>
        <BrandLogo size="large" />
        <h2 className="mt-6 text-3xl font-black text-white">{user ? (isSpanish ? "Cuenta" : "Account") : (mode === "signup" ? (isSpanish ? "Crear cuenta" : "Create Account") : (isSpanish ? "Iniciar sesion" : "Sign In"))}</h2>
        {user ? (
          <div className="mt-5 space-y-4">
            <p className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">{user.email}</p>
            <button onClick={signOut} className="secondary-button w-full">{isSpanish ? "Cerrar sesion" : "Sign Out"}</button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {mode === "signup" && <input value={authName || ""} onChange={(e) => setAuthName?.(e.target.value)} placeholder={isSpanish ? "Nombre" : "Name"} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />}
            <input value={authEmail || ""} onChange={(e) => setAuthEmail?.(e.target.value)} placeholder="email@example.com" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            <input type="password" value={authPassword || ""} onChange={(e) => setAuthPassword?.(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAuth?.(mode); }} placeholder={isSpanish ? "Contrasena" : "Password"} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            {authMessage && <p className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">{authMessage}</p>}
            <button disabled={authLoading} onClick={() => handleAuth?.(mode)} className="primary-button w-full">{authLoading ? (isSpanish ? "Procesando..." : "Working...") : mode === "signup" ? (isSpanish ? "Registrarse" : "Sign Up") : (isSpanish ? "Iniciar sesion" : "Sign In")}</button>
            <div className="flex flex-wrap justify-between gap-3 text-sm font-bold text-slate-400">
              <button onClick={() => setAuthMode?.(mode === "signup" ? "login" : "signup")} className="hover:text-cyan-300">{mode === "signup" ? (isSpanish ? "Ya tengo cuenta" : "I have an account") : (isSpanish ? "Crear cuenta" : "Create account")}</button>
              <button onClick={handleForgotPassword} className="hover:text-cyan-300">{isSpanish ? "Olvide mi contrasena" : "Forgot password"}</button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function ProfileMini({ user }) {
  const email = user?.email || "Account";
  const initial = email.slice(0, 1).toUpperCase();
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-cyan-400 text-sm font-black text-slate-950">{initial}</div><div className="min-w-0"><p className="truncate text-sm font-black text-white">{email.split("@")[0]}</p><p className="truncate text-xs text-slate-500">{email}</p></div></div>;
}

function ToolCard({ tool, onClick, compact }) {
  const [id, title, desc, Icon, badge] = Array.isArray(tool) ? tool : [tool.id, tool.title, tool.desc, tool.icon, tool.badge];
  const ToolIcon = Icon || Sparkles;
  return <button onClick={onClick} className={`group rounded-3xl border border-white/10 bg-slate-950/60 p-${compact ? "4" : "5"} text-left transition hover:border-cyan-300/40 hover:shadow-[0_0_35px_rgba(34,211,238,.12)]`}><div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300"><ToolIcon size={19} /></div>{badge && <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[10px] font-black text-amber-300">{badge}</span>}</div><h3 className="mt-4 text-lg font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p><p className="mt-4 text-sm font-black text-cyan-300">Open tool</p></button>;
}

function ProjectTools({ language = "en", setActiveTool }) {
  const isSpanish = language === "es";
  const toolCards = getTools(language);
  return <div className="space-y-5"><SectionHeader title={isSpanish ? "Herramientas del Proyecto" : "Project Tools"} detail={isSpanish ? "Haz clic en cualquier herramienta para abrir su panel." : "Click any tool to open its working panel."} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{toolCards.map((tool) => <ToolCard key={tool[0]} tool={tool} onClick={() => setActiveTool?.(tool[0])} />)}</div></div>;
}

function ToolModalFrame({ children, onClose }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur"><div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl"><div className="mb-4 flex justify-end"><button onClick={onClose} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-black text-slate-300 hover:border-cyan-300/40">Close</button></div>{children}</div></div>;
}

function SubscriptionGate({ language = "en", go }) {
  return <PremiumPaywall language={language} go={go} />;
}

function ToolPanel({ title, subtitle, children }) {
  return <GlassPanel><div className="mb-5"><h3 className="text-2xl font-black text-white">{title}</h3>{subtitle && <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>}</div>{children}</GlassPanel>;
}

function ToolModal({ toolId, language = "en", projects = [], activeProject, onClose }) {
  const tool = getTools(language).find((item) => item[0] === toolId);
  const title = tool?.[1] || "Tool";
  const desc = tool?.[2] || "This workspace is ready for project data.";
  return <ToolModalFrame onClose={onClose}><div className="space-y-4"><div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5"><p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Selected Project</p><p className="mt-2 text-xl font-black text-white">{activeProject?.name || activeProject?.title || projects[0]?.name || projects[0]?.title || "No project selected"}</p></div><ToolPanel title={title} subtitle={desc}><EmptyState text="Open this tool from a saved project to continue working." /></ToolPanel></div></ToolModalFrame>;
}

function SimplePage({ title, subtitle, children }) {
  return <div className="space-y-5"><GlassPanel><h2 className="text-3xl font-black text-white">{title}</h2>{subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}</GlassPanel>{children}</div>;
}

function PropertySearch({ language = "en" }) { return <SimplePage title={language === "es" ? "Busqueda de Propiedades" : "Property Search"} subtitle="RentCast property search workspace."><GlassPanel><EmptyState text="Search tools are loading from your connected services." /></GlassPanel></SimplePage>; }
function LearningCenter({ language = "en" }) { return <SimplePage title={language === "es" ? "Centro de Aprendizaje" : "Learning Center"} subtitle="Guides and tutorials for investors and builders." />; }
function KnowledgeBase({ language = "en" }) { return <SimplePage title={language === "es" ? "Base de Conocimiento" : "Knowledge Base"} subtitle="Answers and operating guidance." />; }
function Tutorials({ language = "en" }) { return <SimplePage title={language === "es" ? "Tutoriales" : "Tutorials"} subtitle="Short walkthroughs for each workflow." />; }
function Tours({ language = "en" }) { return <SimplePage title={language === "es" ? "Recorridos" : "Tours"} subtitle="Guided product tours." />; }
function DropboxPage() { return <SimplePage title="Dropbox" subtitle="Connect and manage cloud storage."><GlassPanel><EmptyState text="Dropbox integration panel is ready." /></GlassPanel></SimplePage>; }
function OwnerConsole({ language = "en" }) { return <SimplePage title={language === "es" ? "Owner Console" : "Owner Console"} subtitle="Admin diagnostics and launch controls."><GlassPanel><EmptyState text="Admin tools are available for authorized accounts." /></GlassPanel></SimplePage>; }
function ProfilePage({ user, back, language = "en" }) { return <SimplePage title={language === "es" ? "Perfil" : "Profile"} subtitle={user?.email || "Account"}><GlassPanel><button onClick={back} className="secondary-button">Back</button></GlassPanel></SimplePage>; }
function LegalPage({ type, language = "en" }) { const titles = { privacy: "Privacy Policy", terms: "Terms of Service", refund: "Refund Policy", disclaimer: "Disclaimer" }; return <SimplePage title={titles[type] || "Legal"} subtitle="OPERITRON.COM"><GlassPanel><p className="leading-7 text-slate-300">This page is available for review. For questions, contact support@operitron.com.</p></GlassPanel></SimplePage>; }

function Dashboard({ t, language, projects, setProjects, setActiveTool, go, onAddProject, isAdmin, activeProject, setActiveProject, onSaveProject, onDeleteProject }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const visibleProjects = projects.filter((project) => !project.archived);
  const totalProfit = visibleProjects.reduce((sum, project) => sum + (hasProjectNumbers(project) ? projectProfit(project) : 0), 0);
  const reportCount = visibleProjects.reduce((sum, project) => sum + projectReports(project).length, 0);
  const isSpanish = language === "es";
  const toolCards = getTools(language);

  async function createProject() {
    if (!name.trim()) return;
    const project = {
      id: Date.now(),
      name: name.trim(),
      title: name.trim(),
      address: address.trim(),
      description: description.trim(),
      status: "Active",
      notes: [],
      analyses: [],
      files: [],
      reports: [],
      tools: {},
      createdAt: new Date().toISOString(),
    };
    if (onSaveProject) await onSaveProject(project); else onAddProject?.(project);
    setName("");
    setAddress("");
    setDescription("");
    setActiveProject(project);
    go("projectDetails");
  }

  function openProject(project) {
    setActiveProject(project);
    go("projectDetails");
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.35rem] border border-cyan-400/20 bg-gradient-to-br from-slate-900/90 via-slate-950 to-cyan-950/30 p-5 shadow-[0_0_45px_rgba(34,211,238,.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">OPERITRON.COM</p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">{isSpanish ? "Panel de proyectos" : "Project command center"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{isSpanish ? "Abre proyectos, revisa analisis, guarda notas y trabaja con tus herramientas desde un solo lugar." : "Open projects, review analysis, save notes, and launch every tool from one compact workspace."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => go("projectManager")} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-white transition hover:border-cyan-300/50 hover:bg-white/5">{isSpanish ? "Ver proyectos" : "Project Manager"}</button>
            <button onClick={() => setActiveTool("underwriter")} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.25)] transition hover:bg-cyan-300">{isSpanish ? "Nuevo analisis" : "New Analysis"}</button>
          </div>
        </div>
      </section>

      {isAdmin && <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-100">Admin access active. Tools are unlocked for this account.</div>}

      <section className="grid gap-4 md:grid-cols-3">
        <Stat onClick={() => go("projectManager")} title={isSpanish ? "Proyectos guardados" : "Saved Projects"} value={visibleProjects.length || "0"} icon={FolderOpen} />
        <Stat onClick={() => go("profitDashboard")} title={isSpanish ? "Ganancia proyectada" : "Projected Profit"} value={visibleProjects.some(hasProjectNumbers) ? formatMoney(totalProfit) : (isSpanish ? "Sin analisis" : "No analysis yet")} icon={WalletCards} />
        <Stat onClick={() => go("reports")} title={isSpanish ? "Reportes listos" : "Reports Ready"} value={reportCount || (isSpanish ? "Sin reportes" : "No reports yet")} icon={FileText} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <GlassPanel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-black text-white">{isSpanish ? "Mis Proyectos" : "My Projects"}</h3>
              <p className="text-sm text-slate-400">{isSpanish ? "Haz clic en un proyecto para abrir notas, herramientas y reportes guardados." : "Click a project to open saved tools, notes, reports, and summaries."}</p>
            </div>
            <button onClick={() => go("projectManager")} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-black text-slate-200 transition hover:border-cyan-300/50">{isSpanish ? "Administrar" : "Manage"}</button>
          </div>
          {visibleProjects.length ? (
            <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {visibleProjects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} open={() => openProject(project)} t={t} onSaveProject={onSaveProject} onDeleteProject={onDeleteProject} setProjects={setProjects} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-center text-slate-400">{isSpanish ? "Todavia no hay proyectos. Crea uno para empezar." : "No projects yet. Create one to start saving analysis."}</div>
          )}
        </GlassPanel>

        <div className="space-y-4">
          <GlassPanel>
            <h3 className="text-lg font-black text-white">{isSpanish ? "Crear Proyecto" : "Create Project"}</h3>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder={isSpanish ? "Nombre del proyecto" : "Project name"} className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300" />
              <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder={isSpanish ? "Direccion" : "Address"} className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={isSpanish ? "Descripcion opcional" : "Optional description"} className="min-h-20 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300" />
              <button onClick={createProject} className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">{isSpanish ? "Crear Proyecto" : "Create Project"}</button>
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-lg font-black text-white">{isSpanish ? "Herramientas Rapidas" : "Quick Tools"}</h3>
            <div className="mt-4 grid gap-2">
              <QuickMini label="Deal Underwriter" icon={LineChart} onClick={() => setActiveTool("underwriter")} />
              <QuickMini label="Loan Calculator" icon={Calculator} onClick={() => setActiveTool("loan")} />
              <QuickMini label={isSpanish ? "Reportes" : "Saved Reports"} icon={FileText} onClick={() => go("reports")} />
            </div>
          </GlassPanel>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-2xl font-black text-white">Project Tools</h3>
          <button onClick={() => go("projectTools")} className="text-sm font-black text-cyan-300 hover:text-cyan-100">{isSpanish ? "Ver todas" : "View all"}</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {toolCards.map((tool) => <ToolCard key={tool[0]} tool={tool} onClick={() => setActiveTool(tool[0])} compact />)}
        </div>
      </section>
    </div>
  );
}

function QuickMini({ label, icon: Icon, onClick }) {
  return <button onClick={onClick} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-left text-sm font-black text-white transition hover:border-cyan-300/40 hover:bg-white/5"><Icon size={18} className="text-cyan-300" />{label}</button>;
}

function ProjectManager({ t, language, projects, setProjects, setActiveProject, go, onSaveProject, onDeleteProject }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [sort, setSort] = useState("updated");
  const isSpanish = language === "es";
  const filtered = projects
    .filter((project) => filter === "all" ? true : filter === "archived" ? project.archived : !project.archived)
    .filter((project) => `${project.name || project.title || ""} ${project.address || ""} ${project.description || ""}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "profit" ? projectProfit(b) - projectProfit(a) : String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));

  function open(project) { setActiveProject(project); go("projectDetails"); }

  return (
    <div className="space-y-5">
      <PageTitle title={isSpanish ? "Administrador de Proyectos" : "Project Manager"} subtitle={isSpanish ? "Busca, abre, duplica, archiva y organiza proyectos." : "Search, open, duplicate, archive, and organize every saved project."} />
      <GlassPanel>
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isSpanish ? "Buscar proyectos..." : "Search projects..."} className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"><option value="active">Active</option><option value="archived">Archived</option><option value="all">All</option></select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"><option value="updated">Recently Updated</option><option value="profit">Profit</option></select>
        </div>
        <div className="mt-5 space-y-3">
          {filtered.length ? filtered.map((project) => <ProjectRow key={project.id} project={project} open={() => open(project)} onSaveProject={onSaveProject} onDeleteProject={onDeleteProject} setProjects={setProjects} />) : <EmptyState text={isSpanish ? "No se encontraron proyectos." : "No projects found."} />}
        </div>
      </GlassPanel>
    </div>
  );
}

function ProfitDashboard({ language, projects, go, setActiveProject }) {
  const isSpanish = language === "es";
  const analyzed = projects.filter((project) => !project.archived && hasProjectNumbers(project));
  const total = analyzed.reduce((sum, project) => sum + projectProfit(project), 0);
  return <div className="space-y-5"><PageTitle title={isSpanish ? "Ganancia del Portafolio" : "Portfolio Profit"} subtitle={isSpanish ? "Resumen de ganancias proyectadas por proyecto." : "Projected profit totals across every analyzed project."} /><section className="grid gap-4 md:grid-cols-3"><Stat title="Projects Analyzed" value={analyzed.length} icon={FolderOpen} /><Stat title="Portfolio Profit" value={analyzed.length ? formatMoney(total) : "No analysis yet"} icon={WalletCards} /><Stat title="Average ROI" value={analyzed.length ? `${(analyzed.reduce((sum, p) => sum + projectRoi(p), 0) / analyzed.length).toFixed(1)}%` : "No analysis yet"} icon={LineChart} /></section><GlassPanel><div className="space-y-3">{analyzed.length ? analyzed.map((project) => <button key={project.id} onClick={() => { setActiveProject(project); go("projectDetails"); }} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left transition hover:border-cyan-300/40"><div><p className="font-black text-white">{project.name || project.title}</p><p className="text-sm text-slate-400">{project.address || "No address"}</p></div><div className="text-right"><p className="font-black text-emerald-300">{formatMoney(projectProfit(project))}</p><p className="text-sm text-slate-400">ROI {projectRoi(project).toFixed(1)}%</p></div></button>) : <EmptyState text="No analysis yet" />}</div></GlassPanel></div>;
}

function ReportsPage({ language, projects }) {
  const isSpanish = language === "es";
  const reports = projects.flatMap((project) => projectReports(project).map((report) => ({ ...report, projectName: project.name || project.title || "Project" })));
  return <div className="space-y-5"><PageTitle title={isSpanish ? "Reportes" : "Reports"} subtitle={isSpanish ? "PDFs, estimaciones, reportes de takeoff y underwriting." : "PDFs, estimates, takeoff reports, and underwriting summaries."} /><GlassPanel><div className="space-y-3">{reports.length ? reports.map((report, index) => <div key={`${report.id || report.title}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div><p className="font-black text-white">{report.title || report.name || "Report"}</p><p className="text-sm text-slate-400">{report.type || "Report"} - {report.projectName}</p></div><button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-black text-slate-200 hover:border-cyan-300/40">Open</button></div>) : <EmptyState text={isSpanish ? "No hay reportes guardados." : "No saved reports yet."} />}</div></GlassPanel></div>;
}

function BillingPage({ language, subscription, getAccessToken, isAdmin }) {
  const [status, setStatus] = useState("");
  const [diagnostics, setDiagnostics] = useState(null);
  const isSpanish = language === "es";
  async function openPortal() {
    setStatus(isSpanish ? "Abriendo portal de facturacion..." : "Opening billing portal...");
    setDiagnostics(null);
    try {
      const token = await getAccessToken?.();
      const response = await fetch(portalEndpoint, { method: "POST", headers: { Authorization: `Bearer ${token || ""}`, "Content-Type": "application/json" } });
      const result = await readApiJson(response);
      if (result.diagnostics) setDiagnostics(result.diagnostics);
      if (!response.ok || !result.url) throw new Error(result.error || "Billing portal could not be created.");
      window.location.href = result.url;
    } catch (error) {
      setStatus(error.message || "Billing portal could not be created.");
    }
  }
  return <div className="space-y-5"><PageTitle title={isSpanish ? "Facturacion" : "Billing"} subtitle={isSpanish ? "Administra tu suscripcion, facturas y metodo de pago." : "Manage your subscription, invoices, and payment method."} /><GlassPanel><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-black uppercase tracking-widest text-slate-500">Status</p><p className="mt-1 text-2xl font-black text-white">{subscription?.status || (isSpanish ? "Sin suscripcion" : "No subscription")}</p><p className="mt-2 text-sm text-slate-400">{isSpanish ? "Si todavia no empezaste una suscripcion, inicia la prueba desde Precios." : "If you have not started a subscription yet, start your trial from Pricing."}</p></div><button onClick={openPortal} className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.25)] hover:bg-cyan-300">{isSpanish ? "Administrar Facturacion" : "Manage Billing"}</button></div>{status && <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">{status}</p>}{isAdmin && diagnostics && <pre className="mt-4 max-h-80 overflow-auto rounded-xl border border-cyan-400/20 bg-slate-950 p-4 text-xs text-cyan-100">{JSON.stringify(diagnostics, null, 2)}</pre>}</GlassPanel></div>;
}

function ProjectDetails({ language, activeProject, setActiveProject, go, setActiveTool, onSaveProject }) {
  const isSpanish = language === "es";
  const toolCards = getTools(language);
  if (!activeProject) return <div className="space-y-5"><PageTitle title={isSpanish ? "Proyecto" : "Project"} subtitle={isSpanish ? "Selecciona un proyecto para continuar." : "Select a project to continue."} /><GlassPanel><EmptyState text={isSpanish ? "No hay proyecto seleccionado." : "No project selected."} /><button onClick={() => go("projectManager")} className="mt-4 rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950">{isSpanish ? "Abrir proyectos" : "Open Projects"}</button></GlassPanel></div>;
  const notes = projectNotes(activeProject);
  const reports = projectReports(activeProject);
  const analyses = projectAnalyses(activeProject);
  async function addNote() {
    const text = window.prompt(isSpanish ? "Nueva nota" : "New note");
    if (!text) return;
    const updated = { ...activeProject, notes: [{ id: Date.now(), text, createdAt: new Date().toISOString() }, ...notes] };
    setActiveProject(updated);
    await onSaveProject?.(updated);
  }
  return <div className="space-y-5"><GlassPanel><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><button onClick={() => go("projectManager")} className="mb-3 text-sm font-black text-slate-400 hover:text-cyan-300">Back to projects</button><h2 className="text-4xl font-black text-white">{activeProject.name || activeProject.title}</h2><p className="mt-2 text-slate-400">{activeProject.address || "No address"}</p>{activeProject.description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{activeProject.description}</p>}</div><span className={`rounded-full border px-4 py-2 text-sm font-black ${approvalStatus(activeProject).cls}`}>{approvalStatus(activeProject).label}</span></div></GlassPanel><section className="grid gap-4 md:grid-cols-3"><Stat title="Profit" value={hasProjectNumbers(activeProject) ? formatMoney(projectProfit(activeProject)) : "No analysis yet"} icon={WalletCards} /><Stat title="ROI" value={hasProjectNumbers(activeProject) ? `${projectRoi(activeProject).toFixed(1)}%` : "No analysis yet"} icon={LineChart} /><Stat title="Reports" value={reports.length || "No reports yet"} icon={FileText} /></section><GlassPanel><h3 className="mb-4 text-2xl font-black text-white">Project Tools</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{toolCards.map((tool) => <ToolCard key={tool[0]} tool={tool} compact onClick={() => setActiveTool(tool[0])} />)}</div></GlassPanel><section className="grid gap-4 xl:grid-cols-3"><GlassPanel><div className="flex items-center justify-between"><h3 className="text-xl font-black text-white">Notes</h3><button onClick={addNote} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-black text-slate-200 hover:border-cyan-300/40">Add Note</button></div><div className="mt-4 space-y-3">{notes.length ? notes.map((note) => <div key={note.id || note.createdAt || note.text} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">{note.text}</div>) : <EmptyState text="No notes yet" />}</div></GlassPanel><GlassPanel><h3 className="text-xl font-black text-white">Analyses</h3><div className="mt-4 space-y-3">{analyses.length ? analyses.map((analysis, index) => <div key={analysis.id || index} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">{analysis.title || analysis.summary || "Saved analysis"}</div>) : <EmptyState text="No analyses yet" />}</div></GlassPanel><GlassPanel><h3 className="text-xl font-black text-white">Files & Reports</h3><div className="mt-4 space-y-3">{reports.length ? reports.map((report, index) => <div key={report.id || index} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">{report.title || report.name || "Saved report"}</div>) : <EmptyState text="No files or reports yet" />}</div></GlassPanel></section></div>;
}

function PageTitle({ title, subtitle }) {
  return <div><h2 className="text-3xl font-black text-white md:text-4xl">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p></div>;
}

function EmptyState({ text }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-sm font-bold text-slate-500">{text}</div>;
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

function SectionHeader({ title, detail, eyebrow }) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>}
      <h2 className="text-3xl font-black text-white sm:text-4xl">{title}</h2>
      {detail && <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">{detail}</p>}
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
  return <section><SectionHeader title={isEs ? "Confiado por Operadores" : "Trusted by Investors"} detail={isEs ? "Software para equipos que viven entre números, obra y ejecución." : "Software for teams living between numbers, jobsites, and execution."} /><div className="grid gap-4 md:grid-cols-3">{quotes.map((review) => <motion.article key={review.name} whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-300/25 hover:shadow-[0_16px_45px_rgba(34,211,238,.08)]"><div className="flex gap-1 text-amber-300" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={17} fill="currentColor" strokeWidth={0} />)}</div><p className="mt-4 min-h-24 leading-7 text-slate-300">{review.quote}</p><div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${review.color} text-lg font-black text-white shadow-[0_0_22px_rgba(34,211,238,.18)]`}>{review.initial}</div><div><p className="font-black text-white">{review.name}</p><p className="text-sm text-cyan-200">{review.role} <span className="text-slate-500">|</span> {review.location}</p></div></div></motion.article>)}</div></section>;
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

function PricingPlans({ language = "en", user, go }) {
  const isEs = language === "es";
  const [loadingPlan, setLoadingPlan] = useState("");
  const [message, setMessage] = useState("");
  const plans = [
    {
      id: "monthly",
      name: isEs ? "Mensual" : "Monthly",
      price: "$29.99",
      term: isEs ? "/mes" : "/month",
      badge: "Flexible",
      detail: isEs ? "Acceso mensual con prueba gratis de 3 dias." : "Month-to-month access with a 3-day free trial.",
      features: isEs ? ["Proyectos ilimitados", "Underwriter de deals", "Calculadoras DSCR y BRRR", "Takeoff de materiales", "Punch list y reportes"] : ["Unlimited projects", "Deal underwriter", "DSCR and BRRR calculators", "Material takeoff", "Punch lists and reports"],
    },
    {
      id: "annual",
      name: isEs ? "Anual" : "Annual",
      price: "$249.99",
      term: isEs ? "/ano" : "/year",
      badge: isEs ? "Mejor Valor" : "Best Value",
      detail: isEs ? "Ahorra mas de 30% con acceso anual." : "Save over 30% with annual access.",
      features: isEs ? ["Todo lo de Mensual", "Soporte prioritario", "Acceso temprano", "Historial extendido"] : ["Everything in Monthly", "Priority support", "Early access", "Extended data history"],
      featured: true,
    },
  ];

  async function startCheckout(plan) {
    setMessage("");
    if (!user) {
      go?.("settings");
      return;
    }
    setLoadingPlan(plan);
    try {
      const { data } = supabase ? await supabase.auth.getSession() : { data: {} };
      const token = data?.session?.access_token;
      if (!token) throw new Error(isEs ? "Inicia sesion primero." : "Sign in first.");
      const response = await fetch(checkoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ plan }),
      });
      const result = await readApiJson(response);
      if (!response.ok) throw new Error(result.error || (isEs ? "No se pudo crear checkout." : "Checkout could not be created."));
      if (result.url) window.location.assign(result.url);
      else throw new Error(isEs ? "Stripe no devolvio una URL." : "Stripe did not return a checkout URL.");
    } catch (error) {
      setMessage(error.message || (isEs ? "No se pudo iniciar checkout." : "Checkout could not be started."));
    } finally {
      setLoadingPlan("");
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{isEs ? "Precios" : "Pricing"}</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">{isEs ? "Planes simples para operadores" : "Simple plans for operators"}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">{isEs ? "Elige Mensual o Anual. La prueba gratis de 3 dias empieza despues del checkout seguro de Stripe." : "Choose Monthly or Annual. The 3-day free trial starts after secure Stripe checkout."}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.id} className={(plan.featured ? "border-cyan-300/45 bg-cyan-300/[.08]" : "border-white/10 bg-white/[.045]") + " rounded-[2rem] border p-6 shadow-2xl shadow-black/25"}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-black text-white">{plan.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{plan.detail}</p>
              </div>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">{plan.badge}</span>
            </div>
            <p className="mt-6 text-5xl font-black text-cyan-200">{plan.price}<span className="text-base text-slate-500">{plan.term}</span></p>
            <p className="mt-2 text-sm font-bold text-emerald-300">{isEs ? "Prueba gratis de 3 dias" : "3-day free trial"}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm font-bold text-slate-300"><CheckCircle2 className="shrink-0 text-emerald-300" size={18} />{feature}</li>)}
            </ul>
            <button onClick={() => startCheckout(plan.id)} disabled={!!loadingPlan} className={(plan.featured ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200" : "border border-white/10 text-white hover:border-cyan-300/50 hover:bg-white/5") + " mt-7 w-full rounded-2xl px-5 py-4 font-black transition"}>
              {loadingPlan === plan.id ? (isEs ? "Abriendo..." : "Opening...") : (isEs ? "Comenzar" : "Get Started")}
            </button>
          </div>
        ))}
      </div>
      {message && <p className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-center text-sm font-bold text-amber-100">{message}</p>}
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

function ProjectCard({ project, open, t, onSaveProject, onDeleteProject, setProjects }) {
  const approval = approvalStatus(project);
  const hasNumbers = hasProjectNumbers(project);

  async function updateProject(patch) {
    const updated = { ...project, ...patch, updatedAt: new Date().toISOString() };
    setProjects?.((prev) => prev.map((item) => item.id === project.id ? updated : item));
    await onSaveProject?.(updated);
  }

  async function renameProject(event) {
    event.stopPropagation();
    const next = window.prompt("Project name", project.name || project.title || "");
    if (next?.trim()) await updateProject({ name: next.trim(), title: next.trim() });
  }

  async function editAddress(event) {
    event.stopPropagation();
    const next = window.prompt("Property address", project.address || "");
    if (next !== null) await updateProject({ address: next.trim() });
  }

  async function editDescription(event) {
    event.stopPropagation();
    const next = window.prompt("Project description", project.description || "");
    if (next !== null) await updateProject({ description: next.trim() });
  }

  async function addNote(event) {
    event.stopPropagation();
    const text = window.prompt("Add project note");
    if (!text?.trim()) return;
    await updateProject({ notes: [{ id: Date.now(), text: text.trim(), createdAt: new Date().toISOString() }, ...projectNotes(project)] });
  }

  async function duplicateProject(event) {
    event.stopPropagation();
    const baseName = project.name || project.title || "Project";
    const copy = { ...project, id: Date.now(), name: `${baseName} Copy`, title: `${baseName} Copy`, archived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setProjects?.((prev) => [copy, ...prev]);
    await onSaveProject?.(copy);
  }

  async function archiveProject(event) {
    event.stopPropagation();
    await updateProject({ archived: true, status: "Archived" });
  }

  async function deleteProject(event) {
    event.stopPropagation();
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setProjects?.((prev) => prev.filter((item) => item.id !== project.id));
    await onDeleteProject?.(project.id);
  }

  return (
    <motion.article whileHover={{ y: -3 }} onClick={open} className="group cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.06] to-white/[.025] p-4 shadow-xl shadow-black/20 transition hover:border-cyan-300/40 hover:shadow-[0_0_32px_rgba(34,211,238,.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-white">{project.name || project.title || "Untitled Project"}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{project.address || "No address"}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${approval.cls}`}>{approval.label}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniMetric label="Profit" value={hasNumbers ? formatMoney(projectProfit(project)) : "No analysis yet"} green={projectProfit(project) > 0} />
        <MiniMetric label="ROI" value={hasNumbers ? `${projectRoi(project).toFixed(1)}%` : "No analysis yet"} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <button onClick={(event) => { event.stopPropagation(); open(); }} className="rounded-xl bg-cyan-400 px-3 py-2 font-black text-slate-950">Open</button>
        <button onClick={addNote} className="rounded-xl border border-white/10 px-3 py-2 font-black text-slate-200 hover:border-cyan-300/40">Note</button>
        <button onClick={renameProject} className="rounded-xl border border-white/10 px-3 py-2 font-black text-slate-200 hover:border-cyan-300/40">Rename</button>
        <button onClick={duplicateProject} className="rounded-xl border border-white/10 px-3 py-2 font-black text-slate-200 hover:border-cyan-300/40">Duplicate</button>
        <button onClick={editAddress} className="rounded-xl border border-white/10 px-3 py-2 font-black text-slate-200 hover:border-cyan-300/40">Address</button>
        <button onClick={editDescription} className="rounded-xl border border-white/10 px-3 py-2 font-black text-slate-200 hover:border-cyan-300/40">Description</button>
        <button onClick={archiveProject} className="rounded-xl border border-white/10 px-3 py-2 font-black text-slate-200 hover:border-amber-300/40">Archive</button>
        <button onClick={deleteProject} className="rounded-xl border border-red-400/20 px-3 py-2 font-black text-red-300 hover:border-red-300/60">Delete</button>
      </div>
    </motion.article>
  );
}

function ProjectRow({ project, open, onSaveProject, onDeleteProject, setProjects }) {
  return <ProjectCard project={project} open={open} onSaveProject={onSaveProject} onDeleteProject={onDeleteProject} setProjects={setProjects} />;
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
