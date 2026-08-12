import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "جزئیات بخشنامه | نیک محاسب سرو",
  description: "جزئیات بخشنامه",
};

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
      <div className="container mx-auto max-w-3xl px-4">
        <Link href="/circulars" className="mb-4 inline-block text-sm text-accent-green">
          ← بازگشت به بخشنامه‌ها
        </Link>
        <h1 className="mb-3 text-2xl font-bold text-primary-navy">
          {circular.title}
        </h1>
        <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
          {circular.number && <span>شماره: {circular.number}</span>}
          <span>•</span>
          <span>{toJalali(circular.date ?? circular.createdAt)}</span>
          {circular.issuer && <span>• منبع: {circular.issuer}</span>}
          {circular.category && <Badge>{circular.category.name}</Badge>}
        </div>
        {circular.summary && (
          <p className="mb-4 text-lg text-accent-green">{circular.summary}</p>
        )}
        {circular.content && (
          <div
            className="prose max-w-none"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: circular.content }}
          />
        )}
        {circular.file && (
          <div className="mt-6">
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
