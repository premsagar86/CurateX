// Admin shell — TEAM-role only. middleware.ts only checks for a session
// cookie (edge-compatible); the authoritative session + role check runs
// here, server-side (Node runtime), where Prisma/MySQL access actually
// works. PLAN.md §18.3, §33.1, §24.4, §31.9.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "TEAM") redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-border p-4 md:block">
        <span className="font-display text-lg tracking-tight">forge admin</span>
        {/* TODO: Leads / Clients / Projects / Proposals / Invoices / Content /
            Settings nav — PLAN.md §18.3 */}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
