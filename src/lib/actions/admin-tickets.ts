"use server";

import { prisma, TicketStatus, TicketPriority, TicketCategory, Role } from "@/lib/prisma";
import { requireAdmin, requireAdminOrSupport } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  ticketAssignSchema,
  ticketUpdateStatusSchema,
  ticketUpdatePrioritySchema,
  ticketDeleteSchema,
  ticketInternalNoteSchema,
} from "@/lib/validations/admin";

async function generateTrackingCode(): Promise<string> {
  const year = 1403;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TK-${year}-${random}`;
}

export async function listAdminTickets(
  query?: string,
  statusFilter?: string,
  priorityFilter?: string,
  categoryFilter?: string,
  assigneeFilter?: string,
  showDeleted?: boolean,
) {
  await requireAdminOrSupport();

  return prisma.ticket.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter as TicketStatus } : {}),
      ...(priorityFilter ? { priority: priorityFilter as TicketPriority } : {}),
      ...(categoryFilter ? { category: categoryFilter as TicketCategory } : {}),
      ...(assigneeFilter ? { assignedToId: assigneeFilter } : {}),
      ...(showDeleted ? {} : { isDeleted: false }),
      ...(query
        ? {
            OR: [
              { subject: { contains: query } },
              { trackingCode: { contains: query } },
              { id: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      assignedTo: { select: { id: true, name: true } },
      _count: { select: { messages: true, attachments: true } },
    },
  });
}

export async function getAdminTicket(id: string) {
  await requireAdminOrSupport();

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      assignedTo: { select: { id: true, name: true } },
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

  if (!ticket || ticket.isDeleted) {
    return null;
  }

  return ticket;
}

export async function assignTicket(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requireAdmin();

  const parsed = ticketAssignSchema.safeParse({
    ticketId: formData.get("ticketId"),
    assignedToId: formData.get("assignedToId") || undefined,
  });

  if (!parsed.success) {
    return { error: "اطلاعات نامعتبر است." };
  }

  const { ticketId, assignedToId } = parsed.data;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true },
  });

  if (!ticket) {
    return { error: "تیکت یافت نشد." };
  }

  if (assignedToId) {
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
      select: { id: true, role: true },
    });
    if (!assignee || (assignee.role !== Role.ADMIN && assignee.role !== Role.SUPPORT)) {
      return { error: "کاربر انتخاب شده مجاز به پذیرش تیکت نیست." };
    }
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedToId: assignedToId ?? null },
  });

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  return { ok: true };
}

export async function deleteTicket(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  await requireAdmin();

  const parsed = ticketDeleteSchema.safeParse({
    ticketId: formData.get("ticketId"),
  });

  if (!parsed.success) {
    return { error: "اطلاعات نامعتبر است." };
  }

  const ticketId = parsed.data.ticketId;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, isDeleted: true },
  });

  if (!ticket) {
    return { error: "تیکت یافت نشد." };
  }

  if (ticket.isDeleted) {
    return { error: "این تیکت قبلاً حذف شده است." };
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  revalidatePath("/admin/tickets");
  return { ok: true };
}

export async function updateTicketStatus(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  await requireAdminOrSupport();

  const parsed = ticketUpdateStatusSchema.safeParse({
    ticketId: formData.get("ticketId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: "اطلاعات نامعتبر است." };
  }

  const { ticketId, status } = parsed.data;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, status: true, isDeleted: true },
  });

  if (!ticket || ticket.isDeleted) {
    return { error: "تیکت یافت نشد." };
  }

  if (ticket.status === status) {
    return { ok: true };
  }

  const validTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.NEW]: [TicketStatus.IN_PROGRESS, TicketStatus.ANSWERED, TicketStatus.CLOSED],
    [TicketStatus.IN_PROGRESS]: [TicketStatus.ANSWERED, TicketStatus.CLOSED, TicketStatus.NEW],
    [TicketStatus.ANSWERED]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED, TicketStatus.NEW],
    [TicketStatus.CLOSED]: [TicketStatus.IN_PROGRESS, TicketStatus.ANSWERED, TicketStatus.NEW],
  };

  if (!validTransitions[ticket.status]?.includes(status)) {
    return { error: "تغییر وضعیت مجاز نیست." };
  }

  const updateData: { status: TicketStatus; closedAt?: Date | null } = {
    status,
  };

  if (status === TicketStatus.CLOSED) {
    updateData.closedAt = new Date();
  } else {
    updateData.closedAt = null;
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: updateData,
  });

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return { ok: true };
}

export async function updateTicketPriority(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  await requireAdminOrSupport();

  const parsed = ticketUpdatePrioritySchema.safeParse({
    ticketId: formData.get("ticketId"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return { error: "اطلاعات نامعتبر است." };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parsed.data.ticketId },
    select: { id: true },
  });

  if (!ticket) {
    return { error: "تیکت یافت نشد." };
  }

  await prisma.ticket.update({
    where: { id: parsed.data.ticketId },
    data: { priority: parsed.data.priority },
  });

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${parsed.data.ticketId}`);
  return { ok: true };
}

