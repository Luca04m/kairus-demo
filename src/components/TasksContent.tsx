"use client";
import { useState, useCallback } from "react";
import {
  Settings2,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Loader2,
  Circle,
  XCircle,
  LayoutList,
  LayoutGrid,
  Columns3,
} from "lucide-react";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonTable } from "@/components/ui/LoadingSkeleton";

type Status = "em_progresso" | "concluida" | "pendente" | "falha";
type Prioridade = "alta" | "media" | "baixa";

interface Tarefa {
  id: string;
  titulo: string;
  agente: string;
  iniciais: string;
  cor: string;
  status: Status;
  prioridade: Prioridade;
  departamento: string;
  criadaEm: string;
  descricao: string;
}

const TAREFAS_MOCK: Tarefa[] = [
  { id: "T-001", titulo: "Monitorar margem por produto", agente: "Leo", iniciais: "LE", cor: "#22c55e", status: "em_progresso", prioridade: "alta", departamento: "Financeiro", criadaEm: "28/03/2026", descricao: "Análise contínua de margens" },
  { id: "T-002", titulo: "Otimizar campanha Meta 'Verão 2026'", agente: "Mia", iniciais: "MI", cor: "#a1a1aa", status: "concluida", prioridade: "alta", departamento: "Marketing", criadaEm: "25/03/2026", descricao: "CPC reduzido em 18%" },
  { id: "T-003", titulo: "Reposição estoque Honey Garrafa", agente: "Sol", iniciais: "SO", cor: "#f59e0b", status: "pendente", prioridade: "alta", departamento: "Operações", criadaEm: "30/03/2026", descricao: "Estoque crítico <50 un" },
  { id: "T-004", titulo: "Enviar lembretes recompra B2B", agente: "Rex", iniciais: "RE", cor: "#71717a", status: "concluida", prioridade: "media", departamento: "Vendas", criadaEm: "29/03/2026", descricao: "12 clientes notificados" },
  { id: "T-005", titulo: "Responder WhatsApp automático", agente: "Iris", iniciais: "IR", cor: "#a1a1aa", status: "em_progresso", prioridade: "media", departamento: "Atendimento", criadaEm: "01/04/2026", descricao: "23 mensagens respondidas" },
  { id: "T-006", titulo: "Gerar relatório semanal S13", agente: "Leo", iniciais: "LE", cor: "#22c55e", status: "concluida", prioridade: "media", departamento: "Financeiro", criadaEm: "31/03/2026", descricao: "Relatório entregue" },
  { id: "T-007", titulo: "Publicar conteúdo Instagram", agente: "Mia", iniciais: "MI", cor: "#a1a1aa", status: "concluida", prioridade: "baixa", departamento: "Marketing", criadaEm: "30/03/2026", descricao: "3 posts, alcance 12.4k" },
  { id: "T-008", titulo: "Detectar chargebacks suspeitos", agente: "Leo", iniciais: "LE", cor: "#22c55e", status: "em_progresso", prioridade: "alta", departamento: "Financeiro", criadaEm: "01/04/2026", descricao: "Monitoramento ativo" },
  { id: "T-009", titulo: "Processar reenvios pendentes", agente: "Sol", iniciais: "SO", cor: "#f59e0b", status: "concluida", prioridade: "media", departamento: "Operações", criadaEm: "29/03/2026", descricao: "5 reenvios processados" },
  { id: "T-010", titulo: "Análise de ROAS mensal", agente: "Mia", iniciais: "MI", cor: "#a1a1aa", status: "falha", prioridade: "alta", departamento: "Marketing", criadaEm: "01/04/2026", descricao: "Sem dados purchase Mar/26" },
];

const DEPT_COLORS: Record<string, string> = {
  Financeiro: "#22c55e",
  Marketing: "#01C461",
  Operações: "#f59e0b",
  Vendas: "rgba(1,196,97,0.7)",
  Atendimento: "#a1a1aa",
};

function StatusIcon({ status }: { status: Status }) {
  switch (status) {
    case "concluida":
      return <CheckCircle2 size={15} className="text-[#22c55e] shrink-0" />;
    case "em_progresso":
      return <Loader2 size={15} className="text-[#01C461] shrink-0 animate-spin" />;
    case "pendente":
      return <Circle size={15} className="text-[rgba(255,255,255,0.5)] shrink-0" />;
    case "falha":
      return <XCircle size={15} className="text-[#ef4444] shrink-0" />;
  }
}

