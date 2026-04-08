"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, getToolName } from "ai";
import ReactMarkdown from "react-markdown";
import {
  Paperclip,
  Settings2,
  ArrowUp,
  ChevronDown,
  Zap,
  Square,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AGENT_META, AGENT_IDS } from "@/lib/ai/agent-meta";

const SUGGESTIONS: Record<string, string[]> = {
  orquestrador: [
    "Qual o status geral do negocio?",
    "Resuma as metricas principais da semana",
    "Quais areas precisam de atencao?",
  ],
  financeiro: [
    "Qual foi o faturamento de fevereiro?",
    "Gere um relatorio financeiro mensal",
    "Qual a margem bruta por categoria?",
  ],
  ecommerce: [
    "Como esta o pipeline de vendas?",
    "Qual o ticket medio atual?",
    "Quais leads B2B estao pendentes?",
  ],
  estoque: [
    "Como esta o estoque?",
    "Quais produtos estao em nivel critico?",
    "Quantos reenvios pendentes?",
  ],
};

export function AgentChatContent({ initialAgent = "financeiro" }: { initialAgent?: string }) {
  const [agentId, setAgentId] = useState(initialAgent);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const meta = AGENT_META[agentId] || AGENT_META.financeiro;

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { agentId },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div
      className="flex h-full flex-col items-center px-8 relative"
      style={{
        background:
          "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%)",
      }}
    >
      <div className="w-full max-w-[680px] flex flex-col h-full py-6">
        {/* Agent selector */}
        <div className="flex items-center gap-2 mb-4">
          {AGENT_IDS.map((id) => {
            const m = AGENT_META[id];
            const active = id === agentId;
            return (
              <button
                key={id}
                onClick={() => setAgentId(id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all border ${
                  active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/8 bg-white/2 text-white/40 hover:text-white hover:bg-white/6"
                }`}
                style={active ? { borderColor: m.cor + "40", backgroundColor: m.cor + "15" } : {}}
              >
                {(() => { const Icon = m.icon; return <Icon size={14} style={{ color: m.cor }} />; })()}
                {m.nome}
              </button>
            );
          })}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="rounded-full p-[3px] bg-gradient-to-br from-white/12 to-white/3">
                <Image
                  src="/images/sphere.webp"
                  alt="Agent avatar"
                  width={64}
                  height={64}
                  className="rounded-full block"
                />
              </div>
              {(() => { const MetaIcon = meta.icon; return <MetaIcon size={24} style={{ color: meta.cor }} />; })()}
              <h2 className="text-lg font-medium text-white mb-1">
                {meta.nome} — {meta.descricao.split("—")[1]?.trim() || "Assistente"}
              </h2>
              <p className="text-sm text-white/40">
                Pergunte qualquer coisa sobre o negócio
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-[rgba(1,196,97,0.2)] text-white"
                    : "bg-zinc-900/80 backdrop-blur border border-zinc-800 text-white/90"
                }`}
              >
                {msg.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div key={i} className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </div>
                    );
                  }
                  if (isToolUIPart(part)) {
                    return (
                      <div
                        key={i}
                        className="my-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2 text-white/60 mb-1">
                          {part.state === "output-available" ? (
                            <CheckCircle2 size={12} className="text-emerald-400" />
                          ) : part.state === "output-error" ? (
                            <AlertCircle size={12} className="text-red-400" />
                          ) : (
                            <Loader2 size={12} className="animate-spin text-[#01C461]" />
                          )}
                          <span className="font-mono">
                            {getToolName(part)}
                            {part.state !== "output-available" && part.state !== "output-error" && " — executando..."}
                          </span>
                        </div>
                        {part.state === "output-available" && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-white/40 hover:text-white/60 text-[11px]">
                              Ver dados retornados
                            </summary>
                            <pre className="mt-1 overflow-x-auto text-[10px] text-white/50 max-h-[200px] overflow-y-auto">
                              {JSON.stringify(part.output, null, 2)}
                            </pre>
                          </details>
                        )}
                        {part.state === "output-error" && (
                          <p className="mt-1 text-red-400 text-[11px]">{part.errorText}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {/* Error */}
          {error && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
                <AlertCircle size={14} />
                <span>Erro ao processar. </span>
                <button onClick={() => regenerate()} className="underline hover:text-red-300">
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {(SUGGESTIONS[agentId] || SUGGESTIONS.financeiro).map((label) => (
              <button
                key={label}
                onClick={() => {
                  setInput("");
                  sendMessage({ text: label });
                }}
                className="rounded-full border border-white/10 bg-white/2 px-4 py-1.5 text-xs text-white/55 hover:border-white/18 hover:text-white hover:bg-white/8 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="w-full rounded-2xl border border-white/10 backdrop-blur-md shrink-0"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="px-4 pt-3 pb-2">
            <textarea
              placeholder={`Pergunte ao ${meta.nome}...`}
              className="w-full resize-none bg-transparent text-sm text-white placeholder-white/30 outline-none min-h-[36px] max-h-[200px]"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/6">
            <div className="flex items-center rounded-lg border border-white/10">
              <button
                onClick={isStreaming ? stop : handleSend}
                className="flex h-8 items-center gap-1.5 px-3 text-sm text-white hover:bg-white/5 rounded-l-[10px] transition-colors"
              >
                {isStreaming ? (
                  <>
                    <Square size={12} />
                    Parar
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Enviar
                  </>
                )}
              </button>
              <button
                disabled
                className="flex h-8 w-8 items-center justify-center border-l border-white/10 text-white/40 rounded-r-[10px] opacity-50 cursor-not-allowed"
              >
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              {error && (
                <button
                  onClick={() => regenerate()}
                  aria-label="Tentar novamente"
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              )}
              <button
                disabled
                title="Anexar arquivo em breve"
                aria-label="Anexar arquivo"
                className="p-2 text-white/50 hover:text-white transition-colors opacity-50 cursor-not-allowed"
              >
                <Paperclip size={16} />
              </button>
              <button
                disabled
                title="Configurações em breve"
                aria-label="Configurações do agente"
                className="p-2 text-white/50 hover:text-white transition-colors opacity-50 cursor-not-allowed"
              >
                <Settings2 size={16} />
              </button>
              <button
                onClick={isStreaming ? stop : handleSend}
                aria-label={isStreaming ? "Parar" : "Enviar mensagem"}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/22 ml-1 transition-colors"
              >
                {isStreaming ? <Square size={13} /> : <ArrowUp size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
