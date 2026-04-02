"use client";
import { DollarSign, TrendingUp, Target, CheckCircle2, BarChart2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, ReferenceDot,
} from "recharts";
import { ROI_DADOS, ROI_TIMELINE, ROI_CATEGORIAS } from "@/data/mrlion";

const CHART_THEME = {
  grid: { stroke: "rgba(255,255,255,0.06)", strokeDasharray: "3 3" },
  axis: { stroke: "rgba(255,255,255,0.08)", tick: { fill: "rgba(255,255,255,0.4)", fontSize: 11 } },
  tooltip: {
    contentStyle: {
      backgroundColor: "#111111",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "8px",
      color: "white",
      fontSize: "12px",
    },
  },
};

const TOTAL_VALOR = ROI_CATEGORIAS.reduce((sum, cat) => {
  const n = parseInt(cat.valor.replace(/\D/g, ""), 10);
  return sum + (isNaN(n) ? 0 : n);
}, 0);

export function RoiContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">ROI / Impacto</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Investimento vs valor gerado pela sua equipe de IA
        </p>
      </div>

      {/* Hero KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Investimento Acumulado */}
        <div className="glass-card rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                <DollarSign size={14} className="text-red-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)]">
                Investimento Acumulado
              </p>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">
              R$ {ROI_DADOS.investimentoTotal.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1.5">6 meses · setup + mensalidade</p>
          </div>
        </div>

        {/* Valor Gerado */}
        <div className="glass-card rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <TrendingUp size={14} className="text-green-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)]">
                Valor Gerado
              </p>
            </div>
            <p className="text-3xl font-bold text-green-400 tabular-nums">
              R$ {ROI_DADOS.valorGerado.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1.5">receita + economia operacional</p>
          </div>
        </div>

        {/* ROI */}
        <div
          className="glass-card rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/15 via-emerald-500/8 to-transparent p-6 relative overflow-hidden"
          style={{ boxShadow: "var(--shadow-glow-green)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/15 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Target size={14} className="text-green-300" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.45)]">
                ROI
              </p>
            </div>
            <p className="text-4xl font-bold text-green-300 tabular-nums">{ROI_DADOS.roiPercentual}</p>
            <p className="text-xs text-green-400/70 mt-1.5">em 6 meses de operação</p>
          </div>
        </div>
      </div>

      {/* Summary insight */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] border-l-4 border-l-green-500/70 px-5 py-4 flex items-center gap-3">
        <TrendingUp size={16} className="text-green-400 shrink-0" />
        <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
          Break-even atingido no 3° mes. ROI acumulado de 149% em 6 meses de operação.
        </p>
      </div>

      {/* ROI Timeline chart */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={14} className="text-[rgba(255,255,255,0.4)]" />
          <span className="text-sm font-medium text-white">Evolução do ROI</span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={ROI_TIMELINE} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="85%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="valorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="85%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
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
              tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`}
              width={56}
            />
            <Tooltip
              contentStyle={CHART_THEME.tooltip.contentStyle}
              formatter={(value: number, name: string) => [
                `R$ ${value.toLocaleString("pt-BR")}`,
                name === "investimento" ? "Investimento" : "Valor Gerado",
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === "investimento" ? "Investimento" : "Valor Gerado"
              }
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              iconType="circle"
            />
            <ReferenceLine
              x="Jan/26"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={{
                value: "Break-even",
                fill: "rgba(255,255,255,0.65)",
                fontSize: 11,
                fontWeight: 600,
                position: "insideTopRight",
              }}
            />
            <ReferenceDot
              x="Jan/26"
              y={82000}
              r={5}
              fill="#22c55e"
              stroke="rgba(34,197,94,0.4)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="investimento"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#investGrad)"
              dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: "rgba(239,68,68,0.4)", strokeWidth: 3 }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#valorGrad)"
              dot={{ fill: "#22c55e", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: "rgba(34,197,94,0.4)", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table */}
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
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.4)] hidden sm:table-cell">Contribuição</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.4)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROI_CATEGORIAS.map((cat) => {
              const raw = parseInt(cat.valor.replace(/\D/g, ""), 10);
              const pct = TOTAL_VALOR > 0 ? Math.round((raw / TOTAL_VALOR) * 100) : 0;
              return (
                <tr
                  key={cat.categoria}
                  className="border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                >
                  <td className="px-3 py-3 text-sm text-white">{cat.categoria}</td>
                  <td className="px-3 py-3 text-sm font-medium text-white tabular-nums">{cat.valor}</td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden min-w-[60px]">
                        <div
                          className={`h-full rounded-full transition-all ${cat.verificado ? "bg-green-500" : "bg-amber-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-[rgba(255,255,255,0.35)] tabular-nums w-8 text-right">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {cat.verificado ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-green-500/20 text-green-400 border border-green-500/20">
                        <CheckCircle2 size={11} />
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/20">
                        <BarChart2 size={11} />
                        Estimado
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-[rgba(255,255,255,0.12)]">
              <td className="px-3 py-3 text-sm font-semibold text-white">Total</td>
              <td className="px-3 py-3 text-sm font-bold text-green-400 tabular-nums">
                R$ {TOTAL_VALOR.toLocaleString("pt-BR")}
              </td>
              <td className="px-3 py-3 hidden sm:table-cell">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-green-500/30 min-w-[60px]" />
                  <span className="text-xs text-[rgba(255,255,255,0.35)] tabular-nums w-8 text-right">100%</span>
                </div>
              </td>
              <td className="px-3 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
