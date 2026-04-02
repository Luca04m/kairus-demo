// src/types/crm.ts
// CRM types: clients, leads, conversations, messages

import type { UUID, TenantId, ISODateString, Priority } from './common';

// ─── Client Type ──────────────────────────────────────────
export type ClientType = 'b2b' | 'b2c';

// ─── Client Status ────────────────────────────────────────
export type ClientStatus = 'ativo' | 'inativo' | 'churned';

// ─── Client ───────────────────────────────────────────────
export interface Client {
  id: UUID;
  tenant_id: TenantId;
  nome: string;
  email?: string;
  telefone?: string;
  tipo: ClientType;
  status: ClientStatus;
  empresa?: string;
  /** Total purchase count */
  total_compras: number;
  /** Total revenue from this client */
  receita_total: number;
  /** Average ticket value */
  ticket_medio: number;
  /** Days since last purchase */
  dias_desde_ultima_compra: number;
  /** Churn risk score 0-100 */
  churn_risk?: number;
  tags?: string[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Lead ─────────────────────────────────────────────────
export type LeadStage = 'novo' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';

export interface Lead {
  id: UUID;
  tenant_id: TenantId;
  nome: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  origem: string;
  stage: LeadStage;
  valor_estimado?: number;
  prioridade: Priority;
  agent_id?: UUID;
  assigned_to?: UUID;
  notas?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Conversation ─────────────────────────────────────────
export type ConversationChannel = 'whatsapp' | 'email' | 'chat' | 'telefone';

export type ConversationStatus = 'aberta' | 'respondida' | 'fechada' | 'escalada';

export interface Conversation {
  id: UUID;
  tenant_id: TenantId;
  client_id: UUID;
  channel: ConversationChannel;
  status: ConversationStatus;
  assunto?: string;
  agent_id?: UUID;
  /** Whether it was handled automatically */
  is_automated: boolean;
  /** NPS score if collected */
  nps_score?: number;
  message_count: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  closed_at?: ISODateString;
}

// ─── Message ──────────────────────────────────────────────
export type MessageSender = 'client' | 'agent' | 'human_operator';

export interface Message {
  id: UUID;
  conversation_id: UUID;
  sender: MessageSender;
  sender_name: string;
  content: string;
  /** Whether the message was sent by an AI agent */
  is_automated: boolean;
  attachments?: MessageAttachment[];
  created_at: ISODateString;
}

export interface MessageAttachment {
  id: UUID;
  name: string;
  type: 'image' | 'file' | 'audio' | 'video';
  mime_type: string;
  size: number;
  url: string;
}
