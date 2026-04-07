import { AppHeader } from "@/components/AppHeader";
import { AgentTasksContent } from "@/components/AgentTasksContent";

export default function AgentTasksPage() {
  return (
    <>
      <AppHeader title="Tarefas" parent="Leo — Agente Financeiro" />
      <div className="flex-1 overflow-auto">
        <AgentTasksContent />
      </div>
    </>
  );
}
