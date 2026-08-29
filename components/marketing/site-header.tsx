// Marketing header — fixed height, single z-index, and a subtle
// backdrop-blur / border that firms up once the page is scrolled. Extracted
// to a client component so the scroll state lives in one place. PLAN.md §16.6.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/marketing/mobile-nav";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative text-sm font-medium text-white/75 transition-colors duration-200 ease-out hover:text-primary focus-visible:text-primary focus-visible:outline-none"
    >
      {label}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full group-focus-visible:w-full"
      />
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[var(--z-header)] h-[var(--nav-h)] border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        scrolled
          ? "border-white/10 bg-[#0d0b09]/92 shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_12px_30px_-18px_rgba(0,0,0,0.6)]"
          : "border-white/5 bg-[#0d0b09]/80"
      }`}
    >
      <nav className="relative mx-auto flex h-full max-w-container items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-primary transition-colors duration-200 ease-out hover:text-primary-hover focus-visible:outline-none"
        >
          forge
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-full border border-primary/40 px-4 text-sm font-medium text-white/90 transition-colors duration-200 ease-out hover:border-primary hover:bg-primary/15 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Log in
          </Link>
        </div>

        <MobileNav />
      </nav>
    </header>
  );
}
