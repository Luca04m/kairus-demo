"use client";
import { useState, useCallback } from "react";
import { Search, Calendar, CalendarDays, FileText, Plus, Loader2, Sparkles } from "lucide-react";
import { RELATORIOS, AGENTES } from "@/data/mrlion";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonPulse } from "@/components/ui/LoadingSkeleton";

const tipoBadge: Record<string, string> = {
  Semanal: "bg-[#01C461]/20 text-[#01C461] border border-[#01C461]/20",
  Mensal: "bg-[#01C461]/20 text-[#01C461] border border-[#01C461]/20",
};

const tipoIcon: Record<string, React.ReactNode> = {
  Semanal: <Calendar size={11} className="inline-block mr-1 -mt-px" />,
  Mensal: <CalendarDays size={11} className="inline-block mr-1 -mt-px" />,
};

interface GeneratedReport {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  conteudo: string;
  geradoPor: string;
}

const REPORT_OPTIONS = [
  { label: "Relatorio Financeiro", agentId: "financeiro", prompt: "Gere um relatorio financeiro completo do ultimo mes com dados atuais." },
  { label: "Relatorio de Vendas", agentId: "ecommerce", prompt: "Gere um relatorio de vendas e e-commerce do ultimo mes." },
  { label: "Relatorio de Estoque", agentId: "estoque", prompt: "Gere um relatorio de estoque e inventario atual." },
] as const;

