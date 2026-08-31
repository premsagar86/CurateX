"use client";

// Mobile-only admin chrome. The desktop sidebar is `hidden md:flex`, so
// without this there is no navigation — and no logout button — under 768px.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/portal/logout-button";

export function AdminMobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-50 md:hidden">
      <div className="relative z-10 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary font-display text-sm text-white">
            f
          </span>
          <span className="font-display text-base tracking-tight">forge admin</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-9 w-9 place-items-center rounded-md border border-border text-text"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-0 bg-black/30"
          />
          <div className="absolute inset-x-0 top-full z-10 max-h-[75vh] overflow-y-auto border-b border-border bg-surface p-4 shadow-lg">
            <AdminNav onNavigate={() => setOpen(false)} />
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-text-muted">Signed in as</span>
                <span className="block truncate text-sm">{email}</span>
              </span>
              <LogoutButton className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-elevated" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
