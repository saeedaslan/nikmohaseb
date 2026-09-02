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

export const TICKET_CATEGORY_LABELS: Record<string, string> = {
  TAX_CONSULTING: "مشاوره مالیاتی",
  MOADIAN_SYSTEM: "سامانه مودیان",
  VAT_DECLARATION: "اظهارنامه ارزش افزوده",
  INSURANCE_PAYROLL: "بیمه و حقوق",
  TECHNICAL_SUPPORT: "پشتیبانی فنی",
  GENERAL: "عمومی",
};

export const TICKET_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  TAX_CONSULTING: "سوالات مربوط به مالیات، اظهارنامه و برنامه‌ریزی مالیاتی",
  MOADIAN_SYSTEM: "مشکلات فنی سامانه مودیان و فاکتور الکترونیکی",
  VAT_DECLARATION: "سوالات مربوط به مالیات بر ارزش افزوده",
  INSURANCE_PAYROLL: "بیمه تامین اجتماعی، حقوق و دستمزد",
  TECHNICAL_SUPPORT: "مشکلات فنی سایت و خدمات آنلاین",
  GENERAL: "سوالات و درخواست‌های عمومی",
};

export const TICKET_TEMPLATES: Array<{ label: string; subject: string; description: string }> = [
  {
    label: "سوال مالیاتی",
    subject: "سوال درباره مالیات",
    description: "سلام،\n\nسوالی داشتم درباره:\n\n",
  },
  {
    label: "مشکل فنی",
    subject: "گزارش مشکل فنی",
    description: "سلام،\n\nبا مشکل مواجه شده‌ام:\n\n\nمراحل تکرار مشکل:\n1. \n2. \n3. \n\nنتیجه مورد انتظار:\n",
  },
  {
    label: "درخواست مشاوره",
    subject: "درخواست مشاوره",
    description: "سلام،\n\nنیاز به مشاوره در زمینه:\n\n\nشرایط کار:\n",
  },
];

export const TICKET_CATEGORIES = [
  "TAX_CONSULTING",
  "MOADIAN_SYSTEM",
  "VAT_DECLARATION",
  "INSURANCE_PAYROLL",
  "TECHNICAL_SUPPORT",
  "GENERAL",
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

export interface AdminFormState {
  ok?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}
