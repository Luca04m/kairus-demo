"use client";
import { useState } from "react";
import { Search, Calendar, CalendarDays, FileText } from "lucide-react";
import { RELATORIOS, AGENTES } from "@/data/mrlion";

const tipoBadge: Record<string, string> = {
  Semanal: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Mensal: "bg-purple-500/20 text-purple-400 border border-purple-500/20",
};

const tipoIcon: Record<string, React.ReactNode> = {
  Semanal: <Calendar size={11} className="inline-block mr-1 -mt-px" />,
  Mensal: <CalendarDays size={11} className="inline-block mr-1 -mt-px" />,
};

function getAgente(nome: string) {
  return AGENTES.find((a) => a.nome === nome);
}

export function RelatoriosContent() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const relatoriosFiltrados = RELATORIOS.filter((r) => {
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
          <h1 className="text-xl font-semibold text-white mb-1">Relatórios</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Relatórios automáticos gerados pela sua equipe de IA
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-xs font-medium text-white transition-colors">
          + Gerar relatório
        </button>
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

        <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.5)] hover:text-white/70 hover:border-white/15 transition-colors">
          <Calendar size={12} />
          Último trimestre
        </button>

        <div className="ml-auto relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)]" />
          <input
            type="text"
            placeholder="Buscar relatório..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[rgba(255,255,255,0.16)] transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {relatoriosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
            <FileText size={22} className="text-[rgba(255,255,255,0.3)]" />
          </div>
          <p className="text-sm font-medium text-[rgba(255,255,255,0.5)]">Nenhum relatório encontrado</p>
          <p className="mt-1 text-xs text-[rgba(255,255,255,0.25)]">Tente ajustar os filtros ou a busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatoriosFiltrados.map((rel) => {
            const agente = getAgente(rel.agente);
            return (
              <div
                key={rel.id}
                className="glass-card group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5 transition-all duration-200 hover:border-[rgba(255,255,255,0.16)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
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
                <h3 className="text-sm font-bold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text leading-snug mb-1">
                  {rel.titulo}
                </h3>

                {/* Period */}
                <p className="text-xs text-[rgba(255,255,255,0.35)] mb-2">{rel.periodo}</p>

                {/* Summary */}
                <p className="text-xs text-[rgba(255,255,255,0.55)] line-clamp-3 flex-1 leading-relaxed">
                  {rel.resumo}
                </p>

                {/* Created date */}
                <p className="mt-3 text-[10px] text-[rgba(255,255,255,0.25)]">
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
          })}
        </div>
      )}
    </div>
  );
}
