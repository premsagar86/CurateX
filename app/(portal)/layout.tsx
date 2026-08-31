// Authenticated client portal shell — sidebar desktop / bottom-tabs mobile.
// middleware.ts only checks for a session cookie (edge-compatible); the
// authoritative session check runs here, server-side (Node runtime), where
// Prisma/MySQL access actually works. PLAN.md §16.6, §17.2, §20.12, §24.4.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/portal/logout-button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/invoices", label: "Invoices" },
  { href: "/settings", label: "Settings" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-border p-4 md:flex">
        <div>
          <span className="font-display text-lg tracking-tight">forge</span>
          <nav className="mt-6 flex flex-col gap-1">
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

      <main className="portal-content flex-1 p-6 pb-24 md:pb-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 flex border-t border-border bg-surface md:hidden">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="flex flex-1 flex-col items-center gap-1 py-3 text-xs">
            {link.label}
          </Link>
        ))}
        <LogoutButton className="flex flex-1 flex-col items-center gap-1 py-3 text-xs" />
      </nav>
    </div>
  );
}
