# CurateX — Vercel Deployment Guide

Production deploy of CurateX (Next.js 14 · Prisma · Neon Postgres · Better Auth ·
Sentry) to Vercel, using the **Vercel Dashboard + GitHub integration** (auto-deploy
on every push to `main`).

---

## Why the repo is already deploy-ready

- Latest `main` passes GitHub CI (`lint`, `typecheck`, `next build`).
- Every marketing page that reads the database is `export const dynamic = "force-dynamic"`,
  and there is **no `generateStaticParams`** anywhere — so `next build` needs **no
  database connection**.
- Prisma migrations are committed under `prisma/migrations/` (provider = `postgresql`,
  matches Neon).
- `package.json` has a `vercel-build` script:
  `prisma generate && node scripts/vercel-migrate.mjs && next build`.
  `scripts/vercel-migrate.mjs` runs `prisma migrate deploy` **only** when
  `VERCEL_ENV=production` — preview / PR builds skip migrations safely.
- `lib/base-url.ts` resolves the auth base URL from `VERCEL_PROJECT_PRODUCTION_URL` /
  `VERCEL_URL`, so `NEXT_PUBLIC_APP_URL` is optional until you add a custom domain.
- `next.config.js` wraps config in `withSentryConfig({ silent: true })`; with the
  Sentry env vars unset, Sentry no-ops and no `SENTRY_AUTH_TOKEN` is required.

## The one gotcha: `DATABASE_URL` must carry pgbouncer params

On Vercel's serverless / PgBouncer path, the pooled connection string **must**
include `&pgbouncer=true&connection_limit=1`, or Prisma's prepared statements
collide and requests 500. The `DIRECT_URL` (non-pooler host, used by
`prisma migrate deploy`) must **not** have those params.

---

## Step 1 — Local `.env` (parity, local only)

`.env` is gitignored. Ensure `DATABASE_URL` has the pooler params:

```dotenv
DATABASE_URL="postgresql://neondb_owner:npg_5XCqicW9JUMB@ep-misty-bonus-ae7w05x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://neondb_owner:npg_5XCqicW9JUMB@ep-misty-bonus-ae7w05x9.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## Step 2 — Pre-flight build (catch errors before Vercel)

From the repo root:

```bash
npm run build      # prisma generate && next build
npm run typecheck  # optional; source of truth for types
```

Expected: build completes and all marketing routes are listed as `ƒ (Dynamic)`.
Fix any reported error before deploying — do not deploy a red build.

## Step 3 — Create the Vercel project

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. **Import Git Repository** → select **`premsagar86/CurateX`** → **Import**.
   (If it's not listed: "Adjust GitHub App Permissions" → grant access to the repo.)
3. **Framework Preset:** `Next.js` (auto-detected — leave as is).
4. **Root Directory:** `./` (leave as is).
5. Expand **Build and Output Settings** → turn on the **Build Command** override:
   ```
   npm run vercel-build
   ```
   Leave Output Directory and Install Command at their defaults.
6. Do **not** deploy yet — add environment variables first (Step 4). They can be
   added on the import screen before the first build.

## Step 4 — Environment variables

Add all three for **every** environment (Production, Preview, Development):

| Name | Value |
| --- | --- |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_5XCqicW9JUMB@ep-misty-bonus-ae7w05x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | `postgresql://neondb_owner:npg_5XCqicW9JUMB@ep-misty-bonus-ae7w05x9.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | `fe49e9db002c644809f39afd5dd1f901b03bcc7e51b252803dc23d4cc9ecbd40` |

`DATABASE_URL` ends in `&pgbouncer=true&connection_limit=1`; `DIRECT_URL` does not.

> Optionally replace `BETTER_AUTH_SECRET` with a fresh value (`openssl rand -hex 32`)
> for production — the only effect is that existing sessions are invalidated.

**Intentionally omitted** (all empty locally; code handles their absence):
`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`,
`SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_GA_ID`, `SEED_FOUNDER_PASSWORD`
(dev-only seed), `R2_*` and `RAZORPAY_*` (Phase 2, unused).

## Step 5 — Deploy

Click **Deploy**. The first build runs with `VERCEL_ENV=production`, so
`scripts/vercel-migrate.mjs` runs `prisma migrate deploy` against `DIRECT_URL`
(idempotent — skips migrations already applied), then `next build` runs.

## Step 6 — Verify

1. Build log shows
   `[vercel-migrate] production build — running prisma migrate deploy`,
   then a successful `next build`.
2. Open the `*.vercel.app` URL — marketing home renders.
3. Hit DB-backed dynamic routes — e.g. `/services/website-design-development`,
   `/work`, `/blog` — they render with **no 500** (this is what the pgbouncer
   param protects).
4. Go to `/login`, sign in with a seeded founder account — confirms
   `BETTER_AUTH_SECRET` + base-URL resolution work end to end.
5. Check **Vercel → Deployment → Functions / Logs** for runtime errors.

## Step 7 — Custom domain (optional, later)

1. **Vercel → Project → Settings → Domains** → add the domain and set DNS.
2. Add env var `NEXT_PUBLIC_APP_URL=https://<your-domain>` (it's inlined at build
   time) and **redeploy**, so Better Auth's `baseURL` / trusted origins use the
   real domain.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails at `prisma migrate deploy` | Confirm `DIRECT_URL` is the **non-pooler** host and reachable; check the Neon project isn't paused/suspended. |
| Pages 500 at runtime, logs show prepared-statement errors | `DATABASE_URL` is missing `&pgbouncer=true&connection_limit=1` — fix the env var and redeploy. |
| Auth 500 / origin-check failure | Usually a stale `NEXT_PUBLIC_APP_URL`. Leave it unset (self-heals) or set it to the exact production URL and redeploy. |
| Prisma Client not found during build | Build Command isn't `npm run vercel-build` — set the override in project settings. |
| Need to roll back | **Vercel → Deployments** → pick the last green deployment → **Promote to Production**. |

## After the first deploy

Every push to `main` triggers a production deploy automatically; pull requests get
preview deploys (which skip migrations). No further configuration needed.
