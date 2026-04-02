'use client';

import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────
interface RealtimeConfig<T extends Record<string, unknown>> {
  /** Supabase table to subscribe to */
  table: string;
  /** Schema (defaults to 'public') */
  schema?: string;
  /** Event types to listen for */
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  /** Optional row-level filter (e.g., "tenant_id=eq.abc") */
  filter?: string;
  /** Whether subscription is enabled */
  enabled?: boolean;
  /** Callback on INSERT */
  onInsert?: (record: T) => void;
  /** Callback on UPDATE */
  onUpdate?: (record: T, old: T) => void;
  /** Callback on DELETE */
  onDelete?: (old: T) => void;
  /** Callback for all events */
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

/**
 * Generic hook for Supabase realtime channel subscriptions.
 * Subscribes on mount, unsubscribes on unmount.
 *
 * @example
 * useRealtimeSubscription({
 *   table: 'alerts',
 *   filter: `tenant_id=eq.${tenantId}`,
 *   onInsert: (alert) => addToList(alert),
 *   onUpdate: (alert) => updateInList(alert),
 * });
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>(
  config: RealtimeConfig<T>,
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const configRef = useRef(config);
  useLayoutEffect(() => {
    configRef.current = config;
  });

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      const supabase = createClient();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    const {
      table,
      schema = 'public',
      event = '*',
      filter,
      enabled = true,
    } = configRef.current;

    if (!enabled) {
      cleanup();
      return;
    }

    const supabase = createClient();

    const channelName = `realtime-${table}-${filter ?? 'all'}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          const { onInsert, onUpdate, onDelete, onChange } = configRef.current;

          onChange?.(payload);

          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new as T);
              break;
            case 'UPDATE':
              onUpdate?.(payload.new as T, payload.old as T);
              break;
            case 'DELETE':
              onDelete?.(payload.old as T);
              break;
          }
        },
      )
      .subscribe();

    channelRef.current = channel;

    return cleanup;
  }, [
    config.table,
    config.schema,
    config.event,
    config.filter,
    config.enabled,
    cleanup,
  ]);

  return {
    /** Manually unsubscribe from the channel */
    unsubscribe: cleanup,
  };
}
