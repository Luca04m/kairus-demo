// src/types/reports.ts
// Report types for the reports screen

import type { UUID, TenantId, ISODateString } from './common';

// ─── Report Type ──────────────────────────────────────────
export type ReportType = 'semanal' | 'mensal' | 'custom';

// ─── Report Status ────────────────────────────────────────
export type ReportStatus = 'pronto' | 'gerando' | 'falha';

// ─── Report ───────────────────────────────────────────────
export interface Report {
  id: UUID;
  tenant_id: TenantId;
  tipo: ReportType;
  titulo: string;
  periodo: string;
  agente: string;
  agent_id?: UUID;
  criado_em: string;
  resumo: string;
  status: ReportStatus;
  /** URL to generated PDF, if available */
  pdf_url?: string;
  /** Sections included in the report */
  sections?: ReportSection[];
  created_at: ISODateString;
}

// ─── Report Section ───────────────────────────────────────
export interface ReportSection {
  titulo: string;
  conteudo: string;
  tipo: 'texto' | 'tabela' | 'grafico';
  dados?: Record<string, unknown>;
}

// ─── Report Filters ───────────────────────────────────────
export interface ReportFilters {
  tipo?: ReportType[];
  agente?: string;
  status?: ReportStatus[];
  date_from?: ISODateString;
  date_to?: ISODateString;
}
