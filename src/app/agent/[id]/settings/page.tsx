import { AppHeader } from "@/components/AppHeader";
import { AgentSettingsContent } from "@/components/AgentSettingsContent";

export default function AgentSettingsPage() {
  return (
    <>
      <AppHeader title="Configurações" parent="Leo — Agente Financeiro" />
      <div className="flex-1 overflow-auto">
        <AgentSettingsContent />
      </div>
    </>
  );
}
