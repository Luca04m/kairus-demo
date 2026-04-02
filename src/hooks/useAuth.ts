'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSupabaseClient } from '@/providers/SupabaseProvider';
import type { LoginCredentials } from '@/types/auth';

/**
 * Hook wrapping authStore with convenient auth methods.
 * Initializes the auth listener on mount.
 * Gets the Supabase client from SupabaseProvider context.
 */
export function useAuth() {
  const supabase = useSupabaseClient();

  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const tenant = useAuthStore((s) => s.tenant);
  const session = useAuthStore((s) => s.session);
  const error = useAuthStore((s) => s.error);

  const initialize = useAuthStore((s) => s.initialize);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);
  const clearError = useAuthStore((s) => s.clearError);

  useEffect(() => {
    if (!supabase) {
      // Supabase not configured -- mark as unauthenticated
      useAuthStore.setState({ status: 'unauthenticated' });
      return;
    }
    const unsubscribe = initialize(supabase);
    return unsubscribe;
  }, [initialize, supabase]);

  return {
    // State
    status,
    user,
    tenant,
    session,
    error,

    // Derived
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',

    // Actions
    signIn: (credentials: LoginCredentials) => {
      if (!supabase) throw new Error('Supabase not configured');
      return signIn(supabase, credentials);
    },
    signOut: () => {
      if (!supabase) throw new Error('Supabase not configured');
      return signOut(supabase);
    },
    clearError: () => clearError(),
  };
}
