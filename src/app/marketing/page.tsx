import { AppHeader } from "@/components/AppHeader";
import { MarketingContent } from "@/components/MarketingContent";

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
