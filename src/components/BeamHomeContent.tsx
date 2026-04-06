"use client";
import Image from "next/image";
import { useState } from "react";
import { Plus, Paperclip, Link2, LayoutGrid, ArrowUp, ChevronDown, Zap } from "lucide-react";

const SKILLS = [
  "estrategia-de-produto",
  "analise-financeira",
  "otimizacao-marketing",
  "gestao-estoque",
  "atendimento-cliente",
];

const AGENTS = [
  "Criar agente de monitoramento de estoque",
  "Criar agente de otimização de Meta Ads",
  "Criar agente de atendimento WhatsApp",
];

export function BeamHomeContent() {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%), #080808",
      }}
    >
      {/* Animated gradient fallback — shown when video fails or doesn't exist */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 40% at 80% 60%, rgba(168,85,247,0.07) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 20% 70%, rgba(34,211,238,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Subtle dot-grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Background video — if the file exists it will play; if not, the gradient above shows */}
      <div className="pointer-events-none absolute left-1/2 top-[100px] z-[1] w-[90%] -translate-x-1/2 opacity-30">
        <video autoPlay muted loop playsInline className="w-full">
          <source src="/videos/bg-beam-ai.webm" type="video/webm" />
        </video>
      </div>

      {/* "+ New agent" button — absolute top-right */}
      <div className="absolute right-4 top-4 z-50">
        <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors">
          <Plus size={16} />
          Novo agente
        </button>
      </div>

      {/* Center panel */}
      <div className="relative z-40 flex flex-1 flex-col items-center justify-center px-4 sm:px-8">
        {/* fade-in-up entrance animation wrapper */}
        <div
          className="flex w-full max-w-[680px] flex-col items-center"
          style={{ animation: "fade-in-up 0.5s ease both" }}
        >
          {/* Heading with gradient-text */}
          <h3 className="gradient-text mb-2 text-center text-2xl font-bold tracking-tight">
            Como posso te ajudar hoje?
          </h3>

          {/* Subtitle */}
          <p className="mb-6 text-center text-sm text-[rgba(255,255,255,0.4)]">
            Pergunte, construa agentes ou automatize operações do seu negócio.
          </p>

          {/* Chat input box */}
          <div
            className={[
              "w-full rounded-xl border bg-[#080808] transition-all duration-300",
              focused
                ? "border-[rgba(255,255,255,0.22)] shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                : "border-[rgba(255,255,255,0.08)]",
            ].join(" ")}
          >
            <div className="relative px-4 pt-3 pb-2">
              <textarea
                placeholder="Pergunte, construa ou automatize..."
                className="w-full resize-none bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none min-h-[36px] max-h-[200px]"
                rows={1}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2">
              {/* Left: Perguntar button + chevron */}
              <div className="flex items-center rounded-lg border border-[rgba(255,255,255,0.1)]">
                <button className="flex h-8 items-center gap-1.5 px-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors rounded-l-[10px]">
                  <Zap size={14} />
                  Perguntar
                </button>
                <button className="flex h-8 w-8 items-center justify-center border-l border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.05)] transition-colors rounded-r-[10px]">
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Right: icon buttons + send */}
              <div className="flex items-center gap-0.5">
                <button className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                  <Paperclip size={18} />
                </button>
                <button className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                  <Link2 size={18} />
                </button>
                <button className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                  <LayoutGrid size={18} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.2)] transition-colors ml-1">
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard shortcut hint */}
          <p className="mt-2 text-xs text-[rgba(255,255,255,0.5)]" suppressHydrationWarning>
            {typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"} + K para atalhos
          </p>

          {/* Skills row */}
          <div className="mt-5 flex w-full items-center gap-2.5">
            <span className="shrink-0 text-sm text-[rgba(255,255,255,0.4)]">
              Habilidades:
            </span>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-transparent px-4 py-2 text-sm text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)] transition-all whitespace-nowrap"
                >
                  <LayoutGrid size={15} className="text-[rgba(255,255,255,0.4)]" />
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Agents row */}
          <div className="mt-3 flex w-full items-center gap-2.5">
            <span className="shrink-0 text-sm text-[rgba(255,255,255,0.4)]">
              Agentes:
            </span>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
              {AGENTS.map((agent) => (
                <button
                  key={agent}
                  className="flex items-center gap-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-transparent px-4 py-2 text-sm text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)] transition-all whitespace-nowrap"
                >
                  <Image
                    src="/images/sphere.webp"
                    alt=""
                    width={20}
                    height={20}
                    className="rounded-md"
                  />
                  {agent}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
