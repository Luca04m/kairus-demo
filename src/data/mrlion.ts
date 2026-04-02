// src/data/mrlion.ts

// =============================================
// EMPRESA
// =============================================
export const EMPRESA = {
  nome: "Mr. Lion",
  segmento: "E-commerce de Bebidas",
  cnpj: "XX.XXX.XXX/0001-XX",
  fundacao: "2024",
};

export const USUARIO = {
  nome: "Luca",
  nomeCompleto: "Luca Moreno",
  email: "luca@mrlion.com.br",
  iniciais: "LM",
};

// =============================================
// DEPARTAMENTOS E AGENTES
// =============================================
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

// =============================================
// KPIs VISAO GERAL (T1)
// =============================================
export const KPIS_VISAO_GERAL = [
  {
    departamento: "Financeiro",
    emoji: "💰",
    label: "Receita Mensal",
    valor: "R$ 33.755",
    variacao: "-38%",
    direcao: "down" as const,
    periodo: "Mar/2026 vs Fev/2026",
  },
  {
    departamento: "Marketing",
    emoji: "📢",
    label: "ROAS Geral",
    valor: "1,1x",
    variacao: "-89%",
    direcao: "down" as const,
    periodo: "Acumulado Set/25-Mar/26",
  },
  {
    departamento: "Vendas",
    emoji: "🛒",
    label: "Pedidos",
    valor: "155",
    variacao: "-33%",
    direcao: "down" as const,
    periodo: "Mar/2026 vs Fev/2026",
  },
  {
    departamento: "Operacoes",
    emoji: "⚙️",
    label: "Ticket Medio",
    valor: "R$ 217,78",
    variacao: "-7,5%",
    direcao: "down" as const,
    periodo: "Mar/2026 vs Fev/2026",
  },
  {
    departamento: "Atendimento",
    emoji: "💬",
    label: "Agentes Ativos",
    valor: "4/5",
    variacao: "",
    direcao: "neutral" as const,
    periodo: "",
  },
];

// =============================================
// FINANCEIRO (T4)
// =============================================
export const FINANCEIRO_KPIS = [
  { label: "Receita Bruta", valor: "R$ 33.755", sub: "Mar/2026", icon: "DollarSign" },
  { label: "Ticket Medio", valor: "R$ 217,78", sub: "155 pedidos", icon: "ShoppingCart" },
  { label: "Margem Bruta", valor: "~50%", sub: "Estimativa Mar/2026", icon: "TrendingUp" },
  { label: "CMV", valor: "~R$ 16.800", sub: "Estimativa Mar/2026", icon: "Package" },
  { label: "Frete Total", valor: "R$ 6.103", sub: "Mar/2026", icon: "Truck" },
];

export const VENDAS_MENSAIS = [
  { mes: "Abr/25", receita: 59680, pedidos: 257 },
  { mes: "Mai/25", receita: 78440, pedidos: 315 },
  { mes: "Jun/25", receita: 149426, pedidos: 770 },
  { mes: "Jul/25", receita: 91620, pedidos: 386 },
  { mes: "Ago/25", receita: 93360, pedidos: 418 },
  { mes: "Set/25", receita: 57254, pedidos: 219 },
  { mes: "Out/25", receita: 56566, pedidos: 218 },
  { mes: "Nov/25", receita: 491372, pedidos: 2588 },
  { mes: "Dez/25", receita: 199412, pedidos: 963 },
  { mes: "Jan/26", receita: 67068, pedidos: 324 },
  { mes: "Fev/26", receita: 54412, pedidos: 231 },
  { mes: "Mar/26", receita: 33756, pedidos: 155 },
];

