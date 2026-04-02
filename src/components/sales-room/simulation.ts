// src/components/sales-room/simulation.ts
// Demo simulation engine — generates realistic sales room activity

import type { SalesRoomAgent, SalesRoomActivity, SalesRoomMessage } from './seed';

// ─── Random helpers ─────────────────────────────────────
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(): string {
  return `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Message templates ──────────────────────────────────
const LEAD_MESSAGES = [
  'Quanto custa o frete?',
  'Tem Pix?',
  'Aceita cartao?',
  'Quero 2 kits por favor',
  'Qual o prazo de entrega?',
  'Vou fechar agora!',
  'Hmm, vou pensar...',
  'Adorei! Manda o link',
  'Ta caro, tem desconto?',
  'Meu pedido nao chegou',
  'Quero trocar meu pedido',
  'Obrigado pelo atendimento!',
];

const AGENT_MESSAGES = [
  'Ola! Em que posso ajudar?',
  'O frete para sua regiao sai R$15. Acima de R$500 e gratis!',
  'Sim, aceitamos Pix com 5% de desconto!',
  'Perfeito! Estou montando seu pedido.',
  'Vou verificar o status para voce.',
  'Posso oferecer 10% de desconto especial.',
  'Seu pedido esta em transito, previsao 2 dias.',
  'Agradeço a preferencia! Qualquer duvida estou aqui.',
];

const LEAD_NAMES = [
  'Sofia Mendes', 'Tiago Rocha', 'Amanda Oliveira', 'Rafael Lima',
  'Isabela Cruz', 'Gustavo Pereira', 'Leticia Santos', 'Henrique Costa',
];

// ─── Simulation tick ────────────────────────────────────
export interface SimulationEvent {
  type: 'new-message' | 'status-change' | 'activity' | 'metric-increment';
  agentId?: string;
  message?: SalesRoomMessage;
  activity?: SalesRoomActivity;
  metricKey?: 'conversas' | 'vendas' | 'conversao' | 'leads';
  metricDelta?: number;
  newStatus?: 'disponivel' | 'em_atendimento' | 'offline';
}

export function generateSimulationTick(agents: SalesRoomAgent[]): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  const roll = Math.random();

  // Find active agents (not offline)
  const activeAgents = agents.filter((a) => a.status !== 'offline');
  if (activeAgents.length === 0) return events;

  const agent = randomPick(activeAgents);

  if (roll < 0.4) {
    // New lead message
    const isLeadMsg = Math.random() > 0.4;
    const msg: SalesRoomMessage = {
      id: uid(),
      sender: isLeadMsg ? 'lead' : 'agent',
      content: isLeadMsg ? randomPick(LEAD_MESSAGES) : randomPick(AGENT_MESSAGES),
      timestamp: new Date().toISOString(),
    };

    events.push({ type: 'new-message', agentId: agent.id, message: msg });

    // Activity for message
    events.push({
      type: 'activity',
      activity: {
        id: uid(),
        type: isLeadMsg ? 'message-received' : 'message-sent',
        agentName: agent.name,
        description: isLeadMsg
          ? `Lead enviou mensagem para ${agent.name}`
          : `${agent.name} respondeu ao lead`,
        timestamp: new Date().toISOString(),
      },
    });
  } else if (roll < 0.55) {
    // Sale closed
    const value = randomBetween(150, 5000);
    events.push({
      type: 'activity',
      activity: {
        id: uid(),
        type: 'sale-closed',
        agentName: agent.name,
        description: `Venda fechada — ${randomPick(LEAD_NAMES)}`,
        timestamp: new Date().toISOString(),
        value,
      },
    });
    events.push({ type: 'metric-increment', metricKey: 'vendas', metricDelta: 1 });
  } else if (roll < 0.65) {
    // Cart recovered
    const value = randomBetween(100, 2000);
    events.push({
      type: 'activity',
      activity: {
        id: uid(),
        type: 'cart-recovered',
        agentName: agent.name,
        description: `Carrinho recuperado — ${randomPick(LEAD_NAMES)}`,
        timestamp: new Date().toISOString(),
        value,
      },
    });
  } else if (roll < 0.75) {
    // Lead qualified
    events.push({
      type: 'activity',
      activity: {
        id: uid(),
        type: 'lead-qualified',
        agentName: agent.name,
        description: `Novo lead qualificado — ${randomPick(LEAD_NAMES)}`,
        timestamp: new Date().toISOString(),
      },
    });
    events.push({ type: 'metric-increment', metricKey: 'leads', metricDelta: 1 });
  } else if (roll < 0.85) {
    // Follow-up scheduled
    events.push({
      type: 'activity',
      activity: {
        id: uid(),
        type: 'follow-up-scheduled',
        agentName: agent.name,
        description: `Follow-up agendado — ${randomPick(LEAD_NAMES)}`,
        timestamp: new Date().toISOString(),
      },
    });
  } else if (roll < 0.92) {
    // Status change
    const newStatus = agent.status === 'em_atendimento' ? 'disponivel' : 'em_atendimento';
    events.push({ type: 'status-change', agentId: agent.id, newStatus: newStatus as 'disponivel' | 'em_atendimento' });
  } else {
    // Lead lost (rare)
    events.push({
      type: 'activity',
      activity: {
        id: uid(),
        type: 'lead-lost',
        agentName: agent.name,
        description: `Lead perdido — sem resposta ha 48h`,
        timestamp: new Date().toISOString(),
      },
    });
  }

  return events;
}

// ─── Simulation interval ────────────────────────────────
export function getSimulationInterval(): number {
  return randomBetween(3000, 7000); // 3-7 seconds
}
