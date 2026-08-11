import { TicketForm } from "@/components/tickets/ticket-form";

export const metadata = {
  title: "ثبت تیکت جدید | نیک محاسب سرو",
};

export default function NewTicketPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ثبت تیکت جدید
      </h1>
      <p className="mb-4 text-sm text-text-muted">
        درخواست خود را ثبت کنید. تیم پشتیبانی ما در اسرعت‌ترین زمان پاسخ‌گو خواهد شد.
      </p>
      <TicketForm redirectTo="/dashboard/tickets" />
    </div>
  );
}