export const TOP_PRODUTOS = [
  { nome: "Mr. Lion Honey Garrafa", receita: "R$ 453.684", percentual: "21,6%", unidades: 6052 },
  { nome: "Mr. Lion Honey Completo", receita: "R$ 448.159", percentual: "21,3%", unidades: 3367 },
  { nome: "Mr. Lion Capuccino Garrafa", receita: "R$ 398.201", percentual: "18,9%", unidades: 2566 },
  { nome: "Mr. Lion Honey", receita: "R$ 223.566", percentual: "10,6%", unidades: 2117 },
  { nome: "Mr. Lion Honey Pingente", receita: "R$ 121.585", percentual: "5,8%", unidades: 834 },
  { nome: "Mr. Lion Capuccino Completo", receita: "R$ 94.668", percentual: "4,5%", unidades: 836 },
  { nome: "Mr. Lion Black Honey", receita: "R$ 89.628", percentual: "4,3%", unidades: 503 },
  { nome: "Blended Mr. Lion Completo", receita: "R$ 72.976", percentual: "3,5%", unidades: 630 },
];

// =============================================
// MARKETING (T5)
// =============================================
export const MARKETING_KPIS = [
  { label: "Investimento Meta", valor: "R$ 5.377", sub: "Mar/2026", icon: "Banknote" },
  { label: "ROAS", valor: "—", sub: "Sem dados purchase Mar/26", icon: "TrendingUp" },
  { label: "Sessoes", valor: "18.661", sub: "Mar/2026", icon: "Eye" },
  { label: "CPC Medio", valor: "R$ 0,32", sub: "Mar/2026", icon: "MousePointer" },
  { label: "CTR", valor: "1,64%", sub: "Mar/2026", icon: "Target" },
];

export const CAMPANHAS_META = [
  { mes: "Set/25", spend: "R$ 4.395", impressoes: "645.838", clicks: "29.621", ctr: "4,59%", cpc: "R$ 0,15", roas: "10,3x" },
  { mes: "Nov/25", spend: "R$ 10.799", impressoes: "2.072.041", clicks: "90.072", ctr: "4,35%", cpc: "R$ 0,12", roas: "—" },
  { mes: "Dez/25", spend: "R$ 8.708", impressoes: "1.827.700", clicks: "62.207", ctr: "3,40%", cpc: "R$ 0,14", roas: "—" },
  { mes: "Jan/26", spend: "R$ 5.051", impressoes: "1.437.399", clicks: "46.155", ctr: "3,21%", cpc: "R$ 0,11", roas: "—" },
  { mes: "Fev/26", spend: "R$ 8.216", impressoes: "1.814.193", clicks: "33.044", ctr: "1,82%", cpc: "R$ 0,25", roas: "—" },
  { mes: "Mar/26", spend: "R$ 5.377", impressoes: "1.010.466", clicks: "16.610", ctr: "1,64%", cpc: "R$ 0,32", roas: "—" },
];

export const TRAFEGO_MENSAL = [
  { mes: "Ago/25", sessoes: 17925, views: 26718 },
  { mes: "Set/25", sessoes: 33352, views: 52593 },
  { mes: "Out/25", sessoes: 69887, views: 103461 },
  { mes: "Nov/25", sessoes: 126674, views: 199356 },
  { mes: "Dez/25", sessoes: 83080, views: 130587 },
  { mes: "Jan/26", sessoes: 51249, views: 69002 },
  { mes: "Fev/26", sessoes: 27459, views: 42508 },
  { mes: "Mar/26", sessoes: 18661, views: 28249 },
];

// =============================================
// ROI / IMPACTO (T8)
// =============================================
export const ROI_DADOS = {
  investimentoSetup: 12000,
  mensalidade: 7500,
  mesesContratado: 6,
  investimentoTotal: 57000,
  valorGerado: 142000,
  roiPercentual: "149%",
  breakEvenMes: 3,
};

export const ROI_TIMELINE = [
  { mes: "Out/25", investimento: 19500, valor: 8000, label: "Setup + 1o mes" },
  { mes: "Nov/25", investimento: 27000, valor: 32000, label: "Black Friday otimizada" },
  { mes: "Dez/25", investimento: 34500, valor: 58000, label: "Natal + automacoes" },
  { mes: "Jan/26", investimento: 42000, valor: 82000, label: "Break-even atingido" },
  { mes: "Fev/26", investimento: 49500, valor: 112000, label: "ROI 126%" },
  { mes: "Mar/26", investimento: 57000, valor: 142000, label: "ROI 149%" },
];

