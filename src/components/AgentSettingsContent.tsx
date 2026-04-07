"use client";
import { Lightbulb, X, ChevronDown, User } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useSupabaseQuery, isSupabaseConfigured } from "@/lib/useSupabaseQuery";
import { SkeletonPulse, ErrorState } from "@/components/ui/LoadingSkeleton";

interface AgentConfig {
  name: string;
  description: string;
  category: string;
  avatarUrl: string | null;
}

const MOCK_AGENT_CONFIG: AgentConfig = {
  name: "Agente sem título",
  description: "",
  category: "",
  avatarUrl: null,
};

export function AgentSettingsContent() {
  const skip = !isSupabaseConfigured();

  const fetchAgentConfig = useCallback(async () => {
    const res = await fetch("/api/agents?type=config");
    if (!res.ok) throw new Error("Failed to fetch agent config");
    const json = await res.json();
    return (json.data?.[0] ?? json ?? MOCK_AGENT_CONFIG) as AgentConfig;
  }, []);

  const { data: agentConfig, loading, error, refetch } = useSupabaseQuery({
    queryFn: fetchAgentConfig,
    mockData: MOCK_AGENT_CONFIG,
    skip,
  });

  const [showBanner, setShowBanner] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Configurações");
  const [avatarMode, setAvatarMode] = useState<"avatar" | "imagem">("imagem");
  const [agentName, setAgentName] = useState(agentConfig?.name || "Agente sem título");

  // Sync agentName when agentConfig updates (e.g. after refetch)
  // queueMicrotask defers the setState out of the synchronous effect body
  useEffect(() => {
    if (agentConfig?.name) {
      queueMicrotask(() => setAgentName(agentConfig.name));
    }
  }, [agentConfig?.name]);

  const tabs = ["Configurações", "Memória", "Contexto de tarefa", "Ferramentas", "Interface"];

  if (loading) {
    return (
      <div className="p-6 max-w-3xl">
        <SkeletonPulse className="h-6 w-40 mb-2" />
        <SkeletonPulse className="h-4 w-72 mb-6" />
        <div className="flex gap-1 mb-6 border-b border-[rgba(255,255,255,0.06)] pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-8 w-24" />
          ))}
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6">
          <SkeletonPulse className="h-5 w-20 mb-4" />
          <SkeletonPulse className="h-20 w-20 rounded-xl mb-4" />
          <SkeletonPulse className="h-10 w-full mb-3" />
          <SkeletonPulse className="h-20 w-full mb-3" />
          <SkeletonPulse className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl">
        <ErrorState message="Erro ao carregar configurações do agente." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Configurações</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">Configure as ferramentas, fluxos de trabalho e configurações gerais do seu agente</p>
      </div>

      {/* Tabs with active underline */}
      <div className="flex items-center gap-1 mb-6 border-b border-[rgba(255,255,255,0.06)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm transition-colors ${
              activeTab === tab
                ? "text-white"
                : "text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.02)]"
            } rounded-t-lg`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Form container with glass-card */}
      <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm p-6">
        {/* Basic section */}
        <div>
          <h2 className="text-base font-semibold text-white mb-1">Básico</h2>
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">Dê um nome, descrição e avatar ao seu agente</p>

          {showBanner && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 mb-4">
              <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-sm text-amber-200/70">
                Defina a identidade do seu agente atribuindo um nome e função. Um papel bem definido agiliza as operações e garante que o agente atenda a requisitos específicos.
              </p>
              <button onClick={() => setShowBanner(false)} className="text-amber-400/60 hover:text-amber-300">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Avatar / Image preview area */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Aparência</label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] flex items-center justify-center overflow-hidden">
                  {avatarMode === "avatar" ? (
                    <User size={32} className="text-[rgba(255,255,255,0.5)]" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-[rgba(255,255,255,0.5)]">
                      <span className="text-[10px]">Sem imagem</span>
                    </div>
                  )}
                </div>
                {/* Toggle buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAvatarMode("avatar")}
                      className={`rounded-lg border px-4 py-1.5 text-sm transition-colors ${
                        avatarMode === "avatar"
                          ? "border-indigo-400/50 bg-indigo-500/10 text-indigo-300"
                          : "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
                      }`}
                    >
                      Avatar
                    </button>
                    <button
                      onClick={() => setAvatarMode("imagem")}
                      className={`rounded-lg border px-4 py-1.5 text-sm transition-colors ${
                        avatarMode === "imagem"
                          ? "border-indigo-400/50 bg-indigo-500/10 text-indigo-300"
                          : "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
                      }`}
                    >
                      Imagem
                    </button>
                  </div>
                  {avatarMode === "imagem" && (
                    <button disabled title="Upload de imagem em breve" className="rounded-lg border border-dashed border-[rgba(255,255,255,0.15)] px-4 py-1.5 text-xs text-[rgba(255,255,255,0.4)] hover:border-indigo-400/40 hover:text-indigo-300 transition-colors opacity-50 cursor-not-allowed">
                      + Fazer upload
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Nome*</label>
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Descrição</label>
              <textarea
                placeholder="Insira uma breve descrição do propósito e das tarefas do agente."
                rows={3}
                className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none resize-none transition-colors focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Categoria</label>
              <div className="relative">
                <select className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-[rgba(255,255,255,0.4)] outline-none appearance-none transition-colors focus:border-indigo-400/60">
                  <option value="">Selecione uma categoria</option>
                  <option>Marketing</option>
                  <option>Finanças e Contabilidade</option>
                  <option>Recursos Humanos</option>
                  <option>Operações</option>
                  <option>Vendas</option>
                  <option>Suporte ao Cliente</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)] pointer-events-none" />
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
                disabled={saved}
                className={`rounded-lg transition-colors px-5 py-2 text-sm font-medium text-white shadow-md ${saved ? "bg-emerald-600 shadow-emerald-500/20" : "bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20"}`}
              >
                {saved ? "✓ Salvo" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
