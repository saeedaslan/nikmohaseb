import {
  Briefcase,
  Calculator,
  Landmark,
  TrendingUp,
  Calendar,
  FileText,
  PieChart,
  Search,
  Building2,
  Wallet,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Match {
  test: (slug: string) => boolean;
  Icon: LucideIcon;
}

const matches: Match[] = [
  { test: (s) => /حسابداری-شرکتی|حسابداری-روزانه/.test(s), Icon: Calculator },
  { test: (s) => /مالیاتی|مالیات-بر/.test(s), Icon: Landmark },
  { test: (s) => /ارزش-افزوده|افزوده/.test(s), Icon: TrendingUp },
  { test: (s) => /حسابداری-روزانه/.test(s), Icon: Calendar },
  { test: (s) => /صورت-های-مالی|صورت-شغل/.test(s), Icon: FileText },
  { test: (s) => /مشاوره-مالی|برنامه-ریزی/.test(s), Icon: PieChart },
  { test: (s) => /حسابرسی/.test(s), Icon: Search },
  { test: (s) => /ثبت-شرکت|برند|اختراف/.test(s), Icon: Building2 },
  { test: (s) => /حقوق-و-دستمزد|قوانین-کار/.test(s), Icon: Users },
  { test: (s) => /مالیات-بر-درآمد|درآمد/.test(s), Icon: Wallet },
];

export function ServiceIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = matches.find((m) => m.test(slug))?.Icon ?? Briefcase;
  return <Icon className={className ?? "h-6 w-6"} />;
}
