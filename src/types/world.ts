// src/types/world.ts
// World screen types: rooms, domains, nodes, presence

import type { UUID, TenantId, ISODateString } from './common';
import type { DepartmentId } from './departments';
import type { AgentStatus } from './agents';

// ─── Domain ───────────────────────────────────────────────
/** A domain groups rooms by department or functional area */
export interface Domain {
  id: UUID;
  tenant_id: TenantId;
  slug: DepartmentId;
  nome: string;
  emoji: string;
  cor: string;
  room_count: number;
}

// ─── Room ─────────────────────────────────────────────────
export type RoomType = 'workspace' | 'chat' | 'monitor' | 'report';

export interface Room {
  id: UUID;
  tenant_id: TenantId;
  domain_id: UUID;
  nome: string;
  descricao?: string;
  tipo: RoomType;
  /** Agent IDs currently in this room */
  agent_ids: UUID[];
  /** Whether the room is actively processing */
  is_active: boolean;
  created_at: ISODateString;
}

// ─── World Node ───────────────────────────────────────────
/** Visual node for the world map */
export interface WorldNode {
  id: UUID;
  type: 'domain' | 'room' | 'agent';
  label: string;
  emoji?: string;
  cor?: string;
  status?: AgentStatus | 'active' | 'idle';
  /** Position on the 2D map */
  x: number;
  y: number;
  /** Parent node ID for hierarchical layout */
  parent_id?: UUID;
  /** Number of children (for domain/room nodes) */
  children_count?: number;
}

// ─── World Edge ───────────────────────────────────────────
export interface WorldEdge {
  source: UUID;
  target: UUID;
  /** Edge weight represents activity level */
  weight?: number;
  label?: string;
}

// ─── World Graph ──────────────────────────────────────────
export interface WorldGraph {
  nodes: WorldNode[];
  edges: WorldEdge[];
}

// ─── Presence ─────────────────────────────────────────────
/** Real-time presence of an agent in a room */
export interface Presence {
  agent_id: UUID;
  room_id: UUID;
  status: AgentStatus;
  current_task?: string;
  last_heartbeat: ISODateString;
}

// ─── World Zoom Level ─────────────────────────────────────
export type WorldZoom = 'map' | 'room';
