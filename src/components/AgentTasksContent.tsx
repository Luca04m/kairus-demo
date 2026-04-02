"use client";
import { Settings2, Search, SlidersHorizontal, CheckCircle2, Loader2, Circle, XCircle } from "lucide-react";
import { useState } from "react";

type TarefaStatus = "em_progresso" | "concluida" | "pendente" | "falha";

interface Tarefa {
  id: string;
  titulo: string;
  status: TarefaStatus;
  tempo: string;
  resultado: string | null;
}

const AGENT_TAREFAS: Tarefa[] = [
  { id: "AT-01", titulo: "Monitorar margem Honey Pingente", status: "em_progresso", tempo: "há 2h", resultado: "Margem -3,2% detectada" },
  { id: "AT-02", titulo: "Gerar relatório semanal S13", status: "concluida", tempo: "há 5h", resultado: "Relatório entregue" },
  { id: "AT-03", titulo: "Detectar chargebacks suspeitos", status: "em_progresso", tempo: "há 1h", resultado: "2 casos em análise" },
  { id: "AT-04", titulo: "Atualizar DRE Mar/2026", status: "pendente", tempo: "há 30min", resultado: null },
  { id: "AT-05", titulo: "Calcular CMV por produto", status: "concluida", tempo: "há 1d", resultado: "8 produtos analisados" },
  { id: "AT-06", titulo: "Revisar precificação Honey", status: "falha", tempo: "há 3h", resultado: "Dados insuficientes" },
];

const STATUS_CONFIG: Record<TarefaStatus, {
  label: string;
  icon: React.ElementType;
  dot: string;
  badge: string;
  text: string;
}> = {
  concluida: {
    label: "Concluída",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-400",
  },
  em_progresso: {
    label: "Em progresso",
    icon: Loader2,
    dot: "bg-blue-400",
    badge: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-400",
  },
  pendente: {
    label: "Pendente",
    icon: Circle,
    dot: "bg-[rgba(255,255,255,0.3)]",
    badge: "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)]",
    text: "text-[rgba(255,255,255,0.4)]",
  },
  falha: {
    label: "Falha",
    icon: XCircle,
    dot: "bg-red-400",
    badge: "bg-red-500/10 border-red-500/20",
    text: "text-red-400",
  },
};

const ALL_STATUSES: TarefaStatus[] = ["em_progresso", "concluida", "pendente", "falha"];

export function AgentTasksContent() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TarefaStatus | null>(null);

  const filtered = AGENT_TAREFAS.filter((t) => {
    const matchSearch = t.titulo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === null || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Tarefas</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">Esta é uma visão geral de todas as tarefas deste agente</p>
        </div>
        <button className="rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors">
          Criar tarefa
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {/* Status filter pills */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterStatus(null)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              filterStatus === null
                ? "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] text-white"
                : "border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.04)]"
            }`}
          >
            <Settings2 size={12} />
            Todos
          </button>
          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  filterStatus === s
                    ? `${cfg.badge} ${cfg.text}`
                    : "border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
            <Search size={14} className="text-[rgba(255,255,255,0.4)]" />
            <input
              className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-48"
              placeholder="Pesquisar tarefas por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]">
            <SlidersHorizontal size={14} />
            Visualizar
          </button>
        </div>
      </div>

      {/* Tasks table */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_6rem_7rem_1fr_5rem] gap-3 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] text-xs text-[rgba(255,255,255,0.35)] font-medium uppercase tracking-wide">
          <span>#</span>
          <span>Tarefa</span>
          <span>Status</span>
          <span>Tempo</span>
          <span>Resultado</span>
          <span className="text-right">Ações</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-[rgba(255,255,255,0.4)]">Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          filtered.map((tarefa, idx) => {
            const cfg = STATUS_CONFIG[tarefa.status];
            const Icon = cfg.icon;
            const isLast = idx === filtered.length - 1;
            return (
              <div
                key={tarefa.id}
                className={`grid grid-cols-[2rem_1fr_6rem_7rem_1fr_5rem] gap-3 px-4 py-3 items-center hover:bg-[rgba(255,255,255,0.03)] transition-colors ${!isLast ? "border-b border-[rgba(255,255,255,0.05)]" : ""}`}
              >
                {/* ID */}
                <span className="text-xs text-[rgba(255,255,255,0.25)] font-mono">{tarefa.id}</span>

                {/* Title */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <span className="text-sm text-white truncate">{tarefa.titulo}</span>
                </div>

                {/* Status badge */}
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.badge} ${cfg.text}`}>
                    <Icon size={10} className={tarefa.status === "em_progresso" ? "animate-spin" : ""} />
                    {cfg.label}
                  </span>
                </div>

                {/* Timestamp */}
                <span className="text-xs text-[rgba(255,255,255,0.35)]">{tarefa.tempo}</span>

                {/* Result */}
                <span className="text-xs text-[rgba(255,255,255,0.5)] truncate">
                  {tarefa.resultado ?? <span className="text-[rgba(255,255,255,0.2)] italic">—</span>}
                </span>

                {/* Actions */}
                <div className="flex justify-end">
                  <button className="rounded-lg border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                    Ver
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      <p className="mt-3 text-xs text-[rgba(255,255,255,0.3)]">{filtered.length} tarefa{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
