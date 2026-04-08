"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Send, Inbox, Bot } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  time: string;
}

interface Conversation {
  agentId: string;
  agentName: string;
  agentRole: string;
  iniciais: string;
  messages: ChatMessage[];
  unread: number;
}

/* ─── Initial conversations — realistic Mr. Lion context ──── */

function now() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    agentId: "leo",
    agentName: "Leo",
    agentRole: "Vendas",
    iniciais: "LE",
    unread: 2,
    messages: [
      { id: "leo-1", role: "agent", text: "Pipeline atualizado: R$ 312K em oportunidades abertas. 8 leads B2B qualificados automaticamente nas ultimas 24h.", time: "09:15" },
      { id: "leo-2", role: "agent", text: "Alerta: Margem negativa detectada no Honey Pingente. CMV R$ 52 + frete R$ 38 > preco R$ 89,90. Recomendo revisao de precificacao urgente.", time: "10:30" },
      { id: "leo-3", role: "agent", text: "Relatorio semanal Semana 13 pronto. Receita R$ 8.200 (-12% vs semana anterior). 2 chargebacks abertos: R$ 1.340 total.", time: "11:45" },
    ],
  },
  {
    agentId: "mia",
    agentName: "Mia",
    agentRole: "Marketing",
    iniciais: "MI",
    unread: 1,
    messages: [
      { id: "mia-1", role: "agent", text: "Campanha 'Verao 2026' otimizada — CPC reduzido 18% (de R$ 0,39 para R$ 0,32). ROAS subiu de 0,3x para 0,5x.", time: "08:45" },
      { id: "mia-2", role: "agent", text: "CTR caiu de 4,59% (Set/25) para 1,64% (Mar/26). Preparei 3 hipoteses: saturacao de audiencia, criativos desatualizados e mudancas no algoritmo Meta.", time: "10:00" },
      { id: "mia-3", role: "agent", text: "3 posts publicados no Instagram @mrlionbebidas. Alcance total: 12.400 contas. Melhor post: unboxing do Honey Completo com 4.800 alcance.", time: "14:20" },
    ],
  },
  {
    agentId: "rex",
    agentName: "Rex",
    agentRole: "Financeiro",
    iniciais: "RE",
    unread: 1,
    messages: [
      { id: "rex-1", role: "agent", text: "DRE Fev/2026 consolidado. Receita bruta R$ 74.081, CMV R$ 33.581, margem bruta 54,7%. Resultado final: prejuizo de R$ 2.329.", time: "09:00" },
      { id: "rex-2", role: "agent", text: "Chargebacks Fev/26: R$ 4.300 (7,9% do faturamento). Identifico 12 transacoes com mesmo padrao de CEP. Revisao manual recomendada.", time: "11:15" },
      { id: "rex-3", role: "agent", text: "Ticket medio caiu de R$ 235 (Fev) para R$ 217 (Mar). Sugiro bundle 'Kit Honey Completo' com desconto 8% para estimular itens por pedido.", time: "14:00" },
    ],
  },
  {
    agentId: "sol",
    agentName: "Sol",
    agentRole: "Suporte",
    iniciais: "SO",
    unread: 0,
    messages: [
      { id: "sol-1", role: "agent", text: "Estoque critico: Honey Garrafa com apenas 47 unidades. Taxa de venda atual esgota em 3 dias. Pedido de reposicao urgente necessario.", time: "08:30" },
      { id: "sol-2", role: "agent", text: "5 reenvios processados hoje. Custo total R$ 127,50. Abertura de disputa iniciada para 3 extravios confirmados pela transportadora.", time: "12:00" },
      { id: "sol-3", role: "agent", text: "Auditoria mensal de estoque concluida. 12 SKUs ativos, 3 com giro lento (> 45 dias sem venda). Relatorio na aba Relatorios.", time: "15:30" },
    ],
  },
  {
    agentId: "iris",
    agentName: "Iris",
    agentRole: "Dados",
    iniciais: "IR",
    unread: 0,
    messages: [
      { id: "iris-1", role: "agent", text: "Dashboard de cohort analysis atualizado. Taxa de retencao 30 dias: 11,1%. LTV medio R$ 243,33, LTV repeat R$ 541,93.", time: "09:30" },
      { id: "iris-2", role: "agent", text: "Cruzamento GA4 + Meta Pixel concluido. 428.287 sessions totais. Conversion rate: 2,38%. Revenue por session: R$ 5,00.", time: "11:00" },
      { id: "iris-3", role: "agent", text: "23 mensagens WhatsApp respondidas automaticamente (09h-11h). 20 resolvidas, 3 escaladas para atendimento humano por reclamacoes.", time: "11:30" },
    ],
  },
];

