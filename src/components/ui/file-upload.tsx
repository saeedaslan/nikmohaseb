"use client";

import { cn } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "./toast";

export interface UploadedFileMeta {
  url: string;
  filename: string;
  originalName: string;
  mime: string;
  size: number;
}

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  value: UploadedFileMeta[];
  onChange: (files: UploadedFileMeta[]) => void;
}

export function FileUpload({
  label,
  accept = "image/*,.pdf",
  multiple = false,
  value = [],
  onChange,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const uploadOne = async (file: File): Promise<UploadedFileMeta | null> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      addToast({
        message: data.error || "خطا در بارگذاری فایل",
        variant: "error",
      });
      return null;
    }
    const data = await res.json();
    return {
      url: data.url,
      filename: data.filename,
      originalName: data.originalName,
      mime: data.mime,
      size: data.size,
    };
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (!multiple && fileArr.length > 1) return;
    setUploading(true);
    const results: UploadedFileMeta[] = [];
    for (const f of fileArr) {
      const uploaded = await uploadOne(f);
      if (uploaded) results.push(uploaded);
    }
    onChange([...value, ...results]);
    setUploading(false);
  };

  const removeFile = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <label
        className={cn(
          "flex min-h-[120px] cursor-pointer items-center justify-center",
          "gap-2 rounded-md border border-dashed border-border bg-surface-card",
          "px-4 py-6 text-center transition-colors hover:bg-surface-background",
        )}
      >
        <Upload className="h-6 w-6 text-text-muted" />
        <span className="text-sm text-text-muted">
          {uploading ? "در حال بارگذاری..." : "روی اینجا کلیک کنید یا فایل بکشید"}
        </span>
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files ?? [])}
        />
      </label>

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {value.map((f, i) => (
            <div key={f.filename} className="relative">
              {f.mime.startsWith("image/") ? (
                <img
                  src={f.url}
                  alt={f.originalName}
                  className="h-20 w-20 rounded border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded border bg-surface-background">
                  <span className="text-xs text-text-muted">
                    {f.originalName}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-2 -end-2 rounded-full bg-red-600 p-0.5 text-white"
                aria-label="حذف"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {uploading && (
            <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
          )}
        </div>
      )}
    </div>
  );
}