export const ROI_CATEGORIAS = [
  { categoria: "Otimizacao de campanhas", valor: "R$ 45.000", verificado: true },
  { categoria: "Reducao de chargebacks", valor: "R$ 18.000", verificado: true },
  { categoria: "Automacao operacional", valor: "R$ 32.000", verificado: false },
  { categoria: "Recompra B2B automatizada", valor: "R$ 27.000", verificado: false },
  { categoria: "Economia tempo gestao", valor: "R$ 20.000", verificado: false },
];

// =============================================
// RELATORIOS (T6)
// =============================================
export const RELATORIOS = [
  {
    id: "rel-001",
    tipo: "Semanal",
    titulo: "Relatorio Semanal — Semana 13/2026",
    periodo: "24/03 a 30/03/2026",
    agente: "Leo",
    criadoEm: "31/03/2026",
    resumo: "Receita semanal R$ 8.200 (-12% vs semana anterior). Ticket medio R$ 218. Estoque Honey Garrafa critico (< 50 un). 2 chargebacks resolvidos.",
    status: "pronto" as const,
  },
  {
    id: "rel-002",
    tipo: "Mensal",
    titulo: "Relatorio Mensal — Fevereiro 2026",
    periodo: "01/02 a 28/02/2026",
    agente: "Leo",
    criadoEm: "01/03/2026",
    resumo: "Receita R$ 54.412 (231 pedidos). PREJUIZO de R$ -2.329. CMV 45,3%. Marketing R$ 12.000 (Meta+Google). Chargebacks R$ 6.132 (7,9% — CRITICO).",
    status: "pronto" as const,
  },
  {
    id: "rel-003",
    tipo: "Mensal",
    titulo: "Relatorio Mensal — Janeiro 2026",
    periodo: "01/01 a 31/01/2026",
    agente: "Leo",
    criadoEm: "01/02/2026",
    resumo: "Receita R$ 67.067 (324 pedidos). Lucro R$ 1.130. CMV 53,4%. Marketing R$ 16.708. Margem bruta 46,6%.",
    status: "pronto" as const,
  },
  {
    id: "rel-004",
    tipo: "Semanal",
    titulo: "Relatorio Marketing — Semana 13/2026",
    periodo: "24/03 a 30/03/2026",
    agente: "Mia",
    criadoEm: "31/03/2026",
    resumo: "Meta Ads: R$ 1.200 investidos, CTR 1,64%, CPC R$ 0,32. Instagram: 3 posts publicados, alcance 12.400. Sessoes site: 4.800.",
    status: "pronto" as const,
  },
];

// =============================================
// ALERTAS
// =============================================
export const ALERTAS = [
  { id: "alerta-001", severidade: "critico" as const, departamento: "Operacoes", titulo: "Estoque Honey Garrafa abaixo de 50 unidades", tempo: "ha 3h", agente: "Sol", status: "novo" as const },
  { id: "alerta-002", severidade: "alto" as const, departamento: "Financeiro", titulo: "Prejuizo detectado em Fev/2026: R$ -2.329", tempo: "ha 1d", agente: "Leo", status: "novo" as const },
  { id: "alerta-003", severidade: "alto" as const, departamento: "Financeiro", titulo: "Chargebacks Fev/2026: R$ 6.132 (7,9% do faturamento)", tempo: "ha 1d", agente: "Leo", status: "novo" as const },
  { id: "alerta-004", severidade: "medio" as const, departamento: "Marketing", titulo: "CTR Meta Ads caiu de 4,59% para 1,64% (Set/25 → Mar/26)", tempo: "ha 6h", agente: "Mia", status: "visto" as const },
  { id: "alerta-005", severidade: "medio" as const, departamento: "Vendas", titulo: "Receita Mar/26 -38% vs Fev/26", tempo: "ha 12h", agente: "Rex", status: "novo" as const },
  { id: "alerta-006", severidade: "baixo" as const, departamento: "Marketing", titulo: "CPC Meta Ads subiu de R$ 0,15 para R$ 0,32", tempo: "ha 1d", agente: "Mia", status: "visto" as const },
  { id: "alerta-007", severidade: "info" as const, departamento: "Financeiro", titulo: "Relatorio semanal Semana 13 pronto para revisao", tempo: "ha 5h", agente: "Leo", status: "resolvido" as const },
];

