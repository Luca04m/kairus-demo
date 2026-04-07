import { AppHeader } from "@/components/AppHeader";
import { EquipeContent } from "@/components/EquipeContent";

export const metadata = { title: "Equipe" };

export default function EquipePage() {
  return (
    <>
      <AppHeader title="Minha Equipe" />
      <div className="flex-1 overflow-auto">
        <EquipeContent />
      </div>
    </>
  );
}
