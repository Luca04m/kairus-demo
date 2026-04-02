import { AppHeader } from "@/components/AppHeader";
import { AgentSettingsContent } from "@/components/AgentSettingsContent";

export default function AgentSettingsPage() {
  return (
    <>
      <AppHeader title="Configurações" parent="Agente sem titulo" />
      <div className="flex-1 overflow-auto">
        <AgentSettingsContent />
      </div>
    </>
  );
}
