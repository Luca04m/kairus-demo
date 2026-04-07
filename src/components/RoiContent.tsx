"use client";
import { useCallback, useState, useMemo } from "react";
import { DollarSign, TrendingUp, Target, CheckCircle2, BarChart2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, ReferenceDot,
} from "@/components/charts";
import { ROI_DADOS, ROI_TIMELINE, ROI_CATEGORIAS } from "@/data/mrlion";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { KpiGridSkeleton, SkeletonChart, SkeletonTable } from "@/components/ui/LoadingSkeleton";

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

export function RoiContent() {
  const skip = !isSupabaseConfigured();

  const fetchRoiData = useCallback(async () => {
    const res = await fetch("/api/financial?type=roi");
    if (!res.ok) throw new Error("Failed to fetch ROI data");
    return res.json();
  }, []);

  const fetchRoiTimeline = useCallback(async () => {
    const res = await fetch("/api/financial?type=roi-timeline");
    if (!res.ok) throw new Error("Failed to fetch ROI timeline");
    const json = await res.json();
    return json.timeline ?? json.data ?? [];
  }, []);

  const fetchRoiCategories = useCallback(async () => {
    const res = await fetch("/api/financial?type=roi-categories");
    if (!res.ok) throw new Error("Failed to fetch ROI categories");
    const json = await res.json();
    return json.categorias ?? json.data ?? [];
  }, []);

  const { data: roiDados, loading: loadingRoi } = useSupabaseQuery({
    queryFn: fetchRoiData,
    mockData: ROI_DADOS,
    skip,
  });

  const { data: roiTimeline, loading: loadingTimeline } = useSupabaseQuery({
    queryFn: fetchRoiTimeline,
    mockData: ROI_TIMELINE,
    skip,
  });

  const { data: roiCategorias, loading: loadingCategories } = useSupabaseQuery({
    queryFn: fetchRoiCategories,
    mockData: ROI_CATEGORIAS,
    skip,
  });

  const TOTAL_VALOR = roiCategorias.reduce((sum: number, cat: typeof ROI_CATEGORIAS[number]) => {
    const n = parseInt(cat.valor.replace(/\D/g, ""), 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  // ─── ROI Calculator inputs ──────────────────────────────────────────────────
  const [investMensal, setInvestMensal] = useState(7500);
  const [setupInicial, setSetupInicial] = useState(15000);
  const [meses, setMeses] = useState(6);
  const [receitaExtra, setReceitaExtra] = useState(25000);
  const [economiaOp, setEconomiaOp] = useState(12000);

  const calc = useMemo(() => {
    const totalInvest = setupInicial + investMensal * meses;
    const totalValor = (receitaExtra + economiaOp) * meses;
    const roi = totalInvest > 0 ? ((totalValor - totalInvest) / totalInvest) * 100 : 0;
    const breakEvenMes =
      receitaExtra + economiaOp - investMensal > 0
        ? Math.ceil(setupInicial / (receitaExtra + economiaOp - investMensal))
        : null;
    return { totalInvest, totalValor, roi, breakEvenMes };
  }, [investMensal, setupInicial, meses, receitaExtra, economiaOp]);

  return (
    <div className="p-6 space-y-6">
      {/* Header context */}
      <div>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Investimento vs valor gerado pela sua equipe de IA
        </p>
      </div>

      {/* ROI Calculator */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Calculadora de ROI</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <div>
            <label htmlFor="roi-setup" className="block text-xs text-[rgba(255,255,255,0.45)] mb-1">Setup inicial (R$)</label>
            <input id="roi-setup" type="number" min={0} step={500} value={setupInicial} onChange={(e) => setSetupInicial(Number(e.target.value))} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white tabular-nums outline-none focus:border-[rgba(99,102,241,0.5)] transition-colors" />
          </div>
          <div>
            <label htmlFor="roi-mensal" className="block text-xs text-[rgba(255,255,255,0.45)] mb-1">Investimento mensal (R$)</label>
            <input id="roi-mensal" type="number" min={0} step={500} value={investMensal} onChange={(e) => setInvestMensal(Number(e.target.value))} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white tabular-nums outline-none focus:border-[rgba(99,102,241,0.5)] transition-colors" />
          </div>
          <div>
            <label htmlFor="roi-meses" className="block text-xs text-[rgba(255,255,255,0.45)] mb-1">Periodo (meses)</label>
            <input id="roi-meses" type="number" min={1} max={36} value={meses} onChange={(e) => setMeses(Number(e.target.value))} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white tabular-nums outline-none focus:border-[rgba(99,102,241,0.5)] transition-colors" />
          </div>
          <div>
            <label htmlFor="roi-receita" className="block text-xs text-[rgba(255,255,255,0.45)] mb-1">Receita extra mensal (R$)</label>
            <input id="roi-receita" type="number" min={0} step={1000} value={receitaExtra} onChange={(e) => setReceitaExtra(Number(e.target.value))} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white tabular-nums outline-none focus:border-[rgba(99,102,241,0.5)] transition-colors" />
          </div>
          <div>
            <label htmlFor="roi-economia" className="block text-xs text-[rgba(255,255,255,0.45)] mb-1">Economia operacional mensal (R$)</label>
            <input id="roi-economia" type="number" min={0} step={1000} value={economiaOp} onChange={(e) => setEconomiaOp(Number(e.target.value))} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white tabular-nums outline-none focus:border-[rgba(99,102,241,0.5)] transition-colors" />
          </div>
        </div>
        {/* Computed results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-red-500/15 bg-red-500/5 p-3">
            <p className="text-xs text-[rgba(255,255,255,0.45)] mb-0.5">Investimento total</p>
            <p className="text-lg font-bold text-white tabular-nums">R$ {calc.totalInvest.toLocaleString("pt-BR")}</p>
          </div>
          <div className="rounded-lg border border-green-500/15 bg-green-500/5 p-3">
            <p className="text-xs text-[rgba(255,255,255,0.45)] mb-0.5">Valor gerado</p>
            <p className="text-lg font-bold text-green-400 tabular-nums">R$ {calc.totalValor.toLocaleString("pt-BR")}</p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <p className="text-xs text-[rgba(255,255,255,0.45)] mb-0.5">ROI projetado</p>
            <p className={`text-lg font-bold tabular-nums ${calc.roi >= 0 ? "text-green-300" : "text-red-400"}`}>{calc.roi.toFixed(0)}%</p>
            {calc.breakEvenMes && calc.breakEvenMes > 0 && (
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">Break-even: mes {calc.breakEvenMes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Hero KPI cards */}
      {loadingRoi ? <KpiGridSkeleton count={3} /> : (
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
              R$ {roiDados.investimentoTotal.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1.5">6 meses · setup + mensalidade</p>
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
              R$ {roiDados.valorGerado.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1.5">receita + economia operacional</p>
          </div>
        </div>

        {/* ROI */}
        <div
          className="glass-card rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/15 via-emerald-500/[8%] to-transparent p-6 relative overflow-hidden"
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
            <p className="text-4xl font-bold text-green-300 tabular-nums">{roiDados.roiPercentual}</p>
            <p className="text-xs text-green-400/70 mt-1.5">em 6 meses de operação</p>
          </div>
        </div>
      </div>
      )}

      {/* Summary insight */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] border-l-4 border-l-green-500/70 px-5 py-4 flex items-center gap-3">
        <TrendingUp size={16} className="text-green-400 shrink-0" />
        <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
          Break-even atingido no 3° mes. ROI acumulado de 149% em 6 meses de operação.
        </p>
      </div>

      {/* ROI Timeline chart */}
      {loadingTimeline ? <SkeletonChart height={320} /> : (
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={14} className="text-[rgba(255,255,255,0.4)]" />
          <span className="text-sm font-medium text-white">Evolução do ROI</span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={roiTimeline} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
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
      )}

      {/* Category breakdown table */}
      {loadingCategories ? (
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
          <SkeletonTable rows={5} cols={4} />
        </div>
      ) : (
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
            {roiCategorias.map((cat: typeof ROI_CATEGORIAS[number]) => {
              const raw = parseInt(cat.valor.replace(/\D/g, ""), 10);
              const pct = TOTAL_VALOR > 0 ? Math.round((raw / TOTAL_VALOR) * 100) : 0;
              return (
                <tr
                  key={cat.categoria}
                  className="border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
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
                      <span className="text-xs text-[rgba(255,255,255,0.5)] tabular-nums w-8 text-right">{pct}%</span>
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
                  <span className="text-xs text-[rgba(255,255,255,0.5)] tabular-nums w-8 text-right">100%</span>
                </div>
              </td>
              <td className="px-3 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
      )}
    </div>
  );
}
