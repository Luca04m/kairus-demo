import { AppHeader } from "@/components/AppHeader";
import { AgentChatContent } from "@/components/AgentChatContent";
import Link from "next/link";

const VALID_AGENT_ID = "demo-agent";

export default async function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id !== VALID_AGENT_ID) {
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
            className="mt-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 px-5 py-2 text-sm font-medium text-white transition-colors"
          >
            Ver meus agentes
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Chat" parent="Leo — Agente Financeiro" />
      <div className="flex-1 overflow-auto">
        <AgentChatContent />
      </div>
    </>
  );
}
