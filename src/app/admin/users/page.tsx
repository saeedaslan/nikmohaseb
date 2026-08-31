import { listUsers } from "@/lib/actions/users";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleButton } from "@/components/admin/toggle-button";
import { RoleSelect } from "@/components/admin/role-select";
import { Input } from "@/components/ui/input";
import { toJalali } from "@/lib/jalali";
import { Search, Users, UserPlus, Shield, Headphones, User } from "lucide-react";

export const metadata = {
  title: "کاربران | ادمین | نیک محاسب سرو",
};

const roleConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Shield }> = {
  ADMIN: { label: "ادمین", color: "text-red-500", bgColor: "bg-red-500/10", icon: Shield },
  SUPPORT: { label: "پشتیبان", color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Headphones },
  USER: { label: "کاربر", color: "text-gray-500", bgColor: "bg-gray-500/10", icon: User },
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await listUsers();

  const filtered = q
    ? users.filter(
        (u) =>
          (u.name ?? "").includes(q) ||
          (u.email ?? "").includes(q) ||
          (u.phone ?? "").includes(q),
      )
    : users;

  const stats = {
    total: users.length,
    active: users.filter((u) => u.active).length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    support: users.filter((u) => u.role === "SUPPORT").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">کاربران</h1>
          <p className="text-sm text-text-muted">مدیریت کاربران سایت</p>
        </div>
        <form className="flex items-center gap-2">
          <div className="relative">
            <Input name="q" placeholder="جستجوی کاربر..." defaultValue={q} className="w-64 pr-10" />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10">
              <Users className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{stats.total}</p>
              <p className="text-xs text-text-muted">کل کاربران</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <UserPlus className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{stats.active}</p>
              <p className="text-xs text-text-muted">فعال</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{stats.admins}</p>
              <p className="text-xs text-text-muted">ادمین</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Headphones className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-navy">{stats.support}</p>
              <p className="text-xs text-text-muted">پشتیبان</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg">
          <Users className="mx-auto h-16 w-16 text-text-muted mb-4" />
          <p className="text-lg text-text-muted">کاربری یافت نشد.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="text-right">کاربر</TableHead>
                <TableHead className="text-right">ایمیل</TableHead>
                <TableHead className="text-right">موبایل</TableHead>
                <TableHead className="text-right">نقش</TableHead>
                <TableHead className="text-right">فعال</TableHead>
                <TableHead className="text-right">عضویت</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const role = roleConfig[u.role] ?? roleConfig.USER;
                const RoleIcon = role.icon;
                return (
                  <TableRow key={u.id} className="border-border/60 hover:bg-surface-background/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/20 text-accent-green font-bold">
                          {u.name?.charAt(0) ?? "?"}
                        </div>
                        <a href={`/admin/users/${u.id}`} className="font-medium text-text hover:text-accent-green transition-colors">
                          {u.name ?? "-"}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-muted">{u.email ?? "-"}</TableCell>
                    <TableCell className="text-text-muted">{u.phone ?? "-"}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${role.bgColor} ${role.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ToggleButton entityType="user" entityId={u.id} active={u.active} />
                    </TableCell>
                    <TableCell className="text-xs text-text-muted">
                      {toJalali(u.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DeleteButton label={`کاربر ${u.name ?? ""}`} entityType="user" entityId={u.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
