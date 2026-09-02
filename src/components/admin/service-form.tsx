"use client";

import { AdminCrudForm, type AdminField } from "@/components/admin/crud-form";
import { serviceSchema, type ServiceInput } from "@/lib/validations/admin";
import { createService, updateService } from "@/lib/actions/services";
import type { Service } from "@/lib/queries";

interface CategoryOpt {
  value: string;
  label: string;
}

export function ServiceForm({
  service,
  categories,
}: {
  service?: Service & { id: string };
  categories: CategoryOpt[];
}) {
  const fields: AdminField[] = [
    { name: "title", label: "عنوان", type: "text", description: "عنوان خدمت" },
    { name: "slug", label: "اسلاک", type: "text", description: "مثال: hesabdar" },
    { name: "icon", label: "آیکن", type: "text", description: "مثال: chart-bar" },
    { name: "order", label: "ترتیب", type: "number", description: "ترتیب نمایش" },
    { name: "published", label: "منتشر شود", type: "checkbox" },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [{ value: "", label: "بدون دسته" }, ...categories],
    },
    { name: "summary", label: "خلاصه", type: "textarea", description: "خلاصه کوتاه" },
    { name: "image", label: "تصویر شاخص", type: "image" },
    { name: "content", label: "محتوا (HTML)", type: "html", description: "محتوای کامل به صورت HTML" },
    { name: "seoTitle", label: "SEO Title", type: "text", description: "عنوان سئو (حداکثر ۱۶۰ کاراکتر)" },
    { name: "seoDescription", label: "SEO Description", type: "textarea", description: "توضیحات سئو (حداکثر ۳۲۰ کاراکتر)" },
  ];

  const serverAction = service
    ? (fd: FormData) => updateService(service.id, fd)
    : (fd: FormData) => createService(fd);

  return (
    <AdminCrudForm<ServiceInput>
      schema={serviceSchema}
      fields={fields}
      serverAction={serverAction}
      initialData={service as any}
      redirectTo="/admin/services"
    />
  );
}
