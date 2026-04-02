import { AppHeader } from "@/components/AppHeader";
import { InboxContent } from "@/components/InboxContent";

export default function InboxPage() {
  return (
    <>
      <AppHeader title="Caixa de Entrada" />
      <div className="flex-1 overflow-hidden">
        <InboxContent />
      </div>
    </>
  );
}
