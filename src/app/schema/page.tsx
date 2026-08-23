import { LocalBusinessSchema } from "@/components/structured-data";
import { companyName, companyDescription, contactInfo } from "@/lib/nav";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export const metadata = {
  title: "اسکیماها و داده‌های ساختاریته | نیک محاسب سرو",
  description: "صفحه بررسی و تست اسکیماهای JSON-LD سایت نیک محاسب سرو",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

interface SchemaItem {
  name: string;
  description: string;
  component?: ReactNode;
  json: Record<string, unknown>;
}

export default async function SchemaPage() {
  const [faqs, articles, services] = await Promise.all([
    prisma.faq.findMany({ where: { published: true }, take: 3 }),
    prisma.article.findMany({ where: { published: true }, take: 2 }),
    prisma.service.findMany({ where: { published: true }, take: 2 }),
  ]);

  const schemas: SchemaItem[] = [
    {
      name: "LocalBusiness",
      description: "اسکیما برای کسب‌وکار محلی - نمایش در نتایج گوگل",
      component: <LocalBusinessSchema />,
      json: {
        "@context": "https://schema.org",
        "@type": "AccountingService",
        name: companyName,
        description: companyDescription,
        url: "https://nikmohaseb.ir",
        telephone: contactInfo.phones[0],
        email: contactInfo.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: contactInfo.address,
          addressLocality: "تهران",
          addressCountry: "IR",
        },
      },
    },
  ];

  if (faqs.length > 0) {
    schemas.push({
      name: "FAQPage",
      description: "اسکیما برای صفحه سؤالات متداول - Rich Results در گوگل",
      json: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
          },
        })),
      },
    });
  }

  if (articles.length > 0) {
    schemas.push({
      name: "Article",
      description: "اسکیما برای مقالات - نمایش در Google News",
      json: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articles[0].title,
        description: articles[0].summary || articles[0].title,
        datePublished: articles[0].createdAt.toISOString(),
        publisher: {
          "@type": "Organization",
          name: companyName,
        },
      },
    });
  }

  if (services.length > 0) {
    schemas.push({
      name: "Service",
      description: "اسکیما برای خدمات - نمایش در نتایج جستجو",
      json: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: services[0].title,
        description: services[0].summary || services[0].title,
        provider: {
          "@type": "AccountingService",
          name: companyName,
        },
      },
    });
  }

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-navy">
            اسکیماهای سایت
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            داده‌های ساختاریته JSON-LD برای بهبود SEO و نمایش در نتایج جستجو
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-accent-green/30 bg-accent-green/5 p-4">
          <h2 className="mb-2 text-sm font-semibold text-accent-green">
            ابزارهای تست
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-green hover:underline"
            >
              Schema.org Validator
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-green hover:underline"
            >
              Google Rich Results Test
            </a>
            <a
              href="https://developers.google.com/search/docs/appearance/structured-data/search-gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-green hover:underline"
            >
              Google Search Gallery
            </a>
          </div>
        </div>

        <div className="space-y-6">
          {schemas.map((schema) => (
            <div
              key={schema.name}
              className="overflow-hidden rounded-lg border border-border/60 bg-surface-card"
            >
              <div className="border-b border-border/60 bg-surface-background px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-text">{schema.name}</h2>
                  <span className="rounded bg-accent-green/10 px-2 py-1 text-xs text-accent-green">
                    JSON-LD
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-muted">{schema.description}</p>
              </div>
              <div className="p-4">
                <pre className="overflow-x-auto rounded bg-surface-background p-4 text-xs leading-relaxed text-text">
                  <code>{JSON.stringify(schema.json, null, 2)}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border/60 bg-surface-card p-4">
          <h2 className="mb-3 font-semibold text-text">راهنمای استفاده</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li>
              • این اسکیماها به صورت خودکار در صفحات مربوطه قرار می‌گیرند
            </li>
            <li>
              • از Schema.org Validator برای بررسی صحت اسکیماها استفاده کنید
            </li>
            <li>
              • بعد از تغییرات، از Google Search Console برای ایندکس مجدد درخواست کنید
            </li>
            <li>
              • Rich Results Test گوگل را برای صفحات مقالات و FAQ اجرا کنید
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
