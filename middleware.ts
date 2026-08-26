// Auth/role route protection — runs before any protected page or Route
// Handler. See PLAN.md §24.4 / §26.1 and site.md §2.4.
//
// This only does an optimistic, edge-compatible cookie-presence check
// (Better Auth's full auth.api.getSession() pulls in Node-only APIs — DB
// access, jose's CompressionStream, etc. — that can't run in the Edge
// runtime middleware executes in). The authoritative session + role check
// happens server-side in app/(portal)/layout.tsx and app/admin/layout.tsx,
// which run in the Node.js runtime where Prisma/MySQL actually work. A
// request with a stale/invalid cookie still reaches those layouts safely —
// this middleware only short-circuits the common case (no cookie at all).
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED = ["/dashboard", "/projects", "/invoices", "/settings", "/admin"];

export function middleware(req: NextRequest) {
  const isProtected = PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
