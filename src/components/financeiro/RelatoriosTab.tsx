"use client";
import { useState, useCallback } from "react";
import {
  DollarSign, TrendingUp, Target, CreditCard, Repeat2, Users,
  Calendar, CalendarDays, Search, FileText, CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip,
} from "@/components/charts";
import { METRICAS_ECOMMERCE } from "@/data/financeiro";
import { RELATORIOS, AGENTES } from "@/data/mrlion";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";

const tipoBadge: Record<string, string> = {
  Semanal: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Mensal: "bg-purple-500/20 text-purple-400 border border-purple-500/20",
};

const tipoIcon: Record<string, React.ReactNode> = {
  Semanal: <Calendar size={11} className="inline-block mr-1 -mt-px" />,
  Mensal: <CalendarDays size={11} className="inline-block mr-1 -mt-px" />,
};

export function RelatoriosTab() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [detailReport, setDetailReport] = useState<typeof RELATORIOS[number] | null>(null);
  const [showGerarDialog, setShowGerarDialog] = useState(false);
  const [gerarTipo, setGerarTipo] = useState("Semanal");
  const [gerarDe, setGerarDe] = useState("");
  const [gerarAte, setGerarAte] = useState("");
  const [gerarFeedback, setGerarFeedback] = useState(false);
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
            <button
              onClick={() => setShowGerarDialog(true)}
              className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.88)] hover:bg-[rgba(255,255,255,0.75)] px-4 py-2 text-xs font-medium text-[#080808] transition-colors"
            >
              + Gerar relatorio
            </button>
          </div>

          {/* Gerar relatorio dialog */}
          {showGerarDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,20,0.95)] backdrop-blur-md p-6 w-full max-w-md shadow-2xl">
                {gerarFeedback ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                    <p className="text-sm font-medium text-white">Relatorio gerado com sucesso!</p>
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">O relatorio aparecera na lista em instantes.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-white mb-4">Gerar relatorio</h2>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[rgba(255,255,255,0.5)] mb-1">Tipo</label>
                        <select value={gerarTipo} onChange={(e) => setGerarTipo(e.target.value)} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none appearance-none focus:border-indigo-400/60">
                          <option>Semanal</option>
                          <option>Mensal</option>
                          <option>Trimestral</option>
                          <option>Customizado</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[rgba(255,255,255,0.5)] mb-1">De</label>
                          <input type="date" value={gerarDe} onChange={(e) => setGerarDe(e.target.value)} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[rgba(255,255,255,0.5)] mb-1">Ate</label>
                          <input type="date" value={gerarAte} onChange={(e) => setGerarAte(e.target.value)} className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-5">
                      <button onClick={() => setShowGerarDialog(false)} className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-sm text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">Cancelar</button>
                      <button onClick={() => { setGerarFeedback(true); setTimeout(() => { setShowGerarDialog(false); setGerarFeedback(false); }, 1500); }} className="rounded-lg bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors">Gerar</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

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
                className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[rgba(255,255,255,0.16)] transition-colors"
              />
            </div>
          </div>

          {/* Report cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 h-40 animate-pulse" />
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
                  <div key={rel.id} className="glass-card group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 transition-all duration-200 hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.06)]">
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
                      <button onClick={() => setDetailReport(rel)} className="rounded-md bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] px-2.5 py-0.5 text-[11px] font-medium text-white transition-colors">Ver</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail modal */}
        {detailReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailReport(null)}>
            <div onClick={(e) => e.stopPropagation()} className="glass-card rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,20,0.95)] backdrop-blur-md p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tipoBadge[detailReport.tipo]}`}>
                  {tipoIcon[detailReport.tipo]}{detailReport.tipo}
                </span>
                <button onClick={() => setDetailReport(null)} className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors text-lg">&times;</button>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{detailReport.titulo}</h3>
              <p className="text-xs text-[rgba(255,255,255,0.5)] mb-3">{detailReport.periodo}</p>
              <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed mb-4">{detailReport.resumo}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <span className="text-xs text-[rgba(255,255,255,0.5)]">Agente:</span>
                <span className="text-xs text-white font-medium">{detailReport.agente}</span>
                <span className="ml-auto text-xs text-[rgba(255,255,255,0.4)]">Status: {detailReport.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
