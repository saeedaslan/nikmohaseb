import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  FileCheck,
  Layers,
  BookMarked,
  Inbox,
} from "lucide-react";
import {
  getLibraryLawBySlug,
  getLibraryLawToc,
} from "@/lib/queries/library";
import { domains } from "@/lib/nav";
import { notFoundMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lawSlug: string }>;
}): Promise<Metadata> {
  const { lawSlug } = await params;
  const law = await getLibraryLawBySlug(lawSlug);
  const canonical = `${domains.primary}/library/laws/${lawSlug}`;
  if (!law) {
    return notFoundMeta({ canonical, fallbackTitle: "قانون یافت نشد" });
  }
  const fallbackDesc = law.description
    ? law.description.slice(0, 160)
    : `متن کامل ${law.title} به همراه تمامی مواد و تبصره‌ها`;
  return {
    title: law.seoTitle || `${law.title} | کتابخانه قوانین`,
    description: law.seoDescription || fallbackDesc,
    keywords: [law.title, law.category.title, "قانون", "متن قانون", "مواد قانونی"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: law.seoTitle || law.title,
      description: law.seoDescription || fallbackDesc,
      url: canonical,
      siteName: "نیک محاسب سرو",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title: law.seoTitle || law.title,
      description: law.seoDescription || fallbackDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LibraryLawPage({
  params,
}: {
  params: Promise<{ lawSlug: string }>;
}) {
  const { lawSlug } = await params;
  const law = await getLibraryLawBySlug(lawSlug);
  if (!law || !law.published) notFound();

  const toc = await getLibraryLawToc(law.id);
  const tocItems = toc.map((a) => ({
    id: a.id,
    number: a.number,
    title: a.title,
    slug: a.slug,
  }));

  const basePath = `/library/laws/${law.slug}`;

  if (tocItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-background">
        <LawHeader law={law} />
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-background">
              <Inbox className="h-8 w-8 text-text-muted" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-primary-navy">
              هنوز ماده‌ای برای این قانون ثبت نشده است
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              ساختار کامل این قانون به‌زودی اضافه خواهد شد.
            </p>
          </div>
        </div>
      </div>
    );
  }

  redirect(`${basePath}/articles/${tocItems[0].slug}`);
}

function LawHeader({
  law,
}: {
  law: {
    title: string;
    description: string | null;
    status: string | null;
    category: { title: string; slug: string };
  };
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-accent-green/30 blur-3xl animate-float" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <nav className="mb-5 text-sm text-white/70" aria-label="breadcrumb">
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
            <li className="font-medium text-white">{law.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Layers className="h-3.5 w-3.5 text-accent-yellow" />
              {law.category.title}
            </span>
            {law.status && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-yellow/30 bg-accent-yellow/10 px-3 py-1 text-xs font-medium text-accent-yellow backdrop-blur">
                <FileCheck className="h-3.5 w-3.5" />
                {law.status}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black leading-tight text-white lg:text-4xl">
            {law.title}
          </h1>
          {law.description && (
            <p className="max-w-3xl text-sm leading-8 text-white/80 lg:text-base">
              {law.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
