import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { guardApi } from "@/lib/auth";
import { coerceBody, errorCode, getConfig, serializeRow, TABLES } from "@/lib/resources";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const { resource } = await params;
  const config = getConfig(resource);
  const table = TABLES[resource];
  if (!config || !table) return Response.json({ error: "Unknown resource" }, { status: 404 });
  await ensureSeeded();
  const order =
    config.sortKey === "sortOrder" ? [asc(table.sortOrder), asc(table.id)] : [desc(table.id)];
  const rows = await db.select().from(table).orderBy(...order);
  return Response.json({ rows: rows.map((r: Record<string, unknown>) => serializeRow(r)) });
}

export async function POST(req: Request, { params }: Ctx) {
  const denied = await guardApi();
  if (denied) return denied;
  const { resource } = await params;
  const config = getConfig(resource);
  const table = TABLES[resource];
  if (!config || !table || !config.canCreate) return Response.json({ error: "Not allowed" }, { status: 405 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const values = coerceBody(config, body);
  const titleValue = String(values[config.titleKey] ?? "").trim();
  if (!titleValue) return Response.json({ error: "A title is required before saving." }, { status: 400 });

  try {
    const [row] = (await db.insert(table).values(values).returning()) as unknown as Record<string, unknown>[];
    return Response.json({ row: serializeRow(row) }, { status: 201 });
  } catch (err) {
    if (errorCode(err) === "23505") return Response.json({ error: "That URL slug is already in use. Try another." }, { status: 409 });
    console.error(err);
    return Response.json({ error: "Could not save" }, { status: 500 });
  }
}
