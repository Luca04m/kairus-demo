"use client";
import Image from "next/image";
import { Paperclip, Settings2, ArrowUp, ChevronDown, Zap, MessageSquare, Play } from "lucide-react";

export function AgentChatContent() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center px-8 relative"
      style={{ background: "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%)" }}
    >
      <div className="animate-fade-in-up w-full max-w-[620px] flex flex-col items-center gap-6">
        {/* Avatar + headline */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="animate-pulse-soft rounded-full p-[3px] bg-gradient-to-br from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.03)]">
            <Image
              src="/images/sphere.webp"
              alt="Agent avatar"
              width={64}
              height={64}
              className="rounded-full block"
            />
          </div>
          <h2 className="text-lg font-medium text-white mb-1">Como posso te ajudar hoje?</h2>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">Pergunte qualquer coisa ou mude para o modo de execução para realizar tarefas</p>
        </div>

        {/* Mode selector hint */}
        <div className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-1">
          <button className="flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.10)] px-4 py-1.5 text-xs font-medium text-white transition-colors">
            <MessageSquare size={12} />
            Perguntar
          </button>
          <button className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <Play size={12} />
            Executar
          </button>
        </div>

        {/* Input — glass-card */}
        <div
          className="w-full rounded-2xl border border-[rgba(255,255,255,0.10)] backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="px-4 pt-3 pb-2">
            <textarea
              placeholder="Pergunte, construa ou automatize..."
              className="w-full resize-none bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none min-h-[36px] max-h-[200px]"
              rows={1}
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-[rgba(255,255,255,0.06)]">
            {/* Perguntar / mode selector inside input */}
            <div className="flex items-center rounded-lg border border-[rgba(255,255,255,0.1)]">
              <button className="flex h-8 items-center gap-1.5 px-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] rounded-l-[10px] transition-colors">
                <Zap size={14} />
                Perguntar
              </button>
              <button className="flex h-8 w-8 items-center justify-center border-l border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.05)] rounded-r-[10px] transition-colors">
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                <Paperclip size={16} />
              </button>
              <button className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                <Settings2 size={16} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.22)] ml-1 transition-colors">
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Qual o status do estoque?",
            "Gere um relatório de vendas",
            "Otimize a campanha atual",
          ].map((label) => (
            <button
              key={label}
              className="rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-4 py-1.5 text-xs text-[rgba(255,255,255,0.55)] hover:border-[rgba(255,255,255,0.18)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
