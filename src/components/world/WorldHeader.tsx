"use client";

import { Bell, Users, MapPin } from "lucide-react";
import { ROOMS } from "@/data/world-layout";
import { AGENTES } from "@/data/mrlion";
import { useWorldStore } from "@/stores/worldStore";
import { useWorldUiStore } from "@/stores/worldUiStore";

export function WorldHeader() {
  const { notificationPanelOpen, toggleNotificationPanel } = useWorldUiStore();
  const presences = useWorldStore((s) => s.presences);
  const storeRooms = useWorldStore((s) => s.rooms);
  const notifications = useWorldStore((s) => s.notifications);

  // Use live presence data when available, fallback to seed data
  const activeAgents = presences.length > 0
    ? presences.filter((p) => p.status === "ativo").length
    : AGENTES.filter((a) => a.status === "ativo").length;

  const roomCount = storeRooms.length > 0 ? storeRooms.length : ROOMS.length;
  const unreadCount = notifications.filter((n) => !n.read_at).length || 3;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.4)]">
            <MapPin size={12} />
            <span>{roomCount} salas</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.4)]">
            <Users size={12} />
            <span>{activeAgents} agentes online</span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-green-400"
              style={{ animation: "pulseSoft 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Notificações"
          onClick={() => toggleNotificationPanel()}
          className={`
            relative flex items-center justify-center h-8 w-8 rounded-lg
            transition-all duration-150 cursor-pointer
            ${notificationPanelOpen
              ? "bg-[rgba(255,255,255,0.1)] text-white"
              : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
            }
          `}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500/90 text-[8px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
