// Scheduled hygiene job — hard-deletes expired sessions (site.md §14.12).
// Phase 1: run manually or via a system cron. Phase 2: wire to Vercel Cron.
import { db } from "@/lib/db";

export async function cleanupExpiredSessions() {
  const { count } = await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  console.log(`Cleaned up ${count} expired session(s).`);
}

if (require.main === module) {
  cleanupExpiredSessions().then(() => process.exit(0));
}
