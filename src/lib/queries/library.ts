import { prisma } from "@/lib/prisma";

export async function getPublishedLibraryCategories() {
  return prisma.libraryCategory.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      _count: { select: { laws: { where: { published: true } } } },
      laws: {
        where: { published: true },
        orderBy: { updatedAt: "desc" },
        select: {
          updatedAt: true,
          chapters: {
            select: { _count: { select: { articles: { where: { published: true } } } } },
          },
        },
      },
    },
  });
}

export async function getLibraryCategoryBySlug(slug: string) {
  return prisma.libraryCategory.findUnique({
    where: { slug },
    include: {
      laws: {
        where: { published: true },
        orderBy: [{ order: "asc" }, { title: "asc" }],
      },
    },
  });
}

export async function getPublishedLibraryLaws() {
  return prisma.libraryLaw.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      category: true,
      _count: {
        select: {
          chapters: true,
        },
      },
      chapters: {
        select: { _count: { select: { articles: true } } },
      },
    },
  });
}

export async function getLibraryLawBySlug(slug: string) {
  return prisma.libraryLaw.findUnique({
    where: { slug },
    include: {
      category: true,
      _count: {
        select: {
          chapters: true,
        },
      },
      chapters: {
        orderBy: { number: "asc" },
        include: {
          articles: {
            orderBy: { number: "asc" },
            select: { id: true, number: true, title: true, slug: true, published: true },
          },
        },
      },
    },
  });
}

export async function getLibraryLawStructure(lawId: string) {
  return prisma.libraryChapter.findMany({
    where: { lawId },
    orderBy: { number: "asc" },
    select: {
      id: true,
      title: true,
      number: true,
      _count: {
        select: { articles: { where: { published: true } } },
      },
    },
  });
}

export async function getLibraryLawFullStructure(lawId: string) {
  return prisma.libraryChapter.findMany({
    where: { lawId },
    orderBy: { number: "asc" },
    select: {
      id: true,
      title: true,
      number: true,
      articles: {
        orderBy: { number: "asc" },
        select: { id: true, number: true, title: true, slug: true, content: true, published: true },
      },
    },
  });
}

export async function getLibraryArticle(lawSlug: string, articleSlug: string) {
  const law = await prisma.libraryLaw.findUnique({
    where: { slug: lawSlug },
    include: {
      category: true,
      chapters: {
        orderBy: { number: "asc" },
        include: {
          articles: {
            where: { slug: articleSlug, published: true },
            include: {
              notes: { orderBy: { order: "asc" } },
              history: { orderBy: { changeDate: "asc" } },
              circulars: {
                include: {
                  circular: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      number: true,
                      date: true,
                    },
                  },
                },
              },
              relationsFrom: {
                include: {
                  to: {
                    include: {
                      chapter: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!law) return null;
  const article = law.chapters
    .flatMap((c) => c.articles)[0];
  if (!article) return null;
  return { law, article };
}

export async function getLibraryArticleById(articleId: string) {
  return prisma.libraryArticle.findUnique({
    where: { id: articleId },
    include: {
      notes: { orderBy: { order: "asc" } },
      history: { orderBy: { changeDate: "asc" } },
      circulars: {
        orderBy: { createdAt: "desc" },
        include: {
          circular: {
            select: {
              id: true,
              title: true,
              slug: true,
              number: true,
              date: true,
            },
          },
        },
      },
      relationsFrom: {
        include: {
          to: {
            select: { id: true, number: true, title: true, slug: true },
          },
        },
      },
      chapter: {
        select: {
          id: true,
          number: true,
          title: true,
          law: { select: { id: true, title: true, slug: true, category: true } },
        },
      },
    },
  });
}

export async function getLibraryLawArticles(lawId: string) {
  return prisma.libraryArticle.findMany({
    where: {
      published: true,
      chapter: { lawId },
    },
    orderBy: [{ chapter: { number: "asc" } }, { number: "asc" }],
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      chapter: {
        select: {
          id: true,
          number: true,
          title: true,
        },
      },
    },
  });
}

export async function getLibraryLawToc(lawId: string) {
  return prisma.libraryArticle.findMany({
    where: {
      published: true,
      chapter: { lawId },
    },
    orderBy: [{ chapter: { number: "asc" } }, { number: "asc" }],
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      chapter: {
        select: { id: true, number: true, title: true },
      },
    },
  });
}

export async function getRelatedLaws(lawId: string, categoryId: string, limit = 6) {
  return prisma.libraryLaw.findMany({
    where: {
      id: { not: lawId },
      published: true,
      OR: [{ categoryId }, { status: { not: null } }],
    },
    take: limit,
    orderBy: [{ order: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      status: true,
      category: { select: { title: true, slug: true } },
    },
  });
}

export async function getLibraryArticleNeighbors(articleId: string) {
  const current = await prisma.libraryArticle.findUnique({
    where: { id: articleId },
    select: { chapterId: true, number: true },
  });
  if (!current) return { prev: null, next: null };
  const [prev, next] = await Promise.all([
    prisma.libraryArticle.findFirst({
      where: { chapterId: current.chapterId, number: { lt: current.number }, published: true },
      orderBy: { number: "desc" },
      select: { slug: true, number: true, title: true },
    }),
    prisma.libraryArticle.findFirst({
      where: { chapterId: current.chapterId, number: { gt: current.number }, published: true },
      orderBy: { number: "asc" },
      select: { slug: true, number: true, title: true },
    }),
  ]);
  return { prev, next };
}

export async function searchLibrary(query: string, limit = 20) {
  if (!query || query.length < 2) return [];
  return prisma.libraryArticle.findMany({
    where: {
      published: true,
      OR: [
        { content: { contains: query, mode: "insensitive" } },
        { title: { contains: query, mode: "insensitive" } },
        { number: { equals: parseInt(query) || undefined } },
      ],
    },
    take: limit,
    orderBy: { number: "asc" },
    include: {
      chapter: {
        include: { law: { select: { title: true, slug: true } } },
      },
    },
  });
}

export type LibraryCategory = Awaited<ReturnType<typeof getPublishedLibraryCategories>>[number];
export type LibraryLaw = Awaited<ReturnType<typeof getLibraryLawBySlug>>;
export type LibraryArticle = NonNullable<Awaited<ReturnType<typeof getLibraryArticle>>>["article"];
export type LibraryLawStructure = Awaited<ReturnType<typeof getLibraryLawStructure>>;
