"use client";
import { useState, useMemo } from "react";
import { SlidersHorizontal, MoreHorizontal, Search, Reply, CheckCheck, Archive, Inbox } from "lucide-react";

type Prioridade = "alta" | "media" | "baixa";

interface Mensagem {
  id: number;
  remetente: string;
  iniciais: string;
  cor: string;
  assunto: string;
  resumo: string;
  tempo: string;
  lida: boolean;
  prioridade: Prioridade;
}

const MENSAGENS: Mensagem[] = [
  { id: 1, remetente: "Leo", iniciais: "LE", cor: "#22c55e", assunto: "Alerta: Margem negativa Honey Pingente", resumo: "A margem do produto Honey Pingente ficou negativa em Mar/2026. Recomendo revisar precificação com urgência antes que o impacto se amplie nas próximas semanas.", tempo: "há 2h", lida: false, prioridade: "alta" },
  { id: 2, remetente: "Mia", iniciais: "MI", cor: "#6366f1", assunto: "Relatório semanal de campanhas", resumo: "CTR caiu para 1,64% em Mar/26. CPC subindo. Sugiro revisão de criativos e ajuste de segmentação para recuperar eficiência no canal pago.", tempo: "há 45min", lida: false, prioridade: "alta" },
  { id: 3, remetente: "Sol", iniciais: "SO", cor: "#f59e0b", assunto: "Estoque crítico: Honey Garrafa", resumo: "Estoque abaixo de 50 unidades. Última reposição há 15 dias. Risco de ruptura nas próximas 48h se não houver pedido imediato ao fornecedor.", tempo: "há 3h", lida: true, prioridade: "alta" },
  { id: 4, remetente: "Rex", iniciais: "RE", cor: "#ec4899", assunto: "12 clientes B2B para recompra", resumo: "Identifiquei 12 clientes B2B com ciclo de recompra vencido. Enviei lembretes automáticos via e-mail. Aguardo resposta de 8 deles.", tempo: "há 1h", lida: true, prioridade: "media" },
  { id: 5, remetente: "Iris", iniciais: "IR", cor: "#06b6d4", assunto: "Resumo WhatsApp: 23 atendimentos", resumo: "Respondi 23 mensagens automaticamente hoje. 2 foram escaladas para atendimento humano por solicitação de reembolso e reclamação de produto.", tempo: "há 30min", lida: true, prioridade: "baixa" },
  { id: 6, remetente: "Leo", iniciais: "LE", cor: "#22c55e", assunto: "Relatório mensal Fev/2026 pronto", resumo: "Relatório mensal de fevereiro está disponível. Destaque: prejuízo de R$ -2.329 principalmente por custos logísticos acima do esperado.", tempo: "há 5h", lida: true, prioridade: "media" },
  { id: 7, remetente: "Mia", iniciais: "MI", cor: "#6366f1", assunto: "3 posts Instagram publicados", resumo: "Publiquei 3 posts na conta @mrlionbebidas conforme calendário editorial. Alcance total: 12.400 contas. Melhor post: foto de produto com 4.800 alcance.", tempo: "há 8h", lida: true, prioridade: "baixa" },
  { id: 8, remetente: "Sol", iniciais: "SO", cor: "#f59e0b", assunto: "Logística: 5 reenvios processados", resumo: "Processados 5 reenvios de pedidos com extravios confirmados pela transportadora. Custo total: R$ 127,50. Abertura de disputa iniciada para 3 casos.", tempo: "há 1d", lida: true, prioridade: "baixa" },
];

type Filtro = "todas" | "nao-lidas" | "alta-prioridade";

const PRIORIDADE_DOT: Record<Prioridade, string | null> = {
  alta: "#ef4444",
  media: "#f59e0b",
  baixa: null,
};

