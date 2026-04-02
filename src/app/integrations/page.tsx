import { AppHeader } from "@/components/AppHeader";
import { IntegrationsContent } from "@/components/IntegrationsContent";

export default function IntegrationsPage() {
  return (
    <>
      <AppHeader title="Integrações" />
      <div className="flex-1 overflow-auto">
        <IntegrationsContent />
      </div>
    </>
  );
}
