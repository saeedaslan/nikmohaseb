import { getActiveBanner } from "@/lib/queries";
import { getPublishedServices } from "@/lib/queries";
import { getPublishedArticles } from "@/lib/queries";
import { getPublishedCirculars } from "@/lib/queries";
import { getPublishedLaws } from "@/lib/queries";
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
  const [banner, services, articles, circulars, laws] = await Promise.all([
    getActiveBanner(),
    getPublishedServices(6),
    getPublishedArticles(3),
    getPublishedCirculars(3),
    getPublishedLaws(3),
  ]);

  return (
    <>
      <Hero banner={banner} />
      <ServicesSection services={services} />
      <AdvantagesSection />
      <CTASection />
      <ArticlesSection articles={articles} />
      <CircularsSection circulars={circulars} />
      <LawsSection laws={laws} />
    </>
  );
}
