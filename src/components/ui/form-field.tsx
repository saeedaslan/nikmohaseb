"use client";

import type { ReactNode } from "react";
import { Controller, type Control, type FieldValues, type FieldPath, type ControllerRenderProps, type FieldError } from "react-hook-form";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  render: (props: { field: any; fieldState: { error?: FieldError } }) => ReactNode;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          {label && <Label htmlFor={name}>{label}</Label>}
          {render({ field, fieldState: { error } })}
          {error?.message && (
            <p className="mt-1 text-xs text-red-600">{error.message}</p>
          )}
          {description && (
            <p className="mt-1 text-xs text-text-muted">{description}</p>
          )}
        </div>
      )}
    />
  );
}

export function FormMessage({
  error,
  className,
}: {
  error?: string;
  className?: string;
}) {
  if (!error) return null;
  return (
    <p className={cn("mt-1 text-xs text-red-600", className)}>{error}</p>
  );
}
