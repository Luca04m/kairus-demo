"use client";
import { useState, useCallback } from "react";
import {
  DollarSign, ShoppingCart, TrendingUp, Package, Truck,
  Calendar, Download, AlertTriangle, BarChart2,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell,
} from "@/components/charts";
import {
  FINANCEIRO_KPIS, VENDAS_MENSAIS, TOP_PRODUTOS,
  DRE_TABLE, GASTOS_POR_CATEGORIA, MARGEM_POR_PRODUTO,
  CHARGEBACK_ALERT,
} from "@/data/financeiro";
import { useExport } from "@/hooks/useExport";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { KpiGridSkeleton, SkeletonChart } from "@/components/ui/LoadingSkeleton";
import { BRAND, BRAND_DIM, CHART_THEME, BAR_COLORS, parsePercent, fmtBRL, CustomTooltip } from "./chart-theme";

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign, ShoppingCart, TrendingUp, Package, Truck,
};

const KPI_ACCENT: Record<string, { icon: string; ring: string; bg: string }> = {
  "Receita Total":  { icon: "text-emerald-400",  ring: "border-emerald-500/20",  bg: "bg-emerald-500/5"  },
  "Receita 2025":   { icon: "text-emerald-300",    ring: "border-emerald-500/15",   bg: "bg-emerald-500/5"  },
  "Receita 2026":   { icon: "text-[#01C461]",    ring: "border-[rgba(1,196,97,0.2)]",   bg: "bg-[rgba(1,196,97,0.05)]"   },
  "Margem Bruta":   { icon: "text-amber-400",     ring: "border-amber-500/20",    bg: "bg-amber-500/5"    },
  "COGS":           { icon: "text-rose-400",       ring: "border-rose-500/20",     bg: "bg-rose-500/5"     },
};

export function VisaoGeralTab() {
  const [activePeriod, setActivePeriod] = useState("6 meses");
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const { exportCSV } = useExport();
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
          <span className="text-emerald-300 font-medium">+161% YoY em 2025</span>
        </p>
      </div>

      {/* Period controls */}
      <div className="flex items-center gap-3">
        <button disabled title="Filtro de data em breve" className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[rgba(255,255,255,0.07)] opacity-50 cursor-not-allowed">
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
                  ? "bg-[rgba(1,196,97,0.25)] text-[#5eead4] shadow-sm ring-1 ring-[rgba(1,196,97,0.4)]"
                  : "text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto relative group">
          <button
            onClick={() => {
              exportCSV({
                filename: `kairus-financeiro-${new Date().toISOString().slice(0, 10)}`,
                headers: ['Linha', 'Jan', 'Fev'],
                rows: DRE_TABLE.map(r => [r.label, String(r.jan), String(r.fev)]),
              });
              setDownloadFeedback(true);
              setTimeout(() => setDownloadFeedback(false), 2000);
            }}
            aria-label="Exportar dados"
            className={`rounded-lg border p-1.5 transition-colors ${downloadFeedback ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.08)]"}`}
          >
            {downloadFeedback ? <CheckCircle2 size={14} /> : <Download size={14} />}
          </button>
          {downloadFeedback && <span className="absolute right-0 top-full mt-1 text-[10px] text-emerald-400 whitespace-nowrap">Relatorio baixado</span>}
        </div>
      </div>

      {/* KPI cards */}
      {loadingKpis ? <KpiGridSkeleton count={5} /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {finKpis.map((kpi: typeof FINANCEIRO_KPIS[number]) => {
            const Icon = ICON_MAP[kpi.icon];
            const accent = KPI_ACCENT[kpi.label] ?? { icon: "text-[rgba(255,255,255,0.4)]", ring: "border-[rgba(255,255,255,0.08)]", bg: "bg-[rgba(255,255,255,0.02)]" };
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
          <BarChart2 size={14} className="text-[#01C461]" />
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
              <TrendingUp size={14} className="text-[#01C461]" />
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
                <ReferenceLine x="Nov/25" stroke="rgba(255,255,255,0.25)" strokeDasharray="4 3" label={{ value: "R$ 491k", position: "top", fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                <Area type="monotone" dataKey="receita" fill="url(#receitaGrad)" stroke={BRAND} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: BRAND, stroke: "rgba(255,255,255,0.3)", strokeWidth: 1.5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gastos por categoria */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={14} className="text-[#01C461]" />
            <span className="text-sm font-medium text-white">Gastos por Categoria</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={GASTOS_POR_CATEGORIA} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} horizontal={false} />
              <XAxis type="number" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="categoria" type="category" stroke={CHART_THEME.axis.stroke} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(1,196,97,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(v: number) => [fmtBRL(v), "Valor"]} />
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
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(1,196,97,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Margem"]} />
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
              <Package size={14} className="text-[#01C461]" />
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
                    <tr key={p.nome} className={`border-b border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(1,196,97,0.07)] ${idx % 2 === 0 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}>
                      <td className="px-2 py-2.5 text-xs font-mono text-[rgba(255,255,255,0.5)]">{String(idx + 1).padStart(2, "0")}</td>
                      <td className="px-2 py-2.5 text-xs text-white max-w-[130px] truncate">{p.nome}</td>
                      <td className="px-2 py-2.5 text-xs text-emerald-300 font-medium tabular-nums">{p.receita}</td>
                      <td className="px-2 py-2.5 w-28">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                            <div className="h-full rounded-full bg-[#01C461]" style={{ width: `${Math.min(parsePercent(p.percentual), 100)}%` }} />
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
