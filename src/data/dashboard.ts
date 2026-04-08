// src/data/dashboard.ts

export const EMPRESA = {
  nome: "Mr. Lion",
  segmento: "E-commerce de Bebidas",
  cnpj: "XX.XXX.XXX/0001-XX",
  fundacao: "2024",
};

import { DEMO_USER } from "@/lib/constants";

export const USUARIO = {
  nome: DEMO_USER.firstName,
  nomeCompleto: DEMO_USER.name,
  email: DEMO_USER.email,
  iniciais: DEMO_USER.initials,
};

// Real data from Casa Mr. Lion (2024-2026)
export const KPIS_VISAO_GERAL = [
  {
    departamento: "Financeiro",
    emoji: "dollar-sign",
    label: "Receita Total",
    valor: "R$ 2.756.310",
    variacao: "+161% YoY",
    direcao: "up" as const,
    periodo: "Acumulado 2024-2026",
  },
  {
    departamento: "Financeiro",
    emoji: "trending-up",
    label: "Receita 2025",
    valor: "R$ 1.839.359",
    variacao: "+161%",
    direcao: "up" as const,
    periodo: "2025 vs 2024",
  },
  {
    departamento: "Vendas",
    emoji: "shopping-cart",
    label: "Pedidos",
    valor: "10.337",
    variacao: "B2C 10.185 + B2B 152",
    direcao: "up" as const,
    periodo: "Total acumulado",
  },
  {
    departamento: "Operacoes",
    emoji: "target",
    label: "Ticket Medio",
    valor: "R$ 210,45",
    variacao: "",
    direcao: "neutral" as const,
    periodo: "Media geral",
  },
  {
    departamento: "Marketing",
    emoji: "users",
    label: "Clientes",
    valor: "8.809",
    variacao: "Repeat: 11,1% (976)",
    direcao: "up" as const,
    periodo: "Base total",
  },
];

// Greeting context — shown in the dashboard header
export const GREETING_CONTEXT = {
  receitaMensal: "R$ 54.412",
  pedidosMes: 247,
  agentesAtivos: 5,
};

// Connected data sources
export interface ConexaoAtiva {
  id: string;
  nome: string;
  icone: string;
  status: "conectado" | "desconectado" | "pendente";
  detalhe: string;
}

export const CONEXOES_ATIVAS: ConexaoAtiva[] = [
  { id: "woo", nome: "WooCommerce", icone: "shopping-bag", status: "conectado", detalhe: "10.337 pedidos" },
  { id: "meta", nome: "Meta Ads", icone: "megaphone", status: "conectado", detalhe: "R$ 42.550 spend" },
  { id: "ig", nome: "Instagram", icone: "camera", status: "conectado", detalhe: "86.423 followers" },
  { id: "ga", nome: "Google Analytics", icone: "bar-chart", status: "conectado", detalhe: "428.287 sessions" },
  { id: "bling", nome: "Bling ERP", icone: "package", status: "conectado", detalhe: "Sincronizado" },
];

// Agent activity summary for the dashboard header
export const AGENTES_RESUMO = [
  { nome: "Leo", area: "Vendas", cor: "rgba(255,255,255,0.15)" },
  { nome: "Mia", area: "Marketing", cor: "rgba(255,255,255,0.15)" },
  { nome: "Rex", area: "Financeiro", cor: "rgba(255,255,255,0.15)" },
  { nome: "Sol", area: "Suporte", cor: "rgba(255,255,255,0.15)" },
  { nome: "Iris", area: "Dados", cor: "rgba(255,255,255,0.15)" },
];

export const ALERTAS = [
  { id: "alerta-001", severidade: "critico" as const, departamento: "Operacoes", titulo: "Estoque Honey Garrafa abaixo de 50 unidades", tempo: "ha 3h", agente: "Sol", status: "novo" as const },
  { id: "alerta-002", severidade: "alto" as const, departamento: "Financeiro", titulo: "Prejuizo detectado em Fev/2026: R$ -2.329", tempo: "ha 1d", agente: "Leo", status: "novo" as const },
  { id: "alerta-003", severidade: "alto" as const, departamento: "Financeiro", titulo: "Chargebacks Fev/2026: R$ 4.300 (7,9% do faturamento)", tempo: "ha 1d", agente: "Leo", status: "novo" as const },
  { id: "alerta-004", severidade: "medio" as const, departamento: "Marketing", titulo: "CTR Meta Ads caiu de 4,59% para 1,64% (Set/25 → Mar/26)", tempo: "ha 6h", agente: "Mia", status: "visto" as const },
  { id: "alerta-005", severidade: "medio" as const, departamento: "Vendas", titulo: "Receita Mar/26 -38% vs Fev/26", tempo: "ha 12h", agente: "Rex", status: "novo" as const },
  { id: "alerta-006", severidade: "baixo" as const, departamento: "Marketing", titulo: "CPC Meta Ads subiu de R$ 0,15 para R$ 0,32", tempo: "ha 1d", agente: "Mia", status: "visto" as const },
  { id: "alerta-007", severidade: "info" as const, departamento: "Financeiro", titulo: "Relatorio semanal Semana 13 pronto para revisao", tempo: "ha 5h", agente: "Leo", status: "resolvido" as const },
];

export const ATIVIDADE_RECENTE = [
  { id: "ativ-001", agente: "Sol", acao: "Alerta de estoque critico: Honey Garrafa < 50 un.", tempo: "ha 3h" },
  { id: "ativ-002", agente: "Mia", acao: "Otimizou campanha Meta 'Verao 2026' — CPC -18%", tempo: "ha 45min" },
  { id: "ativ-003", agente: "Leo", acao: "Gerou relatorio semanal Semana 13/2026", tempo: "ha 5h" },
  { id: "ativ-004", agente: "Rex", acao: "Enviou lembrete de recompra para 12 clientes B2B", tempo: "ha 1h" },
  { id: "ativ-005", agente: "Iris", acao: "Respondeu 23 mensagens WhatsApp automaticamente", tempo: "ha 30min" },
  { id: "ativ-006", agente: "Leo", acao: "Detectou margem negativa no Honey Pingente", tempo: "ha 2h" },
  { id: "ativ-007", agente: "Mia", acao: "Publicou 3 posts Instagram (alcance 12.400)", tempo: "ha 8h" },
];
