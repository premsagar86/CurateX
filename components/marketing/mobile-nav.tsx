// Mobile nav — collapses the marketing header nav to a hamburger + drawer
// below `md` (§17, §16.6). Small client component, no new dependencies.
"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-border"
      >
        <span aria-hidden>{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-surface px-6 py-4">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-1">
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="py-1 font-medium">
              Log in
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