// =============================================
// ATIVIDADE RECENTE
// =============================================
export const ATIVIDADE_RECENTE = [
  { id: "ativ-001", agente: "Sol", acao: "Alerta de estoque critico: Honey Garrafa < 50 un.", tempo: "ha 3h" },
  { id: "ativ-002", agente: "Mia", acao: "Otimizou campanha Meta 'Verao 2026' — CPC -18%", tempo: "ha 45min" },
  { id: "ativ-003", agente: "Leo", acao: "Gerou relatorio semanal Semana 13/2026", tempo: "ha 5h" },
  { id: "ativ-004", agente: "Rex", acao: "Enviou lembrete de recompra para 12 clientes B2B", tempo: "ha 1h" },
  { id: "ativ-005", agente: "Iris", acao: "Respondeu 23 mensagens WhatsApp automaticamente", tempo: "ha 30min" },
  { id: "ativ-006", agente: "Leo", acao: "Detectou margem negativa no Honey Pingente", tempo: "ha 2h" },
  { id: "ativ-007", agente: "Mia", acao: "Publicou 3 posts Instagram (alcance 12.400)", tempo: "ha 8h" },
];

// =============================================
// INBOX MENSAGENS
// =============================================
export interface InboxMensagem {
  id: string;
  remetente: string;
  assunto: string;
  resumo: string;
  timestamp: string;
  lida: boolean;
  prioridade: "alta" | "media" | "baixa";
  tipo: "alerta" | "relatorio" | "sugestao" | "tarefa";
}

export const INBOX_MENSAGENS: InboxMensagem[] = [
  {
    id: "inbox-msg-001",
    remetente: "Sol",
    assunto: "CRITICO: Estoque Honey Garrafa abaixo do limite",
    resumo: "Restam apenas 47 unidades do Mr. Lion Honey Garrafa 375ml. Com a taxa de venda atual, o produto esgota em 3 dias. Recomendo emitir pedido de reposicao imediatamente.",
    timestamp: "ha 3h",
    lida: false,
    prioridade: "alta",
    tipo: "alerta",
  },
  {
    id: "inbox-msg-002",
    remetente: "Leo",
    assunto: "Relatorio Semanal — Semana 13/2026 disponivel",
    resumo: "O relatorio da semana 13 foi gerado. Receita R$ 8.200 (-12% vs semana anterior). Destaque negativo: 2 chargebacks abertos no valor total de R$ 1.340. Revisao necessaria.",
    timestamp: "ha 5h",
    lida: false,
    prioridade: "media",
    tipo: "relatorio",
  },
  {
    id: "inbox-msg-003",
    remetente: "Mia",
    assunto: "Sugestao: Aumentar budget campanha 'Honey Premium'",
    resumo: "A campanha 'Honey Premium' esta com ROAS 3,2x nas ultimas 48h, acima da media. Sugiro aumentar o orcamento diario de R$ 180 para R$ 320 para capturar mais trafego qualificado.",
    timestamp: "ha 45min",
    lida: false,
    prioridade: "media",
    tipo: "sugestao",
  },
  {
    id: "inbox-msg-004",
    remetente: "Rex",
    assunto: "12 clientes B2B com lembrete de recompra enviado",
    resumo: "Disparei lembretes de recompra para 12 clientes B2B com ultima compra ha mais de 30 dias. Media historica de resposta: 4 clientes convertem em 72h. Valor estimado: R$ 6.800.",
    timestamp: "ha 1h",
    lida: true,
    prioridade: "media",
    tipo: "tarefa",
  },
  {
    id: "inbox-msg-005",
    remetente: "Iris",
    assunto: "Pico de mensagens WhatsApp — 23 respondidas automaticamente",
    resumo: "Entre 09h e 11h recebi 23 mensagens. Resolvi 20 automaticamente (rastreamento, duvidas de produto, trocas). 3 foram escaladas para atendimento humano (reclamacoes com nota < 3).",
    timestamp: "ha 30min",
    lida: true,
    prioridade: "baixa",
    tipo: "relatorio",
  },
  {
    id: "inbox-msg-006",
    remetente: "Leo",
    assunto: "Alerta: Margem bruta do Honey Pingente negativa",
    resumo: "Com o preco atual de R$ 89,90 e CMV de R$ 52,00 mais frete medio R$ 38,00, o produto esta gerando prejuizo de R$ 0,10 por unidade vendida. Sugiro revisao de precificacao.",
    timestamp: "ha 2h",
    lida: false,
    prioridade: "alta",
    tipo: "alerta",
  },
  {
    id: "inbox-msg-007",
    remetente: "Sol",
    assunto: "Tarefa concluida: Auditoria de estoque Marzo/2026",
    resumo: "Auditoria mensal de estoque concluida. Total de SKUs ativos: 12. 3 produtos com giro lento (> 45 dias sem venda). Relatorio completo disponivel na aba Relatorios.",
    timestamp: "ha 1d",
    lida: true,
    prioridade: "baixa",
    tipo: "tarefa",
  },
  {
    id: "inbox-msg-008",
    remetente: "Mia",
    assunto: "CTR Meta Ads caiu 64% — analise disponivel",
    resumo: "O CTR medio das campanhas caiu de 4,59% (Set/25) para 1,64% (Mar/26). Preparei analise com 3 hipoteses: saturacao de audiencia, criativos desatualizados e mudancas no algoritmo Meta.",
    timestamp: "ha 6h",
    lida: false,
    prioridade: "alta",
    tipo: "sugestao",
  },
  {
    id: "inbox-msg-009",
    remetente: "Rex",
    assunto: "Ticket medio caindo — recomendo bundle promocional",
    resumo: "Ticket medio caiu de R$ 235 (Fev/26) para R$ 217 (Mar/26). Sugiro criar bundle 'Kit Honey Completo' com desconto de 8% para estimular aumento de itens por pedido.",
    timestamp: "ha 8h",
    lida: true,
    prioridade: "media",
    tipo: "sugestao",
  },
  {
    id: "inbox-msg-010",
    remetente: "Leo",
    assunto: "Chargeback critico: R$ 6.132 em Fevereiro (7,9%)",
    resumo: "Taxa de chargeback de 7,9% em Fev/26 esta 4x acima do limite aceitavel (2%). Identifiquei 18 transacoes suspeitas com mesmo padrao de CEP. Recomendo revisao manual urgente.",
    timestamp: "ha 1d",
    lida: false,
    prioridade: "alta",
    tipo: "alerta",
  },
];

