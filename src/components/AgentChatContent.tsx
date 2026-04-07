"use client";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Paperclip, Settings2, ArrowUp, ChevronDown, Zap, MessageSquare, Play } from "lucide-react";

export function AgentChatContent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'perguntar'|'executar'>('perguntar');

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setMessage("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: `Entendido! Estou analisando sua solicitação sobre '${trimmed}'. Em breve terei uma resposta completa para você.` },
      ]);
      setIsTyping(false);
    }, 1500);
  }, [message]);

  return (
    <div
      className="flex h-full flex-col items-center justify-center px-8 relative"
      style={{ background: "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%)" }}
    >
      <div className="animate-fade-in-up w-full max-w-[620px] flex flex-col items-center gap-6">
        {/* Avatar + headline */}
        {messages.length === 0 && (
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
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="w-full max-h-[300px] overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[rgba(99,102,241,0.2)] text-white'
                    : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.8)]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-sm text-[rgba(255,255,255,0.5)]">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{animationDelay: '0ms'}}>●</span>
                    <span className="animate-bounce" style={{animationDelay: '150ms'}}>●</span>
                    <span className="animate-bounce" style={{animationDelay: '300ms'}}>●</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode selector hint */}
        <div className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-1">
          <button
            onClick={() => setMode('perguntar')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === 'perguntar'
                ? 'bg-[rgba(255,255,255,0.10)] text-white'
                : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
            }`}
          >
            <MessageSquare size={12} />
            Perguntar
          </button>
          <button
            onClick={() => setMode('executar')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === 'executar'
                ? 'bg-[rgba(255,255,255,0.10)] text-white'
                : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
            }`}
          >
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-[rgba(255,255,255,0.06)]">
            {/* Perguntar / mode selector inside input */}
            <div className="flex items-center rounded-lg border border-[rgba(255,255,255,0.1)]">
              <button onClick={handleSend} className="flex h-8 items-center gap-1.5 px-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] rounded-l-[10px] transition-colors">
                <Zap size={14} />
                Perguntar
              </button>
              <button disabled title="Selecionar modelo em breve" className="flex h-8 w-8 items-center justify-center border-l border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.05)] rounded-r-[10px] transition-colors opacity-50 cursor-not-allowed">
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <button disabled title="Anexar arquivo em breve" aria-label="Anexar arquivo" className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors opacity-50 cursor-not-allowed">
                <Paperclip size={16} />
              </button>
              <button disabled title="Configurações em breve" aria-label="Configurações do agente" className="p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors opacity-50 cursor-not-allowed">
                <Settings2 size={16} />
              </button>
              <button onClick={handleSend} aria-label="Enviar mensagem" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.22)] ml-1 transition-colors">
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
              onClick={() => setMessage(label)}
              className="rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.02)] px-4 py-1.5 text-xs text-[rgba(255,255,255,0.55)] hover:border-[rgba(255,255,255,0.18)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
