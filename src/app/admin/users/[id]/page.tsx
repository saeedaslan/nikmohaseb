import { getUserById } from "@/lib/actions/users";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import {
  User, Mail, Phone, Calendar, Shield, Headphones,
  Ticket, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RoleSelect } from "@/components/admin/role-select";
import { ToggleButton } from "@/components/admin/toggle-button";

export const metadata = {
  title: "کاربر | ادمین | نیک محاسب سرو",
};

const roleConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Shield }> = {
  ADMIN: { label: "ادمین", color: "text-red-500", bgColor: "bg-red-500/10", icon: Shield },
  SUPPORT: { label: "پشتیبان", color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Headphones },
  USER: { label: "کاربر", color: "text-gray-500", bgColor: "bg-gray-500/10", icon: User },
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
    select: { id: true, subject: true, status: true, priority: true, createdAt: true },
  });

  const role = roleConfig[user.role] ?? roleConfig.USER;
  const RoleIcon = role.icon;

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "NEW" || t.status === "IN_PROGRESS" || t.status === "ANSWERED").length,
    closed: tickets.filter((t) => t.status === "CLOSED").length,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/admin/users" className="hover:text-accent-green transition-colors">
          کاربران
        </Link>
        <ArrowRight className="h-4 w-4" />
        <span className="text-text">{user.name}</span>
      </div>

      {/* User Profile Card */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-green/20 text-accent-green text-2xl font-bold">
              {user.name?.charAt(0) ?? "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-navy">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${role.bgColor} ${role.color}`}>
                  <RoleIcon className="h-3 w-3" />
                  {role.label}
                </span>
                <Badge variant={user.active ? "success" : "warning"}>
                  {user.active ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/10">
              <Ticket className="h-6 w-6 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{ticketStats.total}</p>
              <p className="text-xs text-text-muted">کل تیکت‌ها</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
              <Ticket className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{ticketStats.open}</p>
              <p className="text-xs text-text-muted">تیکت‌های باز</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Ticket className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{ticketStats.closed}</p>
              <p className="text-xs text-text-muted">تیکت‌های بسته</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <h2 className="text-lg font-bold text-primary-navy mb-4">اطلاعات کاربر</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-4">
            <User className="h-5 w-5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">نام</p>
              <p className="font-medium text-text">{user.name ?? "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-4">
            <Mail className="h-5 w-5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">ایمیل</p>
              <p className="font-medium text-text">{user.email ?? "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-4">
            <Phone className="h-5 w-5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">موبایل</p>
              <p className="font-medium text-text">{user.phone ?? "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-4">
            <Calendar className="h-5 w-5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">عضویت</p>
              <p className="font-medium text-text">{toJalali(user.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-4">
            <Shield className="h-5 w-5 text-text-muted" />
            <div className="flex-1">
              <p className="text-xs text-text-muted">نقش</p>
              <RoleSelect userId={user.id} currentRole={user.role} />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-4">
            <User className="h-5 w-5 text-text-muted" />
            <div className="flex-1">
              <p className="text-xs text-text-muted">وضعیت</p>
              <ToggleButton entityType="user" entityId={user.id} active={user.active} />
            </div>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <h2 className="text-lg font-bold text-primary-navy mb-4">تیکت‌ها</h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">تیکتی ندارد.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Link
                key={t.id}
                href={`/admin/tickets/${t.id}`}
                className="flex items-center justify-between rounded-xl bg-surface-background p-4 hover:bg-accent-green/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${t.status === "CLOSED" ? "bg-green-500" : t.status === "NEW" ? "bg-blue-500" : "bg-orange-500"}`} />
                  <span className="font-medium text-text">{t.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.status === "CLOSED" ? "success" : t.status === "NEW" ? "default" : "warning"}>
                    {t.status}
                  </Badge>
                  <span className="text-xs text-text-muted">{toJalali(t.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
