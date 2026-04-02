"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { spring } from "@/lib/motion";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center text-center dot-grid px-6">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 0%, oklch(0 0 0) 85%)" }} />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image src="/kairus-logo.svg" alt="Kairus logo" width={170} height={27} sizes="170px" className="mb-2" priority />
        <div><h1 style={{ font: 'var(--text-hero)', letterSpacing: 'var(--tracking-hero)' }} className="gradient-text leading-tight pb-2">Design System</h1></div>
        <p className="max-w-md text-lg text-white/50 mt-2 leading-relaxed">The visual language for AI agent orchestration</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <motion.a
            href="#tokens"
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.snappy}
          >
            Explore Tokens
          </motion.a>
          <motion.a
            href="https://github.com"
            className="glass-light inline-flex h-11 items-center rounded-full px-6 text-sm font-medium text-white/80 transition-colors hover:text-white"
            style={{ boxShadow: "rgba(255,255,255,0.1) 0 0 0 1px inset" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.snappy}
          >
            View Source
          </motion.a>
        </div>
      </div>
      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/20" aria-hidden="true">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </section>
  );
}
