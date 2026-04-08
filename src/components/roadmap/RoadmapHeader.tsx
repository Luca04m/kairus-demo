'use client';

import { LayoutGrid, GanttChart, Plus } from 'lucide-react';
import { useRoadmapStore, type RoadmapViewMode } from '@/stores/roadmapStore';

interface RoadmapHeaderProps {
  itemCount: number;
}

const VIEW_MODES: { value: RoadmapViewMode; label: string; Icon: typeof LayoutGrid }[] = [
  { value: 'cards', label: 'Cards', Icon: LayoutGrid },
  { value: 'timeline', label: 'Timeline', Icon: GanttChart },
];

export function RoadmapHeader({ itemCount }: RoadmapHeaderProps) {
  const viewMode = useRoadmapStore((s) => s.viewMode);
  const setViewMode = useRoadmapStore((s) => s.setViewMode);
  const setShowAddForm = useRoadmapStore((s) => s.setShowAddForm);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Left: title + count */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-white">Roadmap do Produto</h1>
        <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] px-2 text-[11px] font-medium text-[rgba(255,255,255,0.5)]">
          {itemCount}
        </span>
      </div>

      {/* Right: view toggle + add button */}
      <div className="flex items-center gap-3">
        {/* Segmented control */}
        <div className="flex rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-0.5">
          {VIEW_MODES.map(({ value, label, Icon }) => {
            const active = viewMode === value;
            return (
              <button
                key={value}
                onClick={() => setViewMode(value)}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150"
                style={{
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium text-white transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.08) 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Plus size={14} />
          Adicionar Item
        </button>
      </div>
    </div>
  );
}
