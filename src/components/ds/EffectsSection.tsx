import { Section } from "@/components/ds/Section";

const GLOW_COLORS = [
  { name: "Red", color: "#ff3b30" },
  { name: "Orange", color: "#ff9500" },
  { name: "Yellow", color: "#ffcc00" },
  { name: "Green", color: "#34c759" },
  { name: "Teal", color: "#00c7be" },
  { name: "Blue", color: "#007aff" },
  { name: "Indigo", color: "#5856d6" },
  { name: "Purple", color: "#af52de" },
];

export function EffectsSection() {
  return (
    <Section id="effects" label="Effects" heading="Gradients">
      <div className="mb-16">
        <p className="text-xs text-white/50 mb-4">Gradient Text</p>
        <h3 className="gradient-text text-4xl md:text-5xl font-semibold tracking-tight leading-tight">Agentes que pensam, sistemas que executam</h3>
      </div>
      <div className="mb-16">
        <p className="text-xs text-white/50 mb-4">Card Gradient</p>
        <div className="rounded-2xl p-8 max-w-xs" style={{ background: "linear-gradient(104deg, rgba(253,253,253,0.05) 5%, rgba(240,240,228,0.1) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h4 className="text-base font-medium mb-2">Card Gradient</h4>
          <p className="text-[13px] text-white/50 font-mono leading-relaxed">linear-gradient(104deg,<br />rgba(253,253,253,0.05) 5%,<br />rgba(240,240,228,0.1) 100%)</p>
        </div>
      </div>
      <div className="mb-16">
        <p className="text-xs text-white/60 mb-6">Glow</p>
        <div className="flex gap-6 flex-wrap">
          {GLOW_COLORS.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `color-mix(in srgb, ${item.color} 6%, transparent)`, border: `1.5px solid color-mix(in srgb, ${item.color} 30%, transparent)`, boxShadow: `0 0 20px color-mix(in srgb, ${item.color} 35%, transparent), 0 0 40px color-mix(in srgb, ${item.color} 20%, transparent)` }}>
                <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-white/50 mb-4">Rainbow Strip</p>
        <div className="h-1 w-full rounded-full kairus-gradient" />
      </div>
    </Section>
  );
}
