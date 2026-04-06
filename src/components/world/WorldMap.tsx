"use client";

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IsometricTile } from './IsometricTile';
import {
  ROOMS, DOMAINS, TILE_WIDTH, TILE_HEIGHT,
  WORKFLOW_LINKS, DOMAIN_ZONES,
} from '@/data/world-layout';
import type { DepartmentId } from '@/types/departments';
import { useWorldStore } from '@/stores/worldStore';

interface WorldMapProps {
  onRoomClick: (roomId: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  highlightedRooms?: string[];
  filterDomain?: DepartmentId | null;
}

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.0;

export function WorldMap({
  onRoomClick,
  zoom,
  onZoomChange,
  highlightedRooms = [],
  filterDomain = null,
}: WorldMapProps) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const presences = useWorldStore((s) => s.presences);

  // Drag-to-pan state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({
    active: false, startX: 0, startY: 0,
    startPanX: 0, startPanY: 0, didDrag: false,
  });

  // Build agent count per room from live presences
  const roomAgentCount = useMemo(() => {
    const map = new Map<string, number>();
    presences.forEach((p) => {
      const cur = map.get(p.room_id) ?? 0;
      map.set(p.room_id, cur + 1);
    });
    return map;
  }, [presences]);

  // Calculate world bounds for centering
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
    const pad = 80;
    return {
      offsetX: -minX + pad,
      offsetY: -minY + pad,
      width: (maxX - minX) + pad * 2,
      height: (maxY - minY) + pad * 2 + 50,
    };
  }, []);

  const filteredRooms = filterDomain
    ? ROOMS.filter((r) => r.domain === filterDomain)
    : ROOMS;

  const getRoomPos = useCallback((roomId: string) => {
    const room = ROOMS.find((r) => r.id === roomId);
    if (!room) return null;
    return {
      x: (room.gridX - room.gridY) * (TILE_WIDTH / 2) + TILE_WIDTH / 2 + bounds.offsetX,
      y: (room.gridX + room.gridY) * (TILE_HEIGHT / 2) + TILE_HEIGHT / 2 + bounds.offsetY,
    };
  }, [bounds]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    onZoomChange(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta)));
  }, [zoom, onZoomChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = {
      active: true, startX: e.clientX, startY: e.clientY,
      startPanX: panOffset.x, startPanY: panOffset.y, didDrag: false,
    };
    setIsDragging(true);
  }, [panOffset]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.didDrag = true;
    }
    setPanOffset({
      x: dragRef.current.startPanX + dx,
      y: dragRef.current.startPanY + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
    setIsDragging(false);
    setTimeout(() => { dragRef.current.didDrag = false; }, 0);
  }, []);

  const handleRoomClickSafe = useCallback((roomId: string) => {
    if (dragRef.current.didDrag) return;
    onRoomClick(roomId);
  }, [onRoomClick]);

  return (
    <div className="h-full flex flex-col">
      {/* Isometric world container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="min-h-full flex items-center justify-center p-8">
          <motion.div
            className="relative"
            style={{
              width: bounds.width,
              height: bounds.height,
              transformOrigin: 'center center',
            }}
            animate={{ scale: zoom, x: panOffset.x, y: panOffset.y }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Domain zone backgrounds */}
            {!filterDomain && DOMAIN_ZONES.map((zone) => {
              const d = DOMAINS[zone.domain];
              return (
                <motion.div
                  key={zone.domain}
                  className="absolute rounded-2xl pointer-events-none"
                  style={{
                    left: zone.x + bounds.offsetX,
                    top: zone.y + bounds.offsetY,
                    width: zone.w,
                    height: zone.h,
                    background: `radial-gradient(ellipse at center, ${d.tileColor}08 0%, transparent 70%)`,
                    border: `1px solid ${d.tileColor}12`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
              );
            })}

            {/* Domain group labels */}
            {!filterDomain && (
              <DomainLabels offsetX={bounds.offsetX} offsetY={bounds.offsetY} />
            )}

            {/* Workflow connection lines */}
            {!filterDomain && (
              <WorkflowLines getRoomPos={getRoomPos} hoveredRoom={hoveredRoom} />
            )}

            {/* Room tiles */}
            {filteredRooms.map((room) => {
              const domainCfg = DOMAINS[room.domain];
              const agentCount = roomAgentCount.get(room.id) ?? 0;
              const hasSeedAgents = room.seedAgentIds.length > 0;
              const isActive = agentCount > 0 || hasSeedAgents;
              const isHovered = hoveredRoom === room.id;
              const isWorkflowHighlighted = highlightedRooms.includes(room.id);

              return (
                <div
                  key={room.id}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <IsometricTile
                    col={room.gridX}
                    row={room.gridY}
                    color={domainCfg.tileColor}
                    borderColor={domainCfg.tileBorder}
                    highlighted={isHovered || isWorkflowHighlighted}
                    pulse={isActive || isWorkflowHighlighted}
                    onClick={() => handleRoomClickSafe(room.id)}
                    offsetX={bounds.offsetX}
                    offsetY={bounds.offsetY}
                  >
                    <span className="text-base">{room.emoji}</span>
                    {isActive && (
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: Math.min(agentCount || room.seedAgentIds.length, 5) }).map((_, di) => (
                          <motion.div
                            key={di}
                            className="rounded-full"
                            style={{ width: 3, height: 3, backgroundColor: domainCfg.tileColor }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: di * 0.4 }}
                          />
                        ))}
                      </div>
                    )}
                  </IsometricTile>

                  {/* Room label */}
                  <motion.div
                    className="absolute pointer-events-none text-center"
                    style={{
                      left: (room.gridX - room.gridY) * (TILE_WIDTH / 2) + bounds.offsetX - 20,
                      top: (room.gridX + room.gridY) * (TILE_HEIGHT / 2) + bounds.offsetY + TILE_HEIGHT + 2,
                      width: TILE_WIDTH + 40,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0.7 }}
                  >
                    <span
                      className={`text-[10px] font-medium leading-tight block ${isHovered ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'}`}
                      style={{ fontFamily: '"Press Start 2P", monospace, system-ui', fontSize: '7px' }}
                    >
                      {room.nome}
                    </span>
                    {isActive && (
                      <span
                        className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold"
                        style={{ background: `${domainCfg.tileColor}33`, color: domainCfg.tileColor }}
                      >
                        {agentCount || room.seedAgentIds.length} agentes
                      </span>
                    )}
                  </motion.div>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute pointer-events-none z-30"
                        style={{
                          left: (room.gridX - room.gridY) * (TILE_WIDTH / 2) + bounds.offsetX - 30,
                          top: (room.gridX + room.gridY) * (TILE_HEIGHT / 2) + bounds.offsetY - 60,
                          width: TILE_WIDTH + 60,
                        }}
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div
                          className="rounded-lg px-3 py-2 text-center"
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(6px)',
                            border: `1px solid ${domainCfg.tileColor}44`,
                          }}
                        >
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <span>{room.emoji}</span>
                            <span className="text-[10px] font-semibold text-white">{room.nome}</span>
                          </div>
                          <div className="text-[8px] font-medium" style={{ color: domainCfg.tileColor }}>
                            {domainCfg.label}
                          </div>
                          <div className="text-[8px] text-white/50 mt-0.5">
                            {isActive ? `${agentCount || room.seedAgentIds.length} agentes ativos` : 'Sem agentes'}
                          </div>
                          <div className="text-[7px] text-white/30 mt-0.5">
                            Clique para entrar
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** Domain cluster labels floating on the world map */
function DomainLabels({ offsetX, offsetY }: { offsetX: number; offsetY: number }) {
  const labels: Array<{ domain: DepartmentId; x: number; y: number }> = [
    { domain: 'vendas', x: -50, y: -10 },
    { domain: 'marketing', x: 230, y: -10 },
    { domain: 'financeiro', x: 460, y: -10 },
    { domain: 'operacoes', x: -50, y: 210 },
    { domain: 'atendimento', x: 230, y: 210 },
  ];

  return (
    <>
      {labels.map(({ domain, x, y }) => {
        const d = DOMAINS[domain];
        return (
          <div
            key={domain}
            className="absolute pointer-events-none"
            style={{ left: x + offsetX, top: y + offsetY }}
          >
            <span
              className="text-[9px] font-bold uppercase tracking-widest opacity-30"
              style={{ color: d.tileColor }}
            >
              {d.emoji} {d.label}
            </span>
          </div>
        );
      })}
    </>
  );
}

/** Workflow connection lines between rooms */
function WorkflowLines({
  getRoomPos,
  hoveredRoom,
}: {
  getRoomPos: (id: string) => { x: number; y: number } | null;
  hoveredRoom: string | null;
}) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {WORKFLOW_LINKS.map((link) => {
        const from = getRoomPos(link.from);
        const to = getRoomPos(link.to);
        if (!from || !to) return null;

        const isHighlighted = hoveredRoom === link.from || hoveredRoom === link.to;

        return (
          <g key={`${link.from}-${link.to}`}>
            <line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray="6 4"
              opacity={isHighlighted ? 0.4 : 0.15}
            >
              {isHighlighted && (
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;20"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </line>
          </g>
        );
      })}
    </svg>
  );
}
