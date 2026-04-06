// src/data/views.ts

export interface Visualizacao {
  id: string;
  nome: string;
  descricao: string;
  tipo: "tabela" | "kanban" | "grafico";
  criadaPor: string;
  criadaEm: string;
  colunas: string[];
}

export const VISUALIZACOES: Visualizacao[] = [
  {
    id: "vis-001",
    nome: "Tarefas por Agente",
    descricao: "Visao kanban de todas as tarefas agrupadas por agente responsavel",
    tipo: "kanban",
    criadaPor: "Luca",
    criadaEm: "15/03/2026",
    colunas: ["agente", "titulo", "status", "prioridade", "criadaEm"],
  },
  {
    id: "vis-002",
    nome: "Desempenho Financeiro Mensal",
    descricao: "Grafico de receita, CMV e margem bruta por mes (Abr/25 – Mar/26)",
    tipo: "grafico",
    criadaPor: "Leo",
    criadaEm: "01/04/2026",
    colunas: ["mes", "receita", "cmv", "margem", "pedidos"],
  },
  {
    id: "vis-003",
    nome: "Pipeline de Tarefas Pendentes",
    descricao: "Tabela com todas as tarefas em andamento e pendentes, ordenadas por prioridade",
    tipo: "tabela",
    criadaPor: "Luca",
    criadaEm: "20/03/2026",
    colunas: ["titulo", "agente", "departamento", "prioridade", "criadaEm", "status"],
  },
  {
    id: "vis-004",
    nome: "Performance de Campanhas Meta",
    descricao: "Evolucao mensal de CTR, CPC e investimento nas campanhas Meta Ads",
    tipo: "grafico",
    criadaPor: "Mia",
    criadaEm: "05/03/2026",
    colunas: ["mes", "spend", "impressoes", "clicks", "ctr", "cpc", "roas"],
  },
  {
    id: "vis-005",
    nome: "Alertas Criticos por Departamento",
    descricao: "Tabela filtrando apenas alertas de severidade critica e alta com agente responsavel",
    tipo: "tabela",
    criadaPor: "Luca",
    criadaEm: "10/03/2026",
    colunas: ["departamento", "titulo", "severidade", "agente", "tempo"],
  },
  {
    id: "vis-006",
    nome: "Ranking de Produtos por Receita",
    descricao: "Grafico de barras com top produtos por faturamento acumulado",
    tipo: "grafico",
    criadaPor: "Rex",
    criadaEm: "01/04/2026",
    colunas: ["nome", "receita", "percentual", "unidades"],
  },
];
