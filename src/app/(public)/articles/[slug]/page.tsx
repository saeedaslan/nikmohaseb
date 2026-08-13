import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

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
    <article className="py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/articles"
          className="mb-6 inline-flex items-center gap-1 text-sm text-primary-navy hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>بازگشت به مقالات</span>
        </Link>

        <h1 className="mb-6 text-right text-3xl font-extrabold text-primary-navy sm:text-4xl">
          {article.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          {article.author?.name && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{toJalali(article.publishedAt ?? article.createdAt)}</span>
          </span>
          {article.category && (
            <Badge variant="default" className="text-xs">
              {article.category.name}
            </Badge>
          )}
        </div>

        {article.image && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        )}

        {article.summary && (
          <blockquote className="mb-6 border-l-4 border-accent-yellow/30 py-4 pl-4 text-right text-lg italic text-text-muted">
            {article.summary}
          </blockquote>
        )}

        <div
          className="article-content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />

        <div className="mt-10 border-t border-border pt-6 text-center">
          <Button asChild variant="accent" size="lg">
            <Link href="/articles">مشاهده سایر مقالات</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
