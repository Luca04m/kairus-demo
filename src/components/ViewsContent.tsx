"use client";
import { useState } from "react";
import { Search, Table2, Columns3, BarChart3 } from "lucide-react";

type TipoVisualizacao = "tabela" | "kanban" | "grafico";

interface Visualizacao {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoVisualizacao;
  criadaPor: string;
  criadaEm: string;
  icone: "Table2" | "Columns3" | "BarChart3";
}

const VISUALIZACOES: Visualizacao[] = [
  { id: "v1", nome: "Vendas por Produto", descricao: "Receita e unidades por SKU, últimos 12 meses", tipo: "tabela", criadaPor: "Leo", criadaEm: "15/03/2026", icone: "Table2" },
  { id: "v2", nome: "Pipeline B2B", descricao: "Kanban de oportunidades de vendas B2B por estágio", tipo: "kanban", criadaPor: "Rex", criadaEm: "20/03/2026", icone: "Columns3" },
  { id: "v3", nome: "Performance Campanhas", descricao: "ROAS, CTR e CPC por campanha Meta Ads", tipo: "grafico", criadaPor: "Mia", criadaEm: "22/03/2026", icone: "BarChart3" },
  { id: "v4", nome: "Estoque Crítico", descricao: "Produtos com estoque abaixo do mínimo", tipo: "tabela", criadaPor: "Sol", criadaEm: "28/03/2026", icone: "Table2" },
  { id: "v5", nome: "Atendimentos WhatsApp", descricao: "Volume e tempo de resposta por dia", tipo: "grafico", criadaPor: "Iris", criadaEm: "01/04/2026", icone: "BarChart3" },
  { id: "v6", nome: "ROI por Departamento", descricao: "Investimento vs valor gerado por área", tipo: "grafico", criadaPor: "Leo", criadaEm: "25/03/2026", icone: "BarChart3" },
];

const TIPO_CONFIG: Record<TipoVisualizacao, { label: string; color: string; bg: string }> = {
  tabela:  { label: "Tabela",  color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
  kanban:  { label: "Kanban",  color: "#22c55e", bg: "rgba(34,197,94,0.15)"  },
  grafico: { label: "Gráfico", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
};

const TIPO_FILTERS = ["Todas", "Tabela", "Kanban", "Gráfico"] as const;

function TipoIcon({ icone, color }: { icone: Visualizacao["icone"]; color: string }) {
  const props = { size: 20, style: { color } };
  if (icone === "Table2")   return <Table2   {...props} />;
  if (icone === "Columns3") return <Columns3 {...props} />;
  return <BarChart3 {...props} />;
}

function Initials({ name }: { name: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-xs font-semibold shrink-0"
      style={{
        width: 22,
        height: 22,
        background: "rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function ViewsContent() {
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<(typeof TIPO_FILTERS)[number]>("Todas");

  const filtered = VISUALIZACOES.filter((v) => {
    const matchSearch =
      search.trim() === "" ||
      v.nome.toLowerCase().includes(search.toLowerCase()) ||
      v.descricao.toLowerCase().includes(search.toLowerCase());

    const matchTipo =
      tipoFilter === "Todas" ||
      TIPO_CONFIG[v.tipo].label === tipoFilter;

    return matchSearch && matchTipo;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Visualizações</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Crie visualizações para facilitar a busca nas tabelas de dados de entrada/saída dos seus nós.
          </p>
        </div>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Type filter pills */}
        <div className="flex items-center gap-1.5">
          {TIPO_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTipoFilter(f)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
              style={
                tipoFilter === f
                  ? { background: "rgba(255,255,255,0.15)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5 ml-auto min-w-[220px]">
          <Search size={14} className="text-[rgba(255,255,255,0.4)] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-full"
            placeholder="Pesquisar por nome e descrição..."
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Nenhuma visualização encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => {
            const cfg = TIPO_CONFIG[v.tipo];
            return (
              <div
                key={v.id}
                className="glass-card rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Icon + badge row */}
                <div className="flex items-center justify-between">
                  <div
                    className="rounded-lg p-2 flex items-center justify-center"
                    style={{ background: cfg.bg }}
                  >
                    <TipoIcon icone={v.icone} color={cfg.color} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Name + description */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-white leading-snug">{v.nome}</h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {v.descricao}
                  </p>
                </div>

                {/* Footer: author + date + button */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <div className="flex items-center gap-1.5">
                    <Initials name={v.criadaPor} />
                    <div className="flex flex-col">
                      <span className="text-xs text-[rgba(255,255,255,0.55)] leading-none">{v.criadaPor}</span>
                      <span className="text-[10px] text-[rgba(255,255,255,0.5)] leading-none mt-0.5">{v.criadaEm}</span>
                    </div>
                  </div>
                  <button
                    className="rounded-lg px-3 py-1 text-xs font-medium transition-colors bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.14)]"
                  >
                    Abrir
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
