"use client";
import { useState } from "react";
import { VisaoGeralTab } from "./financeiro/VisaoGeralTab";
import { RoiImpactoTab } from "./financeiro/RoiImpactoTab";
import { RelatoriosTab } from "./financeiro/RelatoriosTab";

const TABS = [
  { id: "visao-geral", label: "Visao Geral" },
  { id: "roi-impacto", label: "ROI / Impacto" },
  { id: "relatorios", label: "Relatorios" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function FinanceiroContent() {
  const [activeTab, setActiveTab] = useState<TabId>("visao-geral");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-white">Financeiro</h1>
      {/* Tab switcher */}
      <div className="flex items-center gap-0 border-b border-[rgba(255,255,255,0.08)]">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? "text-white"
                  : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)]"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "visao-geral" && <VisaoGeralTab />}
      {activeTab === "roi-impacto" && <RoiImpactoTab />}
      {activeTab === "relatorios" && <RelatoriosTab />}
    </div>
  );
}
