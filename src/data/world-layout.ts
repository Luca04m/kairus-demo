// src/data/world-layout.ts
// Static world layout: domains, rooms, and seed agent assignments

import type { DepartmentId } from "@/types/departments";

// ─── Domain Visual Config ────────────────────────────────
export interface DomainVisual {
  id: DepartmentId;
  label: string;
  emoji: string;
  tileColor: string;
  tileBorder: string;
  glowColor: string;
  floorColor: string;
}

export const DOMAINS: Record<DepartmentId, DomainVisual> = {
  vendas: {
    id: "vendas",
    label: "Vendas",
    emoji: "shopping-cart",
    tileColor: "#22c55e",
    tileBorder: "#16a34a",
    glowColor: "rgba(34,197,94,0.25)",
    floorColor: "#EDFFF3",
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    emoji: "megaphone",
    tileColor: "#6366f1",
    tileBorder: "#4f46e5",
    glowColor: "rgba(99,102,241,0.25)",
    floorColor: "#F3F0FF",
  },
  financeiro: {
    id: "financeiro",
    label: "Financeiro",
    emoji: "dollar-sign",
    tileColor: "#3b82f6",
    tileBorder: "#2563eb",
    glowColor: "rgba(59,130,246,0.25)",
    floorColor: "#EBF3FF",
  },
  operacoes: {
    id: "operacoes",
    label: "Operacoes",
    emoji: "settings",
    tileColor: "#f59e0b",
    tileBorder: "#d97706",
    glowColor: "rgba(245,158,11,0.25)",
    floorColor: "#FFFBEB",
  },
  atendimento: {
    id: "atendimento",
    label: "Atendimento",
    emoji: "message-circle",
    tileColor: "#06b6d4",
    tileBorder: "#0891b2",
    glowColor: "rgba(6,182,212,0.25)",
    floorColor: "#ECFEFF",
  },
};

// Tech domain mapped under operacoes for DepartmentId compatibility
export const TECH_COLOR = {
  tileColor: "#818cf8",
  tileBorder: "#6366f1",
  glowColor: "rgba(129,140,248,0.25)",
};

// ─── Room Config ─────────────────────────────────────────
export interface RoomConfig {
  id: string;
  nome: string;
  descricao: string;
  domain: DepartmentId;
  emoji: string;
  /** Grid column (0-based) */
  gridX: number;
  /** Grid row (0-based) */
  gridY: number;
  /** Seed agent IDs from mrlion data */
  seedAgentIds: string[];
}

