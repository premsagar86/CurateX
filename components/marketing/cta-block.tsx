// CTA block — page-level conversion prompt. Every marketing page ends with
// exactly one of these — never zero, never competing multiple CTAs at the
// same visual weight (§19 UX rule). PLAN.md §16.5.
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBlock({
  heading = "Ready to talk about your project?",
  support = "Tell us what you're building — we'll respond within one business day.",
  ctaLabel = "Get a quote",
  ctaHref = "/contact",
}: {
  heading?: string;
  support?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="mx-auto max-w-container px-6 py-16 text-center">
      <h2 className="font-display text-2xl md:text-3xl">{heading}</h2>
      <p className="mx-auto mt-3 max-w-md text-text-muted">{support}</p>
      <Link href={ctaHref} className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
        {ctaLabel}
      </Link>
    </div>
  );
}
