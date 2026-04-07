import { AppHeader } from "@/components/AppHeader";
import { HomeContent } from "@/components/HomeContent";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Visão Geral" />
      <div className="flex-1 overflow-auto">
        <HomeContent />
      </div>
    </>
  );
}
