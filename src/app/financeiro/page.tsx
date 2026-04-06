"use client";
import dynamic from "next/dynamic";
import { AppHeader } from "@/components/AppHeader";

const FinanceiroContent = dynamic(
  () => import("@/components/FinanceiroContent").then((m) => m.FinanceiroContent),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-lg m-6" />,
  }
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
