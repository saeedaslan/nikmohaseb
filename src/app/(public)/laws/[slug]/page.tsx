import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "جزئیات قانون | نیک محاسب سرو",
  description: "جزئیات قانون",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const lawTypeLabel: Record<string, string> = {
  DIRECT_TAX: "مالیات مستقیم",
  VAT: "مالیات ارزش افزوده",
  OTHER: "سایر",
};

export default async function LawPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const law = await prisma.law.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    include: { category: true },
  });

  if (!law) notFound();

  return (
    <article className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/laws"
          className="mb-6 inline-flex items-center gap-1 text-sm text-primary-navy hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>بازگشت به قوانین</span>
        </Link>

        <h1 className="mb-4 text-2xl font-bold text-primary-navy sm:text-3xl">
          {law.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          {law.type && (
            <Badge variant="default" className="text-xs">
              {lawTypeLabel[law.type] ?? law.type}
            </Badge>
          )}
          {law.number && <span>شماره: {law.number}</span>}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{toJalali(law.date ?? law.createdAt)}</span>
          </span>
          {law.issuer && <span>منبع: {law.issuer}</span>}
          {law.category && (
            <Badge variant="default" className="text-xs">
              {law.category.name}
            </Badge>
          )}
        </div>

        {law.summary && (
          <p className="mb-6 text-lg text-primary-navy">{law.summary}</p>
        )}

        {law.content && (
          <div
            className="article-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: law.content }}
          />
        )}

        {law.file && (
          <div className="mt-8">
            <Button asChild variant="accent">
              <a href={law.file} download>
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
