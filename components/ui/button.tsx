// Button primitive — site.md §12.6 / PLAN.md §16.1, §26.9.
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export const buttonVariants = cva(
  // Labels stay on ONE line (`whitespace-nowrap`) at every width; keep them
  // short. `min-h` + `py` (not a fixed `h`) so nothing clips vertically.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-center font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover text-base",
        secondary: "bg-secondary text-white hover:opacity-90",
        outline: "border border-border bg-transparent hover:bg-surface-elevated",
        ghost: "bg-transparent hover:bg-surface-elevated",
        destructive: "bg-error text-white hover:opacity-90",
      },
      size: {
        sm: "min-h-9 px-3 py-1.5 text-sm",
        md: "min-h-11 px-4 py-2",
        lg: "min-h-12 px-6 py-2.5 text-base sm:text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? "…" : children}
    </button>
  )
);
Button.displayName = "Button";
