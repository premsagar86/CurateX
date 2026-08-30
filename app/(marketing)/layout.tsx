// Marketing site shell — nav + footer. PLAN.md §16.6, §25.1.
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SmoothScrollProvider } from "@/components/home/motion/smooth-scroll-provider";
import { GrainOverlay } from "@/components/home/motion/grain-overlay";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col bg-[#0d0b09]">
        <GrainOverlay />
        <SiteHeader />

        <main className="flex-1 bg-background">{children}</main>

        <footer className="relative overflow-hidden border-t border-home-border bg-[#0d0b09] px-6 py-12 text-sm text-home-muted">
          <span
            aria-hidden
            className="decor-numeral pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-ghost text-white/[0.03]"
          >
            forge
          </span>

          <div className="relative mx-auto grid max-w-container grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-8">
            <div className="col-span-2 md:col-span-1">
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
          <p className="relative mx-auto mt-8 max-w-container opacity-20">© {new Date().getFullYear()} Forge Digital</p>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
