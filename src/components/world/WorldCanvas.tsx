"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { ROOMS, DOMAINS, WORKFLOW_LINKS, type RoomConfig } from "@/data/world-layout";
import { RoomCard } from "./RoomCard";
import { useWorldUiStore } from "@/stores/worldUiStore";
import type { DepartmentId } from "@/types/departments";

// ─── Grid constants ──────────────────────────────────────
const CELL_W = 200;
const CELL_H = 180;
const GAP = 16;
const GRID_COLS = 9;
const GRID_ROWS = 6;
const CANVAS_W = GRID_COLS * (CELL_W + GAP);
const CANVAS_H = GRID_ROWS * (CELL_H + GAP);

interface WorldCanvasProps {
  activeDomains: DepartmentId[];
}

export function WorldCanvas({ activeDomains }: WorldCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { mapZoom, panX, panY, setPan, setMapZoom } = useWorldUiStore();

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const allActive = activeDomains.length === 0;
  const filteredRooms = ROOMS.filter(
    (r) => allActive || activeDomains.includes(r.domain),
  );

  // ─── Domain cluster labels ─────────────────────────────
  const domainClusters = getDomainClusters(filteredRooms);

  // ─── Wheel zoom ────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setMapZoom(mapZoom + delta);
    },
    [mapZoom, setMapZoom],
  );

  // ─── Drag to pan ───────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      dragStart.current = { x: e.clientX, y: e.clientY, panX, panY };
      setIsDragging(false);
    },
    [panX, panY],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setIsDragging(true);
        setPan(dragStart.current.panX + dx, dragStart.current.panY + dy);
      }
    },
    [setPan],
  );

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
    // Reset drag flag after a tick so click events can check
    requestAnimationFrame(() => setIsDragging(false));
  }, []);

  // ─── Keyboard nav ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useWorldUiStore.getState().closeAll();
      }
      const PAN_STEP = 40;
      if (e.key === "ArrowLeft" || e.key === "a") setPan(panX + PAN_STEP, panY);
      if (e.key === "ArrowRight" || e.key === "d") setPan(panX - PAN_STEP, panY);
      if (e.key === "ArrowUp" || e.key === "w") setPan(panX, panY + PAN_STEP);
      if (e.key === "ArrowDown" || e.key === "s") setPan(panX, panY - PAN_STEP);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panX, panY, setPan]);

  return (
    <div
      className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Transform container */}
      <div
        ref={canvasRef}
        className="absolute transition-transform duration-100 ease-out"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(${panX}px, ${panY}px) scale(${mapZoom})`,
          transformOrigin: "center center",
          left: "50%",
          top: "50%",
          marginLeft: -CANVAS_W / 2,
          marginTop: -CANVAS_H / 2,
        }}
      >
        {/* SVG workflow lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={CANVAS_W}
          height={CANVAS_H}
        >
          {WORKFLOW_LINKS.map((link) => {
            const from = ROOMS.find((r) => r.id === link.from);
            const to = ROOMS.find((r) => r.id === link.to);
            if (!from || !to) return null;
            if (!allActive && (!activeDomains.includes(from.domain) || !activeDomains.includes(to.domain))) {
              return null;
            }
            const x1 = from.gridX * (CELL_W + GAP) + CELL_W / 2;
            const y1 = from.gridY * (CELL_H + GAP) + CELL_H / 2;
            const x2 = to.gridX * (CELL_W + GAP) + CELL_W / 2;
            const y2 = to.gridY * (CELL_H + GAP) + CELL_H / 2;
            const domain = DOMAINS[from.domain];
            return (
              <line
                key={`${link.from}-${link.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={domain?.tileColor ?? "rgba(255,255,255,0.1)"}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                opacity={0.25}
              />
            );
          })}
        </svg>

        {/* Domain cluster labels */}
        {domainClusters.map((cluster) => {
          const domain = DOMAINS[cluster.domain];
          if (!domain) return null;
          return (
            <div
              key={cluster.domain}
              className="absolute pointer-events-none"
              style={{
                left: cluster.x * (CELL_W + GAP) - 8,
                top: cluster.y * (CELL_H + GAP) - 24,
              }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-wider opacity-40"
                style={{ color: domain.tileColor }}
              >
                {domain.emoji} {domain.label}
              </span>
            </div>
          );
        })}

        {/* Room cards grid */}
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="absolute"
            style={{
              left: room.gridX * (CELL_W + GAP),
              top: room.gridY * (CELL_H + GAP),
              width: CELL_W,
            }}
          >
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────
interface DomainCluster {
  domain: DepartmentId;
  x: number;
  y: number;
}

function getDomainClusters(rooms: RoomConfig[]): DomainCluster[] {
  const map = new Map<DepartmentId, { minX: number; minY: number }>();
  for (const room of rooms) {
    const cur = map.get(room.domain);
    if (!cur) {
      map.set(room.domain, { minX: room.gridX, minY: room.gridY });
    } else {
      if (room.gridX < cur.minX) cur.minX = room.gridX;
      if (room.gridY < cur.minY) cur.minY = room.gridY;
    }
  }
  return Array.from(map.entries()).map(([domain, pos]) => ({
    domain,
    x: pos.minX,
    y: pos.minY,
  }));
}
