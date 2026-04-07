'use client';

import { useState, useEffect } from 'react';
import { useSalesRoomPanel } from '@/hooks/useSalesRoomPanel';
import { KpiBar } from './KpiBar';
import { WhatsAppBadge } from './WhatsAppBadge';
import { AgentRow } from './AgentRow';
import { ConversationView } from './ConversationView';
import { ActivityFeed } from './ActivityFeed';
import { Activity, Headphones } from 'lucide-react';

function SalesRoomSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-[rgba(255,255,255,0.85)]">Sales Room</h1>
        </div>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />
          ))}
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside className="w-60 flex-shrink-0 border-r border-[rgba(255,255,255,0.06)] flex flex-col max-md:hidden">
          <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Agentes</span>
          </div>
          <div className="flex-1 p-3 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-[rgba(255,255,255,0.02)]" />
            ))}
          </div>
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center min-w-0">
          <Headphones size={32} className="text-[rgba(255,255,255,0.1)] mb-3" />
          <p className="text-sm text-[rgba(255,255,255,0.3)]">Carregando Sales Room...</p>
        </main>
        <aside className="w-64 flex-shrink-0 border-l border-[rgba(255,255,255,0.06)] flex flex-col max-lg:hidden">
          <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Atividade</span>
          </div>
          <div className="flex-1 p-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-[rgba(255,255,255,0.02)]" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function SalesRoomPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const {
    agents,
    activities,
    metrics,
    selectedAgentId,
    whatsappStatus,
    simulationEnabled,
    selectAgent,
    setSimulationEnabled,
  } = useSalesRoomPanel();

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;
  const vendasAgents = agents.filter((a) => a.role === 'vendas');
  const suporteAgents = agents.filter((a) => a.role === 'suporte');
  const activeCount = agents.filter((a) => a.status !== 'offline').length;

  if (!mounted) return <SalesRoomSkeleton />;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white overflow-hidden">
      {/* ─── Header ───────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-[rgba(255,255,255,0.85)]">Sales Room</h1>
          <WhatsAppBadge status={whatsappStatus} />

          {/* Simulation toggle */}
          <button
            type="button"
            onClick={() => setSimulationEnabled(!simulationEnabled)}
            className={`
              relative w-8 h-4 rounded-full transition-colors duration-200 cursor-pointer
              ${simulationEnabled ? 'bg-amber-400/30 border-amber-400/50' : 'bg-[rgba(255,255,255,0.08)]'}
              border border-[rgba(255,255,255,0.1)]
            `}
            title={simulationEnabled ? 'Simulacao ativa' : 'Simulacao desativada'}
          >
            <span
              className={`
                absolute top-0.5 h-3 w-3 rounded-full transition-all duration-200
                ${simulationEnabled ? 'left-4 bg-amber-400' : 'left-0.5 bg-[rgba(255,255,255,0.3)]'}
              `}
            />
          </button>
        </div>
        <KpiBar metrics={metrics} />
      </header>

      {/* ─── Main 3-column layout ─────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel — Agent list */}
        <aside className="w-60 flex-shrink-0 border-r border-[rgba(255,255,255,0.06)] flex flex-col overflow-hidden max-md:hidden">
          <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
              Agentes
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Vendas section */}
            <div className="px-3 pt-3 pb-1">
              <span className="text-[9px] text-[rgba(255,255,255,0.25)] uppercase tracking-widest font-medium">
                Vendas
              </span>
            </div>
            {vendasAgents.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                isSelected={agent.id === selectedAgentId}
                onSelect={selectAgent}
              />
            ))}

            {/* Suporte section */}
            <div className="px-3 pt-4 pb-1">
              <span className="text-[9px] text-[rgba(255,255,255,0.25)] uppercase tracking-widest font-medium">
                Suporte
              </span>
            </div>
            {suporteAgents.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                isSelected={agent.id === selectedAgentId}
                onSelect={selectAgent}
              />
            ))}
          </div>
        </aside>

        {/* Center panel — Conversation */}
        <main className="flex-1 flex flex-col min-w-0">
          <ConversationView agent={selectedAgent} />
        </main>

        {/* Right panel — Activity feed */}
        <aside className="w-64 flex-shrink-0 border-l border-[rgba(255,255,255,0.06)] flex flex-col overflow-hidden max-lg:hidden">
          <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-1.5">
            <Activity size={11} className="text-[rgba(255,255,255,0.3)]" />
            <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
              Atividade
            </span>
          </div>
          <ActivityFeed activities={activities} />
        </aside>
      </div>

      {/* ─── Footer — Status bar ──────────────────────── */}
      <footer className="flex items-center justify-between px-4 py-1.5 border-t border-[rgba(255,255,255,0.06)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[rgba(255,255,255,0.25)] tabular-nums">
            {activeCount} ativos / {agents.length} total
          </span>
          <span className="text-[9px] text-[rgba(255,255,255,0.15)]">|</span>
          <span className="text-[9px] text-[rgba(255,255,255,0.25)] tabular-nums">
            {activities.length} eventos
          </span>
        </div>
        <span className="text-[9px] text-[rgba(255,255,255,0.2)] tabular-nums">
          {new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </footer>
    </div>
  );
}
