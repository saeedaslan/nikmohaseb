import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { companyName, companyDescription } from "@/lib/nav";
import { ShieldCheck, Award, Users } from "lucide-react";
import Header from "@/components/layout/header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-56px)]">
      {/* Right Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[calc(100vh-56px)]">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green" />
        
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
          {/* Logo */}
          <Link href="/" className="mb-12 inline-flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt={companyName}
              width={180}
              height={50}
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>
          
          {/* Welcome Text */}
          <h1 className="mb-4 text-4xl font-extrabold leading-tight">
            به نیک محاسب سرو
            <br />
            خوش آمدید
          </h1>
          <p className="mb-12 text-lg text-white/70 max-w-md">
            {companyDescription}
          </p>
          
          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                <ShieldCheck className="h-6 w-6 text-accent-yellow" />
              </div>
              <div>
                <h3 className="font-semibold">امنیت بالا</h3>
                <p className="text-sm text-white/60">اطلاعات شما کاملاً محافظت شده</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                <Award className="h-6 w-6 text-accent-yellow" />
              </div>
              <div>
                <h3 className="font-semibold">تیم متخصص</h3>
                <p className="text-sm text-white/60">بیش از ۱۰ سال تجربه حرفه‌ای</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                <Users className="h-6 w-6 text-accent-yellow" />
              </div>
              <div>
                <h3 className="font-semibold">+۵۰۰ مشتری</h3>
                <p className="text-sm text-white/60">مشتریان راضی در سراسر ایران</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-6 min-h-[calc(100vh-56px)]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary-navy">
              <Image
                src="/images/logo.png"
                alt={companyName}
                width={120}
                height={30}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          {/* Form Card */}
          <div className="animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
