import { Section } from "@/components/ds/Section";

const LEVELS = [
  { label: "Base", desc: "Level 0", bg: "bg-black", border: "border border-white/10" },
  { label: "Surface", desc: "Level 1", bg: "bg-white/[0.03]", border: "border border-white/10" },
  { label: "Card", desc: "Level 2", bg: "bg-white/5", border: "border border-white/10" },
  { label: "Elevated", desc: "Level 3", bg: "bg-white/[0.08]", border: "border border-white/10" },
  { label: "Overlay", desc: "Level 4", bg: "bg-white/[0.12]", border: "border border-white/10" },
];

const BORDERS = [
  { label: "Subtle", desc: "white/6%", style: { border: "1px solid rgba(255,255,255,0.06)" } },
  { label: "Default", desc: "white/10%", style: { border: "1px solid rgba(255,255,255,0.10)" } },
  { label: "Active", desc: "white/16%", style: { border: "1px solid rgba(255,255,255,0.16)" } },
];

export function ElevationSection() {
  return (
    <Section id="elevation" label="Elevation" heading="Elevation System">
      <div className="space-y-12">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Surface Levels</p>
          <div className="flex flex-wrap gap-4">
            {LEVELS.map((l) => (<div key={l.label} className={`flex flex-col items-center gap-3 rounded-2xl p-6 min-w-[100px] flex-1 ${l.bg} ${l.border}`}><div className="text-center"><p className="text-sm font-medium text-white/70">{l.label}</p><p className="text-[11px] text-white/40 mt-1 font-mono">{l.desc}</p></div></div>))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Border Variants</p>
          <div className="flex flex-wrap gap-4">
            {BORDERS.map((b) => (<div key={b.label} className="flex flex-col items-center gap-3 rounded-2xl p-6 min-w-[140px] flex-1 bg-white/[0.03]" style={b.style}><div className="text-center"><p className="text-sm font-medium text-white/70">{b.label}</p><p className="text-[11px] text-white/40 mt-1 font-mono">{b.desc}</p></div></div>))}
          </div>
        </div>
      </div>
    </Section>
  );
}
