// src/components/sales-room/seed.ts
// Seed data for the sales room simulation

import type { UUID } from '@/types/common';

// ─── Local types for seed data ──────────────────────────
export type SalesRoomAgentRole = 'vendas' | 'suporte';
export type SalesRoomPipeline =
  | 'SDR'
  | 'Pre-Venda'
  | 'Closer'
  | 'Pos-Venda'
  | 'Triagem'
  | 'Tech'
  | 'Financeiro'
  | 'Conteudo';

export type LeadTemperature = 'hot' | 'warm' | 'cold';
export type WhatsAppStatus = 'connected' | 'simulating' | 'disconnected' | 'error';

export interface SalesRoomMessage {
  id: string;
  sender: 'agent' | 'lead';
  content: string;
  timestamp: string;
}

export interface SalesRoomLead {
  name: string;
  phone: string;
  temperature: LeadTemperature;
  source: string;
  cartValue: number;
}

export interface SalesRoomAgent {
  id: UUID;
  name: string;
  initials: string;
  role: SalesRoomAgentRole;
  pipeline: SalesRoomPipeline;
  status: 'disponivel' | 'em_atendimento' | 'offline';
  lead: SalesRoomLead | null;
  messages: SalesRoomMessage[];
  lastMessageTime: string;
  isTyping: boolean;
}

export interface SalesRoomActivity {
  id: string;
  type:
    | 'message-sent'
    | 'message-received'
    | 'cart-recovered'
    | 'sale-closed'
    | 'lead-qualified'
    | 'follow-up-scheduled'
    | 'lead-lost';
  agentName: string;
  description: string;
  timestamp: string;
  value?: number;
}

export interface SalesRoomMetrics {
  conversas: number;
  vendas: number;
  conversao: number;
  leads: number;
}

// ─── Seed agents ─────────────────────────────────────────
const now = new Date().toISOString();

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

