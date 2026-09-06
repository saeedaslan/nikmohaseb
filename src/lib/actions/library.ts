"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slug";

export async function listLibraryCategories() {
  return prisma.libraryCategory.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: { _count: { select: { laws: true } } },
  });
}

export async function getLibraryCategory(id: string) {
  return prisma.libraryCategory.findUnique({ where: { id } });
}

export async function createLibraryCategory(fd: FormData) {
  const title = fd.get("title")?.toString() ?? "";
  const slug = fd.get("slug")?.toString() || slugify(title);
  const description = fd.get("description")?.toString() || null;
  const icon = fd.get("icon")?.toString() || null;
  const order = Number(fd.get("order") ?? 0);
  const published = fd.get("published") === "true";
  try {
    await prisma.libraryCategory.create({
      data: { title, slug, description, icon, order, published },
    });
  } catch (e) {
    console.error("createLibraryCategory error", e);
    return { error: "خطا در ثبت دسته‌بندی." };
  }
  revalidatePath("/admin/library/categories");
  revalidatePath("/library");
  return { ok: true };
}

export async function updateLibraryCategory(id: string, fd: FormData) {
  const title = fd.get("title")?.toString() ?? "";
  const slug = fd.get("slug")?.toString() || slugify(title);
  const description = fd.get("description")?.toString() || null;
  const icon = fd.get("icon")?.toString() || null;
  const order = Number(fd.get("order") ?? 0);
  const published = fd.get("published") === "true";
  try {
    await prisma.libraryCategory.update({
      where: { id },
      data: { title, slug, description, icon, order, published },
    });
  } catch (e) {
    console.error("updateLibraryCategory error", e);
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/library/categories");
  revalidatePath("/library");
  return { ok: true };
}

export async function deleteLibraryCategory(id: string) {
  try {
    await prisma.libraryCategory.delete({ where: { id } });
  } catch {
    return { error: "خطا در حذف." };
  }
  revalidatePath("/admin/library/categories");
  return { ok: true };
}

export async function listLibraryLaws() {
  return prisma.libraryLaw.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      category: true,
      _count: { select: { chapters: true } },
    },
  });
}

export async function getLibraryLaw(id: string) {
  return prisma.libraryLaw.findUnique({
    where: { id },
    include: {
      category: true,
      chapters: {
        orderBy: { number: "asc" },
        include: {
          articles: {
            orderBy: { number: "asc" },
            select: {
              id: true,
              number: true,
              title: true,
              slug: true,
              content: true,
              published: true,
            },
          },
        },
      },
    },
  });
}

export async function createLibraryLaw(fd: FormData) {
  const title = fd.get("title")?.toString() ?? "";
  const slug = fd.get("slug")?.toString() || slugify(title);
  const categoryId = fd.get("categoryId")?.toString() ?? "";
  const description = fd.get("description")?.toString() || null;
  const approvalDate = fd.get("approvalDate")?.toString();
  const executionDate = fd.get("executionDate")?.toString();
  const status = fd.get("status")?.toString() || null;
  const order = Number(fd.get("order") ?? 0);
  const published = fd.get("published") === "true";
  if (!categoryId) return { error: "دسته‌بندی الزامی است." };
  try {
    await prisma.libraryLaw.create({
      data: {
        title,
        slug,
        categoryId,
        description,
        approvalDate: approvalDate ? new Date(approvalDate) : null,
        executionDate: executionDate ? new Date(executionDate) : null,
        status,
        order,
        published,
      },
    });
  } catch (e) {
    console.error("createLibraryLaw error", e);
    return { error: "خطا در ثبت قانون." };
  }
  revalidatePath("/admin/library/laws");
  revalidatePath("/library");
  return { ok: true };
}

