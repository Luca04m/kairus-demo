import { AppHeader } from "@/components/AppHeader";
import { AgentChatContent } from "@/components/AgentChatContent";
import Link from "next/link";

const VALID_AGENTS: Record<string, { nome: string; titulo: string; agentId: string }> = {
  "demo-agent": { nome: "Leo — Vendas", titulo: "Chat", agentId: "ecommerce" },
  leo: { nome: "Leo — Vendas", titulo: "Chat", agentId: "ecommerce" },
  ecommerce: { nome: "Leo — Vendas", titulo: "Chat", agentId: "ecommerce" },
  rex: { nome: "Rex — Financeiro", titulo: "Chat", agentId: "financeiro" },
  financeiro: { nome: "Rex — Financeiro", titulo: "Chat", agentId: "financeiro" },
  mia: { nome: "Mia — Marketing", titulo: "Chat", agentId: "orquestrador" },
  sol: { nome: "Sol — Suporte", titulo: "Chat", agentId: "estoque" },
  estoque: { nome: "Sol — Suporte", titulo: "Chat", agentId: "estoque" },
  iris: { nome: "Iris — Dados", titulo: "Chat", agentId: "orquestrador" },
  orquestrador: { nome: "Kairus — Orquestrador", titulo: "Chat", agentId: "orquestrador" },
  kairus: { nome: "Kairus — Orquestrador", titulo: "Chat", agentId: "orquestrador" },
};

export default async function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = VALID_AGENTS[id];

  if (!agent) {
    return (
      <>
        <AppHeader title="Agente não encontrado" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-4xl font-bold text-white">404</p>
          <p className="text-sm text-[rgba(255,255,255,0.5)]">
            O agente &ldquo;{id}&rdquo; não foi encontrado.
          </p>
          <Link
            href="/agent-templates"
            className="mt-2 rounded-lg bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.1)] px-5 py-2 text-sm font-medium text-white transition-colors"
          >
            Ver meus agentes
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={agent.titulo} parent={agent.nome} />
      <div className="flex-1 overflow-auto">
        <AgentChatContent initialAgent={agent.agentId} />
      </div>
    </>
  );
}
