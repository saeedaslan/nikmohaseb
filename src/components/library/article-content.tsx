import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface ArticleContentProps {
  content: string;
  lawSlug: string;
}

const ARTICLE_REF = /(ماده\s+(\d+))/g;

export async function ArticleContent({ content, lawSlug }: ArticleContentProps) {
  const matches = [...new Set(Array.from(content.matchAll(ARTICLE_REF), (m) => m[2]))];
  const numbers = matches.map((n) => parseInt(n, 10)).filter((n) => !isNaN(n));

  let articles: { number: number; slug: string }[] = [];
  if (numbers.length > 0) {
    articles = await prisma.libraryArticle.findMany({
      where: {
        number: { in: numbers },
        published: true,
        chapter: {
          law: { slug: lawSlug },
        },
      },
      select: { number: true, slug: true },
    });
  }

  const articleByNumber = new Map(articles.map((a) => [a.number, a.slug]));

  const html = content.replace(ARTICLE_REF, (full, _whole, num) => {
    const n = parseInt(num, 10);
    const slug = articleByNumber.get(n);
    if (!slug) return full;
    return `<a href="/library/laws/${lawSlug}/articles/${slug}" class="article-ref">${full}</a>`;
  });

  return (
    <div
      className="article-content prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
