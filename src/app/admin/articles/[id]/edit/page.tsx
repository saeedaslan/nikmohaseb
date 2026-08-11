import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getAllCategories } from "@/lib/queries";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata = {
  title: "ویرایش مقاله | ادمین | نیک محاسب سرو",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true, author: { select: { name: true } } },
  });
  if (!article) notFound();

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
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ویرایش مقاله «{article.title}»
      </h1>
      <ArticleForm article={article} categories={catOpts} authors={authorOpts} />
    </div>
  );
}
