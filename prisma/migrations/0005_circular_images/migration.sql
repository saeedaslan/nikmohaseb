-- CreateTable
CREATE TABLE "CircularImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "circularId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircularImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CircularImage_circularId_idx" ON "CircularImage"("circularId");

-- AddForeignKey
ALTER TABLE "CircularImage" ADD CONSTRAINT "CircularImage_circularId_fkey" FOREIGN KEY ("circularId") REFERENCES "Circular"("id") ON DELETE CASCADE ON UPDATE CASCADE;
