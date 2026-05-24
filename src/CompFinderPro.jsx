import React, { useEffect, useMemo, useRef, useState } from "react";
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
  ChevronRight,
  ClipboardCheck,
  Cloud,
  DollarSign,
  FileText,
  FolderOpen,
  Globe2,
  Hammer,
  HelpCircle,
  Home,
  Languages,
  Layers,
  LineChart,
  ListChecks,
  LogOut,
  MapPin,
  Mail,
  Menu,
  Mic,
  Phone,
  PlayCircle,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Upload,
  UserCircle,
  Users,
  WalletCards,
  X,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const rentcastApiKey = import.meta.env.VITE_RENTCAST_API_KEY;

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const formatNumber = (value, digits = 2) =>
  Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: digits });

const cleanNumber = (value) => Number(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") ?? "";
const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const formulas = {
  arv: (comps) => {
    const valid = comps.map(Number).filter(Boolean);
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
  },
  roi: (profit, totalCost) => (totalCost ? (profit / totalCost) * 100 : 0),
    monthlyMortgage: (loan, annualRate, years) => {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return r ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
  },
  capRate: (noi, purchasePrice) => (purchasePrice ? (noi / purchasePrice) * 100 : 0),
  cashOnCash: (annualCashFlow, cashInvested) => (cashInvested ? (annualCashFlow / cashInvested) * 100 : 0),
  dscr: (noi, annualDebtService) => (annualDebtService ? noi / annualDebtService : 0),
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
    supabaseReady: "Supabase is configured.",
    accountKeyNeeded: "Account access is ready for configuration. Add Supabase keys for live account access.",
    profileStarted: "Profile session started. Add Supabase keys for persistent accounts.",
    checkEmail: "Check your email to confirm your account.",
    loggedIn: "Logged in.",
    propertyReady: "Ready to search.",
    rentcastKeyRequired: "RentCast key required. Add VITE_RENTCAST_API_KEY to activate live records.",
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
    supabaseReady: "Supabase está configurado.",
    accountKeyNeeded: "El acceso de cuenta está listo para configurarse. Agrega las llaves de Supabase para cuentas reales.",
    profileStarted: "Sesión de perfil iniciada. Agrega llaves de Supabase para cuentas persistentes.",
    checkEmail: "Revisa tu correo para confirmar la cuenta.",
    loggedIn: "Sesión iniciada.",
    propertyReady: "Listo para buscar.",
    rentcastKeyRequired: "Se requiere llave de RentCast. Agrega VITE_RENTCAST_API_KEY para activar registros reales.",
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
  ["wizard", "Construction Wizard", "Plan phases, budgets, permits, and draw schedule.", Hammer, "Pro"],
  ["underwriter", "Deal Underwriter", "Review ARV, repairs, offer price, ROI, and risk.", LineChart, "Core"],
  ["loan", "Investment Loan Calculator", "Model leverage, points, payment, and DSCR.", Calculator, "DSCR"],
  ["todo", "To Do List", "Track investor, lender, and contractor next steps.", ListChecks, "Live"],
  ["punch", "Punch List", "Log final inspection items before closeout.", ClipboardCheck, "Trades"],
  ["takeoff", "Material Takeoff Beta", "Estimate quantities from room and scope assumptions.", Layers, "Beta"],
  ["subs", "Subs / Quotes New", "Compare bids and assign subcontractor packages.", Users, "New"],
  ["progress", "Construction Progress", "Track schedule, budget, photos, and completion.", BarChart3, "Field"],
  ["linked", "Linked Items", "Connect reports, comps, quotes, permits, and files.", FolderOpen, "Vault"],
  ["loanCalcs", "Loan Calculations", "Keep lender assumptions beside the project.", WalletCards, "Finance"],
  ["collab", "Collaborators", "Invite partners, lenders, assistants, and contractors.", Users, "Team"],
];

const toolsEs = [
  ["wizard", "Asistente de Construcción", "Planifica fases, presupuestos, permisos y calendario de desembolsos.", Hammer, "Pro"],
  ["underwriter", "Analizador de Deals", "Revisa ARV, reparaciones, oferta, ROI y riesgo.", LineChart, "Core"],
  ["loan", "Calculadora de Préstamo de Inversión", "Modela apalancamiento, puntos, pago y DSCR.", Calculator, "DSCR"],
  ["todo", "Lista de Tareas", "Rastrea próximos pasos de inversionistas, prestamistas y contratistas.", ListChecks, "Live"],
  ["punch", "Lista de Pendientes", "Registra detalles de inspección final antes del cierre.", ClipboardCheck, "Oficios"],
  ["takeoff", "Cálculo de Materiales Beta", "Estima cantidades desde áreas, habitaciones y alcance.", Layers, "Beta"],
  ["subs", "Subcontratistas / Cotizaciones Nuevo", "Compara ofertas y asigna paquetes de trabajo.", Users, "Nuevo"],
  ["progress", "Progreso de Construcción", "Rastrea cronograma, presupuesto, fotos y avance.", BarChart3, "Campo"],
  ["linked", "Elementos Vinculados", "Conecta reportes, comps, cotizaciones, permisos y archivos.", FolderOpen, "Archivo"],
  ["loanCalcs", "Cálculos de Préstamo", "Mantén supuestos del prestamista junto al proyecto.", WalletCards, "Finanzas"],
  ["collab", "Colaboradores", "Invita socios, prestamistas, asistentes y contratistas.", Users, "Equipo"],
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
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [activeTool, setActiveTool] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = enhancedCopy[language];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const go = (page) => {
    setHistory((old) => [...old, activePage]);
    setActivePage(page);
    setMobileOpen(false);
  };

  const back = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((old) => old.slice(0, -1));
    setActivePage(previous);
  };

  const page = useMemo(() => {
    const props = { t, language, go, back, projects, setProjects, setActiveTool, user, setUser };
    if (!user && !["dashboard", "pricing", "settings", "learning", "knowledge", "tutorials", "tours", "privacy", "terms", "disclaimer"].includes(activePage)) return <PublicHome t={t} go={go} />;
    if (activePage === "dashboard" && !user) return <PublicHome t={t} go={go} />;
    if (activePage === "dashboard") return <Dashboard {...props} />;
    if (activePage === "projectTools") return <ProjectTools {...props} />;
    if (activePage === "propertySearch") return <PropertySearch t={t} />;
    if (activePage === "learning") return <LearningCenter t={t} language={language} go={go} />;
    if (activePage === "knowledge") return <KnowledgeBase t={t} language={language} />;
    if (activePage === "tutorials") return <Tutorials t={t} language={language} />;
    if (activePage === "tours") return <Tours t={t} language={language} />;
    if (activePage === "dropbox") return <DropboxPage t={t} />;
    if (activePage === "pricing") return <PricingPlans language={language} />;
    if (activePage === "settings") return <SettingsPage {...props} />;
    if (activePage === "profile") return <ProfilePage t={t} language={language} user={user} back={back} />;
    if (["privacy", "terms", "disclaimer"].includes(activePage)) return <LegalPage type={activePage} language={language} />;
    return <Dashboard {...props} />;
  }, [activePage, language, projects, user]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050817] text-slate-200">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute -left-32 -top-28 h-[440px] w-[440px] rounded-full bg-cyan-500/16 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-[460px] w-[460px] rounded-full bg-amber-400/18 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[34%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      {user && <Sidebar t={t} activePage={activePage} go={go} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />}
      {user && mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/70 lg:hidden" />}
      <Header t={t} language={language} setLanguage={setLanguage} setMobileOpen={setMobileOpen} go={go} user={user} />
      <main className={`relative z-10 p-5 lg:p-8 ${user ? "lg:ml-72" : "mx-auto max-w-7xl"}`}>
        {user && history.length > 0 && activePage !== "dashboard" && <button onClick={back} className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-amber-400/50 hover:text-white">
          ← {t.back}
        </button>}
        <motion.div key={activePage} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {page}
        </motion.div>
      </main>
      {activeTool && <ToolModal t={t} language={language} toolId={activeTool} onClose={() => setActiveTool(null)} />}
    </div>
  );
}

function LoadingScreen() {
  return <div className="grid min-h-screen place-items-center bg-[#050817] p-6 text-slate-200"><div className="text-center"><div className="mx-auto flex justify-center"><BrandLogo /></div><p className="mt-8 text-xs font-black uppercase tracking-[0.35em] text-slate-400">AI Real Estate Operating System</p><div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="h-full w-1/2 rounded-full bg-gradient-to-r from-slate-100 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,.7)]" /></div></div></div>;
}

