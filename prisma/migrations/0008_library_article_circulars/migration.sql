-- CreateTable
CREATE TABLE "LibraryArticleCircular" (
    "articleId" TEXT NOT NULL,
    "circularId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibraryArticleCircular_pkey" PRIMARY KEY ("articleId","circularId")
);

-- CreateIndex
CREATE INDEX "LibraryArticleCircular_articleId_idx" ON "LibraryArticleCircular"("articleId");
CREATE INDEX "LibraryArticleCircular_circularId_idx" ON "LibraryArticleCircular"("circularId");

-- AddForeignKey
ALTER TABLE "LibraryArticleCircular" ADD CONSTRAINT "LibraryArticleCircular_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "LibraryArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LibraryArticleCircular" ADD CONSTRAINT "LibraryArticleCircular_circularId_fkey" FOREIGN KEY ("circularId") REFERENCES "Circular"("id") ON DELETE CASCADE ON UPDATE CASCADE;
