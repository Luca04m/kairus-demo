"use client";

import { useState } from "react";
import { Send, LayoutGrid, RefreshCw, SlidersHorizontal, Archive, Folder, Circle, Settings } from "lucide-react";
import { Section } from "@/components/ds/Section";

export function SidebarSection() {
  const [activeIdx, setActiveIdx] = useState(4);
  const actions = [{ icon: Send, label: "Novo tópico" }, { icon: LayoutGrid, label: "Habilidades e aplicativos" }, { icon: RefreshCw, label: "Automações" }];
  const topics = [{ icon: Folder, label: "kairus-vault", badge: null }, { icon: Circle, label: "Revisar PRD v2 do Kairus", badge: "4 min" }];

  return (
    <Section id="sidebar" label="Components" heading="Glass Sidebar">
      <div className="flex gap-8 flex-col lg:flex-row">
        <div className="w-full lg:w-72 shrink-0 flex flex-col select-none" style={{ background: "linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%)", borderRight: "1px solid rgba(255,255,255,0.06)", minHeight: "520px", borderRadius: "16px", overflow: "hidden" }} role="navigation" aria-label="Sidebar example">
          <div className="pt-3 pb-1">
            {actions.map((item) => (<button key={item.label} className="w-full flex items-center gap-3 px-4 py-[7px] text-left text-[13px] text-white/55 hover:bg-white/5 hover:text-white/75 transition-colors duration-100"><item.icon size={16} className="shrink-0 text-white/40" /><span>{item.label}</span></button>))}
          </div>
          <div className="flex items-center justify-between px-4 pt-5 pb-1.5">
            <span className="text-[11px] font-medium text-white/50">Tópicos</span>
            <div className="flex items-center gap-1.5">
              <button className="text-white/25 hover:text-white/50 transition-colors p-0.5" aria-label="Filter topics"><SlidersHorizontal size={14} /></button>
              <button className="text-white/25 hover:text-white/50 transition-colors p-0.5" aria-label="Archive"><Archive size={14} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {topics.map((item, i) => {
              const isActive = i === activeIdx - 3;
              return (<button key={item.label} onClick={() => setActiveIdx(i + 3)} className={`w-full flex items-center gap-3 px-4 py-[7px] text-left text-[13px] transition-colors duration-100 ${isActive ? "bg-white/[0.06] text-white/85" : "text-white/55 hover:bg-white/[0.03] hover:text-white/70"}`} aria-current={isActive ? "true" : undefined}><item.icon size={16} className={`shrink-0 ${isActive ? "text-white/50" : "text-white/30"}`} /><span className="truncate flex-1">{item.label}</span>{item.badge && (<span className="text-[11px] text-white/20 shrink-0 tabular-nums">{item.badge}</span>)}</button>);
            })}
          </div>
          <div className="border-t border-white/[0.04] px-4 py-3">
            <button className="flex items-center gap-2.5 text-white/35 hover:text-white/55 transition-colors duration-100 w-full"><Settings size={16} className="shrink-0" /><span className="text-[13px]">Configurações</span></button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div>
            <p className="text-xs text-white/40 mb-2 font-mono">Claude Desktop — Sidebar Pattern</p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">Sidebar com card gradient <code className="text-white/50 font-mono text-xs">linear-gradient(104deg, ...)</code>, Lucide icons 16px stroke 1.5, items 30px height, active state <code className="text-white/50 font-mono text-xs">bg-white/6%</code>. Sem emojis — todos os ícones são Lucide com currentColor.</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-white/40">Specs</p>
            <div className="flex flex-wrap gap-2">
              {["width: 288px","bg: card-gradient 104deg","border-right: white/6%","icon: 16px stroke-1.5","font: 13px Inter","item-py: 7px","active: white/6%","hover: white/3%","text: white/55%","muted: white/30%"].map((spec) => (<span key={spec} className="inline-flex items-center rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-white/50 font-mono">{spec}</span>))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
