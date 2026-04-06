"use client";
import { useState, useCallback } from "react";
import {
  DollarSign, ShoppingCart, TrendingUp, Package, Truck,
  Calendar, Download, AlertTriangle, Target, BarChart2,
  CreditCard, Repeat2, Users, Eye, Search, FileText,
  CalendarDays,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import {
  FINANCEIRO_KPIS, VENDAS_MENSAIS, TOP_PRODUTOS, DRE_TABLE,
  GASTOS_POR_CATEGORIA, MARGEM_POR_PRODUTO, CHARGEBACK_ALERT,
  META_ADS_DATA, CAMPANHAS_META_ROI, METRICAS_ECOMMERCE,
} from "@/data/financeiro";
import { ROI_DADOS, ROI_TIMELINE, ROI_CATEGORIAS } from "@/data/roi";
import { RELATORIOS, AGENTES } from "@/data/mrlion";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { KpiGridSkeleton, SkeletonChart } from "@/components/ui/LoadingSkeleton";

const BRAND = "#6366f1";
const BRAND_DIM = "rgba(99,102,241,0.18)";

const CHART_THEME = {
  grid: { stroke: "rgba(255,255,255,0.06)", strokeDasharray: "3 3" },
  axis: { stroke: "rgba(255,255,255,0.08)", tick: { fill: "rgba(255,255,255,0.35)", fontSize: 11 } },
};

const BAR_COLORS = [
  "#ef4444", "#f59e0b", "#f97316", "#6366f1",
  "#8b5cf6", "#ec4899", "#14b8a6", "#06b6d4", "#22c55e",
];

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign, ShoppingCart, TrendingUp, Package, Truck,
};

const KPI_ACCENT: Record<string, { icon: string; ring: string; bg: string }> = {
  "Receita Total":  { icon: "text-emerald-400",  ring: "border-emerald-500/20",  bg: "bg-emerald-500/5"  },
  "Receita 2025":   { icon: "text-sky-400",       ring: "border-sky-500/20",      bg: "bg-sky-500/5"      },
  "Receita 2026":   { icon: "text-violet-400",    ring: "border-violet-500/20",   bg: "bg-violet-500/5"   },
  "Margem Bruta":   { icon: "text-amber-400",     ring: "border-amber-500/20",    bg: "bg-amber-500/5"    },
  "COGS":           { icon: "text-rose-400",       ring: "border-rose-500/20",     bg: "bg-rose-500/5"     },
};

