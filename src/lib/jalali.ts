import { format, formatDistanceToNow, isValid, parseISO } from "date-fns-jalali";

export function toJalali(date: Date | string | number, fmt = "yyyy/MM/dd"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "-";
  return format(d, fmt);
}

export function toJalaliDateTime(date: Date | string | number): string {
  return toJalali(date, "yyyy/MM/dd HH:mm");
}

export function fromNow(date: Date | string | number): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "-";
  return formatDistanceToNow(d, { addSuffix: true });
}

const PERSIAN_ORDINAL_WORDS: ReadonlyArray<string> = [
  "اول",
  "دوم",
  "سوم",
  "چهارم",
  "پنجم",
  "ششم",
  "هفتم",
  "هشتم",
  "نهم",
  "دهم",
  "یازدهم",
  "دوازدهم",
  "سیزدهم",
  "چهاردهم",
  "پانزدهم",
  "شانزدهم",
  "هفدهم",
  "هجدهم",
  "نوزدهم",
  "بیستم",
  "بیست و یکم",
  "بیست و دوم",
  "بیست و سوم",
  "بیست و چهارم",
  "بیست و پنجم",
  "بیست و ششم",
  "بیست و هفتم",
  "بیست و هشتم",
  "بیست و نهم",
  "سی‌ام",
];

export function toOrdinalWord(n: number): string {
  if (!Number.isFinite(n) || n < 1) return String(n);
  if (n <= 30) return PERSIAN_ORDINAL_WORDS[n - 1];
  return String(n);
}
