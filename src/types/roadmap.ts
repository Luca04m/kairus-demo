// src/types/roadmap.ts
// Roadmap, timeline, feature, and milestone types

import type { UUID, TenantId, ISODateString, Priority } from './common';

// ─── Feature Status ───────────────────────────────────────
export type FeatureStatus = 'backlog' | 'em_desenvolvimento' | 'beta' | 'lancado';

// ─── MoSCoW Priority ─────────────────────────────────────
export type MoscowPriority = 'must' | 'should' | 'could' | 'wont';

// ─── Roadmap Status ──────────────────────────────────────
export type RoadmapStatus = 'planned' | 'in_progress' | 'done';

// ─── Impact / Effort ─────────────────────────────────────
export type ImpactLevel = 'high' | 'medium' | 'low';
export type EffortLevel = 'high' | 'medium' | 'low';

// ─── Feature ──────────────────────────────────────────────
export interface Feature {
  id: UUID;
  tenant_id: TenantId;
  titulo: string;
  descricao: string;
  status: FeatureStatus;
  prioridade: Priority;
  departamento?: string;
  /** Percentage complete (0-100) */
  progresso: number;
  milestone_id?: UUID;
  tags?: string[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Milestone ────────────────────────────────────────────
export interface Milestone {
  id: UUID;
  tenant_id: TenantId;
  titulo: string;
  descricao?: string;
  data_alvo: ISODateString;
  data_concluido?: ISODateString;
  is_completed: boolean;
  feature_count: number;
  features_completed: number;
}

// ─── Timeline Entry ───────────────────────────────────────
export interface TimelineEntry {
  id: UUID;
  date: ISODateString;
  titulo: string;
  descricao?: string;
  tipo: 'milestone' | 'feature' | 'release';
  status: FeatureStatus | 'concluido';
  related_id?: UUID;
}

// ─── Roadmap Item (unified view) ──────────────────────────
export type RoadmapItemType = 'feature' | 'milestone' | 'epic';

export interface RoadmapItem {
  id: UUID;
  type: RoadmapItemType;
  titulo: string;
  descricao?: string;
  status: FeatureStatus;
  prioridade: Priority;
  data_inicio?: ISODateString;
  data_fim?: ISODateString;
  progresso: number;
  children?: RoadmapItem[];
}

// ─── Roadmap Card Item (MoSCoW view) ─────────────────────
export interface RoadmapCardItem {
  id: string;
  titulo: string;
  descricao?: string;
  status: RoadmapStatus;
  prioridade: MoscowPriority;
  impacto: ImpactLevel;
  esforco: EffortLevel;
  departamento: string;
  squad?: string;
  tags: string[];
  data_inicio?: string;
  data_fim?: string;
  created_at: string;
  updated_at: string;
}

/** Payload for creating a new roadmap card item */
export type RoadmapCardItemCreate = Omit<RoadmapCardItem, 'id' | 'created_at' | 'updated_at'>;

/** Payload for updating an existing roadmap card item */
export type RoadmapCardItemUpdate = Partial<RoadmapCardItemCreate>;

// ─── Timeline (full view) ─────────────────────────────────
export interface Timeline {
  milestones: Milestone[];
  entries: TimelineEntry[];
  current_sprint?: string;
}
