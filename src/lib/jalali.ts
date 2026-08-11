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
