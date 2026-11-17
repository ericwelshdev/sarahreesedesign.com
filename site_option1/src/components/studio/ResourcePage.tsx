import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { requireStudio } from "@/lib/auth";
import { getConfig, serializeRow, TABLES } from "@/lib/resources";
import ResourceManager from "./ResourceManager";

export default async function ResourcePage({ resource, title, intro, singleton = false }: { resource: string; title: string; intro: string; singleton?: boolean }) {
  await requireStudio();
  await ensureSeeded();
  const config = getConfig(resource);
  const table = TABLES[resource];
  if (!config || !table) throw new Error(`Unknown resource ${resource}`);
  const order = config.sortKey === "sortOrder" ? [asc(table.sortOrder), asc(table.id)] : [desc(table.id)];
  const rows = (await db.select().from(table).orderBy(...order)) as Record<string, unknown>[];

  return (
    <>
      <div className="mb-8 max-w-[70ch]">
        <h1 className="text-3xl font-semibold md:text-4xl" style={{ letterSpacing: "-0.04em" }}>{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#6e6e73" }}>{intro}</p>
      </div>
      <ResourceManager resource={resource} initial={rows.map(serializeRow)} singleton={singleton} />
    </>
  );
}
