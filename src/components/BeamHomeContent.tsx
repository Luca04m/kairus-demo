"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, getToolName } from "ai";
import ReactMarkdown from "react-markdown";
import {
  Paperclip,
  ArrowUp,
  ChevronDown,
  Zap,
  Square,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { AGENT_META, AGENT_IDS } from "@/lib/ai/agent-meta";

const SKILLS = [
  { label: "Analise financeira", prompt: "Gere uma analise financeira do ultimo mes" },
  { label: "Pipeline de vendas", prompt: "Qual o status do pipeline de vendas?" },
  { label: "Campanhas Meta Ads", prompt: "Como otimizar as campanhas de marketing atuais?" },
  { label: "Status do estoque", prompt: "Qual o status atual do estoque?" },
];

export function BeamHomeContent() {
  const router = useRouter();
  const { t } = useI18n();
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState("");
  const [agentId, setAgentId] = useState("orquestrador");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const meta = AGENT_META[agentId] || AGENT_META.orquestrador;

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
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: "#080808" }}>
      {/* Center panel */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-8">
        <div
          className="flex w-full max-w-[600px] flex-col items-center"
          style={{ animation: "fade-in-up 0.5s ease both" }}
        >
          {/* Heading */}
          {messages.length === 0 && (
            <>
              <h1 className="mb-2 text-center text-xl font-semibold text-white tracking-tight">
                {t("chat.greeting")}
              </h1>
              <p className="mb-6 text-center text-sm text-white/35">
                Pergunte, analise metricas ou automatize operacoes.
              </p>
            </>
          )}

          {/* Agent selector — sober pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {AGENT_IDS.map((id) => {
              const m = AGENT_META[id];
              const active = id === agentId;
              return (
                <button
                  key={id}
                  onClick={() => setAgentId(id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border ${
                    active
                      ? "border-white/15 bg-white/8 text-white"
                      : "border-white/6 text-white/35 hover:text-white/60 hover:bg-white/4"
                  }`}
                >
                  {(() => { const Icon = m.icon; return <Icon size={13} className={active ? "text-white/60" : "text-white/25"} />; })()}
                  {m.nome}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          {messages.length > 0 && (
            <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-3 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-white/8 text-white border border-white/8"
                        : "bg-white/[0.03] backdrop-blur border border-white/6 text-white/85"
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
                          <div key={i} className="my-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs">
                            <div className="flex items-center gap-2 text-white/50 mb-1">
                              {part.state === "output-available" ? (
                                <CheckCircle2 size={12} className="text-emerald-400" />
                              ) : part.state === "output-error" ? (
                                <AlertCircle size={12} className="text-red-400" />
                              ) : (
                                <Loader2 size={12} className="animate-spin text-white/40" />
                              )}
                              <span className="font-mono">
                                {getToolName(part)}
                                {part.state !== "output-available" && part.state !== "output-error" && " — executando..."}
                              </span>
                            </div>
                            {part.state === "output-available" && (
                              <details className="mt-1">
                                <summary className="cursor-pointer text-white/30 hover:text-white/50 text-[11px]">
                                  Ver dados retornados
                                </summary>
                                <pre className="mt-1 overflow-x-auto text-[10px] text-white/40 max-h-[200px] overflow-y-auto">
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
          )}

          {/* Chat input box */}
          <div
            className={[
              "w-full rounded-xl border bg-[#080808] transition-all duration-200",
              focused
                ? "border-white/15 shadow-[0_0_0_2px_rgba(255,255,255,0.04)]"
                : "border-white/8",
            ].join(" ")}
          >
            <div className="relative px-4 pt-3 pb-2">
              <textarea
                placeholder={`Pergunte ao ${meta.nome}...`}
                className="w-full resize-none bg-transparent text-sm text-white placeholder-white/25 outline-none min-h-[36px] max-h-[200px]"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center rounded-lg border border-white/8">
                <button
                  onClick={isStreaming ? stop : handleSend}
                  className="flex h-8 items-center gap-1.5 px-3 text-sm text-white hover:bg-white/5 transition-colors rounded-l-[10px]"
                >
                  {isStreaming ? (
                    <>
                      <Square size={12} />
                      Parar
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      Perguntar
                    </>
                  )}
                </button>
                <button
                  disabled
                  className="flex h-8 w-8 items-center justify-center border-l border-white/8 text-white/30 rounded-r-[10px] opacity-50 cursor-not-allowed"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  disabled
                  title="Upload em breve"
                  aria-label="Anexar arquivo"
                  className="p-2 text-white/30 opacity-50 cursor-not-allowed"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  onClick={isStreaming ? stop : handleSend}
                  aria-label={isStreaming ? "Parar" : "Enviar mensagem"}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors ml-1"
                >
                  {isStreaming ? <Square size={13} /> : <ArrowUp size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick actions — compact */}
          {messages.length === 0 && (
            <div className="mt-6 w-full max-w-[500px] mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill.label}
                    onClick={() => sendMessage({ text: skill.prompt })}
                    className="rounded-full border border-white/8 px-3.5 py-1.5 text-xs text-white/40 hover:border-white/15 hover:text-white/60 hover:bg-white/[0.03] transition-all"
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
