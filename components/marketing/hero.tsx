// Hero — above-the-fold page opener. Layout component only; every page in
// §20 defines its own hero copy. PLAN.md §16.5.
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { ReactNode } from "react";

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
    <div className="mx-auto flex max-w-container flex-col items-center gap-6 px-6 py-16 text-center md:py-24">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
      <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-5xl">{headline}</h1>
      {subhead && <p className="mx-auto max-w-2xl text-lg text-text-muted">{subhead}</p>}
      <div className="flex flex-wrap justify-center gap-3">
        <Link href={primaryCta.href} className={buttonVariants({ size: "lg" })}>
          {primaryCta.label}
        </Link>
        {secondaryCta && (
          <Link href={secondaryCta.href} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {secondaryCta.label}
          </Link>
        )}
      </div>
      {visual && <div className="mt-4 w-full max-w-3xl">{visual}</div>}
    </div>
  );
}
