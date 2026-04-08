'use client';

import { Circle, Loader2, CheckCircle2, Tag, Calendar } from 'lucide-react';
import type { RoadmapCardItem, MoscowPriority, RoadmapStatus, ImpactLevel, EffortLevel } from '@/types/roadmap';

// ─── Priority styling ───────────────────────────────────
const PRIORITY_CONFIG: Record<MoscowPriority, { label: string; bg: string; text: string; border: string }> = {
  must: { label: 'Must', bg: 'rgba(244,63,94,0.12)', text: '#f43f5e', border: 'rgba(244,63,94,0.3)' },
  should: { label: 'Should', bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  could: { label: 'Could', bg: 'rgba(113,113,122,0.12)', text: '#71717a', border: 'rgba(113,113,122,0.3)' },
  wont: { label: "Won't", bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.35)', border: 'rgba(255,255,255,0.1)' },
};

// ─── Status styling ─────────────────────────────────────
const STATUS_CONFIG: Record<RoadmapStatus, { label: string; color: string; Icon: typeof Circle }> = {
  planned: { label: 'Planejado', color: 'rgba(255,255,255,0.4)', Icon: Circle },
  in_progress: { label: 'Em Progresso', color: '#f59e0b', Icon: Loader2 },
  done: { label: 'Concluído', color: '#10b981', Icon: CheckCircle2 },
};

const IMPACT_LABEL: Record<ImpactLevel, { label: string; color: string }> = {
  high: { label: 'Alto', color: '#10b981' },
  medium: { label: 'Médio', color: '#f59e0b' },
  low: { label: 'Baixo', color: 'rgba(255,255,255,0.35)' },
};

const EFFORT_LABEL: Record<EffortLevel, { label: string; color: string }> = {
  high: { label: 'Alto', color: '#f43f5e' },
  medium: { label: 'Médio', color: '#f59e0b' },
  low: { label: 'Baixo', color: '#10b981' },
};

interface RoadmapCardProps {
  item: RoadmapCardItem;
  onClick: () => void;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

export function RoadmapCard({ item, onClick }: RoadmapCardProps) {
  const priority = PRIORITY_CONFIG[item.prioridade];
  const status = STATUS_CONFIG[item.status];
  const impact = IMPACT_LABEL[item.impacto];
  const effort = EFFORT_LABEL[item.esforco];
  const StatusIcon = status.Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-card rounded-xl p-4 text-left w-full transition-all duration-200 hover:scale-[1.01] focus:outline-none focus-ring group"
    >
      {/* Header: status icon + title */}
      <div className="flex items-start gap-2.5 mb-2">
        <StatusIcon
          size={16}
          className="mt-0.5 flex-shrink-0"
          style={{ color: status.color }}
          {...(item.status === 'in_progress' ? { strokeWidth: 2.5 } : {})}
        />
        <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 group-hover:text-white/95">
          {item.titulo}
        </h3>
      </div>

      {/* Description */}
      {item.descricao && (
        <p className="text-[11px] text-[rgba(255,255,255,0.4)] leading-relaxed line-clamp-2 mb-3 pl-[26px]">
          {item.descricao}
        </p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5 pl-[26px] mb-2.5">
        {/* Priority badge */}
        <span
          className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
          style={{
            background: priority.bg,
            color: priority.text,
            border: `1px solid ${priority.border}`,
          }}
        >
          {priority.label}
        </span>

        {/* Impact */}
        <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <span className="text-[rgba(255,255,255,0.35)]">Impacto</span>
          <span style={{ color: impact.color }}>{impact.label}</span>
        </span>

        {/* Effort */}
        <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <span className="text-[rgba(255,255,255,0.35)]">Esforço</span>
          <span style={{ color: effort.color }}>{effort.label}</span>
        </span>
      </div>

      {/* Footer: department, dates, tags */}
      <div className="flex items-center gap-2 pl-[26px] flex-wrap">
        {/* Department */}
        <span className="text-[10px] text-[rgba(255,255,255,0.35)] font-medium">
          {item.departamento}
          {item.squad ? ` / ${item.squad}` : ''}
        </span>

        {/* Date range */}
        {(item.data_inicio || item.data_fim) && (
          <span className="flex items-center gap-1 text-[10px] text-[rgba(255,255,255,0.25)]">
            <Calendar size={9} />
            {formatDate(item.data_inicio)}
            {item.data_fim ? ` — ${formatDate(item.data_fim)}` : ''}
          </span>
        )}

        {/* Tags */}
        {(item.tags ?? []).length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-[rgba(255,255,255,0.2)]">
            <Tag size={9} />
            {(item.tags ?? []).slice(0, 2).join(', ')}
            {(item.tags ?? []).length > 2 && ` +${(item.tags ?? []).length - 2}`}
          </span>
        )}
      </div>
    </button>
  );
}
