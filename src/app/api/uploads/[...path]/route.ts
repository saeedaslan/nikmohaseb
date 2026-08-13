import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { stat } from "fs/promises";
import { join } from "path";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const [filename] = path.slice(-1);
  if (!filename) {
    return new NextResponse("Not found", { status: 404 });
  }

  const uploadDir = process.env.UPLOAD_DIR ?? "public/uploads";
   const filePath = join(/* turbopackIgnore: true */ process.cwd(), uploadDir, ...path);

  try {
    await stat(filePath);
    const file = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const contentType = MIME[ext] ?? "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
