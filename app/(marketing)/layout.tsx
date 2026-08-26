// Marketing site shell — nav + footer. PLAN.md §16.6, §25.1.
import Link from "next/link";
import { MobileNav } from "@/components/marketing/mobile-nav";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[var(--z-sticky,20)] border-b border-border bg-surface px-6 py-4">
        <nav className="relative mx-auto flex max-w-container items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight">
            forge
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-text-muted hover:text-text">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="text-sm text-text-muted hover:text-text">
              Contact
            </Link>
            <Link href="/login" className="text-sm font-medium">
              Log in
            </Link>
          </div>

          <MobileNav />
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border px-6 py-12 text-sm text-text-muted">
        <div className="mx-auto grid max-w-container gap-8 md:grid-cols-4">
          <div>
            <span className="font-display text-lg tracking-tight text-text">forge</span>
            <p className="mt-2">Built to last.</p>
          </div>
          <div>
            <p className="mb-2 font-medium text-text">Company</p>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/process">Process</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-text">Work with us</p>
            <ul className="flex flex-col gap-2">
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-text">Legal</p>
            <ul className="flex flex-col gap-2">
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-container">© {new Date().getFullYear()} Forge Digital</p>
      </footer>
    </div>
  );
}