// =============================================
// TAREFAS
// =============================================
export interface Tarefa {
  id: string;
  titulo: string;
  agente: string;
  status: "concluida" | "em_progresso" | "pendente" | "falha";
  prioridade: "alta" | "media" | "baixa";
  criadaEm: string;
  concluidaEm?: string;
  descricao: string;
  departamento: string;
}

export const TAREFAS: Tarefa[] = [
  {
    id: "tar-001",
    titulo: "Analise de margem por SKU — Marco 2026",
    agente: "Leo",
    status: "concluida",
    prioridade: "alta",
    criadaEm: "01/04/2026",
    concluidaEm: "01/04/2026",
    descricao: "Calcular margem liquida de cada SKU ativo, incluindo CMV, frete e comissoes de marketplace.",
    departamento: "Financeiro",
  },
  {
    id: "tar-002",
    titulo: "Monitoramento de estoque em tempo real",
    agente: "Sol",
    status: "em_progresso",
    prioridade: "alta",
    criadaEm: "01/04/2026",
    descricao: "Acompanhar niveis de estoque de todos os SKUs e disparar alertas quando atingir ponto de reposicao.",
    departamento: "Operacoes",
  },
  {
    id: "tar-003",
    titulo: "Otimizacao de campanhas Meta Ads — Abril 2026",
    agente: "Mia",
    status: "em_progresso",
    prioridade: "alta",
    criadaEm: "01/04/2026",
    descricao: "Revisar criativos, segmentacao e lances das campanhas ativas no Meta Ads para melhorar CTR e ROAS.",
    departamento: "Marketing",
  },
  {
    id: "tar-004",
    titulo: "Envio de lembretes de recompra B2B — Lote 04/2026",
    agente: "Rex",
    status: "concluida",
    prioridade: "media",
    criadaEm: "02/04/2026",
    concluidaEm: "02/04/2026",
    descricao: "Identificar clientes B2B com ultima compra ha mais de 30 dias e enviar mensagem personalizada de recompra.",
    departamento: "Vendas",
  },
  {
    id: "tar-005",
    titulo: "Geracao do relatorio semanal — Semana 13/2026",
    agente: "Leo",
    status: "concluida",
    prioridade: "media",
    criadaEm: "31/03/2026",
    concluidaEm: "31/03/2026",
    descricao: "Compilar dados de vendas, financeiro e operacoes da semana 13 e gerar relatorio consolidado para Luca.",
    departamento: "Financeiro",
  },
  {
    id: "tar-006",
    titulo: "Atendimento automatico WhatsApp — turno manha",
    agente: "Iris",
    status: "concluida",
    prioridade: "media",
    criadaEm: "02/04/2026",
    concluidaEm: "02/04/2026",
    descricao: "Processar e responder mensagens WhatsApp recebidas entre 08h e 12h, escalando casos criticos.",
    departamento: "Atendimento",
  },
  {
    id: "tar-007",
    titulo: "Auditoria de chargebacks — Fevereiro 2026",
    agente: "Leo",
    status: "concluida",
    prioridade: "alta",
    criadaEm: "28/02/2026",
    concluidaEm: "01/03/2026",
    descricao: "Mapear todas as contestacoes do mes, identificar padroes e sugerir medidas preventivas.",
    departamento: "Financeiro",
  },
  {
    id: "tar-008",
    titulo: "Publicacao de conteudo Instagram — Semana 13",
    agente: "Mia",
    status: "concluida",
    prioridade: "baixa",
    criadaEm: "24/03/2026",
    concluidaEm: "30/03/2026",
    descricao: "Criar e publicar 3 posts no Instagram conforme calendario editorial: receita, produto destaque e depoimento.",
    departamento: "Marketing",
  },
  {
    id: "tar-009",
    titulo: "Reconciliacao de estoque vs pedidos — Marco 2026",
    agente: "Sol",
    status: "concluida",
    prioridade: "media",
    criadaEm: "31/03/2026",
    concluidaEm: "01/04/2026",
    descricao: "Cruzar saida de estoque com pedidos faturados para identificar divergencias e ajustar inventario.",
    departamento: "Operacoes",
  },
  {
    id: "tar-010",
    titulo: "Mapeamento de leads B2B inativos",
    agente: "Rex",
    status: "pendente",
    prioridade: "baixa",
    criadaEm: "02/04/2026",
    descricao: "Listar empresas que fizeram mais de 3 compras e estao inativas ha mais de 60 dias para campanha de reativacao.",
    departamento: "Vendas",
  },
  {
    id: "tar-011",
    titulo: "Integracao Google Ads — configuracao inicial",
    agente: "Mia",
    status: "falha",
    prioridade: "media",
    criadaEm: "28/03/2026",
    descricao: "Tentativa de importar dados historicos do Google Ads. Falha por credenciais expiradas. Aguardando renovacao.",
    departamento: "Marketing",
  },
  {
    id: "tar-012",
    titulo: "Analise de rentabilidade por canal de venda",
    agente: "Leo",
    status: "pendente",
    prioridade: "media",
    criadaEm: "02/04/2026",
    descricao: "Comparar margem entre canal proprio (site) vs marketplaces (Shopee, Mercado Livre) considerando taxas e frete.",
    departamento: "Financeiro",
  },
  {
    id: "tar-013",
    titulo: "Pesquisa de satisfacao pos-compra — lote Marco",
    agente: "Iris",
    status: "em_progresso",
    prioridade: "baixa",
    criadaEm: "01/04/2026",
    descricao: "Enviar pesquisa de NPS por WhatsApp para clientes com compras realizadas em Marco/2026.",
    departamento: "Atendimento",
  },
];

