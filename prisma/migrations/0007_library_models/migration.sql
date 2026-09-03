-- CreateTable
CREATE TABLE "LibraryCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LibraryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryLaw" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "approvalDate" TIMESTAMPTZ(3),
    "executionDate" TIMESTAMPTZ(3),
    "lastAmendment" TIMESTAMPTZ(3),
    "status" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LibraryLaw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryBook" (
    "id" TEXT NOT NULL,
    "lawId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LibraryBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryChapter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LibraryChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryArticle" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LibraryArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryArticleNote" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibraryArticleNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryArticleRelation" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibraryArticleRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryArticleHistory" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "changeDate" TIMESTAMPTZ(3) NOT NULL,
    "changeType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibraryArticleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LibraryCategory_slug_key" ON "LibraryCategory"("slug");
CREATE INDEX "LibraryLaw_categoryId_idx" ON "LibraryLaw"("categoryId");
CREATE INDEX "LibraryLaw_published_idx" ON "LibraryLaw"("published");
CREATE UNIQUE INDEX "LibraryLaw_slug_key" ON "LibraryLaw"("slug");
CREATE UNIQUE INDEX "LibraryBook_lawId_number_key" ON "LibraryBook"("lawId", "number");
CREATE INDEX "LibraryBook_lawId_idx" ON "LibraryBook"("lawId");
CREATE UNIQUE INDEX "LibraryChapter_bookId_number_key" ON "LibraryChapter"("bookId", "number");
CREATE INDEX "LibraryChapter_bookId_idx" ON "LibraryChapter"("bookId");
CREATE UNIQUE INDEX "LibraryArticle_chapterId_number_key" ON "LibraryArticle"("chapterId", "number");
CREATE INDEX "LibraryArticle_chapterId_idx" ON "LibraryArticle"("chapterId");
CREATE INDEX "LibraryArticle_slug_idx" ON "LibraryArticle"("slug");
CREATE INDEX "LibraryArticleNote_articleId_idx" ON "LibraryArticleNote"("articleId");
CREATE UNIQUE INDEX "LibraryArticleRelation_fromId_toId_key" ON "LibraryArticleRelation"("fromId", "toId");
CREATE INDEX "LibraryArticleRelation_fromId_idx" ON "LibraryArticleRelation"("fromId");
CREATE INDEX "LibraryArticleRelation_toId_idx" ON "LibraryArticleRelation"("toId");
CREATE INDEX "LibraryArticleHistory_articleId_idx" ON "LibraryArticleHistory"("articleId");

-- AddForeignKey
ALTER TABLE "LibraryLaw" ADD CONSTRAINT "LibraryLaw_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LibraryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryBook" ADD CONSTRAINT "LibraryBook_lawId_fkey" FOREIGN KEY ("lawId") REFERENCES "LibraryLaw"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryChapter" ADD CONSTRAINT "LibraryChapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "LibraryBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryArticle" ADD CONSTRAINT "LibraryArticle_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "LibraryChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryArticleNote" ADD CONSTRAINT "LibraryArticleNote_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "LibraryArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryArticleRelation" ADD CONSTRAINT "LibraryArticleRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "LibraryArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryArticleRelation" ADD CONSTRAINT "LibraryArticleRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "LibraryArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryArticleHistory" ADD CONSTRAINT "LibraryArticleHistory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "LibraryArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
