"use client";

import { X, ArrowLeft, Users, Zap, Clock } from "lucide-react";
import { ROOMS, DOMAINS, WORKFLOW_LINKS } from "@/data/world-layout";
import { AGENTES } from "@/data/mrlion";
import { AgentSprite } from "./AgentSprite";
import { useWorldStore } from "@/stores/worldStore";
import { useWorldUiStore } from "@/stores/worldUiStore";

export function RoomDetailPanel() {
  const { selectedRoomId, detailPanelOpen, selectRoom, selectAgent, selectedAgentId } =
    useWorldUiStore();
  const presences = useWorldStore((s) => s.presences);

  const room = ROOMS.find((r) => r.id === selectedRoomId);
  if (!room || !detailPanelOpen) return null;

  const domain = DOMAINS[room.domain];

  // Use live presence data when available, fallback to seed data
  const roomPresences = presences.filter((p) => p.room_id === room.id);
  const hasLivePresence = roomPresences.length > 0;

  const agents = hasLivePresence
    ? (() => {
        // Deduplicate by agent_id
        const seen = new Set<string>();
        return roomPresences
          .filter((p) => {
            if (seen.has(p.agent_id)) return false;
            seen.add(p.agent_id);
            return true;
          })
          .map((p) => {
            const seedAgent = AGENTES.find((a) => a.id === p.agent_id);
            return {
              id: p.agent_id,
              nome: seedAgent?.nome ?? p.agent_id,
              iniciais: seedAgent?.iniciais ?? p.agent_id.slice(0, 2).toUpperCase(),
              status: p.status as "ativo" | "pausado" | "idle",
              departamentoCor: seedAgent?.departamentoCor ?? domain?.tileColor ?? "#666",
              ultimaAcao: p.current_task ?? seedAgent?.ultimaAcao ?? "",
              ultimaAcaoTempo: seedAgent?.ultimaAcaoTempo ?? "",
            };
          });
      })()
    : AGENTES.filter((a) => room.seedAgentIds.includes(a.id));

  const incomingLinks = WORKFLOW_LINKS.filter((l) => l.to === room.id);
  const outgoingLinks = WORKFLOW_LINKS.filter((l) => l.from === room.id);

  const handleClose = () => selectRoom(null);

  return (
    <div
      className="absolute top-0 right-0 bottom-0 w-[340px] z-30
        flex flex-col
        border-l border-[rgba(255,255,255,0.06)]
        transition-transform duration-300 ease-out"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,12,14,0.92) 0%, rgba(12,12,14,0.98) 100%)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <button
          onClick={handleClose}
          className="flex items-center justify-center h-7 w-7 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm">{room.emoji}</span>
            <h2 className="text-sm font-semibold text-white truncate">{room.nome}</h2>
          </div>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium mt-0.5"
            style={{ color: domain?.tileColor }}
          >
            {domain?.emoji} {domain?.label}
          </span>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center justify-center h-7 w-7 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all duration-150 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Description */}
        <div>
          <p className="text-xs text-[rgba(255,255,255,0.5)] leading-relaxed">
            {room.descricao}
          </p>
        </div>

        {/* Status indicator */}
        <div className="glass-surface rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs">
            <Zap size={12} className="text-green-400" />
            <span className="text-[rgba(255,255,255,0.6)]">Status:</span>
            <span className="text-green-400 font-medium">Ativa</span>
          </div>
        </div>

        {/* Agents section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={12} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-xs font-medium text-white">
              Agentes ({agents.length})
            </span>
          </div>

          {agents.length === 0 ? (
            <p className="text-xs text-[rgba(255,255,255,0.3)] italic">
              Nenhum agente alocado nesta sala
            </p>
          ) : (
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={`detail-${room.id}-${agent.id}`}
                  onClick={() => selectAgent(agent.id)}
                  className={`
                    flex items-center gap-3 w-full rounded-lg p-2.5
                    transition-all duration-150 cursor-pointer text-left
                    ${selectedAgentId === agent.id
                      ? "bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]"
                      : "hover:bg-[rgba(255,255,255,0.04)] border border-transparent"
                    }
                  `}
                >
                  <AgentSprite
                    id={agent.id}
                    nome={agent.nome}
                    iniciais={agent.iniciais}
                    status={agent.status}
                    cor={agent.departamentoCor}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">{agent.nome}</div>
                    <div className="text-[10px] text-[rgba(255,255,255,0.35)] truncate">
                      {agent.ultimaAcao}
                    </div>
                  </div>
                  <span className="text-[9px] text-[rgba(255,255,255,0.25)]">
                    {agent.ultimaAcaoTempo}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Workflow connections */}
        {(incomingLinks.length > 0 || outgoingLinks.length > 0) && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-[rgba(255,255,255,0.4)]" />
              <span className="text-xs font-medium text-white">
                Fluxo de Trabalho
              </span>
            </div>
            <div className="space-y-1.5">
              {incomingLinks.map((link) => {
                const fromRoom = ROOMS.find((r) => r.id === link.from);
                return (
                  <div
                    key={`in-${link.from}-${link.to}`}
                    className="flex items-center gap-2 text-[10px] text-[rgba(255,255,255,0.4)]"
                  >
                    <span className="text-[rgba(255,255,255,0.25)]">←</span>
                    <span>{fromRoom?.emoji} {fromRoom?.nome}</span>
                    {link.label && (
                      <span className="text-[rgba(255,255,255,0.2)]">({link.label})</span>
                    )}
                  </div>
                );
              })}
              {outgoingLinks.map((link) => {
                const toRoom = ROOMS.find((r) => r.id === link.to);
                return (
                  <div
                    key={`out-${link.from}-${link.to}`}
                    className="flex items-center gap-2 text-[10px] text-[rgba(255,255,255,0.4)]"
                  >
                    <span className="text-[rgba(255,255,255,0.25)]">→</span>
                    <span>{toRoom?.emoji} {toRoom?.nome}</span>
                    {link.label && (
                      <span className="text-[rgba(255,255,255,0.2)]">({link.label})</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
