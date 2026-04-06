"use client";
import dynamic from "next/dynamic";
import { AppHeader } from "@/components/AppHeader";

const MarketingContent = dynamic(
  () => import("@/components/MarketingContent").then((m) => m.MarketingContent),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-lg m-6" />,
  }
);

export default function MarketingPage() {
  return (
    <>
      <AppHeader title="Marketing" />
      <div className="flex-1 overflow-auto">
        <MarketingContent />
      </div>
    </>
  );
}
