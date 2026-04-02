"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { SEED_NOTIFICATIONS, type WorldNotification } from "@/data/world-layout";
import { useWorldStore } from "@/stores/worldStore";
import { useWorldUiStore } from "@/stores/worldUiStore";

const typeConfig: Record<
  string,
  { icon: typeof CheckCircle2; color: string; bg: string }
> = {
  success: { icon: CheckCircle2, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  error: { icon: AlertCircle, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  info: { icon: Info, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  // Map store notification types to icons as fallback
  agent_moved: { icon: Info, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  task_completed: { icon: CheckCircle2, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  alert: { icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  presence: { icon: Info, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
};

const defaultTypeConfig = { icon: Info, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" };

function timeAgo(ts: number | string): string {
  const time = typeof ts === "string" ? new Date(ts).getTime() : ts;
  if (isNaN(time)) return "";
  const diff = Math.floor((Date.now() - time) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function WorldNotifications() {
  const { notificationPanelOpen } = useWorldUiStore();
  const storeNotifications = useWorldStore((s) => s.notifications);
  // Use seed data only when store has no live data
  const hasLiveData = storeNotifications.length > 0;
  const demoCounterRef = useRef(0);

  // Derive live notifications directly (no state+effect needed)
  const liveNotifications = useMemo<WorldNotification[]>(() => {
    if (!hasLiveData) return [];
    return storeNotifications.map((n) => ({
      id: n.id,
      type: (n.type as WorldNotification["type"]) ?? "info",
      title: n.title ?? n.message.slice(0, 40),
      message: n.message,
      timestamp: typeof n.timestamp === "string" ? new Date(n.timestamp).getTime() : 0,
      agentId: n.agent_id,
      roomId: n.room_id,
    }));
  }, [storeNotifications, hasLiveData]);

  // Demo cycling state (seed-mode only)
  const [demoNotifications, setDemoNotifications] = useState<WorldNotification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Use seed data as fallback when no live data is available
  const notifications = hasLiveData ? liveNotifications : SEED_NOTIFICATIONS;

  // Demo: cycle a new notification every 12s when panel is open (seed mode only)
  useEffect(() => {
    if (!notificationPanelOpen || hasLiveData) return;
    const timer = setInterval(() => {
      demoCounterRef.current += 1;
      setDemoNotifications((prev) => {
        const source = SEED_NOTIFICATIONS;
        const idx = Math.floor(Math.random() * source.length);
        const base = source[idx];
        // Use a monotonic counter for guaranteed unique keys
        const newNotification: WorldNotification = {
          ...base,
          id: `demo-${base.id}-${demoCounterRef.current}`,
          timestamp: Date.now(),
        };
        // Deduplicate by id using Map
        const map = new Map<string, WorldNotification>();
        map.set(newNotification.id, newNotification);
        for (const n of prev) {
          if (!map.has(n.id)) map.set(n.id, n);
        }
        return Array.from(map.values()).slice(0, 20);
      });
    }, 12000);
    return () => clearInterval(timer);
  }, [notificationPanelOpen, hasLiveData]);

  if (!notificationPanelOpen) return null;

  const allNotifications = hasLiveData ? notifications : [...demoNotifications, ...SEED_NOTIFICATIONS];
  // Deduplicate final list by id
  const dedupedMap = new Map<string, WorldNotification>();
  for (const n of allNotifications) {
    if (!dedupedMap.has(n.id)) dedupedMap.set(n.id, n);
  }
  const visible = Array.from(dedupedMap.values())
    .filter((n) => !dismissed.has(n.id))
    .slice(0, 6);

  return (
    <div className="absolute top-14 right-3 z-30 w-[280px] flex flex-col gap-2">
      {visible.map((n, i) => {
        const cfg = typeConfig[n.type] ?? defaultTypeConfig;
        const Icon = cfg.icon;
        return (
          <div
            key={n.id}
            className="glass-card rounded-xl p-3 animate-fade-in-up"
            style={{
              animationDelay: `${i * 60}ms`,
              borderLeft: `2px solid ${cfg.color}40`,
            }}
          >
            <div className="flex items-start gap-2.5">
              <div
                className="flex items-center justify-center h-6 w-6 rounded-lg flex-shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon size={12} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-white truncate">
                    {n.title}
                  </span>
                  <button
                    onClick={() => setDismissed((s) => new Set(s).add(n.id))}
                    className="flex-shrink-0 text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.5)] transition-colors cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
                <p className="text-[10px] text-[rgba(255,255,255,0.4)] leading-snug mt-0.5">
                  {n.message}
                </p>
                <span className="text-[9px] text-[rgba(255,255,255,0.2)] mt-1 block">
                  {timeAgo(n.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
