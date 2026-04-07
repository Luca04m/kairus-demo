"use client";
import { useState, useCallback } from "react";
import { Plus, MessageSquare, Minus, Maximize, Keyboard, Webhook, CalendarClock, Brain, Zap } from "lucide-react";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonPulse, ErrorState } from "@/components/ui/LoadingSkeleton";

interface FlowNode {
  id: string;
  type: string;
  label: string;
  icon: string;
  color: string;
  borderColor: string;
}

const MOCK_FLOW_NODES: FlowNode[] = [
  { id: "n1", type: "action", label: "Analisar mensagem", icon: "brain", color: "rgba(139,92,246,0.18)", borderColor: "rgba(139,92,246,0.30)" },
  { id: "n2", type: "action", label: "Executar ação", icon: "zap", color: "rgba(245,158,11,0.14)", borderColor: "rgba(245,158,11,0.28)" },
  { id: "n3", type: "action", label: "Responder", icon: "message", color: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.26)" },
];

export function AgentFlowContent() {
  const [isActive, setIsActive] = useState(true);
  const [zoom, setZoom] = useState(100);
  const skip = !isSupabaseConfigured();

  const fetchFlow = useCallback(async () => {
    const res = await fetch("/api/agents?type=flow");
    if (!res.ok) throw new Error("Failed to fetch flow");
    const json = await res.json();
    return (json.data ?? json ?? []) as FlowNode[];
  }, []);

  const { data: _flowNodes, loading, error, refetch } = useSupabaseQuery({
    queryFn: fetchFlow,
    mockData: MOCK_FLOW_NODES,
    skip,
  });

  if (loading) {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: "#080808" }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <SkeletonPulse className="h-24 w-60 rounded-xl" />
          <SkeletonPulse className="h-1 w-px" style={{ height: 28 }} />
          <SkeletonPulse className="h-12 w-52 rounded-xl" />
          <SkeletonPulse className="h-1 w-px" style={{ height: 28 }} />
          <SkeletonPulse className="h-12 w-52 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center" style={{ backgroundColor: "#080808" }}>
        <ErrorState message="Erro ao carregar fluxo do agente." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#080808",
      }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <div>
          <h1 className="text-lg font-semibold text-white">Fluxo</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">Crie seus fluxos de trabalho personalizados que são executados via chat ou gatilhos</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.10)] transition-colors backdrop-blur-md"
          >
            <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[#22c55e] animate-pulse-soft" : "bg-[rgba(255,255,255,0.3)]"}`} />
            {isActive ? "Ativo" : "Inativo"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[rgba(255,255,255,0.4)]"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button className="rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors">
            Criar tarefa
          </button>
        </div>
      </div>

      {/* Flow canvas — centered column */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] flex flex-col items-center transition-transform duration-200 origin-center"
        style={{ transform: `translate(-50%, -58%) scale(${zoom / 100})` }}
      >

        {/* Trigger node */}
        <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-xl hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] p-4 min-w-[240px] transition-all">
          <p className="text-xs font-medium text-[rgba(255,255,255,0.5)] mb-3 uppercase tracking-wider">Gatilho</p>
          <div className="flex items-center gap-2">
            {/* Chat */}
            <div className="relative group">
              <button disabled title="Trigger de chat em breve" className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.12)] transition-all opacity-50 cursor-not-allowed">
                <MessageSquare size={14} />
              </button>
              <span className="mt-1 block text-center text-[10px] text-[rgba(255,255,255,0.5)]">Chat</span>
            </div>
            {/* Webhook */}
            <div className="relative group">
              <button disabled title="Webhook trigger em breve" className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.12)] transition-all opacity-50 cursor-not-allowed">
                <Webhook size={14} />
              </button>
              <span className="mt-1 block text-center text-[10px] text-[rgba(255,255,255,0.5)]">Webhook</span>
            </div>
            {/* Agenda */}
            <div className="relative group">
              <button disabled title="Agenda trigger em breve" className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.12)] transition-all opacity-50 cursor-not-allowed">
                <CalendarClock size={14} />
              </button>
              <span className="mt-1 block text-center text-[10px] text-[rgba(255,255,255,0.5)]">Agenda</span>
            </div>
            {/* Add */}
            <button disabled title="Adicionar trigger em breve" className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.25)] transition-all opacity-50 cursor-not-allowed">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Connector line + add button */}
        <FlowConnector />

        {/* Node 1 — Analisar mensagem */}
        <FlowNode icon={<Brain size={15} />} label="Analisar mensagem" color="rgba(139,92,246,0.18)" borderColor="rgba(139,92,246,0.30)" />

        <FlowConnector />

        {/* Node 2 — Executar ação */}
        <FlowNode icon={<Zap size={15} />} label="Executar ação" color="rgba(245,158,11,0.14)" borderColor="rgba(245,158,11,0.28)" />

        <FlowConnector />

        {/* Node 3 — Responder */}
        <FlowNode icon={<MessageSquare size={15} />} label="Responder" color="rgba(34,197,94,0.12)" borderColor="rgba(34,197,94,0.26)" />

        {/* Add step at bottom */}
        <div className="mt-3">
          <button disabled title="Adicionar passo em breve" className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[rgba(255,255,255,0.14)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.28)] hover:bg-[rgba(255,255,255,0.02)] transition-all opacity-50 cursor-not-allowed">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Zoom controls — glass surface */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-1">
        <span className="text-[10px] text-center text-[rgba(255,255,255,0.35)] tabular-nums mb-0.5">{zoom}%</span>
        {([
          { id: "zoom-in", icon: <Plus size={15} />, label: "Aumentar zoom", action: () => setZoom((z) => Math.min(150, z + 10)) },
          { id: "zoom-out", icon: <Minus size={15} />, label: "Diminuir zoom", action: () => setZoom((z) => Math.max(50, z - 10)) },
          { id: "maximize", icon: <Maximize size={15} />, label: "Maximizar", action: () => setZoom(100) },
          { id: "keyboard", icon: <Keyboard size={15} />, label: "Atalhos de teclado", action: () => {} },
        ] as { id: string; icon: React.ReactNode; label: string; action: () => void }[]).map((item) => (
          <button
            key={item.id}
            aria-label={item.label}
            onClick={item.action}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.10)] backdrop-blur-md transition-all cursor-pointer ${
              item.id === "maximize" && zoom === 100
                ? "border-[rgba(255,255,255,0.18)] text-white"
                : "border-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.18)]"
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex flex-col items-center">
      <svg width="2" height="28" viewBox="0 0 2 28" fill="none">
        <line x1="1" y1="0" x2="1" y2="28" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="-mt-1">
        <path d="M5 6L0 0H10L5 6Z" fill="rgba(255,255,255,0.18)" />
      </svg>
    </div>
  );
}

function FlowNode({
  icon,
  label,
  color,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  borderColor: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 min-w-[200px] rounded-xl backdrop-blur-md transition-all cursor-default hover:brightness-110"
      style={{
        background: color,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span className="text-white opacity-80">{icon}</span>
      <span className="text-sm text-[rgba(255,255,255,0.85)] font-medium">{label}</span>
    </div>
  );
}
