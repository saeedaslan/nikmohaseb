"use server";

import { prisma, TicketStatus } from "@/lib/prisma";
import { ticketCreateSchema, ticketReplySchema } from "@/lib/validations/admin";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTicket(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const user = await requireUser();

  const attachmentsRaw = formData.get("attachments");
  let attachments: unknown[] = [];
  if (typeof attachmentsRaw === "string" && attachmentsRaw) {
    try {
      attachments = JSON.parse(attachmentsRaw);
    } catch {
      attachments = [];
    }
  }

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

  const attachmentsParsed = (attachments as unknown[]).map((f) => {
    const a = f as { filename: string; originalName: string; url: string; mime: string; size: number };
    return {
      filename: a.originalName ?? a.filename,
      path: a.url,
      mime: a.mime,
      size: a.size,
    };
  });

  try {
    const ticket = await prisma.ticket.create({
      data: {
        subject: data.subject,
        category: data.category,
        priority: data.priority ?? "NORMAL",
        userId: user.id,
      },
    });

    await prisma.ticketMessage.create({
      data: {
        content: data.description,
        ticketId: ticket.id,
        userId: user.id,
        attachments: {
          create: attachmentsParsed,
        },
      },
    });
  } catch {
    return { error: "خطا در ثبت تیکت." };
  }

  revalidatePath("/dashboard/tickets");
  return { ok: true };
}

export async function getTicketStats() {
  const user = await requireUser();
  const stats = await prisma.ticket.groupBy({
    by: ["status"],
    where: { userId: user.id },
    _count: { _all: true },
  });
  const total = await prisma.ticket.count({ where: { userId: user.id } });
  return { user, stats, total };
}

export async function getUserTickets() {
  const user = await requireUser();
  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
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
       messages: {
         orderBy: { createdAt: "asc" },
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
    return { error: parsed.error.flatten().fieldErrors.content?.[0] || "متن پیام الزامی است." };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true },
  });
  if (!ticket || ticket.userId !== user.id) {
    return { error: "تیکت یافت نشد." };
  }

  await prisma.ticketMessage.create({
    data: {
      content: parsed.data.content,
      ticketId: ticket.id,
      userId: user.id,
    },
  });

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: TicketStatus.IN_PROGRESS },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  return { ok: true };
}
