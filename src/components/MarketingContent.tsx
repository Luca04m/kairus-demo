"use client";
import {
  Banknote, TrendingUp, Eye, MousePointer, Target,
  Calendar, Download, Megaphone, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { MARKETING_KPIS, TRAFEGO_MENSAL, CAMPANHAS_META } from "@/data/mrlion";

const CHART_THEME = {
  grid: { stroke: "rgba(255,255,255,0.06)", strokeDasharray: "3 3" },
  axis: { stroke: "rgba(255,255,255,0.08)", tick: { fill: "rgba(255,255,255,0.4)", fontSize: 11 } },
  tooltip: {
    contentStyle: {
      backgroundColor: "#0d0d0d",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      color: "white",
      fontSize: "12px",
      padding: "10px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    },
    labelStyle: { color: "rgba(255,255,255,0.6)", marginBottom: "6px", fontSize: "11px" },
  },
};

const ICON_MAP: Record<string, React.ElementType> = {
  Banknote,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
};

function getRoasColor(roas: string): string {
  if (roas === "—") return "text-[rgba(255,255,255,0.25)]";
  const num = parseFloat(roas.replace("x", ""));
  if (num >= 5) return "text-emerald-400 font-medium";
  if (num >= 2) return "text-amber-400 font-medium";
  return "text-red-400 font-medium";
}

function getCtrColor(ctr: string): string {
  const num = parseFloat(ctr.replace("%", ""));
  if (num >= 4) return "text-emerald-400";
  if (num >= 2.5) return "text-amber-400";
  return "text-red-400 font-medium";
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTrafficTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={CHART_THEME.tooltip.contentStyle}>
      <p style={CHART_THEME.tooltip.labelStyle}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[rgba(255,255,255,0.5)] text-xs">
            {entry.name === "sessoes" ? "Sessões" : "Pageviews"}:
          </span>
          <span className="text-white text-xs font-medium">
            {entry.value.toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MarketingContent() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Marketing</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Campanhas, tráfego e performance de conteúdo
        </p>
      </div>

      {/* Date controls */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[rgba(255,255,255,0.07)]">
          <Calendar size={14} />
          Ago 2025 - Mar 2026
        </button>
        <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-1">
          {["12 meses", "6 meses", "3 meses"].map((label) => (
            <button
              key={label}
              className={`rounded-md px-3 py-1 text-xs transition-all duration-200 ${
                label === "6 meses"
                  ? "bg-[rgba(255,255,255,0.12)] text-white shadow-sm"
                  : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="ml-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-1.5 text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
          <Download size={14} />
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MARKETING_KPIS.map((kpi) => {
          const Icon = ICON_MAP[kpi.icon];
          const isRoas = kpi.label === "ROAS" || kpi.valor === "—";
          const isWarning = isRoas && kpi.valor === "—";
          return (
            <div
              key={kpi.label}
              className={`glass-card rounded-xl p-4 transition-colors ${
                isWarning
                  ? "border border-amber-500/30 bg-amber-500/5"
                  : "border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon
                  size={14}
                  className={isWarning ? "text-amber-400/70" : "text-[rgba(255,255,255,0.4)]"}
                />
                <span
                  className={`text-xs ${
                    isWarning ? "text-amber-400/70" : "text-[rgba(255,255,255,0.4)]"
                  }`}
                >
                  {kpi.label}
                </span>
                {isWarning && (
                  <AlertTriangle size={11} className="text-amber-400/70 ml-auto" />
                )}
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isWarning ? "text-amber-300/60" : "text-white"
                }`}
              >
                {kpi.valor}
              </div>
              <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Insight callout */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] border-l-4 border-l-amber-500/70 px-5 py-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[rgba(255,255,255,0.65)] leading-relaxed">
          <span className="text-amber-400 font-medium">CTR caiu 64% desde Set/25. CPC subiu 113%.</span>
          {" "}Recomendação: revisar criativos e segmentação.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Traffic chart */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Trafego Mensal</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={TRAFEGO_MENSAL} style={{ cursor: "crosshair" }}>
              <defs>
                <linearGradient id="gradSessoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.5)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="rgba(255,255,255,0.5)" stopOpacity={0.01} />
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
              />
              <YAxis
                stroke={CHART_THEME.axis.stroke}
                tick={CHART_THEME.axis.tick}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTrafficTooltip />} cursor={{ stroke: "rgba(255,255,255,0.12)", strokeWidth: 1 }} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                    {value === "sessoes" ? "Sessões" : "Pageviews"}
                  </span>
                )}
                wrapperStyle={{ paddingBottom: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="sessoes"
                stroke="#6366f1"
                fill="url(#gradSessoes)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 1.5 }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="rgba(255,255,255,0.35)"
                fill="url(#gradViews)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: "rgba(255,255,255,0.7)", stroke: "#fff", strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Campaigns table */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Campanhas Meta Ads</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                {["#", "Mes", "Investimento", "Impressoes", "Clicks", "CTR", "CPC", "ROAS"].map((col) => (
                  <th
                    key={col}
                    className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAMPANHAS_META.map((c, idx) => (
                <tr
                  key={c.mes}
                  className={`border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  <td className="px-2 py-3 text-xs text-[rgba(255,255,255,0.25)]">{idx + 1}</td>
                  <td className="px-2 py-3 text-sm text-white font-medium">{c.mes}</td>
                  <td className="px-2 py-3 text-sm text-[rgba(255,255,255,0.8)]">{c.spend}</td>
                  <td className="px-2 py-3 text-sm text-[rgba(255,255,255,0.7)]">{c.impressoes}</td>
                  <td className="px-2 py-3 text-sm text-[rgba(255,255,255,0.7)]">{c.clicks}</td>
                  <td className={`px-2 py-3 text-sm ${getCtrColor(c.ctr)}`}>{c.ctr}</td>
                  <td className="px-2 py-3 text-sm text-[rgba(255,255,255,0.7)]">{c.cpc}</td>
                  <td className={`px-2 py-3 text-sm ${getRoasColor(c.roas)}`}>{c.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
