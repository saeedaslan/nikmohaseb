-- Migration: remove LibraryBook; move LibraryChapter to reference LibraryLaw directly
-- Data preservation: all existing chapters are re-parented to their book's lawId.

-- Step 1: add nullable lawId column to LibraryChapter
ALTER TABLE "LibraryChapter" ADD COLUMN "lawId" TEXT;

-- Step 2: backfill from existing books
UPDATE "LibraryChapter" c
SET "lawId" = b."lawId"
FROM "LibraryBook" b
WHERE c."bookId" = b.id;

-- Step 3: enforce NOT NULL now that data is backfilled
ALTER TABLE "LibraryChapter" ALTER COLUMN "lawId" SET NOT NULL;

-- Step 4: indexes for the new lawId column
CREATE INDEX "LibraryChapter_lawId_idx" ON "LibraryChapter"("lawId");
CREATE UNIQUE INDEX "LibraryChapter_lawId_number_key" ON "LibraryChapter"("lawId", "number");

-- Step 5: drop old bookId FK and column
ALTER TABLE "LibraryChapter" DROP CONSTRAINT "LibraryChapter_bookId_fkey";
DROP INDEX "LibraryChapter_bookId_idx";
DROP INDEX "LibraryChapter_bookId_number_key";
ALTER TABLE "LibraryChapter" DROP COLUMN "bookId";

-- Step 6: add FK to LibraryLaw
ALTER TABLE "LibraryChapter" ADD CONSTRAINT "LibraryChapter_lawId_fkey" FOREIGN KEY ("lawId") REFERENCES "LibraryLaw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: drop LibraryBook
DROP INDEX "LibraryBook_lawId_idx";
DROP INDEX "LibraryBook_lawId_number_key";
ALTER TABLE "LibraryBook" DROP CONSTRAINT "LibraryBook_lawId_fkey";
DROP TABLE "LibraryBook";
