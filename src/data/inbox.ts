// src/data/inbox.ts

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
    assunto: "Chargeback critico: R$ 4.300 em Fevereiro (7,9%)",
    resumo: "Taxa de chargeback de 7,9% em Fev/26 esta 4x acima do limite aceitavel (2%). Identifiquei 12 transacoes suspeitas com mesmo padrao de CEP. Recomendo revisao manual urgente.",
    timestamp: "ha 1d",
    lida: false,
    prioridade: "alta",
    tipo: "alerta",
  },
];
