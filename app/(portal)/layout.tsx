// Authenticated client portal shell — sidebar desktop / bottom-tabs mobile.
// middleware.ts only checks for a session cookie (edge-compatible); the
// authoritative session check runs here, server-side (Node runtime), where
// Prisma/MySQL access actually works. PLAN.md §16.6, §17.2, §20.12, §24.4.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-border p-4 md:block">
        <span className="font-display text-lg tracking-tight">forge</span>
        {/* TODO: Dashboard / Projects / Invoices / Settings nav — PLAN.md §18.2 */}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
