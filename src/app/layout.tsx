import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeScript } from "@/components/theme/script";
import { LocalBusinessSchema, WebSiteSchema } from "@/components/structured-data";
import { domains } from "@/lib/nav";

export const metadata: Metadata = {
  metadataBase: new URL(domains.primary),
  title: {
    default: "نیک محاسب سرو | خدمات حسابداری و مالیاتی",
    template: "%s | نیک محاسب سرو",
  },
  description:
    "خدمات تخصصی حسابداری، مالیاتی، مشاوره مالی و ثبت شرکت در تهران",
  keywords: [
    "حسابداری",
    "مالیاتی",
    "مشاوره مالی",
    "ثبت شرکت",
    "حسابرسی",
    "تهران",
    "خدمات حسابداری",
    "مشاوره مالیاتی",
    "اظهارنامه مالیاتی",
    "حقوق دستمزد",
  ],
  authors: [{ name: "نیک محاسب سرو" }],
  creator: "نیک محاسب سرو",
  publisher: "نیک محاسب سرو",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "نیک محاسب سرو",
    url: domains.primary,
    title: "نیک محاسب سرو | خدمات حسابداری و مالیاتی",
    description: "خدمات تخصصی حسابداری، مالیاتی، مشاوره مالی و ثبت شرکت",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "نیک محاسب سرو - خدمات حسابداری و مالیاتی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نیک محاسب سرو | خدمات حسابداری و مالیاتی",
    description: "خدمات تخصصی حسابداری، مالیاتی و مشاوره مالی در تهران",
    images: ["/og.png"],
  },
  alternates: {
    canonical: domains.primary,
    languages: {
      "fa-IR": domains.primary,
    },
    types: {
      "application/rss+xml": `${domains.primary}/feed.xml`,
    },
  },
  category: "finance",
  classification: "AccountingService",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a231f" />
        <link rel="alternate" href={domains.primary} hrefLang="fa-IR" />
        <link rel="alternate" href={domains.secondary} hrefLang="x-default" />
      </head>
      <body className="min-h-screen bg-surface-background text-text font-sans antialiasing">
        <ThemeScript />
        <LocalBusinessSchema />
        <WebSiteSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
