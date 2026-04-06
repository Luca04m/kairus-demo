"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWorldStore } from "@/stores/worldStore";
import { ROOMS } from "@/data/world-layout";
import { AGENTES } from "@/data/mrlion";
import type { Presence } from "@/types/world";
import type { UUID } from "@/types/common";

// ─── Agent-to-room affinity map ─────────────────────────
// Each agent has primary rooms they frequent and secondary rooms they visit occasionally
const AGENT_ROOM_AFFINITY: Record<string, { primary: string[]; secondary: string[] }> = {
  leo: {
    primary: ["fin-cobrancas", "fin-fluxo-caixa", "fin-conciliacao"],
    secondary: ["fin-dre", "vendas-pipeline"],
  },
  mia: {
    primary: ["mkt-campanhas", "mkt-conteudo", "mkt-analytics"],
    secondary: ["vendas-qualificacao"],
  },
  rex: {
    primary: ["vendas-pipeline", "vendas-qualificacao", "vendas-fechamento"],
    secondary: ["vendas-pos-venda", "mkt-campanhas"],
  },
  sol: {
    primary: ["ops-logistica", "ops-estoque", "ops-processos"],
    secondary: ["tech-monitoramento", "tech-integracoes"],
  },
  iris: {
    primary: ["atend-triagem", "atend-suporte-n1", "atend-suporte-n2"],
    secondary: ["ops-processos"],
  },
};

// ─── Activity messages per agent ────────────────────────
const AGENT_ACTIVITIES: Record<string, string[]> = {
  leo: [
    "Analisando DRE do trimestre...",
    "Verificando fluxo de caixa...",
    "Detectando margens negativas...",
    "Conciliando transacoes bancarias...",
    "Gerando relatorio financeiro...",
    "Auditando chargebacks recentes...",
    "Projetando fluxo para proximas 4 semanas...",
    "Alertando sobre pagamento atrasado...",
  ],
  mia: [
    "Processando campanha Meta Ads...",
    "Otimizando ROAS da campanha Verao...",
    "Agendando posts Instagram...",
    "Analisando metricas de engajamento...",
    "Reduzindo CPC via A/B test...",
    "Criando copy para nova campanha...",
    "Monitorando CAC por canal...",
    "Gerando relatorio de performance...",
  ],
  rex: [
    "Qualificando lead B2B #847...",
    "Enviando proposta comercial...",
    "Atualizando pipeline de vendas...",
    "Analisando dados de vendas...",
    "Preparando recompra automatica...",
    "Calculando ticket medio por segmento...",
    "Follow-up com prospects ativos...",
    "Fechando negociacao #312...",
  ],
  sol: [
    "Rastreando entregas em transito...",
    "Verificando estoque critico...",
    "Otimizando rota de entregas...",
    "Processando reenvio #4891...",
    "Atualizando status de fulfillment...",
    "Alerta: ruptura de estoque prevista...",
    "Confirmando recebimento de lote...",
    "Monitorando SLA de entregas...",
  ],
  iris: [
    "Respondendo ticket #142...",
    "Triando mensagens WhatsApp...",
    "Escalando caso complexo para N2...",
    "Processando troca/devolucao...",
    "Respondendo FAQ automaticamente...",
    "Classificando tickets por prioridade...",
    "Monitorando SLA de atendimento...",
    "Atualizando base de conhecimento...",
  ],
};

// ─── Deterministic hash ─────────────────────────────────
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ─── Build initial presences ────────────────────────────
function buildInitialPresences(): Presence[] {
  const presences: Presence[] = [];
  const agentIds = ["leo", "mia", "rex", "sol", "iris"];

  for (const agentId of agentIds) {
    const affinity = AGENT_ROOM_AFFINITY[agentId];
    if (!affinity) continue;

    // Start each agent in their first primary room
    const roomId = affinity.primary[0];
    const agent = AGENTES.find((a) => a.id === agentId);
    const activities = AGENT_ACTIVITIES[agentId] ?? [];
    const activityIdx = hashStr(agentId) % Math.max(1, activities.length);

    presences.push({
      agent_id: agentId as UUID,
      room_id: roomId as UUID,
      status: agent?.status === "pausado" ? "pausado" : "ativo",
      current_task: activities[activityIdx] ?? "",
      last_heartbeat: new Date().toISOString(),
    });
  }

  return presences;
}

