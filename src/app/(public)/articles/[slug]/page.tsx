import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "مقاله | نیک محاسب سرو",
  description: "جزئیات مقاله",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    include: { category: true, author: { select: { name: true } } },
  });

  if (!article) notFound();

  return (
    <article className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link href="/articles" className="mb-4 inline-block text-sm text-accent-green">
          ← بازگشت به مقالات
        </Link>
        <h1 className="mb-3 text-2xl font-bold text-primary-navy">
          {article.title}
        </h1>
        <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
          {article.author?.name && <span>{article.author.name}</span>}
          <span>•</span>
          <span>{toJalali(article.publishedAt ?? article.createdAt)}</span>
          {article.category && <Badge>{article.category.name}</Badge>}
        </div>
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="mb-6 h-64 w-full rounded-lg object-cover"
          />
        )}
        <div
          className="prose max-w-none"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />
      </div>
    </article>
  );
}
