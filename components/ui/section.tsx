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
    <section className={cn("section-y mx-auto max-w-container px-6", className)} {...props}>
      {(eyebrow || heading || body) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
          )}
          {heading && <h2 className="text-balance font-display text-2xl md:text-3xl">{heading}</h2>}
          {body && <p className="mt-3 max-w-prose leading-relaxed text-text-muted">{body}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
