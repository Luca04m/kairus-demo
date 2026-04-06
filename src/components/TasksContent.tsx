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
  { id: "T-002", titulo: "Otimizar campanha Meta 'Verão 2026'", agente: "Mia", iniciais: "MI", cor: "#6366f1", status: "concluida", prioridade: "alta", departamento: "Marketing", criadaEm: "25/03/2026", descricao: "CPC reduzido em 18%" },
  { id: "T-003", titulo: "Reposição estoque Honey Garrafa", agente: "Sol", iniciais: "SO", cor: "#f59e0b", status: "pendente", prioridade: "alta", departamento: "Operações", criadaEm: "30/03/2026", descricao: "Estoque crítico <50 un" },
  { id: "T-004", titulo: "Enviar lembretes recompra B2B", agente: "Rex", iniciais: "RE", cor: "#ec4899", status: "concluida", prioridade: "media", departamento: "Vendas", criadaEm: "29/03/2026", descricao: "12 clientes notificados" },
  { id: "T-005", titulo: "Responder WhatsApp automático", agente: "Iris", iniciais: "IR", cor: "#06b6d4", status: "em_progresso", prioridade: "media", departamento: "Atendimento", criadaEm: "01/04/2026", descricao: "23 mensagens respondidas" },
  { id: "T-006", titulo: "Gerar relatório semanal S13", agente: "Leo", iniciais: "LE", cor: "#22c55e", status: "concluida", prioridade: "media", departamento: "Financeiro", criadaEm: "31/03/2026", descricao: "Relatório entregue" },
  { id: "T-007", titulo: "Publicar conteúdo Instagram", agente: "Mia", iniciais: "MI", cor: "#6366f1", status: "concluida", prioridade: "baixa", departamento: "Marketing", criadaEm: "30/03/2026", descricao: "3 posts, alcance 12.4k" },
  { id: "T-008", titulo: "Detectar chargebacks suspeitos", agente: "Leo", iniciais: "LE", cor: "#22c55e", status: "em_progresso", prioridade: "alta", departamento: "Financeiro", criadaEm: "01/04/2026", descricao: "Monitoramento ativo" },
  { id: "T-009", titulo: "Processar reenvios pendentes", agente: "Sol", iniciais: "SO", cor: "#f59e0b", status: "concluida", prioridade: "media", departamento: "Operações", criadaEm: "29/03/2026", descricao: "5 reenvios processados" },
  { id: "T-010", titulo: "Análise de ROAS mensal", agente: "Mia", iniciais: "MI", cor: "#6366f1", status: "falha", prioridade: "alta", departamento: "Marketing", criadaEm: "01/04/2026", descricao: "Sem dados purchase Mar/26" },
];

const DEPT_COLORS: Record<string, string> = {
  Financeiro: "#22c55e",
  Marketing: "#6366f1",
  Operações: "#f59e0b",
  Vendas: "#ec4899",
  Atendimento: "#06b6d4",
};

function StatusIcon({ status }: { status: Status }) {
  switch (status) {
    case "concluida":
      return <CheckCircle2 size={15} className="text-[#22c55e] shrink-0" />;
    case "em_progresso":
      return <Loader2 size={15} className="text-[#6366f1] shrink-0 animate-spin" />;
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

  const counts: Record<Status, number> = {
    em_progresso: TAREFAS.filter((t) => t.status === "em_progresso").length,
    concluida: TAREFAS.filter((t) => t.status === "concluida").length,
    pendente: TAREFAS.filter((t) => t.status === "pendente").length,
    falha: TAREFAS.filter((t) => t.status === "falha").length,
  };

  const filtered = TAREFAS.filter((t) => {
    const matchStatus = activeStatus ? t.status === activeStatus : true;
    const matchSearch = search.trim()
      ? t.titulo.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  const pillStyles: Record<Status, string> = {
    em_progresso: "bg-[rgba(99,102,241,0.15)] text-[#818cf8] border border-[rgba(99,102,241,0.25)]",
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
        <button className="rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors">
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
          <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]">
            <SlidersHorizontal size={14} />
            Visualizar
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <SkeletonTable rows={8} cols={7} />
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
                className={`border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-default ${
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
