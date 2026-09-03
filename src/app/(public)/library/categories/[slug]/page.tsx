import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Library as LibraryIcon,
  Inbox,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  Layers,
} from "lucide-react";
import { getLibraryCategoryBySlug, getPublishedLibraryLaws } from "@/lib/queries/library";
import { domains } from "@/lib/nav";
import type { Metadata } from "next";

export const revalidate = 600;

const baseTitle = "کتابخانه قوانین و مقررات";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getLibraryCategoryBySlug(slug);
  if (!cat) {
    return {
      title: baseTitle,
      description: "دسته‌بندی یافت نشد.",
      alternates: { canonical: `${domains.primary}/library` },
    };
  }
  return {
    title: `${cat.title} | ${baseTitle}`,
    description: cat.description ?? `قوانین و مقررات دسته ${cat.title}`,
    alternates: { canonical: `${domains.primary}/library/categories/${cat.slug}` },
  };
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function LibraryCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, allLaws] = await Promise.all([
    getLibraryCategoryBySlug(slug),
    getPublishedLibraryLaws(),
  ]);
  if (!category || !category.published) notFound();

  const laws = allLaws.filter((l) => l.categoryId === category.id);

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header — simple, consistent with hub */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-card to-surface-background">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-green/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent-yellow/10 blur-3xl" />
        <div className="relative container mx-auto max-w-5xl px-4 py-10 lg:py-12">
          <nav className="mb-4 text-sm text-text-muted" aria-label="breadcrumb">
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
              <li className="font-bold text-primary-navy">{category.title}</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-bold text-accent-green">
            <Sparkles className="h-3.5 w-3.5" />
            دسته‌بندی موضوعی
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-primary-navy lg:text-3xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-2 max-w-2xl text-sm leading-8 text-text-muted">
              {category.description}
            </p>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1 text-xs font-bold text-text-muted">
            <Layers className="h-3.5 w-3.5" />
            {toPersian(laws.length)} قانون
          </div>
        </div>
      </section>

      {/* Laws list */}
      <section className="container mx-auto max-w-5xl px-4 py-10">
        {laws.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-text-muted" />
            <h3 className="mt-3 text-base font-bold text-primary-navy">
              قانونی در این دسته یافت نشد
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              به‌زودی قوانین جدید در این دسته اضافه خواهند شد.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {laws.map((law) => (
              <Link
                key={law.id}
                href={`/library/laws/${law.slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-green/40 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-primary-navy group-hover:text-accent-green">
                        {law.title}
                      </h3>
                      {law.status && (
                        <span className="rounded-full bg-accent-green/10 px-2 py-0.5 text-[10px] font-bold text-accent-green">
                          {law.status}
                        </span>
                      )}
                    </div>
                    {law.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">
                        {law.description}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronLeft className="h-4 w-4 flex-shrink-0 text-text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent-green" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/library"
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            بازگشت به کتابخانه
          </Link>
        </div>
      </section>
    </div>
  );
}
