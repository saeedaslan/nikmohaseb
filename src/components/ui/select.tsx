"use client";

import { cn } from "@/lib/utils";
import { useId, useState, useRef, useEffect } from "react";
import type { SelectHTMLAttributes } from "react";

export function Select({
  className,
  value,
  onValueChange,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  onValueChange?: (value: string) => void;
}) {
  const handle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
    props.onChange?.(e);
  };
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-md border border-border bg-surface-card px-3 py-2 text-sm text-text focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green",
        className,
      )}
      value={value}
      onChange={handle}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ ...props }) {
  return <select {...props} />;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <option value="" disabled hidden>{placeholder}</option>;
}
