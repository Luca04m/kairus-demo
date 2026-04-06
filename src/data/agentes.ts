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

export const DEPARTAMENTOS = [
  { id: "financeiro", nome: "Financeiro", emoji: "💰", cor: "#22c55e" },
  { id: "marketing", nome: "Marketing", emoji: "📢", cor: "#6366f1" },
  { id: "vendas", nome: "Vendas", emoji: "🛒", cor: "#ec4899" },
  { id: "operacoes", nome: "Operacoes", emoji: "⚙️", cor: "#f59e0b" },
  { id: "atendimento", nome: "Atendimento", emoji: "💬", cor: "#06b6d4" },
];

export const AGENTES: Agente[] = [
  {
    id: "leo",
    nome: "Leo",
    iniciais: "LE",
    departamento: "financeiro",
    departamentoEmoji: "💰",
    departamentoCor: "#22c55e",
    status: "ativo",
    descricao: "Monitora DRE, alertas de margem, fluxo de caixa e chargebacks",
    ultimaAcao: "Detectou margem negativa no Honey Pingente",
    ultimaAcaoTempo: "ha 2h",
    tarefasConcluidas: 47,
    tarefasFalhadas: 2,
    taxaAprovacao: "96%",
  },
  {
    id: "mia",
    nome: "Mia",
    iniciais: "MI",
    departamento: "marketing",
    departamentoEmoji: "📢",
    departamentoCor: "#6366f1",
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
    departamento: "vendas",
    departamentoEmoji: "🛒",
    departamentoCor: "#ec4899",
    status: "ativo",
    descricao: "Acompanha vendas B2B, reorder alerts, ticket medio",
    ultimaAcao: "Enviou lembrete de recompra para 12 clientes B2B",
    ultimaAcaoTempo: "ha 1h",
    tarefasConcluidas: 61,
    tarefasFalhadas: 3,
    taxaAprovacao: "95%",
  },
  {
    id: "sol",
    nome: "Sol",
    iniciais: "SO",
    departamento: "operacoes",
    departamentoEmoji: "⚙️",
    departamentoCor: "#f59e0b",
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
    departamento: "atendimento",
    departamentoEmoji: "💬",
    departamentoCor: "#06b6d4",
    status: "pausado",
    descricao: "WhatsApp automatico, pos-venda, trocas e devolucoes",
    ultimaAcao: "Respondeu 23 mensagens WhatsApp automaticamente",
    ultimaAcaoTempo: "ha 30min",
    tarefasConcluidas: 156,
    tarefasFalhadas: 8,
    taxaAprovacao: "95%",
  },
];
