import { Section } from "@/components/ds/Section";
import { SPACING_SCALE } from "@/data/ds-data";

export function PatternsSection() {
  return (
    <Section id="patterns" label="Patterns" heading="Patterns">
      <div className="space-y-16">
        <div className="glass-surface rounded-2xl p-8 md:p-12 flex flex-col gap-4 items-start">
          <p className="text-xs font-medium tracking-widest uppercase text-white/50">Gradient Text</p>
          <p className="gradient-text font-semibold leading-none" style={{ fontSize: "clamp(32px, 6vw, 72px)", letterSpacing: "-2px" }}>Intelligence that moves.</p>
          <p className="text-sm text-white/50 font-mono">.gradient-text — white-to-transparent diagonal gradient via background-clip</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Glass Layers</p>
          <div className="relative h-52 max-w-sm">
            <div className="glass absolute top-0 left-0 right-8 bottom-8 rounded-2xl border border-white/5 flex items-end p-4"><span className="text-xs text-white/20">Layer 3 — .glass</span></div>
            <div className="glass-light absolute top-4 left-4 right-4 bottom-4 rounded-2xl border border-white/8 flex items-end p-4"><span className="text-xs text-white/40">Layer 2 — .glass-light</span></div>
            <div className="glass-surface absolute top-8 left-8 right-0 bottom-0 rounded-2xl flex items-end p-4"><span className="text-xs text-white/50">Layer 1 — .glass-surface</span></div>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Dot Grid</p>
          <div className="dot-grid relative rounded-2xl border border-white/5 overflow-hidden">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, oklch(0 0 0 / 60%) 100%)" }} />
            <div className="relative flex flex-col items-center justify-center py-16 text-center gap-2">
              <p className="text-sm font-medium tracking-widest uppercase text-white/50">.dot-grid</p>
              <p className="text-2xl font-semibold tracking-tight text-white/80">Subtle depth through pattern</p>
              <p className="text-sm text-white/50">24px grid of 1px radial-gradient dots</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Spacing Scale</p>
          <div className="space-y-3">
            {SPACING_SCALE.map(({ px, label }) => (
              <div key={px} className="flex items-center gap-4">
                <span className="text-xs text-white/40 tabular-nums w-8 text-right shrink-0 font-mono">{label}</span>
                <div className="h-2 rounded-full kairus-gradient opacity-70" style={{ width: `${px}px`, minWidth: `${px}px` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