// ─── Hook ───────────────────────────────────────────────
export function useWorldSimulation() {
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const tickRef = useRef(0);

  const setPresences = useCallback((presences: Presence[]) => {
    useWorldStore.setState({ presences });
  }, []);

  const updatePresence = useCallback((agentId: string, updates: Partial<Presence>) => {
    useWorldStore.setState((state) => {
      const newPresences = state.presences.map((p) =>
        p.agent_id === agentId ? { ...p, ...updates, last_heartbeat: new Date().toISOString() } : p,
      );
      return { presences: newPresences };
    });
  }, []);

  useEffect(() => {
    // 1. Initialize presences
    const initial = buildInitialPresences();
    setPresences(initial);

    // 2. Set up movement simulation per agent
    const agentIds = ["leo", "mia", "rex", "sol", "iris"];

    for (const agentId of agentIds) {
      const affinity = AGENT_ROOM_AFFINITY[agentId];
      if (!affinity) continue;

      const h = hashStr(agentId);
      // Stagger: each agent moves at a different interval (8-15s)
      const baseInterval = 8000 + (h % 7000);
      // Stagger initial start
      const initialDelay = 1000 + (h % 4000);

      const startTimer = setTimeout(() => {
        const moveTimer = setInterval(() => {
          tickRef.current += 1;
          const tick = tickRef.current;
          const seed = hashStr(agentId + tick);

          // 70% chance to stay in primary rooms, 30% to visit secondary
          const pool = seed % 100 < 70 ? affinity.primary : affinity.secondary;
          const roomId = pool[seed % pool.length];

          // Verify room exists
          const roomExists = ROOMS.some((r) => r.id === roomId);
          if (!roomExists) return;

          // Pick a new activity message
          const activities = AGENT_ACTIVITIES[agentId] ?? [];
          const activity = activities[seed % Math.max(1, activities.length)] ?? "";

          updatePresence(agentId, {
            room_id: roomId as UUID,
            current_task: activity,
            status: agentId === "iris" && seed % 5 === 0 ? "pausado" : "ativo",
          });
        }, baseInterval);

        timersRef.current.push(moveTimer as unknown as ReturnType<typeof setInterval>);
      }, initialDelay);

      timersRef.current.push(startTimer as unknown as ReturnType<typeof setInterval>);
    }

    // 3. Activity message rotation (every 5-8s, rotate tasks for all agents)
    const activityTimer = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      // Pick one random agent to update their task message
      const agentIdx = tick % agentIds.length;
      const agentId = agentIds[agentIdx];
      const activities = AGENT_ACTIVITIES[agentId] ?? [];
      const seed = hashStr(agentId + "task" + tick);
      const activity = activities[seed % Math.max(1, activities.length)] ?? "";

      updatePresence(agentId, { current_task: activity });
    }, 5000);

    timersRef.current.push(activityTimer);

    // 4. Also populate notifications in the store
    useWorldStore.setState({
      notifications: [
        {
          id: "sim-n1",
          type: "success",
          title: "Campanha otimizada",
          message: "Mia reduziu CPC em 18% na campanha Verao 2026",
          agent_id: "mia",
          room_id: "mkt-campanhas",
          timestamp: new Date(Date.now() - 2700000).toISOString(),
        },
        {
          id: "sim-n2",
          type: "warning",
          title: "Margem negativa detectada",
          message: "Leo identificou margem negativa no Honey Pingente",
          agent_id: "leo",
          room_id: "fin-dre",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "sim-n3",
          type: "info",
          title: "Recompra enviada",
          message: "Rex enviou lembrete de recompra para 12 clientes B2B",
          agent_id: "rex",
          room_id: "vendas-pos-venda",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    });

    return () => {
      for (const timer of timersRef.current) {
        clearInterval(timer);
        clearTimeout(timer);
      }
      timersRef.current = [];
    };
  }, [setPresences, updatePresence]);
}
