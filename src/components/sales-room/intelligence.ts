// src/components/sales-room/intelligence.ts
// Utility functions for close probability, sentiment, staleness, and suggested responses

import type { SalesRoomMessage, LeadTemperature } from './seed';

// ─── Close Probability ──────────────────────────────────
interface CloseProbabilityInput {
  temperature: LeadTemperature;
  messageCount: number;
  cartValue: number;
  sentiment: 'positive' | 'neutral' | 'resistant';
}

export function getCloseProbability(input: CloseProbabilityInput): number {
  let base = 0;

  // Temperature base
  if (input.temperature === 'hot') base = 60;
  else if (input.temperature === 'warm') base = 35;
  else base = 10;

  // Message count bonus (engagement signal)
  const msgBonus = Math.min(input.messageCount * 3, 15);

  // Cart bonus
  const cartBonus = input.cartValue > 0 ? Math.min(input.cartValue / 200, 10) : 0;

  // Sentiment bonus
  let sentimentBonus = 0;
  if (input.sentiment === 'positive') sentimentBonus = 10;
  else if (input.sentiment === 'resistant') sentimentBonus = -15;

  return Math.max(0, Math.min(100, Math.round(base + msgBonus + cartBonus + sentimentBonus)));
}

// ─── Sentiment Analysis ─────────────────────────────────
const POSITIVE_KEYWORDS = [
  'quero', 'adorei', 'perfeito', 'fechado', 'gostei',
  'otimo', 'maravilha', 'sim', 'manda', 'pode',
  'confirmo', 'aceito', 'legal', 'vou fechar',
];

const RESISTANT_KEYWORDS = [
  'caro', 'pensar', 'nao sei', 'depois', 'vou ver',
  'demora', 'problema', 'erro', 'reclamar', 'cancelar',
  'devolver', 'ruim', 'pessimo', 'nao gostei',
];

export function getSentiment(messages: SalesRoomMessage[]): 'positive' | 'neutral' | 'resistant' {
  // Only analyze lead messages
  const leadMessages = messages.filter((m) => m.sender === 'lead');
  if (leadMessages.length === 0) return 'neutral';

  // Focus on recent messages (last 3)
  const recent = leadMessages.slice(-3);
  const text = recent.map((m) => m.content.toLowerCase()).join(' ');

  let positiveScore = 0;
  let resistantScore = 0;

  for (const kw of POSITIVE_KEYWORDS) {
    if (text.includes(kw)) positiveScore++;
  }
  for (const kw of RESISTANT_KEYWORDS) {
    if (text.includes(kw)) resistantScore++;
  }

  if (positiveScore > resistantScore) return 'positive';
  if (resistantScore > positiveScore) return 'resistant';
  return 'neutral';
}

// ─── Stale Check ────────────────────────────────────────
export function isStale(lastMessageTime: string): boolean {
  const diff = Date.now() - new Date(lastMessageTime).getTime();
  return diff > 5 * 60_000; // >5 minutes
}

// ─── Suggested Responses ────────────────────────────────
interface SuggestedResponse {
  label: string;
  text: string;
}

const SUGGESTION_MAP: Array<{ keywords: string[]; response: SuggestedResponse }> = [
  {
    keywords: ['preco', 'caro', 'desconto', 'valor'],
    response: {
      label: 'Oferecer desconto',
      text: 'Entendo! Posso aplicar 10% de desconto especial para voce fechar agora. O que acha?',
    },
  },
  {
    keywords: ['frete', 'entrega', 'prazo', 'chegar'],
    response: {
      label: 'Info de entrega',
      text: 'O prazo de entrega para sua regiao e de 3-5 dias uteis. Acima de R$500 o frete e gratis!',
    },
  },
  {
    keywords: ['pensar', 'depois', 'vou ver', 'nao sei'],
    response: {
      label: 'Urgencia',
      text: 'Sem problema! So quero avisar que essa promocao e valida ate hoje. Posso reservar pra voce?',
    },
  },
  {
    keywords: ['pedido', 'rastreamento', 'rastrear', 'chegou'],
    response: {
      label: 'Status do pedido',
      text: 'Vou verificar o status do seu pedido agora mesmo. Pode me informar o numero?',
    },
  },
  {
    keywords: ['erro', 'problema', 'nao consigo', 'bug'],
    response: {
      label: 'Suporte tecnico',
      text: 'Lamento pelo inconveniente! Vou resolver isso pra voce. Pode descrever o erro que aparece?',
    },
  },
  {
    keywords: ['quero', 'fechado', 'manda', 'gera'],
    response: {
      label: 'Confirmar pedido',
      text: 'Otimo! Estou gerando seu pedido agora. Qual forma de pagamento prefere: Pix, cartao ou boleto?',
    },
  },
];

export function getSuggestedResponse(lastLeadMessage: string | undefined): SuggestedResponse | null {
  if (!lastLeadMessage) return null;

  const lower = lastLeadMessage.toLowerCase();

  for (const entry of SUGGESTION_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }

  return {
    label: 'Resposta padrao',
    text: 'Oi! Em que posso ajudar voce hoje?',
  };
}