function Sidebar({ t, activePage, go, mobileOpen, setMobileOpen }) {
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
    ["privacy", FileText, t.privacy],
    ["terms", ClipboardCheck, t.terms],
    ["disclaimer", Sparkles, t.disclaimer],
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950/90 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <BrandLogo onClick={() => go("dashboard")} size="sidebar" />

      <ProfileMini t={t} go={go} />

      <nav className="mt-6 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map(([id, Icon, label]) => (
          <button key={id} onClick={() => { go(id); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition-all ${activePage === id ? "bg-amber-400 text-slate-950 shadow-[0_0_35px_rgba(251,191,36,.28)]" : "text-slate-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_30px_rgba(251,191,36,.10)]"}`}>
            <Icon size={20} />
            {label}
            <ChevronRight className="ml-auto opacity-0 transition group-hover:opacity-100" size={16} />
          </button>
        ))}
      </nav>

      <div className="mt-5 shrink-0 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-cyan-400/5 p-4 shadow-[0_0_40px_rgba(251,191,36,.12)]">
        <div className="mb-2 flex items-center gap-2 text-amber-300"><Sparkles size={18} /><p className="font-black">{t.earlyAccess}</p></div>
        <p className="text-sm leading-6 text-slate-400">{t.earlyAccessText}</p>
      </div>
    </aside>
  );
}

function Header({ t, language, setLanguage, setMobileOpen, go, user }) {
  return (
    <header className={`sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-5 py-4 backdrop-blur-xl ${user ? "lg:ml-72" : ""}`}>
      <div className={`mx-auto flex items-center justify-between gap-4 ${user ? "" : "max-w-7xl"}`}>
        <div className="flex min-w-0 items-center gap-3">
          {user && <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-white/10 p-2 text-white lg:hidden"><Menu /></button>}
          <BrandLogo onClick={() => go("dashboard")} compact />
          {user && <div className="hidden min-w-0 xl:block"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t.command}</p><h2 className="truncate text-lg font-black text-white">{user.email}</h2></div>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLanguage(language === "en" ? "es" : "en")} className="flex min-w-[8.5rem] items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-300 hover:border-amber-400/50 hover:text-white">
            <Languages size={18} /> {language === "en" ? "Español" : "English"}
          </button>
          {user ? <button onClick={() => go("profile")} className="hidden rounded-2xl border border-white/10 p-3 text-slate-300 hover:border-cyan-300/50 hover:text-white sm:block"><UserCircle /></button> : <button onClick={() => go("settings")} className="hidden rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-300 hover:border-cyan-300/50 hover:text-white sm:block">{t.login}</button>}
          <button onClick={() => go("pricing")} className="hidden rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(251,191,36,.35)] transition hover:-translate-y-0.5 hover:bg-amber-300 md:block">
            {t.startTrial}
          </button>
        </div>
      </div>
    </header>
  );
}

function BrandLogo({ onClick, compact = false, size = "default" }) {
  const logoSize = size === "sidebar" ? "h-16 w-16" : compact ? "h-12 w-12" : "h-14 w-14";
  return (
    <button onClick={onClick} className="group flex min-w-0 shrink-0 items-center gap-3 rounded-3xl px-2 py-2 text-left transition hover:bg-white/[.04]" aria-label="Operitron home">
      <span className={`relative grid ${logoSize} shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-900 shadow-[0_0_32px_rgba(34,211,238,.22)] transition group-hover:shadow-[0_0_45px_rgba(34,211,238,.35)]`}>
        <span className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-transparent to-purple-500/20" />
        <Building2 className="relative z-10 text-cyan-200 drop-shadow-[0_0_12px_rgba(56,189,248,.8)]" size={compact ? 27 : 34} />
      </span>
      <span className={`${compact ? "hidden sm:block" : "block"} min-w-0`}>
        <span className="block truncate text-xl font-black tracking-wide text-white">OPERITRON.COM</span>
        <span className="block truncate text-[0.62rem] font-bold uppercase tracking-[0.24em] text-cyan-300">AI Real Estate Operating System</span>
      </span>
    </button>
  );
}

function Dashboard({ t, language, projects, setProjects, setActiveTool, go }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);

  function addProject() {
    if (!name.trim()) return;
    setProjects([{ id: Date.now(), name, type: t.newAnalysis, address: address || t.propertyAddress, arv: 0, profit: 0, purchase: 0, repairs: 0, expenses: 0, progress: 0, status: t.earlyAccess }, ...projects]);
    setName("");
    setAddress("");
  }

  return (
    <div className="space-y-8">
      <Hero t={t} go={go} />

      <section className="grid gap-5 md:grid-cols-3">
        <Stat onClick={() => go("projectTools")} title={t.savedProjects} value={projects.length} icon={FolderOpen} help={t.savedProjectsHelp || "Number of saved property analyses in your workspace."} />
        <Stat onClick={() => setActiveTool("underwriter")} title={t.projectedProfit} value={formatMoney(totalProfit)} icon={WalletCards} help={t.projectedProfitHelp || "Combined expected profit from current projects."} />
        <Stat onClick={() => setActiveTool("reports")} title={t.reportsReady} value="8" icon={FileText} help={t.reportsReadyHelp || "Reports available for PDF export or partner review."} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <GlassPanel>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-3xl font-black text-white">{t.myProjects}</h3>
              <p className="text-slate-400">{t.projectHint}</p>
            </div>
            <button onClick={() => setActiveTool("underwriter")} className="primary-button">{t.newAnalysis}</button>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} open={() => go("projectTools")} t={t} />
            ))}
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <h3 className="text-xl font-black text-white">{t.createProject}</h3>
            <p className="mt-1 text-sm text-slate-400">{t.createProjectHint}</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.projectName} className="field mt-5" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.propertyAddress} className="field mt-3" />
            <button onClick={addProject} className="primary-button mt-4 flex w-full items-center justify-center gap-2"><Plus size={18} /> {t.addProject}</button>
          </GlassPanel>
          <AIAssistant t={t} />
        </div>
      </section>

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
      ["Inteligencia de Propiedades", "Conecta APIs para propietarios, impuestos, historial de ventas, comps y contexto de valuación.", MapPin],
      ["Herramientas de Construcción", "Gestiona takeoffs, punch lists, cotizaciones, archivos vinculados y colaboradores en un solo espacio.", Hammer],
    ]
    : [
      ["Deal Analysis", "Underwrite flips, rentals, BRRR deals, and construction opportunities with investor-grade formulas.", LineChart],
      ["Property Intelligence", "Connect APIs for owner records, taxes, sales history, comps, and valuation context.", MapPin],
      ["Construction Tools", "Manage takeoffs, punch lists, quotes, linked files, and collaborators from one workspace.", Hammer],
    ];
  return (
    <div className="space-y-8">
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
      <LandingStats isEs={isEs} />
      <LandingFeatureSections isEs={isEs} />
      <WhyChoose isEs={isEs} />
      <Testimonials isEs={isEs} />
      <ByNumbers isEs={isEs} />
      <PricingPlans language={isEs ? "es" : "en"} />
      <LandingFAQ isEs={isEs} />
      <LandingKnowledgeBase isEs={isEs} />
      <GlassPanel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-black text-white">{isEs ? "Listo para empezar con OPERITRON.COM?" : "Ready to Start with OPERITRON.COM?"}</h3>
            <p className="mt-2 text-slate-400">{isEs ? "OPERITRON.COM te da análisis de deals, herramientas de construcción, takeoffs, punch lists y colaboración en una sola plataforma. " : "OPERITRON.COM gives you deal analysis, construction tools, takeoffs, punch lists, and collaboration in one platform. "}{t.trialNote}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => go("settings")} className="primary-button">{isEs ? "Crear cuenta" : "Create Account"}</button>
            <button onClick={() => go("pricing")} className="secondary-button">{t.pricing}</button>
          </div>
        </div>
      </GlassPanel>
      <PublicFooter isEs={isEs} go={go} />
    </div>
  );
}

function LandingStats({ isEs }) {
  const stats = isEs
    ? [["500+", "Inversionistas Activos"], ["10,000+", "Análisis Realizados"], ["$2B+", "Valor de Proyectos Revisados"], ["4.9x", "Velocidad de Análisis"]]
    : [["500+", "Active Investors"], ["10,000+", "Analyses Run"], ["$2B+", "Project Value Reviewed"], ["4.9x", "Analysis Speed"]];
  return <section className="grid gap-4 border-y border-white/10 py-8 md:grid-cols-4">{stats.map(([value, label]) => <div key={label} className="text-center"><p className="text-3xl font-black text-amber-300">{value}</p><p className="mt-1 text-sm font-bold text-slate-500">{label}</p></div>)}</section>;
}

function LandingFeatureSections({ isEs }) {
  const sections = isEs
    ? [
      ["Analiza Deals en Minutos", "Evalúa ARV, precio de compra, reparaciones, financiamiento, DSCR, ROI y flujo de caja sin vivir en hojas de cálculo.", ["ROI en tiempo real", "Regla del 70%", "Oferta máxima", "Escenarios de salida"], LineChart],
      ["Rastrea Cada Fase de Construcción", "Organiza cronogramas, presupuestos, fotos, inspecciones y dependencias críticas desde una sola vista de obra.", ["Fases de construcción", "Riesgo de retrasos", "Control de presupuesto", "Progreso por hitos"], BarChart3],
      ["Mide Planos con IA", "Sube planos, estima cantidades, aplica factores de desperdicio y genera reportes de materiales para cotizar con más claridad.", ["PDFs multipágina", "Áreas y lineales", "Costos de materiales", "Exportación PDF"], Layers],
      ["Cierra Proyectos con Punch Lists", "Documenta pendientes, asigna oficios, adjunta fotos y exporta reportes limpios para contratistas, compradores o prestamistas.", ["Fotos por partida", "Asignación por oficio", "Estados abiertos/resueltos", "Reporte PDF"], ClipboardCheck],
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
    ? [["Números Claros", "Fórmulas visibles para revisar supuestos antes de comprar."], ["Flujo Todo-en-Uno", "Deals, construcción, takeoffs y reportes sin cambiar de sistema."], ["Listo para Equipos", "Colabora con socios, contratistas, prestamistas y gerentes."], ["Diseñado para Operadores", "Creado para decisiones reales de inversión y obra, no solo reportes bonitos."]]
    : [["Clear Numbers", "Visible formulas help you review assumptions before you buy."], ["All-in-One Workflow", "Deals, construction, takeoffs, and reports without switching systems."], ["Team Ready", "Collaborate with partners, contractors, lenders, and managers."], ["Built for Operators", "Designed for real investment and build decisions, not just pretty reports."]];
  return <section><SectionHeader title="Why Choose OPERITRON.COM?" detail={isEs ? "IA práctica, cálculos claros y control de proyecto en una plataforma original." : "Practical AI, clear calculations, and project control in one original platform."} /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{items.map(([title, text]) => <Info key={title} title={title} text={text} />)}</div></section>;
}

function Testimonials({ isEs }) {
  const quotes = isEs
    ? [["“Operitron nos ayudó a revisar más deals sin perder control de los supuestos.”", "Inversionista Fix & Flip"], ["“La combinación de underwriting y construcción es exactamente lo que necesitaba nuestro equipo.”", "Constructor Residencial"], ["“Los reportes y punch lists hacen que las conversaciones con contratistas sean más limpias.”", "Operador BRRR"]]
    : [["“Operitron helps us review more deals without losing control of the assumptions.”", "Fix & Flip Investor"], ["“The underwriting plus construction workflow is exactly what our team needed.”", "Residential Builder"], ["“Reports and punch lists make contractor conversations cleaner.”", "BRRR Operator"]];
  return <section><SectionHeader title={isEs ? "Confiado por Operadores" : "Trusted by Investors"} detail={isEs ? "Software para equipos que viven entre números, obra y ejecución." : "Software for teams living between numbers, jobsites, and execution."} /><div className="grid gap-4 md:grid-cols-3">{quotes.map(([quote, role]) => <div key={role} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><p className="text-amber-300">★★★★★</p><p className="mt-4 leading-7 text-slate-300">{quote}</p><p className="mt-4 font-black text-cyan-300">{role}</p></div>)}</div></section>;
}

function ByNumbers({ isEs }) {
  return <section><SectionHeader title={isEs ? "En Números" : "By the Numbers"} detail={isEs ? "Resultados reales impulsados por herramientas inteligentes." : "Real results powered by intelligent tools."} /><div className="grid gap-4 md:grid-cols-3"><Info title={isEs ? "15% Menos Retrasos" : "15% Fewer Delays"} text={isEs ? "La predicción de cuellos de botella con IA identifica riesgos de ruta crítica antes de que se conviertan en sobrecostos." : "AI bottleneck prediction flags critical-path risk before it becomes expensive schedule drift."} /><Info title={isEs ? "Precisión en Takeoff" : "Takeoff Accuracy"} text={isEs ? "Mediciones automatizadas con factores de desperdicio reducen errores de conteo manual y faltantes de material." : "Automated measurement logic with waste factors reduces manual counting mistakes and material gaps."} /><Info title={isEs ? "2x Más Rápido en Análisis" : "2x Faster Underwriting"} text={isEs ? "ROI, financiamiento y DSCR en tiempo real convierten horas de hojas de cálculo en minutos." : "Real-time ROI, financing, and DSCR calculations turn spreadsheet hours into minutes."} /></div></section>;
}

function LandingFAQ({ isEs }) {
  const faqs = isEs
    ? [["¿Operitron reemplaza a mi contratista o asesor?", "No. OPERITRON.COM organiza cálculos y flujos de trabajo para apoyar decisiones; siempre valida con profesionales licenciados."], ["¿Puedo usarlo para flips, rentals y BRRR?", "Sí. Incluye underwriting, DSCR, cash-out, construcción, takeoffs y reportes."], ["¿Incluye prueba gratis?", "Sí. Mantén el lenguaje de prueba gratis de 3 días en los planes Monthly y Annual."], ["¿Puedo colaborar con mi equipo?", "Sí. Puedes estructurar colaboradores, elementos vinculados, cotizaciones y reportes por proyecto."]]
    : [["Does Operitron replace my contractor or advisor?", "No. OPERITRON.COM organizes calculations and workflows for decision support; always validate with licensed professionals."], ["Can I use it for flips, rentals, and BRRR?", "Yes. It includes underwriting, DSCR, cash-out, construction tracking, takeoffs, and reports."], ["Is there a free trial?", "Yes. Both Monthly and Annual plans keep the 3-day free trial language."], ["Can I collaborate with my team?", "Yes. Structure collaborators, linked items, quotes, and reports by project."]];
  return <section><SectionHeader title={isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions"} detail={isEs ? "Respuestas rápidas para inversionistas y constructores." : "Quick answers for investors and builders."} /><div className="space-y-3">{faqs.map(([q, a]) => <details key={q} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><summary className="cursor-pointer font-black text-white">{q}</summary><p className="mt-3 leading-7 text-slate-400">{a}</p></details>)}</div></section>;
}

function LandingKnowledgeBase({ isEs }) {
  const topics = isEs ? ["Cómo evaluar un deal más rápido", "Cómo preparar una oferta máxima", "Cómo organizar un cierre de construcción", "Cómo revisar DSCR antes de hablar con un prestamista"] : ["How to evaluate a deal faster", "How to prepare a max offer", "How to organize construction closeout", "How to review DSCR before calling a lender"];
  return <section><SectionHeader title={isEs ? "Base de Conocimiento para Inversionistas" : "Investor Knowledge Base"} detail={isEs ? "Guías originales para analizar, construir y operar con más claridad." : "Original guides for analyzing, building, and operating with more clarity."} /><div className="grid gap-4 md:grid-cols-2">{topics.map((topic) => <button key={topic} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-left font-black text-white hover:border-cyan-300/40">{topic}<ChevronRight className="float-right text-cyan-300" /></button>)}</div></section>;
}

function Hero({ t, go }) {
  const isEs = t.dashboard === "Panel";
  const insideItems = isEs
    ? ["Analizador de Deals", "Calculadora DSCR", "Calculadora BRRR", "Rastreador de Construcción", "Takeoff de Materiales con IA", "Punch List", "Checklist de Construcción", "Colaboración de Equipo"]
    : ["Deal Underwriter", "DSCR Calculator", "BRRR Calculator", "Construction Tracker", "AI Material Takeoff", "Punch List", "Construction Checklist", "Team Collaboration"];
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-900/80 to-amber-400/10 p-7 shadow-2xl shadow-black/30">
      <div className="grid gap-8 xl:grid-cols-[1fr_430px]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-300">{t.brand}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{t.trialNote} {t.heroText}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => go("pricing")} className="primary-button">{t.startTrial}</button>
            <button onClick={() => go("learning")} className="secondary-button">{t.viewLearning}</button>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
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
  const toolLinks = isEs ? ["Análisis de Deals", "Calculadora DSCR", "Calculadora BRRR", "Rastreador de Construcción"] : ["Deal Analysis", "DSCR Calculator", "BRRR Calculator", "Construction Tracker"];
  const moreLinks = isEs ? ["Takeoff con IA", "Punch List", "Lista de Tareas", "Precios"] : ["AI Takeoff", "Punch List", "To-Do List", "Pricing"];
  const resourceLinks = isEs ? ["Aprende", "Tutoriales", "Plataforma", "Contacto", "Glosario Técnico"] : ["Learn", "Tutorials", "Platform", "Contact", "Technical Glossary"];
  const companyLinks = isEs ? ["Sobre Nosotros", "Términos", "Privacidad"] : ["About Us", "Terms", "Privacy"];
  return (
    <footer className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20">
      <div className="grid gap-5 md:grid-cols-3">
        <Info title={isEs ? "15% Menos Retrasos" : "15% Fewer Delays"} text={isEs ? "La predicción de cuellos de botella con IA identifica riesgos de ruta crítica antes de que se conviertan en sobrecostos de cronograma." : "AI bottleneck prediction identifies critical-path risk before it becomes schedule overrun."} />
        <Info title={isEs ? "Precisión en Takeoff" : "Takeoff Accuracy"} text={isEs ? "Mediciones automatizadas con lógica de factores de desperdicio reducen errores de conteo manual y faltantes de material." : "Automated measurements with waste-factor logic reduce manual counting errors and material shortages."} />
        <Info title={isEs ? "2x Más Rápido en Análisis" : "2x Faster Analysis"} text={isEs ? "ROI en tiempo real, proyecciones de financiamiento y cálculos DSCR convierten horas de hojas de cálculo en minutos." : "Real-time ROI, financing projections, and DSCR calculations turn spreadsheet hours into minutes."} />
      </div>
      <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
        <p className="font-black text-amber-200">{isEs ? "⚠️ Aviso Importante" : "⚠️ Important Notice"}</p>
        <p className="mt-2 leading-7 text-slate-300">{isEs ? "Importante: Operitron es una herramienta de apoyo a la toma de decisiones, no una garantía. Todas las proyecciones, presupuestos y rendimientos son estimaciones basadas en sus datos y suposiciones. Operitron no es responsable de pérdidas, retrasos, sobrecostos, problemas de cumplimiento de códigos, resultados de financiamiento o resultados de inversión. Siempre verifique los datos y consulte a profesionales licenciados." : "Operitron is decision-support software, not a guarantee. All projections, budgets, and returns are estimates based on your inputs and assumptions. Always verify data and consult licensed professionals."}</p>
      </div>
      <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title="Tools" items={toolLinks} />
        <FooterColumn title="More" items={moreLinks} onPricing={() => go("pricing")} />
        <FooterColumn title={isEs ? "Recursos" : "Resources"} items={resourceLinks} />
        <FooterColumn title={isEs ? "Empresa" : "Company"} items={companyLinks} />
      </div>
      <p className="mt-8 text-sm text-slate-500">© 2026 Operitron. {isEs ? "Todos los derechos reservados." : "All rights reserved."}</p>
    </footer>
  );
}

function FooterColumn({ title, items, onPricing }) {
  return <div><p className="font-black text-white">{title}</p><div className="mt-3 grid gap-2">{items.map((item) => <button key={item} onClick={item === "Pricing" || item === "Precios" ? onPricing : undefined} className="text-left text-sm text-slate-400 hover:text-amber-300">{item}</button>)}</div></div>;
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
    <motion.button onClick={open} whileHover={{ y: -6, scale: 1.01 }} className="glow-card rounded-3xl border border-white/10 bg-gradient-to-br from-white/[.07] to-white/[.03] p-6 text-left shadow-2xl shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <GlowIcon><FolderOpen /></GlowIcon>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">{project.type}</span>
      </div>
      <h4 className="text-2xl font-black text-white">{project.name}</h4>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin size={15} /> {project.address}</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <MiniMetric label="ARV" value={formatMoney(project.arv)} />
        <MiniMetric label="Profit" value={formatMoney(project.profit)} green />
        <MiniMetric label="ROI" value={`${roi.toFixed(1)}%`} />
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
    <div className="space-y-7">
      <GlassPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-amber-300">{t.activeProject}</p>
            <h2 className="mt-2 text-4xl font-black text-white">Silva Construction</h2>
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
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visibleTools.map(([id, title, desc, Icon, badge], index) => (
        <motion.button key={id} whileHover={{ y: -7, scale: 1.015 }} onClick={() => setActiveTool(id)} className={`glow-card group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${toolGradient(index)} p-6 text-left shadow-2xl shadow-black/20`}>
          <div className="absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-white/10 blur-2xl transition group-hover:bg-amber-400/20" />
          <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
            <GlowIcon><Icon /></GlowIcon>
            <div className="flex items-center gap-2">
              <Tooltip text={desc} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-amber-300">{badge}</span>
            </div>
          </div>
          <h4 className="relative z-10 text-xl font-black text-white">{title}</h4>
          <p className="relative z-10 mt-2 text-sm leading-6 text-slate-400">{desc}</p>
          <div className="relative z-10 mt-6 flex items-center gap-2 font-black text-amber-300">Open tool <ChevronRight size={18} className="transition group-hover:translate-x-1" /></div>
        </motion.button>
      ))}
    </div>
  );
}

function ToolModal({ t, language, toolId, onClose }) {
  const tool = getTools(language).find(([id]) => id === toolId) || getTools(language)[0];
  const [, title, desc, Icon] = tool;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#080d1f] p-6 shadow-2xl shadow-black">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <GlowIcon><Icon /></GlowIcon>
            <div>
              <h2 className="text-3xl font-black text-white">{title}</h2>
              <p className="mt-1 text-slate-400">{desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-white/10 p-3 text-slate-300 hover:border-amber-400/50 hover:text-white"><X /></button>
        </div>
        <ToolBody t={t} language={language} toolId={toolId} />
      </motion.div>
    </div>
  );
}

function ToolBody({ t, language, toolId }) {
  if (toolId === "wizard") return <ConstructionWizard language={language} />;
  if (toolId === "underwriter") return <DealUnderwriter language={language} />;
  if (toolId === "loan" || toolId === "loanCalcs") return <InvestmentLoanCalculator language={language} />;
  if (toolId === "todo") return <Checklist items={language === "es" ? ["Ordenar armaduras", "Confirmar inspección de cimentación", "Recopilar tres ofertas de HVAC", "Programar cuadrilla de drywall"] : ["Order trusses", "Confirm foundation inspection", "Collect three HVAC bids", "Schedule drywall crew"]} language={language} />;
  if (toolId === "punch") return <PunchListApp />;
  if (toolId === "takeoff") return <AITakeoff language={language} />;
  if (toolId === "subs") return <SubsQuotes language={language} />;
  if (toolId === "progress") return <ConstructionProgress language={language} />;
  if (toolId === "linked") return <LinkedItems language={language} />;
  if (toolId === "collab") return <Collaborators language={language} />;
  return <AIAssistant t={t} large />;
}

function ConstructionWizard() {
  const [step, setStep] = useState(1);
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
    `Exterior siding: ${Object.entries(siding).filter(([, v]) => cleanNumber(v) > 0).map(([k, v]) => `${k} ${v}%`).join(", ") || "Not assigned"}`,
    `Roof: ${answers.roof}`,
    `Site: ${answers.lot}, driveway: ${answers.driveway}`,
    `Utilities: ${answers.water}, ${answers.sewer}, ${answers.heating}`,
    `Bathrooms/extras: ${answers.bathrooms}, patio: ${answers.patio}, landscaping: ${answers.landscaping}`,
    `Permits: ${answers.permit}, square footage: ${formatNumber(answers.sqft, 0)} sqft`,
  ];

  return (
    <div className="space-y-6">
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
          <p className="text-3xl font-black text-amber-300">{progress}%</p>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-purple-400 to-amber-300 shadow-[0_0_24px_rgba(34,211,238,.35)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 1 && <WizardStep title="Foundation Type" detail="Select the type of foundation for your project"><OptionGrid options={[["Slab (Losa)", "Concrete poured directly on ground level"], ["Basement (Sótano)", "Full basement below ground level"], ["Crawlspace (Espacio de Acceso)", "Elevated foundation with access space"]]} value={answers.foundation} onChange={(value) => update("foundation", value)} /></WizardStep>}
      {step === 2 && <WizardStep title="Finish Level" detail="Select the quality level of finishes"><OptionGrid options={[["Basic", "Standard finishes, cost-effective"], ["Semi-Luxury", "Upgraded finishes, mid-range quality"], ["Luxury", "High-end finishes, premium quality"]]} value={answers.finish} onChange={(value) => update("finish", value)} /></WizardStep>}
      {step === 3 && <WizardStep title="Building Structure" detail="Configure the structure type, building size and garage"><WizardGroup title="Structure Type"><OptionGrid compact options={[["Wood Framing", "Traditional wood stud framing"], ["Concrete Block", "CMU / concrete block walls"]]} value={answers.structure} onChange={(value) => update("structure", value)} /></WizardGroup><WizardGroup title="Number of Stories"><OptionGrid compact options={[["1 Story", "Single-level home"], ["2 Stories", "Two-level home"], ["3+ Stories", "Three or more levels"]]} value={answers.stories} onChange={(value) => update("stories", value)} /></WizardGroup><WizardGroup title="Garage Size"><Segmented options={["No Garage", "1-Car Garage", "2-Car Garage", "3-Car Garage"]} value={answers.garage} onChange={(value) => update("garage", value)} /></WizardGroup></WizardStep>}
      {step === 4 && <WizardStep title="Exterior Siding" detail="Select one or more siding materials and set the % of each"><div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-4"><span className="font-black text-white">Total: {sidingTotal}%</span><span className={sidingTotal === 100 ? "font-black text-emerald-300" : "font-black text-amber-300"}>{sidingTotal === 100 ? "Ready" : "Adjust to 100%"}</span></div><div className="grid gap-3 md:grid-cols-2">{Object.entries(siding).map(([name, pct]) => <div key={name} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-white">{name}</p><p className="text-sm text-slate-400">{sidingDescription(name)}</p></div><input value={pct} onChange={(e) => setSidingPct(name, e.target.value)} className="w-20 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-right font-black text-white outline-none focus:border-cyan-300" />%</div></div>)}</div></WizardStep>}
      {step === 5 && <WizardStep title="Roof Type" detail="Select the roofing material"><Segmented options={["Asphalt Shingles", "Metal Roof", "Tile Roof"]} value={answers.roof} onChange={(value) => update("roof", value)} /></WizardStep>}
      {step === 6 && <WizardStep title="Site Conditions" detail="Describe your lot and driveway preferences"><WizardGroup title="Lot Condition"><OptionGrid options={[["Flat Lot", "Level ground, minimal grading needed"], ["Sloped Lot", "Requires grading and retaining walls"], ["Heavily Wooded", "Tree removal and clearing needed"], ["Requires Fill", "Low area requiring fill dirt"]]} value={answers.lot} onChange={(value) => update("lot", value)} /></WizardGroup><WizardGroup title="Driveway Type"><Segmented options={["No Driveway", "Gravel", "Asphalt", "Concrete", "Pavers"]} value={answers.driveway} onChange={(value) => update("driveway", value)} /></WizardGroup></WizardStep>}
      {step === 7 && <WizardStep title="Utilities & Systems" detail="Configure water source and heating system"><WizardGroup title="Water Source"><OptionGrid compact options={[["City Water", "Municipal water connection"], ["Well Water", "Private well drilling required"]]} value={answers.water} onChange={(value) => update("water", value)} /></WizardGroup><WizardGroup title="Sewer System"><OptionGrid options={[["City Sewer", "Connected to municipal sewer line"], ["Septic System", "Private on-site septic tank and drain field"], ["Engineered Septic System", "Engineered system for challenging soils (mound, drip, etc.)"]]} value={answers.sewer} onChange={(value) => update("sewer", value)} /></WizardGroup><WizardGroup title="Heating System"><OptionGrid options={[["Forced Air", "Standard HVAC system"], ["Radiant Floor", "In-floor heating system"], ["Heat Pump", "Energy-efficient heating and cooling"]]} value={answers.heating} onChange={(value) => update("heating", value)} /></WizardGroup></WizardStep>}
      {step === 8 && <WizardStep title="Bathrooms & Extras" detail="Configure bathroom count and outdoor living"><WizardGroup title="Number of Bathrooms"><Segmented options={["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4+ Bathrooms"]} value={answers.bathrooms} onChange={(value) => update("bathrooms", value)} /></WizardGroup><WizardGroup title="Deck/Patio Size"><Segmented options={["None", "Small (up to 200 sq ft)", "Medium (200-400 sq ft)", "Large (400+ sq ft)"]} value={answers.patio} onChange={(value) => update("patio", value)} /></WizardGroup><WizardGroup title="Landscaping Area Size"><Segmented options={["None", "Small (up to 1/4 acre)", "Medium (1/4-1/2 acre)", "Large (1/2+ acre)"]} value={answers.landscaping} onChange={(value) => update("landscaping", value)} /></WizardGroup></WizardStep>}
      {step === 9 && <WizardStep title="Permits & Regulations" detail="Indicate any special permit requirements"><WizardGroup title="Permit Complexity"><OptionGrid options={[["Standard Permits", "Regular building permits"], ["Historic District", "Additional historic preservation review"], ["Wetlands/Environmental", "Environmental impact studies required"], ["HOA Approval", "Homeowners association review needed"]]} value={answers.permit} onChange={(value) => update("permit", value)} /></WizardGroup><WizardGroup title="Additional Options"><div className="grid gap-3 md:grid-cols-3">{[["fireplace", "Fireplace"], ["gas", "Gas Lines"], ["carpet", "Carpet in Bedrooms"]].map(([key, label]) => <button key={key} onClick={() => update(key, !answers[key])} className={`rounded-2xl border p-4 text-left font-black transition ${answers[key] ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-cyan-300/30"}`}>{label}</button>)}</div></WizardGroup><NumberInput label="Square Footage" value={answers.sqft} setValue={(value) => update("sqft", value)} /></WizardStep>}

      <div className="flex flex-wrap justify-between gap-3">
        <button onClick={() => setStep(Math.max(1, step - 1))} className="secondary-button" disabled={step === 1}>Previous</button>
        {step < 9 ? <button onClick={() => setStep(Math.min(9, step + 1))} className="primary-button">Next</button> : <button onClick={() => setStep(9)} className="primary-button">Generate Checklist</button>}
      </div>

      {step === 9 && <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5"><h4 className="text-2xl font-black text-white">Generated Construction Checklist</h4><div className="mt-4 grid gap-3">{checklist.map((item, index) => <Step key={item} done={index < 4} label={item} detail="Add scope, budget, permit notes, owner approval, and draw schedule before kickoff." />)}</div></div>}
    </div>
  );
}

function WizardStep({ title, detail, children }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5"><h4 className="text-2xl font-black text-white">{title}</h4><p className="mt-2 text-slate-400">{detail}</p><div className="mt-5 space-y-5">{children}</div></div>;
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

function DealUnderwriter() {
  const [purchase, setPurchase] = useState(190000);
  const [rehab, setRehab] = useState(45000);
  const [arv, setArv] = useState(295000);
  const [costs, setCosts] = useState(31700);
  const total = cleanNumber(purchase) + cleanNumber(rehab) + cleanNumber(costs);
  const profit = cleanNumber(arv) - total;
  const roi = formulas.roi(profit, total);
  const noi = 2800 * 12 - 8500;
  const debt = formulas.monthlyMortgage(cleanNumber(purchase) * 0.8, 7.25, 30) * 12;
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="grid gap-4 md:grid-cols-2"><MoneyInput label="Purchase Price" value={purchase} setValue={setPurchase} /><MoneyInput label="Rehab Budget" value={rehab} setValue={setRehab} /><MoneyInput label="ARV" value={arv} setValue={setArv} /><MoneyInput label="Closing / Holding / Selling" value={costs} setValue={setCosts} /></div><ResultBox items={[["Total Cost", formatMoney(total)], ["Profit", formatMoney(profit), profit > 0], ["ROI", `${roi.toFixed(1)}%`, roi > 15], ["70% Max Offer", formatMoney(cleanNumber(arv) * 0.7 - cleanNumber(rehab)), true], ["Cap Rate", `${formulas.capRate(noi, cleanNumber(purchase)).toFixed(2)}%`], ["DSCR", formulas.dscr(noi, debt).toFixed(2), formulas.dscr(noi, debt) >= 1.2], ["Cash-on-Cash", `${formulas.cashOnCash(noi - debt, total * 0.25).toFixed(2)}%`]]} /></div>;
}

function InvestmentLoanCalculator() {
  const [price, setPrice] = useState(300000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(7.25);
  const [years, setYears] = useState(30);
  const [rent, setRent] = useState(2800);
  const [expenses, setExpenses] = useState(650);
  const loan = cleanNumber(price) * (1 - cleanNumber(down) / 100);
  const payment = formulas.monthlyMortgage(loan, cleanNumber(rate), cleanNumber(years));
  const noi = (cleanNumber(rent) - cleanNumber(expenses)) * 12;
  const dscr = payment ? noi / (payment * 12) : 0;
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="grid gap-4 md:grid-cols-2"><MoneyInput label="Property Price" value={price} setValue={setPrice} /><NumberInput label="Down Payment %" value={down} setValue={setDown} /><NumberInput label="Interest Rate %" value={rate} setValue={setRate} /><NumberInput label="Loan Years" value={years} setValue={setYears} /><MoneyInput label="Monthly Rent" value={rent} setValue={setRent} /><MoneyInput label="Monthly Expenses" value={expenses} setValue={setExpenses} /></div><ResultBox items={[["Loan Amount", formatMoney(loan)], ["Monthly Payment", formatMoney(payment), true], ["DSCR", dscr.toFixed(2), dscr >= 1.2], ["Monthly Cash Flow", formatMoney(cleanNumber(rent) - cleanNumber(expenses) - payment), cleanNumber(rent) - cleanNumber(expenses) - payment > 0]]} /></div>;
}

function PropertySearch({ t }) {
  const [address, setAddress] = useState("5500 Grand Lake Dr, San Antonio, TX 78244");
  const [mortgage, setMortgage] = useState(225000);
  const [property, setProperty] = useState(null);
  const [valuation, setValuation] = useState(null);
  const [status, setStatus] = useState(rentcastApiKey ? t.propertyReady : t.rentcastKeyRequired);

  async function search() {
    if (!rentcastApiKey) return setStatus(t.rentcastKeyRequired);
    setStatus(t.searchingRecords);
    const headers = { "X-Api-Key": rentcastApiKey, Accept: "application/json" };
    const encoded = encodeURIComponent(address);
    try {
      const propRes = await fetch(`https://api.rentcast.io/v1/properties?address=${encoded}&limit=1`, { headers });
      if (!propRes.ok) throw new Error(`Property search failed (${propRes.status})`);
      const propJson = await propRes.json();
      const record = Array.isArray(propJson) ? propJson[0] : propJson;
      setProperty(record);
      const valueRes = await fetch(`https://api.rentcast.io/v1/avm/value?address=${encoded}&compCount=10&lookupSubjectAttributes=true`, { headers });
      if (valueRes.ok) setValuation(await valueRes.json());
      setStatus(t.propertyLoaded);
    } catch (error) {
      setStatus(error.message);
    }
  }

  const comps = asArray(valuation?.comparables || valuation?.comps);
  const compPrices = comps.map((c) => cleanNumber(pick(c.price, c.salePrice, c.soldPrice))).filter(Boolean);
  const estimatedValue = cleanNumber(pick(valuation?.price, valuation?.value, property?.estimatedValue, property?.lastSalePrice));
  const arv = compPrices.length ? formulas.arv(compPrices) : estimatedValue;
  const sqft = cleanNumber(pick(property?.squareFootage, property?.livingArea, property?.features?.squareFootage));
  const salePrice = cleanNumber(pick(property?.lastSalePrice, property?.salePrice));
  const assessed = cleanNumber(pick(property?.taxAssessments?.value, property?.taxAssessment?.value));
  const taxes = cleanNumber(pick(property?.propertyTaxes?.total, property?.taxes?.amount));
  const equity = estimatedValue - cleanNumber(mortgage);
  const ppsf = sqft ? salePrice / sqft : 0;
  const taxRate = assessed ? (taxes / assessed) * 100 : 0;

  return (
    <div className="space-y-6">
      <GlassPanel>
        <h2 className="text-3xl font-black text-white">RentCast {t.propertySearch}</h2>
        <p className="mt-2 text-slate-400">{t.propertySearchDetail || "Search property records, comps, owner information, taxes, sale history, features, coordinates, and investor math."}</p>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_260px_160px]">
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="field" />
          <MoneyInput label={t.mortgageBalance} value={mortgage} setValue={setMortgage} />
          <button onClick={search} className="primary-button self-end">{t.search}</button>
        </div>
        <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-400">{status}</p>
      </GlassPanel>
      {property && (
        <>
          <div className="grid gap-5 md:grid-cols-4">
            <Stat title="ARV" value={formatMoney(arv)} icon={BarChart3} help={t.arvHelp || "Average comparable sale price when comps are available."} />
            <Stat title={t.equity || "Equity"} value={formatMoney(equity)} icon={WalletCards} help={t.equityHelp || "Estimated value minus mortgage balance."} />
            <Stat title={t.pricePerSqft || "Price / Sqft"} value={formatMoney(ppsf)} icon={Calculator} help={t.pricePerSqftHelp || "Sale price divided by square footage."} />
            <Stat title={t.taxRate || "Tax Rate"} value={`${taxRate.toFixed(2)}%`} icon={FileText} help={t.taxRateHelp || "Yearly taxes divided by assessed value."} />
          </div>
          <GlassPanel>
            <SectionHeader title={t.propertySummary} detail={pick(property.formattedAddress, property.addressLine1, address)} />
            <div className="grid gap-4 md:grid-cols-3">
              <MiniMetric label={t.owner} value={pick(property.ownerName, property.ownerNames, property.owner?.names, t.availableAfterSearch)} />
              <MiniMetric label={t.bedsBaths} value={`${pick(property.bedrooms, property.beds, "-")} / ${pick(property.bathrooms, property.baths, "-")}`} />
              <MiniMetric label={t.squareFeet} value={sqft ? formatNumber(sqft, 0) : t.unavailable} />
              <MiniMetric label={t.lotSize} value={pick(property.lotSize, property.lotSizeSquareFeet, t.unavailable)} />
              <MiniMetric label={t.yearBuilt} value={pick(property.yearBuilt, t.unavailable)} />
              <MiniMetric label={t.lastSale} value={`${formatMoney(salePrice)} ${pick(property.lastSaleDate, "")}`} />
              <MiniMetric label={t.coordinates} value={`${pick(property.latitude, property.location?.latitude, "-")}, ${pick(property.longitude, property.location?.longitude, "-")}`} />
              <MiniMetric label={t.assessments} value={assessed ? formatMoney(assessed) : t.unavailable} />
              <MiniMetric label={t.propertyTaxes} value={taxes ? formatMoney(taxes) : t.unavailable} />
            </div>
          </GlassPanel>
        </>
      )}
    </div>
  );
}

function AITakeoff() {
  const [sqft, setSqft] = useState(510);
  const [drywallPrice, setDrywallPrice] = useState(14);
  const [flooringPrice, setFlooringPrice] = useState(3.25);
  const [baseboardPrice, setBaseboardPrice] = useState(1.85);
  const [outletPrice, setOutletPrice] = useState(4.5);
  const [fileName, setFileName] = useState("");
  const reportRef = useRef(null);
  const drywall = Math.ceil((cleanNumber(sqft) / 32) * 1.1);
  const flooring = Math.ceil(cleanNumber(sqft) * 1.08);
  const baseboard = Math.ceil(Math.sqrt(cleanNumber(sqft)) * 3.2 * 1.1);
  const outlets = 32;
  const total = drywall * cleanNumber(drywallPrice) + flooring * cleanNumber(flooringPrice) + baseboard * cleanNumber(baseboardPrice) + outlets * cleanNumber(outletPrice);

  async function exportPdf() {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save("operitron-takeoff-report.pdf");
  }

  return (
    <ToolShell title="AI Material Takeoff" subtitle="Upload plans, enter dimensions and unit prices, then export a polished material takeoff report.">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-amber-400/40 bg-amber-400/5 p-6 text-center hover:bg-amber-400/10">
            <Upload className="text-amber-300" />
            <span className="mt-3 font-black text-white">{fileName || "Upload blueprint PDF or file"}</span>
            <span className="mt-1 text-sm text-slate-400">PDF, plan image, or quote document</span>
            <input type="file" className="hidden" accept=".pdf,image/*" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput label="Measured Floor Area (sq ft)" value={sqft} setValue={setSqft} />
            <MoneyInput label="Drywall Sheet Price" value={drywallPrice} setValue={setDrywallPrice} />
            <MoneyInput label="Flooring Price / Sq Ft" value={flooringPrice} setValue={setFlooringPrice} />
            <MoneyInput label="Baseboard Price / Lin Ft" value={baseboardPrice} setValue={setBaseboardPrice} />
            <MoneyInput label="Outlet Unit Price" value={outletPrice} setValue={setOutletPrice} />
          </div>
          <button onClick={exportPdf} className="primary-button">Export Professional Takeoff PDF</button>
        </div>
        <ResultBox items={[["Drywall 4x8 Sheets", `${drywall} sheets +10% waste`, true], ["LVP Flooring", `${flooring} sq ft +8% waste`, true], ["Electrical Outlets", `${outlets} pcs +0% waste`], ["Baseboard Trim", `${baseboard} lin ft +10% waste`, true], ["Estimated Material Cost", formatMoney(total), true]]} />
      </div>
      <div ref={reportRef} className="fixed -left-[9999px] top-0 w-[794px] bg-white p-10 text-slate-950">
        <div className="flex justify-between border-b border-slate-300 pb-5"><h1 className="text-3xl font-black">Takeoff Report</h1><p>Apr 12, 2026</p></div>
        {[["Drywall 4x8 Sheets", `${drywall} sheets`, "+10% waste"], ["LVP Flooring", `${flooring} sq ft`, "+8% waste"], ["Electrical Outlets", `${outlets} pcs`, "+0% waste"], ["Baseboard Trim", `${baseboard} lin ft`, "+10% waste"]].map(([label, qty, waste]) => <div key={label} className="flex justify-between border-b border-slate-200 py-4"><span className="font-bold">{label}</span><span>{qty}<br /><small>{waste}</small></span></div>)}
        <div className="flex justify-between pt-5 font-black"><span>Total Items</span><span>4 categories</span></div>
        <p className="mt-8 text-sm text-slate-500">Generated by Operitron</p>
      </div>
    </ToolShell>
  );
}

function Checklist({ title, items }) {
  return <div className="space-y-3">{items.map((item, index) => <Step key={item} done={index === 1} label={item} detail={index % 2 ? "High priority · Due this week" : "Assigned to project team"} />)}</div>;
}

function PunchListApp() {
  const [items, setItems] = useState([
    { title: "Leaking Kitchen Sink", trade: "Plumbing", location: "Unit B", status: "Open", color: "red", done: false },
    { title: "Non-Functional Lighting", trade: "Electrical", location: "Hallway 2F", status: "Open", color: "yellow", done: false },
    { title: "Drywall Patch - Master BR", trade: "Drywall", location: "Master Bedroom", status: "Resolved", color: "green", done: true },
  ]);
  const reportRef = useRef(null);
  const toggle = (index) => setItems(items.map((item, i) => i === index ? { ...item, done: !item.done, status: item.done ? "Open" : "Resolved", color: item.done ? "yellow" : "green" } : item));
  const tradeCounts = items.reduce((acc, item) => ({ ...acc, [item.trade]: (acc[item.trade] || 0) + 1 }), {});
  async function exportPdf() {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save("operitron-punch-list-report.pdf");
  }
  return (
    <ToolShell title="Construction Punch List App" subtitle="Close out projects faster with mobile-first issue tracking, photos, voice input, trade assignments, and PDF reports.">
      <div className="grid gap-7 xl:grid-cols-[390px_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-4 shadow-2xl">
          <div className="rounded-[1.6rem] bg-[#0b1225] p-4">
            <div className="mb-4 flex items-center justify-between"><p className="font-black text-white">Punch List</p><p className="rounded-full bg-red-400/20 px-3 py-1 text-xs font-black text-red-300">{items.filter((i) => !i.done).length} open</p></div>
            <div className="space-y-3">{items.map((item, index) => <button key={item.title} onClick={() => toggle(index)} className={`w-full rounded-2xl border p-4 text-left ${item.color === "red" ? "border-red-400/30 bg-red-400/10" : item.color === "yellow" ? "border-amber-400/30 bg-amber-400/10" : "border-emerald-400/30 bg-emerald-400/10 opacity-75"}`}><div className="flex gap-3"><span className={`mt-1 grid h-5 w-5 place-items-center rounded border ${item.done ? "border-emerald-300 bg-emerald-400 text-slate-950" : "border-white/30"}`}>{item.done ? "✓" : ""}</span><div><p className={`font-black text-white ${item.done ? "line-through" : ""}`}>{item.title}</p><p className="text-sm text-slate-400">{item.trade} · {item.location}</p><div className="mt-3 flex gap-2"><span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400"><Camera size={14} /></span><span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400">+3 photos</span></div></div></div></button>)}</div>
            <div className="mt-5 flex justify-between border-t border-white/10 pt-4 text-slate-400"><Phone /><button className="grid h-12 w-12 place-items-center rounded-full bg-amber-400 text-slate-950"><Plus /></button><Camera /></div>
          </div>
        </div>
        <div className="space-y-5">
          <ResultBox items={[["Mobile-first walkthrough", "Voice + photo capture", true], ["One-click PDF export", "Ready"], ["Real-time team sync", "Coming Soon"], ["Open items", items.filter((i) => !i.done).length]]} />
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><div className="flex items-center gap-3 text-amber-300"><Mic /><p className="font-black">Voice transcription</p></div><p className="mt-3 text-slate-300">“Leaking pipe under kitchen sink, Unit 4B, assigned to plumbing.”</p><ul className="mt-4 space-y-2 text-sm text-slate-400"><li>✓ Hands-free voice logging</li><li>✓ Unlimited photo attachments per item</li><li>✓ Auto-categorized by trade, priority, and location</li></ul></div>
          <div className="grid gap-3 md:grid-cols-4">{Object.entries(tradeCounts).map(([trade, count]) => <MiniMetric key={trade} label={trade} value={`${count} items`} />)}</div>
          <button onClick={exportPdf} className="primary-button">Export Professional PDF Punch List Report</button>
        </div>
      </div>
      <div ref={reportRef} className="fixed -left-[9999px] top-0 w-[794px] bg-white p-10 text-slate-950"><div className="flex justify-between border-b border-slate-300 pb-5"><h1 className="text-3xl font-black">Punch List Report</h1><p>Apr 12, 2026</p></div>{items.map((item) => <div key={item.title} className="flex justify-between border-b border-slate-200 py-4"><span><strong>{item.title}</strong><br />{item.trade}</span><span>{item.status}</span></div>)}<p className="mt-8 text-sm text-slate-500">Generated by Operitron</p></div>
    </ToolShell>
  );
}

function ConstructionProgress() {
  return <ResultBox items={[["Overall Progress", "38%", true], ["Current Phase", "Framing"], ["Next Inspection", "MEP rough-in"], ["Schedule Risk", "Medium"]]} />;
}

function SubsQuotes({ language }) {
  const label = language === "es"
    ? { review: "Revisar Cotización", trade: "Oficio", vendor: "Proveedor", bid: "Monto de Oferta", scope: "Alcance", status: "Estado", quoteStatus: "Estado de cotización", pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada", total: "Total de Ofertas", contingency: "Contingencia 10%", budget: "Presupuesto con Contingencia", selected: "Oferta Seleccionada" }
    : { review: "Review Quote", trade: "Trade", vendor: "Vendor", bid: "Bid Amount", scope: "Scope", status: "Status", quoteStatus: "Quote status", pending: "Pending", approved: "Approved", rejected: "Rejected", total: "Bid Total", contingency: "10% Contingency", budget: "Budget With Contingency", selected: "Selected Bid" };
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
  return <div className="grid gap-5 xl:grid-cols-[1fr_390px]"><div className="space-y-3">{quotes.map((item, index) => <button key={item.trade} onClick={() => setActive(index)} className={`glow-card flex w-full items-center justify-between rounded-3xl border p-5 text-left transition ${active === index ? "border-amber-400/50 bg-amber-400/10" : "border-white/10 bg-slate-950/60 hover:border-amber-400/30"}`}><div><p className="font-black text-white">{item.trade}</p><p className="text-sm text-slate-500">{item.vendor} · {label.quoteStatus}: {item.status}</p></div><p className="text-xl font-black text-amber-300">{formatMoney(item.price)}</p></button>)}</div><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><h3 className="text-xl font-black text-white">{label.review}</h3><div className="mt-4 space-y-3"><label className="block"><span className="label">{label.trade}</span><input className="field" value={quote.trade} onChange={(e) => updateQuote("trade", e.target.value)} /></label><label className="block"><span className="label">{label.vendor}</span><input className="field" value={quote.vendor} onChange={(e) => updateQuote("vendor", e.target.value)} /></label><MoneyInput label={label.bid} value={quote.price} setValue={(value) => updateQuote("price", value)} /><label className="block"><span className="label">{label.scope}</span><textarea className="field min-h-24" value={quote.scope} onChange={(e) => updateQuote("scope", e.target.value)} /></label><label className="block"><span className="label">{label.status}</span><select className="field" value={quote.status} onChange={(e) => updateQuote("status", e.target.value)}><option>{label.pending}</option><option>Review</option><option>{label.approved}</option><option>{label.rejected}</option></select></label></div><ResultBox items={[[label.total, formatMoney(total), true], [label.contingency, formatMoney(total * 0.1)], [label.budget, formatMoney(total * 1.1), true], [label.selected, formatMoney(quote.price)]]} /></div></div>;
}

function LinkedItems({ language }) {
  const ui = language === "es" ? { linked: "Registro Vinculado", review: "Revisión de Inversionista", linkedText: "Adjunta documentos, cálculos, contactos o notas del proyecto para mantener el espacio organizado.", reviewText: "Usa elementos vinculados para preparar paquetes para prestamistas, actualizaciones de inversionistas o revisiones de alcance.", attach: "Adjuntar Elemento" } : { linked: "Linked Record", review: "Investor Review", linkedText: "Attach documents, calculations, contacts, or project notes to keep the workspace organized.", reviewText: "Use linked items when preparing a lender packet, investor update, or contractor scope review.", attach: "Attach Item" };
  const items = [["Reports", "CMA PDF, lender summary, takeoff report", FileText], ["Comps", "Comparable sales, ARV range, price per sqft", Search], ["Quotes", "Subcontractor bids and awarded scopes", Users], ["Permits", "Permit numbers, inspection milestones, notes", ClipboardCheck], ["Dropbox Files", "Plans, photos, contracts, draw packets", Cloud], ["Loan Docs", "Term sheets, DSCR assumptions, payoff letters", WalletCards]];
  const [active, setActive] = useState(items[0]);
  const Icon = active[2];
  return <div className="grid gap-5 xl:grid-cols-[1fr_380px]"><div className="grid gap-4 md:grid-cols-2">{items.map(([title, detail, CardIcon]) => <button key={title} onClick={() => setActive([title, detail, CardIcon])} className="glow-card rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-left hover:border-amber-400/40"><CardIcon className="text-amber-300" /><p className="mt-4 font-black text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p></button>)}</div><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><Icon className="text-amber-300" /><h3 className="mt-4 text-2xl font-black text-white">{active[0]}</h3><p className="mt-2 leading-7 text-slate-400">{active[1]}</p><div className="mt-5 space-y-3"><Info title={ui.linked} text={ui.linkedText} /><Info title={ui.review} text={ui.reviewText} /></div><button className="primary-button mt-5">{ui.attach}</button></div></div>;
}

function Collaborators({ language }) {
  const ui = language === "es" ? { invite: "Invitar Colaborador", text: "Invita socios, prestamistas, contratistas o gerentes de proyecto con un rol claro.", owner: "Propietario", manager: "Gerente de Proyecto", finance: "Finanzas", construction: "Construcción", viewer: "Solo Lectura" } : { invite: "Invite Collaborator", text: "Invite partners, lenders, contractors, or project managers with a clear role.", owner: "Owner", manager: "Project Manager", finance: "Finance", construction: "Construction", viewer: "Viewer" };
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Project Manager");
  const [people, setPeople] = useState([{ name: "Brandon", email: "brandon@operitron.com", role: "Owner" }, { name: "Maria", email: "maria@buildteam.com", role: "Project Manager" }, { name: "Lender Team", email: "lender@capital.com", role: "Finance" }, { name: "GC", email: "gc@construction.com", role: "Construction" }]);
  const invite = () => { if (!email.trim()) return; setPeople([{ name: email.split("@")[0], email, role }, ...people]); setEmail(""); };
  return <div className="grid gap-5 xl:grid-cols-[390px_1fr]"><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><h3 className="text-xl font-black text-white">{ui.invite}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{ui.text}</p><input className="field mt-5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" /><select className="field mt-3" value={role} onChange={(e) => setRole(e.target.value)}><option>{ui.owner}</option><option>{ui.manager}</option><option>{ui.finance}</option><option>{ui.construction}</option><option>{ui.viewer}</option></select><button onClick={invite} className="primary-button mt-4 w-full">{ui.invite}</button></div><div className="grid gap-4 md:grid-cols-2">{people.map((person) => <div key={person.email} className="glow-card rounded-3xl border border-white/10 bg-slate-950/60 p-5"><Users className="text-amber-300" /><p className="mt-4 text-lg font-black text-white">{person.name}</p><p className="text-sm text-slate-400">{person.email}</p><p className="mt-3 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-300">{person.role}</p></div>)}</div></div>;
}

function DropboxPage({ t }) {
  return <GlassPanel><SectionHeader title="Dropbox" detail={t.dropboxDetail || "Connect plans, permits, draw requests, quotes, photos, and closeout packets."} /><div className="grid gap-4 md:grid-cols-3"><MiniMetric label={t.connection || "Connection"} value={t.comingSoon} /><MiniMetric label={t.folders || "Folders"} value="Plans / Quotes / Reports" /><MiniMetric label={t.sync || "Sync"} value={t.manualUpload || "Manual upload available"} /></div><button className="primary-button mt-6 flex items-center gap-2"><Cloud size={18} /> {t.connectDropbox}</button></GlassPanel>;
}

function Tours({ t, language }) {
  const titles = language === "es" ? ["Analiza un flip en 5 minutos", "Configura un proyecto de construcción", "Exporta tu primer reporte para inversionistas"] : ["Analyze a flip in 5 minutes", "Set up a construction project", "Export your first investor report"];
  return <div className="grid gap-5 md:grid-cols-3">{titles.map((title, index) => <GlassPanel key={title}><PlayCircle className="text-amber-300" /><p className="mt-5 text-xl font-black text-white">{title}</p><p className="mt-2 text-slate-400">{language === "es" ? `Recorrido guiado ${index + 1} con pasos prácticos y puntos de control.` : `Guided tour ${index + 1} with practical steps and checkpoints.`}</p><button className="secondary-button mt-5">{t.startTour}</button></GlassPanel>)}</div>;
}

function Tutorials({ language }) {
  const titles = language === "es" ? ["Configuración del Analizador de Deals", "Búsqueda de propiedades con RentCast", "Recorrido de calculadora de préstamos", "Flujo de cálculo de materiales", "Cierre de punch list", "Organización de documentos en Dropbox"] : ["Deal Underwriter setup", "RentCast property search", "Loan calculator walkthrough", "Material takeoff workflow", "Punch list closeout", "Dropbox document organization"];
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{titles.map((title) => <GlassPanel key={title}><Upload className="text-cyan-300" /><p className="mt-5 text-xl font-black text-white">{title}</p><p className="mt-2 text-slate-400">{language === "es" ? "Tutorial paso a paso para crear flujos de trabajo más fuertes." : "Step-by-step tutorial for building stronger workflows."}</p></GlassPanel>)}</div>;
}

function LearningCenter({ t, language, go }) {
  const articles = language === "es"
    ? [["Análisis de Deals", "7 min", "Cómo Analizar un Deal Inmobiliario Más Rápido"], ["Financiamiento", "8 min", "DSCR vs BRRR: Lo Que Deben Saber los Inversionistas"], ["Análisis de Deals", "12 min", "Guía Completa de Análisis de Deals Inmobiliarios"], ["Construcción", "9 min", "Cómo Estimar Costos de Construcción Desde Planos"], ["Financiamiento", "14 min", "Estrategias DSCR y BRRR para Inversionistas"], ["Takeoffs", "6 min", "Errores Comunes de Takeoff que Dañan tu Ganancia"], ["Construcción", "11 min", "Presupuestos y Estimaciones de Construcción"], ["Gestión de Proyecto", "8 min", "Qué Rastrear Durante una Construcción Desde Cero"], ["Takeoffs", "10 min", "Takeoffs de Construcción y Estimación con Planos"], ["Cierre", "7 min", "Cómo las Punch Lists Reducen Retrasos"], ["Gestión de Proyecto", "13 min", "Gestión de Construcción Desde Cero"], ["Cierre", "9 min", "Punch Lists y Cierre de Construcción"]]
    : learningArticles;
  const [active, setActive] = useState(null);
  if (active) return <div className="space-y-6"><button onClick={() => setActive(null)} className="secondary-button">← {t.back}</button><GlassPanel><p className="text-sm font-black text-amber-300">{active[0]} · {active[1]}</p><h2 className="mt-3 text-4xl font-black text-white">{active[2]}</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><Info title={language === "es" ? "Fórmulas" : "Formulas"} text="ARV, ROI, cap rate, cash-on-cash, DSCR, 70% rule, max offer, mortgage payment, and rent cash flow." /><Info title={language === "es" ? "Proceso" : "Process"} text="Start with fast screening, verify comps, stress-test costs, document assumptions, and export a clean investor packet." /><Info title={language === "es" ? "Checklist" : "Checklist"} text="Comps, scope, permits, financing, insurance, taxes, contractor bids, timeline, exit strategy, and risk buffer." /></div><p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{language === "es" ? "Esta guía convierte el tema en pasos prácticos para operadores. Usa los cálculos de Operitron para revisar números, guardar supuestos, comparar escenarios y preparar decisiones con menos ruido." : "This guide turns the topic into practical operator steps. Use Operitron calculations to review numbers, save assumptions, compare scenarios, and prepare cleaner decisions with less noise."}</p><button onClick={() => go("projectTools")} className="primary-button mt-6">{language === "es" ? "Abrir herramientas" : "Open tools"}</button></GlassPanel></div>;
  return <div className="space-y-7"><GlassPanel><p className="text-sm font-black uppercase tracking-widest text-amber-300">{t.learning}</p><h2 className="mt-2 text-4xl font-black text-white">{language === "es" ? "Guías para Inversionistas y Constructores" : "Guides for Real Estate Investors & Builders"}</h2><p className="mt-3 max-w-3xl text-slate-400">{language === "es" ? "Estrategias prácticas, marcos de trabajo y herramientas para analizar deals, gestionar construcción y operar proyectos rentables." : "Practical strategies, frameworks, and tools for analyzing deals, managing construction, and operating profitable projects."}</p><button onClick={() => go("pricing")} className="primary-button mt-6">{t.startTrial}</button></GlassPanel><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{articles.map((article) => <button key={article[2]} onClick={() => setActive(article)} className="glow-card rounded-[2rem] border border-white/10 bg-white/[.055] p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl hover:border-amber-400/40"><p className="text-sm font-black text-amber-300">{article[0]} · {article[1]}</p><h3 className="mt-3 text-xl font-black text-white">{article[2]}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{language === "es" ? "Una guía práctica para operadores con ejemplos, fórmulas y puntos de control del proyecto." : "A practical operator-focused guide with examples, formulas, and project checkpoints."}</p><span className="mt-5 inline-flex font-black text-amber-300">{t.readGuide} →</span></button>)}</div></div>;
}

function KnowledgeBase({ t, language }) {
  const faqs = language === "es"
    ? [
      ["¿Cómo automatiza la IA los cálculos de materiales a partir de planos?", "La IA puede leer planos subidos, aplicar una escala, convertir mediciones a dimensiones reales y organizar cantidades por categoría con factores de desperdicio configurables."],
      ["¿Cuál es el beneficio del rastreador de construcción por fases?", "Un rastreador por fases ayuda a visualizar dependencias críticas, evitar cuadrillas inactivas y reducir costos de financiamiento causados por retrasos."],
      ["¿Cómo maneja el Analizador de Deals la estrategia BRRR?", "Modela compra, rehabilitación, renta, refinanciamiento, extracción de capital, DSCR y flujo de caja posterior al refinanciamiento."],
      ["¿Cómo mejora la herramienta de punch list el cierre de proyectos?", "Organiza deficiencias por oficio, prioridad, responsable y estado para cerrar pendientes con menos fricción."],
    ]
    : [
      ["How does AI help estimate materials from plans?", "AI-assisted workflows can read uploaded plans, apply scale, convert measurements into real dimensions, and organize quantities by category with configurable waste factors."],
      ["What is the benefit of phase-based construction tracking?", "Phase tracking helps visualize critical dependencies, reduce idle crews, and limit financing costs caused by schedule delays."],
      ["How does the Deal Underwriter handle BRRR strategy?", "It models purchase, rehab, rent, refinance, equity capture, DSCR, and post-refinance cash flow."],
      ["How does the punch list tool improve closeout?", "It organizes deficiencies by trade, priority, owner, and status so final items close with less friction."],
    ];
  return <GlassPanel><h2 className="text-4xl font-black text-white">{t.knowledge}</h2><p className="mt-3 text-slate-400">{language === "es" ? `Respuestas detalladas sobre cómo ${t.brand} potencia cada fase de la inversión inmobiliaria.` : `Detailed answers about how ${t.brand} supports each phase of real estate investing.`}</p><div className="mt-8 space-y-4">{faqs.map(([q, a]) => <details key={q} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><summary className="cursor-pointer text-lg font-black text-white">{q}</summary><p className="mt-4 leading-7 text-slate-300">{a}</p></details>)}</div></GlassPanel>;
}

function PricingPlans({ language }) {
  const isEs = language === "es";
  const monthlyFeatures = isEs
    ? ["Proyectos y deals ilimitados", "Analizador de deals y fix-and-flip", "Calculadoras DSCR, BRRR y cash-out", "Rastreador de construcción", "Takeoff de materiales con IA", "Punch list", "Gestión de subcontratistas y ofertas", "Compartir proyectos y colaborar", "Asistente IA en cada herramienta"]
    : ["Unlimited projects & deals", "Deal & Fix-and-Flip underwriter", "DSCR, BRRR & Cash-Out calculators", "Construction tracker", "AI material takeoff", "Punch list", "Subcontractor & bid management", "Project sharing & collaboration", "AI assistant on every tool"];
  const annualFeatures = isEs
    ? ["Todo lo incluido en Monthly", "Soporte prioritario", "Acceso anticipado a funciones nuevas", "Historial de datos extendido"]
    : ["Everything in Monthly", "Priority support", "Early access to new features", "Extended data history"];
  const plans = [
    { name: "Monthly", price: "$29.99", cadence: isEs ? "/mes" : "/month", note: isEs ? "Prueba gratis de 3 días" : "3-day free trial", detail: isEs ? "Acceso flexible mes a mes." : "Flexible month-to-month access.", features: monthlyFeatures },
    { name: "Annual", price: "$249.99", cadence: isEs ? "/año" : "/year", note: isEs ? "Ahorra más de 30% · Prueba gratis de 3 días" : "Save over 30% · 3-day free trial", detail: isEs ? "El mejor valor para operadores activos." : "Best value for active operators.", features: annualFeatures, featured: true },
  ];
  return <div className="space-y-8"><section className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-widest text-cyan-300">{isEs ? "Precios simples" : "Simple Pricing"}</p><h2 className="mt-3 text-4xl font-black text-white md:text-5xl">{isEs ? "Elige cómo quieres crecer con Operitron" : "Choose how you want to grow with Operitron"}</h2><p className="mt-4 text-lg leading-8 text-slate-400">{isEs ? "Dos planes claros para analizar deals, gestionar construcción y colaborar con tu equipo." : "Two clean plans for analyzing deals, managing construction, and collaborating with your team."}</p></section><div className="grid gap-6 lg:grid-cols-2">{plans.map((plan) => <motion.div key={plan.name} whileHover={{ y: -6 }} className={`relative overflow-hidden rounded-[2rem] border p-7 shadow-2xl backdrop-blur-xl ${plan.featured ? "border-cyan-300/50 bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-white/[.055] shadow-cyan-500/10" : "border-white/10 bg-white/[.055] shadow-black/20"}`}>{plan.featured && <div className="absolute right-5 top-5 rounded-full border border-cyan-300/30 bg-cyan-300 px-4 py-1 text-xs font-black uppercase tracking-widest text-slate-950 shadow-[0_0_30px_rgba(34,211,238,.35)]">{isEs ? "Mejor Valor" : "Best Value"}</div>}<div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" /><div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" /><div className="relative z-10"><p className="text-2xl font-black text-white">{plan.name}</p><p className="mt-2 min-h-12 max-w-md text-slate-400">{plan.detail}</p><div className="mt-6 flex items-end gap-2"><span className={`text-5xl font-black ${plan.featured ? "text-cyan-200" : "text-amber-300"}`}>{plan.price}</span><span className="pb-2 font-bold text-slate-500">{plan.cadence}</span></div><p className="mt-3 font-bold text-emerald-300">{plan.note}</p><button className={`mt-7 w-full rounded-2xl py-4 font-black transition ${plan.featured ? "bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.28)] hover:bg-cyan-200" : "bg-amber-400 text-slate-950 shadow-[0_0_35px_rgba(251,191,36,.22)] hover:bg-amber-300"}`}>{isEs ? "Comenzar" : "Get Started"}</button><ul className="mt-7 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-slate-300"><CheckCircle2 className={plan.featured ? "text-cyan-300" : "text-emerald-400"} size={19} /><span>{feature}</span></li>)}</ul></div></motion.div>)}</div></div>;
}

function Pricing({ t, language }) {
  const plans = language === "es"
    ? [["Starter", "$29", "Inversionistas individuales", ["5 proyectos", "Calculadoras principales", "Reportes PDF", "Prueba gratis de 3 días"]], ["Pro", "$79", "Operadores activos", ["Proyectos ilimitados", "API de propiedades lista", "Reportes con IA", "Underwriting avanzado"]], ["Agency", "$149", "Equipos", ["Colaboradores", "Controles de proyecto", "Soporte prioritario", "Espacio de equipo"]]]
    : [["Starter", "$29", "Solo investors", ["5 projects", "Core calculators", "PDF reports", "3-day free trial"]], ["Pro", "$79", "Active operators", ["Unlimited projects", "Property API ready", "AI reports", "Advanced underwriting"]], ["Agency", "$149", "Teams", ["Collaborators", "Project controls", "Priority support", "Team workspace"]]];
  return <div className="grid gap-6 md:grid-cols-3">{plans.map(([name, price, detail, features], index) => <GlassPanel key={name}><p className="text-xl font-black text-white">{name}</p><p className="text-sm text-slate-400">{detail}</p><p className="mt-5 text-5xl font-black text-amber-300">{price}<span className="text-base text-slate-500">/mo</span></p><ul className="mt-6 space-y-3">{features.map((f) => <li key={f} className="flex gap-2 text-slate-300"><CheckCircle2 className="text-emerald-400" size={18} /> {f}</li>)}</ul><button className={`mt-7 w-full rounded-2xl py-3 font-black ${index === 1 ? "bg-amber-400 text-slate-950" : "border border-white/10 text-white hover:border-amber-400/40"}`}>{t.startTrial}</button></GlassPanel>)}</div>;
}

function SettingsPage({ t, language, user, setUser, go, back }) {
  const isEs = language === "es";
  const [mode, setMode] = useState("register");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(supabase ? t.supabaseReady : t.accountKeyNeeded);
  const ui = isEs
    ? { register: "Registrarse", login: "Iniciar sesión", details: "Crea tu cuenta de Operitron para acceder al dashboard, herramientas y proyectos.", fullName: "Nombre completo", company: "Empresa", phone: "Teléfono", dashboard: "Volver al Dashboard", signOut: "Cerrar sesión", back: "Volver", save: "Crear cuenta" }
    : { register: "Register", login: "Login", details: "Create your Operitron account to access the dashboard, tools, and projects.", fullName: "Full name", company: "Company", phone: "Phone", dashboard: "Go to Dashboard", signOut: "Sign Out", back: "Back", save: "Create Account" };
  async function auth(mode) {
    if (!supabase) {
      setUser({ email: email || "brandon@operitron.com", user_metadata: { name, company, phone } });
      go("dashboard");
      return setStatus(t.profileStarted);
    }
    const result = mode === "signup" ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setStatus(result.error.message);
    else {
      setUser(result.data.user);
      go("dashboard");
      setStatus(mode === "signup" ? t.checkEmail : t.loggedIn);
    }
  }
  function signOut() {
    setUser(null);
    go("dashboard");
  }
  if (user) return <GlassPanel><div className="mb-6"><BrandLogo onClick={() => go("dashboard")} /></div><h2 className="text-3xl font-black text-white">{t.accountSettings}</h2><p className="mt-2 text-slate-400">{user.email}</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => go("dashboard")} className="primary-button">{ui.dashboard}</button><button onClick={signOut} className="secondary-button"><LogOut size={18} /> {ui.signOut}</button></div></GlassPanel>;
  return <GlassPanel><div className="mb-6"><BrandLogo onClick={() => go("dashboard")} /></div><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-3xl font-black text-white">{mode === "register" ? ui.register : ui.login}</h2><p className="mt-2 text-slate-400">{ui.details}</p></div><button onClick={back} className="secondary-button">← {ui.back}</button></div><div className="mt-6 grid gap-3 md:max-w-xl"><div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-1"><button onClick={() => setMode("register")} className={`rounded-xl px-4 py-3 font-black ${mode === "register" ? "bg-amber-400 text-slate-950" : "text-slate-400"}`}>{ui.register}</button><button onClick={() => setMode("login")} className={`rounded-xl px-4 py-3 font-black ${mode === "login" ? "bg-amber-400 text-slate-950" : "text-slate-400"}`}>{ui.login}</button></div>{mode === "register" && <><input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder={ui.fullName} /><input value={company} onChange={(e) => setCompany(e.target.value)} className="field" placeholder={ui.company} /><input value={phone} onChange={(e) => setPhone(e.target.value)} className="field" placeholder={ui.phone} /></>}<input value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder={t.email} /><input value={password} onChange={(e) => setPassword(e.target.value)} className="field" type="password" placeholder={t.password} /><button onClick={() => auth(mode === "register" ? "signup" : "login")} className="primary-button">{mode === "register" ? ui.save : ui.login}</button><p className="text-sm text-slate-400">{status}</p></div></GlassPanel>;
}

function ProfileMini({ t, go }) {
  return <button onClick={() => go("profile")} className="mt-5 flex w-full shrink-0 items-center gap-3 rounded-3xl border border-white/10 bg-white/[.04] p-4 text-left hover:border-cyan-300/40"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-slate-950"><UserCircle /></div><div><p className="font-black text-white">Brandon</p><p className="text-xs font-bold text-slate-500">Agency {t.earlyAccess}</p></div></button>;
}

function ProfilePage({ t, language, user, back }) {
  const [name, setName] = useState("Brandon");
  const [email, setEmail] = useState(user?.email || "brandon@operitron.com");
  const [plan, setPlan] = useState("Agency");
  const [company, setCompany] = useState("Silva Construction");
  const [phone, setPhone] = useState("(850) 555-0198");
  const ui = language === "es" ? { company: "Compañía", phone: "Teléfono", ready: "Perfil listo", saved: "Perfil guardado para esta sesión.", trialEnds: "La prueba termina en 3 días", save: "Guardar Perfil" } : { company: "Company", phone: "Phone", ready: "Profile ready", saved: "Profile saved for this session.", trialEnds: "Trial ends in 3 days", save: "Save Profile" };
  const [status, setStatus] = useState(ui.ready);
  return <div className="space-y-6"><GlassPanel><SectionHeader title={t.profile} detail={t.profileDetail} /><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><div className="grid gap-4 md:grid-cols-2"><label className="block"><span className="label">{t.name}</span><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></label><label className="block"><span className="label">{t.email}</span><input className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="block"><span className="label">{ui.company}</span><input className="field" value={company} onChange={(e) => setCompany(e.target.value)} /></label><label className="block"><span className="label">{ui.phone}</span><input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="block"><span className="label">{t.plan}</span><select className="field" value={plan} onChange={(e) => setPlan(e.target.value)}><option>Starter</option><option>Pro</option><option>Agency</option></select></label><label className="block"><span className="label">{t.language}</span><select className="field" defaultValue="English / Español"><option>English / Español</option><option>English</option><option>Español</option></select></label></div><div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><UserCircle className="text-amber-300" size={42} /><h3 className="mt-4 text-2xl font-black text-white">{name}</h3><p className="text-slate-400">{email}</p><div className="mt-5 grid gap-3"><MiniMetric label={t.plan} value={`${plan} ${t.earlyAccess}`} green /><MiniMetric label={t.trial} value={ui.trialEnds} /><MiniMetric label={t.workspace} value={company} /></div><button onClick={() => setStatus(ui.saved)} className="primary-button mt-5 w-full">{ui.save}</button><p className="mt-3 text-sm text-slate-500">{status}</p></div></div></GlassPanel></div>;
}

function LegalPage({ type, language }) {
  const english = {
    privacy: ["Privacy Policy", "Operitron collects account details, project inputs, property-search queries, and usage data needed to operate the service. Payment processing is handled through Stripe Checkout, and property records may be requested from authorized public or licensed APIs. We do not sell raw project workspaces as advertising profiles."],
    terms: ["Terms of Service", "Operitron is analysis and workflow software for real estate investors and builders. Users are responsible for verifying financial assumptions, construction scopes, property data, legal requirements, and financing terms with qualified professionals before making decisions."],
    disclaimer: ["Disclaimer", "Operitron does not provide legal, tax, appraisal, brokerage, lending, engineering, or construction advice. All valuations, formulas, reports, public data, and AI-style summaries are informational estimates and must be independently verified."],
  };
  const spanish = {
    privacy: ["Política de Privacidad", "Operitron recopila datos de cuenta, entradas de proyectos, búsquedas de propiedad y uso necesario para operar el servicio. Los pagos se procesan mediante Stripe Checkout, y los registros de propiedad pueden solicitarse desde APIs públicas o con licencia. No vendemos espacios de trabajo de proyectos como perfiles publicitarios."],
    terms: ["Términos de Servicio", "Operitron es software de análisis y flujo de trabajo para inversionistas y constructores inmobiliarios. Los usuarios son responsables de verificar supuestos financieros, alcances de construcción, datos de propiedad, requisitos legales y términos de financiamiento con profesionales calificados antes de tomar decisiones."],
    disclaimer: ["Aviso Legal", "Operitron no proporciona asesoría legal, fiscal, de avalúo, corretaje, préstamos, ingeniería o construcción. Todas las valuaciones, fórmulas, reportes, datos públicos y resúmenes estilo IA son estimaciones informativas y deben verificarse de forma independiente."],
  };
  const data = (language === "es" ? spanish : english)[type];
  return <section className="mx-auto max-h-[calc(100vh-9rem)] max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-white/[.055] p-6 leading-8 shadow-2xl shadow-black/20 md:p-10"><h2 className="text-4xl font-black text-white">{data[0]}</h2><p className="mt-6 whitespace-normal break-words text-lg leading-9 text-slate-300">{data[1]}</p><div className="mt-8 grid gap-4 md:grid-cols-2"><Info title={language === "es" ? "Diseño legible" : "Readable layout"} text={language === "es" ? "Esta página usa ancho controlado, buen interlineado, padding y saltos responsivos para móvil." : "This page uses a constrained width, generous line-height, padding, and mobile-friendly wrapping."} /><Info title={language === "es" ? "Texto original" : "Original text"} text={language === "es" ? "Las páginas legales están escritas para Operitron y deben ser revisadas por tu abogado antes del lanzamiento." : "The legal pages are written for Operitron and should be reviewed by your attorney before launch."} /></div></section>;
}

function AIAssistant({ t = enhancedCopy.en, large }) {
  const [answer, setAnswer] = useState(t.aiPreview);
  return <div className={`rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-amber-500/5 p-5 shadow-[0_0_35px_rgba(168,85,247,.12)] ${large ? "min-h-72" : ""}`}><div className="mb-3 flex items-center gap-2 text-purple-300"><Bot /><p className="font-black">{t.aiAssistant}</p></div><textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white outline-none focus:border-purple-400" defaultValue={t.aiPrompt} /><button onClick={() => setAnswer(t.aiPreviewNext)} className="mt-3 rounded-2xl bg-purple-400 px-5 py-3 font-black text-slate-950 hover:bg-purple-300">{t.analyzeWithAi}</button><p className="mt-4 rounded-2xl bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">{answer}</p></div>;
}

function SectionHeader({ title, detail }) {
  return <div className="mb-5"><h3 className="text-3xl font-black text-white">{title}</h3>{detail && <p className="mt-2 text-slate-400">{detail}</p>}</div>;
}

function Stat({ title, value, icon: Icon, help, onClick }) {
  const content = <><div className="flex items-start justify-between"><GlowIcon><Icon /></GlowIcon>{help && <Tooltip text={help} />}</div><p className="mt-5 text-sm font-black uppercase tracking-widest text-slate-500">{title}</p><p className="mt-2 text-3xl font-black text-white">{value}</p></>;
  if (onClick) return <motion.button type="button" onClick={onClick} whileHover={{ y: -5 }} className="glow-card w-full rounded-3xl border border-white/10 bg-white/[.055] p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl hover:border-amber-400/40">{content}</motion.button>;
  return <motion.div whileHover={{ y: -5 }} className="glow-card rounded-3xl border border-white/10 bg-white/[.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">{content}</motion.div>;
}

function GlassPanel({ children }) {
  return <section className="glow-card rounded-[2rem] border border-white/10 bg-white/[.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">{children}</section>;
}

function GlowIcon({ children }) {
  return <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-[0_0_30px_rgba(251,191,36,.35)]">{children}</div>;
}

function MiniMetric({ label, value, green }) {
  return <div className="glow-card rounded-2xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</p><p className={`mt-1 font-black ${green ? "text-emerald-400" : "text-white"}`}>{value}</p></div>;
}

function Step({ label, detail, done }) {
  return <div className="glow-card flex gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5"><div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}`}>{done ? <CheckCircle2 size={17} /> : null}</div><div><p className="font-black text-white">{label}</p><p className="mt-1 text-sm text-slate-400">{detail}</p></div></div>;
}

function ResultBox({ items }) {
  return <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><p className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">Results</p>{items.map(([label, value, green]) => <div key={label} className="flex items-center justify-between border-b border-white/10 py-4 last:border-0"><span className="font-bold text-slate-400">{label}</span><span className={`text-lg font-black ${green ? "text-emerald-400" : "text-white"}`}>{value}</span></div>)}</div>;
}

function Tooltip({ text }) {
  return <span className="group relative inline-flex shrink-0"><HelpCircle className="text-slate-500 group-hover:text-amber-300" size={18} /><span className="pointer-events-none absolute right-1/2 top-8 z-[80] w-72 max-w-[80vw] translate-x-1/2 rounded-2xl border border-amber-400/20 bg-slate-950 p-3 text-left text-xs leading-5 text-slate-300 opacity-0 shadow-2xl shadow-black/50 transition group-hover:opacity-100">{text}</span></span>;
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
