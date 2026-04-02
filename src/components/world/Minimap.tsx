"use client";

import { useMemo } from "react";
import { ROOMS, DOMAINS } from "@/data/world-layout";
import { AGENTES } from "@/data/mrlion";
import { useWorldStore } from "@/stores/worldStore";
import { useWorldUiStore } from "@/stores/worldUiStore";
import type { UUID } from "@/types/common";

/** Maximum grid extents from room layout */
const MAX_COL = 8;
const MAX_ROW = 5;
const MAP_W = 160;
const MAP_H = 100;

export function Minimap() {
  const { selectedRoomId, selectRoom, mapZoom } = useWorldUiStore();
  const presences = useWorldStore((s) => s.presences);

  // Use live presence data when available, fallback to seed
  const hasLiveAgent = presences.length > 0
    ? presences.some((p) => p.status === "ativo")
    : AGENTES.some((a) => a.status === "ativo");

  // Build a set of room IDs that have active agents from live presence
  const activeRoomIds = useMemo(() => {
    if (presences.length > 0) {
      return new Set(presences.map((p) => p.room_id));
    }
    return null; // null means fallback to seed
  }, [presences]);

  return (
    <div className="glass-card rounded-xl p-2 w-[168px] hidden md:block">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[9px] font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-wider">
          Mapa
        </span>
        {hasLiveAgent && (
          <span className="flex items-center gap-1">
            <span
              className="h-1 w-1 rounded-full bg-green-400"
              style={{ animation: "pulseSoft 2s ease-in-out infinite" }}
            />
            <span className="text-[8px] text-green-400/70 font-medium">LIVE</span>
          </span>
        )}
      </div>

      {/* Mini map canvas */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          width: MAP_W,
          height: MAP_H,
          background:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      >
        {ROOMS.map((room) => {
          const domain = DOMAINS[room.domain];
          const isSelected = selectedRoomId === room.id;
          const x = (room.gridX / MAX_COL) * (MAP_W - 16) + 4;
          const y = (room.gridY / MAX_ROW) * (MAP_H - 12) + 4;
          const hasAgents = activeRoomIds
            ? activeRoomIds.has(room.id as UUID)
            : room.seedAgentIds.length > 0;

          return (
            <button
              key={room.id}
              onClick={() => selectRoom(room.id)}
              className="absolute transition-transform duration-150 cursor-pointer group"
              style={{
                left: x,
                top: y,
                transform: isSelected ? "scale(1.6)" : "scale(1)",
              }}
              title={room.nome}
            >
              <span
                className="block rounded-sm"
                style={{
                  width: isSelected ? 8 : 6,
                  height: isSelected ? 8 : 6,
                  backgroundColor: domain?.tileColor ?? "#666",
                  opacity: isSelected ? 1 : 0.7,
                  boxShadow: isSelected
                    ? `0 0 6px ${domain?.glowColor ?? "transparent"}`
                    : undefined,
                }}
              />
              {/* Active dot */}
              {hasAgents && (
                <span
                  className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-400"
                  style={{
                    animation: "pulseSoft 2s ease-in-out infinite",
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Viewport rectangle indicator */}
        <div
          className="absolute border border-[rgba(255,255,255,0.2)] rounded-sm pointer-events-none"
          style={{
            width: MAP_W / mapZoom,
            height: MAP_H / mapZoom,
            left: (MAP_W - MAP_W / mapZoom) / 2,
            top: (MAP_H - MAP_H / mapZoom) / 2,
          }}
        />
      </div>
    </div>
  );
}
