'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSalesRoomStore } from '@/stores/salesRoomStore';
import { SEED_AGENTS, SEED_ACTIVITIES, SEED_METRICS } from '@/components/sales-room/seed';
import {
  generateSimulationTick,
  getSimulationInterval,
} from '@/components/sales-room/simulation';

export function useSalesRoomPanel() {
  const store = useSalesRoomStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Initialize with seed data (only if store is empty)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const currentState = useSalesRoomStore.getState();

    // Only seed agents if none exist yet
    if (currentState.agents.length === 0) {
      store.setAgents(SEED_AGENTS);
    }
    // addActivity already deduplicates by ID, safe to call
    for (const act of SEED_ACTIVITIES) {
      store.addActivity(act);
    }
    if (currentState.metrics.conversas === 0 && currentState.metrics.vendas === 0) {
      store.updateMetrics(SEED_METRICS);
    }
    // Select first agent if none selected
    if (!currentState.selectedAgentId && SEED_AGENTS.length > 0) {
      store.selectAgent(SEED_AGENTS[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulation loop
  const runSimulation = useCallback(() => {
    const state = useSalesRoomStore.getState();
    if (!state.simulationEnabled) return;

    const events = generateSimulationTick(state.agents);

    for (const event of events) {
      switch (event.type) {
        case 'new-message':
          if (event.agentId && event.message) {
            useSalesRoomStore.getState().addMessage(event.agentId, event.message);
          }
          break;
        case 'activity':
          if (event.activity) {
            useSalesRoomStore.getState().addActivity(event.activity);
          }
          break;
        case 'status-change':
          if (event.agentId && event.newStatus) {
            useSalesRoomStore.getState().updateAgentStatus(event.agentId, event.newStatus);
          }
          break;
        case 'metric-increment':
          if (event.metricKey && event.metricDelta) {
            useSalesRoomStore.getState().incrementMetric(event.metricKey, event.metricDelta);
          }
          break;
      }
    }

    // Schedule next tick
    const interval = getSimulationInterval();
    timerRef.current = setTimeout(runSimulation, interval);
  }, []);

  useEffect(() => {
    if (store.simulationEnabled) {
      const interval = getSimulationInterval();
      timerRef.current = setTimeout(runSimulation, interval);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [store.simulationEnabled, runSimulation]);

  return store;
}
