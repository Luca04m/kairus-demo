"use client";

import { motion } from "motion/react";
import { spring, stagger } from "@/lib/motion";

export function Section({
  id, label, heading, children, first, animated = true,
}: {
  id: string; label: string; heading: string; children: React.ReactNode; first?: boolean; animated?: boolean;
}) {
  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated ? {
    initial: "initial" as const,
    whileInView: "animate" as const,
    viewport: { once: true, margin: "-100px" },
    variants: stagger.container,
  } : {};

  return (
    <section id={id} className={`py-24 md:py-32 ${first ? "" : "border-t border-white/5"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring.gentle}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-white/40 mb-3">{label}</p>
          <h2 style={{ font: 'var(--text-h2)', letterSpacing: 'var(--tracking-h2)' }} className="gradient-text">{heading}</h2>
        </motion.div>
        <Wrapper {...wrapperProps}>
          {children}
        </Wrapper>
      </div>
    </section>
  );
}
