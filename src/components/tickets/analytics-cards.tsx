"use client";

import { cn } from "@/lib/utils";
import {
  Ticket, Bell, Clock, AlertCircle, MessageSquare,
  CheckCircle2, User, BarChart3, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ticket: Ticket,
  bell: Bell,
  clock: Clock,
  alert: AlertCircle,
  message: MessageSquare,
  check: CheckCircle2,
  user: User,
  chart: BarChart3,
};

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof iconMap;
  color: "green" | "blue" | "orange" | "red" | "purple" | "yellow" | "gray";
  subtitle?: string;
}

const colorClasses = {
  green: {
    bg: "bg-accent-green/10",
    icon: "text-accent-green",
    border: "border-accent-green/20",
    glow: "shadow-accent-green/5",
  },
  blue: {
    bg: "bg-blue-500/10",
    icon: "text-blue-500",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/5",
  },
  orange: {
    bg: "bg-orange-500/10",
    icon: "text-orange-500",
    border: "border-orange-500/20",
    glow: "shadow-orange-500/5",
  },
  red: {
    bg: "bg-red-500/10",
    icon: "text-red-500",
    border: "border-red-500/20",
    glow: "shadow-red-500/5",
  },
  purple: {
    bg: "bg-purple-500/10",
    icon: "text-purple-500",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/5",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    icon: "text-yellow-500",
    border: "border-yellow-500/20",
    glow: "shadow-yellow-500/5",
  },
  gray: {
    bg: "bg-gray-500/10",
    icon: "text-gray-500",
    border: "border-gray-500/20",
    glow: "shadow-gray-500/5",
  },
};

export function AnalyticsCard({ title, value, icon, color, subtitle }: AnalyticsCardProps) {
  const classes = colorClasses[color];
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        "bg-white/80 dark:bg-surface-card/80",
        classes.border,
        classes.glow,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5" />
      <div className="relative flex items-center gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            classes.bg,
          )}
        >
          <Icon className={cn("h-6 w-6", classes.icon)} />
        </div>
        <div>
          <p className="text-2xl font-bold text-primary-navy dark:text-text">{value}</p>
          <p className="text-xs text-text-muted">{title}</p>
          {subtitle && <p className="text-[10px] text-text-muted/70">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  total?: number;
  color: string;
}

export function StatCard({ label, value, total, color }: StatCardProps) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border/60 bg-surface-card/50 p-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{label}</span>
        <span className={cn("text-sm font-bold", color)}>{value}</span>
      </div>
      {total !== undefined && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-background">
          <div
            className={cn("h-full rounded-full transition-all duration-500", color.replace("text-", "bg-"))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
