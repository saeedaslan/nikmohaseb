-- Add nullable shortTitle to Circular for the listing-card view
-- (full official title remains on the detail page H1).
-- Idempotent so the entrypoint's `prisma migrate deploy` is a no-op when
-- the column has already been added manually to the production database.
ALTER TABLE "Circular" ADD COLUMN IF NOT EXISTS "shortTitle" TEXT;
