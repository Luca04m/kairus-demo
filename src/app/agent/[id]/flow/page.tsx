import { AppHeader } from "@/components/AppHeader";
import { AgentFlowContent } from "@/components/AgentFlowContent";

export default function AgentFlowPage() {
  return (
    <>
      <AppHeader title="Flow" parent="Agente sem titulo" />
      <AgentFlowContent />
    </>
  );
}
