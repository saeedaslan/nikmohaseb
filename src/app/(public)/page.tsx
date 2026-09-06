import { getActiveBanner } from "@/lib/queries";
import { getPublishedServices } from "@/lib/queries";
import { getPublishedArticles } from "@/lib/queries";
import { getPublishedCirculars } from "@/lib/queries";
import { getPublishedLibraryLaws } from "@/lib/queries/library";
import { Hero } from "@/components/public/hero";
import { ServicesSection } from "@/components/public/services-section";
import { AdvantagesSection } from "@/components/public/advantages-section";
import { CTASection } from "@/components/public/cta-section";
import { ArticlesSection } from "@/components/public/articles-section";
import { CircularsSection } from "@/components/public/circulars-section";
import { LawsSection } from "@/components/public/laws-section";
import { domains } from "@/lib/nav";

export const metadata = {
  title: "همراه مطمئن شما در امور مالی و مالیاتی",
  description:
    "نیک محاسب سرو ارائه‌دهنده خدمات تخصصی حسابداری، مالی، مالیاتی، مشاوره مالی و ثبت شرکت در تهران.",
  alternates: {
    canonical: domains.primary,
  },
};

export default async function HomePage() {
  const [banner, services, articles, circulars, libraryLaws] = await Promise.all([
    getActiveBanner(),
    getPublishedServices(6),
    getPublishedArticles(3),
    getPublishedCirculars(3),
    getPublishedLibraryLaws().then((rows) =>
      rows.slice(0, 3).map((l) => {
        const articleCount = l.chapters.reduce(
          (s, c) => s + c._count.articles,
          0,
        );
        return {
          id: l.id,
          slug: l.slug,
          title: l.title,
          summary: l.description,
          type: "OTHER" as const,
          number: null,
          issuer: null,
          date: null,
          createdAt: l.createdAt,
          category: { name: l.category.title, icon: l.category.icon },
          chapterCount: l._count.chapters,
          articleCount,
          latestUpdate: l.updatedAt,
        };
      }),
    ),
  ]);

  return (
    <>
      <Hero banner={banner} />
      <ServicesSection services={services} />
      <AdvantagesSection />
      <CTASection />
      <ArticlesSection articles={articles} />
      <CircularsSection circulars={circulars} />
      <LawsSection laws={libraryLaws} />
    </>
  );
}
