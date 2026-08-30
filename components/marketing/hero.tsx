// Hero — above-the-fold page opener. Layout component only; every page in
// §20 defines its own hero copy. PLAN.md §16.5.
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// Long, specific CTA labels ("Get a quote for Website Design & Development")
// overflow a fixed-height pill on narrow screens. This lets the button wrap
// and grow, and steps the type down below sm so it always stays in the box.
const heroCtaClass =
  "h-auto min-h-12 w-full max-w-full whitespace-normal py-2.5 text-center text-base leading-tight sm:w-auto sm:text-lg";

export interface HeroProps {
  eyebrow?: string;
  headline: ReactNode;
  subhead?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  visual?: ReactNode;
}

export function Hero({ eyebrow, headline, subhead, primaryCta, secondaryCta, visual }: HeroProps) {
  return (
    <div className="mx-auto flex max-w-container flex-col items-center gap-5 px-6 py-12 text-center md:py-16">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
      <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-5xl">{headline}</h1>
      {subhead && <p className="mx-auto max-w-2xl text-lg text-text-muted">{subhead}</p>}
      <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
        <Link href={primaryCta.href} className={cn(buttonVariants({ size: "lg" }), heroCtaClass)}>
          {primaryCta.label}
        </Link>
        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), heroCtaClass)}
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
      {visual && <div className="mt-3 w-full max-w-3xl">{visual}</div>}
    </div>
  );
}
