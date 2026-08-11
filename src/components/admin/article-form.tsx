"use client";

import { AdminCrudForm, type AdminField } from "@/components/admin/crud-form";
import { articleSchema, type ArticleInput } from "@/lib/validations/admin";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import { getAllCategories } from "@/lib/queries";
import { Article } from "@/lib/queries";

interface CategoryOpt {
  value: string;
  label: string;
}

export function ArticleForm({
  article,
  categories,
  authors,
}: {
  article?: Article;
  categories: CategoryOpt[];
  authors: CategoryOpt[];
}) {
  const fields: AdminField[] = [
    { name: "title", label: "عنوان", type: "text", description: "عنوان مقاله" },
    { name: "slug", label: "اسلاک", type: "text", description: "مثال: hesabdar" },
    { name: "summary", label: "خلاصه", type: "textarea", description: "خلاصه کوتاه" },
    { name: "content", label: "محتوا (HTML)", type: "html", description: "محتوای کامل" },
    { name: "image", label: "تصویر شاخص", type: "image" },
    {
      name: "published",
      label: "منتشر شود",
      type: "checkbox",
      description: "محتوا به صورت عمومی نمایش داده شود",
    },
    { name: "publishedAt", label: "تاریخ انتشار", type: "date" },
    { name: "seoTitle", label: "SEO Title", type: "text" },
    { name: "seoDescription", label: "SEO Description", type: "textarea" },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [{ value: "", label: "بدون دسته" }, ...categories],
    },
    {
      name: "authorId",
      label: "نویسنده",
      type: "select",
      options: authors,
    },
  ];

  const serverAction = article
    ? (fd: FormData) => updateArticle(article.id, fd)
    : (fd: FormData) => createArticle(fd);

  return (
    <AdminCrudForm<ArticleInput>
      schema={articleSchema}
      fields={fields}
      serverAction={serverAction}
      initialData={article as any}
      redirectTo="/admin/articles"
    />
  );
}
