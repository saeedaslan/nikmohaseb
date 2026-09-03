import type { Metadata } from "next";

export function notFoundMeta({
  canonical,
  fallbackTitle = "صفحه یافت نشد",
}: {
  canonical?: string;
  fallbackTitle?: string;
}): Metadata {
  return {
    title: fallbackTitle,
    description: "صفحه مورد نظر یافت نشد.",
    robots: { index: false, follow: true },
    ...(canonical && { alternates: { canonical } }),
  };
}

export function stripHtml(html: string | null | undefined, max = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
