"use client";
import { useState, useCallback } from "react";
import { useTabState } from "@/hooks/useTabState";
import { Search, Settings, CheckCircle, Clock, X } from "lucide-react";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonPulse } from "@/components/ui/LoadingSkeleton";

const connectedIntegrationsMock = [
  { name: "Meta Ads", category: "Marketing", status: "connected", color: "#a1a1aa", lastSync: "há 2 minutos" },
  { name: "Shopify", category: "E-commerce", status: "connected", color: "#22c55e", lastSync: "há 5 minutos" },
  { name: "WhatsApp Business", category: "Communication", status: "connected", color: "#71717a", lastSync: "há 1 minuto" },
  { name: "Google Analytics", category: "Data Analytics", status: "pending", color: "#f59e0b", lastSync: "Aguardando sincronização" },
];

const availableIntegrationsMock = [
  { category: "Developer Tools", name: "BrowserStack", desc: "Automatize testes de navegadores reais para garantir qualidade em múltiplas plataformas.", color: "#f97316" },
  { category: "Data Analytics", name: "Adytel", desc: "Unifique dados de anúncios e métricas de campanha em um painel centralizado.", color: "#71717a" },
  { category: "Business Management", name: "Drata", desc: "Automatize conformidade e auditoria de segurança para certificações como SOC 2.", color: "#e0e0e0" },
  { category: "Databases", name: "Prisma Postgres", desc: "Conecte e gerencie seu banco de dados Postgres com ORM seguro e migrações automáticas.", color: "#71717a" },
  { category: "Artificial Intelligence (AI)", name: "DeepImage", desc: "Aprimore e processe imagens com IA para elevar a qualidade visual do seu conteúdo.", color: "#a1a1aa" },
  { category: "Communication", name: "Discord Bot", desc: "Integre seu agente ao Discord para notificações, suporte e automações em tempo real.", color: "#52525b" },
  { category: "Infrastructure & Cloud", name: "Encodian", desc: "Converta, processe e gerencie documentos na nuvem com automação de fluxos.", color: "#10b981" },
  { category: "Help Desk & Support", name: "Freshchat", desc: "Ofereça suporte ao cliente em tempo real via chat com automações inteligentes.", color: "#22c55e" },
  { category: "Help Desk & Support", name: "HelpDocs", desc: "Crie e publique uma base de conhecimento para reduzir tickets de suporte.", color: "#f59e0b" },
  { category: "Communication", name: "Phaxio", desc: "Envie e receba faxes digitais diretamente das suas automações e fluxos de trabalho.", color: "#ec4899" },
  { category: "Marketing", name: "Repuso", desc: "Colete e exiba avaliações de clientes para aumentar a credibilidade da sua marca.", color: "#14b8a6" },
  { category: "General", name: "Zoho Sprints", desc: "Gerencie sprints e tarefas ágeis sincronizando seu time com atualizações automáticas.", color: "#f43f5e" },
];

const allCategoriesMock = ["All", ...Array.from(new Set(availableIntegrationsMock.map((i) => i.category)))];

