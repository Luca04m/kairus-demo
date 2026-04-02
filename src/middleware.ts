import { NextResponse, type NextRequest } from "next/server";

// DEMO MODE: middleware is a no-op — Supabase project may be paused,
// so skipping auth checks to avoid hanging requests server-side.
// Re-enable by restoring the updateSession call.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets (svg, png, jpg, jpeg, gif, webp)
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
