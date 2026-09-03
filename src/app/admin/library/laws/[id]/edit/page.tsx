import { notFound } from "next/navigation";
import Link from "next/link";
import { LibraryLawForm } from "@/components/admin/library-law-form";
import { getLibraryLaw, listLibraryCategories } from "@/lib/actions/library";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "ویرایش قانون | ادمین | نیک محاسب سرو",
};

export default async function EditLawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [law, categories] = await Promise.all([
    getLibraryLaw(id),
    listLibraryCategories(),
  ]);
  if (!law) notFound();
  return (
    <div>
      <Link
        href="/admin/library/laws"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
      >
        <ArrowLeft className="h-4 w-4" />
        بازگشت به قوانین
      </Link>
      <LibraryLawForm
        categories={categories}
        initial={{
          id: law.id,
          title: law.title,
          slug: law.slug,
          categoryId: law.categoryId,
          description: law.description,
          approvalDate: law.approvalDate ? law.approvalDate.toISOString() : null,
          executionDate: law.executionDate ? law.executionDate.toISOString() : null,
          status: law.status,
          order: law.order,
          published: law.published,
        }}
      />
    </div>
  );
}