/* ─── Simulated agent responses ──────────────────────────── */

const AGENT_RESPONSES: Record<string, string[]> = {
  leo: [
    "Entendido. Vou analisar o pipeline e atualizar o forecast. Devo priorizar os leads B2B com maior potencial de conversao?",
    "Acompanhando. O ticket medio B2B esta em R$ 1.240 vs R$ 186 no B2C. Vou preparar uma proposta de bundle especifico para revendedores.",
    "Recebi. Monitorando as metricas de vendas em tempo real. Proximo relatorio automatico sera gerado em 48h.",
    "Precificacao revisada. Com frete medio de R$ 38, o preco minimo viavel para o Honey Pingente seria R$ 109,90 para margem de 18%.",
  ],
  mia: [
    "Otimo, vou ajustar a segmentacao da campanha. Tenho 3 variacoes de criativo prontas para A/B test — inicio em 2h.",
    "Analise concluida. Recomendo pausar Remarketing (ROAS 0,6x) e realocar budget para Vendas (ROAS 6,6x). Economia estimada: R$ 150/dia.",
    "Calendario editorial atualizado. Proximos 5 posts focam em Honey Completo e Capuccino, nossos top 2 em receita.",
    "CPC otimizado. O custo por click da campanha principal caiu para R$ 0,28. Monitorando impacto no ROAS nas proximas 72h.",
  ],
  rex: [
    "DRE atualizado com os novos dados. Margem bruta estabilizou em 54,7%. Ponto de atencao: despesas operacionais cresceram 3% MoM.",
    "Fluxo de caixa projetado para os proximos 30 dias: entrada R$ 68K, saida R$ 71K. Recomendo postergar investimentos nao essenciais.",
    "Chargebacks sob monitoramento. Abri disputa formal para os 4 casos pendentes. Prazo de resposta da operadora: 15 dias uteis.",
    "Analise de margem por produto concluida. Top 3 mais rentaveis: Capuccino Garrafa (55%), Honey Garrafa (52%), Capuccino Completo (50%).",
  ],
  sol: [
    "Pedido de reposicao emitido ao fornecedor. Prazo estimado de entrega: 5 dias uteis. Estoque de seguranca definido em 100 unidades.",
    "Tickets do dia: 12 abertos, 9 resolvidos, 3 em andamento. Tempo medio de resposta: 8 minutos. SLA de 95% mantido.",
    "Logistica otimizada. Identifiquei rota alternativa que reduz frete em 12% para entregas na regiao Sudeste.",
    "Monitoramento ativo. Rastreamento de 18 pedidos em transito. 2 com atraso previsto — clientes ja notificados proativamente.",
  ],
  iris: [
    "Dados cruzados. Sessoes organicas cresceram 8% MoM enquanto pagas cairam 22%. Sugiro reforcar SEO para compensar.",
    "Anomalia detectada: bounce rate subiu de 42% para 58% nas ultimas 48h. Causa provavel: lentidao no carregamento mobile.",
    "Relatorio de cohort pronto. Clientes adquiridos via Instagram tem LTV 34% maior que os de Meta Ads.",
    "Analytics atualizado. Top 3 produtos mais buscados: Honey Garrafa (28%), Capuccino Completo (19%), Honey Completo (17%).",
  ],
};

/* ─── Component ──────────────────────────────────────────── */

