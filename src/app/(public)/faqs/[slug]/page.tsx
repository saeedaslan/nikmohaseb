import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, HelpCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { domains } from "@/lib/nav";
import { FAQSchema, BreadcrumbSchema } from "@/components/structured-data";

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faq = await prisma.faq.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    select: { question: true, answer: true, slug: true },
  });

  if (!faq) return {};

  const cleanAnswer = stripHtml(faq.answer);
  const description = cleanAnswer.slice(0, 160) || faq.question;

  return {
    title: faq.question,
    description,
    alternates: {
      canonical: `${domains.primary}/faqs/${faq.slug}`,
    },
    openGraph: {
      title: faq.question,
      description,
      type: "article",
      url: `${domains.primary}/faqs/${faq.slug}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: faq.question }],
    },
  };
}

export const revalidate = 300;

export default async function FaqPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = await prisma.faq.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
  });

  if (!faq) notFound();

  return (
    <article className="py-12">
      <FAQSchema
        faqs={[{ question: faq.question, answer: faq.answer || "" }]}
      />
      <BreadcrumbSchema
        items={[
          { name: "خانه", href: "/" },
          { name: "سؤالات متداول", href: "/faqs" },
          { name: faq.question, href: `/faqs/${faq.slug}` },
        ]}
      />
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/faqs"
          className="mb-6 inline-flex items-center gap-1 text-sm text-primary-navy hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>بازگشت به سؤالات متداول</span>
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-accent-yellow" />
          {faq.category && (
            <Badge variant="default" className="text-xs">
              {faq.category}
            </Badge>
          )}
        </div>

        <h1 className="mb-4 text-2xl font-bold text-primary-navy sm:text-3xl">
          {faq.question}
        </h1>

        <div className="mb-6 flex items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{toJalali(faq.publishedAt ?? faq.createdAt)}</span>
          </span>
        </div>

        {faq.answer && (
          <div
            className="article-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        )}
      </div>
    </article>
  );
}
