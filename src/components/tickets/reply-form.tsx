"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTicketMessage } from "@/lib/actions/tickets";
import { ticketReplySchema, type TicketReplyInput } from "@/lib/validations/admin";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const { addToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, reset } = useForm<TicketReplyInput>({
    resolver: zodResolver(ticketReplySchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: TicketReplyInput) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("content", data.content);
      const result = await addTicketMessage(ticketId, fd);
      if (result?.ok) {
        addToast({ message: "پیام شما ارسال شد.", variant: "success" });
        reset();
        router.refresh();
      } else if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FormField
        control={control}
        name="content"
        label="پاسخ شما"
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="متن پیام خود را وارد کنید..."
            className="min-h-[100px]"
            disabled={isPending}
          />
        )}
      />
      <Button type="submit" variant="accent" disabled={isPending} loading={isPending}>
        <Send className="h-4 w-4" />
        <span className="mr-1">ارسال</span>
      </Button>
    </form>
  );
}
