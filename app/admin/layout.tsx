// Admin shell — TEAM-role only. middleware.ts only checks for a session
// cookie (edge-compatible); the authoritative session + role check runs
// here, server-side (Node runtime), where Prisma/MySQL access actually
// works. PLAN.md §18.3, §33.1, §24.4, §31.9.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { LogoutButton } from "@/components/portal/logout-button";

// Admin is authenticated + per-request by nature (the getSession call below reads
// headers()). Declare it explicitly so `next build` never tries to statically
// prerender any /admin/** page — that would run Prisma with no DATABASE_URL in
// CI. Layout segment config cascades to all nested routes.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "TEAM") redirect("/dashboard");

  const email = session.user.email;
  const initial = (session.user.name || email).charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary font-display text-base text-white">
            f
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base tracking-tight">forge admin</span>
            <span className="text-xs text-text-muted">Team console</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
            Workspace
          </p>
          <AdminNav />
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-md bg-surface-elevated px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-medium text-primary">
              {initial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{session.user.name || "Team"}</span>
              <span className="block truncate text-xs text-text-muted">{email}</span>
            </span>
          </div>
          <LogoutButton className="mt-2 flex w-full items-center justify-center rounded-md border border-border py-2 text-sm font-medium text-text transition-colors hover:bg-surface-elevated" />
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <AdminMobileNav email={email} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-container p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
