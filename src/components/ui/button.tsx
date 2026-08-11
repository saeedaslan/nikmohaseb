"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "soft";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-navy text-white hover:bg-primary-navy-light dark:bg-accent-green dark:hover:bg-accent-green/90",
  secondary: "bg-accent-green text-white hover:bg-accent-green/90",
  accent: "bg-accent-green text-white hover:bg-accent-green/90",
  outline:
    "border border-border bg-surface-card text-text hover:bg-surface-background",
  ghost: "text-text hover:bg-surface-background",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  link: "text-accent-green underline decoration-accent-green/70 hover:text-accent-green/80 p-0",
  soft: "border border-border bg-white text-text-muted hover:bg-surface-background",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-md px-3 text-sm",
  md: "h-11 rounded-md px-4 text-sm",
  lg: "h-12 rounded-lg px-5 text-base",
  icon: "h-10 w-10 rounded-md p-0",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, asChild, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2",
          "disabled:cursor-not-allow disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && (
              <svg
                className="mr-2 -ml-1 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.071 1.893 5.84 4.636 6.928l.666-1.622A7.96 7.96 7.96 0 016 12z"
                />
              </svg>
            )}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