export function InboxContent() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [busca, setBusca] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find((c) => c.agentId === activeAgentId) ?? null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConvo?.messages.length, scrollToBottom]);

  function selectConversation(agentId: string) {
    setActiveAgentId(agentId);
    setConversations((prev) =>
      prev.map((c) => (c.agentId === agentId ? { ...c, unread: 0 } : c))
    );
  }

  function sendMessage() {
    const text = inputText.trim();
    if (!text || !activeAgentId || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      time: now(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.agentId === activeAgentId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );
    setInputText("");
    setIsTyping(true);

    // Simulate agent response after delay
    const delay = 1200 + Math.random() * 1500;
    setTimeout(() => {
      const responses = AGENT_RESPONSES[activeAgentId] ?? [];
      const responseText = responses[Math.floor(Math.random() * responses.length)] ?? "Processando sua solicitacao...";

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        text: responseText,
        time: now(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.agentId === activeAgentId
            ? { ...c, messages: [...c.messages, agentMsg] }
            : c
        )
      );
      setIsTyping(false);
    }, delay);
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const filteredConversations = busca
    ? conversations.filter((c) =>
        c.agentName.toLowerCase().includes(busca.toLowerCase()) ||
        c.agentRole.toLowerCase().includes(busca.toLowerCase()) ||
        c.messages.some((m) => m.text.toLowerCase().includes(busca.toLowerCase()))
      )
    : conversations;

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#080808" }}>
      {/* ─── Left panel: Conversation list ─── */}
      <div
        className="flex-shrink-0 flex flex-col border-r w-full sm:w-[280px] md:w-[320px]"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "#080808" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-white">Mensagens</h1>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(1,196,97,0.2)] text-[#01C461]" style={{ lineHeight: 1.2 }}>
                {totalUnread}
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conversas..."
              className="bg-transparent text-xs w-full outline-none placeholder:text-[rgba(255,255,255,0.3)] text-white"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filteredConversations.map((convo) => {
            const lastMsg = convo.messages[convo.messages.length - 1];
            const isActive = convo.agentId === activeAgentId;

            return (
              <button
                key={convo.agentId}
                onClick={() => selectConversation(convo.agentId)}
                className="w-full text-left px-3 py-3 transition-all relative"
                style={{
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  borderLeft: isActive ? "2px solid #01C461" : "2px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)]">
                    {convo.iniciais}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-white">{convo.agentName}</span>
                        <span className="text-[10px] text-[rgba(255,255,255,0.3)]">{convo.agentRole}</span>
                      </div>
                      <span className="text-[10px] flex-shrink-0 text-[rgba(255,255,255,0.3)]">
                        {lastMsg?.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] truncate flex-1 text-[rgba(255,255,255,0.4)]">
                        {lastMsg?.role === "user" ? "Voce: " : ""}{lastMsg?.text}
                      </p>
                      {convo.unread > 0 && (
                        <span className="w-4 h-4 flex-shrink-0 rounded-full bg-[rgba(1,196,97,0.2)] text-[#01C461] text-[9px] font-bold flex items-center justify-center">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Right panel: Chat view ─── */}
      {activeConvo ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="px-6 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)]">
              {activeConvo.iniciais}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{activeConvo.agentName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)]">{activeConvo.agentRole}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "pulseSoft 2s ease-in-out infinite" }} />
                <span className="text-[10px] text-[rgba(255,255,255,0.4)]">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
            {activeConvo.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[rgba(1,196,97,0.12)] text-white border border-[rgba(1,196,97,0.15)]"
                      : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {msg.role === "agent" && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot size={11} className="text-[rgba(255,255,255,0.3)]" />
                      <span className="text-[10px] font-medium text-[rgba(255,255,255,0.35)]">{activeConvo.agentName}</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                  <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Bot size={11} className="text-[rgba(255,255,255,0.3)]" />
                    <span className="text-[10px] text-[rgba(255,255,255,0.35)]">{activeConvo.agentName} digitando</span>
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-3">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={`Mensagem para ${activeConvo.agentName}...`}
                disabled={isTyping}
                className="flex-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none transition-colors focus:border-[rgba(1,196,97,0.3)] disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.12)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Inbox size={26} style={{ color: "rgba(255,255,255,0.3)" }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-white">Selecione uma conversa</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {totalUnread > 0
              ? `${totalUnread} mensagem${totalUnread > 1 ? "ns" : ""} nao lida${totalUnread > 1 ? "s" : ""}`
              : "Seus 5 agentes estao disponiveis para conversa"}
          </p>
        </div>
      )}
    </div>
  );
}
