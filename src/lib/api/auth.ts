import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  tenantId: string;
}

/** Check if the app is running in demo mode (no Supabase configured) */
export function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

/**
 * Authenticates the request and returns the Supabase client,
 * user ID, and tenant ID. Returns a NextResponse error if unauthorized.
 * In demo mode (no Supabase env vars), returns a mock auth context so
 * API routes can proceed without a real auth backend.
 */
export async function getAuthContext(): Promise<AuthContext | NextResponse> {
  // Demo mode: bypass auth when Supabase is not configured
  if (isDemoMode()) {
    const supabase = await createClient();
    return {
      supabase,
      userId: "demo-user-id",
      tenantId: "demo-tenant-id",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED", status: 401 } },
      { status: 401 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.tenant_id) {
    return NextResponse.json(
      { data: null, error: { message: "Profile not found", code: "PROFILE_NOT_FOUND", status: 401 } },
      { status: 401 },
    );
  }

  return { supabase, userId: user.id, tenantId: profile.tenant_id };
}

/** Type guard to check if getAuthContext returned an error response */
export function isAuthError(result: AuthContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

/** Standard error response */
export function errorResponse(message: string, status: number, code?: string) {
  return NextResponse.json(
    { data: null, error: { message, code: code ?? "ERROR", status } },
    { status },
  );
}

/** Standard cache headers for authenticated GET responses (browser-only, not CDN) */
export const PRIVATE_CACHE_HEADERS = {
  'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
};

/** Parse pagination params from URL search params */
export function parsePagination(searchParams: URLSearchParams) {
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "20", 10), 1), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);
  return { limit, offset };
}
