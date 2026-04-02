import { Section } from "@/components/ds/Section";
import { ArrowRight } from "lucide-react";

export function GlassShowcaseSection() {
  return (
    <Section id="glass" label="Glass" heading="Glass Effects">
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12" style={{ background: "linear-gradient(135deg, rgba(10,30,60,0.9) 0%, rgba(20,50,100,0.7) 40%, rgba(30,60,120,0.5) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="pointer-events-none absolute top-[-40px] left-[-40px] w-64 h-64 rounded-full" style={{ background: "rgba(30,80,180,0.15)", filter: "blur(80px)" }} />
        <div className="pointer-events-none absolute bottom-[-40px] right-[-40px] w-64 h-64 rounded-full" style={{ background: "rgba(40,100,200,0.12)", filter: "blur(80px)" }} />
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-white/50 mb-3">.glass-nav — Floating navigation pill</p>
            <div className="glass-nav inline-flex items-center gap-1 rounded-full px-4 py-2.5">
              <span className="text-xs font-semibold text-white/90 mr-2">Kairus</span>
              {["Tokens", "Colors", "Motion"].map((l) => (<span key={l} className="rounded-full px-3 py-1 text-xs text-white/50">{l}</span>))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-white/50 mb-3">.glass-light — Secondary button surface</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="glass-light inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-white/80" style={{ boxShadow: "rgba(255,255,255,0.1) 0 0 0 1px inset" }}>Secondary</button>
              <button type="button" className="glass-light inline-flex size-11 items-center justify-center rounded-full text-white/70" style={{ boxShadow: "rgba(255,255,255,0.1) 0 0 0 1px inset" }} aria-label="Next"><ArrowRight size={14} /></button>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-white/50 mb-3">.glass-card — Content card surface</p>
            <div className="glass-card rounded-2xl p-5 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-kairus-green/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-kairus-green" /></div>
                <div><p className="text-sm font-medium text-white/80">Agent Active</p><p className="text-[11px] text-white/50">Orquestração running</p></div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-mono">backdrop-filter: blur(12px) saturate(180%)<br />background: rgba(255,255,255,0.05)</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