export const ROOMS: RoomConfig[] = [
  // ── Vendas (green cluster, top-left) ───────────────
  {
    id: "vendas-pipeline",
    nome: "Pipeline Ativo",
    descricao: "Gestao do pipeline de vendas ativo com acompanhamento de oportunidades",
    domain: "vendas",
    emoji: "bar-chart",
    gridX: 0,
    gridY: 0,
    seedAgentIds: ["rex"],
  },
  {
    id: "vendas-qualificacao",
    nome: "Qualificacao",
    descricao: "Qualificacao de leads e prospects com scoring automatico",
    domain: "vendas",
    emoji: "target",
    gridX: 1,
    gridY: 0,
    seedAgentIds: ["rex"],
  },
  {
    id: "vendas-fechamento",
    nome: "Fechamento",
    descricao: "Negociacoes finais e fechamento de contratos",
    domain: "vendas",
    emoji: "handshake",
    gridX: 0,
    gridY: 1,
    seedAgentIds: [],
  },
  {
    id: "vendas-pos-venda",
    nome: "Pos-Venda",
    descricao: "Acompanhamento pos-venda, recompra e satisfacao",
    domain: "vendas",
    emoji: "star",
    gridX: 1,
    gridY: 1,
    seedAgentIds: [],
  },

  // ── Marketing (purple cluster, top-center) ─────────
  {
    id: "mkt-campanhas",
    nome: "Campanhas",
    descricao: "Gestao de campanhas de marketing digital e performance",
    domain: "marketing",
    emoji: "megaphone",
    gridX: 3,
    gridY: 0,
    seedAgentIds: ["mia"],
  },
  {
    id: "mkt-conteudo",
    nome: "Conteudo",
    descricao: "Producao de conteudo para redes sociais e blog",
    domain: "marketing",
    emoji: "pen-line",
    gridX: 4,
    gridY: 0,
    seedAgentIds: ["mia"],
  },
  {
    id: "mkt-analytics",
    nome: "Analytics",
    descricao: "Analise de metricas, ROAS, CAC e performance de campanhas",
    domain: "marketing",
    emoji: "trending-up",
    gridX: 3,
    gridY: 1,
    seedAgentIds: [],
  },

  // ── Financeiro (blue cluster, top-right) ───────────
  {
    id: "fin-cobrancas",
    nome: "Cobrancas",
    descricao: "Gestao de cobrancas, inadimplencia e recuperacao de credito",
    domain: "financeiro",
    emoji: "credit-card",
    gridX: 6,
    gridY: 0,
    seedAgentIds: ["leo"],
  },
  {
    id: "fin-fluxo-caixa",
    nome: "Fluxo de Caixa",
    descricao: "Monitoramento de fluxo de caixa e projecoes financeiras",
    domain: "financeiro",
    emoji: "dollar-sign",
    gridX: 7,
    gridY: 0,
    seedAgentIds: ["leo"],
  },
  {
    id: "fin-conciliacao",
    nome: "Conciliacao",
    descricao: "Conciliacao bancaria automatizada e auditoria de transacoes",
    domain: "financeiro",
    emoji: "search",
    gridX: 6,
    gridY: 1,
    seedAgentIds: [],
  },
  {
    id: "fin-dre",
    nome: "DRE & Margem",
    descricao: "Demonstrativo de resultados, margens e alertas de rentabilidade",
    domain: "financeiro",
    emoji: "clipboard",
    gridX: 7,
    gridY: 1,
    seedAgentIds: [],
  },

  // ── Operacoes (amber cluster, bottom-left) ─────────
  {
    id: "ops-logistica",
    nome: "Logistica",
    descricao: "Rastreamento de entregas, otimizacao de rotas e fulfillment",
    domain: "operacoes",
    emoji: "truck",
    gridX: 0,
    gridY: 3,
    seedAgentIds: ["sol"],
  },
  {
    id: "ops-estoque",
    nome: "Estoque",
    descricao: "Controle de estoque, alertas de ruptura e reposicao",
    domain: "operacoes",
    emoji: "package",
    gridX: 1,
    gridY: 3,
    seedAgentIds: ["sol"],
  },
  {
    id: "ops-processos",
    nome: "Processos",
    descricao: "Automacao e otimizacao de processos operacionais",
    domain: "operacoes",
    emoji: "refresh",
    gridX: 0,
    gridY: 4,
    seedAgentIds: [],
  },

  // ── Atendimento (teal cluster, bottom-center) ──────
  {
    id: "atend-triagem",
    nome: "Triagem",
    descricao: "Classificacao e roteamento inteligente de tickets de suporte",
    domain: "atendimento",
    emoji: "tag",
    gridX: 3,
    gridY: 3,
    seedAgentIds: ["iris"],
  },
  {
    id: "atend-suporte-n1",
    nome: "Suporte N1",
    descricao: "Atendimento de primeiro nivel, FAQs e resolucoes rapidas",
    domain: "atendimento",
    emoji: "message-circle",
    gridX: 4,
    gridY: 3,
    seedAgentIds: ["iris"],
  },
  {
    id: "atend-suporte-n2",
    nome: "Suporte N2",
    descricao: "Suporte avancado para casos complexos e escalacoes",
    domain: "atendimento",
    emoji: "wrench",
    gridX: 3,
    gridY: 4,
    seedAgentIds: [],
  },

  // ── Tech/Integracoes (indigo, bottom-right) ────────
  {
    id: "tech-integracoes",
    nome: "Integracoes",
    descricao: "Gestao de APIs, webhooks e integracoes entre sistemas",
    domain: "operacoes",
    emoji: "link",
    gridX: 6,
    gridY: 3,
    seedAgentIds: [],
  },
  {
    id: "tech-monitoramento",
    nome: "Monitoramento",
    descricao: "Monitoramento de saude dos sistemas, uptime e alertas",
    domain: "operacoes",
    emoji: "radio",
    gridX: 7,
    gridY: 3,
    seedAgentIds: [],
  },
];

// ─── Workflow connections between rooms ───────────────────
export interface WorkflowLink {
  from: string;
  to: string;
  label?: string;
}

export const WORKFLOW_LINKS: WorkflowLink[] = [
  { from: "vendas-qualificacao", to: "vendas-pipeline", label: "Lead qualificado" },
  { from: "vendas-pipeline", to: "vendas-fechamento", label: "Negociacao" },
  { from: "vendas-fechamento", to: "vendas-pos-venda", label: "Venda fechada" },
  { from: "mkt-campanhas", to: "mkt-analytics", label: "Metricas" },
  { from: "mkt-conteudo", to: "mkt-campanhas", label: "Conteudo pronto" },
  { from: "fin-cobrancas", to: "fin-fluxo-caixa", label: "Pagamento" },
  { from: "fin-fluxo-caixa", to: "fin-conciliacao", label: "Conciliar" },
  { from: "atend-triagem", to: "atend-suporte-n1", label: "Ticket N1" },
  { from: "atend-suporte-n1", to: "atend-suporte-n2", label: "Escalar" },
  { from: "ops-logistica", to: "ops-estoque", label: "Atualizar estoque" },
];

