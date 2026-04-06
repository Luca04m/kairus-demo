"use client";
import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { SidebarContext } from "./SidebarContext";
/** Routes that should render without the sidebar/shell chrome */
const SHELL_EXCLUDED_ROUTES = ["/login", "/auth/callback"];

interface AppShellClientProps {
  children: React.ReactNode;
}

export function AppShellClient({ children }: AppShellClientProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const contextValue = useMemo(() => ({ toggleSidebar }), [toggleSidebar]);

  // Check if current route should skip the shell layout
  const isExcluded = SHELL_EXCLUDED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // DEMO MODE: do not block rendering on auth loading state.
  // In demo mode Supabase may be paused; the shell renders immediately
  // and auth state hydrates in the background (sidebar/header update reactively).

  // Render without shell for login / auth callback pages
  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="h-full w-full transition-[grid-template-columns] duration-300 grid grid-cols-[1fr] md:grid-cols-[270px_1fr]">
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={handleClose}
          />
        )}

        <AppSidebar mobileOpen={mobileSidebarOpen} onClose={handleClose} />

        <div className="flex h-full flex-col overflow-hidden px-4 pt-4 pb-4 md:px-4 md:pl-0">
          <main className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
