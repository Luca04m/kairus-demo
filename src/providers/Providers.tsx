"use client";

import { type ReactNode } from "react";
import { SupabaseProvider } from "./SupabaseProvider";
import { AuthProvider } from "./AuthProvider";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
