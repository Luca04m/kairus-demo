// src/types/marketing.ts
// Marketing campaign and traffic types

import type { UUID, TenantId, ISODateString, MonthLabel } from './common';

// ─── Marketing KPI ────────────────────────────────────────
export interface MarketingKpi {
  label: string;
  valor: string;
  sub: string;
  icon: string;
}

// ─── Campaign Platform ────────────────────────────────────
export type CampaignPlatform = 'meta_ads' | 'google_ads' | 'instagram' | 'email';

// ─── Campaign Status ──────────────────────────────────────
export type CampaignStatus = 'ativa' | 'pausada' | 'encerrada' | 'rascunho';

// ─── Campaign ─────────────────────────────────────────────
export interface Campaign {
  id: UUID;
  tenant_id: TenantId;
  nome: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  orcamento_diario?: number;
  orcamento_total?: number;
  data_inicio: ISODateString;
  data_fim?: ISODateString;
  agent_id?: UUID;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Campaign Metric (monthly snapshot) ──────────────────
export interface CampaignMetric {
  mes: MonthLabel;
  spend: string;
  impressoes: string;
  clicks: string;
  ctr: string;
  cpc: string;
  roas: string;
}

// ─── Traffic Data ─────────────────────────────────────────
export interface TrafficData {
  mes: MonthLabel;
  sessoes: number;
  views: number;
}

// ─── Content Post ─────────────────────────────────────────
export type ContentPlatform = 'instagram' | 'facebook' | 'tiktok' | 'blog';

export type ContentStatus = 'publicado' | 'agendado' | 'rascunho';

export interface ContentPost {
  id: UUID;
  tenant_id: TenantId;
  platform: ContentPlatform;
  status: ContentStatus;
  titulo: string;
  tipo: string;
  alcance?: number;
  engajamento?: number;
  agent_id?: UUID;
  published_at?: ISODateString;
  created_at: ISODateString;
}

// ─── Marketing Summary ────────────────────────────────────
export interface MarketingSummary {
  investimento_total: number;
  roas_geral: string;
  sessoes: number;
  cpc_medio: string;
  ctr_medio: string;
  posts_publicados: number;
}
