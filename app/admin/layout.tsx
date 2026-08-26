// Admin shell — TEAM-role only. middleware.ts only checks for a session
// cookie (edge-compatible); the authoritative session + role check runs
// here, server-side (Node runtime), where Prisma/MySQL access actually
// works. PLAN.md §18.3, §33.1, §24.4, §31.9.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/portal/logout-button";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/proposals", label: "Proposals" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "TEAM") redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-border p-4 md:flex">
        <div>
          <span className="font-display text-lg tracking-tight">forge admin</span>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm hover:bg-surface-elevated">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="text-sm">
          <p className="text-text-muted">{session.user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
