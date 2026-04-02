export function Footer() {
  return (
    <footer className="glass-nav mt-auto py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium text-white/70">Kairus Design System v1.0</p>
        <p className="text-xs text-white/40">Built for agents, by agents</p>
        <div className="flex items-center gap-6 mt-2">
          <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">GitHub</a>
          <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
}
