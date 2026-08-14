"use client";

import { AdminCrudForm, type AdminField } from "@/components/admin/crud-form";
import { faqSchema, type FaqInput } from "@/lib/validations/admin";
import { createFaq, updateFaq } from "@/lib/actions/faqs";
import type { Faq } from "@/lib/queries";

export function FaqForm({ faq }: { faq?: Faq }) {
  const fields: AdminField[] = [
    { name: "question", label: "سؤال", type: "text", description: "متن سؤال متداول" },
    { name: "slug", label: "اسلاک", type: "text", description: "مثال: soal-maliati-01" },
    { name: "category", label: "دسته", type: "text", description: "دسته‌بندی سؤال مثل: مالیاتی، حسابداری" },
    { name: "answer", label: "پاسخ", type: "html", description: "متن کامل پاسخ" },
    { name: "order", label: "ترتیب", type: "number", description: "ترتیب نمایش (عدد کوچک‌تر = بالاتر)" },
    { name: "published", label: "منتشر شود", type: "checkbox" },
    { name: "publishedAt", label: "تاریخ انتشار", type: "date" },
  ];

  const serverAction = faq
    ? (fd: FormData) => updateFaq(faq.id, fd)
    : (fd: FormData) => createFaq(fd);

  return (
    <AdminCrudForm<FaqInput>
      schema={faqSchema}
      fields={fields}
      serverAction={serverAction}
      initialData={faq as any}
      redirectTo="/admin/faqs"
    />
  );
}
