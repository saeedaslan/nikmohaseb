import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "فراموشی رمز عبور | نیک محاسب سرو",
  description: "بازنشانی رمز عبور",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-bold text-primary-navy">
        فراموشی رمز عبور
      </h1>
      <p className="mb-6 text-center text-sm text-text-muted">
        ایمیل خود را وارد کنید. لینک بازنشانی برای شما ارسال می‌شود.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
