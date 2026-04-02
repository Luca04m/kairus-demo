"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlignJustify, BarChart2, ChevronDown, ChevronRight, ChevronsUpDown,
  DollarSign, FileText, Inbox, LayoutDashboard, LayoutGrid, Link2,
  ListTodo, Megaphone, MessageCircle, MessageSquare, Settings, Target,
  Users, Workflow,
} from "lucide-react";

const AGENT_ID = "demo-agent";

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
  return (
    <div className="flex h-full flex-col">
      {/* Top — User avatar */}
      <div className="pl-7 pt-5">
        <div className="flex items-center gap-2">
          <Image src="/images/sphere.webp" alt="Account avatar" width={16} height={16} className="rounded-full" />
          <button className="flex items-center gap-1 text-sm text-white transition-opacity hover:opacity-80">
            <span>Carlos</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Beam section */}
      <div className="flex flex-col gap-1 px-3 py-2">
        {navItem("/", <><Image src="/images/sphere.webp" alt="" width={16} height={16} className="rounded-full" />Kairus AI</>)}
        {navItem("/inbox", <><Inbox size={16} />Caixa de entrada</>)}
        {navItem("/tasks", <><ListTodo size={16} />Tarefas</>)}
        {navItem("/agent-templates", <><LayoutGrid size={16} />Modelos de agente</>)}
        {navItem("/integrations", <><Link2 size={16} />Integrações</>)}
        {navItem("/views", <><AlignJustify size={16} />Visualizações</>)}
      </div>

      <div className="mx-3 my-2 border-t border-[rgba(255,255,255,0.08)]" />

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

      {/* Gradient fade separator before settings */}
      <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.12)] to-transparent" />

      {/* Mr. Lion section */}
      <div className="px-3">
        <p className="px-3 py-1 text-xs font-medium text-[rgba(255,255,255,0.4)]">Mr. Lion</p>
        <div className="flex flex-col gap-1">
          {navItem("/dashboard", <><LayoutDashboard size={16} />Dashboard</>, 3)}
          {navItem("/equipe", <><Users size={16} />Minha Equipe</>)}
          {navItem("/financeiro", <><DollarSign size={16} />Financeiro</>)}
          {navItem("/marketing", <><Megaphone size={16} />Marketing</>)}
          {navItem("/relatorios", <><FileText size={16} />Relatórios</>)}
          {navItem("/roi", <><Target size={16} />ROI / Impacto</>)}
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

      {/* Bottom — Settings + Profile */}
      <div className="flex flex-col gap-1 border-t border-[rgba(255,255,255,0.08)] px-3 py-2">
        {navItem("/configuracoes", <><Settings size={16} />Configurações</>)}
        <a
          href="#"
          className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm text-[rgba(255,255,255,0.4)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
        >
          <MessageCircle size={16} />
          Chat e suporte
        </a>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-[10px] px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)]"
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[10px] font-bold text-white">
            CM
          </span>
          <span className="flex-1 text-left">Carlos Moreno</span>
          <ChevronsUpDown size={14} color="rgba(255,255,255,0.4)" />
        </Link>
      </div>
    </div>
  );
}