// =============================================
// VISUALIZACOES
// =============================================
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

// =============================================
// CONFIGURACOES SECOES
// =============================================
export interface ConfigItem {
  label: string;
  tipo: "toggle" | "select" | "input";
  valor: string | boolean;
  opcoes?: string[];
}

export interface ConfiguracaoSecao {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  items: ConfigItem[];
}

export const CONFIGURACOES_SECOES: ConfiguracaoSecao[] = [
  {
    id: "notificacoes",
    titulo: "Notificacoes",
    descricao: "Controle quais alertas e mensagens voce deseja receber dos agentes",
    icone: "Bell",
    items: [
      { label: "Alertas criticos por email", tipo: "toggle", valor: true },
      { label: "Resumo diario por WhatsApp", tipo: "toggle", valor: true },
      { label: "Notificacoes de tarefas concluidas", tipo: "toggle", valor: false },
      { label: "Alertas de estoque critico", tipo: "toggle", valor: true },
      { label: "Frequencia do resumo diario", tipo: "select", valor: "08:00", opcoes: ["06:00", "07:00", "08:00", "09:00", "10:00"] },
    ],
  },
  {
    id: "inteligencia",
    titulo: "Inteligencia dos Agentes",
    descricao: "Ajuste o comportamento autonomo e nivel de intervencao dos agentes",
    icone: "Brain",
    items: [
      { label: "Modo de aprovacao automatica", tipo: "select", valor: "semi-auto", opcoes: ["manual", "semi-auto", "automatico"] },
      { label: "Agentes podem executar acoes sem aprovacao abaixo de", tipo: "select", valor: "R$ 500", opcoes: ["R$ 100", "R$ 500", "R$ 1.000", "R$ 5.000"] },
      { label: "Aprendizado continuo habilitado", tipo: "toggle", valor: true },
      { label: "Compartilhar dados anonimos para melhoria do modelo", tipo: "toggle", valor: false },
      { label: "Nivel de detalhe nos relatorios", tipo: "select", valor: "detalhado", opcoes: ["resumido", "padrao", "detalhado"] },
    ],
  },
  {
    id: "seguranca",
    titulo: "Seguranca e Acesso",
    descricao: "Gerencie permissoes, autenticacao e auditoria de acesso",
    icone: "Shield",
    items: [
      { label: "Autenticacao de dois fatores (2FA)", tipo: "toggle", valor: true },
      { label: "Timeout de sessao inativa", tipo: "select", valor: "30 minutos", opcoes: ["15 minutos", "30 minutos", "1 hora", "4 horas"] },
      { label: "Log de auditoria de acoes dos agentes", tipo: "toggle", valor: true },
      { label: "Restringir acesso por IP", tipo: "toggle", valor: false },
      { label: "Email de recuperacao", tipo: "input", valor: "carlos@mrlion.com.br" },
    ],
  },
  {
    id: "integrações",
    titulo: "Integracoes",
    descricao: "Conecte plataformas externas para ampliar as capacidades dos agentes",
    icone: "Plug",
    items: [
      { label: "Meta Business Suite", tipo: "toggle", valor: true },
      { label: "WhatsApp Business API", tipo: "toggle", valor: true },
      { label: "Google Analytics 4", tipo: "toggle", valor: false },
      { label: "Shopee Seller Center", tipo: "toggle", valor: true },
      { label: "Mercado Livre API", tipo: "toggle", valor: false },
      { label: "Webhook para sistema ERP", tipo: "input", valor: "" },
    ],
  },
  {
    id: "plano",
    titulo: "Plano e Faturamento",
    descricao: "Informacoes sobre sua assinatura, uso e proxima fatura",
    icone: "CreditCard",
    items: [
      { label: "Plano atual", tipo: "select", valor: "Profissional", opcoes: ["Starter", "Profissional", "Enterprise"] },
      { label: "Ciclo de cobranca", tipo: "select", valor: "Mensal", opcoes: ["Mensal", "Anual"] },
      { label: "Renovacao automatica", tipo: "toggle", valor: true },
      { label: "Email para nota fiscal", tipo: "input", valor: "financeiro@mrlion.com.br" },
    ],
  },
];

// =============================================
// AGENT TASKS DEMO (workspace do agente demo)
// =============================================
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

// =============================================
// AGENT ANALYTICS DEMO
// =============================================
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
