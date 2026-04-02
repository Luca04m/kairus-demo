// src/types/auth.ts
// Authentication, user, session, and tenant types

import type { UUID, TenantId, ISODateString } from './common';

// ─── Tenant ───────────────────────────────────────────────
export type PlanTier = 'starter' | 'profissional' | 'enterprise';

export type BillingCycle = 'mensal' | 'anual';

export interface Tenant {
  id: TenantId;
  nome: string;
  segmento: string;
  cnpj: string;
  fundacao: string;
  plan_tier: PlanTier;
  billing_cycle: BillingCycle;
  max_agents: number;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── User ─────────────────────────────────────────────────
export type UserRole = 'owner' | 'admin' | 'operator' | 'viewer';

export interface User {
  id: UUID;
  tenant_id: TenantId;
  email: string;
  nome: string;
  nome_completo: string;
  iniciais: string;
  role: UserRole;
  avatar_url?: string;
  two_factor_enabled: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Session ──────────────────────────────────────────────
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
  tenant: Tenant;
}

// ─── Auth State ───────────────────────────────────────────
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  tenant: Tenant | null;
  error: string | null;
}

// ─── Auth Actions ─────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends LoginCredentials {
  nome_completo: string;
  empresa_nome: string;
  segmento: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  password: string;
}
