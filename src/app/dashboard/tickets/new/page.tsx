import { TicketForm } from "@/components/tickets/ticket-form";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "ثبت تیکت جدید | نیک محاسب سرو",
};

export default function NewTicketPage() {
  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/dashboard/tickets" className="hover:text-accent-green transition-colors">
          تیکت‌ها
        </Link>
        <ArrowRight className="h-4 w-4" />
        <span className="text-text">ثبت تیکت جدید</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/10">
            <MessageSquare className="h-6 w-6 text-accent-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-navy">ثبت تیکت جدید</h1>
            <p className="text-sm text-text-muted">درخواست خود را ثبت کنید</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <p className="mb-6 text-sm text-text-muted leading-relaxed">
          تیم پشتیبانی ما در اسرع وقت پاسخگو خواهد شد. لطفاً اطلاعات کامل وارد کنید تا بتوانیم بهترین کمک را به شما ارائه دهیم.
        </p>
        <TicketForm redirectTo="/dashboard/tickets" />
      </div>
    </div>
  );
}
