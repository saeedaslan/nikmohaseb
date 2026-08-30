import { getUserById } from "@/lib/actions/users";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "کاربر | ادمین | نیک محاسب سرو",
};

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, subject: true, status: true, createdAt: true },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">
          {user.name ?? ""}
        </h1>
        <Badge variant={user.active ? "success" : "warning"}>
          {user.active ? "فعال" : "غیرفعال"}
        </Badge>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-muted">نام:</span> {user.name ?? "-"}
          </div>
          <div>
            <span className="text-text-muted">نقش:</span>{" "}
            {user.role === "ADMIN" ? "ادمین" : user.role === "SUPPORT" ? "پشتیبان" : "کاربر"}
          </div>
          <div>
            <span className="text-text-muted">ایمیل:</span> {user.email ?? "-"}
          </div>
          <div>
            <span className="text-text-muted">موبایل:</span> {user.phone ?? "-"}
          </div>
          <div>
            <span className="text-text-muted">عضویت:</span>{" "}
            {toJalali(user.createdAt)}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 text-lg font-semibold text-primary-navy">تیکت‌ها</h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-text-muted">تیکتی ندارد.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between"
              >
                <a
                  href={`/admin/tickets/${t.id}`}
                  className="text-accent-green hover:underline"
                >
                  {t.subject}
                </a>
                <Badge variant="default">{t.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
