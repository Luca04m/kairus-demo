import dynamic from "next/dynamic";
import { AppHeader } from "@/components/AppHeader";

export const metadata = { title: "Financeiro" };

function LoadingFallback() {
  return <div className="h-64 animate-pulse bg-white/5 rounded-lg m-6" />;
}

const FinanceiroContent = dynamic(
  () => import("@/components/FinanceiroContent").then((m) => m.FinanceiroContent),
  { loading: LoadingFallback }
);

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