function InitialCircle({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
      style={{ backgroundColor: color + "28", color }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function IntegrationsContent() {
  const [activeTab, setActiveTab] = useTabState<"conexoes" | "disponiveis">("kairus-integrations-tab", "conexoes");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [configDialog, setConfigDialog] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const skip = !isSupabaseConfigured();

  const fetchConnected = useCallback(async () => {
    const res = await fetch("/api/integrations?type=connected");
    if (!res.ok) throw new Error("Failed to fetch integrations");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const fetchAvailable = useCallback(async () => {
    const res = await fetch("/api/integrations?type=available");
    if (!res.ok) throw new Error("Failed to fetch available integrations");
    const json = await res.json();
    return json.data ?? json ?? [];
  }, []);

  const { data: connectedIntegrations, loading: loadingConnected } = useSupabaseQuery({
    queryFn: fetchConnected,
    mockData: connectedIntegrationsMock,
    skip,
  });

  const { data: availableIntegrations, loading: loadingAvailable } = useSupabaseQuery({
    queryFn: fetchAvailable,
    mockData: availableIntegrationsMock,
    skip,
  });

  const allCategories = ["All", ...Array.from(new Set(availableIntegrations.map((i: typeof availableIntegrationsMock[number]) => i.category)))];

  const filteredAvailable = availableIntegrations.filter((i: typeof availableIntegrationsMock[number]) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Integrações</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)]">
            Conecte integrações para potencializar as capacidades e o desempenho do seu agente
          </p>
        </div>
        <button disabled title="Criar integração em breve" className="rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors opacity-50 cursor-not-allowed">
          Criar integração personalizada
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-[rgba(255,255,255,0.08)]" role="tablist" aria-label="Integracoes">
        <button
          role="tab"
          aria-selected={activeTab === "conexoes"}
          aria-controls="panel-conexoes"
          onClick={() => setActiveTab("conexoes")}
          className={`px-4 py-2 text-sm transition-colors border-b-2 ${
            activeTab === "conexoes"
              ? "text-white border-white"
              : "text-[rgba(255,255,255,0.4)] border-transparent hover:text-white"
          }`}
        >
          Conexões
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "disponiveis"}
          aria-controls="panel-disponiveis"
          onClick={() => setActiveTab("disponiveis")}
          className={`px-4 py-2 text-sm transition-colors border-b-2 ${
            activeTab === "disponiveis"
              ? "text-white border-white"
              : "text-[rgba(255,255,255,0.4)] border-transparent hover:text-white"
          }`}
        >
          Integrações disponíveis
        </button>
      </div>

      {/* Connected integrations tab */}
      {activeTab === "conexoes" && loadingConnected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SkeletonPulse className="h-8 w-8 rounded-full" />
                  <div>
                    <SkeletonPulse className="h-3 w-20 mb-1" />
                    <SkeletonPulse className="h-2.5 w-14" />
                  </div>
                </div>
                <SkeletonPulse className="h-5 w-16 rounded-full" />
              </div>
              <SkeletonPulse className="h-2.5 w-32" />
              <div className="flex gap-2">
                <SkeletonPulse className="h-8 flex-1 rounded-lg" />
                <SkeletonPulse className="h-8 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "conexoes" && !loadingConnected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedIntegrations.map((i: typeof connectedIntegrationsMock[number]) => (
            <div
              key={i.name}
              className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 flex flex-col gap-4 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialCircle name={i.name} color={i.color} />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{i.name}</h3>
                    <span className="text-xs text-[rgba(255,255,255,0.4)]">{i.category}</span>
                  </div>
                </div>
                {i.status === "connected" ? (
                  <span className="flex items-center gap-1 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] px-2 py-0.5 text-xs text-[#4ade80]">
                    <CheckCircle size={11} />
                    Conectado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] px-2 py-0.5 text-xs text-[#fbbf24]">
                    <Clock size={11} />
                    Pendente
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.5)]">
                <Clock size={11} />
                <span>Última sync: {i.lastSync}</span>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button
                  onClick={() => setConfigDialog(i.name)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.13)] transition-colors cursor-pointer"
                >
                  <Settings size={13} />
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available integrations tab */}
      {activeTab === "disponiveis" && (
        <>
          {/* Sub-filters */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  activeCategory === cat
                    ? "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.12)] text-white"
                    : "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
              <Search size={14} className="text-[rgba(255,255,255,0.4)]" />
              <input
                aria-label="Pesquisar integrações"
                className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-52"
                placeholder="Pesquisar integrações por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredAvailable.length === 0 ? (
            <div className="text-center py-16 text-[rgba(255,255,255,0.5)] text-sm">
              Nenhuma integração encontrada para &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map((i) => (
                <div
                  key={i.name}
                  className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex flex-col gap-3 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: i.color }} />
                    <span className="text-xs text-[rgba(255,255,255,0.4)]">{i.category}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <InitialCircle name={i.name} color={i.color} />
                      <h3 className="text-sm font-semibold text-white">{i.name}</h3>
                    </div>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed">{i.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setToast(`Conexao "${i.name}" adicionada`);
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="mt-auto rounded-lg border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.07)] hover:text-white transition-colors cursor-pointer"
                  >
                    Adicionar conexão
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* Config dialog */}
      {configDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setConfigDialog(null)}>
          <div
            className="glass-card w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#111] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Configurar {configDialog}</h2>
              <button onClick={() => setConfigDialog(null)} className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[rgba(255,255,255,0.5)] block mb-1.5">API Key</label>
                <input className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none focus:border-[rgba(1,196,97,0.5)]" placeholder="sk-..." readOnly defaultValue="***-demo-key-***" />
              </div>
              <div>
                <label className="text-xs text-[rgba(255,255,255,0.5)] block mb-1.5">Webhook URL</label>
                <input className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none focus:border-[rgba(1,196,97,0.5)]" placeholder="https://..." readOnly defaultValue="https://kairus.app/webhook/..." />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[rgba(255,255,255,0.6)]">Sincronizacao automatica</span>
                <div className="toggle-switch active" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setConfigDialog(null)} className="flex-1 rounded-lg border border-[rgba(255,255,255,0.1)] px-3 py-2 text-sm text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer">Cancelar</button>
              <button onClick={() => setConfigDialog(null)} className="flex-1 rounded-lg bg-[rgba(255,255,255,0.88)] px-3 py-2 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors cursor-pointer">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-[rgba(34,197,94,0.3)] bg-[#111] px-4 py-3 shadow-xl animate-fade-in-up">
          <CheckCircle size={15} className="text-green-400" />
          <span className="text-sm text-white">{toast}</span>
        </div>
      )}
    </div>
  );
}
