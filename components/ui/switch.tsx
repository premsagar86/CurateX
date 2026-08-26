// Switch — instant-effect boolean toggle, distinguished from Checkbox by
// intent: takes effect immediately rather than staged until form submit
// (§16.1). Styled native checkbox with role="switch" rather than a Radix
// dependency (none is installed in this project).
"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  loading?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, loading, disabled, className, ...props }, ref) => (
    <label
      className={cn(
        "relative inline-flex h-6 w-11 cursor-pointer items-center",
        (disabled || loading) && "opacity-50",
        className
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        disabled={disabled || loading}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
        {...props}
      />
      <span className="absolute inset-0 rounded-full bg-surface-elevated transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-[22px]" />
    </label>
  )
);
Switch.displayName = "Switch";
