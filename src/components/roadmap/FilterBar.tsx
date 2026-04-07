'use client';

import { Search, X } from 'lucide-react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import type { MoscowPriority, RoadmapStatus } from '@/types/roadmap';

const PRIORITIES: { value: MoscowPriority | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'Todos', color: 'rgba(255,255,255,0.5)' },
  { value: 'must', label: 'Must', color: '#f43f5e' },
  { value: 'should', label: 'Should', color: '#f59e0b' },
  { value: 'could', label: 'Could', color: '#3b82f6' },
  { value: 'wont', label: "Won't", color: 'rgba(255,255,255,0.3)' },
];

const STATUSES: { value: RoadmapStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'planned', label: 'Planejado' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'done', label: 'Concluído' },
];

const DEPARTMENTS = [
  'all',
  'Vendas',
  'Financeiro',
  'Operações',
  'Atendimento',
  'Marketing',
  'Tech',
] as const;

export function FilterBar() {
  const filters = useRoadmapStore((s) => s.filters);
  const setFilter = useRoadmapStore((s) => s.setFilter);
  const resetFilters = useRoadmapStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.department !== 'all' ||
    filters.search !== '';

  return (
    <div className="flex flex-col gap-3">
      {/* Priority pills */}
      <div className="flex flex-wrap items-center gap-2">
        {PRIORITIES.map((p) => {
          const active = filters.priority === p.value;
          return (
            <button
              key={p.value}
              onClick={() => setFilter('priority', p.value)}
              className="relative rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
              style={{
                background: active ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? `${p.color}55` : 'rgba(255,255,255,0.08)'}`,
                color: active ? p.color : 'rgba(255,255,255,0.5)',
              }}
            >
              {p.label}
            </button>
          );
        })}

        {/* Status select */}
        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value as RoadmapStatus | 'all')}
          className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.5)] focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#111]">
              {s.label}
            </option>
          ))}
        </select>

        {/* Department select */}
        <select
          value={filters.department}
          onChange={(e) => setFilter('department', e.target.value)}
          className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.5)] focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d} className="bg-[#111]">
              {d === 'all' ? 'Departamento' : d}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[rgba(255,255,255,0.25)] focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <X size={12} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
