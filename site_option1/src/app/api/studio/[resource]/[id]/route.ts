import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guardApi } from "@/lib/auth";
import { coerceBody, errorCode, getConfig, serializeRow, TABLES } from "@/lib/resources";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const { resource, id: idParam } = await params;
  const config = getConfig(resource);
  const table = TABLES[resource];
  const id = Number.parseInt(idParam, 10);
  if (!config || !table || !Number.isFinite(id)) return Response.json({ error: "Not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const values = coerceBody(config, body);
  if (config.canCreate && !String(values[config.titleKey] ?? "").trim()) {
    return Response.json({ error: "A title is required." }, { status: 400 });
  }
  if ("updatedAt" in table) values.updatedAt = new Date();

  try {
    const [row] = (await db.update(table).set(values).where(eq(table.id, id)).returning()) as unknown as Record<string, unknown>[];
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ row: serializeRow(row) });
  } catch (err) {
    if (errorCode(err) === "23505") return Response.json({ error: "That URL slug is already in use. Try another." }, { status: 409 });
    console.error(err);
    return Response.json({ error: "Could not save" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const { resource, id: idParam } = await params;
  const config = getConfig(resource);
  const table = TABLES[resource];
  const id = Number.parseInt(idParam, 10);
  if (!config || !table || !config.canDelete || !Number.isFinite(id)) return Response.json({ error: "Not allowed" }, { status: 405 });
  await db.delete(table).where(eq(table.id, id));
  return Response.json({ ok: true });
}
