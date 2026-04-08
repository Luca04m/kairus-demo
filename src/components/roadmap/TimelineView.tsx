'use client';

import { useMemo, useState } from 'react';
import type { RoadmapCardItem, MoscowPriority, RoadmapStatus } from '@/types/roadmap';
import { MilestoneMarker } from './MilestoneMarker';

// ─── Constants ───────────────────────────────────────────
const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
const QUARTER_START = new Date('2026-01-01').getTime();
const QUARTER_END = new Date('2026-12-31').getTime();
const TOTAL_MS = QUARTER_END - QUARTER_START;

const PRIORITY_COLOR: Record<MoscowPriority, string> = {
  must: '#f43f5e',
  should: '#f59e0b',
  could: '#71717a',
  wont: 'rgba(255,255,255,0.25)',
};

const STATUS_OPACITY: Record<RoadmapStatus, number> = {
  planned: 0.4,
  in_progress: 0.75,
  done: 1,
};

// ─── Helpers ─────────────────────────────────────────────
function dateToPercent(iso: string): number {
  const ms = new Date(iso).getTime();
  return Math.max(0, Math.min(100, ((ms - QUARTER_START) / TOTAL_MS) * 100));
}

function getDepartments(items: RoadmapCardItem[]): string[] {
  const set = new Set(items.map((i) => i.departamento));
  return Array.from(set).sort();
}

// ─── Milestones on the timeline ──────────────────────────
const MILESTONES = [
  { label: 'Início Q2', date: '2026-04-01' },
  { label: 'Início Q3', date: '2026-07-01' },
  { label: 'Início Q4', date: '2026-10-01' },
];

interface TimelineViewProps {
  items: RoadmapCardItem[];
  onItemClick: (item: RoadmapCardItem) => void;
}

export function TimelineView({ items, onItemClick }: TimelineViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const departments = useMemo(() => getDepartments(items), [items]);

  // Group items by department
  const byDepartment = useMemo(() => {
    const map = new Map<string, RoadmapCardItem[]>();
    for (const dept of departments) {
      map.set(dept, items.filter((i) => i.departamento === dept));
    }
    return map;
  }, [items, departments]);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Sticky header with quarters */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)]">
        {/* Department label column */}
        <div className="w-[140px] flex-shrink-0 px-4 py-3 border-r border-[rgba(255,255,255,0.06)]">
          <span className="text-[10px] font-medium text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
            Departamento
          </span>
        </div>

        {/* Quarter headers */}
        <div className="flex-1 flex relative">
          {QUARTERS.map((q, i) => (
            <div
              key={q}
              className="flex-1 px-3 py-3 text-center text-[11px] font-medium text-[rgba(255,255,255,0.4)]"
              style={{
                borderRight: i < QUARTERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
              }}
            >
              {q}
            </div>
          ))}
        </div>
      </div>

      {/* Swim lanes */}
      <div className="relative">
        {/* Milestone markers */}
        <div className="absolute left-[140px] right-0 top-0 bottom-0 pointer-events-none">
          {MILESTONES.map((m) => (
            <MilestoneMarker
              key={m.date}
              label={m.label}
              xPercent={dateToPercent(m.date)}
            />
          ))}
        </div>

        {departments.map((dept, deptIdx) => {
          const deptItems = byDepartment.get(dept) ?? [];

          return (
            <div
              key={dept}
              className="flex"
              style={{
                borderBottom:
                  deptIdx < departments.length - 1
                    ? '1px solid rgba(255,255,255,0.04)'
                    : undefined,
              }}
            >
              {/* Department label */}
              <div className="w-[140px] flex-shrink-0 px-4 py-4 border-r border-[rgba(255,255,255,0.06)] flex items-start">
                <span className="text-xs text-[rgba(255,255,255,0.5)] font-medium">{dept}</span>
              </div>

              {/* Timeline area */}
              <div className="flex-1 relative py-2 min-h-[56px]">
                {/* Quarter gridlines */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {QUARTERS.map((q, i) => (
                    <div
                      key={q}
                      className="flex-1"
                      style={{
                        borderRight:
                          i < QUARTERS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : undefined,
                      }}
                    />
                  ))}
                </div>

                {/* Feature bars */}
                <div className="relative flex flex-col gap-1.5 px-1">
                  {deptItems.map((item) => {
                    if (!item.data_inicio && !item.data_fim) return null;

                    const startPct = item.data_inicio ? dateToPercent(item.data_inicio) : 0;
                    const endPct = item.data_fim ? dateToPercent(item.data_fim) : 100;
                    const widthPct = Math.max(endPct - startPct, 2);
                    const color = PRIORITY_COLOR[item.prioridade];
                    const opacity = STATUS_OPACITY[item.status];
                    const isHovered = hoveredId === item.id;
                    const isInProgress = item.status === 'in_progress';

                    return (
                      <div key={item.id} className="relative h-7">
                        <button
                          type="button"
                          onClick={() => onItemClick(item)}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className="absolute top-0 h-full rounded-full transition-all duration-200 cursor-pointer group"
                          style={{
                            left: `${startPct}%`,
                            width: `${widthPct}%`,
                            minWidth: '24px',
                            opacity: isHovered ? 1 : opacity,
                            background: `linear-gradient(90deg, ${color}55 0%, ${color}33 100%)`,
                            border: `1px solid ${color}${isHovered ? '88' : '44'}`,
                            boxShadow: isHovered
                              ? `0 0 12px ${color}33`
                              : undefined,
                            animation: isInProgress ? 'pulseSoft 3s ease-in-out infinite' : undefined,
                          }}
                        >
                          {/* Label inside bar */}
                          <span className="absolute inset-0 flex items-center px-2 text-[10px] text-white font-medium truncate">
                            {item.titulo}
                          </span>

                          {/* Hover tooltip */}
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 whitespace-nowrap rounded-lg bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] px-3 py-2 shadow-xl pointer-events-none">
                              <div className="text-xs text-white font-medium mb-1">{item.titulo}</div>
                              <div className="flex items-center gap-2 text-[10px] text-[rgba(255,255,255,0.5)]">
                                <span
                                  className="rounded px-1.5 py-0.5 text-[9px] font-semibold"
                                  style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
                                >
                                  {item.prioridade.toUpperCase()}
                                </span>
                                <span>
                                  {item.status === 'planned' ? 'Planejado' : item.status === 'in_progress' ? 'Em Progresso' : 'Concluído'}
                                </span>
                                <span>{item.departamento}{item.squad ? ` / ${item.squad}` : ''}</span>
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {departments.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-[rgba(255,255,255,0.3)]">
            Nenhum item com datas definidas para exibir na timeline.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
        <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mr-2">Prioridade:</span>
        {(Object.entries(PRIORITY_COLOR) as [MoscowPriority, string][]).map(([key, color]) => (
          <span key={key} className="flex items-center gap-1.5 text-[10px] text-[rgba(255,255,255,0.4)]">
            <span className="h-2 w-4 rounded-full" style={{ background: `${color}88` }} />
            {key === 'must' ? 'Must' : key === 'should' ? 'Should' : key === 'could' ? 'Could' : "Won't"}
          </span>
        ))}
      </div>
    </div>
  );
}
