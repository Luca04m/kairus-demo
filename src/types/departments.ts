// src/types/departments.ts
// Department and squad types

import type { UUID, TenantId, ISODateString } from './common';

// ─── Department ───────────────────────────────────────────
export type DepartmentId = 'financeiro' | 'marketing' | 'vendas' | 'operacoes' | 'atendimento';

export interface Department {
  id: UUID;
  tenant_id: TenantId;
  slug: DepartmentId;
  nome: string;
  emoji: string;
  cor: string;
  descricao?: string;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Department Stats ─────────────────────────────────────
export interface DepartmentStats {
  department_id: UUID;
  slug: DepartmentId;
  nome: string;
  emoji: string;
  cor: string;
  agent_count: number;
  active_agents: number;
  tarefas_concluidas: number;
  tarefas_em_progresso: number;
  tarefas_pendentes: number;
  taxa_aprovacao: number;
}

// ─── Squad ────────────────────────────────────────────────
/** A squad is a sub-group within a department for task routing */
export interface Squad {
  id: UUID;
  tenant_id: TenantId;
  department_id: UUID;
  nome: string;
  descricao?: string;
  agent_ids: UUID[];
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Department KPI (overview) ────────────────────────────
export interface DepartmentKpi {
  departamento: string;
  emoji: string;
  label: string;
  valor: string;
  variacao: string;
  direcao: 'up' | 'down' | 'neutral';
  periodo: string;
}
