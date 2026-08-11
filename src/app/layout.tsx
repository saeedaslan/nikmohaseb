import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeScript } from "@/components/theme/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://nikmohaseb.ir"),
  title: {
    default: "نیک محاسب سرو | خدمات حسابداری، مالی و مالیاتی",
    template: `%s | نیک محاسب سرو`,
  },
  description:
    "نیک محاسب سرو ارائه‌دهنده خدمات تخصصی حسابداری، مالی، مالیاتی، مشاوره مالی و ثبت شرکت در تهران.",
  keywords: ["حسابداری", "مالیاتی", "مشاوره مالی", "ثبت شرکت", "حسابرسی"],
  authors: [{ name: "نیک محاسب سرو" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "نیک محاسب سرو",
    url: "https://nikmohaseb.ir",
    images: [{ url: "/og.png" }],
  },
  alternates: {
    canonical: "https://nikmohaseb.ir",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-background text-text font-sans antialiasing">
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
