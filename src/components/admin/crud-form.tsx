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

interface AdminCrudFormProps<T> {
  schema: z.ZodTypeAny;
  fields: AdminField[];
  serverAction: (fd: FormData) => Promise<AdminFormState>;
  initialData?: Partial<T> & { id?: string };
  redirectTo?: string;
}

interface RenderCtx {
  fileStates: Record<string, UploadedFileMeta[]>;
  setFileStates: React.Dispatch<React.SetStateAction<Record<string, UploadedFileMeta[]>>>;
}

function renderField(f: AdminField, field: { value?: unknown; onChange?: (value: unknown) => void; name: string }, ctx: RenderCtx) {
  const { fileStates, setFileStates } = ctx;
  const fieldValue = field.value ?? "";
  const fieldOnChange = field.onChange ?? (() => {});
  const baseProps = {
    value: fieldValue as string | number | readonly string[] | undefined,
    onChange: fieldOnChange,
    name: field.name,
  };

  switch (f.type) {
    case "textarea":
      return <Textarea {...baseProps} placeholder={f.description} rows={4} />;
    case "number":
      return (
        <Input
          {...baseProps}
          type="number"
          onChange={(e) => fieldOnChange(Number(e.target.value))}
        />
      );
    case "checkbox":
      return (
        <Checkbox
          checked={!!fieldValue}
          onChange={(e) => fieldOnChange(e.target.checked)}
        />
      );
    case "select":
      return (
        <select
          value={String(fieldValue)}
          onChange={(e) => fieldOnChange(e.target.value)}
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
            value={String(fieldValue)}
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
          {...baseProps}
          placeholder={f.description}
          rows={8}
          className="font-mono text-sm"
        />
      );
    case "date":
      return <Input type="date" {...baseProps} />;
    case "text":
    default:
      return <Input {...baseProps} placeholder={f.description} />;
  }
}

export function AdminCrudForm<T>({
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
      if (f.type === "image" && initialData && f.name in initialData) {
        const val = String((initialData as Record<string, unknown>)[f.name]);
        init[f.name] = [
          {
            url: val,
            filename: val,
            originalName: val,
            mime: "image/jpeg",
            size: 0,
          },
        ];
      }
    }
    return init;
  });

  const rawDefaults = initialData ?? ({} as Partial<T>);
  const defaults: Record<string, unknown> = { ...rawDefaults };
  for (const f of fields) {
    if (f.type === "date" && defaults[f.name] instanceof Date) {
      defaults[f.name] = (defaults[f.name] as Date).toISOString().split("T")[0];
    }
  }

  const {
    control,
    handleSubmit,
    setValue,
    setError,
  } = useForm({
    resolver: zodResolver(schema) as never,
    defaultValues: defaults,
  });

  useEffect(() => {
    for (const f of fields) {
      if (f.type === "image") {
        const filesFor = fileStates[f.name] ?? [];
        if (filesFor.length > 0) {
          setValue(f.name, filesFor[0].url);
        }
      }
    }
  }, [fileStates, setValue, fields]);

  const onSubmit = async (data: Record<string, unknown>) => {
    const fd = new FormData();
    for (const f of fields) {
      const val = data[f.name];
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
        if (msgs?.[0]) setError(k, { type: "server", message: msgs[0] });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            control={control as never}
            name={f.name}
            label={f.label}
            description={f.description}
            render={({ field }) =>
              renderField(f, field as { value?: unknown; onChange?: (value: unknown) => void; name: string }, {
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
