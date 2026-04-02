// src/types/sales-room.ts
// Sales room types: sales agents, conversations, metrics, activity

import type { UUID, TenantId, ISODateString, MonthLabel, Priority } from './common';
import type { ClientType } from './crm';

// ─── Sales Agent ──────────────────────────────────────────
export type SalesAgentStatus = 'disponivel' | 'em_atendimento' | 'offline';

export interface SalesAgent {
  id: UUID;
  tenant_id: TenantId;
  nome: string;
  iniciais: string;
  status: SalesAgentStatus;
  /** Active conversations count */
  conversas_ativas: number;
  /** Total deals closed this month */
  deals_fechados_mes: number;
  /** Revenue generated this month */
  receita_mes: number;
  /** Average response time in minutes */
  tempo_resposta_medio: number;
  avatar_url?: string;
}

// ─── Sales Conversation ───────────────────────────────────
export type SalesConversationStage =
  | 'primeiro_contato'
  | 'qualificacao'
  | 'proposta'
  | 'negociacao'
  | 'fechamento'
  | 'perdido';

export interface SalesConversation {
  id: UUID;
  tenant_id: TenantId;
  agent_id: UUID;
  client_name: string;
  client_type: ClientType;
  stage: SalesConversationStage;
  valor_estimado?: number;
  prioridade: Priority;
  /** Number of messages exchanged */
  message_count: number;
  /** Last message preview */
  last_message?: string;
  /** Channel of conversation */
  channel: 'whatsapp' | 'email' | 'telefone' | 'presencial';
  next_action?: string;
  next_action_date?: ISODateString;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Sales Metrics ────────────────────────────────────────
export interface SalesMetrics {
  receita_mensal: number;
  pedidos_mes: number;
  ticket_medio: number;
  taxa_conversao: number;
  pipeline_valor: number;
  deals_abertos: number;
  deals_fechados: number;
  tempo_medio_ciclo_dias: number;
}

// ─── Sales Monthly Data ───────────────────────────────────
export interface SalesMonthlySummary {
  mes: MonthLabel;
  receita: number;
  pedidos: number;
  novos_clientes: number;
  taxa_recompra: number;
}

// ─── Activity Event ───────────────────────────────────────
export type ActivityEventType =
  | 'mensagem_enviada'
  | 'proposta_enviada'
  | 'deal_fechado'
  | 'deal_perdido'
  | 'follow_up'
  | 'recompra_lembrete'
  | 'escalacao';

export interface ActivityEvent {
  id: UUID;
  agent_id: UUID;
  agente_nome: string;
  tipo: ActivityEventType;
  descricao: string;
  client_name?: string;
  valor?: number;
  tempo: string;
  created_at: ISODateString;
}

// ─── Reorder Alert ────────────────────────────────────────
export interface ReorderAlert {
  client_id: UUID;
  client_name: string;
  dias_desde_ultima_compra: number;
  valor_medio_compra: number;
  total_compras: number;
  /** Whether a reminder has already been sent */
  lembrete_enviado: boolean;
  lembrete_enviado_em?: ISODateString;
}
