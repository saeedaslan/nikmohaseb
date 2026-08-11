import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocalFixed(value: number, digits = 0): string {
  return value.toLocaleString("fa-IR");
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function absoluteUrl(path: string = "/") {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
  }
  return path;
}
