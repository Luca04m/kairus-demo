"use client";
import { useCallback } from "react";
import {
  DollarSign, Eye, Target, AlertTriangle, BarChart2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "@/components/charts";
import { META_ADS_DATA, CAMPANHAS_META_ROI } from "@/data/financeiro";
import { ROI_DADOS, ROI_TIMELINE, ROI_CATEGORIAS } from "@/data/roi";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonChart } from "@/components/ui/LoadingSkeleton";
import { CHART_THEME, fmtBRL } from "./chart-theme";

export function RoiImpactoTab() {
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
      <div className="glass-card rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
          {META_ADS_DATA.pixelNote}
        </p>
      </div>

      {/* Campanhas Meta */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-[#01C461]" />
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
                <tr key={c.nome} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
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
              <Tooltip contentStyle={{ backgroundColor: "#0d0d14", border: "1px solid rgba(1,196,97,0.25)", borderRadius: 12, color: "white", fontSize: 12 }} formatter={(value: number, name: string) => [`R$ ${value.toLocaleString("pt-BR")}`, name === "investimento" ? "Investimento" : "Valor Gerado"]} />
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
                <tr key={cat.categoria} className="border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
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
