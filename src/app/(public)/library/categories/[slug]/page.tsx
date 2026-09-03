import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  BookOpen,
  FileText,
  ChevronLeft,
  Library as LibraryIcon,
  Sparkles,
  ArrowRight,
  BookMarked,
  Inbox,
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scale: Scale,
  book: BookOpen,
  file: FileText,
};

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent-green/30 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 container mx-auto max-w-6xl px-4 py-12 lg:py-16">
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
              <li className="font-bold text-accent-yellow">{category.title}</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm font-medium text-white/90">دسته‌بندی موضوعی</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white lg:text-4xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-sm leading-8 text-white/80 lg:text-base">
              {category.description}
            </p>
          )}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            <BookMarked className="h-3.5 w-3.5 text-accent-yellow" />
            {toPersian(laws.length)} قانون
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 py-10 lg:py-14">
        {laws.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-background">
              <Inbox className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-primary-navy">
              قانونی در این دسته یافت نشد
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              به‌زودی قوانین جدید در این دسته اضافه خواهند شد.
            </p>
            <Link
              href="/library"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent-green hover:underline"
            >
              بازگشت به کتابخانه
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${laws.length === 1 ? "lg:grid-cols-2 max-w-2xl" : "lg:grid-cols-3"}`}>
            {laws.map((law) => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LawCard({ law }: { law: { id: string; slug: string; title: string; description: string | null; status: string | null; category: { title: string } } }) {
  return (
    <Link
      href={`/library/laws/${law.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-green to-accent-yellow opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-white">
          <LibraryIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          {law.status && (
            <span className="mb-1 inline-block rounded-full bg-accent-green/10 px-2.5 py-0.5 text-xs font-bold text-accent-green">
              {law.status}
            </span>
          )}
          <h3 className="text-base font-extrabold text-primary-navy transition-colors group-hover:text-accent-green line-clamp-2">
            {law.title}
          </h3>
        </div>
      </div>
      {law.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-text-muted">{law.description}</p>
      )}
      <div className="mt-auto flex items-center justify-end pt-4">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-green transition-all group-hover:gap-2">
          مشاهده قانون
          <ChevronLeft className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
