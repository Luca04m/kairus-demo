"use client";

import { CheckCircle2, XCircle, ThumbsUp, Clock, Activity, Zap, Bot } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Agent data with enriched role descriptions & activity logs          */
/* ------------------------------------------------------------------ */

interface AgentInfo {
  id: string;
  nome: string;
  iniciais: string;
  role: string;
  cor: string;
  status: "ativo" | "pausado";
  currentTask: string;
  tarefasConcluidas: number;
  tarefasFalhadas: number;
  taxaAprovacao: string;
  uptime: string;
  activityLog: { action: string; tempo: string }[];
}

const AGENTS: AgentInfo[] = [
  {
    id: "leo",
    nome: "Leo",
    iniciais: "LE",
    role: "Vendas",
    cor: "#ec4899",
    status: "ativo",
    currentTask: "Monitorando pipeline de R$ 312K",
    tarefasConcluidas: 47,
    tarefasFalhadas: 2,
    taxaAprovacao: "96%",
    uptime: "99.8%",
    activityLog: [
      { action: "Qualificou 8 leads B2B automaticamente", tempo: "ha 12min" },
      { action: "Enviou follow-up para 5 prospects inativos", tempo: "ha 1h" },
      { action: "Atualizou forecast semanal no CRM", tempo: "ha 2h" },
    ],
  },
  {
    id: "mia",
    nome: "Mia",
    iniciais: "MI",
    role: "Marketing",
    cor: "#6366f1",
    status: "ativo",
    currentTask: "Otimizando campanha Meta Ads",
    tarefasConcluidas: 83,
    tarefasFalhadas: 5,
    taxaAprovacao: "94%",
    uptime: "99.5%",
    activityLog: [
      { action: "Reduziu CPC da campanha Verao 2026 em 18%", tempo: "ha 45min" },
      { action: "Criou 3 variacoes de copy para A/B test", tempo: "ha 2h" },
      { action: "Gerou relatorio ROAS semanal", tempo: "ha 4h" },
    ],
  },
  {
    id: "rex",
    nome: "Rex",
    iniciais: "RE",
    role: "Financeiro",
    cor: "#22c55e",
    status: "ativo",
    currentTask: "Analisando DRE Fevereiro",
    tarefasConcluidas: 61,
    tarefasFalhadas: 3,
    taxaAprovacao: "95%",
    uptime: "99.1%",
    activityLog: [
      { action: "Detectou margem negativa no Honey Pingente", tempo: "ha 1h" },
      { action: "Consolidou fluxo de caixa do mes", tempo: "ha 3h" },
      { action: "Alertou sobre 4 chargebacks pendentes", tempo: "ha 5h" },
    ],
  },
  {
    id: "sol",
    nome: "Sol",
    iniciais: "SO",
    role: "Suporte",
    cor: "#f59e0b",
    status: "ativo",
    currentTask: "Respondendo 3 tickets abertos",
    tarefasConcluidas: 52,
    tarefasFalhadas: 1,
    taxaAprovacao: "98%",
    uptime: "99.4%",
    activityLog: [
      { action: "Resolveu ticket #482 — troca de produto", tempo: "ha 30min" },
      { action: "Respondeu 23 mensagens WhatsApp", tempo: "ha 1h" },
      { action: "Escalou caso #475 para atendimento humano", tempo: "ha 3h" },
    ],
  },
  {
    id: "iris",
    nome: "Iris",
    iniciais: "IR",
    role: "Dados",
    cor: "#06b6d4",
    status: "ativo",
    currentTask: "Processando 428K sessions analytics",
    tarefasConcluidas: 156,
    tarefasFalhadas: 8,
    taxaAprovacao: "95%",
    uptime: "98.9%",
    activityLog: [
      { action: "Gerou dashboard de cohort analysis", tempo: "ha 20min" },
      { action: "Cruzou dados GA4 + Meta Pixel", tempo: "ha 2h" },
      { action: "Detectou anomalia no bounce rate", tempo: "ha 4h" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Aggregate stats                                                     */
/* ------------------------------------------------------------------ */

const totalConcluidas = AGENTS.reduce((s, a) => s + a.tarefasConcluidas, 0);

const statusCor: Record<string, string> = {
  ativo: "bg-green-500",
  pausado: "bg-yellow-500",
};

const statusLabel: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function EquipeContent() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot size={20} className="text-[rgba(255,255,255,0.5)]" />
          Visao Geral
        </h2>
        <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">
          Status dos agentes IA em operacao
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">5 agentes ativos</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Todos operacionais</p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{totalConcluidas} tarefas concluidas</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Hoje</p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">99.2% uptime</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Media dos agentes</p>
          </div>
        </div>
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="group relative rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-[rgba(255,255,255,0.13)]"
            style={{ borderLeft: `3px solid ${agent.cor}` }}
          >
            {/* Role + status row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[rgba(255,255,255,0.4)]">{agent.role}</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[rgba(255,255,255,0.4)]">
                <span className="relative flex h-2 w-2">
                  {agent.status === "ativo" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${statusCor[agent.status]}`}
                  />
                </span>
                {statusLabel[agent.status]}
              </span>
            </div>

            {/* Avatar + name + current task */}
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0"
                style={{
                  backgroundColor: `${agent.cor}30`,
                  border: `1.5px solid ${agent.cor}50`,
                }}
              >
                {agent.iniciais}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{agent.nome}</p>
                <p className="text-xs text-[rgba(255,255,255,0.5)] leading-snug mt-0.5">
                  {agent.currentTask}
                </p>
              </div>
            </div>

            {/* Mini activity log */}
            <div className="rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] px-3 py-2 flex flex-col gap-1.5">
              {agent.activityLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Clock
                    size={10}
                    className="mt-0.5 flex-shrink-0 text-[rgba(255,255,255,0.35)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[rgba(255,255,255,0.6)] leading-snug">
                      {entry.action}
                    </p>
                    <span className="text-[10px] text-[rgba(255,255,255,0.3)]">
                      {entry.tempo}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance metrics */}
            <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.45)]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" />
                {agent.tarefasConcluidas}
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={12} className="text-red-500" />
                {agent.tarefasFalhadas}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp size={12} className="text-[rgba(255,255,255,0.5)]" />
                {agent.taxaAprovacao}
              </span>
              <span className="ml-auto text-[10px] text-[rgba(255,255,255,0.3)]">
                uptime {agent.uptime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
