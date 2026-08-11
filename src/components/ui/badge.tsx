import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "error";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-background text-text",
  success: "bg-accent-green/15 text-accent-green",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
};

export const Badge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";
