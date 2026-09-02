-- Add seoTitle and seoDescription to Service, Circular, and Law models
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

ALTER TABLE "Circular" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Circular" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
