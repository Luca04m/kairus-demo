import { AppHeader } from "@/components/AppHeader";
import { RoiContent } from "@/components/RoiContent";

export default function RoiPage() {
  return (
    <>
      <AppHeader title="ROI / Impacto" />
      <div className="flex-1 overflow-auto">
        <RoiContent />
      </div>
    </>
  );
}
