import { AppHeader } from "@/components/AppHeader";
import { AgentTemplatesContent } from "@/components/AgentTemplatesContent";

export default function AgentTemplatesPage() {
  return (
    <>
      <AppHeader title="Modelos de Agente" />
      <div className="flex-1 overflow-auto">
        <AgentTemplatesContent />
      </div>
    </>
  );
}
