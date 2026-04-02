"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { Section } from "@/components/ds/Section";

export function MotionSection() {
  return (
    <Section id="motion" label="Motion" heading="Animations">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-4 glass-card rounded-2xl p-8">
          <div className="flex flex-col gap-3 w-full items-center">
            <div style={{ width: 192, height: 12, borderRadius: 6, backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite linear" }} />
            <div style={{ width: 144, height: 12, borderRadius: 6, backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite linear" }} />
          </div>
          <div className="text-center"><p className="text-sm font-medium text-white/70">Shimmer</p><p className="text-[11px] text-white/50 mt-1 font-mono">CSS linear — loading skeleton</p></div>
        </div>
        <div className="flex flex-col items-center gap-4 glass-card rounded-2xl p-8">
          <motion.div className="glass-light rounded-xl px-6 py-3 text-sm text-white/70" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring.gentle}>Aparece ao scroll</motion.div>
          <div className="text-center"><p className="text-sm font-medium text-white/70">Spring Entrance</p><p className="text-[11px] text-white/50 mt-1 font-mono">spring(120, 30) — smooth deceleration</p></div>
        </div>
        <div className="flex flex-col items-center gap-4 glass-card rounded-2xl p-8">
          <div className="flex items-center gap-2">
            <motion.div className="w-3 h-3 rounded-full bg-kairus-green" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} />
            <span className="text-sm text-white/70">Online</span>
          </div>
          <div className="text-center"><p className="text-sm font-medium text-white/70">Pulse</p><p className="text-[11px] text-white/50 mt-1 font-mono">opacity loop — subtle presence</p></div>
        </div>
        <div className="flex flex-col items-center gap-4 glass-card rounded-2xl p-8">
          <motion.button type="button" className="glass-light rounded-xl px-6 py-3 text-sm text-white/70 border border-white/10" style={{ boxShadow: "rgba(255,255,255,0.1) 0 0 0 1px inset" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring.snappy}>Hover me</motion.button>
          <div className="text-center"><p className="text-sm font-medium text-white/70">Spring Hover</p><p className="text-[11px] text-white/50 mt-1 font-mono">spring(300, 30) — crisp feedback</p></div>
        </div>
      </div>
    </Section>
  );
}
