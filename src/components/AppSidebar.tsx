"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  BarChart2, Bot, ChevronDown, ChevronRight, ChevronsUpDown,
  DollarSign, Globe, Headphones, Inbox, LayoutDashboard,
  Link2, ListTodo, LogOut, Map, Megaphone, MessageCircle, MessageSquare,
  Settings, ShoppingBag, Users, Workflow, User,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { DEMO_USER } from "@/lib/constants";

const AGENT_ID = "demo-agent";
const UNREAD_COUNT = 3;

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
    const active = pathname === href || (href !== `/agent/${AGENT_ID}` && pathname.startsWith(href));
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

function SidebarContent({ isAgentRoute, navItem, subItem, onClose }: SidebarContentProps) {
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
    <div className="flex h-full flex-col">
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
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[rgba(255,255,255,0.4)] cursor-default"
            >
              <ShoppingBag size={14} />
              Plano
            </button>
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
      <div className="flex flex-col gap-1 px-3 py-2">
        {navItem("/", <><Image src="/images/sphere.webp" alt="" width={16} height={16} className="rounded-full" />Kairus AI</>)}
        {navItem("/inbox", <><Inbox size={16} />Caixa de entrada</>, UNREAD_COUNT)}
      </div>

      {/* Agent section */}
      <div className="px-3">
        <p className="px-3 py-1 text-xs font-medium text-[rgba(255,255,255,0.4)]">Seus agentes</p>
        <Link
          href={`/agent/${AGENT_ID}`}
          onClick={onClose}
          className="
            flex cursor-pointer items-center gap-2 rounded-[10px] px-4 py-2
            bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
            transition-all duration-150
            hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.10)]
          "
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[10px] font-medium text-[rgba(255,255,255,0.5)]">
            UA
          </span>
          <span className="flex-1 text-sm text-white">Agente sem título</span>
          {isAgentRoute
            ? <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
            : <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
          }
        </Link>
        {isAgentRoute && (
          <div className="ml-3 mt-0.5 flex flex-col gap-0.5">
            {subItem(`/agent/${AGENT_ID}`, <><MessageSquare size={13} />Chat</>)}
            {subItem(`/agent/${AGENT_ID}/tasks`, <><ListTodo size={13} />Tarefas</>)}
            {subItem(`/agent/${AGENT_ID}/flow`, <><Workflow size={13} />Fluxo</>)}
            {subItem(`/agent/${AGENT_ID}/settings`, <><Settings size={13} />Configurações</>)}
            {subItem(`/agent/${AGENT_ID}/analytics`, <><BarChart2 size={13} />Análises</>)}
          </div>
        )}
      </div>

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

      {/* IA & Agentes section */}
      <div className="px-3 mt-2">
        {sectionHeader("IA & Agentes")}
        <div className="flex flex-col gap-1">
          {navItem("/equipe", <><Users size={16} />Visão Geral</>)}
          {navItem("/sales-room", <><Headphones size={16} />Vendas</>)}
          {navItem("/world", <><Globe size={16} />World</>)}
          {navItem("/tasks", <><ListTodo size={16} />Tarefas</>)}
          {navItem("/agent-templates", <><Bot size={16} />Meus Agentes</>)}
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
        <button
          className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm text-[rgba(255,255,255,0.4)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
        >
          <MessageCircle size={16} />
          Chat e suporte
        </button>
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
