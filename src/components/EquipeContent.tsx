"use client";
import { useState } from "react";
import { Search, CheckCircle2, XCircle, ThumbsUp, Clock } from "lucide-react";
import { AGENTES, DEPARTAMENTOS } from "@/data/mrlion";

const statusCor: Record<string, string> = {
  ativo: "bg-green-500",
  pausado: "bg-yellow-500",
  idle: "bg-[rgba(255,255,255,0.3)]",
};

const statusLabel: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  idle: "Inativo",
};

export function EquipeContent() {
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");

  const agentesFiltrados = AGENTES.filter((a) => {
    const matchDept = filtro === "todos" || a.departamento === filtro;
    const matchBusca =
      busca === "" ||
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchDept && matchBusca;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-white">Minha Equipe</h1>
            <span className="rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] px-2 py-0.5 text-xs text-[rgba(255,255,255,0.5)] font-medium">
              {agentesFiltrados.length} agente{agentesFiltrados.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Agentes de IA organizados por departamento
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setFiltro("todos")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filtro === "todos"
              ? "bg-[rgba(255,255,255,0.10)] text-white shadow-sm"
              : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
          }`}
        >
          Todos
        </button>
        {DEPARTAMENTOS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setFiltro(dept.id)}
            style={
              filtro === dept.id
                ? { backgroundColor: `${dept.cor}18`, borderColor: `${dept.cor}40` }
                : {}
            }
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 border ${
              filtro === dept.id
                ? "text-white border-transparent"
                : "text-[rgba(255,255,255,0.4)] border-transparent hover:bg-[rgba(255,255,255,0.06)]"
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: dept.cor }}
            />
            {dept.emoji && <span>{dept.emoji}</span>}
            {dept.nome}
          </button>
        ))}

        {/* Search */}
        <div className="ml-auto relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar agente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] backdrop-blur-sm pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none transition-all focus:border-[rgba(255,255,255,0.22)] focus:bg-[rgba(255,255,255,0.08)] focus:ring-1 focus:ring-[rgba(255,255,255,0.06)]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentesFiltrados.map((agente) => (
          <div
            key={agente.id}
            className="glass-card group relative rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-[rgba(255,255,255,0.13)]"
            style={{ borderLeft: `3px solid ${agente.departamentoCor}` }}
          >
            {/* Department label row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[rgba(255,255,255,0.4)]">
                {DEPARTAMENTOS.find((d) => d.id === agente.departamento)?.nome}
              </span>
              {/* Status badge */}
              <span className="flex items-center gap-1.5 text-[10px] text-[rgba(255,255,255,0.4)]">
                <span className="relative flex h-2 w-2">
                  {agente.status === "ativo" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${statusCor[agente.status]}`}
                  />
                </span>
                {statusLabel[agente.status] ?? agente.status}
              </span>
            </div>

            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: `${agente.departamentoCor}30`, border: `1.5px solid ${agente.departamentoCor}50` }}
                >
                  {agente.iniciais}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{agente.nome}</p>
                <p className="text-xs text-[rgba(255,255,255,0.4)] line-clamp-2 leading-snug mt-0.5">
                  {agente.descricao}
                </p>
              </div>
            </div>

            {/* Last action — notification style */}
            <div className="rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] px-3 py-2 flex items-start gap-2">
              <Clock size={11} className="mt-0.5 flex-shrink-0 text-[rgba(255,255,255,0.3)]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[rgba(255,255,255,0.75)] leading-snug">{agente.ultimaAcao}</p>
                <span className="inline-block mt-1 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.07)] px-1.5 py-0.5 text-[10px] text-[rgba(255,255,255,0.35)]">
                  {agente.ultimaAcaoTempo}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.45)]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" />
                {agente.tarefasConcluidas}
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={12} className="text-red-500" />
                {agente.tarefasFalhadas}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp size={12} className="text-[rgba(255,255,255,0.35)]" />
                {agente.taxaAprovacao}
              </span>
            </div>

            {/* Hover: ver detalhes */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <span className="text-[10px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] cursor-pointer transition-colors">
                Ver detalhes →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
