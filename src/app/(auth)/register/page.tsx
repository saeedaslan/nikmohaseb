import RegisterForm from "@/components/auth/register-form";

export const metadata = {
  title: "ثبت‌نام | نیک محاسب سرو",
  description: "ثبت‌نام در نیک محاسب سرو",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-bold text-primary-navy">
        ثبت‌نام در نیک محاسب سرو
      </h1>
      <p className="mb-6 text-center text-sm text-text-muted">
        برای دسترسی به پنل کاربری، حساب کاربری بسازید.
      </p>
      <RegisterForm />
    </div>
  );
}
