-- Add onDelete: Cascade to userId relations for user deletion
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_userId_fkey";
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE;

ALTER TABLE "TicketMessage" DROP CONSTRAINT IF EXISTS "TicketMessage_userId_fkey";
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE;

ALTER TABLE "TicketAttachment" DROP CONSTRAINT IF EXISTS "TicketAttachment_userId_fkey";
ALTER TABLE "TicketAttachment" ADD CONSTRAINT "TicketAttachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE;

-- Add onDelete: SetNull to authorId in Article (keep article but remove author reference)
ALTER TABLE "Article" DROP CONSTRAINT IF EXISTS "Article_authorId_fkey";
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE SET NULL;

-- Add onDelete: SetNull to assignedToId in Ticket (keep ticket but unassign)
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_assignedToId_fkey";
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"(id) ON DELETE SET NULL;
