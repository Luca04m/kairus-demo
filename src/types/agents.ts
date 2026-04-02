// src/types/agents.ts
// Agent configuration, status, and template types

import type { UUID, TenantId, ISODateString } from './common';
import type { DepartmentId } from './departments';

// ─── Agent Status ─────────────────────────────────────────
export type AgentStatus = 'ativo' | 'pausado' | 'idle';

// ─── Agent ────────────────────────────────────────────────
export interface Agent {
  id: UUID;
  tenant_id: TenantId;
  department_id: UUID;
  nome: string;
  iniciais: string;
  /** Slug of the department for quick lookups */
  departamento: DepartmentId;
  departamento_emoji: string;
  departamento_cor: string;
  status: AgentStatus;
  descricao: string;
  ultima_acao: string;
  ultima_acao_tempo: string;
  tarefas_concluidas: number;
  tarefas_falhadas: number;
  taxa_aprovacao: string;
  avatar_url?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Agent Config ─────────────────────────────────────────
/** Per-agent operational configuration */
export interface AgentConfig {
  id: UUID;
  agent_id: UUID;
  /** Actions below this value run without approval */
  auto_approval_limit: number;
  /** Approval mode */
  approval_mode: 'manual' | 'semi-auto' | 'automatico';
  /** Continuous learning toggle */
  learning_enabled: boolean;
  /** Detail level for reports */
  report_detail: 'resumido' | 'padrao' | 'detalhado';
  /** Working hours (24h format) */
  active_hours_start: string;
  active_hours_end: string;
  updated_at: ISODateString;
}

// ─── Agent Template ───────────────────────────────────────
export interface AgentTemplate {
  id: UUID;
  nome: string;
  descricao: string;
  departamento: DepartmentId;
  icone: string;
  capabilities: string[];
  default_config: Partial<AgentConfig>;
  is_premium: boolean;
  created_at: ISODateString;
}

// ─── Agent Analytics ──────────────────────────────────────
export interface AgentDailyStats {
  dia: string;
  concluidas: number;
  falhadas: number;
}

export interface AgentAnalytics {
  agent_id: UUID;
  tarefas_concluidas: number;
  tarefas_falhadas: number;
  taxa_aprovacao: number;
  duracao_media: string;
  duracao_total: string;
  feedback_positivo: number;
  feedback_negativo: number;
  tarefas_por_dia: AgentDailyStats[];
}

// ─── Agent Task (workspace) ──────────────────────────────
export type AgentTaskType = 'analise' | 'automacao' | 'monitoramento';

export type AgentTaskStatus = 'concluida' | 'em_progresso' | 'pendente' | 'falha';

export interface AgentTask {
  id: UUID;
  agent_id: UUID;
  titulo: string;
  status: AgentTaskStatus;
  tempo: string;
  resultado?: string;
  tipo: AgentTaskType;
  created_at: ISODateString;
  completed_at?: ISODateString;
}
