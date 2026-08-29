// Applies committed Prisma migrations during a Vercel build — but ONLY for
// production deploys. Preview / PR builds must not run migrations against the
// shared production database, and the DB env vars may not be scoped to them,
// so we skip cleanly there instead of failing the build.
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV ?? "(unset)";

if (env === "production") {
  console.log("[vercel-migrate] production build — running `prisma migrate deploy`");
  execSync("prisma migrate deploy", { stdio: "inherit" });
} else {
  console.log(`[vercel-migrate] VERCEL_ENV=${env} — skipping migrations`);
}
