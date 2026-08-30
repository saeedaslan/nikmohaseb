import { getCurrentUser } from "@/lib/auth";
import { toJalali } from "@/lib/jalali";
import { Card } from "@/components/ui/card";
import { ProfilePasswordForm } from "@/components/auth/profile-password-form";

export const metadata = {
  title: "پروفایل | نیک محاسب سرو",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold text-primary-navy">پروفایل کاربری</h1>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary-navy">
          اطلاعات حساب
        </h2>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">نام</span>
            <span>{user.name ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">ایمیل</span>
            <span>{user.email ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">نقش</span>
            <span>{user.role === "ADMIN" ? "ادمین" : user.role === "SUPPORT" ? "پشتیبان" : "کاربر"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">عضویت</span>
            <span>-</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary-navy">
          تغییر رمز عبور
        </h2>
        <ProfilePasswordForm />
      </Card>
    </div>
  );
}
