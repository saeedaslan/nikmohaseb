import { notFound } from "next/navigation";
import Link from "next/link";
import { getLibraryCategory } from "@/lib/actions/library";
import { LibraryCategoryForm } from "@/components/admin/library-category-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "ویرایش دسته‌بندی | ادمین | نیک محاسب سرو",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getLibraryCategory(id);
  if (!category) notFound();
  return (
    <div>
      <Link
        href="/admin/library/categories"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
      >
        <ArrowLeft className="h-4 w-4" />
        بازگشت به دسته‌بندی‌ها
      </Link>
      <LibraryCategoryForm
        initial={{
          id: category.id,
          title: category.title,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          order: category.order,
          published: category.published,
        }}
      />
    </div>
  );
}
