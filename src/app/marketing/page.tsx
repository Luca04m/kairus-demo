import dynamic from "next/dynamic";
import { AppHeader } from "@/components/AppHeader";

export const metadata = { title: "Marketing" };

function LoadingFallback() {
  return <div className="h-64 animate-pulse bg-white/5 rounded-lg m-6" />;
}

const MarketingContent = dynamic(
  () => import("@/components/MarketingContent").then((m) => m.MarketingContent),
  { loading: LoadingFallback }
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
