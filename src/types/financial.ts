// src/types/financial.ts
// Financial screen types: KPIs, margins, sales evolution, products

import type { UUID, TenantId, ISODateString, MonthLabel } from './common';

// ─── Financial KPI ────────────────────────────────────────
export interface FinancialKpi {
  label: string;
  valor: string;
  sub: string;
  icon: string;
}

// ─── Monthly Sales ────────────────────────────────────────
export interface MonthlySales {
  mes: MonthLabel;
  receita: number;
  pedidos: number;
}

// ─── Product Revenue ──────────────────────────────────────
export interface ProductRevenue {
  nome: string;
  receita: string;
  percentual: string;
  unidades: number;
}

// ─── Margin Data (per SKU) ────────────────────────────────
export interface MarginData {
  id: UUID;
  tenant_id: TenantId;
  product_name: string;
  preco_venda: number;
  cmv: number;
  frete_medio: number;
  margem_bruta: number;
  margem_percentual: number;
  periodo: MonthLabel;
  is_negative: boolean;
  updated_at: ISODateString;
}

// ─── DRE Row ──────────────────────────────────────────────
export interface DreRow {
  label: string;
  valor: number;
  percentual?: number;
  is_subtotal: boolean;
}

export interface Dre {
  periodo: MonthLabel;
  receita_bruta: number;
  cmv: number;
  margem_bruta: number;
  despesas_marketing: number;
  despesas_frete: number;
  despesas_operacionais: number;
  resultado_liquido: number;
  rows: DreRow[];
}

// ─── Chargeback ───────────────────────────────────────────
export interface ChargebackData {
  periodo: MonthLabel;
  total: number;
  quantidade: number;
  taxa_percentual: number;
  is_critical: boolean;
}

// ─── Evolution Data (generic chart series) ────────────────
export interface EvolutionData {
  mes: MonthLabel;
  [key: string]: string | number;
}

// ─── Financial Summary ────────────────────────────────────
export interface FinancialSummary {
  receita_mensal: number;
  ticket_medio: number;
  margem_bruta_percentual: number;
  cmv_total: number;
  frete_total: number;
  total_pedidos: number;
  chargeback_taxa: number;
}
