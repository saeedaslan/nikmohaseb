export const TICKET_STATUS_LABELS: Record<string, string> = {
  NEW: "جدید",
  IN_PROGRESS: "در حال بررسی",
  ANSWERED: "پاسخ‌داده شده",
  CLOSED: "بسته‌شده",
};

export const TICKET_PRIORITY_LABELS: Record<string, string> = {
  NORMAL: "عادی",
  HIGH: "مهم",
  URGENT: "فوری",
  CRITICAL: "حیاتی",
};

export const TICKET_CATEGORIES = [
  "مالیاتی",
  "حسابداری",
  "اظهارنامه",
  "ارزش افزوده",
  "بیمه و حقوق",
  "حسابرسی",
  "ثبت شرکت",
  "مشاوره مالی",
  "سایر",
] as const;

export const TICKET_STATUSES = ["NEW", "IN_PROGRESS", "ANSWERED", "CLOSED"] as const;
export const TICKET_PRIORITIES = ["NORMAL", "HIGH", "URGENT", "CRITICAL"] as const;

export interface ActionSuccess {
  ok: true;
}

export interface ActionError {
  ok: false;
  error: string;
  errors?: Record<string, string[]>;
}

export type ActionResult = ActionSuccess | ActionError;
