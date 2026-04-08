// src/data/agentes.ts

export interface Agente {
  id: string;
  nome: string;
  iniciais: string;
  departamento: string;
  departamentoEmoji: string;
  departamentoCor: string;
  status: "ativo" | "pausado" | "idle";
  descricao: string;
  ultimaAcao: string;
  ultimaAcaoTempo: string;
  tarefasConcluidas: number;
  tarefasFalhadas: number;
  taxaAprovacao: string;
}

/* ------------------------------------------------------------------ */
/* Extended agent info used by EquipeContent (team overview page)      */
/* ------------------------------------------------------------------ */

export interface AgentActivityEntry {
  action: string;
  tempo: string;
}

export interface AgentEquipeInfo {
  id: string;
  nome: string;
  iniciais: string;
  role: string;
  cor: string;
  status: "ativo" | "pausado";
  currentTask: string;
  tarefasConcluidas: number;
  tarefasFalhadas: number;
  taxaAprovacao: string;
  uptime: string;
  activityLog: AgentActivityEntry[];
}

export const AGENTES_EQUIPE: AgentEquipeInfo[] = [
  {
    id: "leo",
    nome: "Leo",
    iniciais: "LE",
    role: "Vendas",
    cor: "rgba(255,255,255,0.15)",
    status: "ativo",
    currentTask: "Monitorando pipeline de R$ 312K",
    tarefasConcluidas: 47,
    tarefasFalhadas: 2,
    taxaAprovacao: "96%",
    uptime: "99.8%",
    activityLog: [
      { action: "Qualificou 8 leads B2B automaticamente", tempo: "ha 12min" },
      { action: "Enviou follow-up para 5 prospects inativos", tempo: "ha 1h" },
      { action: "Atualizou forecast semanal no CRM", tempo: "ha 2h" },
    ],
  },
  {
    id: "mia",
    nome: "Mia",
    iniciais: "MI",
    role: "Marketing",
    cor: "rgba(255,255,255,0.15)",
    status: "ativo",
    currentTask: "Otimizando campanha Meta Ads",
    tarefasConcluidas: 83,
    tarefasFalhadas: 5,
    taxaAprovacao: "94%",
    uptime: "99.5%",
    activityLog: [
      { action: "Reduziu CPC da campanha Verao 2026 em 18%", tempo: "ha 45min" },
      { action: "Criou 3 variacoes de copy para A/B test", tempo: "ha 2h" },
      { action: "Gerou relatorio ROAS semanal", tempo: "ha 4h" },
    ],
  },
  {
    id: "rex",
    nome: "Rex",
    iniciais: "RE",
    role: "Financeiro",
    cor: "rgba(255,255,255,0.15)",
    status: "ativo",
    currentTask: "Analisando DRE Fevereiro",
    tarefasConcluidas: 61,
    tarefasFalhadas: 3,
    taxaAprovacao: "95%",
    uptime: "99.1%",
    activityLog: [
      { action: "Detectou margem negativa no Honey Pingente", tempo: "ha 1h" },
      { action: "Consolidou fluxo de caixa do mes", tempo: "ha 3h" },
      { action: "Alertou sobre 4 chargebacks pendentes", tempo: "ha 5h" },
    ],
  },
  {
    id: "sol",
    nome: "Sol",
    iniciais: "SO",
    role: "Suporte",
    cor: "rgba(255,255,255,0.15)",
    status: "ativo",
    currentTask: "Respondendo 3 tickets abertos",
    tarefasConcluidas: 52,
    tarefasFalhadas: 1,
    taxaAprovacao: "98%",
    uptime: "99.4%",
    activityLog: [
      { action: "Resolveu ticket #482 — troca de produto", tempo: "ha 30min" },
      { action: "Respondeu 23 mensagens WhatsApp", tempo: "ha 1h" },
      { action: "Escalou caso #475 para atendimento humano", tempo: "ha 3h" },
    ],
  },
  {
    id: "iris",
    nome: "Iris",
    iniciais: "IR",
    role: "Dados",
    cor: "rgba(255,255,255,0.15)",
    status: "ativo" as const,
    currentTask: "Processando 428K sessions analytics",
    tarefasConcluidas: 156,
    tarefasFalhadas: 8,
    taxaAprovacao: "95%",
    uptime: "98.9%",
    activityLog: [
      { action: "Gerou dashboard de cohort analysis", tempo: "ha 20min" },
      { action: "Cruzou dados GA4 + Meta Pixel", tempo: "ha 2h" },
      { action: "Detectou anomalia no bounce rate", tempo: "ha 4h" },
    ],
  },
];

