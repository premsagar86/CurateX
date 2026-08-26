// Card primitive — PLAN.md §16.4. Never nests another Card directly inside a
// Card (§16.4 content rule) — that's a usage convention, not enforced here.
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        interactive && "transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
