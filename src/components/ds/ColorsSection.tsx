import { Section } from "@/components/ds/Section";
import { COLOR_GROUPS, type ColorGroupItem } from "@/data/ds-data";

function CircleSwatch({ item }: { item: ColorGroupItem }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: item.bg, border: item.border ? "1px solid rgba(255,255,255,0.15)" : undefined, boxShadow: item.glow ? `0 0 20px ${item.glow}` : undefined, flexShrink: 0 }} />
      <div className="text-center">
        <p className="text-[12px] text-white/70 leading-tight">{item.name}</p>
        <p className="text-[11px] text-white/40 mt-0.5 font-mono">{item.value}</p>
      </div>
    </div>
  );
}

export function ColorsSection() {
  return (
    <Section id="colors" label="Colors" heading="Color Palette">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-medium text-white/80 mb-5">{group.title}</h3>
            <div className="flex flex-wrap gap-4">{group.items.map((item) => <CircleSwatch key={item.name} item={item} />)}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
