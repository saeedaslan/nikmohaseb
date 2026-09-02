"use client";

import { AdminCrudForm, type AdminField } from "@/components/admin/crud-form";
import { lawSchema, type LawInput } from "@/lib/validations/admin";
import { createLaw, updateLaw } from "@/lib/actions/laws";
import type { Law } from "@/lib/queries";

interface CategoryOpt {
  value: string;
  label: string;
}

export function LawForm({
  law,
  categories,
}: {
  law?: Law;
  categories: CategoryOpt[];
}) {
  const fields: AdminField[] = [
    { name: "title", label: "عنوان", type: "text", description: "عنوان قانون" },
    { name: "slug", label: "اسلاک", type: "text", description: "مثال: law-vat-001" },
    { name: "number", label: "شماره", type: "text", description: "شماره قانون" },
    { name: "date", label: "تاریخ", type: "date" },
    { name: "issuer", label: "سازمان صادرکننده", type: "text" },
    {
      name: "type",
      label: "نوع قانون",
      type: "select",
      options: [
        { value: "", label: "بدون دسته" },
        { value: "DIRECT_TAX", label: "مالیات مستقیم" },
        { value: "VAT", label: "مالیات ارزش افزوده" },
        { value: "OTHER", label: "سایر" },
      ],
    },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [{ value: "", label: "بدون دسته" }, ...categories],
    },
    { name: "summary", label: "خلاصه", type: "textarea", description: "خلاصه کوتاه" },
    { name: "content", label: "محتوا (HTML)", type: "html", description: "متن کامل قانون" },
    { name: "file", label: "لینک فایل PDF", type: "text", description: "آدرس فایل PDF قانون" },
    { name: "published", label: "منتشر شود", type: "checkbox" },
    { name: "publishedAt", label: "تاریخ انتشار", type: "date" },
    { name: "seoTitle", label: "SEO Title", type: "text", description: "عنوان سئو (حداکثر ۱۶۰ کاراکتر)" },
    { name: "seoDescription", label: "SEO Description", type: "textarea", description: "توضیحات سئو (حداکثر ۳۲۰ کاراکتر)" },
  ];

  const serverAction = law
    ? (fd: FormData) => updateLaw(law.id, fd)
    : (fd: FormData) => createLaw(fd);

  return (
    <AdminCrudForm<LawInput>
      schema={lawSchema}
      fields={fields}
      serverAction={serverAction}
      initialData={law as any}
      redirectTo="/admin/laws"
    />
  );
}
