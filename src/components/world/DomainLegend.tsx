"use client";

import { DOMAINS, type DomainVisual } from "@/data/world-layout";
import type { DepartmentId } from "@/types/departments";

interface DomainLegendProps {
  activeDomains?: DepartmentId[];
  onToggleDomain?: (domain: DepartmentId) => void;
}

export function DomainLegend({ activeDomains, onToggleDomain }: DomainLegendProps) {
  const domains = Object.values(DOMAINS) as DomainVisual[];
  const allActive = !activeDomains || activeDomains.length === 0;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-1">
      {domains.map((d) => {
        const isActive = allActive || activeDomains?.includes(d.id);
        return (
          <button
            key={d.id}
            onClick={() => onToggleDomain?.(d.id)}
            className={`
              flex items-center gap-1.5 rounded-full px-3 py-1.5
              text-xs font-medium whitespace-nowrap
              transition-all duration-150 cursor-pointer
              border
              ${isActive
                ? "text-white border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)]"
                : "text-[rgba(255,255,255,0.3)] border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.04)]"
              }
            `}
          >
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: d.tileColor,
                opacity: isActive ? 1 : 0.4,
              }}
            />
            <span>{d.emoji}</span>
            <span>{d.label}</span>
          </button>
        );
      })}
    </div>
  );
}
