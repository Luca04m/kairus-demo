"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/ds-data";

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => { for (const entry of entries) { if (entry.isIntersecting) setActiveSection(entry.target.id); } },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector("a");
      firstLink?.focus();
    }
  }, [mobileOpen]);

  const handleMobileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileOpen(false);
      return;
    }
    if (e.key === "Tab" && mobileMenuRef.current) {
      const links = mobileMenuRef.current.querySelectorAll("a");
      if (links.length === 0) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      <nav className="glass-nav fixed top-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-2.5" aria-label="Design system sections">
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white/70"}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <button type="button" className="flex sm:hidden items-center justify-center size-11 rounded-full text-white/70 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <a href="#hero" className="ml-2 flex items-center" aria-label="Back to top">
          <Image src="/kairus-logo.svg" alt="Kairus" width={64} height={10} />
        </a>
      </nav>
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="glass fixed top-20 left-4 right-4 z-40 flex flex-col gap-1 rounded-2xl p-3 sm:hidden"
          role="menu"
          onKeyDown={handleMobileKeyDown}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a key={link.href} href={link.href} role="menuitem" onClick={() => setMobileOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white/70 hover:bg-white/5"}`}>
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
