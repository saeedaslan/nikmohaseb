import { getAllCategories } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata = {
  title: "مقاله جدید | ادمین | نیک محاسب سرو",
};

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    getAllCategories(),
    prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const catOpts = categories.map((c) => ({ value: c.id, label: c.name }));
  const authorOpts = authors.map((a) => ({
    value: a.id,
    label: a.name ?? a.email ?? "",
  }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">مقاله جدید</h1>
      <ArticleForm categories={catOpts} authors={authorOpts} />
    </div>
  );
}
