"use server";

import { prisma, TicketStatus, TicketPriority, TicketCategory, Role } from "@/lib/prisma";
import { ticketCreateSchema, ticketReplySchema } from "@/lib/validations/admin";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface AttachmentInput {
  filename: string;
  originalName: string;
  url: string;
  mime: string;
  size: number;
}

function parseAttachments(raw: unknown): AttachmentInput[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is AttachmentInput =>
        typeof a === "object" &&
        a !== null &&
        typeof a.filename === "string" &&
        typeof a.originalName === "string" &&
        typeof a.url === "string" &&
        typeof a.mime === "string" &&
        typeof a.size === "number"
    );
  } catch {
    return [];
  }
}

function generateTrackingCode(): string {
  const year = 1403;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TK-${year}-${random}`;
}

export async function createTicket(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const user = await requireUser();

  const attachments = parseAttachments(formData.get("attachments"));

  const parsed = ticketCreateSchema.safeParse({
    subject: formData.get("subject"),
    category: formData.get("category"),
    priority: formData.get("priority"),
    description: formData.get("description"),
    attachments,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const attachmentsParsed = attachments.map((a) => ({
    filename: a.originalName ?? a.filename,
    path: a.url,
    mime: a.mime,
    size: a.size,
  }));

  try {
    const trackingCode = generateTrackingCode();

    const ticket = await prisma.ticket.create({
      data: {
        trackingCode,
        subject: data.subject,
        category: data.category as TicketCategory,
        priority: data.priority ?? TicketPriority.NORMAL,
        userId: user.id,
      },
    });

    await prisma.ticketMessage.create({
      data: {
        content: data.description,
        ticketId: ticket.id,
        userId: user.id,
        senderRole: "USER" as any,
        attachments: {
          create: attachmentsParsed,
        },
      },
    });
  } catch (error) {
    console.error("Ticket creation error:", error);
    return { error: "خطا در ثبت تیکت." };
  }

  revalidatePath("/dashboard/tickets");
  return { ok: true };
}

export async function getTicketStats() {
  const user = await requireUser();
  const stats = await prisma.ticket.groupBy({
    by: ["status"],
    where: { userId: user.id, isDeleted: false },
    _count: { _all: true },
  });
  const total = await prisma.ticket.count({ where: { userId: user.id, isDeleted: false } });
  return { user, stats, total };
}

export async function getUserTickets() {
  const user = await requireUser();
  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id, isDeleted: false },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      trackingCode: true,
      subject: true,
      category: true,
      priority: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true, attachments: true } },
    },
  });
  return tickets;
}

export async function getTicketById(id: string) {
  const user = await requireUser();
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        where: { isInternal: false },
        include: {
          user: { select: { id: true, name: true, role: true } },
          attachments: true,
        },
      },
      attachments: true,
    },
  });

  if (!ticket || ticket.userId !== user.id) {
    return null;
  }
  return ticket;
}

export async function addTicketMessage(
  ticketId: string,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const user = await requireUser();
  const parsed = ticketReplySchema.safeParse({
    content: formData.get("content"),
  });
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return { error: flattened.fieldErrors.content?.[0] || "متن پیام الزامی است." };
  }

  const content = parsed.data.content.trim();
  if (!content) {
    return { error: "متن پیام نمی‌تواند خالی باشد." };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true, status: true, isDeleted: true },
  });

  if (!ticket || ticket.isDeleted) {
    return { error: "تیکت یافت نشد." };
  }

  if (ticket.userId !== user.id) {
    return { error: "شما اجازه پاسخ به این تیکت را ندارید." };
  }

  if (ticket.status === TicketStatus.CLOSED) {
    return { error: "این تیکت بسته شده است و نمی‌توانید پاسخ دهید." };
  }

  await prisma.$transaction([
    prisma.ticketMessage.create({
      data: {
        content,
        ticketId: ticket.id,
        userId: user.id,
        senderRole: Role.USER,
        isInternal: false,
      },
    }),
    prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: TicketStatus.IN_PROGRESS },
    }),
  ]);

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  return { ok: true };
}
