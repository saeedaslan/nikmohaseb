import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Library as LibraryIcon,
  FileText,
} from "lucide-react";
import {
  getLibraryLawBySlug,
  getLibraryArticle,
  getRelatedLaws,
} from "@/lib/queries/library";
import { domains } from "@/lib/nav";
import { BreadcrumbSchema, LibraryArticleSchema } from "@/components/structured-data";
import { ArticleDisplay } from "@/components/library/article-display";
import { ArticleNav, type LawTocItem } from "@/components/library/article-nav";
import { notFoundMeta, stripHtml } from "@/lib/seo";
import { toOrdinalWord } from "@/lib/jalali";
import type { Metadata } from "next";

export const revalidate = 600;

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lawSlug: string; articleSlug: string }>;
}): Promise<Metadata> {
  const { lawSlug, articleSlug } = await params;
  const canonical = `${domains.primary}/library/laws/${lawSlug}/articles/${articleSlug}`;
  const data = await getLibraryArticle(lawSlug, articleSlug);
  if (!data) return notFoundMeta({ canonical, fallbackTitle: "ماده یافت نشد" });
  const { law, article } = data;
  const fallbackDesc = stripHtml(article.content) || `متن ماده ${toPersian(article.number)} ${law.title}`;
  return {
    title:
      `ماده ${toPersian(article.number)} ${law.title}` +
      (article.title ? ` - ${article.title}` : "") +
      " | کتابخانه قوانین",
    description: fallbackDesc,
    keywords: [law.title, law.category.title, `ماده ${article.number}`, "قانون"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `ماده ${toPersian(article.number)} ${law.title}`,
      description: fallbackDesc,
      url: canonical,
      siteName: "نیک محاسب سرو",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary",
      title: `ماده ${toPersian(article.number)} ${law.title}`,
      description: fallbackDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LibraryArticlePage({
  params,
}: {
  params: Promise<{ lawSlug: string; articleSlug: string }>;
}) {
  const { lawSlug, articleSlug } = await params;
  const [law, data] = await Promise.all([
    getLibraryLawBySlug(lawSlug),
    getLibraryArticle(lawSlug, articleSlug),
  ]);

  if (!law || !law.published || !data) notFound();

  const { article } = data;
  const basePath = `/library/laws/${law.slug}`;
  const articleUrl = `${basePath}/articles/${article.slug}`;
  const publishedDate = law.approvalDate ?? law.createdAt;

  const toc: LawTocItem[] = law.chapters
    .flatMap((c) =>
      c.articles.map((a) => ({
        id: a.id,
        number: a.number,
        title: a.title,
        slug: a.slug,
        chapter: {
          id: c.id,
          number: c.number,
          title: c.title,
        },
      })),
    )
    .sort((a, b) => {
      if (a.chapter.number !== b.chapter.number) return a.chapter.number - b.chapter.number;
      return a.number - b.number;
    });

  const relatedLawsList = await getRelatedLaws(law.id, law.categoryId, 6);
  const relatedArticles = article.relationsFrom.map((r) => r.to).slice(0, 9);
  const articleChapter = law.chapters.find((c) => c.articles.some((a) => a.id === article.id));

  return (
    <div className="min-h-screen bg-surface-background">
      <BreadcrumbSchema
        items={[
          { name: "خانه", href: "/" },
          { name: "کتابخانه قوانین", href: "/library" },
          { name: law.title, href: basePath },
          { name: `ماده ${toPersian(article.number)}`, href: articleUrl },
        ]}
      />
      <LibraryArticleSchema
        lawTitle={law.title}
        articleNumber={article.number}
        articleTitle={article.title}
        articleSlug={article.slug}
        lawSlug={law.slug}
        description={stripHtml(article.content) || `متن ماده ${toPersian(article.number)} ${law.title}`}
        datePublished={publishedDate}
        dateModified={article.updatedAt}
      />

      {/* Header — prominent number badge + secondary context */}
      <section className="border-b border-border bg-gradient-to-b from-surface-card to-surface-background">
        <div className="container mx-auto max-w-4xl px-4 py-6 lg:py-8">
          <nav className="mb-5 text-sm text-text-muted" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-accent-green">خانه</Link>
              </li>
              <li className="text-text-muted/50">‹</li>
              <li>
                <Link href="/library" className="hover:text-accent-green">
                  کتابخانه قوانین
                </Link>
              </li>
              <li className="text-text-muted/50">‹</li>
              <li>
                <Link href={basePath} className="hover:text-accent-green">
                  {law.title}
                </Link>
              </li>
              <li className="text-text-muted/50">‹</li>
              <li className="font-bold text-primary-navy">
                ماده {toPersian(article.number)}
              </li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <div className="relative inline-flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green shadow-lg shadow-primary-navy/30 sm:h-24 sm:w-24">
              <span className="absolute inset-0 grid-pattern opacity-15" />
              <span className="relative text-2xl font-black text-white sm:text-3xl">
                {toPersian(article.number)}
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-2.5 py-0.5 text-[11px] font-bold text-accent-green">
                <FileText className="h-3 w-3" />
                ماده {toPersian(article.number)}
              </div>
              <h1 className="mt-2 text-xl font-extrabold leading-snug text-primary-navy lg:text-2xl">
                {law.title}
              </h1>
              {article.title && (
                <p className="mt-1.5 text-sm font-bold leading-relaxed text-accent-green lg:text-base">
                  {article.title}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <ArticleDisplay
          id={article.id}
          number={article.number}
          title={article.title}
          content={article.content}
          circulars={article.circulars.map((ac) => ac.circular)}
          notes={article.notes}
          history={article.history}
          related={relatedArticles}
          articleUrl={articleUrl}
          articleTitle={`ماده ${toPersian(article.number)}${article.title ? ` - ${article.title}` : ""}`}
          chapterLabel={articleChapter ? `باب ${toOrdinalWord(articleChapter.number)}: ${articleChapter.title}` : undefined}
        />

        <div className="mt-6">
          <ArticleNav
            lawSlug={law.slug}
            articles={toc}
            activeArticleId={article.id}
          />
        </div>

        {relatedLawsList.length > 0 && (
          <section className="mt-10">
            <header className="mb-4 flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                <LibraryIcon className="h-4 w-4" />
              </div>
              <h2 className="text-base font-extrabold text-primary-navy">قوانین مرتبط</h2>
            </header>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {relatedLawsList.map((rl) => (
                <Link
                  key={rl.id}
                  href={`/library/laws/${rl.slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-green/40 hover:shadow-md"
                >
                  <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                    <LibraryIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-primary-navy group-hover:text-accent-green line-clamp-1">
                      {rl.title}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted">
                      {rl.category.title}
                      {rl.status ? ` • ${rl.status}` : ""}
                    </div>
                  </div>
                  <ChevronLeft className="h-4 w-4 flex-shrink-0 text-text-muted transition-transform group-hover:-translate-x-1" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
