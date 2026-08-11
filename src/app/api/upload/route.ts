import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غیرفعال" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "هیچ فایلی یافت نشد" }, { status: 400 });
    }

    const saved = await saveUploadedFile(file);

    return NextResponse.json({
      url: saved.url,
      filename: saved.filename,
      originalName: saved.originalName,
      mime: saved.mime,
      size: saved.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در بارگذاری فایل";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
