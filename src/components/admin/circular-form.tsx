"use client";

import { AdminCrudForm, type AdminField } from "@/components/admin/crud-form";
import { circularSchema, type CircularInput } from "@/lib/validations/admin";
import { createCircular, updateCircular } from "@/lib/actions/circulars";
import type { Circular } from "@/lib/queries";

interface CategoryOpt {
  value: string;
  label: string;
}

interface ExistingImage {
  url: string;
  filename: string;
  alt?: string | null;
}

export function CircularForm({
  circular,
  categories,
  existingImages = [],
}: {
  circular?: Circular;
  categories: CategoryOpt[];
  existingImages?: ExistingImage[];
}) {
  const fields: AdminField[] = [
    { name: "title", label: "عنوان", type: "text", description: "عنوان بخشنامه" },
    { name: "slug", label: "اسلاگ", type: "text", description: "مثال: bazneshane-1403" },
    { name: "number", label: "شماره", type: "text", description: "شماره بخشنامه" },
    { name: "date", label: "تاریخ", type: "date" },
    { name: "issuer", label: "سازمان صادرکننده", type: "text" },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [{ value: "", label: "بدون دسته" }, ...categories],
    },
    { name: "gallery", label: "گالری تصاویر", type: "gallery" },
    { name: "summary", label: "خلاصه", type: "textarea", description: "خلاصه کوتاه" },
    { name: "content", label: "محتوا (HTML)", type: "html", description: "متن کامل بخشنامه" },
    { name: "published", label: "منتشر شود", type: "checkbox" },
    { name: "publishedAt", label: "تاریخ انتشار", type: "date" },
    { name: "seoTitle", label: "SEO Title", type: "text", description: "عنوان سئو (حداکثر ۱۶۰ کاراکتر)" },
    { name: "seoDescription", label: "SEO Description", type: "textarea", description: "توضیحات سئو (حداکثر ۳۲۰ کاراکتر)" },
  ];

  const serverAction = circular
    ? (fd: FormData) => updateCircular(circular.id, fd)
    : (fd: FormData) => createCircular(fd);

  return (
    <AdminCrudForm<CircularInput>
      schema={circularSchema}
      fields={fields}
      serverAction={serverAction}
      initialData={{ ...(circular as any), gallery: existingImages }}
      redirectTo="/admin/circulars"
    />
  );
}
