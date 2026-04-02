"use client";
import { useCallback } from "react";
import { Activity, Bell, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { KPIS_VISAO_GERAL, ATIVIDADE_RECENTE, ALERTAS, AGENTES } from "@/data/mrlion";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { KpiGridSkeleton, AgentGridSkeleton, SkeletonRow } from "@/components/ui/LoadingSkeleton";

// Map KPI departamento label → accent color
const kpiAccentColor: Record<string, string> = {
  Financeiro: "#22c55e",
  Marketing: "#6366f1",
  Vendas: "#ec4899",
  Operacoes: "#f59e0b",
  Atendimento: "#06b6d4",
};

const severidadeCor: Record<string, string> = {
  critico: "bg-red-500",
  alto: "bg-orange-500",
  medio: "bg-yellow-500",
  baixo: "bg-blue-500",
  info: "bg-[rgba(255,255,255,0.4)]",
};

const variacaoCor: Record<string, string> = {
  down: "text-red-400",
  up: "text-green-400",
  neutral: "text-[rgba(255,255,255,0.4)]",
};

const statusDot: Record<string, string> = {
  ativo: "bg-green-400",
  pausado: "bg-yellow-400",
  idle: "bg-[rgba(255,255,255,0.25)]",
};

// Time-aware greeting (Bom dia default for demo)
function getGreeting(): string {
  if (typeof window === "undefined") return "Bom dia";
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

function getAgenteByNome(nome: string) {
  return AGENTES.find((a) => a.nome === nome);
}

function getIniciais(nomeAgente: string): string {
  return getAgenteByNome(nomeAgente)?.iniciais ?? nomeAgente.slice(0, 2).toUpperCase();
}

function getAgenteCor(nomeAgente: string): string {
  return getAgenteByNome(nomeAgente)?.departamentoCor ?? "rgba(255,255,255,0.15)";
}

function VariacaoIcon({ direcao }: { direcao: "up" | "down" | "neutral" }) {
  if (direcao === "up") return <TrendingUp size={12} className="text-green-400 flex-shrink-0" />;
  if (direcao === "down") return <TrendingDown size={12} className="text-red-400 flex-shrink-0" />;
  return <Minus size={12} className="text-[rgba(255,255,255,0.4)] flex-shrink-0" />;
}

export function HomeContent() {
  const skip = !isSupabaseConfigured();

  const fetchKpis = useCallback(async () => {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) throw new Error("Failed to fetch KPIs");
    const json = await res.json();
    return json.kpis ?? [];
  }, []);

  const fetchActivity = useCallback(async () => {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) throw new Error("Failed to fetch activity");
    const json = await res.json();
    return json.atividade ?? [];
  }, []);

  const fetchAlerts = useCallback(async () => {
    const res = await fetch("/api/alerts");
    if (!res.ok) throw new Error("Failed to fetch alerts");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const fetchAgents = useCallback(async () => {
    const res = await fetch("/api/agents");
    if (!res.ok) throw new Error("Failed to fetch agents");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const { data: kpis, loading: loadingKpis } = useSupabaseQuery({
    queryFn: fetchKpis,
    mockData: KPIS_VISAO_GERAL,
    skip,
  });

  const { data: atividade, loading: loadingActivity } = useSupabaseQuery({
    queryFn: fetchActivity,
    mockData: ATIVIDADE_RECENTE,
    skip,
  });

  const { data: alertas, loading: loadingAlerts } = useSupabaseQuery({
    queryFn: fetchAlerts,
    mockData: ALERTAS,
    skip,
  });

  const { data: agentes, loading: loadingAgents } = useSupabaseQuery({
    queryFn: fetchAgents,
    mockData: AGENTES,
    skip,
  });

  const alertasCriticosAltos = alertas.filter(
    (a: typeof ALERTAS[number]) => a.severidade === "critico" || a.severidade === "alto"
  ).length;

  const greeting = getGreeting();

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Page header */}
      <div className="pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <h1 className="text-xl font-semibold text-white">
          {greeting}, Luca
        </h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)] mt-0.5">
          Quarta-feira, 2 de Abril de 2026
        </p>
        <p className="text-xs text-[rgba(255,255,255,0.25)] mt-1">
          Aqui está o resumo da sua operação
        </p>
      </div>

      {/* KPI cards — responsive grid */}
      {loadingKpis ? <KpiGridSkeleton count={5} /> : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const accent = kpiAccentColor[kpi.departamento] ?? "rgba(255,255,255,0.4)";
          return (
            <div
              key={kpi.label}
              className="glass-card rounded-xl p-4 relative overflow-hidden"
            >
              {/* Subtle left accent bar */}
              <div
                className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-60"
                style={{ backgroundColor: accent }}
              />
              <div className="flex items-center gap-1.5 mb-2 pl-3">
                <span className="text-sm">{kpi.emoji}</span>
                <span className="text-xs text-[rgba(255,255,255,0.4)]">{kpi.label}</span>
              </div>
              <div className="text-2xl font-semibold text-white pl-3">{kpi.valor}</div>
              {kpi.variacao && (
                <div className={`flex items-center gap-1 text-xs mt-1 pl-3 ${variacaoCor[kpi.direcao]}`}>
                  <VariacaoIcon direcao={kpi.direcao} />
                  {kpi.variacao}
                </div>
              )}
              {kpi.periodo && (
                <div className="text-[10px] text-[rgba(255,255,255,0.3)] mt-0.5 pl-3">
                  {kpi.periodo}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Activity + Alerts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
            <Activity size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Atividade Recente</span>
          </div>
          <div className="flex flex-col gap-2">
            {loadingActivity ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={`skel-activity-${i}`} />) : atividade.map((item, i) => {
              const cor = getAgenteCor(item.agente);
              return (
                <div
                  key={item.acao ? `${item.agente}-${item.tempo}-${i}` : `activity-${i}`}
                  className="flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-[rgba(255,255,255,0.04)] cursor-default"
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: `${cor}33`, border: `1px solid ${cor}55` }}
                  >
                    {getIniciais(item.agente)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-snug">{item.acao}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.35)] mt-0.5">{item.tempo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
            <Bell size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Alertas</span>
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-medium text-red-400">
              {alertasCriticosAltos}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {loadingAlerts ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={`skel-alert-${i}`} />) : alertas.slice(0, 5).map((alerta) => {
              const isCritico = alerta.severidade === "critico";
              return (
                <div key={alerta.id} className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${severidadeCor[alerta.severidade]}`}
                    style={isCritico ? { animation: "pulseSoft 1.6s ease-in-out infinite" } : undefined}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-snug">{alerta.titulo}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.35)] mt-0.5">{alerta.tempo}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Ver todos link */}
          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
            <button className="text-xs text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-150">
              Ver todos os alertas →
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(255,255,255,0.06)]" />

      {/* Agentes overview row */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-white">Agentes</span>
          <span className="text-xs text-[rgba(255,255,255,0.35)]">
            {agentes.filter((a: typeof AGENTES[number]) => a.status === "ativo").length} ativos de {agentes.length}
          </span>
        </div>
        {loadingAgents ? <AgentGridSkeleton count={5} /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {agentes.map((agente: typeof AGENTES[number]) => (
            <div
              key={agente.id}
              className="glass-card rounded-xl p-4"
            >
              {/* Avatar + status */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{
                    backgroundColor: `${agente.departamentoCor}33`,
                    border: `1px solid ${agente.departamentoCor}55`,
                  }}
                >
                  {agente.iniciais}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-white">{agente.nome}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${statusDot[agente.status]}`}
                      style={
                        agente.status === "ativo"
                          ? { animation: "pulseSoft 2s ease-in-out infinite" }
                          : undefined
                      }
                    />
                  </div>
                  <span className="text-[10px] text-[rgba(255,255,255,0.35)]">
                    {agente.departamento.charAt(0).toUpperCase() + agente.departamento.slice(1)}
                  </span>
                </div>
              </div>
              {/* Last action */}
              <p className="text-[11px] text-[rgba(255,255,255,0.5)] leading-snug line-clamp-2">
                {agente.ultimaAcao}
              </p>
              <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-1.5">
                {agente.ultimaAcaoTempo}
              </p>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
