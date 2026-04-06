"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { DepartmentId } from '@/types/departments';
import type { FurnitureItem } from '@/data/world-layout';
import { furnitureTemplates, ROOM_COLS, ROOM_ROWS } from '@/data/world-layout';
import type { Agente } from '@/data/agentes';

// ── Types ──

export type AgentActivity = 'idle' | 'walking' | 'at-furniture' | 'chatting';
export type FacingDirection = 'left' | 'right';
export type BubbleContent = 'thinking' | 'eureka' | 'code' | 'money' | 'chart' | 'chat';

export interface AgentMovementState {
  x: number;
  y: number;
  activity: AgentActivity;
  targetAgentId?: string;
  facing: FacingDirection;
  bubble?: BubbleContent;
  activityLabel?: string;
}

// ── Constants ──

const ROOM_TILE = 56;
const MARGIN = ROOM_TILE * 1.2;
const MARGIN_TOP = ROOM_TILE * 2.2;
const MAX_X = ROOM_COLS * ROOM_TILE - MARGIN;
const MAX_Y = ROOM_ROWS * ROOM_TILE - MARGIN;

const FURNITURE_OFFSETS: Partial<Record<FurnitureItem['type'], { dx: number; dy: number; label: string }>> = {
  desk:            { dx: 0,  dy: 10, label: 'Digitando...' },
  coffee:          { dx: 10, dy: 0,  label: 'Pegando cafe' },
  whiteboard:      { dx: 0,  dy: 14, label: 'Planejando' },
  plant:           { dx: 6,  dy: 0,  label: 'Pausa rapida' },
  couch:           { dx: 0,  dy: 6,  label: 'Descansando' },
  bookshelf:       { dx: 6,  dy: 0,  label: 'Lendo' },
  monitor:         { dx: 0,  dy: 10, label: 'Verificando metricas' },
  chartBoard:      { dx: 0,  dy: 12, label: 'Analisando dados' },
  serverRack:      { dx: 6,  dy: 0,  label: 'Verificando servidor' },
  camera:          { dx: 0,  dy: 10, label: 'Gravando' },
  meetingTable:    { dx: 16, dy: 8,  label: 'Em reuniao' },
  waterCooler:     { dx: 10, dy: 0,  label: 'Pausa agua' },
  printer:         { dx: 0,  dy: 10, label: 'Imprimindo' },
  stickyWall:      { dx: 0,  dy: 14, label: 'Organizando ideias' },
  cabinet:         { dx: 6,  dy: 0,  label: 'Arquivando docs' },
  projectorScreen: { dx: 0,  dy: 14, label: 'Apresentando' },
};

const DOMAIN_BUBBLES: Record<DepartmentId, BubbleContent[]> = {
  vendas:      ['money', 'chart', 'eureka'],
  marketing:   ['thinking', 'eureka', 'chat'],
  financeiro:  ['chart', 'thinking', 'money'],
  operacoes:   ['code', 'chart', 'thinking'],
  atendimento: ['chat', 'thinking', 'eureka'],
};

// ── Utilities ──

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function clamp(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.max(MARGIN, Math.min(MAX_X, x)),
    y: Math.max(MARGIN_TOP, Math.min(MAX_Y, y)),
  };
}

function jitter(val: number, offset: number, seed: number): number {
  return val + ((seed % (offset * 2 + 1)) - offset);
}

function computeHomePositions(
  agents: Agente[],
  roomCols: number,
): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  agents.forEach((agent, idx) => {
    const cols = Math.min(6, Math.ceil(Math.sqrt(agents.length)));
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const spacingX = (roomCols * ROOM_TILE - MARGIN * 2) / (cols + 1);
    const startY = ROOM_TILE * 4;
    const spacingY = ROOM_TILE * 2;
    map.set(agent.id, clamp(
      MARGIN + spacingX * (col + 1),
      startY + row * spacingY,
    ));
  });
  return map;
}

function furnitureWaypoints(domain: DepartmentId): Array<{ x: number; y: number; label: string; type: FurnitureItem['type'] }> {
  const furniture = furnitureTemplates[domain];
  if (!furniture) return [];
  return furniture
    .filter((f) => f.type !== 'rug' && f.type !== 'lamp')
    .map((f) => {
      const offset = FURNITURE_OFFSETS[f.type] || { dx: 0, dy: 0, label: 'Idle' };
      const pos = clamp(f.x * ROOM_TILE + offset.dx, f.y * ROOM_TILE + offset.dy);
      return { ...pos, label: offset.label, type: f.type };
    });
}

// ── Hook ──

