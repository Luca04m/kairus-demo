import { AppHeader } from "@/components/AppHeader";
import { AccountSettingsContent } from "@/components/AccountSettingsContent";

export default function SettingsPage() {
  return (
    <>
      <AppHeader title="Configurações da Conta" />
      <div className="flex-1 overflow-auto">
        <AccountSettingsContent />
      </div>
    </>
  );
}
