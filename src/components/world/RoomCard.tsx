"use client";

import { useState, useMemo } from "react";
import { type RoomConfig, DOMAINS } from "@/data/world-layout";
import { IconByName } from "@/lib/icons";
import { AGENTES } from "@/data/mrlion";
import { AgentSprite } from "./AgentSprite";
import { useWorldStore } from "@/stores/worldStore";
import { useWorldUiStore } from "@/stores/worldUiStore";

interface RoomCardProps {
  room: RoomConfig;
}

export function RoomCard({ room }: RoomCardProps) {
  const [hovered, setHovered] = useState(false);
  const { selectedRoomId, selectRoom, highlightedRoomIds } = useWorldUiStore();
  const presences = useWorldStore((s) => s.presences);

  const domain = DOMAINS[room.domain];
  const isSelected = selectedRoomId === room.id;
  const isHighlighted = highlightedRoomIds.includes(room.id);

  // Use live presence data when available, fallback to seed agent data
  const roomPresences = useMemo(
    () => presences.filter((p) => p.room_id === room.id),
    [presences, room.id],
  );
  const hasLivePresence = roomPresences.length > 0;

  // Build agent display list: prefer live data, fallback to seed
  const agents = useMemo(() => {
    if (hasLivePresence) {
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
          };
        });
    }
    return AGENTES.filter((a) => room.seedAgentIds.includes(a.id));
  }, [hasLivePresence, roomPresences, room.seedAgentIds, domain?.tileColor]);

  const activeCount = agents.filter((a) => a.status === "ativo").length;

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => selectRoom(room.id)}
      className={`
        relative flex flex-col gap-2 rounded-xl p-3.5 w-full text-left
        transition-all duration-200 cursor-pointer
        border
        ${isSelected
          ? "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)]"
          : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)]"
        }
        ${isHighlighted ? "ring-1 ring-offset-0" : ""}
      `}
      style={{
        boxShadow: hovered || isSelected
          ? `0 0 24px ${domain?.glowColor ?? "transparent"}, inset 0 0.5px 0 rgba(255,255,255,0.08)`
          : activeCount > 0
            ? `0 0 12px ${domain?.glowColor ?? "transparent"}, inset 0 0.5px 0 rgba(255,255,255,0.06)`
            : "inset 0 0.5px 0 rgba(255,255,255,0.04)",
        borderColor: isSelected
          ? `${domain?.tileColor ?? "rgba(255,255,255,0.15)"}88`
          : undefined,
        transform: hovered ? "scale(1.03)" : "scale(1)",
      }}
    >
      {/* Domain color indicator */}
      <div
        className="absolute top-0 left-3 right-3 h-0.5 rounded-b-full opacity-60"
        style={{ backgroundColor: domain?.tileColor }}
      />

      {/* Header row */}
      <div className="flex items-center gap-2">
        <IconByName name={room.emoji} size={14} />
        <span className="text-xs font-medium text-white truncate flex-1">
          {room.nome}
        </span>
        {activeCount > 0 && (
          <span
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: "#22c55e",
              animation: "pulseSoft 2s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Domain badge */}
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium w-fit"
        style={{
          backgroundColor: `${domain?.tileColor ?? "#fff"}15`,
          color: domain?.tileColor,
          border: `1px solid ${domain?.tileColor ?? "#fff"}25`,
        }}
      >
        {domain && <IconByName name={domain.emoji} size={10} className="inline-block" />} {domain?.label}
      </span>

      {/* Agent sprites row */}
      {agents.length > 0 && (
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex items-center gap-1">
            {agents.map((agent) => (
              <AgentSprite
                key={`room-${room.id}-agent-${agent.id}`}
                id={agent.id}
                nome={agent.nome}
                iniciais={agent.iniciais}
                status={agent.status}
                cor={agent.departamentoCor}
                size="sm"
              />
            ))}
            {agents.length > 0 && (
              <span className="text-[9px] text-[rgba(255,255,255,0.3)] ml-1">
                {activeCount} ativo{activeCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {/* Current activity from live presence */}
          {hasLivePresence && roomPresences[0]?.current_task && (
            <div className="text-[9px] text-[rgba(255,255,255,0.35)] truncate leading-tight">
              {roomPresences[0].current_task}
            </div>
          )}
        </div>
      )}

      {/* Hover hint */}
      {hovered && (
        <span className="text-[9px] text-[rgba(255,255,255,0.25)] mt-auto">
          Clique para ver detalhes
        </span>
      )}
    </button>
  );
}
