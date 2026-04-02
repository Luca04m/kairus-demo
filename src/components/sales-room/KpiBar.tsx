'use client';

import type { SalesRoomMetrics } from './seed';

interface KpiBarProps {
  metrics: SalesRoomMetrics;
}

interface KpiCell {
  label: string;
  value: string;
  suffix?: string;
}

export function KpiBar({ metrics }: KpiBarProps) {
  const cells: KpiCell[] = [
    { label: 'Conversas', value: String(metrics.conversas) },
    { label: 'Vendas', value: String(metrics.vendas) },
    { label: 'Conversao', value: String(metrics.conversao), suffix: '%' },
    { label: 'Leads', value: String(metrics.leads) },
  ];

  return (
    <div className="flex items-center gap-3">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex flex-col items-center px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
        >
          <span className="text-[10px] uppercase tracking-wider text-[rgba(255,255,255,0.3)]">
            {cell.label}
          </span>
          <span className="text-sm font-semibold text-white tabular-nums">
            {cell.value}
            {cell.suffix && (
              <span className="text-[10px] text-[rgba(255,255,255,0.4)]">{cell.suffix}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
