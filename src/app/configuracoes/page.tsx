import { AppHeader } from "@/components/AppHeader";
import { ConfiguracoesContent } from "@/components/ConfiguracoesContent";

export default function ConfiguracoesPage() {
  return (
    <>
      <AppHeader title="Configurações" />
      <div className="flex-1 overflow-auto">
        <ConfiguracoesContent />
      </div>
    </>
  );
}
