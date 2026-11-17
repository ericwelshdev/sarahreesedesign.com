import { desc } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { guardApi } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function GET() {
  const denied = await guardApi();
  if (denied) return denied;
  const rows = await db
    .select({ id: media.id, filename: media.filename, mime: media.mime, size: media.size, createdAt: media.createdAt })
    .from(media)
    .orderBy(desc(media.createdAt));
  return Response.json({
    items: rows.map((r) => ({ ...r, url: `/api/media/${r.id}`, createdAt: r.createdAt.toISOString() })),
  });
}

export async function POST(req: Request) {
  const denied = await guardApi();
  if (denied) return denied;
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid upload" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return Response.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image." }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Images must be under 8 MB." }, { status: 413 });

  const data = Buffer.from(await file.arrayBuffer());
  const [row] = await db
    .insert(media)
    .values({ filename: file.name.slice(0, 200), mime: file.type, size: data.length, data })
    .returning({ id: media.id });
  return Response.json({ id: row.id, url: `/api/media/${row.id}` }, { status: 201 });
}
