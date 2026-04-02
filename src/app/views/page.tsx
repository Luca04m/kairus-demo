import { AppHeader } from "@/components/AppHeader";
import { ViewsContent } from "@/components/ViewsContent";

export default function ViewsPage() {
  return (
    <>
      <AppHeader title="Visualizações" />
      <div className="flex-1 overflow-auto">
        <ViewsContent />
      </div>
    </>
  );
}
