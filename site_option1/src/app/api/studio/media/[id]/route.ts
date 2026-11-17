import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { guardApi } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardApi();
  if (denied) return denied;
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ error: "Not found" }, { status: 404 });
  await db.delete(media).where(eq(media.id, id));
  return Response.json({ ok: true });
}
