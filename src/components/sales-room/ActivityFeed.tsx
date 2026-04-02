'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Clock,
  UserX,
} from 'lucide-react';
import type { SalesRoomActivity } from './seed';

interface ActivityFeedProps {
  activities: SalesRoomActivity[];
}

// ─── Activity type config ───────────────────────────────
const TYPE_CONFIG: Record<
  SalesRoomActivity['type'],
  { icon: typeof MessageSquare; color: string; bgColor: string }
> = {
  'message-sent': {
    icon: MessageSquare,
    color: 'text-[rgba(255,255,255,0.4)]',
    bgColor: 'bg-[rgba(255,255,255,0.05)]',
  },
  'message-received': {
    icon: MessageSquare,
    color: 'text-[rgba(255,255,255,0.4)]',
    bgColor: 'bg-[rgba(255,255,255,0.05)]',
  },
  'cart-recovered': {
    icon: ShoppingCart,
    color: 'text-[#D1FF00]',
    bgColor: 'bg-[rgba(209,255,0,0.08)]',
  },
  'sale-closed': {
    icon: DollarSign,
    color: 'text-[#D1FF00]',
    bgColor: 'bg-[rgba(209,255,0,0.08)]',
  },
  'lead-qualified': {
    icon: UserCheck,
    color: 'text-green-400',
    bgColor: 'bg-[rgba(74,222,128,0.08)]',
  },
  'follow-up-scheduled': {
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-[rgba(251,191,36,0.08)]',
  },
  'lead-lost': {
    icon: UserX,
    color: 'text-red-400',
    bgColor: 'bg-[rgba(248,113,113,0.08)]',
  },
};

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatValue(value: number): string {
  if (value >= 1000) return `R$${(value / 1000).toFixed(1)}k`;
  return `R$${value}`;
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top on new activity
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activities.length]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 px-2 py-2">
      <AnimatePresence initial={false}>
        {activities.map((activity) => {
          const config = TYPE_CONFIG[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -10, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-100"
            >
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded ${config.bgColor} mt-0.5`}
              >
                <Icon size={10} className={config.color} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[rgba(255,255,255,0.6)] leading-snug">
                  <span className="font-medium text-[rgba(255,255,255,0.75)]">
                    {activity.agentName}
                  </span>{' '}
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-[rgba(255,255,255,0.25)] tabular-nums">
                    {relativeTime(activity.timestamp)}
                  </span>
                  {activity.value != null && activity.value > 0 && (
                    <span className="text-[9px] text-[#D1FF00] tabular-nums font-medium">
                      {formatValue(activity.value)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
