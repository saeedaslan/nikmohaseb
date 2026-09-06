import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type BadgeTone = "navy-green" | "green-yellow" | "yellow-navy";

const toneClasses: Record<BadgeTone, string> = {
  "navy-green": "bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green shadow-primary-navy/30 group-hover:shadow-primary-navy/50",
  "green-yellow": "bg-gradient-to-br from-accent-green via-accent-green to-accent-yellow shadow-accent-green/30 group-hover:shadow-accent-green/50",
  "yellow-navy": "bg-gradient-to-br from-accent-yellow via-accent-yellow to-primary-navy shadow-accent-yellow/30 group-hover:shadow-accent-yellow/50",
};

const toneMuted: Record<BadgeTone, string> = {
  "navy-green": "bg-gradient-to-br from-text-muted/30 to-text-muted/20 shadow-text-muted/20",
  "green-yellow": "bg-gradient-to-br from-text-muted/30 to-text-muted/20 shadow-text-muted/20",
  "yellow-navy": "bg-gradient-to-br from-text-muted/30 to-text-muted/20 shadow-text-muted/20",
};

interface ItemBadgeProps {
  number?: number;
  icon?: LucideIcon;
  toPersian?: (n: number) => string;
  muted?: boolean;
  tone?: BadgeTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<ItemBadgeProps["size"]>, string> = {
  sm: "h-10 w-10 rounded-xl",
  md: "h-12 w-12 rounded-2xl sm:h-14 sm:w-14",
  lg: "h-16 w-16 rounded-2xl sm:h-20 sm:w-20",
};

const iconSizes: Record<NonNullable<ItemBadgeProps["size"]>, string> = {
  sm: "h-5 w-5",
  md: "h-6 w-6 sm:h-7 sm:w-7",
  lg: "h-7 w-7 sm:h-9 sm:w-9",
};

const textSizes: Record<NonNullable<ItemBadgeProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base sm:text-lg",
  lg: "text-2xl sm:text-3xl",
};

export function ItemBadge({
  number,
  icon: Icon,
  toPersian,
  muted = false,
  tone = "navy-green",
  size = "md",
  className,
}: ItemBadgeProps) {
  return (
    <div
      className={cn(
        "relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden shadow-md",
        sizeClasses[size],
        muted ? toneMuted[tone] : toneClasses[tone],
        className,
      )}
    >
      <span className="absolute inset-0 grid-pattern opacity-15" />
      {Icon ? (
        <Icon className={cn("relative text-white", iconSizes[size])} strokeWidth={2.25} />
      ) : (
        <span className={cn("relative font-black text-white", textSizes[size])}>
          {toPersian && number !== undefined ? toPersian(number) : number}
        </span>
      )}
    </div>
  );
}

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
export function toPersianDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => persianDigits[Number(d)]);
}
