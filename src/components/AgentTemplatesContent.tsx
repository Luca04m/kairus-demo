"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Tag, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonPulse, ErrorState } from "@/components/ui/LoadingSkeleton";

const TEMPLATES_MOCK = [
  {
    category: "Marketing",
    name: "Agente de Personalização Outbound B2B",
    desc: "Personalização de e-mails com IA que se adapta ao contexto do destinatário, estágio da campanha e persona — gerando mensagens altamente relevantes em escala.",
    color: "#a1a1aa",
  },
  {
    category: "Finanças e Contabilidade",
    name: "Agente de Cobrança",
    desc: "Este agente monitora saldos em atraso, classifica cada conta por risco e envia o lembrete correto no momento certo — reduzindo inadimplência de forma automatizada.",
    color: "#f59e0b",
  },
  {
    category: "Recursos Humanos",
    name: "Agente de Avaliação de Candidatos",
    desc: "Otimiza o recrutamento triando candidatos automaticamente com base nos requisitos da vaga, gerando relatórios de adequação detalhados para cada perfil analisado.",
    color: "#71717a",
  },
  {
    category: "Recursos Humanos",
    name: "Agente de Sourcing de Candidatos",
    desc: "Agiliza o recrutamento buscando automaticamente perfis de candidatos para vagas em aberto, consolidando resultados de múltiplas fontes em uma única visualização.",
    color: "#71717a",
  },
  {
    category: "Finanças e Contabilidade",
    name: "Agente de Reconciliação de Transações",
    desc: "Ingere arquivos de transações brutas, extrai todos os campos automaticamente e classifica cada linha com o centro de custo de negócio correto.",
    color: "#f59e0b",
  },
  {
    category: "Operações",
    name: "Agente de Entrada de Pedidos (B2B)",
    desc: "Automatiza o processamento de documentos de pedidos recebidos em PDF, extrai dados estruturados e os encaminha para os sistemas de ERP sem intervenção manual.",
    color: "#10b981",
  },
  {
    category: "Utilitários",
    name: "Agente de Roteamento",
    desc: "Atua como um roteador inteligente de consultas, analisando requisições recebidas para determinar o agente ou fluxo de trabalho mais adequado para respondê-las.",
    color: "#f59e0b",
  },
  {
    category: "Finanças e Contabilidade",
    name: "Agente de Análise de Crédito",
    desc: "Avalia o status de crédito de clientes que realizam pedidos, analisando saldos pendentes e histórico de pagamentos para recomendar limites adequados.",
    color: "#f59e0b",
  },
  {
    category: "Vendas",
    name: "Agente de Operações de Vendas",
    desc: "Otimiza o processo de colocação e confirmação de pedidos, reduzindo o tempo operacional da equipe comercial e aumentando a precisão dos dados de vendas.",
    color: "#ec4899",
  },
  {
    category: "Suporte ao Cliente",
    name: "Agente de Gestão de Devoluções",
    desc: "Atua como assistente de atendimento automatizado, interpretando solicitações de devolução e gerenciando o fluxo completo do processo de pós-venda.",
    color: "#71717a",
  },
  {
    category: "Suporte ao Cliente",
    name: "Agente de Análise de Transcrições BPO",
    desc: "Automatiza a análise de transcrições de chamadas de clientes, extraindo insights acionáveis e identificando oportunidades de melhoria no atendimento.",
    color: "#71717a",
  },
  {
    category: "Conformidade",
    name: "Agente de Documentação KYB",
    desc: "Assistente de conformidade inteligente que gerencia e verifica documentos KYB obrigatórios, guiando empresas pelo processo de onboarding regulatório.",
    color: "#22c55e",
  },
];

const ITEMS_PER_PAGE = 6;

