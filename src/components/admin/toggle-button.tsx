"use client";

import { Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { toggleUserActive } from "@/lib/actions/users";
import { toggleBannerActive } from "@/lib/actions/banners";
import { toggleFaqPublished } from "@/lib/actions/faqs";
import { toggleServicePublished } from "@/lib/actions/services";

type EntityType = "user" | "banner" | "faq" | "service";

interface ToggleButtonProps {
  entityType: EntityType;
  entityId: string;
  active: boolean;
}

export function ToggleButton({ entityType, entityId, active }: ToggleButtonProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const checked = e.target.checked;
      switch (entityType) {
        case "user":
          await toggleUserActive(entityId, checked);
          break;
        case "banner":
          await toggleBannerActive(entityId, checked);
          break;
        case "faq":
          await toggleFaqPublished(entityId, checked);
          break;
        case "service":
          await toggleServicePublished(entityId, checked);
          break;
      }
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
