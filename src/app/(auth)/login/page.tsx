import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "ورود | نیک محاسب سرو",
  description: "ورود به حساب کاربری نیک محاسب سرو",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-primary-navy">
          ورود به حساب کاربری
        </h1>
        <p className="text-sm text-text-muted">
          برای دسترسی به پنل کاربری وارد حساب خود شوید
        </p>
      </div>
      <LoginForm callbackUrl={callbackUrl || "/dashboard"} />
    </div>
  );
}
