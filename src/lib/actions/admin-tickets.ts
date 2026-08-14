"use server";

import { prisma, TicketStatus } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function listAdminTickets() {
  return prisma.ticket.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true, attachments: true } },
    },
  });
}

export async function getAdminTicket(id: string) {
  return prisma.ticket.findUnique({
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
}

export async function updateTicketStatus(id: string, status: string) {
  await prisma.ticket.update({
    where: { id },
    data: { status: status as TicketStatus },
  });
  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${id}`);
  return { ok: true };
}

export async function adminAddMessage(
  ticketId: string,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const content = formData.get("content")?.toString() ?? "";
  if (!content.trim()) return { error: "متن پیام الزامی است." };

  const admin = await requireAdmin();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true, status: true },
  });
  if (!ticket) return { error: "تیکت یافت نشد." };

  await prisma.ticketMessage.create({
    data: { content, ticketId: ticket.id, userId: admin.id },
  });

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: TicketStatus.ANSWERED },
  });

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return { ok: true };
}
