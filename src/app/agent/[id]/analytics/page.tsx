import { AppHeader } from "@/components/AppHeader";
import { AgentAnalyticsContent } from "@/components/AgentAnalyticsContent";

export default function AgentAnalyticsPage() {
  return (
    <>
      <AppHeader title="Análises" parent="Leo — Agente Financeiro" />
      <div className="flex-1 overflow-auto">
        <AgentAnalyticsContent />
      </div>
    </>
  );
}