export async function adminAddMessage(
  ticketId: string,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requireAdminOrSupport();

  const content = formData.get("content")?.toString() ?? "";
  const isInternal = formData.get("isInternal") === "true";

  if (!content.trim() && !formData.has("attachments")) {
    return { error: "متن پیام یا فایل ضمیمه الزامی است." };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true, status: true, isDeleted: true },
  });

  if (!ticket || ticket.isDeleted) {
    return { error: "تیکت یافت نشد." };
  }

  const result = await prisma.$transaction(async (tx) => {
    const message = await tx.ticketMessage.create({
      data: {
        content: content.trim(),
        ticketId: ticket.id,
        userId: admin.id,
        senderRole: admin.role as Role,
        isInternal,
      },
    });

    let newStatus = ticket.status;
    if (!isInternal) {
      if (ticket.status === TicketStatus.NEW || ticket.status === TicketStatus.CLOSED) {
        newStatus = TicketStatus.ANSWERED;
      }
    }

    await tx.ticket.update({
      where: { id: ticket.id },
      data: {
        status: newStatus,
        closedAt: newStatus === TicketStatus.CLOSED ? new Date() : null,
      },
    });

    return { message, newStatus };
  });

  const files = formData.getAll("attachments") as File[];
  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      await prisma.ticketAttachment.create({
        data: {
          filename: file.name,
          path: `/uploads/${Date.now()}-${file.name}`,
          mime: file.type,
          size: file.size,
          ticketMessageId: result.message.id,
          userId: admin.id,
        },
      });
    }
  }

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return { ok: true };
}

export async function addInternalNote(
  ticketId: string,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requireAdminOrSupport();

  const parsed = ticketInternalNoteSchema.safeParse({
    content: formData.get("content"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return { error: flattened.fieldErrors.content?.[0] || "متن یادداشت الزامی است." };
  }

  const content = parsed.data.content.trim();
  if (!content) {
    return { error: "متن یادداشت نمی‌تواند خالی باشد." };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, isDeleted: true },
  });

  if (!ticket || ticket.isDeleted) {
    return { error: "تیکت یافت نشد." };
  }

  await prisma.ticketMessage.create({
    data: {
      content,
      ticketId: ticket.id,
      userId: admin.id,
      senderRole: admin.role as Role,
      isInternal: true,
    },
  });

  revalidatePath(`/admin/tickets/${ticketId}`);
  return { ok: true };
}

export async function getAdminDashboardMetrics() {
  await requireAdminOrSupport();

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalTickets,
    newTickets,
    inProgressTickets,
    answeredTickets,
    closedTickets,
    urgentTickets,
    criticalTickets,
    recentTickets,
    categoryBreakdown,
    staffWorkload,
  ] = await Promise.all([
    prisma.ticket.count({ where: { isDeleted: false } }),
    prisma.ticket.count({ where: { isDeleted: false, status: TicketStatus.NEW } }),
    prisma.ticket.count({ where: { isDeleted: false, status: TicketStatus.IN_PROGRESS } }),
    prisma.ticket.count({ where: { isDeleted: false, status: TicketStatus.ANSWERED } }),
    prisma.ticket.count({ where: { isDeleted: false, status: TicketStatus.CLOSED } }),
    prisma.ticket.count({ where: { isDeleted: false, priority: TicketPriority.URGENT } }),
    prisma.ticket.count({ where: { isDeleted: false, priority: TicketPriority.CRITICAL } }),
    prisma.ticket.count({
      where: { isDeleted: false, createdAt: { gte: twentyFourHoursAgo } },
    }),
    prisma.ticket.groupBy({
      by: ["category"],
      where: { isDeleted: false },
      _count: { _all: true },
    }),
    prisma.user.findMany({
      where: { role: { in: [Role.ADMIN, Role.SUPPORT] } },
      select: {
        id: true,
        name: true,
        role: true,
        _count: { select: { assignedTickets: true } },
      },
    }),
  ]);

  const unassignedTickets = await prisma.ticket.count({
    where: { isDeleted: false, assignedToId: null },
  });

  return {
    overview: {
      total: totalTickets,
      new: newTickets,
      inProgress: inProgressTickets,
      answered: answeredTickets,
      closed: closedTickets,
      urgent: urgentTickets,
      critical: criticalTickets,
      recent: recentTickets,
      unassigned: unassignedTickets,
    },
    categoryBreakdown: categoryBreakdown.map((c) => ({
      category: c.category,
      count: c._count._all,
    })),
    staffWorkload: staffWorkload.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      assignedCount: s._count.assignedTickets,
    })),
  };
}

export async function getSupportStaff() {
  await requireAdmin();

  return prisma.user.findMany({
    where: { role: { in: [Role.ADMIN, Role.SUPPORT] }, active: true },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

export { generateTrackingCode };
