import { WorldView } from "@/components/world/WorldView";
import { AppHeader } from "@/components/AppHeader";

export const metadata = { title: "Mundo" };

export default function WorldPage() {
  return (
    <>
      <AppHeader title="Mundo" />
      <div className="flex-1 overflow-auto">
        <WorldView />
      </div>
    </>
  );
}