export const SEED_AGENTS: SalesRoomAgent[] = [
  // Sales pipeline
  {
    id: 'sr-agent-001' as UUID,
    name: 'Ana',
    initials: 'AN',
    role: 'vendas',
    pipeline: 'SDR',
    status: 'em_atendimento',
    lead: {
      name: 'Ricardo Almeida',
      phone: '+55 11 98765-4321',
      temperature: 'hot',
      source: 'Instagram Ads',
      cartValue: 1250,
    },
    messages: [
      { id: 'msg-001', sender: 'lead', content: 'Oi, vi o anuncio do kit verão. Ainda tem?', timestamp: minutesAgo(12) },
      { id: 'msg-002', sender: 'agent', content: 'Ola Ricardo! Sim, temos sim. O Kit Verão está com 15% de desconto hoje. Posso montar seu pedido?', timestamp: minutesAgo(11) },
      { id: 'msg-003', sender: 'lead', content: 'Quero sim! Manda o link', timestamp: minutesAgo(8) },
      { id: 'msg-004', sender: 'agent', content: 'Perfeito! Aqui esta o link do carrinho com o Kit Verão + frete gratis: mrlion.com.br/cart/xk29', timestamp: minutesAgo(7) },
      { id: 'msg-005', sender: 'lead', content: 'Adorei, vou fechar agora', timestamp: minutesAgo(2) },
    ],
    lastMessageTime: minutesAgo(2),
    isTyping: false,
  },
  {
    id: 'sr-agent-002' as UUID,
    name: 'Bruno',
    initials: 'BR',
    role: 'vendas',
    pipeline: 'Pre-Venda',
    status: 'em_atendimento',
    lead: {
      name: 'Fernanda Costa',
      phone: '+55 21 91234-5678',
      temperature: 'warm',
      source: 'Google Ads',
      cartValue: 480,
    },
    messages: [
      { id: 'msg-006', sender: 'lead', content: 'Boa tarde, queria saber sobre o frete para RJ', timestamp: minutesAgo(20) },
      { id: 'msg-007', sender: 'agent', content: 'Boa tarde Fernanda! Para o RJ o frete sai R$15 e chega em 3 dias uteis. Acima de R$500 é gratis!', timestamp: minutesAgo(19) },
      { id: 'msg-008', sender: 'lead', content: 'Hmm, vou pensar... esta um pouco caro', timestamp: minutesAgo(15) },
    ],
    lastMessageTime: minutesAgo(15),
    isTyping: false,
  },
  {
    id: 'sr-agent-003' as UUID,
    name: 'Clara',
    initials: 'CL',
    role: 'vendas',
    pipeline: 'Closer',
    status: 'em_atendimento',
    lead: {
      name: 'Paulo Mendes',
      phone: '+55 31 99876-5432',
      temperature: 'hot',
      source: 'Recompra B2B',
      cartValue: 4800,
    },
    messages: [
      { id: 'msg-009', sender: 'agent', content: 'Paulo, bom dia! Vi que seu estoque deve estar acabando. Preparei uma proposta especial para a recompra.', timestamp: minutesAgo(30) },
      { id: 'msg-010', sender: 'lead', content: 'Manda a proposta, preciso de 10 caixas do gin premium', timestamp: minutesAgo(25) },
      { id: 'msg-011', sender: 'agent', content: '10 caixas Gin Premium: R$4.800 com 8% de desconto progressivo. Posso gerar o pedido?', timestamp: minutesAgo(24) },
      { id: 'msg-012', sender: 'lead', content: 'Fechado. Gera o boleto', timestamp: minutesAgo(3) },
    ],
    lastMessageTime: minutesAgo(3),
    isTyping: false,
  },
  {
    id: 'sr-agent-004' as UUID,
    name: 'Diego',
    initials: 'DI',
    role: 'vendas',
    pipeline: 'Pos-Venda',
    status: 'disponivel',
    lead: {
      name: 'Mariana Silva',
      phone: '+55 11 97654-3210',
      temperature: 'cold',
      source: 'Pos-Venda',
      cartValue: 0,
    },
    messages: [
      { id: 'msg-013', sender: 'agent', content: 'Ola Mariana! Como foi a experiencia com o Kit Tropical? Gostaríamos do seu feedback.', timestamp: minutesAgo(120) },
      { id: 'msg-014', sender: 'lead', content: 'Foi bom, mas demorou pra chegar', timestamp: minutesAgo(90) },
    ],
    lastMessageTime: minutesAgo(90),
    isTyping: false,
  },
  // Support pipeline
  {
    id: 'sr-agent-005' as UUID,
    name: 'Eva',
    initials: 'EV',
    role: 'suporte',
    pipeline: 'Triagem',
    status: 'em_atendimento',
    lead: {
      name: 'Lucas Ferreira',
      phone: '+55 85 98765-1234',
      temperature: 'warm',
      source: 'WhatsApp',
      cartValue: 0,
    },
    messages: [
      { id: 'msg-015', sender: 'lead', content: 'Meu pedido #4521 nao chegou ainda, ja faz 10 dias', timestamp: minutesAgo(5) },
      { id: 'msg-016', sender: 'agent', content: 'Ola Lucas! Deixa eu verificar o status do seu pedido #4521. Um momento por favor.', timestamp: minutesAgo(4) },
    ],
    lastMessageTime: minutesAgo(4),
    isTyping: true,
  },
  {
    id: 'sr-agent-006' as UUID,
    name: 'Fabio',
    initials: 'FA',
    role: 'suporte',
    pipeline: 'Tech',
    status: 'em_atendimento',
    lead: {
      name: 'Juliana Santos',
      phone: '+55 11 91234-9876',
      temperature: 'cold',
      source: 'Site',
      cartValue: 0,
    },
    messages: [
      { id: 'msg-017', sender: 'lead', content: 'Nao consigo finalizar a compra, da erro no pagamento', timestamp: minutesAgo(8) },
      { id: 'msg-018', sender: 'agent', content: 'Juliana, vou verificar! Pode me dizer qual forma de pagamento esta usando?', timestamp: minutesAgo(7) },
      { id: 'msg-019', sender: 'lead', content: 'Cartao Visa credito', timestamp: minutesAgo(6) },
    ],
    lastMessageTime: minutesAgo(6),
    isTyping: false,
  },
  {
    id: 'sr-agent-007' as UUID,
    name: 'Gabi',
    initials: 'GA',
    role: 'suporte',
    pipeline: 'Financeiro',
    status: 'disponivel',
    lead: null,
    messages: [],
    lastMessageTime: minutesAgo(45),
    isTyping: false,
  },
  {
    id: 'sr-agent-008' as UUID,
    name: 'Hugo',
    initials: 'HU',
    role: 'suporte',
    pipeline: 'Conteudo',
    status: 'offline',
    lead: null,
    messages: [],
    lastMessageTime: now,
    isTyping: false,
  },
];

export const SEED_ACTIVITIES: SalesRoomActivity[] = [
  { id: 'act-001', type: 'sale-closed', agentName: 'Clara', description: 'Fechou pedido B2B — 10cx Gin Premium', timestamp: minutesAgo(3), value: 4800 },
  { id: 'act-002', type: 'message-received', agentName: 'Ana', description: 'Lead Ricardo confirmou interesse', timestamp: minutesAgo(5) },
  { id: 'act-003', type: 'cart-recovered', agentName: 'Bruno', description: 'Carrinho recuperado — Fernanda Costa', timestamp: minutesAgo(10), value: 480 },
  { id: 'act-004', type: 'lead-qualified', agentName: 'Ana', description: 'Lead qualificado via Instagram Ads', timestamp: minutesAgo(15) },
  { id: 'act-005', type: 'message-sent', agentName: 'Eva', description: 'Respondeu consulta de rastreamento', timestamp: minutesAgo(18) },
  { id: 'act-006', type: 'follow-up-scheduled', agentName: 'Diego', description: 'Follow-up agendado — Mariana Silva', timestamp: minutesAgo(25) },
  { id: 'act-007', type: 'message-sent', agentName: 'Fabio', description: 'Enviou instrucoes de pagamento', timestamp: minutesAgo(30) },
  { id: 'act-008', type: 'lead-lost', agentName: 'Bruno', description: 'Lead Pedro — sem resposta ha 48h', timestamp: minutesAgo(60) },
];

export const SEED_METRICS: SalesRoomMetrics = {
  conversas: 24,
  vendas: 7,
  conversao: 29,
  leads: 18,
};
