// src/types/common.ts
// Shared types used across the entire application

// ─── Pagination ────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── API Response ──────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ─── Directions & Trends ──────────────────────────────────
export type TrendDirection = 'up' | 'down' | 'neutral';

export type Severity = 'critico' | 'alto' | 'medio' | 'baixo' | 'info';

export type Priority = 'alta' | 'media' | 'baixa';

// ─── Date / Time ──────────────────────────────────────────
/** ISO 8601 string */
export type ISODateString = string;

/** Display-friendly relative time string (e.g., "ha 3h") */
export type RelativeTimeString = string;

/** Month label used in chart data (e.g., "Mar/26") */
export type MonthLabel = string;

// ─── KPI Card ─────────────────────────────────────────────
export interface KpiCard {
  label: string;
  valor: string;
  sub?: string;
  icon?: string;
  variacao?: string;
  direcao?: TrendDirection;
  periodo?: string;
  departamento?: string;
  emoji?: string;
}

// ─── Supabase Row Helpers ─────────────────────────────────
/** Extracts the Row type from a Supabase table definition */
export type Row<T extends { Row: unknown }> = T['Row'];

/** Extracts the Insert type from a Supabase table definition */
export type Insert<T extends { Insert: unknown }> = T['Insert'];

/** Extracts the Update type from a Supabase table definition */
export type Update<T extends { Update: unknown }> = T['Update'];

// ─── Utility Types ────────────────────────────────────────
/** Makes specific keys optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Ensure at least one property is present */
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/** Brand type for nominal typing */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** UUID branded type */
export type UUID = Brand<string, 'UUID'>;

/** Tenant ID branded type */
export type TenantId = Brand<string, 'TenantId'>;
