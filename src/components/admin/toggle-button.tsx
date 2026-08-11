"use client";

import { Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface ToggleButtonProps {
  active: boolean;
  onToggle: () => Promise<unknown> | unknown;
}

export function ToggleButton({ active, onToggle }: ToggleButtonProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await onToggle();
      router.refresh();
    } catch {
      addToast({ message: "خطا در بروزرسانی وضعیت.", variant: "error" });
    }
  };

  return (
    <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full outline-none">
      <input
        type="checkbox"
        checked={active}
        onChange={handle}
        className="peer h-5 w-9 cursor-pointer appearance-none rounded-full border-2 border-transparent bg-text-muted/40 outline-none transition-colors checked:bg-accent-green"
      />
      <Check className="absolute end-1 top-0.5 h-3 w-3 text-transparent opacity-0 transition-opacity peer-checked:opacity-100 peer-checked:text-white" />
    </label>
  );
}