export function RelatoriosContent() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const skip = !isSupabaseConfigured();

  const fetchReports = useCallback(async () => {
    const res = await fetch("/api/reports");
    if (!res.ok) throw new Error("Failed to fetch reports");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const fetchAgents = useCallback(async () => {
    const res = await fetch("/api/agents");
    if (!res.ok) throw new Error("Failed to fetch agents");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const { data: relatorios, loading } = useSupabaseQuery({
    queryFn: fetchReports,
    mockData: RELATORIOS,
    skip,
  });

  const { data: agentesData } = useSupabaseQuery({
    queryFn: fetchAgents,
    mockData: AGENTES,
    skip,
  });

  function getAgente(nome: string) {
    return agentesData.find((a: typeof AGENTES[number]) => a.nome === nome);
  }

  async function handleGenerateReport(opt: { label: string; agentId: string; prompt: string }) {
    setShowReportMenu(false);
    setGerandoRelatorio(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: opt.prompt, id: crypto.randomUUID() }],
          agentId: opt.agentId,
        }),
      });

      // Parse the SSE stream to extract plain text content
      // The AI SDK UIMessageStream sends lines like: 0:"text chunk"\n
      // Text deltas have format: f:{"type":"text-delta","textDelta":"..."}
      const raw = await res.text();
      let plainText = "";
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        // AI SDK data stream protocol: type-prefix:json-value
        // 0:"text" = text part, f:{} = stream part with textDelta
        if (trimmed.startsWith("0:")) {
          try {
            const value = JSON.parse(trimmed.slice(2));
            if (typeof value === "string") plainText += value;
          } catch { /* skip unparseable */ }
        } else if (trimmed.startsWith("f:")) {
          try {
            const obj = JSON.parse(trimmed.slice(2));
            if (obj.type === "text-delta" && typeof obj.textDelta === "string") {
              plainText += obj.textDelta;
            }
          } catch { /* skip unparseable */ }
        }
      }

      // Fallback: if no protocol-formatted text found, use raw (minus control lines)
      if (!plainText.trim()) {
        plainText = raw.replace(/^[0-9a-f]:.*/gm, "").trim() || raw;
      }

      setGeneratedReports((prev) => [
        {
          id: crypto.randomUUID(),
          titulo: opt.label,
          tipo: opt.agentId,
          data: new Date().toLocaleDateString("pt-BR"),
          conteudo: plainText,
          geradoPor: opt.agentId,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Erro ao gerar relatorio:", err);
    } finally {
      setGerandoRelatorio(false);
    }
  }

  const relatoriosFiltrados = relatorios.filter((r: typeof RELATORIOS[number]) => {
    const matchTipo = filtro === "Todos" || r.tipo === filtro;
    const matchBusca =
      busca === "" ||
      r.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      r.resumo.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Relatorios</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Relatorios automaticos gerados pela sua equipe de IA
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowReportMenu(!showReportMenu)}
            disabled={gerandoRelatorio}
            className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.88)] hover:bg-[rgba(255,255,255,0.75)] px-4 py-2 text-xs font-medium text-[#080808] transition-colors disabled:opacity-50"
          >
            {gerandoRelatorio ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {gerandoRelatorio ? "Gerando..." : "Gerar relatorio"}
          </button>
          {showReportMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-white/10 bg-[#141414] shadow-xl">
              {REPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.agentId}
                  onClick={() => handleGenerateReport(opt)}
                  className="w-full text-left px-4 py-2.5 text-xs text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {["Todos", "Semanal", "Mensal"].map((label) => (
          <button
            key={label}
            onClick={() => setFiltro(label)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filtro === label
                ? "bg-white/10 text-white ring-1 ring-white/20"
                : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}

        <div className="ml-auto relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)]" />
          <input
            type="text"
            aria-label="Buscar relatorio"
            placeholder="Buscar relatorio..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[rgba(255,255,255,0.16)] transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 flex flex-col gap-3">
              <SkeletonPulse className="h-5 w-16 rounded-full" />
              <SkeletonPulse className="h-4 w-3/4" />
              <SkeletonPulse className="h-3 w-24" />
              <SkeletonPulse className="h-10 w-full" />
              <SkeletonPulse className="h-2 w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI-generated reports */}
          {generatedReports.map((report) => (
            <div
              key={report.id}
              className="glass-card group relative flex flex-col rounded-xl border border-[#01C461]/20 bg-[#01C461]/5 p-5 transition-all duration-200 hover:border-[#01C461]/30 hover:shadow-[0_4px_24px_rgba(1,196,97,0.15)] hover:bg-[#01C461]/10"
            >
              {/* AI badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#01C461]/20 text-[#01C461] border border-[#01C461]/20 px-2.5 py-0.5 text-[11px] font-semibold">
                  <Sparkles size={11} />
                  AI Generated
                </span>
                <span className="text-[10px] text-[rgba(255,255,255,0.4)]">{report.data}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent leading-snug mb-1">
                {report.titulo}
              </h3>

              {/* Agent attribution */}
              <p className="text-xs text-[rgba(255,255,255,0.5)] mb-2">
                Gerado por agente: {report.geradoPor}
              </p>

              {/* Content preview */}
              <p className="text-xs text-[rgba(255,255,255,0.55)] line-clamp-4 flex-1 leading-relaxed whitespace-pre-wrap">
                {report.conteudo.slice(0, 300)}
                {report.conteudo.length > 300 ? "..." : ""}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-end mt-3 pt-3 border-t border-[#01C461]/10">
                <button className="rounded-md bg-[#01C461]/10 hover:bg-[#01C461]/20 border border-[#01C461]/20 px-3 py-1 text-[11px] font-medium text-[#01C461] transition-colors">
                  Ver completo
                </button>
              </div>
            </div>
          ))}

          {/* Mock reports */}
          {relatoriosFiltrados.length === 0 && generatedReports.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                <FileText size={22} className="text-[rgba(255,255,255,0.5)]" />
              </div>
              <p className="text-sm font-medium text-[rgba(255,255,255,0.5)]">Nenhum relatorio encontrado</p>
              <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">Tente ajustar os filtros ou a busca</p>
            </div>
          ) : (
            relatoriosFiltrados.map((rel) => {
              const agente = getAgente(rel.agente);
              return (
                <div
                  key={rel.id}
                  className="glass-card group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 transition-all duration-200 hover:border-[rgba(255,255,255,0.16)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  {/* Status dot */}
                  {rel.status === "pronto" && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                  )}

                  {/* Type badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tipoBadge[rel.tipo]}`}>
                      {tipoIcon[rel.tipo]}
                      {rel.tipo}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent leading-snug mb-1">
                    {rel.titulo}
                  </h3>

                  {/* Period */}
                  <p className="text-xs text-[rgba(255,255,255,0.5)] mb-2">{rel.periodo}</p>

                  {/* Summary */}
                  <p className="text-xs text-[rgba(255,255,255,0.55)] line-clamp-3 flex-1 leading-relaxed">
                    {rel.resumo}
                  </p>

                  {/* Created date */}
                  <p className="mt-3 text-[10px] text-[rgba(255,255,255,0.5)]">
                    Gerado em {rel.criadoEm}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                    {/* Agent attribution */}
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: agente?.departamentoCor ?? "rgba(255,255,255,0.15)" }}
                      >
                        {agente?.iniciais ?? rel.agente.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-xs text-[rgba(255,255,255,0.45)]">{rel.agente}</span>
                    </div>

                    {/* Ver completo */}
                    <button className="rounded-md bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] font-medium text-white transition-colors">
                      Ver completo
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