export async function updateLibraryLaw(id: string, fd: FormData) {
  const title = fd.get("title")?.toString() ?? "";
  const slug = fd.get("slug")?.toString() || slugify(title);
  const categoryId = fd.get("categoryId")?.toString() ?? "";
  const description = fd.get("description")?.toString() || null;
  const approvalDate = fd.get("approvalDate")?.toString();
  const executionDate = fd.get("executionDate")?.toString();
  const status = fd.get("status")?.toString() || null;
  const order = Number(fd.get("order") ?? 0);
  const published = fd.get("published") === "true";
  try {
    await prisma.libraryLaw.update({
      where: { id },
      data: {
        title,
        slug,
        categoryId,
        description,
        approvalDate: approvalDate ? new Date(approvalDate) : null,
        executionDate: executionDate ? new Date(executionDate) : null,
        status,
        order,
        published,
      },
    });
  } catch (e) {
    console.error("updateLibraryLaw error", e);
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/library/laws");
  revalidatePath("/library");
  return { ok: true };
}

export async function deleteLibraryLaw(id: string) {
  try {
    await prisma.libraryLaw.delete({ where: { id } });
  } catch {
    return { error: "خطا در حذف." };
  }
  revalidatePath("/admin/library/laws");
  return { ok: true };
}

export async function createLibraryChapter(lawId: string, fd: FormData) {
  const title = fd.get("title")?.toString() ?? "";
  const number = Number(fd.get("number") ?? 0);
  if (!title || !number) return { error: "عنوان و شماره الزامی است." };
  try {
    await prisma.libraryChapter.create({ data: { lawId, title, number } });
  } catch (e) {
    return { error: "خطا در ثبت فصل." };
  }
  revalidatePath(`/admin/library/laws/${lawId}`);
  return { ok: true };
}

export async function createLibraryArticle(chapterId: string, fd: FormData) {
  const number = Number(fd.get("number") ?? 0);
  const title = fd.get("title")?.toString() || null;
  const content = fd.get("content")?.toString() ?? "";
  const slug = fd.get("slug")?.toString() || `matter-${number}`;
  const published = fd.get("published") === "true";
  if (!number || !content) return { error: "شماره و متن ماده الزامی است." };
  let lawId: string | undefined;
  try {
    const chapter = await prisma.libraryChapter.findUnique({
      where: { id: chapterId },
    });
    lawId = chapter?.lawId;
    await prisma.libraryArticle.create({
      data: { chapterId, number, title, content, slug, published },
    });
  } catch (e) {
    console.error("createLibraryArticle error", e);
    return { error: "خطا در ثبت ماده." };
  }
  if (lawId) revalidatePath(`/admin/library/laws/${lawId}`);
  revalidatePath("/library");
  return { ok: true };
}

export async function setArticleCirculars(articleId: string, circularIds: string[]) {
  try {
    const uniqueIds = Array.from(new Set(circularIds));
    const article = await prisma.libraryArticle.findUnique({
      where: { id: articleId },
      include: { chapter: true },
    });
    const lawId = article?.chapter.lawId;
    await prisma.$transaction([
      prisma.libraryArticleCircular.deleteMany({ where: { articleId } }),
      ...(uniqueIds.length > 0
        ? [
            prisma.libraryArticleCircular.createMany({
              data: uniqueIds.map((circularId) => ({ articleId, circularId })),
            }),
          ]
        : []),
    ]);
    if (lawId) revalidatePath(`/admin/library/laws/${lawId}`);
  } catch (e) {
    console.error("setArticleCirculars error", e);
    return { error: "خطا در ذخیره ارتباط بخشنامه‌ها." };
  }
  revalidatePath("/library");
  return { ok: true };
}

export async function updateLibraryArticle(articleId: string, fd: FormData) {
  const number = Number(fd.get("number") ?? 0);
  const title = fd.get("title")?.toString() || null;
  const content = fd.get("content")?.toString() ?? "";
  const slug = fd.get("slug")?.toString() || `matter-${articleId}`;
  const published = fd.get("published") === "true";
  let lawId: string | undefined;
  try {
    const article = await prisma.libraryArticle.findUnique({
      where: { id: articleId },
      include: { chapter: true },
    });
    if (!article) return { error: "ماده یافت نشد." };
    lawId = article.chapter.lawId;
    await prisma.libraryArticle.update({
      where: { id: articleId },
      data: { number, title, content, slug, published },
    });
  } catch (e) {
    console.error("updateLibraryArticle error", e);
    return { error: "خطا در بروزرسانی ماده." };
  }
  if (lawId) revalidatePath(`/admin/library/laws/${lawId}`);
  revalidatePath("/library");
  return { ok: true };
}

export async function deleteLibraryArticle(articleId: string) {
  let lawId: string | undefined;
  try {
    const article = await prisma.libraryArticle.findUnique({
      where: { id: articleId },
      include: { chapter: true },
    });
    lawId = article?.chapter.lawId;
    await prisma.libraryArticle.delete({ where: { id: articleId } });
  } catch (e) {
    console.error("deleteLibraryArticle error", e);
    return { error: "خطا در حذف ماده." };
  }
  if (lawId) revalidatePath(`/admin/library/laws/${lawId}`);
  revalidatePath("/library");
  return { ok: true };
}

export async function deleteLibraryChapter(chapterId: string) {
  let lawId: string | undefined;
  try {
    const chapter = await prisma.libraryChapter.findUnique({
      where: { id: chapterId },
    });
    lawId = chapter?.lawId;
    await prisma.libraryChapter.delete({ where: { id: chapterId } });
  } catch (e) {
    console.error("deleteLibraryChapter error", e);
    return { error: "خطا در حذف فصل." };
  }
  if (lawId) revalidatePath(`/admin/library/laws/${lawId}`);
  return { ok: true };
}

export async function listPublishedCirculars() {
  return prisma.circular.findMany({
    where: { published: true },
    orderBy: [{ date: "desc" }, { title: "asc" }],
    select: { id: true, title: true, number: true, slug: true },
  });
}

export async function getArticleWithCirculars(articleId: string) {
  return prisma.libraryArticle.findUnique({
    where: { id: articleId },
    include: {
      circulars: {
        orderBy: { createdAt: "desc" },
        include: {
          circular: {
            select: { id: true, title: true, slug: true, number: true, date: true },
          },
        },
      },
      chapter: {
        select: {
          number: true,
          title: true,
          law: { select: { id: true, slug: true, title: true } },
        },
      },
    },
  });
}

export async function getLibraryStats() {
  const [
    categories,
    publishedCategories,
    laws,
    publishedLaws,
    chapters,
    articles,
    publishedArticles,
    attachedCirculars,
  ] = await Promise.all([
    prisma.libraryCategory.count(),
    prisma.libraryCategory.count({ where: { published: true } }),
    prisma.libraryLaw.count(),
    prisma.libraryLaw.count({ where: { published: true } }),
    prisma.libraryChapter.count(),
    prisma.libraryArticle.count(),
    prisma.libraryArticle.count({ where: { published: true } }),
    prisma.libraryArticleCircular.count(),
  ]);
  return {
    categories,
    publishedCategories,
    laws,
    publishedLaws,
    chapters,
    articles,
    publishedArticles,
    attachedCirculars,
  };
}

export async function getRecentLaws(limit = 5) {
  return prisma.libraryLaw.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      category: { select: { title: true, slug: true } },
      _count: { select: { chapters: true } },
    },
  });
}
