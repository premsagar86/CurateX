// Marketing site shell — nav + footer. PLAN.md §16.6, §25.1.
import Link from "next/link";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { SmoothScrollProvider } from "@/components/home/motion/smooth-scroll-provider";
import { GrainOverlay } from "@/components/home/motion/grain-overlay";

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
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col bg-[#0d0b09]">
        <GrainOverlay />

        <header className="sticky top-0 z-[var(--z-sticky,20)] glass px-6 py-4">
          <nav className="relative mx-auto flex max-w-container items-center justify-between">
            <Link href="/" className="font-display text-lg tracking-tight text-home-text">
              forge
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-home-muted transition-colors hover:text-home-text">
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="text-sm text-home-muted transition-colors hover:text-home-text">
                Contact
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-home-border px-4 py-1.5 text-sm font-medium text-home-text transition-colors hover:bg-white/5"
              >
                Log in
              </Link>
            </div>

            <MobileNav />
          </nav>
        </header>

        <main className="flex-1 bg-background">{children}</main>

        <footer className="relative overflow-hidden border-t border-home-border bg-[#0d0b09] px-6 py-16 text-sm text-home-muted">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-ghost text-white/[0.03]"
          >
            forge
          </span>

          <div className="relative mx-auto grid max-w-container gap-10 md:grid-cols-4">
            <div>
              <span className="font-display text-2xl tracking-tight text-home-text">forge</span>
              <p className="mt-2">Built to last.</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-home-text">Company</p>
              <ul className="flex flex-col gap-2">
                <li><Link href="/about" className="hover:text-home-text">About</Link></li>
                <li><Link href="/process" className="hover:text-home-text">Process</Link></li>
                <li><Link href="/blog" className="hover:text-home-text">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-home-text">Work with us</p>
              <ul className="flex flex-col gap-2">
                <li><Link href="/services" className="hover:text-home-text">Services</Link></li>
                <li><Link href="/pricing" className="hover:text-home-text">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-home-text">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-home-text">Legal</p>
              <ul className="flex flex-col gap-2">
                <li><Link href="/privacy" className="hover:text-home-text">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-home-text">Terms</Link></li>
              </ul>
            </div>
          </div>
          <p className="relative mx-auto mt-10 max-w-container">© {new Date().getFullYear()} Forge Digital</p>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
