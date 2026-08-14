-- CreateEnum
CREATE TYPE "LawType" AS ENUM ('DIRECT_TAX', 'VAT', 'OTHER');

-- AlterEnum
ALTER TYPE "CategoryType" ADD VALUE 'LAW';

-- CreateTable
CREATE TABLE "Law" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "number" TEXT,
    "date" TIMESTAMPTZ(3),
    "issuer" TEXT,
    "summary" TEXT,
    "content" TEXT,
    "file" TEXT,
    "type" "LawType" NOT NULL DEFAULT 'OTHER',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMPTZ(3),
    "categoryId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Law_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Law_slug_key" ON "Law"("slug");

-- AddForeignKey
ALTER TABLE "Law" ADD CONSTRAINT "Law_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