// ─── Isometric tile constants ───────────────────────────
export const TILE_WIDTH = 140;
export const TILE_HEIGHT = 70;
export const ROOM_COLS = 20;
export const ROOM_ROWS = 14;

// ─── Furniture types ────────────────────────────────────
export type FurnitureType =
  | 'desk' | 'monitor' | 'whiteboard' | 'plant' | 'coffee' | 'bookshelf'
  | 'serverRack' | 'camera' | 'chartBoard' | 'rug' | 'lamp' | 'couch'
  | 'meetingTable' | 'waterCooler' | 'printer' | 'stickyWall' | 'cabinet' | 'projectorScreen';

export interface FurnitureItem {
  type: FurnitureType;
  x: number;
  y: number;
}

// Furniture templates per domain type
export const furnitureTemplates: Record<DepartmentId, FurnitureItem[]> = {
  vendas: [
    { type: 'rug', x: 6, y: 5 },
    { type: 'rug', x: 13, y: 9 },
    { type: 'chartBoard', x: 4, y: 2 },
    { type: 'projectorScreen', x: 10, y: 2 },
    { type: 'stickyWall', x: 16, y: 2 },
    { type: 'plant', x: 0, y: 2 },
    { type: 'desk', x: 1, y: 3 },
    { type: 'desk', x: 4, y: 3 },
    { type: 'monitor', x: 7, y: 3 },
    { type: 'monitor', x: 14, y: 3 },
    { type: 'meetingTable', x: 8, y: 6 },
    { type: 'whiteboard', x: 0, y: 6 },
    { type: 'couch', x: 15, y: 7 },
    { type: 'coffee', x: 19, y: 5 },
    { type: 'waterCooler', x: 19, y: 8 },
    { type: 'bookshelf', x: 0, y: 11 },
    { type: 'lamp', x: 6, y: 12 },
    { type: 'printer', x: 14, y: 12 },
    { type: 'cabinet', x: 19, y: 12 },
    { type: 'plant', x: 10, y: 13 },
  ],
  marketing: [
    { type: 'rug', x: 5, y: 4 },
    { type: 'rug', x: 12, y: 8 },
    { type: 'projectorScreen', x: 6, y: 2 },
    { type: 'stickyWall', x: 14, y: 2 },
    { type: 'camera', x: 0, y: 2 },
    { type: 'plant', x: 19, y: 2 },
    { type: 'desk', x: 1, y: 3 },
    { type: 'desk', x: 4, y: 3 },
    { type: 'monitor', x: 1, y: 5 },
    { type: 'meetingTable', x: 8, y: 5 },
    { type: 'whiteboard', x: 12, y: 3 },
    { type: 'couch', x: 15, y: 6 },
    { type: 'coffee', x: 19, y: 4 },
    { type: 'waterCooler', x: 19, y: 7 },
    { type: 'bookshelf', x: 0, y: 10 },
    { type: 'lamp', x: 5, y: 12 },
    { type: 'printer', x: 15, y: 12 },
    { type: 'cabinet', x: 19, y: 11 },
    { type: 'plant', x: 10, y: 13 },
  ],
  financeiro: [
    { type: 'rug', x: 5, y: 5 },
    { type: 'rug', x: 13, y: 9 },
    { type: 'chartBoard', x: 2, y: 2 },
    { type: 'chartBoard', x: 8, y: 2 },
    { type: 'projectorScreen', x: 13, y: 2 },
    { type: 'serverRack', x: 19, y: 2 },
    { type: 'plant', x: 0, y: 2 },
    { type: 'desk', x: 1, y: 4 },
    { type: 'desk', x: 5, y: 4 },
    { type: 'monitor', x: 9, y: 4 },
    { type: 'monitor', x: 14, y: 4 },
    { type: 'monitor', x: 17, y: 4 },
    { type: 'meetingTable', x: 7, y: 7 },
    { type: 'whiteboard', x: 0, y: 7 },
    { type: 'couch', x: 15, y: 8 },
    { type: 'coffee', x: 19, y: 5 },
    { type: 'waterCooler', x: 19, y: 8 },
    { type: 'bookshelf', x: 0, y: 11 },
    { type: 'lamp', x: 5, y: 12 },
    { type: 'printer', x: 14, y: 12 },
    { type: 'cabinet', x: 19, y: 12 },
    { type: 'plant', x: 10, y: 13 },
  ],
  operacoes: [
    { type: 'rug', x: 5, y: 5 },
    { type: 'rug', x: 13, y: 9 },
    { type: 'serverRack', x: 0, y: 2 },
    { type: 'projectorScreen', x: 5, y: 2 },
    { type: 'stickyWall', x: 13, y: 2 },
    { type: 'monitor', x: 19, y: 2 },
    { type: 'desk', x: 1, y: 4 },
    { type: 'desk', x: 5, y: 4 },
    { type: 'monitor', x: 9, y: 4 },
    { type: 'monitor', x: 14, y: 4 },
    { type: 'meetingTable', x: 7, y: 7 },
    { type: 'whiteboard', x: 0, y: 7 },
    { type: 'chartBoard', x: 16, y: 3 },
    { type: 'couch', x: 15, y: 8 },
    { type: 'coffee', x: 19, y: 5 },
    { type: 'waterCooler', x: 19, y: 8 },
    { type: 'bookshelf', x: 0, y: 11 },
    { type: 'lamp', x: 5, y: 12 },
    { type: 'printer', x: 14, y: 12 },
    { type: 'cabinet', x: 19, y: 12 },
    { type: 'plant', x: 0, y: 13 },
    { type: 'plant', x: 10, y: 13 },
  ],
  atendimento: [
    { type: 'rug', x: 5, y: 5 },
    { type: 'rug', x: 13, y: 8 },
    { type: 'stickyWall', x: 2, y: 2 },
    { type: 'projectorScreen', x: 9, y: 2 },
    { type: 'camera', x: 17, y: 2 },
    { type: 'plant', x: 0, y: 2 },
    { type: 'desk', x: 1, y: 4 },
    { type: 'desk', x: 5, y: 4 },
    { type: 'monitor', x: 9, y: 4 },
    { type: 'monitor', x: 14, y: 3 },
    { type: 'whiteboard', x: 0, y: 7 },
    { type: 'meetingTable', x: 7, y: 7 },
    { type: 'couch', x: 15, y: 7 },
    { type: 'couch', x: 0, y: 11 },
    { type: 'coffee', x: 19, y: 5 },
    { type: 'waterCooler', x: 19, y: 8 },
    { type: 'bookshelf', x: 19, y: 11 },
    { type: 'lamp', x: 6, y: 12 },
    { type: 'lamp', x: 14, y: 12 },
    { type: 'plant', x: 10, y: 13 },
    { type: 'plant', x: 19, y: 2 },
  ],
};

