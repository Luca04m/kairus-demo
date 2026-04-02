// src/types/approvals.ts
// Approval workflow types

import type { UUID, TenantId, ISODateString, Priority } from './common';

// ─── Approval Status ──────────────────────────────────────
export type ApprovalStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';

// ─── Approval Channel ─────────────────────────────────────
export type ApprovalChannel = 'app' | 'whatsapp' | 'email';

// ─── Approval ─────────────────────────────────────────────
export interface Approval {
  id: UUID;
  tenant_id: TenantId;
  agent_id: UUID;
  agente_nome: string;
  titulo: string;
  descricao: string;
  tipo: string;
  departamento: string;
  status: ApprovalStatus;
  prioridade: Priority;
  /** Monetary value involved, if any */
  valor?: number;
  /** Deadline for the approval decision */
  expires_at?: ISODateString;
  /** How user was notified */
  channel: ApprovalChannel;
  /** Action data the agent wants to execute */
  action_payload?: Record<string, unknown>;
  created_at: ISODateString;
  decided_at?: ISODateString;
  decided_by?: UUID;
  rejection_reason?: string;
}

// ─── Approval Action ──────────────────────────────────────
export type ApprovalAction = 'approve' | 'reject' | 'request_info';

export interface ApprovalDecision {
  approval_id: UUID;
  action: ApprovalAction;
  reason?: string;
  decided_via: ApprovalChannel;
}

// ─── Approval Filters ─────────────────────────────────────
export interface ApprovalFilters {
  status?: ApprovalStatus[];
  prioridade?: Priority[];
  departamento?: string[];
  agente?: string;
  date_from?: ISODateString;
  date_to?: ISODateString;
}

// ─── Approval Stats ───────────────────────────────────────
export interface ApprovalStats {
  total: number;
  pendentes: number;
  aprovados: number;
  rejeitados: number;
  tempo_medio_decisao_horas: number;
  by_department: Record<string, number>;
}
