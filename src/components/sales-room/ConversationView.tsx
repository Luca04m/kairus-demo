'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Flame,
  Thermometer,
  Snowflake,
  AlertTriangle,
  Lightbulb,
  Send,
} from 'lucide-react';
import type { SalesRoomAgent, SalesRoomMessage } from './seed';
import { getCloseProbability, getSentiment, isStale, getSuggestedResponse } from './intelligence';

interface ConversationViewProps {
  agent: SalesRoomAgent | null;
}

// ─── Temperature badge ──────────────────────────────────
function TemperatureBadge({ temp }: { temp: 'hot' | 'warm' | 'cold' }) {
  const config = {
    hot: { icon: Flame, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Quente' },
    warm: { icon: Thermometer, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Morno' },
    cold: { icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Frio' },
  }[temp];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${config.color} ${config.bg}`}>
      <Icon size={9} />
      {config.label}
    </span>
  );
}

// ─── Sentiment indicator ────────────────────────────────
function SentimentIndicator({ sentiment }: { sentiment: 'positive' | 'neutral' | 'resistant' }) {
  const config = {
    positive: { label: 'Positivo', color: 'text-green-400' },
    neutral: { label: 'Neutro', color: 'text-[rgba(255,255,255,0.4)]' },
    resistant: { label: 'Resistente', color: 'text-red-400' },
  }[sentiment];

  return <span className={`text-[10px] ${config.color}`}>{config.label}</span>;
}

// ─── Typing indicator ───────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.3)]"
            style={{
              animation: 'pulseSoft 1.2s ease-in-out infinite',
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
      <span className="text-[10px] text-[rgba(255,255,255,0.3)] ml-1">digitando...</span>
    </div>
  );
}

// ─── Time formatter ─────────────────────────────────────
function formatMessageTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// ─── Message bubble ─────────────────────────────────────
function MessageBubble({ message }: { message: SalesRoomMessage }) {
  const isAgent = message.sender === 'agent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[75%] px-3 py-2 rounded-xl text-[12px] leading-relaxed
          ${
            isAgent
              ? 'bg-blue-600/20 text-[rgba(255,255,255,0.85)] border border-blue-500/20 rounded-br-sm'
              : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.06)] rounded-bl-sm'
          }
        `}
      >
        <p>{message.content}</p>
        <span className="block text-[9px] text-[rgba(255,255,255,0.25)] mt-1 tabular-nums text-right">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main component ─────────────────────────────────────
export function ConversationView({ agent }: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agent?.messages.length]);

  if (!agent) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[11px] text-[rgba(255,255,255,0.25)]">
          Selecione um agente para ver a conversa
        </p>
      </div>
    );
  }

  if (!agent.lead) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[11px] text-[rgba(255,255,255,0.25)]">
          {agent.name} nao possui lead ativo
        </p>
      </div>
    );
  }

  const { lead, messages } = agent;
  const sentiment = getSentiment(messages);
  const closeProbability = getCloseProbability({
    temperature: lead.temperature,
    messageCount: messages.length,
    cartValue: lead.cartValue,
    sentiment,
  });
  const stale = isStale(agent.lastMessageTime);
  const lastLeadMessage = [...messages].reverse().find((m) => m.sender === 'lead')?.content;
  const suggestion = getSuggestedResponse(lastLeadMessage);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[rgba(255,255,255,0.85)]">
              {lead.name}
            </span>
            <TemperatureBadge temp={lead.temperature} />
          </div>
          <div className="flex items-center gap-2">
            <Phone size={11} className="text-[rgba(255,255,255,0.3)]" />
            <span className="text-[10px] text-[rgba(255,255,255,0.35)] tabular-nums">
              {lead.phone}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-[rgba(255,255,255,0.25)] mt-0.5 block">
          Origem: {lead.source}
        </span>
      </div>

      {/* Intelligence bar */}
      <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
            Prob.
          </span>
          <span className="text-[11px] font-semibold text-white tabular-nums">
            {closeProbability}%
          </span>
          {/* Mini progress bar */}
          <div className="w-12 h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${closeProbability}%`,
                backgroundColor:
                  closeProbability > 60
                    ? '#4ade80'
                    : closeProbability > 30
                      ? '#fbbf24'
                      : '#f87171',
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
            Sent.
          </span>
          <SentimentIndicator sentiment={sentiment} />
        </div>

        {lead.cartValue > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
              Carrinho
            </span>
            <span className="text-[11px] text-[#D1FF00] tabular-nums font-medium">
              R${lead.cartValue.toLocaleString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {/* Stale alert */}
      {stale && (
        <div className="mx-4 mt-2 px-3 py-1.5 rounded-md bg-amber-400/8 border border-amber-400/15 flex items-center gap-2">
          <AlertTriangle size={11} className="text-amber-400 flex-shrink-0" />
          <span className="text-[10px] text-amber-400">
            Sem resposta ha mais de 5 min — considere follow-up
          </span>
        </div>
      )}

      {/* Suggested response */}
      {suggestion && (
        <div className="mx-4 mt-2 px-3 py-1.5 rounded-md bg-blue-500/8 border border-blue-500/15 flex items-center gap-2">
          <Lightbulb size={11} className="text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] text-blue-400 uppercase tracking-wider font-medium">
              {suggestion.label}
            </span>
            <p className="text-[10px] text-[rgba(255,255,255,0.5)] mt-0.5 truncate">
              {suggestion.text}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        {agent.isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="
              flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)]
              rounded-lg px-3 py-2 text-[12px] text-[rgba(255,255,255,0.7)]
              placeholder:text-[rgba(255,255,255,0.2)]
              focus:outline-none focus:border-[rgba(255,255,255,0.15)]
              transition-colors duration-100
            "
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                setInputValue('');
              }
            }}
          />
          <button
            type="button"
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              bg-blue-600/20 border border-blue-500/20
              text-blue-400 hover:bg-blue-600/30
              transition-colors duration-100 cursor-pointer
            "
            onClick={() => {
              if (inputValue.trim()) setInputValue('');
            }}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
