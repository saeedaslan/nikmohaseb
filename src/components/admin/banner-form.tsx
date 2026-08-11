"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerSchema, type BannerInput } from "@/lib/validations/admin";
import { createBanner, updateBanner } from "@/lib/actions/banners";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload, type UploadedFileMeta } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface BannerFormProps {
  initialData?: BannerInput & { id?: string };
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<UploadedFileMeta[]>(() =>
    initialData?.image
      ? [
          {
            url: initialData.image,
            filename: initialData.image,
            originalName: initialData.image,
            mime: "image/jpeg",
            size: 0,
          },
        ]
      : [],
  );

  const { control, handleSubmit, setValue, watch } = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      buttonText: initialData?.buttonText ?? "",
      buttonLink: initialData?.buttonLink ?? "",
      image: initialData?.image ?? "",
      active: initialData?.active ?? false,
      order: initialData?.order ?? 0,
    },
  });

  useEffect(() => {
    const sub = watch((value) => {
      if (files.length > 0 && files[0].url !== value.image) {
        setValue("image", files[0].url);
      }
    });
    return () => sub.unsubscribe();
  }, [watch, files, setValue]);

  const buildFormData = (data: BannerInput): FormData => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description ?? "");
    fd.append("buttonText", data.buttonText ?? "");
    fd.append("buttonLink", data.buttonLink ?? "");
    fd.append("image", data.image ?? "");
    fd.append("active", String(!!data.active));
    fd.append("order", String(data.order ?? 0));
    return fd;
  };

  const onSubmit = async (data: BannerInput) => {
    const fd = buildFormData(data);
    setSubmitting(true);
    const result = initialData?.id
      ? await updateBanner(initialData.id, null, fd)
      : await createBanner(null, fd);
    setSubmitting(false);

    if (result?.ok) {
      addToast({
        message: initialData?.id ? "بنر بروزرسانی شد." : "بنر ثبت شد.",
        variant: "success",
      });
      router.push("/admin/banners");
      router.refresh();
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={control}
        name="title"
        label="عنوان بنر"
        render={({ field }) => <Input {...field} placeholder="عنوان بنر" />}
      />
      <FormField
        control={control}
        name="description"
        label="توضیح"
        render={({ field }) => (
          <Textarea {...field} placeholder="توضیح کوتاه بنر" />
        )}
      />
      <FormField
        control={control}
        name="buttonText"
        label="متن دکمه"
        render={({ field }) => (
          <Input {...field} placeholder="مثال: درخواست مشاوره" />
        )}
      />
      <FormField
        control={control}
        name="buttonLink"
        label="لینک دکمه"
        render={({ field }) => <Input {...field} placeholder="/contact" />}
      />
      <FormField
        control={control}
        name="order"
        label="ترتیب نمایش"
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            placeholder="۰"
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="active"
          checked={!!watch("active")}
          onChange={(e) => setValue("active", e.target.checked)}
        />
        <label htmlFor="active" className="text-sm text-text">
          فعال
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">
          تصویر بنر
        </label>
        <input type="hidden" name="image" value={watch("image") ?? ""} />
        <FileUpload value={files} onChange={setFiles} />
      </div>
      <Button
        type="submit"
        variant="primary"
        loading={submitting}
        disabled={submitting}
      >
        ذخیره
      </Button>
    </form>
  );
}
