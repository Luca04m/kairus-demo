import { AppHeader } from "@/components/AppHeader";
import { AgentAnalyticsContent } from "@/components/AgentAnalyticsContent";

export default function AgentAnalyticsPage() {
  return (
    <>
      <AppHeader title="Análises" parent="Agente sem titulo" />
      <div className="flex-1 overflow-auto">
        <AgentAnalyticsContent />
      </div>
    </>
  );
}
