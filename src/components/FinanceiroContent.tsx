"use client";
import {
  DollarSign, ShoppingCart, TrendingUp, Package, Truck,
  Calendar, Download,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { FINANCEIRO_KPIS, VENDAS_MENSAIS, TOP_PRODUTOS } from "@/data/mrlion";

const BRAND = "#6366f1";
const BRAND_DIM = "rgba(99,102,241,0.18)";

const CHART_THEME = {
  grid: { stroke: "rgba(255,255,255,0.06)", strokeDasharray: "3 3" },
  axis: { stroke: "rgba(255,255,255,0.08)", tick: { fill: "rgba(255,255,255,0.35)", fontSize: 11 } },
};

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Truck,
};

// Color coding per KPI type
const KPI_ACCENT: Record<string, { icon: string; ring: string; bg: string }> = {
  "Receita Bruta":  { icon: "text-emerald-400",  ring: "border-emerald-500/20",  bg: "bg-emerald-500/5"  },
  "Ticket Medio":   { icon: "text-sky-400",       ring: "border-sky-500/20",      bg: "bg-sky-500/5"      },
  "Margem Bruta":   { icon: "text-violet-400",    ring: "border-violet-500/20",   bg: "bg-violet-500/5"   },
  "CMV":            { icon: "text-rose-400",       ring: "border-rose-500/20",     bg: "bg-rose-500/5"     },
  "Frete Total":    { icon: "text-orange-400",     ring: "border-orange-500/20",   bg: "bg-orange-500/5"   },
};

// Parse percentage string for progress bar width (e.g. "21,6%" -> 21.6)
function parsePercent(str: string): number {
  return parseFloat(str.replace(",", "."));
}

// Custom tooltip for recharts
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

export function FinanceiroContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Financeiro</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Receitas, custos e margens da operação
        </p>
        <p className="mt-2 text-xs text-[rgba(255,255,255,0.55)] leading-relaxed">
          Receita de{" "}
          <span className="text-emerald-400 font-medium">R$ 33.755</span>
          {" "}em Mar/2026{" "}
          <span className="text-rose-400 font-medium">(-38% vs mês anterior)</span>
        </p>
      </div>

      {/* Date range controls */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[rgba(255,255,255,0.07)]">
          <Calendar size={13} className="text-[rgba(255,255,255,0.5)]" />
          Jan 2026 – Mar 2026
        </button>
        <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-1">
          {["12 meses", "6 meses", "3 meses"].map((label) => {
            const active = label === "6 meses";
            return (
              <button
                key={label}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all duration-150 ${
                  active
                    ? "bg-[rgba(99,102,241,0.25)] text-[#a5b4fc] shadow-sm ring-1 ring-[rgba(99,102,241,0.4)]"
                    : "text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto relative group">
          <button
            title="Exportar dados"
            className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] p-1.5 text-[rgba(255,255,255,0.35)] transition-colors hover:text-white hover:bg-[rgba(255,255,255,0.08)]"
          >
            <Download size={14} />
          </button>
          <span className="pointer-events-none absolute right-0 top-8 z-10 whitespace-nowrap rounded-md bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] px-2 py-1 text-xs text-[rgba(255,255,255,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            Exportar dados
          </span>
        </div>
      </div>

      {/* KPI cards — responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {FINANCEIRO_KPIS.map((kpi) => {
          const Icon = ICON_MAP[kpi.icon];
          const accent = KPI_ACCENT[kpi.label] ?? {
            icon: "text-[rgba(255,255,255,0.4)]",
            ring: "border-[rgba(255,255,255,0.08)]",
            bg: "bg-[rgba(255,255,255,0.04)]",
          };
          return (
            <div
              key={kpi.label}
              className={`glass-card rounded-xl border p-4 ${accent.ring} ${accent.bg}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={13} className={accent.icon} />
                <span className="text-[11px] uppercase tracking-wide text-[rgba(255,255,255,0.4)] font-medium">
                  {kpi.label}
                </span>
              </div>
              <div className="text-2xl font-semibold text-white leading-tight">{kpi.valor}</div>
              <div className="text-[11px] text-[rgba(255,255,255,0.35)] mt-1">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue chart */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-violet-400" />
            <span className="text-sm font-medium text-white">Receita Mensal</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={VENDAS_MENSAIS} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                  <stop offset="80%" stopColor={BRAND} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke={CHART_THEME.grid.stroke}
                strokeDasharray={CHART_THEME.grid.strokeDasharray}
              />
              <XAxis
                dataKey="mes"
                stroke={CHART_THEME.axis.stroke}
                tick={CHART_THEME.axis.tick}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <YAxis
                stroke={CHART_THEME.axis.stroke}
                tick={CHART_THEME.axis.tick}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: BRAND_DIM, strokeWidth: 1 }} />
              <ReferenceLine
                x="Nov/25"
                stroke="rgba(99,102,241,0.5)"
                strokeDasharray="4 3"
                label={{
                  value: "R$ 491k",
                  position: "top",
                  fill: "rgba(165,180,252,0.8)",
                  fontSize: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="receita"
                fill="url(#receitaGrad)"
                stroke={BRAND}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: BRAND, stroke: "rgba(255,255,255,0.3)", strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Products table */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <Package size={14} className="text-violet-400" />
            <span className="text-sm font-medium text-white">Top Produtos por Receita</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">#</th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">Produto</th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">Receita</th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">Share</th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">Un.</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUTOS.map((p, idx) => (
                <tr
                  key={p.nome}
                  className={`border-b border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(99,102,241,0.07)] ${
                    idx % 2 === 0 ? "bg-[rgba(255,255,255,0.02)]" : ""
                  }`}
                >
                  <td className="px-2 py-2.5 text-xs font-mono text-[rgba(255,255,255,0.3)]">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-2 py-2.5 text-xs text-white max-w-[130px] truncate">{p.nome}</td>
                  <td className="px-2 py-2.5 text-xs text-emerald-300 font-medium tabular-nums">{p.receita}</td>
                  <td className="px-2 py-2.5 w-28">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#6366f1]"
                          style={{ width: `${Math.min(parsePercent(p.percentual), 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[rgba(255,255,255,0.45)] tabular-nums w-8 shrink-0">
                        {p.percentual}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-xs text-[rgba(255,255,255,0.55)] tabular-nums">
                    {p.unidades.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
