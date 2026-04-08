"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  BarChart2, Bot, ChevronDown, ChevronRight, ChevronsUpDown,
  DollarSign, Globe, Headphones, Inbox, LayoutDashboard,
  Link2, ListTodo, LogOut, Map, Megaphone, MessageCircle, MessageSquare,
  Settings, Users, Workflow, User,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { DEMO_USER } from "@/lib/constants";
import { AGENT_META, AGENT_IDS } from "@/lib/ai/agent-meta";

const AGENT_ALIAS: Record<string, string> = {
  "demo-agent": "ecommerce",
  leo: "ecommerce",
  rex: "financeiro",
  mia: "orquestrador",
  sol: "estoque",
  iris: "orquestrador",
  kairus: "orquestrador",
};

const UNREAD_COUNT = 2;

interface AppSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ mobileOpen = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const isAgentRoute = pathname.startsWith("/agent/");

  const navItem = (href: string, children: React.ReactNode, badge?: number) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`
          relative flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm
          transition-all duration-150
          ${active
            ? "bg-[rgba(255,255,255,0.08)] text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.5 before:rounded-r-full before:bg-[rgba(255,255,255,0.6)]"
            : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
          }
        `}
      >
        {children}
        {badge != null && badge > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-medium text-red-400">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const subItem = (href: string, children: React.ReactNode) => {
    const active = pathname === href || (!href.match(/^\/agent\/[^/]+$/) && pathname.startsWith(href));
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`
          relative flex items-center gap-2 rounded-[10px] px-3 py-1.5 text-sm
          transition-all duration-150
          ${active
            ? "bg-[rgba(255,255,255,0.08)] text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-0.5 before:rounded-r-full before:bg-[rgba(255,255,255,0.5)]"
            : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
          }
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden h-full overflow-y-auto md:block">
        <SidebarContent
          pathname={pathname}
          isAgentRoute={isAgentRoute}
          navItem={navItem}
          subItem={subItem}
          onClose={onClose}
        />
      </div>

      {/* Mobile sidebar — slides in from left */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-[270px] overflow-y-auto
          bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.08)]
          transition-transform duration-300 ease-in-out
          md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent
          pathname={pathname}
          isAgentRoute={isAgentRoute}
          navItem={navItem}
          subItem={subItem}
          onClose={onClose}
        />
      </div>
    </>
  );
}

interface SidebarContentProps {
  pathname: string;
  isAgentRoute: boolean;
  navItem: (href: string, children: React.ReactNode, badge?: number) => React.ReactNode;
  subItem: (href: string, children: React.ReactNode) => React.ReactNode;
  onClose?: () => void;
}

function SidebarContent({ pathname, isAgentRoute, navItem, subItem, onClose }: SidebarContentProps) {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? DEMO_USER.name;
  const initials = displayName
    .split(" ")
    .filter((w: string) => w.length > 0)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("") || DEMO_USER.initials;

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const sectionHeader = (label: string) => (
    <p className="px-3 py-1 text-xs font-medium text-[rgba(255,255,255,0.4)]">{label}</p>
  );

  return (
    <div className="flex h-full flex-col" role="navigation">
      {/* Top — User dropdown */}
      <div className="pl-7 pt-5 relative" ref={userMenuRef}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-1 text-sm text-white transition-opacity hover:opacity-80"
          >
            <span>{displayName}</span>
            <ChevronDown size={14} className={`transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Dropdown menu */}
        {userMenuOpen && (
          <div className="absolute left-5 top-full mt-1 z-50 w-48 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#141414] shadow-xl">
            <Link
              href="/settings"
              onClick={() => { setUserMenuOpen(false); onClose?.(); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white rounded-t-lg transition-colors"
            >
              <User size={14} />
              Minha conta
            </Link>
            <button
              onClick={() => { setUserMenuOpen(false); signOut(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)] hover:text-red-400 rounded-b-lg transition-colors"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Kairus AI + Caixa de entrada */}
      <nav aria-label="Navegação principal">
      <div className="flex flex-col gap-1 px-3 py-2">
        {navItem("/", <><Image src="/images/sphere.webp" alt="" width={16} height={16} className="rounded-full" />Kairus AI</>)}
        {navItem("/inbox", <><Inbox size={16} />Caixa de entrada</>, UNREAD_COUNT)}
      </div>

      {/* Agent section */}
      <AgentList
        pathname={pathname}
        isAgentRoute={isAgentRoute}
        subItem={subItem}
        onClose={onClose}
      />

      {/* Gradient fade separator */}
      <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.12)] to-transparent" />

      {/* Principal section */}
      <div className="px-3">
        {sectionHeader("Principal")}
        <div className="flex flex-col gap-1">
          {navItem("/dashboard", <><LayoutDashboard size={16} />Dashboard</>)}
          {navItem("/financeiro", <><DollarSign size={16} />Financeiro</>)}
          {navItem("/marketing", <><Megaphone size={16} />Marketing</>)}
        </div>
      </div>

      {/* IA section */}
      <div className="px-3 mt-2">
        {sectionHeader("IA")}
        <div className="flex flex-col gap-1">
          {navItem("/equipe", <><Users size={16} />Visão Geral</>)}
          {navItem("/sales-room", <><Headphones size={16} />Vendas</>)}
          {navItem("/world", <><Globe size={16} />World</>)}
          {navItem("/tasks", <><ListTodo size={16} />Tarefas</>)}
        </div>
      </div>

      {/* Sistema section */}
      <div className="px-3 mt-2">
        {sectionHeader("Sistema")}
        <div className="flex flex-col gap-1">
          {navItem("/roadmap", <><Map size={16} />Roadmap Kairus</>)}
          {navItem("/integrations", <><Link2 size={16} />Integrações</>)}
          {navItem("/configuracoes", <><Settings size={16} />Configurações</>)}
        </div>
      </div>
      </nav>

      <div className="flex-1" />

      {/* Gradient fade before bottom section */}
      <div
        className="pointer-events-none h-8 w-full"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))",
        }}
      />

      {/* Bottom — Support + Profile */}
      <div className="flex flex-col gap-1 border-t border-[rgba(255,255,255,0.08)] px-3 py-2">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm text-[rgba(255,255,255,0.4)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
        >
          <MessageCircle size={16} />
          Chat e suporte
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-[10px] px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)]"
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[10px] font-bold text-white">
            {initials || DEMO_USER.initials}
          </span>
          <span className="flex-1 text-left">{displayName}</span>
          <ChevronsUpDown size={14} color="rgba(255,255,255,0.4)" />
        </Link>
      </div>
    </div>
  );
}

