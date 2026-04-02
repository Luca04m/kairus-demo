'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AuthChangeEvent, Session as SupabaseSession, SupabaseClient } from '@supabase/supabase-js';
import type { AuthStatus, Session, User, Tenant, LoginCredentials } from '@/types/auth';

// ---- State ----
interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  tenant: Tenant | null;
  error: string | null;
}

// ---- Actions ----
interface AuthActions {
  setSession: (session: Session | null) => void;
  signIn: (client: SupabaseClient, credentials: LoginCredentials) => Promise<void>;
  signOut: (client: SupabaseClient) => Promise<void>;
  initialize: (client: SupabaseClient) => () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  status: 'loading',
  session: null,
  user: null,
  tenant: null,
  error: null,
};

/**
 * Zustand auth store.
 *
 * NOTE: This store requires a SupabaseClient to be passed into actions.
 * The client comes from SupabaseProvider context, not created internally,
 * to ensure a single shared client instance across the app.
 */
export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setSession: (session) => {
      if (session) {
        set({
          status: 'authenticated',
          session,
          user: session.user,
          tenant: session.tenant,
          error: null,
        });
      } else {
        set({
          status: 'unauthenticated',
          session: null,
          user: null,
          tenant: null,
          error: null,
        });
      }
    },

    signIn: async (client, credentials) => {
      set({ status: 'loading', error: null });
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          set({ status: 'error', error: error.message });
          return;
        }

        if (data.session) {
          const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('*, tenants(*)')
            .eq('id', data.session.user.id)
            .single();

          if (profileError || !profile) {
            set({ status: 'error', error: 'Failed to load user profile.' });
            return;
          }

          const session: Session = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at ?? 0,
            user: profile as unknown as User,
            tenant: profile.tenants as unknown as Tenant,
          };

          get().setSession(session);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error during sign in.';
        set({ status: 'error', error: message });
      }
    },

    signOut: async (client) => {
      try {
        await client.auth.signOut();
        set({ ...initialState, status: 'unauthenticated' });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error during sign out.';
        set({ error: message });
      }
    },

    initialize: (client) => {
      // Check initial session
      client.auth.getSession().then(({ data: { session } }: { data: { session: SupabaseSession | null } }) => {
        if (session) {
          client
            .from('profiles')
            .select('*, tenants(*)')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }: { data: Record<string, unknown> | null }) => {
              if (profile) {
                get().setSession({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
                  expires_at: session.expires_at ?? 0,
                  user: profile as unknown as User,
                  tenant: (profile as Record<string, unknown>).tenants as unknown as Tenant,
                });
              } else {
                set({ status: 'unauthenticated' });
              }
            });
        } else {
          set({ status: 'unauthenticated' });
        }
      });

      // Subscribe to auth changes
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: SupabaseSession | null) => {
        if (session) {
          client
            .from('profiles')
            .select('*, tenants(*)')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }: { data: Record<string, unknown> | null }) => {
              if (profile) {
                get().setSession({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
                  expires_at: session.expires_at ?? 0,
                  user: profile as unknown as User,
                  tenant: (profile as Record<string, unknown>).tenants as unknown as Tenant,
                });
              }
            });
        } else {
          get().setSession(null);
        }
      });

      return () => subscription.unsubscribe();
    },

    clearError: () => set({ error: null }),
  })),
);
