import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata = {
  title: "بازنشانی رمز عبور | نیک محاسب سرو",
  description: "بازنشانی رمز عبور",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="py-8 text-center">
        <p className="text-text-muted">توکن بازنشانی یافت نشد.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-bold text-primary-navy">
        بازنشانی رمز عبور
      </h1>
      <p className="mb-6 text-center text-sm text-text-muted">
        رمز عبور جدید خود را وارد کنید.
      </p>
      <ResetPasswordForm token={token} />
    </div>
  );
}
