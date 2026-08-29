// Resolves this deployment's public base URL for Better Auth (server-side).
//
// `NEXT_PUBLIC_APP_URL` alone is fragile on Vercel: it's inlined at build time,
// so a stale/missing value (e.g. the `http://localhost:3000` default) ships in
// the bundle and breaks auth with a hard 500 (origin-check failure). We fall
// back to Vercel's own env so a deploy self-heals even when the var is unset.
//
// Priority:
//   1. NEXT_PUBLIC_APP_URL          — explicit (custom domain); wins when valid
//   2. VERCEL_PROJECT_PRODUCTION_URL — stable production domain
//   3. VERCEL_URL                    — this specific deployment (preview builds)
//   4. http://localhost:3000        — local dev
//
// VERCEL_* are non-NEXT_PUBLIC_ (server-only), so this must not be imported
// into client bundles — use `window.location.origin` there instead.
export function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  const onVercel = Boolean(process.env.VERCEL);

  // Ignore the localhost default when actually running on Vercel.
  if (explicit && !(onVercel && explicit.includes("localhost"))) {
    return explicit;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

// Origins Better Auth should accept for CSRF/origin validation: the resolved
// base URL plus every Vercel URL we might be served from (preview + production).
export function getTrustedOrigins(): string[] {
  const origins = new Set<string>([getBaseUrl()]);
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  return [...origins];
}
