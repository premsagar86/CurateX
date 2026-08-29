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
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span aria-hidden className="relative block h-3.5 w-4">
          <span
            className={`absolute left-0 top-0 h-0.5 w-4 bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`absolute left-0 bottom-0 h-0.5 w-4 bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-[var(--z-drawer)] max-h-[calc(100svh_-_var(--nav-h))] overflow-y-auto border-b border-white/10 bg-[#0d0b09]/95 px-6 py-5 backdrop-blur-xl">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-white/80 transition-colors duration-200 ease-out hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-1 font-medium text-white/80 transition-colors duration-200 ease-out hover:text-primary"
            >
              Log in
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
