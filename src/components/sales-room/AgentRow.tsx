'use client';

import type { SalesRoomAgent } from './seed';

interface AgentRowProps {
  agent: SalesRoomAgent;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const STATUS_DOT: Record<SalesRoomAgent['status'], string> = {
  disponivel: 'bg-green-400',
  em_atendimento: 'bg-amber-400',
  offline: 'bg-[rgba(255,255,255,0.2)]',
};

function formatCurrency(value: number): string {
  if (value >= 1000) return `R$${(value / 1000).toFixed(1)}k`;
  return `R$${value}`;
}

export function AgentRow({ agent, isSelected, onSelect }: AgentRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      className={`
        w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left transition-colors duration-100 cursor-pointer
        ${
          isSelected
            ? 'bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]'
            : 'hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
        }
      `}
    >
      {/* Avatar + status dot */}
      <div className="relative flex-shrink-0">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[10px] font-semibold text-white">
          {agent.initials}
        </span>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#0a0a0a] ${STATUS_DOT[agent.status]}`}
          style={
            agent.status === 'em_atendimento'
              ? { animation: 'pulseSoft 2s ease-in-out infinite' }
              : undefined
          }
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-[rgba(255,255,255,0.85)] truncate">
            {agent.name}
          </span>
          <span className="text-[9px] text-[rgba(255,255,255,0.3)] flex-shrink-0">
            {agent.pipeline}
          </span>
        </div>
        {agent.lead && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-[rgba(255,255,255,0.45)] truncate">
              {agent.lead.name}
            </span>
            {agent.lead.cartValue > 0 && (
              <span className="text-[9px] text-[#D1FF00] tabular-nums flex-shrink-0">
                {formatCurrency(agent.lead.cartValue)}
              </span>
            )}
          </div>
        )}
        {!agent.lead && (
          <span className="text-[10px] text-[rgba(255,255,255,0.25)] italic">Sem lead</span>
        )}
      </div>
    </button>
  );
}
