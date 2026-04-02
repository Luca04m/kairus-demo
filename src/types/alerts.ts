// src/types/alerts.ts
// Alert types for the alert screen and dashboard

import type { UUID, TenantId, ISODateString, Severity, RelativeTimeString } from './common';

// ─── Alert Severity (re-export for convenience) ──────────
export type AlertSeverity = Severity;

// ─── Alert Status ─────────────────────────────────────────
export type AlertStatus = 'novo' | 'visto' | 'resolvido' | 'ignorado';

// ─── Alert ────────────────────────────────────────────────
export interface Alert {
  id: UUID;
  tenant_id: TenantId;
  departamento: string;
  titulo: string;
  descricao?: string;
  severidade: AlertSeverity;
  status: AlertStatus;
  agente: string;
  agent_id?: UUID;
  tempo: RelativeTimeString;
  created_at: ISODateString;
  resolved_at?: ISODateString;
  metadata?: Record<string, unknown>;
}

// ─── Alert Filters ────────────────────────────────────────
export interface AlertFilters {
  severidade?: AlertSeverity[];
  departamento?: string[];
  status?: AlertStatus[];
  agente?: string;
  date_from?: ISODateString;
  date_to?: ISODateString;
}

// ─── Alert Summary ────────────────────────────────────────
export interface AlertSummary {
  total: number;
  by_severity: Record<AlertSeverity, number>;
  by_department: Record<string, number>;
  unresolved: number;
}
