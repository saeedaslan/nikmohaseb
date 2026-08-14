import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
  // allow global `prisma` across hot reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });
  return client;
}

export const prisma: PrismaClient = global.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { PrismaClient } from "../../generated/prisma/client";
export type { Prisma } from "../../generated/prisma/client";
export { Role, TicketStatus, TicketPriority, CategoryType } from "../../generated/prisma/client";
export type {
  Article,
  Circular,
  Service,
  Banner,
  Faq,
  Ticket,
  User,
  Category,
  TicketMessage,
  TicketAttachment,
} from "../../generated/prisma/client";
