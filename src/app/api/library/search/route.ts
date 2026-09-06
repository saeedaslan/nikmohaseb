import { NextResponse } from "next/server";
import { searchLibrary } from "@/lib/queries/library";

export const revalidate = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchLibrary(q, 20);
  return NextResponse.json({
    results: results.map((a) => ({
      id: a.id,
      number: a.number,
      title: a.title,
      slug: a.slug,
      excerpt: a.content.replace(/<[^>]+>/g, "").slice(0, 200),
      path: {
        lawTitle: a.chapter.law.title,
        lawSlug: a.chapter.law.slug,
        chapterTitle: a.chapter.title,
        chapterNumber: a.chapter.number,
      },
    })),
  });
}
