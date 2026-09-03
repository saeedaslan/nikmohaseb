import Link from "next/link";
import { LibraryCategoryForm } from "@/components/admin/library-category-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "دسته‌بندی جدید | ادمین | نیک محاسب سرو",
};

export default function NewCategoryPage() {
  return (
    <div>
      <Link
        href="/admin/library/categories"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
      >
        <ArrowLeft className="h-4 w-4" />
        بازگشت به دسته‌بندی‌ها
      </Link>
      <LibraryCategoryForm />
    </div>
  );
}
