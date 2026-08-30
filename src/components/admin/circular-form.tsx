"use client";

import { AdminCrudForm, type AdminField } from "@/components/admin/crud-form";
import { circularSchema, type CircularInput } from "@/lib/validations/admin";
import { createCircular, updateCircular } from "@/lib/actions/circulars";
import type { Circular } from "@/lib/queries";

interface CategoryOpt {
  value: string;
  label: string;
}

export function CircularForm({
  circular,
  categories,
  files: existingFiles,
}: {
  circular?: Circular;
  categories: CategoryOpt[];
  files?: { url: string; filename: string }[];
}) {
  const fields: AdminField[] = [
    { name: "title", label: "عنوان", type: "text", description: "عنوان بخشنامه" },
    { name: "slug", label: "اسلاک", type: "text", description: "مثال: bazneshane-1403" },
    { name: "number", label: "شماره", type: "text", description: "شماره بخشنامه" },
    { name: "date", label: "تاریخ", type: "date" },
    { name: "issuer", label: "سازمان صادرکننده", type: "text" },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [{ value: "", label: "بدون دسته" }, ...categories],
    },
    { name: "image", label: "تصویر شاخص", type: "image" },
    { name: "summary", label: "خلاصه", type: "textarea", description: "خلاصه کوتاه" },
    { name: "content", label: "محتوا (HTML)", type: "html", description: "متن کامل بخشنامه" },
    { name: "published", label: "منتشر شود", type: "checkbox" },
    { name: "publishedAt", label: "تاریخ انتشار", type: "date" },
  ];

  const serverAction = circular
    ? (fd: FormData) => updateCircular(circular.id, fd)
    : (fd: FormData) => createCircular(fd);

  return (
    <AdminCrudForm<CircularInput>
      schema={circularSchema}
      fields={fields}
      serverAction={serverAction}
      initialData={circular as any}
      redirectTo="/admin/circulars"
    />
  );
}
