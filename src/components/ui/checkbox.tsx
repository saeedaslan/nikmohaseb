"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-border text-accent-green",
        "focus:ring-accent-green focus:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
}
