'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { RoadmapCardItem, MoscowPriority } from '@/types/roadmap';
import { RoadmapCard } from './RoadmapCard';

const PRIORITY_META: Record<MoscowPriority, { label: string; color: string; description: string }> = {
  must: { label: 'Must Have', color: '#f43f5e', description: 'Essencial para a operação' },
  should: { label: 'Should Have', color: '#f59e0b', description: 'Importante, mas não bloqueante' },
  could: { label: 'Could Have', color: '#71717a', description: 'Desejável se houver recursos' },
  wont: { label: "Won't Have (agora)", color: 'rgba(255,255,255,0.35)', description: 'Adiado para o futuro' },
};

interface PrioritySectionProps {
  priority: MoscowPriority;
  items: RoadmapCardItem[];
  onItemClick: (item: RoadmapCardItem) => void;
}

export function PrioritySection({ priority, items, onItemClick }: PrioritySectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = PRIORITY_META[priority];

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mb-3 group w-full text-left"
      >
        {collapsed ? (
          <ChevronRight size={14} className="text-[rgba(255,255,255,0.3)] transition-transform" />
        ) : (
          <ChevronDown size={14} className="text-[rgba(255,255,255,0.3)] transition-transform" />
        )}

        {/* Color accent dot */}
        <span
          className="h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: meta.color }}
        />

        <span className="text-sm font-medium text-white">{meta.label}</span>

        {/* Count badge */}
        <span
          className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
          style={{
            background: `${meta.color}18`,
            color: meta.color,
            border: `1px solid ${meta.color}33`,
          }}
        >
          {items.length}
        </span>

        <span className="text-[10px] text-[rgba(255,255,255,0.25)] ml-1 hidden sm:inline">
          {meta.description}
        </span>
      </button>

      {/* Cards grid */}
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pl-[22px]">
          {items.map((item) => (
            <RoadmapCard key={item.id} item={item} onClick={() => onItemClick(item)} />
          ))}
        </div>
      )}
    </div>
  );
}