function InitialsIcon({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <span
      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold flex-shrink-0 select-none"
      style={{
        backgroundColor: `${color}22`,
        color: color === "rgba(255,255,255,0.88)" ? "#fff" : color,
        border: `1px solid ${color}44`,
      }}
    >
      {initials || name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function AgentTemplatesContent() {
  const skip = !isSupabaseConfigured();

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("/api/agents?type=template");
    if (!res.ok) throw new Error("Failed to fetch templates");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const { data: templates, loading, error, refetch } = useSupabaseQuery({
    queryFn: fetchTemplates,
    mockData: TEMPLATES_MOCK,
    skip,
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [page, setPage] = useState(1);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCategoryMenu) return;
    function handleClickOutside(e: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setShowCategoryMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategoryMenu]);

  const categories = ["Todas", ...Array.from(new Set(templates.map((t: { category: string }) => t.category)))];

  const filtered = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Todas" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  function handleCategorySelect(cat: string) {
    setActiveCategory(cat);
    setShowCategoryMenu(false);
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonPulse className="h-6 w-52 mb-2" />
        <SkeletonPulse className="h-4 w-80 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5">
              <SkeletonPulse className="h-4 w-24 mb-3" />
              <SkeletonPulse className="h-5 w-40 mb-2" />
              <SkeletonPulse className="h-3 w-full mb-1" />
              <SkeletonPulse className="h-3 w-3/4 mb-4" />
              <SkeletonPulse className="h-8 w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message="Erro ao carregar modelos de agente." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Modelos de agente</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Esta é uma visão geral de todos os modelos nesta área de trabalho
          </p>
        </div>
        <button className="rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors">
          Criar agente em branco
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative" ref={categoryMenuRef}>
          <button
            onClick={() => setShowCategoryMenu((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <Tag size={13} />
            {activeCategory === "Todas" ? "Categorias" : activeCategory}
          </button>
          {showCategoryMenu && (
            <div className="absolute top-full left-0 mt-1 z-20 min-w-[200px] rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#111] shadow-2xl overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    activeCategory === cat
                      ? "bg-[rgba(255,255,255,0.1)] text-white"
                      : "text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto">
          <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
            <Search size={14} className="text-[rgba(255,255,255,0.4)]" />
            <input
              aria-label="Pesquisar agentes"
              className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-52"
              placeholder="Pesquisar agentes por nome..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.length === 0 && (
          <div className="col-span-full text-center py-16 text-[rgba(255,255,255,0.5)] text-sm">
            Nenhum modelo encontrado.
          </div>
        )}
        {paginated.map((t) => (
          <div
            key={t.name}
            className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 flex flex-col gap-3 transition-all duration-200 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* Category badge */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: `${t.color}22`,
                  color: t.color === "rgba(255,255,255,0.88)" ? "#fff" : t.color,
                  border: `1px solid ${t.color}44`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color === "rgba(255,255,255,0.88)" ? "#fff" : t.color }}
                />
                {t.category}
              </span>
            </div>

            {/* Icon + Name */}
            <div className="flex items-start gap-3">
              <InitialsIcon name={t.name} color={t.color === "rgba(255,255,255,0.88)" ? "#e2e8f0" : t.color} />
              <h3 className="text-sm font-semibold text-white leading-snug pt-1">{t.name}</h3>
            </div>

            {/* Description */}
            <p className="text-xs text-[rgba(255,255,255,0.45)] leading-relaxed line-clamp-3 flex-1">
              {t.desc}
            </p>

            {/* CTA */}
            <button
              className="mt-auto rounded-lg border border-[rgba(255,255,255,0.18)] px-3 py-1.5 text-sm font-medium text-[rgba(255,255,255,0.75)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.12)] hover:text-white hover:border-[rgba(255,255,255,0.3)] text-left"
            >
              Criar agente
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[rgba(255,255,255,0.45)]">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
          className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          Anterior
        </button>

        <span className="text-[rgba(255,255,255,0.55)] font-medium">
          Página {safePage} de {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Próxima
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
