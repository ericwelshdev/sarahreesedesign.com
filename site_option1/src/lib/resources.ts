import "server-only";
import { RESOURCES, type Field, type ResourceConfig } from "./studio-schemas";
import * as s from "@/db/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TABLES: Record<string, any> = {
  projects: s.projects,
  clients: s.clients,
  accolades: s.accolades,
  testimonials: s.testimonials,
  faqs: s.faqs,
  demos: s.demos,
  inquiries: s.inquiries,
  profile: s.profile,
};

const MAX_TEXT = 300_000;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function coerceValue(field: Field, v: unknown): unknown {
  switch (field.type) {
    case "number": {
      const n = Number.parseInt(String(v ?? "0"), 10);
      return Number.isFinite(n) ? n : 0;
    }
    case "boolean":
      return v === true || v === "true";
    case "select": {
      const val = String(v ?? "");
      return field.options?.some((o) => o.value === val) ? val : (field.options?.[0]?.value ?? "");
    }
    case "color": {
      const val = String(v ?? "").trim();
      return /^#[0-9a-fA-F]{3,8}$/.test(val) ? val : "#000000";
    }
    case "strings": {
      const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : [];
      return arr
        .map((x) => String(x ?? "").trim().slice(0, 2000))
        .filter(Boolean)
        .slice(0, 100);
    }
    case "list": {
      if (!Array.isArray(v)) return [];
      return v.slice(0, 100).map((item) => coerceObject(field.itemFields ?? [], (item ?? {}) as Record<string, unknown>));
    }
    default:
      return String(v ?? "").trim().slice(0, MAX_TEXT);
  }
}

function coerceObject(fields: Field[], input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.readOnly) continue;
    out[f.key] = coerceValue(f, input[f.key]);
  }
  return out;
}

export function getConfig(resource: string): ResourceConfig | null {
  return RESOURCES[resource] ?? null;
}

/** Whitelist + coerce a request body against the schema. Unknown keys are dropped. */
export function coerceBody(config: ResourceConfig, body: Record<string, unknown>) {
  const fields = config.sections.flatMap((sec) => sec.fields);
  const out = coerceObject(fields, body);
  // Projects & demos need a slug.
  if ("slug" in out) {
    const base = String(out.slug || "") || slugify(String(out.title || out.name || ""));
    out.slug = slugify(base) || `item-${Date.now().toString(36)}`;
  }
  return out;
}

export function errorCode(err: unknown): string | undefined {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code ?? e?.cause?.code;
}

export function serializeRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v instanceof Date) out[k] = k === "createdAt" ? v.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : v.toISOString();
    else out[k] = v;
  }
  return out;
}
