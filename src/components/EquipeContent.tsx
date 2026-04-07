"use client";

import { CheckCircle2, XCircle, ThumbsUp, Clock, Activity, Zap, Bot } from "lucide-react";
import { AGENTES_EQUIPE as AGENTS } from "@/data/mrlion";

/* ------------------------------------------------------------------ */
/* Aggregate stats                                                     */
/* ------------------------------------------------------------------ */

const totalConcluidas = AGENTS.reduce((s, a) => s + a.tarefasConcluidas, 0);

const statusCor: Record<string, string> = {
  ativo: "bg-green-500",
  pausado: "bg-yellow-500",
};

const statusLabel: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function EquipeContent() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot size={20} className="text-[rgba(255,255,255,0.5)]" />
          Visao Geral
        </h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">
          Status dos agentes IA em operacao
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">5 agentes ativos</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Todos operacionais</p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{totalConcluidas} tarefas concluidas</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Hoje</p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">99.2% uptime</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Media dos agentes</p>
          </div>
        </div>
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="group relative rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-[rgba(255,255,255,0.13)]"
            style={{ borderLeft: `3px solid ${agent.cor}` }}
          >
            {/* Role + status row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[rgba(255,255,255,0.4)]">{agent.role}</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[rgba(255,255,255,0.4)]">
                <span className="relative flex h-2 w-2">
                  {agent.status === "ativo" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${statusCor[agent.status]}`}
                  />
                </span>
                {statusLabel[agent.status]}
              </span>
            </div>

            {/* Avatar + name + current task */}
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0"
                style={{
                  backgroundColor: `${agent.cor}30`,
                  border: `1.5px solid ${agent.cor}50`,
                }}
              >
                {agent.iniciais}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{agent.nome}</p>
                <p className="text-xs text-[rgba(255,255,255,0.5)] leading-snug mt-0.5">
                  {agent.currentTask}
                </p>
              </div>
            </div>

            {/* Mini activity log */}
            <div className="rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] px-3 py-2 flex flex-col gap-1.5">
              {agent.activityLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Clock
                    size={10}
                    className="mt-0.5 flex-shrink-0 text-[rgba(255,255,255,0.35)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[rgba(255,255,255,0.6)] leading-snug">
                      {entry.action}
                    </p>
                    <span className="text-[10px] text-[rgba(255,255,255,0.3)]">
                      {entry.tempo}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance metrics */}
            <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.45)]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" />
                {agent.tarefasConcluidas}
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={12} className="text-red-500" />
                {agent.tarefasFalhadas}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp size={12} className="text-[rgba(255,255,255,0.5)]" />
                {agent.taxaAprovacao}
              </span>
              <span className="ml-auto text-[10px] text-[rgba(255,255,255,0.3)]">
                uptime {agent.uptime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
