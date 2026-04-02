import { AppHeader } from "@/components/AppHeader";
import { FinanceiroContent } from "@/components/FinanceiroContent";

export default function FinanceiroPage() {
  return (
    <>
      <AppHeader title="Financeiro" />
      <div className="flex-1 overflow-auto">
        <FinanceiroContent />
      </div>
    </>
  );
}
