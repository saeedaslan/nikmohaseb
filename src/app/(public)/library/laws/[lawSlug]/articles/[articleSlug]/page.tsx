import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Library as LibraryIcon,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  getLibraryLawBySlug,
  getLibraryLawToc,
  getLibraryArticle,
  getRelatedLaws,
} from "@/lib/queries/library";
import { domains } from "@/lib/nav";
import { BreadcrumbSchema, LibraryArticleSchema } from "@/components/structured-data";
import { LibrarySidebar } from "@/components/library/library-sidebar";
import { ArticleDisplay } from "@/components/library/article-display";
import { ArticleNav, type LawTocItem } from "@/components/library/article-nav";
import { ArticleActions } from "@/components/library/article-actions";
import { notFoundMeta, stripHtml } from "@/lib/seo";
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

  const toc = await getLibraryLawToc(law.id);
  const tocItems: LawTocItem[] = toc.map((a) => ({
    id: a.id,
    number: a.number,
    title: a.title,
    slug: a.slug,
    chapter: a.chapter,
  }));

  const relatedLawsList = await getRelatedLaws(law.id, law.categoryId, 6);

  const { article } = data;
  const publishedDate = law.approvalDate ?? law.createdAt;
  const basePath = `/library/laws/${law.slug}`;
  const articleUrl = `${basePath}/articles/${article.slug}`;

  const articleChapter = toc.find((a) => a.id === article.id)?.chapter;

  return (
    <div className="min-h-screen bg-surface-background">
      <BreadcrumbSchema
        items={[
          { name: "خانه", href: "/" },
          { name: "کتابخانه قوانین", href: "/library" },
          { name: law.category.title, href: `/library/categories/${law.category.slug}` },
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

      {/* Hero / Header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-accent-green/30 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-6 lg:py-8">
          <nav className="mb-4 text-sm text-white/70" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-accent-yellow">خانه</Link>
              </li>
              <li className="text-white/40">‹</li>
              <li>
                <Link href="/library" className="hover:text-accent-yellow">
                  کتابخانه قوانین
                </Link>
              </li>
              <li className="text-white/40">‹</li>
              <li>
                <Link
                  href={`/library/categories/${law.category.slug}`}
                  className="hover:text-accent-yellow"
                >
                  {law.category.title}
                </Link>
              </li>
              <li className="text-white/40">‹</li>
              <li className="font-bold text-accent-yellow">
                ماده {toPersian(article.number)}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <LibraryIcon className="h-3.5 w-3.5 text-accent-yellow" />
                {law.title}
              </span>
              {law.status && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-yellow/30 bg-accent-yellow/10 px-3 py-1 text-xs font-medium text-accent-yellow backdrop-blur">
                  <FileText className="h-3.5 w-3.5" />
                  {law.status}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black leading-tight text-white lg:text-3xl">
              ماده {toPersian(article.number)}
              {article.title ? (
                <span className="text-accent-yellow"> — {article.title}</span>
              ) : null}
            </h1>

            {articleChapter && (
              <div className="text-sm text-white/75">
                <span className="text-white/50">از </span>
                <span>{articleChapter.book.title}</span>
                <span className="text-white/50">، </span>
                <span>{articleChapter.title}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-4">
              <LawStructurePanel law={law} lawSlug={law.slug} activeArticleId={article.id} />
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <ArticleDisplay
              id={article.id}
              number={article.number}
              title={article.title}
              content={article.content}
              circulars={article.circulars.map((ac) => ac.circular)}
              notes={article.notes}
              history={article.history}
              related={article.relationsFrom.map((r) => r.to)}
              articleUrl={articleUrl}
              articleTitle={`ماده ${toPersian(article.number)}${article.title ? ` - ${article.title}` : ""}`}
            />

            <ArticleNav
              lawSlug={law.slug}
              articles={tocItems}
              activeArticleId={article.id}
            />

            {relatedLawsList.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 shadow-sm lg:p-8">
                <header className="mb-5 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                    <LibraryIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary-navy">قوانین مرتبط</h2>
                    <p className="text-xs text-text-muted">سایر قوانینی که ممکن است مفید باشند</p>
                  </div>
                </header>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {relatedLawsList.map((rl) => (
                    <Link
                      key={rl.id}
                      href={`/library/laws/${rl.slug}`}
                      className="group flex items-start gap-3 rounded-2xl border border-border bg-surface-background p-4 transition-all hover:-translate-y-0.5 hover:border-accent-green/40 hover:shadow-md cursor-pointer"
                    >
                      <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-white">
                        <LibraryIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-primary-navy transition-colors group-hover:text-accent-green line-clamp-1">
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
      </div>
    </div>
  );
}

function LawStructurePanel({
  law,
  lawSlug,
  activeArticleId,
}: {
  law: {
    title: string;
    books: {
      id: string;
      number: number;
      title: string;
      chapters: {
        id: string;
        number: number;
        title: string;
        articles: { id: string; number: number; title: string | null; slug: string }[];
      }[];
    }[];
  };
  lawSlug: string;
  activeArticleId: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
          <BookOpen className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-extrabold text-primary-navy">ساختار قانون</h3>
      </div>
      <LibrarySidebar
        structure={law.books.map((b) => ({
          id: b.id,
          number: b.number,
          title: b.title,
          chapters: b.chapters.map((c) => ({
            id: c.id,
            number: c.number,
            title: c.title,
            articles: c.articles,
          })),
        }))}
        lawSlug={lawSlug}
        activeArticleSlug={law.books
          .flatMap((b) => b.chapters)
          .flatMap((c) => c.articles)
          .find((a) => a.id === activeArticleId)?.slug}
      />
    </div>
  );
}
