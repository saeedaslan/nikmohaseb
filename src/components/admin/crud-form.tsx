"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { FileUpload, type UploadedFileMeta } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { FieldValues } from "react-hook-form";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "image"
  | "html"
  | "date";

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  options?: { value: string; label: string }[];
  description?: string;
}

export interface AdminFormState {
  ok?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

interface AdminCrudFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  fields: AdminField[];
  serverAction: (fd: FormData) => Promise<AdminFormState>;
  initialData?: Partial<T> & { id?: string };
  redirectTo?: string;
}

interface RenderCtx {
  setValue: any;
  fileStates: Record<string, UploadedFileMeta[]>;
  setFileStates: React.Dispatch<React.SetStateAction<Record<string, UploadedFileMeta[]>>>;
}

function renderField(f: AdminField, field: any, ctx: RenderCtx) {
  const { setValue, fileStates, setFileStates } = ctx;
  switch (f.type) {
    case "textarea":
      return <Textarea {...field} placeholder={f.description} rows={4} />;
    case "number":
      return (
        <Input
          {...field}
          type="number"
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      );
    case "checkbox":
      return (
        <Checkbox
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      );
    case "select":
      return (
        <select
          value={field.value ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
          className="flex h-11 w-full rounded-md border border-border bg-surface-card px-3 py-2 text-sm text-text focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
        >
          <option value="" disabled>
            انتخاب کنید
          </option>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "image": {
      const arr = fileStates[field.name] ?? [];
      return (
        <>
          <input
            type="hidden"
            name={field.name}
            value={field.value ?? ""}
          />
          <FileUpload
            value={arr}
            onChange={(newFiles) =>
              setFileStates((prev) => ({ ...prev, [field.name]: newFiles }))
            }
          />
        </>
      );
    }
    case "html":
      return (
        <Textarea
          {...field}
          placeholder={f.description}
          rows={8}
          className="font-mono text-sm"
        />
      );
    case "date":
      return <Input type="date" {...field} />;
    case "text":
    default:
      return <Input {...field} placeholder={f.description} />;
  }
}

export function AdminCrudForm<T extends FieldValues>({
  schema,
  fields,
  serverAction,
  initialData,
  redirectTo,
}: AdminCrudFormProps<T>) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [fileStates, setFileStates] = useState<Record<string, UploadedFileMeta[]>>(() => {
    const init: Record<string, UploadedFileMeta[]> = {};
    for (const f of fields) {
      if (f.type === "image" && (initialData as any)?.[f.name]) {
        init[f.name] = [
          {
            url: String((initialData as any)[f.name]),
            filename: String((initialData as any)[f.name]),
            originalName: String((initialData as any)[f.name]),
            mime: "image/jpeg",
            size: 0,
          },
        ];
      }
    }
    return init;
  });

  let defaults: any = initialData ?? ({} as any);
  for (const f of fields) {
    if (f.type === "date" && defaults && defaults[f.name] instanceof Date) {
      defaults = { ...defaults, [f.name]: defaults[f.name].toISOString().split("T")[0] };
    }
  }

  const {
    control,
    handleSubmit,
    setValue,
    setError,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaults ?? ({} as T),
  });

  useEffect(() => {
    for (const f of fields) {
      if (f.type === "image") {
        const filesFor = fileStates[f.name] ?? [];
        if (filesFor.length > 0) {
          setValue(f.name as any, filesFor[0].url as any);
        }
      }
    }
  }, [fileStates]);

  const onSubmit = async (data: T) => {
    const fd = new FormData();
    for (const f of fields) {
      const val = (data as any)[f.name];
      if (val === undefined || val === null) continue;
      fd.append(f.name, typeof val === "boolean" ? String(val) : String(val));
    }

    setSubmitting(true);
    const result = await serverAction(fd);
    setSubmitting(false);

    if (result?.ok) {
      addToast({ message: "با موفقیت ذخیره شد.", variant: "success" });
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.back();
      }
      router.refresh();
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    } else if (result?.errors) {
      const entries = Object.entries(result.errors);
      for (const [k, msgs] of entries) {
        if (msgs?.[0]) setError(k as any, { type: "server", message: msgs[0] });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            control={control}
            name={f.name as any}
            label={f.label}
            description={f.description}
          render={({ field, fieldState: { error } }) =>
              renderField(f, field, {
                setValue,
                fileStates,
                setFileStates,
              })
            }
          />
        ))}
      </div>
      <Button
        type="submit"
        variant="primary"
        loading={submitting}
        disabled={submitting}
      >
        ذخیره
      </Button>
    </form>
  );
}
