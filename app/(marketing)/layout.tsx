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
            <Link href="/" className="font-display text-lg tracking-tight text-primary">
              forge
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="text-sm text-white transition-colors hover:text-primary">
                Contact
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-primary/40 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
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
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-ghost text-white/[0.05]"
          >
            forge
          </span>

          <div className="relative mx-auto grid max-w-container gap-10 md:grid-cols-4">
            <div>
              <span className="font-display text-2xl tracking-tight text-white">forge</span>
              <p className="mt-2">Built to last.</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-white">Company</p>
              <ul className="flex flex-col gap-3 text-base">
                <li><Link href="/about" className="text-white transition-colors hover:text-primary">About</Link></li>
                <li><Link href="/process" className="text-white transition-colors hover:text-primary">Process</Link></li>
                <li><Link href="/blog" className="text-white transition-colors hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-white">Work with us</p>
              <ul className="flex flex-col gap-3 text-base">
                <li><Link href="/services" className="text-white transition-colors hover:text-primary">Services</Link></li>
                <li><Link href="/pricing" className="text-white transition-colors hover:text-primary">Pricing</Link></li>
                <li><Link href="/contact" className="text-white transition-colors hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-white">Legal</p>
              <ul className="flex flex-col gap-3 text-base">
                <li><Link href="/privacy" className="text-white transition-colors hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="text-white transition-colors hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>
          <p className="relative mx-auto mt-10 max-w-container opacity-20">© {new Date().getFullYear()} Forge Digital</p>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