/* ── Dynamic agent list ─────────────────────────────────────────────── */

interface AgentListProps {
  pathname: string;
  isAgentRoute: boolean;
  subItem: (href: string, children: React.ReactNode) => React.ReactNode;
  onClose?: () => void;
}

function AgentList({ pathname, isAgentRoute, subItem, onClose }: AgentListProps) {
  const [agentsOpen, setAgentsOpen] = useState(true);

  const activeAgentId = pathname.match(/^\/agent\/([^/]+)/)?.[1] || null;
  const resolvedAgentId = activeAgentId
    ? AGENT_ALIAS[activeAgentId] || activeAgentId
    : null;

  return (
    <div className="px-3">
      <button
        onClick={() => setAgentsOpen(!agentsOpen)}
        className="flex w-full items-center justify-between px-3 py-1"
      >
        <p className="text-xs font-medium text-[rgba(255,255,255,0.4)]">Seus agentes</p>
        {agentsOpen
          ? <ChevronDown size={12} className="text-[rgba(255,255,255,0.4)]" />
          : <ChevronRight size={12} className="text-[rgba(255,255,255,0.4)]" />
        }
      </button>

      {agentsOpen && (
        <div className="flex flex-col gap-0.5">
          {AGENT_IDS.map((id) => {
            const meta = AGENT_META[id];
            const Icon = meta.icon;
            const isActive = resolvedAgentId === id;

            return (
              <Link
                key={id}
                href={`/agent/${id}`}
                onClick={onClose}
                className={`
                  flex cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2
                  transition-all duration-150
                  ${isActive
                    ? "bg-[rgba(255,255,255,0.08)] text-white"
                    : "text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.7)]"
                  }
                `}
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                  <Icon size={12} className="text-[rgba(255,255,255,0.4)]" />
                </span>
                <span className="flex-1 truncate text-sm">
                  {meta.nome}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
