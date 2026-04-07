'use client';

import type { WhatsAppStatus } from './seed';

interface WhatsAppBadgeProps {
  status: WhatsAppStatus;
}

const STATUS_CONFIG: Record<
  WhatsAppStatus,
  { label: string; dotClass: string; textClass: string; animate: boolean }
> = {
  connected: {
    label: 'Live',
    dotClass: 'bg-green-400',
    textClass: 'text-green-400',
    animate: true,
  },
  simulating: {
    label: 'Sim',
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-400',
    animate: false,
  },
  disconnected: {
    label: 'Offline',
    dotClass: 'bg-red-400',
    textClass: 'text-red-400',
    animate: false,
  },
  error: {
    label: 'Erro',
    dotClass: 'bg-red-500',
    textClass: 'text-red-400',
    animate: true,
  },
};

export function WhatsAppBadge({ status }: WhatsAppBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
        style={config.animate ? { animation: 'pulseSoft 1.6s ease-in-out infinite' } : undefined}
      />
      <span className={`text-[10px] font-medium ${config.textClass}`}>
        {config.label}
      </span>
    </div>
  );
}
