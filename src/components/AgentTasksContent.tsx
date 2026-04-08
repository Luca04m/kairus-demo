"use client";
import { Settings2, Search, SlidersHorizontal, CheckCircle2, Loader2, Circle, XCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { AGENT_TASKS_DEMO } from "@/data/mrlion";
import { SkeletonTable, ErrorState } from "@/components/ui/LoadingSkeleton";

type TarefaStatus = "em_progresso" | "concluida" | "pendente" | "falha";

interface Tarefa {
  id: string;
  titulo: string;
  status: TarefaStatus;
  tempo: string;
  resultado: string | null;
}

const AGENT_TAREFAS_MOCK: Tarefa[] = AGENT_TASKS_DEMO.map((t) => ({
  id: t.id,
  titulo: t.titulo,
  status: t.status as TarefaStatus,
  tempo: t.tempo,
  resultado: t.resultado ?? null,
}));

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
    dot: "bg-[rgba(255,255,255,0.4)]",
    badge: "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)]",
    text: "text-[rgba(255,255,255,0.4)]",
  },
  pendente: {
    label: "Pendente",
    icon: Circle,
    dot: "bg-[rgba(255,255,255,0.3)]",
    badge: "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]",
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
  const skip = !isSupabaseConfigured();

  const fetchAgentTasks = useCallback(async () => {
    const res = await fetch("/api/agents?scope=tasks");
    if (!res.ok) throw new Error("Failed to fetch agent tasks");
    const json = await res.json();
    return (json.data ?? json ?? []) as Tarefa[];
  }, []);

  const { data: AGENT_TAREFAS, loading, error, refetch } = useSupabaseQuery({
    queryFn: fetchAgentTasks,
    mockData: AGENT_TAREFAS_MOCK,
    skip,
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TarefaStatus | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [extraTasks, setExtraTasks] = useState<Tarefa[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState<TarefaStatus>("pendente");

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-6 w-32 animate-pulse rounded bg-[rgba(255,255,255,0.06)] mb-2" />
          <div className="h-4 w-64 animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />
        </div>
        <SkeletonTable rows={6} cols={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message="Erro ao carregar tarefas do agente." onRetry={refetch} />
      </div>
    );
  }

  const allTasks = [...AGENT_TAREFAS, ...extraTasks];

  const filtered = allTasks.filter((t) => {
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
        <button
          onClick={() => setShowDialog(true)}
          className="rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors"
        >
          Criar tarefa
        </button>
      </div>

      {/* Create task dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,20,0.95)] backdrop-blur-md p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Nova tarefa do agente</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[rgba(255,255,255,0.5)] mb-1">Titulo*</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Analisar metricas de vendas"
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none focus:border-[rgba(1,196,97,0.6)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[rgba(255,255,255,0.5)] mb-1">Descricao</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Descreva a tarefa..."
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none resize-none focus:border-[rgba(1,196,97,0.6)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[rgba(255,255,255,0.5)] mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TarefaStatus)}
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none appearance-none focus:border-[rgba(1,196,97,0.6)]"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_progresso">Em progresso</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => { setShowDialog(false); setNewTitle(""); setNewDesc(""); setNewStatus("pendente"); }}
                className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-sm text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={!newTitle.trim()}
                onClick={() => {
                  const id = `AT-${String(allTasks.length + 1).padStart(3, "0")}`;
                  const now = new Date();
                  const tempo = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                  setExtraTasks((prev) => [...prev, {
                    id, titulo: newTitle.trim(), status: newStatus, tempo,
                    resultado: newDesc.trim() || null,
                  }]);
                  setShowDialog(false); setNewTitle(""); setNewDesc(""); setNewStatus("pendente");
                }}
                className="rounded-lg bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {/* Status filter pills */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterStatus(null)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              filterStatus === null
                ? "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] text-white"
                : "border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.02)]"
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
                    : "border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.02)]"
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
          <button disabled title="Alternar visualização em breve" className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] opacity-50 cursor-not-allowed">
            <SlidersHorizontal size={14} />
            Visualizar
          </button>
        </div>
      </div>

      {/* Tasks table */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_6rem_7rem_1fr_5rem] gap-3 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] text-xs text-[rgba(255,255,255,0.5)] font-medium uppercase tracking-wide">
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
                <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono">{tarefa.id}</span>

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
                <span className="text-xs text-[rgba(255,255,255,0.5)]">{tarefa.tempo}</span>

                {/* Result */}
                <span className="text-xs text-[rgba(255,255,255,0.5)] truncate">
                  {tarefa.resultado ?? <span className="text-[rgba(255,255,255,0.5)] italic">—</span>}
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
      <p className="mt-3 text-xs text-[rgba(255,255,255,0.5)]">{filtered.length} tarefa{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
