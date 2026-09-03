import Link from "next/link";
import { LibraryLawForm } from "@/components/admin/library-law-form";
import { listLibraryCategories } from "@/lib/actions/library";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "قانون جدید | ادمین | نیک محاسب سرو",
};

export default async function NewLawPage() {
  const categories = await listLibraryCategories();
  return (
    <div>
      <Link
        href="/admin/library/laws"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
      >
        <ArrowLeft className="h-4 w-4" />
        بازگشت به قوانین
      </Link>
      <LibraryLawForm categories={categories} />
    </div>
  );
}
