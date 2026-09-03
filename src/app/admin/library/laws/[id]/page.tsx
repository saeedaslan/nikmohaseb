import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { getLibraryLaw, listPublishedCirculars } from "@/lib/actions/library";
import { LibraryStructureManager } from "@/components/admin/library-structure-manager";
import { toJalali } from "@/lib/jalali";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "ساختار قانون | ادمین | نیک محاسب سرو",
};

export default async function AdminLibraryLawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [law, allCirculars] = await Promise.all([
    getLibraryLaw(id),
    listPublishedCirculars(),
  ]);
  if (!law) notFound();

  const articles = law.books.flatMap((b) => b.chapters.flatMap((c) => c.articles));
  const articleIds = articles.map((a) => a.id);
  const attachedCirculars = articleIds.length
    ? await prisma.libraryArticleCircular.findMany({
        where: { articleId: { in: articleIds } },
        select: { articleId: true, circularId: true },
      })
    : [];
  const initialCircularMap: Record<string, string[]> = {};
  for (const ac of attachedCirculars) {
    if (!initialCircularMap[ac.articleId]) initialCircularMap[ac.articleId] = [];
    initialCircularMap[ac.articleId].push(ac.circularId);
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/library/laws"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
      >
        <ChevronLeft className="h-4 w-4" />
        بازگشت به لیست قوانین
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-5 shadow-sm lg:p-6">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-green/30 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-accent-yellow/20 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-bold text-white/60">{law.category.title}</div>
            <h1 className="mt-1 text-2xl font-black text-white lg:text-3xl">{law.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
              {law.approvalDate && (
                <span>تصویب: {toJalali(law.approvalDate)}</span>
              )}
              {law.status && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 backdrop-blur">
                  {law.status}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/library/laws/${law.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              مشاهده در سایت
            </Link>
            <Link
              href={`/admin/library/laws/${law.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent-yellow px-3 py-2 text-xs font-extrabold text-primary-navy shadow-lg shadow-accent-yellow/30 transition-all hover:-translate-y-0.5"
            >
              ویرایش اطلاعات
            </Link>
          </div>
        </div>
      </section>

      <LibraryStructureManager
        lawId={law.id}
        lawSlug={law.slug}
        initialBooks={law.books.map((b) => ({
          id: b.id,
          number: b.number,
          title: b.title,
          chapters: b.chapters.map((c) => ({
            id: c.id,
            number: c.number,
            title: c.title,
            articles: c.articles.map((a) => ({
              id: a.id,
              number: a.number,
              title: a.title,
              slug: a.slug,
              content: a.content,
              published: a.published,
            })),
          })),
        }))}
        allCirculars={allCirculars}
        initialCircularMap={initialCircularMap}
      />
    </div>
  );
}
