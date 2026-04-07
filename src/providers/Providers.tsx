"use client";

import { type ReactNode } from "react";
import { SupabaseProvider } from "./SupabaseProvider";
import { AuthProvider } from "./AuthProvider";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { CommandPalette } from "@/components/CommandPalette";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

/**
 * Root providers wrapper.
 * Order: Supabase (client) -> Auth (session) -> Toast (UI notifications) -> ErrorBoundary
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <KeyboardShortcuts />
            <CommandPalette />
            <ServiceWorkerRegistrar />
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
