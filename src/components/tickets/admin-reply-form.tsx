"use client";

import { useForm } from "react-hook-form";
import { adminAddMessage } from "@/lib/actions/admin-tickets";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { Send } from "lucide-react";

export function AdminReplyForm({ ticketId }: { ticketId: string }) {
  const { addToast } = useToast();
  const { control, handleSubmit, reset } = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: { content: string }) => {
    const fd = new FormData();
    fd.append("content", data.content);
    const result = await adminAddMessage(ticketId, fd);
    if (result?.ok) {
      addToast({ message: "پیام ارسال شد.", variant: "success" });
      reset();
      window.location.reload();
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
      <FormField
        control={control}
        name="content"
        label="پاسخ ادمین"
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="متن پاسخ خود را وارد کنید..."
            className="min-h-[100px]"
          />
        )}
      />
      <Button type="submit" variant="accent">
        <Send className="h-4 w-4" />
        <span className="mr-1">ارسال پاسخ</span>
      </Button>
    </form>
  );
}
