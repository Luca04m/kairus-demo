"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { useSupabaseClient } from "./SupabaseProvider";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

// Hydration-safe mount detection
const subscribeNoop = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydration-safe: false on server, true on client
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!supabase) {
      // Use a microtask to satisfy the lint rule (no sync setState in effect)
      queueMicrotask(() => setLoading(false));
      return;
    }

    let cancelled = false;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (cancelled) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    router.push("/login");
  }, [supabase, router]);

  // During SSR or before mount, render children with loading state
  // to avoid hydration mismatch
  const value: AuthContextType = mounted
    ? { user, session, loading, signOut }
    : { user: null, session: null, loading: true, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
