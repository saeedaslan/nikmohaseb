import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArticleSchema, BreadcrumbSchema, SpeakableSchema } from "@/components/structured-data";
import { domains } from "@/lib/nav";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    select: { title: true, summary: true, slug: true, image: true, seoTitle: true, seoDescription: true },
  });

  if (!article) return {};

  const metaTitle = article.seoTitle || article.title;
  const metaDescription = article.seoDescription || article.summary || `مقاله ${article.title} - نیک محاسب سرو`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${domains.primary}/articles/${article.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: `${domains.primary}/articles/${article.slug}`,
      images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : undefined,
    },
  };
}

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
      <ArticleSchema
        title={article.title}
        description={article.summary || article.title}
        image={article.image || undefined}
        datePublished={article.publishedAt || article.createdAt}
        dateModified={article.updatedAt}
        author={article.author?.name || undefined}
        slug={article.slug}
      />
      <BreadcrumbSchema
        items={[
          { name: "خانه", href: "/" },
          { name: "مقالات", href: "/articles" },
          { name: article.title, href: `/articles/${article.slug}` },
        ]}
      />
      <SpeakableSchema
        cssSelector={[".article-content"]}
        url={`${domains.primary}/articles/${article.slug}`}
      />
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
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
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
