import React, { useMemo, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, Clipboard, Download, Sparkles } from "lucide-react";

const fields = [
  ["purchasePrice", "Purchase Price", "Precio de compra", 190000],
  ["arv", "After Repair Value", "Valor después de reparación", 295000],
  ["rehabBudget", "Rehab Budget", "Presupuesto de rehabilitación", 45000],
  ["closingCosts", "Closing Costs", "Costos de cierre", 8000],
  ["holdingCosts", "Holding Costs", "Costos de mantenimiento", 6000],
  ["sellingCosts", "Selling Costs", "Costos de venta", 17700],
  ["taxes", "Annual Taxes", "Impuestos anuales", 3600],
  ["insurance", "Annual Insurance", "Seguro anual", 1800],
  ["monthlyRent", "Monthly Rent", "Renta mensual", 2600],
  ["expenses", "Monthly Expenses", "Gastos mensuales", 550],
  ["cashInvested", "Cash Invested", "Capital invertido", 52000],
  ["loanAmount", "Loan Amount", "Monto del préstamo", 185000],
  ["interestRate", "Interest Rate %", "Tasa de interés %", 7.25],
  ["loanYears", "Loan Years", "Años del préstamo", 30],
];

const money = (value) => Number(value || 0).toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function AnalysisCard({ title, text, warning }) {
  return <article className={`rounded-2xl border p-4 ${warning ? "border-amber-300/25 bg-amber-300/[.06]" : "border-white/10 bg-slate-950/55"}`}>
    <div className="mb-2 flex items-center gap-2">
      {warning ? <AlertTriangle size={16} className="text-amber-300" /> : <CheckCircle2 size={16} className="text-cyan-300" />}
      <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">{title}</h4>
    </div>
    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{Array.isArray(text) ? text.map((item) => `- ${item}`).join("\n") : text || "No finding provided."}</p>
  </article>;
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

export default function AIAnalyzerPanel({ language = "en", getAccessToken, large }) {
  const isEs = language === "es";
  const [values, setValues] = useState(Object.fromEntries(fields.map(([key, , , value]) => [key, value])));
  const [notes, setNotes] = useState("");
  const [projectId, setProjectId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const calculated = useMemo(() => {
    const totalCost = Number(values.purchasePrice) + Number(values.rehabBudget) + Number(values.closingCosts) + Number(values.holdingCosts) + Number(values.sellingCosts);
    const profit = Number(values.arv) - totalCost;
    const roi = totalCost ? (profit / totalCost) * 100 : 0;
    return { totalCost, profit, roi };
  }, [values]);

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function analyze() {
    setLoading(true);
    setStatus("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error(isEs ? "Inicia sesion para continuar." : "Sign in to continue.");
      const response = await fetch("/api/analyze-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...values, projectId: projectId || null, notes }),
      });
      const result = await readApiJson(response);
      if (!response.ok) throw new Error(result.error || (isEs ? "No se pudo generar el análisis." : "Analysis could not be generated."));
      setAnalysis(result.analysis);
      setStatus(isEs ? "Análisis guardado en tu espacio de trabajo." : "Analysis saved to your workspace.");
    } catch (error) {
      setStatus(isEs && error.message === "A server error occurred. Please try again or contact support@operitron.com." ? "Ocurrió un error del servidor. Intenta de nuevo o escribe a support@operitron.com." : error.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyAnalysis() {
    if (!analysis) return;
    await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setStatus(isEs ? "Análisis copiado." : "Analysis copied.");
  }

  function exportAnalysis() {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify({ generatedBy: "OPERITRON.COM", inputs: values, analysis }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "operitron-deal-analysis.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const cards = analysis ? [
    [isEs ? "Resumen del deal" : "Deal Summary", analysis.dealSummary],
    [isEs ? "Análisis de ROI" : "ROI Analysis", analysis.roiAnalysis],
    [isEs ? "Comentario DSCR" : "DSCR Commentary", analysis.dscrCommentary],
    [isEs ? "Oferta máxima recomendada" : "Recommended Max Offer", analysis.recommendedMaxOffer],
    [isEs ? "Riesgos del flip" : "Flip Risk Analysis", analysis.flipRiskAnalysis, true],
    [isEs ? "Riesgos de renta" : "Rental Risk Analysis", analysis.rentalRiskAnalysis, true],
    [isEs ? "Alertas de contratistas" : "Contractor Warning Signs", analysis.contractorWarningSigns, true],
    [isEs ? "Preocupaciones de financiamiento" : "Financing Concerns", analysis.financingConcerns, true],
    [isEs ? "Recomendaciones para el inversionista" : "Investor Recommendations", analysis.investorRecommendations],
    [isEs ? "Señales de alerta" : "Red Flags", analysis.redFlags, true],
    [isEs ? "Comentario de mercado" : "Market Commentary", analysis.marketCommentary],
    [isEs ? "Próximos pasos" : "Next Steps", analysis.nextSteps],
  ] : [];

  return <section className={`rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[.09] via-slate-950 to-purple-500/[.09] p-4 shadow-[0_0_38px_rgba(34,211,238,.1)] sm:p-6 ${large ? "min-h-72 w-full" : ""}`}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-cyan-300"><Bot /><p className="font-black">{isEs ? "Analizador IA de Deals" : "AI Deal Analyzer"}</p></div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{isEs ? "Evaluacion segura basada en tus numeros, guardada para tu proyecto." : "Secure analysis based on your numbers, saved alongside your project."}</p>
      </div>
      {analysis && <div className="flex gap-2"><button onClick={copyAnalysis} className="secondary-button !px-3" aria-label="Copy analysis"><Clipboard size={17} /></button><button onClick={exportAnalysis} className="secondary-button !px-3" aria-label="Export analysis"><Download size={17} /></button></div>}
    </div>

    <div className={`mt-6 grid min-w-0 gap-6 ${large ? "lg:grid-cols-[minmax(420px,1.05fr)_minmax(360px,.95fr)]" : ""}`}>
      <div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map(([key, enLabel, esLabel]) => <label key={key} className="block"><span className="label">{isEs ? esLabel : enLabel}</span><input className="field" type="number" step={key === "interestRate" ? "0.01" : "1"} value={values[key]} onChange={(event) => update(key, event.target.value)} /></label>)}
        </div>
        <label className="mt-3 block"><span className="label">{isEs ? "ID del proyecto (opcional)" : "Project ID (optional)"}</span><input className="field" inputMode="numeric" value={projectId} onChange={(event) => setProjectId(event.target.value)} /></label>
        <label className="mt-3 block"><span className="label">{isEs ? "Notas y supuestos" : "Notes and assumptions"}</span><textarea className="field min-h-24 resize-y" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} /></label>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-slate-950/70 p-3"><p className="text-[0.64rem] font-bold uppercase text-slate-500">{isEs ? "Costo" : "Cost"}</p><p className="text-sm font-black text-white">{money(calculated.totalCost)}</p></div>
          <div className="rounded-xl bg-slate-950/70 p-3"><p className="text-[0.64rem] font-bold uppercase text-slate-500">{isEs ? "Ganancia" : "Profit"}</p><p className="text-sm font-black text-emerald-300">{money(calculated.profit)}</p></div>
          <div className="rounded-xl bg-slate-950/70 p-3"><p className="text-[0.64rem] font-bold uppercase text-slate-500">ROI</p><p className="text-sm font-black text-cyan-300">{calculated.roi.toFixed(1)}%</p></div>
        </div>
        <button disabled={loading} onClick={analyze} className="primary-button mt-5 w-full disabled:cursor-wait disabled:opacity-70">
          {loading ? <><Sparkles className="animate-pulse" size={18} /> {isEs ? "Analizando..." : "Analyzing..."}</> : <><Sparkles size={18} /> {isEs ? "Analizar con IA" : "Analyze with AI"}</>}
        </button>
        {status && <p role="status" className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">{status}</p>}
      </div>
      <div className="space-y-3">
        {!analysis && <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center"><div><Sparkles className="mx-auto text-cyan-300" /><p className="mt-4 font-black text-white">{isEs ? "Listo para evaluar tu deal" : "Ready to evaluate your deal"}</p><p className="mt-2 text-sm leading-6 text-slate-400">{isEs ? "Los resultados incluirán riesgos, oferta máxima y próximos pasos." : "Results include risk flags, max offer, and practical next steps."}</p></div></div>}
        {analysis && <><div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/[.08] p-4"><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEs ? "Puntuación de inversión" : "Investment Score"}</p><p className="mt-2 text-4xl font-black text-white">{analysis.investmentScore}<span className="text-base text-slate-400"> / 100</span></p></div>{cards.map(([title, text, warning]) => <AnalysisCard key={title} title={title} text={text} warning={warning} />)}</>}
      </div>
    </div>
  </section>;
}
