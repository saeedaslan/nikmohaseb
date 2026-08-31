import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toJalali } from "@/lib/jalali";
import { ProfilePasswordForm } from "@/components/auth/profile-password-form";
import { User, Mail, Shield, Calendar, Lock } from "lucide-react";

export const metadata = {
  title: "پروفایل | نیک محاسب سرو",
};

const roleLabels: Record<string, string> = {
  ADMIN: "ادمین",
  SUPPORT: "پشتیبان",
  USER: "کاربر",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Fetch full user data for createdAt
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { createdAt: true },
  });

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-navy">پروفایل کاربری</h1>
        <p className="text-sm text-text-muted">مدیریت اطلاعات حساب کاربری</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-green/20 text-accent-green text-3xl font-bold">
            {user.name?.charAt(0) ?? "?"}
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h2 className="text-xl font-bold text-primary-navy">{user.name}</h2>
            <p className="text-sm text-text-muted">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-medium text-accent-green">
              <Shield className="h-3 w-3" />
              {roleLabels[user.role] ?? "کاربر"}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
            <User className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-text-muted">نام</p>
            <p className="font-medium text-text">{user.name ?? "-"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-text-muted">ایمیل</p>
            <p className="font-medium text-text truncate">{user.email ?? "-"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
            <Shield className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-text-muted">نقش</p>
            <p className="font-medium text-text">{roleLabels[user.role] ?? "کاربر"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
            <Calendar className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-text-muted">عضویت</p>
            <p className="font-medium text-text">{dbUser?.createdAt ? toJalali(dbUser.createdAt) : "-"}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Lock className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-primary-navy">تغییر رمز عبور</h2>
        </div>
        <ProfilePasswordForm />
      </div>
    </div>
  );
}
