import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { extname } from "path";

export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];

export const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE ?? 5 * 1024 * 1024);

export interface SavedFile {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mime: string;
  size: number;
}

function getSafeExtension(filename: string, mime: string): string {
  const ext = extname(filename).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) {
    return ext;
  }
  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
  };
  return mimeToExt[mime] ?? ".bin";
}

export async function saveUploadedFile(file: File): Promise<SavedFile> {
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error(`نوع فایل ${file.type} مجاز نیست`);
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("اندازه فایل بیش از حداکثر مجاز است");
  }

  const uploadDir = process.env.UPLOAD_DIR ?? "public/uploads";
  const absoluteDir = join(/* turbopackIgnore: true */ process.cwd(), uploadDir);
  await mkdir(absoluteDir, { recursive: true });

  const ext = getSafeExtension(file.name, file.type);
  const id = randomUUID();
  const safeName = `${id}${ext}`;
  const filePath = join(/* turbopackIgnore: true */ absoluteDir, safeName);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  const relativePath = `${uploadDir.startsWith("public/") ? "/uploads" : uploadDir}/${safeName}`;
  const url = `/api/uploads/${safeName}`;

  return {
    filename: safeName,
    originalName: file.name,
    path: filePath,
    url,
    mime: file.type,
    size: file.size,
  };
}
