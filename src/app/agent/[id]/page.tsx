import { AppHeader } from "@/components/AppHeader";
import { AgentChatContent } from "@/components/AgentChatContent";

export default function AgentChatPage() {
  return (
    <>
      <AppHeader title="Chat" parent="Agente sem titulo" badge="% 0" />
      <div className="flex-1 overflow-auto">
        <AgentChatContent />
      </div>
    </>
  );
}
