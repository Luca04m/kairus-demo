"use client";

import { useMemo, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { AgentSpritePixel } from './AgentSpritePixel';
import { RoomFurniture } from './RoomFurniture';
import { RoomEnvironment } from './RoomEnvironment';
import { EmbeddedScreen } from './EmbeddedScreen';
import { SpeechBubble } from './SpeechBubble';
import { InteractiveFurniture } from './InteractiveFurniture';
import { AmbientParticles } from './AmbientParticles';
import { useAgentMovement } from './useAgentMovement';
import { useDayNightCycle } from './useDayNightCycle';
import { ROOMS, furnitureTemplates, ROOM_COLS, ROOM_ROWS } from '@/data/world-layout';
import { DOMAINS } from '@/data/world-layout';
import { IconByName } from '@/lib/icons';
import { AGENTES } from '@/data/mrlion';
import { useWorldStore } from '@/stores/worldStore';
import type { DepartmentId } from '@/types/departments';

interface RoomViewProps {
  roomId: string;
  onBack: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ROOM_TILE = 56;
const ROOM_W = ROOM_COLS * ROOM_TILE;
const ROOM_H = ROOM_ROWS * ROOM_TILE;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;

export function RoomView({ roomId, onBack, zoom, onZoomChange }: RoomViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const presences = useWorldStore((s) => s.presences);

  const roomConfig = ROOMS.find((r) => r.id === roomId);
  const domain: DepartmentId = roomConfig?.domain || 'vendas';
  const domainCfg = DOMAINS[domain];
  const furniture = furnitureTemplates[domain] || [];

  const dayNight = useDayNightCycle();

  // Get agents in this room from presences + seed agents
  const roomAgents = useMemo(() => {
    const agentIdsInRoom = new Set<string>();
    // From live presences
    presences.forEach((p) => {
      if (p.room_id === roomId) agentIdsInRoom.add(p.agent_id);
    });
    // From seed data
    roomConfig?.seedAgentIds.forEach((id) => agentIdsInRoom.add(id));
    return AGENTES.filter((a) => agentIdsInRoom.has(a.id));
  }, [presences, roomId, roomConfig]);

  // Movement hook
  const movementMap = useAgentMovement(roomAgents, domain);

  const handleRoomPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = {
      active: true, startX: e.clientX, startY: e.clientY,
      startPanX: cameraOffset.x, startPanY: cameraOffset.y,
    };
    setIsDragging(true);
  }, [cameraOffset]);

  const handleRoomPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setCameraOffset({
      x: Math.max(-ROOM_W / 2, Math.min(ROOM_W / 2, dragRef.current.startPanX + dx)),
      y: Math.max(-ROOM_H / 2, Math.min(ROOM_H / 2, dragRef.current.startPanY + dy)),
    });
  }, []);

  const handleRoomPointerUp = useCallback(() => {
    dragRef.current.active = false;
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    onZoomChange(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta)));
  }, [zoom, onZoomChange]);

  return (
    <div className="h-full flex flex-col">
      {/* Room header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3">
        <motion.button
          onClick={onBack}
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Voltar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        <div className="flex items-center gap-2">
          {roomConfig && <IconByName name={roomConfig.emoji} size={18} />}
          <div>
            <h2 className="text-sm font-semibold text-white">
              {roomConfig?.nome || roomId}
            </h2>
            <span className="text-[10px] font-medium" style={{ color: domainCfg.tileColor }}>
              {domainCfg.label} · {roomAgents.length} agentes · {dayNight.period}
            </span>
          </div>
        </div>
      </div>

      {/* Room interior */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden"
        onWheel={handleWheel}
        onPointerDown={handleRoomPointerDown}
        onPointerMove={handleRoomPointerMove}
        onPointerUp={handleRoomPointerUp}
        onPointerLeave={handleRoomPointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="min-h-full flex items-center justify-center p-6">
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: ROOM_W,
              height: ROOM_H,
              background: domainCfg.floorColor,
              boxShadow: `inset 0 0 60px ${domainCfg.tileColor}15, 0 8px 32px rgba(0,0,0,0.1)`,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: zoom, opacity: 1, x: cameraOffset.x, y: cameraOffset.y }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Floor grid */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ imageRendering: 'pixelated' }}>
              {Array.from({ length: ROOM_COLS + 1 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * ROOM_TILE} y1={0} x2={i * ROOM_TILE} y2={ROOM_H} stroke={domainCfg.tileBorder} strokeWidth="1" />
              ))}
              {Array.from({ length: ROOM_ROWS + 1 }).map((_, i) => (
                <line key={`h-${i}`} x1={0} y1={i * ROOM_TILE} x2={ROOM_W} y2={i * ROOM_TILE} stroke={domainCfg.tileBorder} strokeWidth="1" />
              ))}
            </svg>

            {/* Room border */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `3px solid ${domainCfg.tileColor}44` }} />

            {/* Ambient particles */}
            <AmbientParticles domain={domain} roomWidth={ROOM_W} roomHeight={ROOM_H} />

            {/* Walls, windows, clock, plaque */}
            <RoomEnvironment domain={domain} tileSize={ROOM_TILE} roomWidth={ROOM_W} />

            {/* Furniture */}
            <RoomFurniture items={furniture} domain={domain} tileSize={ROOM_TILE} />

            {/* Embedded screens on monitors */}
            {furniture
              .filter((item) => item.type === 'monitor' || item.type === 'projectorScreen')
              .map((item, i) => (
                <EmbeddedScreen
                  key={`screen-${item.type}-${i}`}
                  domain={domain}
                  type={item.type as 'monitor' | 'projectorScreen'}
                  x={item.x}
                  y={item.y}
                  tileSize={ROOM_TILE}
                />
              ))}

            {/* Door / exit */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer pb-1"
              onClick={onBack}
              whileHover={{ y: 2 }}
              role="button"
              tabIndex={0}
              aria-label="Sair da sala"
            >
              <svg width="24" height="20" viewBox="0 0 24 20" style={{ imageRendering: 'pixelated' }}>
                <rect x="4" y="0" width="16" height="18" fill={domainCfg.tileBorder} rx="2" />
                <rect x="6" y="2" width="12" height="14" fill={domainCfg.floorColor} />
                <circle cx="15" cy="10" r="1.5" fill={domainCfg.tileBorder} />
              </svg>
              <span className="text-[7px] mt-0.5" style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
                SAIR
              </span>
            </motion.div>

            {/* Interactive furniture hit areas */}
            {furniture.map((item, i) => (
              <InteractiveFurniture
                key={`interact-${item.type}-${i}`}
                item={item}
                domain={domain}
                tileSize={ROOM_TILE}
                index={i}
              />
            ))}

            {/* Agent sprites */}
            {roomAgents.map((agent) => {
              const moveState = movementMap.get(agent.id);
              const ax = moveState?.x ?? 0;
              const ay = moveState?.y ?? 0;

              return (
                <AgentSpritePixel
                  key={agent.id}
                  name={agent.nome}
                  domain={domain}
                  status={agent.status}
                  x={ax}
                  y={ay}
                  facing={moveState?.facing}
                  activity={moveState?.activity}
                  activityLabel={moveState?.activityLabel}
                />
              );
            })}

            {/* Speech bubbles */}
            {roomAgents.map((agent) => {
              const moveState = movementMap.get(agent.id);
              if (!moveState?.bubble) return null;
              return (
                <SpeechBubble
                  key={`bubble-${agent.id}`}
                  content={moveState.bubble}
                  x={moveState.x}
                  y={moveState.y}
                  color={domainCfg.tileColor}
                />
              );
            })}

            {/* Empty state */}
            {roomAgents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-[rgba(255,255,255,0.4)]">Nenhum agente nesta sala</p>
              </div>
            )}

            {/* Day/night overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: dayNight.overlayColor,
                opacity: dayNight.overlayOpacity,
                mixBlendMode: 'multiply',
                transition: 'opacity 60s ease, background 60s ease',
                zIndex: 48,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity pointer-events-none" style={{ zIndex: 10 }}>
        <span className="inline-flex items-center justify-center rounded text-[7px] font-mono font-bold px-1" style={{ height: 16, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
          ESC
        </span>
        <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>voltar</span>
      </div>
    </div>
  );
}
