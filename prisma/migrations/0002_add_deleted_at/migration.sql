-- Add deletedAt column to Ticket table for soft delete
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
