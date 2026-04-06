"use client";

import { useMemo } from "react";
import { ROOMS, DOMAINS, TILE_WIDTH, TILE_HEIGHT } from "@/data/world-layout";
import { AGENTES } from "@/data/mrlion";
import { useWorldStore } from "@/stores/worldStore";
import { useWorldUiStore } from "@/stores/worldUiStore";
import type { UUID } from "@/types/common";

const MAP_W = 160;
const MAP_H = 100;

export function Minimap() {
  const { selectedRoomId, mapZoom } = useWorldUiStore();
  const enterRoom = useWorldUiStore((s) => s.enterRoom);
  const presences = useWorldStore((s) => s.presences);

  const hasLiveAgent = presences.length > 0
    ? presences.some((p) => p.status === "ativo")
    : AGENTES.some((a) => a.status === "ativo");

  const activeRoomIds = useMemo(() => {
    if (presences.length > 0) {
      return new Set(presences.map((p) => p.room_id));
    }
    return null;
  }, [presences]);

  // Calculate isometric bounds for mapping positions to minimap
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    ROOMS.forEach((room) => {
      const px = (room.gridX - room.gridY) * (TILE_WIDTH / 2);
      const py = (room.gridX + room.gridY) * (TILE_HEIGHT / 2);
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px + TILE_WIDTH);
      minY = Math.min(minY, py);
      maxY = Math.max(maxY, py + TILE_HEIGHT);
    });
    return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
  }, []);

  return (
    <div className="glass-card rounded-xl p-2 w-[168px] hidden md:block">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[9px] font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-wider">
          Mapa
        </span>
        {hasLiveAgent && (
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-green-400" style={{ animation: "pulseSoft 2s ease-in-out infinite" }} />
            <span className="text-[8px] text-green-400/70 font-medium">LIVE</span>
          </span>
        )}
      </div>

      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          width: MAP_W,
          height: MAP_H,
          background: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      >
        {ROOMS.map((room) => {
          const domain = DOMAINS[room.domain];
          const isSelected = selectedRoomId === room.id;
          // Map isometric position to minimap coords
          const isoX = (room.gridX - room.gridY) * (TILE_WIDTH / 2);
          const isoY = (room.gridX + room.gridY) * (TILE_HEIGHT / 2);
          const x = ((isoX - bounds.minX) / bounds.w) * (MAP_W - 16) + 4;
          const y = ((isoY - bounds.minY) / bounds.h) * (MAP_H - 12) + 4;
          const hasAgents = activeRoomIds
            ? activeRoomIds.has(room.id as UUID)
            : room.seedAgentIds.length > 0;

          return (
            <button
              key={room.id}
              onClick={() => enterRoom(room.id)}
              className="absolute transition-transform duration-150 cursor-pointer group"
              style={{ left: x, top: y, transform: isSelected ? "scale(1.6)" : "scale(1)" }}
              title={room.nome}
            >
              {/* Diamond shape for isometric feel */}
              <span
                className="block"
                style={{
                  width: isSelected ? 8 : 6,
                  height: isSelected ? 8 : 6,
                  backgroundColor: domain?.tileColor ?? "#666",
                  opacity: isSelected ? 1 : 0.7,
                  boxShadow: isSelected ? `0 0 6px ${domain?.glowColor ?? "transparent"}` : undefined,
                  transform: 'rotate(45deg)',
                }}
              />
              {hasAgents && (
                <span
                  className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-400"
                  style={{ animation: "pulseSoft 2s ease-in-out infinite" }}
                />
              )}
            </button>
          );
        })}

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
