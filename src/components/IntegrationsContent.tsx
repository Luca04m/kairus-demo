"use client";
import { useState } from "react";
import { Tag, List, Search, Settings, Unplug, CheckCircle, Clock } from "lucide-react";

const connectedIntegrations = [
  { name: "Meta Ads", category: "Marketing", status: "connected", color: "#6366f1", lastSync: "há 2 minutos" },
  { name: "Shopify", category: "E-commerce", status: "connected", color: "#22c55e", lastSync: "há 5 minutos" },
  { name: "WhatsApp Business", category: "Communication", status: "connected", color: "#06b6d4", lastSync: "há 1 minuto" },
  { name: "Google Analytics", category: "Data Analytics", status: "pending", color: "#f59e0b", lastSync: "Aguardando sincronização" },
];

const availableIntegrations = [
  { category: "Developer Tools", name: "BrowserStack", desc: "Automatize testes de navegadores reais para garantir qualidade em múltiplas plataformas.", color: "#f97316" },
  { category: "Data Analytics", name: "Adytel", desc: "Unifique dados de anúncios e métricas de campanha em um painel centralizado.", color: "#8b5cf6" },
  { category: "Business Management", name: "Drata", desc: "Automatize conformidade e auditoria de segurança para certificações como SOC 2.", color: "#e0e0e0" },
  { category: "Databases", name: "Prisma Postgres", desc: "Conecte e gerencie seu banco de dados Postgres com ORM seguro e migrações automáticas.", color: "#06b6d4" },
  { category: "Artificial Intelligence (AI)", name: "DeepImage", desc: "Aprimore e processe imagens com IA para elevar a qualidade visual do seu conteúdo.", color: "#6366f1" },
  { category: "Communication", name: "Discord Bot", desc: "Integre seu agente ao Discord para notificações, suporte e automações em tempo real.", color: "#7c3aed" },
  { category: "Infrastructure & Cloud", name: "Encodian", desc: "Converta, processe e gerencie documentos na nuvem com automação de fluxos.", color: "#10b981" },
  { category: "Help Desk & Support", name: "Freshchat", desc: "Ofereça suporte ao cliente em tempo real via chat com automações inteligentes.", color: "#22c55e" },
  { category: "Help Desk & Support", name: "HelpDocs", desc: "Crie e publique uma base de conhecimento para reduzir tickets de suporte.", color: "#f59e0b" },
  { category: "Communication", name: "Phaxio", desc: "Envie e receba faxes digitais diretamente das suas automações e fluxos de trabalho.", color: "#ec4899" },
  { category: "Marketing", name: "Repuso", desc: "Colete e exiba avaliações de clientes para aumentar a credibilidade da sua marca.", color: "#14b8a6" },
  { category: "General", name: "Zoho Sprints", desc: "Gerencie sprints e tarefas ágeis sincronizando seu time com atualizações automáticas.", color: "#f43f5e" },
];

const allCategories = ["All", ...Array.from(new Set(availableIntegrations.map((i) => i.category)))];

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
  const [activeTab, setActiveTab] = useState<"conexoes" | "disponiveis">("conexoes");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredAvailable = availableIntegrations.filter((i) => {
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
        <button className="rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors">
          Criar integração personalizada
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-[rgba(255,255,255,0.08)]">
        <button
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
      {activeTab === "conexoes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedIntegrations.map((i) => (
            <div
              key={i.name}
              className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5 flex flex-col gap-4 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:shadow-lg transition-all duration-200"
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

              <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.35)]">
                <Clock size={11} />
                <span>Última sync: {i.lastSync}</span>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.13)] transition-colors">
                  <Settings size={13} />
                  Configurar
                </button>
                <button className="flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(239,68,68,0.25)] px-3 py-1.5 text-sm text-[rgba(239,68,68,0.7)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#f87171] transition-colors">
                  <Unplug size={13} />
                  Desconectar
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
            <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
              <Tag size={13} />
              Categorias
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
              <List size={13} />
              Listagem
            </button>
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
                className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-52"
                placeholder="Pesquisar integrações por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredAvailable.length === 0 ? (
            <div className="text-center py-16 text-[rgba(255,255,255,0.3)] text-sm">
              Nenhuma integração encontrada para &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map((i) => (
                <div
                  key={i.name}
                  className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 flex flex-col gap-3 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:shadow-lg transition-all duration-200"
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
                  <button className="mt-auto rounded-lg border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-sm text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.07)] hover:text-white transition-colors">
                    Adicionar conexão
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