// ─── Domain zone backgrounds for world map ──────────────
export interface DomainZone {
  domain: DepartmentId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const DOMAIN_ZONES: DomainZone[] = [
  { domain: 'vendas', label: 'Vendas', x: -120, y: -20, w: 340, h: 200 },
  { domain: 'marketing', label: 'Marketing', x: 170, y: -20, w: 280, h: 200 },
  { domain: 'financeiro', label: 'Financeiro', x: 400, y: -20, w: 280, h: 200 },
  { domain: 'operacoes', label: 'Operacoes', x: -120, y: 200, w: 340, h: 200 },
  { domain: 'atendimento', label: 'Atendimento', x: 170, y: 200, w: 280, h: 200 },
];

// ─── Seed notifications ──────────────────────────────────
export interface WorldNotification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  agentId?: string;
  roomId?: string;
  timestamp: number;
}

export const SEED_NOTIFICATIONS: WorldNotification[] = [
  {
    id: "n1",
    type: "success",
    title: "Campanha otimizada",
    message: "Mia reduziu CPC em 18% na campanha Verao 2026",
    agentId: "mia",
    roomId: "mkt-campanhas",
    timestamp: Date.now() - 2700000,
  },
  {
    id: "n2",
    type: "warning",
    title: "Margem negativa detectada",
    message: "Leo identificou margem negativa no Honey Pingente",
    agentId: "leo",
    roomId: "fin-dre",
    timestamp: Date.now() - 7200000,
  },
  {
    id: "n3",
    type: "info",
    title: "Recompra enviada",
    message: "Rex enviou lembrete de recompra para 12 clientes B2B",
    agentId: "rex",
    roomId: "vendas-pos-venda",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "n4",
    type: "success",
    title: "Entrega concluida",
    message: "Sol confirmou entrega do lote #4872 em Campinas",
    agentId: "sol",
    roomId: "ops-logistica",
    timestamp: Date.now() - 1800000,
  },
  {
    id: "n5",
    type: "error",
    title: "SLA em risco",
    message: "Iris detectou 3 tickets N2 proximos ao SLA limite",
    agentId: "iris",
    roomId: "atend-suporte-n2",
    timestamp: Date.now() - 900000,
  },
];
