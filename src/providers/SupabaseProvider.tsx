"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, isClientConfigured } from "@/lib/supabase/client";

type SupabaseContextType = SupabaseClient | null;

const SupabaseContext = createContext<SupabaseContextType>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [client] = useState<SupabaseClient | null>(() => {
    if (!isClientConfigured()) return null;
    return createClient();
  });

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}

/**
 * Returns the Supabase client or null if not configured.
 * Use this over useSupabaseRequired when Supabase may not be available.
 */
export function useSupabaseClient(): SupabaseClient | null {
  return useContext(SupabaseContext);
}

/**
 * Returns the Supabase client. Throws if not configured.
 * Use only in components that require Supabase to function.
 */
export function useSupabase(): SupabaseClient {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error(
      "useSupabase: Supabase client not available. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    );
  }
  return context;
}
