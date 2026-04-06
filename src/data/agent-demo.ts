// src/data/agent-demo.ts

export interface AgentTaskDemo {
  id: string;
  titulo: string;
  status: "concluida" | "em_progresso" | "pendente" | "falha";
  tempo: string;
  resultado?: string;
  tipo: "analise" | "automacao" | "monitoramento";
}

export const AGENT_TASKS_DEMO: AgentTaskDemo[] = [
  {
    id: "demo-001",
    titulo: "Analise de margem — Honey Pingente",
    status: "concluida",
    tempo: "2m 14s",
    resultado: "Margem negativa identificada: -R$ 0,10/unidade. Recomendacao de ajuste de preco gerada.",
    tipo: "analise",
  },
  {
    id: "demo-002",
    titulo: "Monitoramento de estoque em tempo real",
    status: "em_progresso",
    tempo: "continuo",
    tipo: "monitoramento",
  },
  {
    id: "demo-003",
    titulo: "Envio automatico de lembretes B2B",
    status: "concluida",
    tempo: "4m 37s",
    resultado: "12 mensagens enviadas via WhatsApp. Taxa de abertura estimada: 78%.",
    tipo: "automacao",
  },
  {
    id: "demo-004",
    titulo: "Geracao de relatorio semanal — Semana 13",
    status: "concluida",
    tempo: "1m 52s",
    resultado: "Relatorio PDF gerado com 4 paginas. Enviado para carlos@mrlion.com.br.",
    tipo: "analise",
  },
  {
    id: "demo-005",
    titulo: "Otimizacao de lances Meta Ads",
    status: "concluida",
    tempo: "3m 08s",
    resultado: "CPC reduzido de R$ 0,38 para R$ 0,32 na campanha 'Verao 2026'. Economia estimada: R$ 240/semana.",
    tipo: "automacao",
  },
  {
    id: "demo-006",
    titulo: "Integracao Google Ads — importacao historico",
    status: "falha",
    tempo: "0m 43s",
    resultado: "Erro de autenticacao: token OAuth expirado. Acao necessaria: renovar credenciais no painel Google.",
    tipo: "automacao",
  },
  {
    id: "demo-007",
    titulo: "Analise de churn risk — clientes B2B",
    status: "concluida",
    tempo: "5m 21s",
    resultado: "8 clientes B2B identificados com risco alto de churn (inatividade > 45 dias). Lista gerada para Rex.",
    tipo: "analise",
  },
  {
    id: "demo-008",
    titulo: "Verificacao de divergencias de estoque",
    status: "concluida",
    tempo: "1m 19s",
    resultado: "2 divergencias encontradas: Capuccino Garrafa (+3 un) e Black Honey (-1 un). Ajuste registrado.",
    tipo: "monitoramento",
  },
  {
    id: "demo-009",
    titulo: "Classificacao de mensagens WhatsApp",
    status: "em_progresso",
    tempo: "continuo",
    tipo: "automacao",
  },
];

export interface TarefasDia {
  dia: string;
  concluidas: number;
  falhadas: number;
}

export interface AgentAnalyticsDemo {
  tarefasConcluidas: number;
  tarefasFalhadas: number;
  taxaAprovacao: number;
  duracaoMedia: string;
  duracaoTotal: string;
  feedbackPositivo: number;
  feedbackNegativo: number;
  tarefasPorDia: TarefasDia[];
}

export const AGENT_ANALYTICS_DEMO: AgentAnalyticsDemo = {
  tarefasConcluidas: 47,
  tarefasFalhadas: 2,
  taxaAprovacao: 96,
  duracaoMedia: "12m",
  duracaoTotal: "9h 24m",
  feedbackPositivo: 43,
  feedbackNegativo: 4,
  tarefasPorDia: [
    { dia: "02/03", concluidas: 1, falhadas: 0 },
    { dia: "03/03", concluidas: 2, falhadas: 0 },
    { dia: "04/03", concluidas: 1, falhadas: 0 },
    { dia: "05/03", concluidas: 2, falhadas: 1 },
    { dia: "06/03", concluidas: 3, falhadas: 0 },
    { dia: "07/03", concluidas: 0, falhadas: 0 },
    { dia: "08/03", concluidas: 0, falhadas: 0 },
    { dia: "09/03", concluidas: 2, falhadas: 0 },
    { dia: "10/03", concluidas: 1, falhadas: 0 },
    { dia: "11/03", concluidas: 3, falhadas: 0 },
    { dia: "12/03", concluidas: 2, falhadas: 0 },
    { dia: "13/03", concluidas: 1, falhadas: 0 },
    { dia: "14/03", concluidas: 0, falhadas: 0 },
    { dia: "15/03", concluidas: 0, falhadas: 0 },
    { dia: "16/03", concluidas: 2, falhadas: 0 },
    { dia: "17/03", concluidas: 1, falhadas: 1 },
    { dia: "18/03", concluidas: 3, falhadas: 0 },
    { dia: "19/03", concluidas: 2, falhadas: 0 },
    { dia: "20/03", concluidas: 1, falhadas: 0 },
    { dia: "21/03", concluidas: 0, falhadas: 0 },
    { dia: "22/03", concluidas: 0, falhadas: 0 },
    { dia: "23/03", concluidas: 2, falhadas: 0 },
    { dia: "24/03", concluidas: 3, falhadas: 0 },
    { dia: "25/03", concluidas: 2, falhadas: 0 },
    { dia: "26/03", concluidas: 1, falhadas: 0 },
    { dia: "27/03", concluidas: 2, falhadas: 0 },
    { dia: "28/03", concluidas: 0, falhadas: 0 },
    { dia: "29/03", concluidas: 0, falhadas: 0 },
    { dia: "30/03", concluidas: 3, falhadas: 0 },
    { dia: "31/03", concluidas: 2, falhadas: 0 },
  ],
};
