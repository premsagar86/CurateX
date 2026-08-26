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
    <div className="mx-auto grid max-w-container gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-tight md:text-5xl">{headline}</h1>
        {subhead && <p className="mt-4 max-w-lg text-lg text-text-muted">{subhead}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={primaryCta.href} className={buttonVariants({ size: "lg" })}>
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} className={buttonVariants({ variant: "outline", size: "lg" })}>
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        {visual ?? (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border bg-surface-elevated text-sm text-text-muted">
            Project visual
          </div>
        )}
      </div>
    </div>
  );
}