export const DEPARTAMENTOS = [
  { id: "financeiro", nome: "Financeiro", emoji: "dollar-sign", cor: "rgba(255,255,255,0.15)" },
  { id: "marketing", nome: "Marketing", emoji: "megaphone", cor: "rgba(255,255,255,0.15)" },
  { id: "vendas", nome: "Vendas", emoji: "shopping-cart", cor: "rgba(255,255,255,0.15)" },
  { id: "operacoes", nome: "Operacoes", emoji: "settings", cor: "rgba(255,255,255,0.15)" },
  { id: "atendimento", nome: "Atendimento", emoji: "message-circle", cor: "rgba(255,255,255,0.15)" },
];

export const AGENTES: Agente[] = [
  {
    id: "leo",
    nome: "Leo",
    iniciais: "LE",
    departamento: "vendas",
    departamentoEmoji: "shopping-cart",
    departamentoCor: "rgba(255,255,255,0.15)",
    status: "ativo",
    descricao: "Pipeline de vendas B2B/B2C, reorder alerts, forecast semanal",
    ultimaAcao: "Qualificou 8 leads B2B automaticamente",
    ultimaAcaoTempo: "ha 12min",
    tarefasConcluidas: 47,
    tarefasFalhadas: 2,
    taxaAprovacao: "96%",
  },
  {
    id: "mia",
    nome: "Mia",
    iniciais: "MI",
    departamento: "marketing",
    departamentoEmoji: "megaphone",
    departamentoCor: "rgba(255,255,255,0.15)",
    status: "ativo",
    descricao: "Gerencia campanhas Meta Ads, conteudo Instagram, ROAS",
    ultimaAcao: "Otimizou campanha 'Verao 2026' — CPC reduzido 18%",
    ultimaAcaoTempo: "ha 45min",
    tarefasConcluidas: 83,
    tarefasFalhadas: 5,
    taxaAprovacao: "94%",
  },
  {
    id: "rex",
    nome: "Rex",
    iniciais: "RE",
    departamento: "financeiro",
    departamentoEmoji: "dollar-sign",
    departamentoCor: "rgba(255,255,255,0.15)",
    status: "ativo",
    descricao: "Monitora DRE, alertas de margem, fluxo de caixa e chargebacks",
    ultimaAcao: "Detectou margem negativa no Honey Pingente",
    ultimaAcaoTempo: "ha 2h",
    tarefasConcluidas: 61,
    tarefasFalhadas: 3,
    taxaAprovacao: "95%",
  },
  {
    id: "sol",
    nome: "Sol",
    iniciais: "SO",
    departamento: "operacoes",
    departamentoEmoji: "settings",
    departamentoCor: "rgba(255,255,255,0.15)",
    status: "ativo",
    descricao: "Logistica, controle de estoque, entregas, reenvios",
    ultimaAcao: "Alerta: estoque Honey Garrafa abaixo de 50 un.",
    ultimaAcaoTempo: "ha 3h",
    tarefasConcluidas: 52,
    tarefasFalhadas: 1,
    taxaAprovacao: "98%",
  },
  {
    id: "iris",
    nome: "Iris",
    iniciais: "IR",
    departamento: "dados",
    departamentoEmoji: "bar-chart",
    departamentoCor: "rgba(255,255,255,0.15)",
    status: "ativo",
    descricao: "Analytics, cohort analysis, cruzamento GA4 + Meta, deteccao de anomalias",
    ultimaAcao: "Respondeu 23 mensagens WhatsApp automaticamente",
    ultimaAcaoTempo: "ha 30min",
    tarefasConcluidas: 156,
    tarefasFalhadas: 8,
    taxaAprovacao: "95%",
  },
];
