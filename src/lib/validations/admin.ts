import { z } from "zod";

export const ticketCategorySchema = z.enum([
  "TAX_CONSULTING",
  "MOADIAN_SYSTEM",
  "VAT_DECLARATION",
  "INSURANCE_PAYROLL",
  "TECHNICAL_SUPPORT",
  "GENERAL",
]);

export const ticketPrioritySchema = z.enum(["NORMAL", "HIGH", "URGENT", "CRITICAL"]);
export const ticketStatusSchema = z.enum(["NEW", "IN_PROGRESS", "ANSWERED", "CLOSED"]);

export const ticketCreateSchema = z.object({
  subject: z.string().min(3, "موضوع الزامی است").max(200),
  category: ticketCategorySchema,
  priority: ticketPrioritySchema.optional(),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
  attachments: z.array(z.any()).optional(),
});

export const ticketReplySchema = z.object({
  content: z.string().min(1, "پیام الزامی است"),
});

export const ticketAssignSchema = z.object({
  ticketId: z.string().min(1),
  assignedToId: z.string().min(1).nullish(),
});

export const ticketUpdateStatusSchema = z.object({
  ticketId: z.string().min(1),
  status: ticketStatusSchema,
});

export const ticketUpdatePrioritySchema = z.object({
  ticketId: z.string().min(1),
  priority: ticketPrioritySchema,
});

export const ticketDeleteSchema = z.object({
  ticketId: z.string().min(1),
});

export const ticketInternalNoteSchema = z.object({
  content: z.string().min(1, "متن یادداشت الزامی است"),
});

export const serviceSchema = z.object({
  title: z.string().min(2, "عنوان الزامی است").max(120),
  slug: z.string().min(2, "اسلاک الزامی است").max(120),
  summary: z.string().optional(),
  content: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  categoryId: z.string().optional(),
});

export const articleSchema = z.object({
  title: z.string().min(2, "عنوان الزامی است").max(180),
  slug: z.string().min(2, "اسلاک الزامی است").max(180),
  summary: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
});

export const circularSchema = z.object({
  title: z.string().min(2, "عنوان الزامی است").max(180),
  slug: z.string().min(2, "اسلاک الزامی است").max(180),
  number: z.string().optional(),
  date: z.coerce.date().optional(),
  issuer: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  file: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  categoryId: z.string().optional(),
});

export const lawSchema = z.object({
  title: z.string().min(2, "عنوان الزامی است").max(180),
  slug: z.string().min(2, "اسلاک الزامی است").max(180),
  number: z.string().optional(),
  date: z.coerce.date().optional(),
  issuer: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  file: z.string().optional(),
  type: z.enum(["DIRECT_TAX", "VAT", "OTHER"]).optional(),
  published: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  categoryId: z.string().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(180),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const faqSchema = z.object({
  category: z.string().optional(),
  question: z.string().min(2, "سوال الزامی است").max(200),
  answer: z.string().min(1, "پاسخ الزامی است"),
  slug: z.string().min(2, "اسلاک الزامی است").max(200),
  order: z.coerce.number().int().min(0).optional(),
  published: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
});

export type FaqInput = z.infer<typeof faqSchema>;

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>;
export type TicketReplyInput = z.infer<typeof ticketReplySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type CircularInput = z.infer<typeof circularSchema>;
export type LawInput = z.infer<typeof lawSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
