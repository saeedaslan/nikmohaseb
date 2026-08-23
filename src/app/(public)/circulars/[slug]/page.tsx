import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { domains } from "@/lib/nav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const circular = await prisma.circular.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    select: { title: true, summary: true, slug: true },
  });

  if (!circular) return {};

  return {
    title: circular.title,
    description: circular.summary || `جزئیات بخشنامه ${circular.title}`,
    alternates: {
      canonical: `${domains.primary}/circulars/${circular.slug}`,
    },
    openGraph: {
      title: circular.title,
      description: circular.summary || undefined,
      type: "article",
      url: `${domains.primary}/circulars/${circular.slug}`,
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CircularPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const circular = await prisma.circular.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    include: { category: true },
  });

  if (!circular) notFound();

  return (
    <article className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/circulars"
          className="mb-6 inline-flex items-center gap-1 text-sm text-primary-navy hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>بازگشت به بخشنامه‌ها</span>
        </Link>

        <h1 className="mb-4 text-2xl font-bold text-primary-navy sm:text-3xl">
          {circular.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          {circular.number && <span>شماره: {circular.number}</span>}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{toJalali(circular.date ?? circular.createdAt)}</span>
          </span>
          {circular.issuer && <span>منبع: {circular.issuer}</span>}
          {circular.category && (
            <Badge variant="default" className="text-xs">
              {circular.category.name}
            </Badge>
          )}
        </div>

        {circular.summary && (
          <p className="mb-6 text-lg text-primary-navy">{circular.summary}</p>
        )}

        {circular.content && (
          <div
            className="article-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: circular.content }}
          />
        )}

        {circular.file && (
          <div className="mt-8">
            <Button asChild variant="accent">
              <a href={circular.file} download>
                <Download className="ml-2 h-4 w-4" />
                دانلود فایل PDF
              </a>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
