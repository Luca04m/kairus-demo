// src/types/roi.ts
// ROI and impact measurement types

import type { UUID, TenantId, ISODateString, MonthLabel } from './common';

// ─── ROI Summary ──────────────────────────────────────────
export interface RoiSummary {
  investimento_setup: number;
  mensalidade: number;
  meses_contratado: number;
  investimento_total: number;
  valor_gerado: number;
  roi_percentual: string;
  break_even_mes: number;
}

// ─── ROI Timeline ─────────────────────────────────────────
export interface RoiTimelinePoint {
  mes: MonthLabel;
  investimento: number;
  valor: number;
  label: string;
}

// ─── ROI Category ─────────────────────────────────────────
export interface RoiCategory {
  categoria: string;
  valor: string;
  valor_numerico?: number;
  verificado: boolean;
}

// ─── Impact Data ──────────────────────────────────────────
export interface ImpactData {
  id: UUID;
  tenant_id: TenantId;
  categoria: string;
  descricao: string;
  valor_estimado: number;
  valor_verificado?: number;
  is_verified: boolean;
  agent_id?: UUID;
  periodo: MonthLabel;
  created_at: ISODateString;
}

// ─── ROI Metric (aggregate) ──────────────────────────────
export interface RoiMetric {
  tenant_id: TenantId;
  periodo: MonthLabel;
  investimento_acumulado: number;
  valor_gerado_acumulado: number;
  roi_percentual: number;
  categorias: RoiCategory[];
  timeline: RoiTimelinePoint[];
}