export function InboxContent() {
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busca, setBusca] = useState("");
  const [lidas, setLidas] = useState<Set<number>>(
    new Set(MENSAGENS.filter((m) => m.lida).map((m) => m.id))
  );
  const [arquivadas, setArquivadas] = useState<Set<number>>(new Set());

  const mensagensFiltradas = useMemo(() => {
    return MENSAGENS.filter((m) => {
      if (arquivadas.has(m.id)) return false;
      if (filtro === "nao-lidas" && lidas.has(m.id)) return false;
      if (filtro === "alta-prioridade" && m.prioridade !== "alta") return false;
      if (busca) {
        const q = busca.toLowerCase();
        return (
          m.assunto.toLowerCase().includes(q) ||
          m.remetente.toLowerCase().includes(q) ||
          m.resumo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filtro, busca, lidas, arquivadas]);

  const naoLidasCount = MENSAGENS.filter(
    (m) => !lidas.has(m.id) && !arquivadas.has(m.id)
  ).length;

  const mensagemSelecionada = MENSAGENS.find((m) => m.id === selecionadoId) ?? null;

  function marcarLida(id: number) {
    setLidas((prev) => new Set([...prev, id]));
  }

  function toggleLida(id: number) {
    setLidas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function arquivar(id: number) {
    setArquivadas((prev) => new Set([...prev, id]));
    if (selecionadoId === id) setSelecionadoId(null);
  }

  const FILTRO_TABS: { key: Filtro; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "nao-lidas", label: "Não lidas" },
    { key: "alta-prioridade", label: "Alta prioridade" },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div
        className="flex-shrink-0 flex flex-col border-r"
        style={{
          width: 280,
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Caixa de entrada</h2>
            {naoLidasCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "#3b82f6", color: "#fff", lineHeight: 1.2 }}
              >
                {naoLidasCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              className="rounded p-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <SlidersHorizontal size={14} />
            </button>
            <button
              className="rounded p-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Search size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar mensagens..."
              className="bg-transparent text-xs w-full outline-none placeholder:text-[rgba(255,255,255,0.3)] text-white"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 px-3 pb-2 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {FILTRO_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFiltro(tab.key)}
              className="text-[10px] font-medium px-2 py-1 rounded-md transition-all"
              style={
                filtro === tab.key
                  ? { background: "rgba(59,130,246,0.2)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }
                  : { background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {mensagensFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Inbox size={24} style={{ color: "rgba(255,255,255,0.2)" }} strokeWidth={1.5} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                Nenhuma mensagem
              </p>
            </div>
          ) : (
            mensagensFiltradas.map((msg) => {
              const estaLida = lidas.has(msg.id);
              const estaSelecionada = selecionadoId === msg.id;
              const dotColor = PRIORIDADE_DOT[msg.prioridade];

              return (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelecionadoId(msg.id);
                    marcarLida(msg.id);
                  }}
                  className="w-full text-left px-3 py-2.5 transition-all relative"
                  style={{
                    background: estaSelecionada
                      ? "rgba(59,130,246,0.12)"
                      : !estaLida
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                    borderLeft: estaSelecionada
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                      style={{ background: msg.cor }}
                    >
                      {msg.iniciais}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className="text-xs truncate"
                          style={{
                            color: !estaLida ? "#fff" : "rgba(255,255,255,0.7)",
                            fontWeight: !estaLida ? 600 : 500,
                          }}
                        >
                          {msg.remetente}
                        </span>
                        <span
                          className="text-[10px] flex-shrink-0"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {msg.tempo}
                        </span>
                      </div>
                      <p
                        className="text-[11px] truncate mb-0.5"
                        style={{
                          color: !estaLida ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                          fontWeight: !estaLida ? 500 : 400,
                        }}
                      >
                        {msg.assunto}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p
                          className="text-[10px] truncate flex-1"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {msg.resumo}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {dotColor && (
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: dotColor }}
                            />
                          )}
                          {!estaLida && (
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: "#3b82f6" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel */}
      {mensagemSelecionada ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Message header */}
          <div
            className="px-6 py-4 border-b flex items-start justify-between gap-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: mensagemSelecionada.cor }}
              >
                {mensagemSelecionada.iniciais}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white">
                    {mensagemSelecionada.remetente}
                  </span>
                  {(() => {
                    const dotColor = PRIORIDADE_DOT[mensagemSelecionada.prioridade];
                    return dotColor ? (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: mensagemSelecionada.prioridade === "alta" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                          color: dotColor,
                          border: `1px solid ${dotColor}30`,
                        }}
                      >
                        {mensagemSelecionada.prioridade === "alta" ? "Alta prioridade" : "Média prioridade"}
                      </span>
                    ) : null;
                  })()}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Agente Kairus · {mensagemSelecionada.tempo}
                </p>
              </div>
            </div>
          </div>

          {/* Message body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <h3 className="text-base font-semibold text-white mb-4">
              {mensagemSelecionada.assunto}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {mensagemSelecionada.resumo}
            </p>
          </div>

          {/* Action bar */}
          <div
            className="px-6 py-4 border-t flex items-center gap-2"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <button
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(59,130,246,0.15)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.15)";
              }}
            >
              <Reply size={13} />
              Responder
            </button>
            <button
              onClick={() => toggleLida(mensagemSelecionada.id)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
              }}
            >
              <CheckCheck size={13} />
              {lidas.has(mensagemSelecionada.id) ? "Marcar como não lida" : "Marcar como lida"}
            </button>
            <button
              onClick={() => arquivar(mensagemSelecionada.id)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
              }}
            >
              <Archive size={13} />
              Arquivar
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Inbox size={26} style={{ color: "rgba(255,255,255,0.3)" }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-white">Selecione uma mensagem</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {naoLidasCount > 0
              ? `${naoLidasCount} mensagem${naoLidasCount > 1 ? "s" : ""} não lida${naoLidasCount > 1 ? "s" : ""}`
              : "Tudo em dia por aqui"}
          </p>
        </div>
      )}
    </div>
  );
}