export function useAgentMovement(
  agents: Agente[] | undefined,
  domain: DepartmentId,
): Map<string, AgentMovementState> {
  const [movementMap, setMovementMap] = useState<Map<string, AgentMovementState>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const stateRef = useRef<Map<string, AgentMovementState>>(new Map());
  const tickRef = useRef(0);

  const homePositions = useMemo(
    () => (agents ? computeHomePositions(agents, ROOM_COLS) : new Map<string, { x: number; y: number }>()),
    [agents],
  );

  const waypoints = useMemo(() => furnitureWaypoints(domain), [domain]);
  const bubbleOptions = useMemo(() => DOMAIN_BUBBLES[domain], [domain]);

  const pickNextAction = useCallback(
    (agentId: string) => {
      const home = homePositions.get(agentId);
      if (!home) return;

      const hash = hashStr(agentId + tickRef.current);
      tickRef.current += 1;

      const stayChance = 60;
      const roll = hash % 100;
      const current = stateRef.current.get(agentId);

      if (roll < stayChance) {
        const jx = jitter(home.x, 4, hash);
        const jy = jitter(home.y, 3, hash >> 4);
        const { x: cx, y: cy } = clamp(jx, jy);
        stateRef.current.set(agentId, {
          x: cx, y: cy, activity: 'idle',
          facing: current?.facing || 'right',
          activityLabel: 'Trabalhando...',
        });
        setMovementMap(new Map(stateRef.current));
        return;
      }

      if (roll < stayChance + 22 && waypoints.length > 0) {
        const wp = waypoints[hash % waypoints.length];
        const dest = clamp(jitter(wp.x, 8, hash >> 2), jitter(wp.y, 8, hash >> 6));
        const fromX = current?.x || home.x;
        const facing: FacingDirection = dest.x > fromX ? 'right' : 'left';

        stateRef.current.set(agentId, {
          x: dest.x, y: dest.y, activity: 'walking', facing,
          activityLabel: `Indo para ${wp.label.toLowerCase()}`,
        });
        setMovementMap(new Map(stateRef.current));

        const arriveTimer = setTimeout(() => {
          stateRef.current.set(agentId, {
            x: dest.x, y: dest.y, activity: 'at-furniture', facing,
            bubble: bubbleOptions[hash % bubbleOptions.length],
            activityLabel: wp.label,
          });
          setMovementMap(new Map(stateRef.current));

          const clearTimer = setTimeout(() => {
            const st = stateRef.current.get(agentId);
            if (st?.activity === 'at-furniture') {
              stateRef.current.set(agentId, { ...st, bubble: undefined });
              setMovementMap(new Map(stateRef.current));
            }
          }, 3000 + (hash % 2000));
          timersRef.current.set(`${agentId}-bubble`, clearTimer);
        }, 1200 + (hash % 800));

        timersRef.current.set(`${agentId}-arrive`, arriveTimer);
        return;
      }

      if (agents && agents.length > 1) {
        const otherAgents = agents.filter((a) => a.id !== agentId);
        const targetAgent = otherAgents[hash % otherAgents.length];
        const targetPos = stateRef.current.get(targetAgent.id) || homePositions.get(targetAgent.id);

        if (targetPos) {
          const side = hash % 2 === 0 ? 36 : -36;
          const dest = clamp(targetPos.x + side, jitter(targetPos.y, 6, hash >> 3));
          const fromX = current?.x || home.x;
          const facing: FacingDirection = dest.x > fromX ? 'right' : 'left';

          stateRef.current.set(agentId, {
            x: dest.x, y: dest.y, activity: 'walking', facing,
            targetAgentId: targetAgent.id,
            activityLabel: `Indo falar com ${targetAgent.nome}`,
          });
          setMovementMap(new Map(stateRef.current));

          const chatTimer = setTimeout(() => {
            stateRef.current.set(agentId, {
              x: dest.x, y: dest.y, activity: 'chatting', facing,
              targetAgentId: targetAgent.id,
              bubble: bubbleOptions[hash % bubbleOptions.length],
              activityLabel: `Conversando com ${targetAgent.nome}`,
            });
            setMovementMap(new Map(stateRef.current));

            const endTimer = setTimeout(() => {
              const s1 = stateRef.current.get(agentId);
              if (s1?.activity === 'chatting') {
                stateRef.current.set(agentId, {
                  ...s1, activity: 'idle', bubble: undefined,
                  targetAgentId: undefined, activityLabel: 'Trabalhando...',
                });
              }
              setMovementMap(new Map(stateRef.current));
            }, 4000 + (hash % 4000));
            timersRef.current.set(`${agentId}-endchat`, endTimer);
          }, 1400 + (hash % 800));

          timersRef.current.set(`${agentId}-chat`, chatTimer);
          return;
        }
      }

      setMovementMap(new Map(stateRef.current));
    },
    [agents, homePositions, waypoints, bubbleOptions],
  );

  useEffect(() => {
    if (!agents || agents.length === 0) return;

    const timers = timersRef.current;

    const initialMap = new Map<string, AgentMovementState>();
    agents.forEach((agent) => {
      const home = homePositions.get(agent.id);
      if (home) {
        initialMap.set(agent.id, {
          x: home.x, y: home.y,
          activity: 'idle', facing: 'right', activityLabel: 'Trabalhando...',
        });
      }
    });
    stateRef.current = initialMap;
    queueMicrotask(() => setMovementMap(new Map(initialMap)));

    agents.forEach((agent) => {
      const h = hashStr(agent.nome);
      const baseInterval = 10000;
      const varianceRange = 12000;
      const initialDelay = 2000 + (h % 6000);

      const startTimer = setTimeout(() => {
        const tick = () => {
          pickNextAction(agent.id);
          const nextInterval = baseInterval + (hashStr(agent.id + Date.now()) % varianceRange);
          const nextTimer = setTimeout(tick, nextInterval);
          timers.set(`${agent.id}-cycle`, nextTimer);
        };
        tick();
      }, initialDelay);

      timers.set(`${agent.id}-start`, startTimer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [agents, homePositions, pickNextAction]);

  return movementMap;
}
