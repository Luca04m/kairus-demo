"use client";
import { History, LogOut, Network, PanelLeft, Search, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "@/providers/AuthProvider";

/** Maps route prefixes to display titles for the header. */
const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/world": "World",
  "/equipe": "Minha Equipe",
  "/sales-room": "Sales Room",
  "/roadmap": "Roadmap",
  "/tasks": "Tarefas",
  "/marketing": "Marketing",
  "/financeiro": "Financeiro",
  "/roi": "ROI / Impacto",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
  "/integrations": "Integrações",
  "/inbox": "Caixa de entrada",
  "/agent-templates": "Modelos de agente",
  "/views": "Visualizações",
  "/settings": "Perfil",
};

interface AppHeaderProps {
  title?: string;
  parent?: string;
  badge?: string;
}

export function AppHeader({ title, parent, badge }: AppHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const { user, signOut } = useAuth();

  const displayTitle = title ?? "Início";

  return (
    <header
      className="
        relative flex max-h-16 min-h-14 items-center gap-4 pl-4
        border-b border-[rgba(255,255,255,0.08)]
        backdrop-blur-md bg-[rgba(255,255,255,0.02)]
        after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px
        after:bg-gradient-to-r after:from-transparent after:via-[rgba(255,255,255,0.15)] after:to-transparent
      "
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Mobile hamburger — visible only on mobile, wires to sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="
            flex-shrink-0 rounded-md p-1
            text-[rgba(255,255,255,0.4)]
            transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white
            md:hidden
          "
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={20} />
        </button>

        {/* Desktop PanelLeft — decorative, always visible on desktop */}
        <button
          className="
            hidden flex-shrink-0 rounded-md p-1
            text-[rgba(255,255,255,0.4)]
            transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white
            md:flex
          "
        >
          <PanelLeft size={20} />
        </button>

        {parent ? (
          <div className="flex min-w-0 items-center gap-2">
            <button className="flex-shrink-0 rounded-md p-1 text-[rgba(255,255,255,0.4)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white">
              <History size={20} />
            </button>
            <span className="hidden truncate text-sm text-[rgba(255,255,255,0.4)] sm:block">{parent}</span>
            <ChevronRight size={14} className="hidden flex-shrink-0 text-[rgba(255,255,255,0.4)] sm:block" />
            <span className="truncate text-sm font-medium text-white">{displayTitle}</span>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <button className="flex-shrink-0 rounded-md p-1 text-[rgba(255,255,255,0.4)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white">
              <Network size={20} />
            </button>
            <button className="flex-shrink-0 rounded-md p-1 text-[rgba(255,255,255,0.4)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white">
              <History size={20} />
            </button>
            <span className="truncate text-sm font-medium text-white">{displayTitle}</span>
          </div>
        )}
      </div>

      <div className="ml-auto flex flex-shrink-0 items-center gap-2 pr-4">
        {badge && (
          <span className="hidden text-xs text-[rgba(255,255,255,0.4)] sm:block">{badge}</span>
        )}
        <button className="rounded-md p-1.5 text-[rgba(255,255,255,0.4)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white">
          <Search size={20} />
        </button>
        {user && (
          <button
            onClick={signOut}
            className="rounded-md p-1.5 text-[rgba(255,255,255,0.4)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}

/** Utility: resolve a pathname to a display title using the ROUTE_TITLES map. */
export function getRouteTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  // Prefix match (e.g. /agent/xxx/tasks)
  for (const [prefix, label] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(prefix)) return label;
  }
  return "Início";
}
