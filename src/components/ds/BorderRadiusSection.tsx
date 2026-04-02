import { Section } from "@/components/ds/Section";

const RADII = [{ label: "Badge", px: 6 }, { label: "Input", px: 8 }, { label: "Button", px: 12 }, { label: "Card", px: 16 }, { label: "Large", px: 20 }, { label: "Container", px: 24 }, { label: "Pill", px: 9999 }];

export function BorderRadiusSection() {
  return (
    <Section id="radius" label="Border Radius" heading="Radius Scale">
      <div className="flex flex-wrap gap-6 items-end">
        {RADII.map((r) => (
          <div key={r.label} className="flex flex-col items-center gap-3">
            <div className="glass-surface" style={{ width: 64, height: 64, borderRadius: r.px === 9999 ? "9999px" : `${r.px}px`, border: "1px solid rgba(255,255,255,0.10)" }} />
            <div className="text-center"><p className="text-xs font-medium text-white/60">{r.label}</p><p className="text-[11px] text-white/40 mt-0.5 font-mono">{r.px === 9999 ? "9999px" : `${r.px}px`}</p></div>
          </div>
        ))}
      </div>
    </Section>
  );
}
