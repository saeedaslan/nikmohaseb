import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminOrSupport();
    const count = await prisma.ticket.count({
      where: { status: "NEW" },
    });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