// Tabs definition
const TABS = [
  { id: "visao-geral", label: "Visao Geral" },
  { id: "roi-impacto", label: "ROI / Impacto" },
  { id: "relatorios", label: "Relatorios" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function parsePercent(str: string): number {
  return parseFloat(str.replace(",", "."));
}

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[rgba(99,102,241,0.25)] bg-[#0d0d14] px-4 py-3 shadow-xl">
      <p className="text-xs text-[rgba(255,255,255,0.4)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        R$ {payload[0].value.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Tab 1: Visao Geral
// ═══════════════════════════════════════════════════════════════════════

function VisaoGeralTab() {
  const [activePeriod, setActivePeriod] = useState("6 meses");
  const skip = !isSupabaseConfigured();

  const fetchKpis = useCallback(async () => {
    const res = await fetch("/api/financial?type=kpis");
    if (!res.ok) throw new Error("Failed");
    const j = await res.json();
    return j.kpis ?? j.data ?? [];
  }, []);
  const fetchSales = useCallback(async () => {
    const res = await fetch("/api/financial?type=sales");
    if (!res.ok) throw new Error("Failed");
    const j = await res.json();
    return j.sales ?? j.data ?? [];
  }, []);
  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/financial?type=products");
    if (!res.ok) throw new Error("Failed");
    const j = await res.json();
    return j.products ?? j.data ?? [];
  }, []);

  const { data: finKpis, loading: loadingKpis } = useSupabaseQuery({ queryFn: fetchKpis, mockData: FINANCEIRO_KPIS, skip });
  const { data: vendasMensais, loading: loadingSales } = useSupabaseQuery({ queryFn: fetchSales, mockData: VENDAS_MENSAIS, skip });
  const { data: topProdutos, loading: loadingProducts } = useSupabaseQuery({ queryFn: fetchProducts, mockData: TOP_PRODUTOS, skip });

  return (
    <div className="space-y-6">
      {/* Context line */}
      <div>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Receitas, custos e margens da operacao
        </p>
        <p className="mt-2 text-xs text-[rgba(255,255,255,0.55)] leading-relaxed">
          Receita total de{" "}
          <span className="text-emerald-400 font-medium">R$ 2.756.310</span>
          {" "}desde Abr/2024.{" "}
          <span className="text-sky-400 font-medium">+161% YoY em 2025</span>
        </p>
      </div>

      {/* Period controls */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[rgba(255,255,255,0.07)]">
          <Calendar size={13} className="text-[rgba(255,255,255,0.5)]" />
          Abr 2025 – Mar 2026
        </button>
        <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-1">
          {["12 meses", "6 meses", "3 meses"].map((label) => (
            <button
              key={label}
              onClick={() => setActivePeriod(label)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
                label === activePeriod
                  ? "bg-[rgba(99,102,241,0.25)] text-[#a5b4fc] shadow-sm ring-1 ring-[rgba(99,102,241,0.4)]"
                  : "text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto relative group">
          <button title="Exportar dados" aria-label="Exportar dados" className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] p-1.5 text-[rgba(255,255,255,0.5)] transition-colors hover:text-white hover:bg-[rgba(255,255,255,0.08)]">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      {loadingKpis ? <KpiGridSkeleton count={5} /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {finKpis.map((kpi: typeof FINANCEIRO_KPIS[number]) => {
            const Icon = ICON_MAP[kpi.icon];
            const accent = KPI_ACCENT[kpi.label] ?? { icon: "text-[rgba(255,255,255,0.4)]", ring: "border-[rgba(255,255,255,0.08)]", bg: "bg-[rgba(255,255,255,0.04)]" };
            return (
              <div key={kpi.label} className={`glass-card rounded-xl border p-4 ${accent.ring} ${accent.bg}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={13} className={accent.icon} />
                  <span className="text-[11px] uppercase tracking-wide text-[rgba(255,255,255,0.4)] font-medium">{kpi.label}</span>
                </div>
                <div className="text-2xl font-semibold text-white leading-tight">{kpi.valor}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.5)] mt-1">{kpi.sub}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chargeback alert */}
      <div className="glass-card rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3 flex items-center gap-3">
        <AlertTriangle size={16} className="text-red-400 shrink-0" />
        <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
          <span className="text-red-400 font-semibold">Chargebacks {CHARGEBACK_ALERT.mes}: {CHARGEBACK_ALERT.percentual} ({CHARGEBACK_ALERT.valor})</span>
          {" "}&mdash;{" "}
          <span className="inline-flex items-center rounded-full bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {CHARGEBACK_ALERT.status}
          </span>
        </p>
      </div>

      {/* DRE Table */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-violet-400" />
          <span className="text-sm font-medium text-white">DRE Simplificado</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Item</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Jan/26</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Fev/26</th>
              </tr>
            </thead>
            <tbody>
              {DRE_TABLE.map((row, idx) => {
                const isResult = row.label === "Resultado";
                const isMargin = row.label === "Margem %";
                return (
                  <tr key={row.label} className={`border-b border-[rgba(255,255,255,0.05)] ${isResult ? "bg-[rgba(255,255,255,0.03)]" : ""} ${idx % 2 === 0 ? "bg-[rgba(255,255,255,0.01)]" : ""}`}>
                    <td className={`px-3 py-2.5 text-xs ${isResult ? "font-semibold text-white" : "text-[rgba(255,255,255,0.7)]"}`}>{row.label}</td>
                    <td className={`px-3 py-2.5 text-xs text-right tabular-nums ${isResult && typeof row.jan === "number" && row.jan > 0 ? "text-emerald-400 font-medium" : isResult && typeof row.jan === "number" && row.jan < 0 ? "text-red-400 font-medium" : "text-white"}`}>
                      {isMargin ? row.jan : typeof row.jan === "number" ? fmtBRL(row.jan) : row.jan}
                    </td>
                    <td className={`px-3 py-2.5 text-xs text-right tabular-nums ${isResult && typeof row.fev === "number" && row.fev < 0 ? "text-red-400 font-medium" : isResult && typeof row.fev === "number" && row.fev > 0 ? "text-emerald-400 font-medium" : "text-white"}`}>
                      {isMargin ? row.fev : typeof row.fev === "number" ? fmtBRL(row.fev) : row.fev}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue chart */}
        {loadingSales ? <SkeletonChart height={280} /> : (
          <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={14} className="text-violet-400" />
              <span className="text-sm font-medium text-white">Receita Mensal</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={vendasMensais} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                    <stop offset="80%" stopColor={BRAND} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
                <XAxis dataKey="mes" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} interval={1} />
                <YAxis stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} width={52} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: BRAND_DIM, strokeWidth: 1 }} />
                <ReferenceLine x="Nov/25" stroke="rgba(99,102,241,0.5)" strokeDasharray="4 3" label={{ value: "R$ 491k", position: "top", fill: "rgba(165,180,252,0.8)", fontSize: 10 }} />
                <Area type="monotone" dataKey="receita" fill="url(#receitaGrad)" stroke={BRAND} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: BRAND, stroke: "rgba(255,255,255,0.3)", strokeWidth: 1.5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gastos por categoria */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={14} className="text-violet-400" />
            <span className="text-sm font-medium text-white">Gastos por Categoria</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={GASTOS_POR_CATEGORIA} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} horizontal={false} />
              <XAxis type="number" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="categoria" type="category" stroke={CHART_THEME.axis.stroke} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(v: number) => [fmtBRL(v), "Valor"]} />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={14}>
                {GASTOS_POR_CATEGORIA.map((_, i) => (
                  <Cell key={`c-${i}`} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Margem por produto + Products table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Margem por produto */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-sm font-medium text-white">Margem por Produto (%)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MARGEM_POR_PRODUTO} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
              <XAxis dataKey="nome" stroke={CHART_THEME.axis.stroke} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" height={50} />
              <YAxis stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} domain={[0, 60]} tickFormatter={(v: number) => `${v}%`} width={40} />
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Margem"]} />
              <Bar dataKey="margem" radius={[4, 4, 0, 0]} barSize={24}>
                {MARGEM_POR_PRODUTO.map((p, i) => (
                  <Cell key={`m-${i}`} fill={p.margem >= 50 ? "#22c55e" : p.margem >= 44 ? "#f59e0b" : "#ef4444"} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products table */}
        {loadingProducts ? <SkeletonChart height={280} /> : (
          <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex items-center gap-2 mb-5">
              <Package size={14} className="text-violet-400" />
              <span className="text-sm font-medium text-white">Top Produtos por Receita</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.1)]">
                    <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">#</th>
                    <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Produto</th>
                    <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Receita</th>
                    <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Share</th>
                    <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Un.</th>
                  </tr>
                </thead>
                <tbody>
                  {topProdutos.map((p: typeof TOP_PRODUTOS[number], idx: number) => (
                    <tr key={p.nome} className={`border-b border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(99,102,241,0.07)] ${idx % 2 === 0 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}>
                      <td className="px-2 py-2.5 text-xs font-mono text-[rgba(255,255,255,0.5)]">{String(idx + 1).padStart(2, "0")}</td>
                      <td className="px-2 py-2.5 text-xs text-white max-w-[130px] truncate">{p.nome}</td>
                      <td className="px-2 py-2.5 text-xs text-emerald-300 font-medium tabular-nums">{p.receita}</td>
                      <td className="px-2 py-2.5 w-28">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                            <div className="h-full rounded-full bg-[#6366f1]" style={{ width: `${Math.min(parsePercent(p.percentual), 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-[rgba(255,255,255,0.45)] tabular-nums w-8 shrink-0">{p.percentual}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-xs text-[rgba(255,255,255,0.55)] tabular-nums">{p.unidades.toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Tab 2: ROI / Impacto
// ═══════════════════════════════════════════════════════════════════════

function RoiImpactoTab() {
  const skip = !isSupabaseConfigured();

  const fetchRoiTimeline = useCallback(async () => {
    const res = await fetch("/api/financial?type=roi-timeline");
    if (!res.ok) throw new Error("Failed");
    const j = await res.json();
    return j.timeline ?? j.data ?? [];
  }, []);

  const { data: roiTimeline, loading: loadingTimeline } = useSupabaseQuery({ queryFn: fetchRoiTimeline, mockData: ROI_TIMELINE, skip });

  const TOTAL_VALOR = ROI_CATEGORIAS.reduce((sum, cat) => {
    const n = parseInt(cat.valor.replace(/\D/g, ""), 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Hero KPIs — Meta Ads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meta Ads Spend */}
        <div className="glass-card rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                <DollarSign size={14} className="text-red-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)]">Meta Ads Spend</p>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">{fmtBRL(META_ADS_DATA.totalSpend)}</p>
            <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1.5">{META_ADS_DATA.periodo}</p>
          </div>
        </div>

        {/* ROAS Pixel */}
        <div className="glass-card rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <Eye size={14} className="text-amber-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)]">ROAS Pixel</p>
            </div>
            <p className="text-3xl font-bold text-amber-400 tabular-nums">{META_ADS_DATA.roasPixel}</p>
            <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1.5">Purchase Value: {fmtBRL(META_ADS_DATA.purchaseValue)}</p>
          </div>
        </div>

        {/* ROAS Triangulado */}
        <div className="glass-card rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/15 via-emerald-500/[8%] to-transparent p-6 relative overflow-hidden" style={{ boxShadow: "var(--shadow-glow-green)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/15 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Target size={14} className="text-green-300" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)]">ROAS Estimado</p>
            </div>
            <p className="text-4xl font-bold text-green-300 tabular-nums">{META_ADS_DATA.roasTriangulado}</p>
            <p className="text-xs text-green-400/70 mt-1.5">Triangulado (Fev/26)</p>
          </div>
        </div>
      </div>

      {/* Pixel warning */}
      <div className="glass-card rounded-xl border border-amber-500/30 bg-amber-500/5 border-l-4 border-l-amber-500/70 px-5 py-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
          {META_ADS_DATA.pixelNote}
        </p>
      </div>

      {/* Campanhas Meta */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-violet-400" />
          <span className="text-sm font-medium text-white">Campanhas Meta Ads</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Campanha</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Orc./dia</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">ROAS</th>
                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPANHAS_META_ROI.map((c) => (
                <tr key={c.nome} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                  <td className="px-3 py-3 text-sm text-white">{c.nome}</td>
                  <td className="px-3 py-3 text-sm text-white text-right tabular-nums">R$ {c.orcDia}</td>
                  <td className={`px-3 py-3 text-sm text-right tabular-nums font-medium ${c.roas >= 2 ? "text-emerald-400" : c.roas >= 1 ? "text-amber-400" : "text-red-400"}`}>
                    {c.roas.toFixed(1)}x
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      c.status === "ativa"
                        ? "bg-green-500/20 text-green-400 border border-green-500/20"
                        : "bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Kairus section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)] mb-2">Investimento Kairus</p>
          <p className="text-2xl font-bold text-white tabular-nums">{fmtBRL(ROI_DADOS.investimentoTotal)}</p>
          <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1">6 meses (setup + mensalidade)</p>
        </div>
        <div className="glass-card rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)] mb-2">Valor Gerado</p>
          <p className="text-2xl font-bold text-green-400 tabular-nums">{fmtBRL(ROI_DADOS.valorGerado)}</p>
          <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1">receita + economia operacional</p>
        </div>
        <div className="glass-card rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/15 to-transparent p-5" style={{ boxShadow: "var(--shadow-glow-green)" }}>
          <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)] mb-2">ROI Kairus</p>
          <p className="text-3xl font-bold text-green-300 tabular-nums">{ROI_DADOS.roiPercentual}</p>
          <p className="text-xs text-green-400/70 mt-1">Break-even no 3o mes</p>
        </div>
      </div>

      {/* ROI Timeline chart */}
      {loadingTimeline ? <SkeletonChart height={320} /> : (
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Evolucao do ROI</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={roiTimeline} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="investGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="85%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="valorGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="85%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
              <XAxis dataKey="mes" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} />
              <YAxis stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`} width={56} />
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(value: number, name: string) => [`R$ ${value.toLocaleString("pt-BR")}`, name === "investimento" ? "Investimento" : "Valor Gerado"]} />
              <Legend formatter={(value: string) => value === "investimento" ? "Investimento" : "Valor Gerado"} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} iconType="circle" />
              <ReferenceLine x="Jan/26" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeDasharray="5 4" label={{ value: "Break-even", fill: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 600, position: "insideTopRight" }} />
              <Area type="monotone" dataKey="investimento" stroke="#ef4444" strokeWidth={2} fill="url(#investGrad2)" dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "rgba(239,68,68,0.4)", strokeWidth: 3 }} />
              <Area type="monotone" dataKey="valor" stroke="#22c55e" strokeWidth={2} fill="url(#valorGrad2)" dot={{ fill: "#22c55e", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "rgba(34,197,94,0.4)", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category breakdown */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-[rgba(255,255,255,0.4)]" />
          <span className="text-sm font-medium text-white">Detalhamento por Categoria</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.4)]">Categoria</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.4)]">Valor</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.4)] hidden sm:table-cell">Contribuicao</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.4)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROI_CATEGORIAS.map((cat) => {
              const raw = parseInt(cat.valor.replace(/\D/g, ""), 10);
              const pct = TOTAL_VALOR > 0 ? Math.round((raw / TOTAL_VALOR) * 100) : 0;
              return (
                <tr key={cat.categoria} className="border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                  <td className="px-3 py-3 text-sm text-white">{cat.categoria}</td>
                  <td className="px-3 py-3 text-sm font-medium text-white tabular-nums">{cat.valor}</td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden min-w-[60px]">
                        <div className={`h-full rounded-full transition-all ${cat.verificado ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[rgba(255,255,255,0.5)] tabular-nums w-8 text-right">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {cat.verificado ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-green-500/20 text-green-400 border border-green-500/20">Verificado</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/20">Estimado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Tab 3: Relatorios
// ═══════════════════════════════════════════════════════════════════════

const tipoBadge: Record<string, string> = {
  Semanal: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Mensal: "bg-purple-500/20 text-purple-400 border border-purple-500/20",
};

const tipoIcon: Record<string, React.ReactNode> = {
  Semanal: <Calendar size={11} className="inline-block mr-1 -mt-px" />,
  Mensal: <CalendarDays size={11} className="inline-block mr-1 -mt-px" />,
};

function RelatoriosTab() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const skip = !isSupabaseConfigured();

  const fetchReports = useCallback(async () => {
    const res = await fetch("/api/reports");
    if (!res.ok) throw new Error("Failed");
    const j = await res.json();
    return j.data ?? j ?? [];
  }, []);
  const fetchAgents = useCallback(async () => {
    const res = await fetch("/api/agents");
    if (!res.ok) throw new Error("Failed");
    const j = await res.json();
    return j.data ?? j ?? [];
  }, []);

  const { data: relatorios, loading } = useSupabaseQuery({ queryFn: fetchReports, mockData: RELATORIOS, skip });
  const { data: agentesData } = useSupabaseQuery({ queryFn: fetchAgents, mockData: AGENTES, skip });

  function getAgente(nome: string) {
    return agentesData.find((a: typeof AGENTES[number]) => a.nome === nome);
  }

  const relatoriosFiltrados = relatorios.filter((r: typeof RELATORIOS[number]) => {
    const matchTipo = filtro === "Todos" || r.tipo === filtro;
    const matchBusca = busca === "" || r.titulo.toLowerCase().includes(busca.toLowerCase()) || r.resumo.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const M = METRICAS_ECOMMERCE;

  // Pie data for payment methods
  const paymentPie = [
    { name: "Pix", value: 63.6, fill: "#6366f1" },
    { name: "Cartao", value: 36.4, fill: "#ec4899" },
  ];

  return (
    <div className="space-y-6">
      {/* E-commerce metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: "Conversion Rate", valor: M.conversionRate, icon: Target, accent: "text-emerald-400" },
          { label: "Revenue/Session", valor: M.revenuePerSession, icon: DollarSign, accent: "text-sky-400" },
          { label: "Revenue/Visitor", valor: M.revenuePerVisitor, icon: Users, accent: "text-violet-400" },
          { label: "Repeat Rate", valor: M.repeatRate, icon: Repeat2, accent: "text-amber-400" },
          { label: "LTV Medio", valor: M.ltvMedio, icon: TrendingUp, accent: "text-emerald-400" },
          { label: "LTV Repeat", valor: M.ltvRepeat, icon: TrendingUp, accent: "text-green-300" },
          { label: "Pix", valor: `${M.pixTotal} (${M.pixPercent})`, icon: CreditCard, accent: "text-indigo-400" },
          { label: "Cartao", valor: `${M.cartaoTotal} (${M.cartaoPercent})`, icon: CreditCard, accent: "text-pink-400" },
        ].map((m) => (
          <div key={m.label} className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <m.icon size={13} className={m.accent} />
              <span className="text-[11px] uppercase tracking-wide text-[rgba(255,255,255,0.4)] font-medium">{m.label}</span>
            </div>
            <div className="text-lg font-semibold text-white leading-tight">{m.valor}</div>
          </div>
        ))}
      </div>

      {/* Payment method pie + reports header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={14} className="text-violet-400" />
            <span className="text-sm font-medium text-white">Pix vs Cartao</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={paymentPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                {paymentPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} fillOpacity={0.8} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(v: number) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2">
          {/* Reports header */}
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-[rgba(255,255,255,0.4)]">Relatorios automaticos gerados pela equipe de IA</p>
            <button className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.88)] hover:bg-[rgba(255,255,255,0.75)] px-4 py-2 text-xs font-medium text-[#080808] transition-colors">
              + Gerar relatorio
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {["Todos", "Semanal", "Mensal"].map((label) => (
              <button key={label} onClick={() => setFiltro(label)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filtro === label ? "bg-white/10 text-white ring-1 ring-white/20" : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white/70"}`}>
                {label}
              </button>
            ))}
            <div className="ml-auto relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)]" />
              <input
                type="text"
                aria-label="Buscar relatorio"
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[rgba(255,255,255,0.16)] transition-colors"
              />
            </div>
          </div>

          {/* Report cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5 h-40 animate-pulse" />
              ))}
            </div>
          ) : relatoriosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-12 text-center">
              <FileText size={22} className="text-[rgba(255,255,255,0.5)] mb-2" />
              <p className="text-sm text-[rgba(255,255,255,0.5)]">Nenhum relatorio encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatoriosFiltrados.map((rel: typeof RELATORIOS[number]) => {
                const agente = getAgente(rel.agente);
                return (
                  <div key={rel.id} className="glass-card group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 transition-all duration-200 hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.06)]">
                    {rel.status === "pronto" && (
                      <span className="absolute top-3 right-3 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                    )}
                    <div className="mb-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tipoBadge[rel.tipo]}`}>
                        {tipoIcon[rel.tipo]}{rel.tipo}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug mb-1">{rel.titulo}</h3>
                    <p className="text-xs text-[rgba(255,255,255,0.5)] mb-1.5">{rel.periodo}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.55)] line-clamp-2 flex-1 leading-relaxed">{rel.resumo}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: agente?.departamentoCor ?? "rgba(255,255,255,0.15)" }}>
                          {agente?.iniciais ?? rel.agente.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-xs text-[rgba(255,255,255,0.45)]">{rel.agente}</span>
                      </div>
                      <button className="rounded-md bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] px-2.5 py-0.5 text-[11px] font-medium text-white transition-colors">Ver</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main: FinanceiroContent with tab switcher
// ═══════════════════════════════════════════════════════════════════════

export function FinanceiroContent() {
  const [activeTab, setActiveTab] = useState<TabId>("visao-geral");

  return (
    <div className="p-6 space-y-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-0 border-b border-[rgba(255,255,255,0.08)]">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? "text-white"
                  : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)]"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "visao-geral" && <VisaoGeralTab />}
      {activeTab === "roi-impacto" && <RoiImpactoTab />}
      {activeTab === "relatorios" && <RelatoriosTab />}
    </div>
  );
}
