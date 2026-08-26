// Section — the single component responsible for consistent vertical rhythm
// down a page; pages never hand-roll section spacing. PLAN.md §16.5.
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  body?: ReactNode;
}

export function Section({ eyebrow, heading, body, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("mx-auto max-w-container px-6 py-16", className)} {...props}>
      {(eyebrow || heading || body) && (
        <div className="mb-8 max-w-2xl">
          {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
          {heading && <h2 className="font-display text-2xl md:text-3xl">{heading}</h2>}
          {body && <p className="mt-3 text-text-muted">{body}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
