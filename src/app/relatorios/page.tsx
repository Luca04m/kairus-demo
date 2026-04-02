import { AppHeader } from "@/components/AppHeader";
import { RelatoriosContent } from "@/components/RelatoriosContent";

export default function RelatoriosPage() {
  return (
    <>
      <AppHeader title="Relatórios" />
      <div className="flex-1 overflow-auto">
        <RelatoriosContent />
      </div>
    </>
  );
}