function PrioridadeBadge({ prioridade }: { prioridade: Prioridade }) {
  const styles: Record<Prioridade, string> = {
    alta: "bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)]",
    media: "bg-[rgba(245,158,11,0.15)] text-[#fbbf24] border border-[rgba(245,158,11,0.25)]",
    baixa: "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)]",
  };
  const labels: Record<Prioridade, string> = { alta: "Alta", media: "Média", baixa: "Baixa" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[prioridade]}`}>
      {labels[prioridade]}
    </span>
  );
}

const STATUS_LABELS: Record<Status, string> = {
  em_progresso: "em progresso",
  concluida: "concluída",
  pendente: "pendente",
  falha: "falha",
};

export function TasksContent() {
  const [activeStatus, setActiveStatus] = useState<Status | null>(null);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card" | "kanban">("list");
  const [extraTasks, setExtraTasks] = useState<Tarefa[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("pendente");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Status>>({});
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);
  const skip = !isSupabaseConfigured();

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const json = await res.json();
    return (json.data ?? json ?? []) as Tarefa[];
  }, []);

  const { data: TAREFAS, loading } = useSupabaseQuery({
    queryFn: fetchTasks,
    mockData: TAREFAS_MOCK,
    skip,
  });

  const allTasks = [...TAREFAS, ...extraTasks].map((t) =>
    statusOverrides[t.id] ? { ...t, status: statusOverrides[t.id] } : t
  );

  const KANBAN_COLUMNS: { key: Status; label: string; color: string }[] = [
    { key: 'pendente', label: 'Pendente', color: 'rgba(255,255,255,0.3)' },
    { key: 'em_progresso', label: 'Em Progresso', color: '#01C461' },
    { key: 'concluida', label: 'Concluida', color: '#22c55e' },
    { key: 'falha', label: 'Falha', color: '#ef4444' },
  ];

  const counts: Record<Status, number> = {
    em_progresso: allTasks.filter((t) => t.status === "em_progresso").length,
    concluida: allTasks.filter((t) => t.status === "concluida").length,
    pendente: allTasks.filter((t) => t.status === "pendente").length,
    falha: allTasks.filter((t) => t.status === "falha").length,
  };

  const filtered = allTasks.filter((t) => {
    const matchStatus = activeStatus ? t.status === activeStatus : true;
    const matchSearch = search.trim()
      ? t.titulo.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  const pillStyles: Record<Status, string> = {
    em_progresso: "bg-[rgba(1,196,97,0.15)] text-[#5eead4] border border-[rgba(1,196,97,0.25)]",
    concluida: "bg-[rgba(34,197,94,0.15)] text-[#4ade80] border border-[rgba(34,197,94,0.25)]",
    pendente: "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)]",
    falha: "bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)]",
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Tarefas</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Esta é uma visão geral de todas as tarefas nesta área de trabalho
          </p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors"
        >
          Criar tarefa
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveStatus(null)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              activeStatus === null
                ? "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] text-white"
                : "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
            }`}
          >
            <Settings2 size={14} />
            Todos
          </button>

          {(["em_progresso", "concluida", "pendente", "falha"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(activeStatus === s ? null : s)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${pillStyles[s]} ${
                activeStatus === s ? "ring-1 ring-white/20" : "opacity-80 hover:opacity-100"
              }`}
            >
              <StatusIcon status={s} />
              {counts[s]} {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Search + View */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
            <Search size={14} className="text-[rgba(255,255,255,0.4)]" />
            <input
              aria-label="Pesquisar tarefas"
              className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-48"
              placeholder="Pesquisar tarefas por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center rounded-lg border border-[rgba(255,255,255,0.08)] overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${viewMode === "list" ? "bg-[rgba(255,255,255,0.1)] text-white" : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"}`}
            >
              <LayoutList size={14} />
              Lista
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors border-l border-[rgba(255,255,255,0.08)] ${viewMode === "card" ? "bg-[rgba(255,255,255,0.1)] text-white" : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"}`}
            >
              <LayoutGrid size={14} />
              Cards
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors border-l border-[rgba(255,255,255,0.08)] ${viewMode === "kanban" ? "bg-[rgba(255,255,255,0.1)] text-white" : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"}`}
            >
              <Columns3 size={14} />
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Create task dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,20,0.95)] backdrop-blur-md p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Nova tarefa</h2>
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
                  onChange={(e) => setNewStatus(e.target.value as Status)}
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
                  const id = `T-${String(allTasks.length + 1).padStart(3, "0")}`;
                  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
                  setExtraTasks((prev) => [...prev, {
                    id, titulo: newTitle.trim(), agente: "Kairus", iniciais: "KA", cor: "#a1a1aa",
                    status: newStatus, prioridade: "media" as Prioridade, departamento: "Geral",
                    criadaEm: today, descricao: newDesc.trim() || "Tarefa criada manualmente",
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

      {/* Table / Cards */}
      {loading ? (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <SkeletonTable rows={8} cols={7} />
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                className={`rounded-xl border bg-[rgba(255,255,255,0.02)] p-3 min-h-[300px] transition-colors ${
                  dragOverCol === col.key
                    ? 'border-teal-400/50 bg-[rgba(1,196,97,0.06)]'
                    : 'border-[rgba(255,255,255,0.08)]'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverCol(null);
                  const taskId = e.dataTransfer.getData('text/plain');
                  if (taskId) {
                    setStatusOverrides((prev) => ({ ...prev, [taskId]: col.key }));
                  }
                }}
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-medium text-white">{col.label}</span>
                  <span className="ml-auto text-xs text-[rgba(255,255,255,0.4)]">{colTasks.length}</span>
                </div>
                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {colTasks.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData('text/plain', tarefa.id); e.dataTransfer.effectAllowed = 'move'; }}
                      className="glass-card rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3 cursor-grab active:cursor-grabbing hover:border-[rgba(255,255,255,0.16)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[rgba(255,255,255,0.5)] font-mono text-[10px]">{tarefa.id}</span>
                        <PrioridadeBadge prioridade={tarefa.prioridade} />
                      </div>
                      <p className="text-white font-medium text-xs leading-snug mb-1">{tarefa.titulo}</p>
                      <p className="text-[rgba(255,255,255,0.4)] text-[10px] mb-2 line-clamp-2">{tarefa.descricao}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center rounded-full text-[8px] font-bold text-white shrink-0" style={{ width: 18, height: 18, backgroundColor: tarefa.cor }}>{tarefa.iniciais}</span>
                        <span className="text-[rgba(255,255,255,0.5)] text-[10px]">{tarefa.agente}</span>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-[rgba(255,255,255,0.3)]">
                      Arraste tarefas aqui
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((tarefa) => (
            <div key={tarefa.id} className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 hover:border-[rgba(255,255,255,0.16)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[rgba(255,255,255,0.5)] font-mono text-xs">{tarefa.id}</span>
                <PrioridadeBadge prioridade={tarefa.prioridade} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status={tarefa.status} />
                <p className="text-white font-medium text-sm leading-snug">{tarefa.titulo}</p>
              </div>
              <p className="text-[rgba(255,255,255,0.5)] text-xs mb-3">{tarefa.descricao}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0" style={{ width: 24, height: 24, backgroundColor: tarefa.cor }}>{tarefa.iniciais}</span>
                  <span className="text-[rgba(255,255,255,0.7)] text-xs">{tarefa.agente}</span>
                </div>
                <span className="text-[rgba(255,255,255,0.4)] text-xs">{tarefa.criadaEm}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full px-4 py-16 text-center text-sm text-[rgba(255,255,255,0.5)]">
              Nenhuma tarefa encontrada.
            </div>
          )}
        </div>
      ) : (
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)]">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] w-8"></th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] w-20">ID</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)]">Tarefa</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] w-32">Agente</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] w-32">Departamento</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] w-24">Prioridade</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] w-28">Criada em</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tarefa, i) => (
              <tr
                key={tarefa.id}
                className={`border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-default ${
                  i === filtered.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Status icon */}
                <td className="px-4 py-3">
                  <StatusIcon status={tarefa.status} />
                </td>

                {/* ID */}
                <td className="px-4 py-3">
                  <span className="text-[rgba(255,255,255,0.5)] font-mono text-xs">{tarefa.id}</span>
                </td>

                {/* Title + description */}
                <td className="px-4 py-3">
                  <p className="text-white font-medium leading-snug">{tarefa.titulo}</p>
                  <p className="text-[rgba(255,255,255,0.5)] text-xs mt-0.5">{tarefa.descricao}</p>
                </td>

                {/* Agent */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                      style={{ width: 24, height: 24, backgroundColor: tarefa.cor }}
                    >
                      {tarefa.iniciais}
                    </span>
                    <span className="text-[rgba(255,255,255,0.7)] text-xs">{tarefa.agente}</span>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block rounded-full shrink-0"
                      style={{
                        width: 6,
                        height: 6,
                        backgroundColor: DEPT_COLORS[tarefa.departamento] ?? "rgba(255,255,255,0.3)",
                      }}
                    />
                    <span className="text-[rgba(255,255,255,0.6)] text-xs">{tarefa.departamento}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  <PrioridadeBadge prioridade={tarefa.prioridade} />
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <span className="text-[rgba(255,255,255,0.5)] text-xs">{tarefa.criadaEm}</span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-sm text-[rgba(255,255,255,0.5)]">
                  Nenhuma tarefa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
