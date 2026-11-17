import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { accolades, clients, demos, faqs, profile, projects, testimonials } from "@/db/schema";

export async function getProfile() {
  await ensureSeeded();
  const [row] = await db.select().from(profile).limit(1);
  return row;
}

export async function getSite() {
  await ensureSeeded();
  const [p, projectRows, clientRows, accoladeRows, testimonialRows, faqRows, demoRows] = await Promise.all([
    db.select().from(profile).limit(1),
    db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sortOrder), asc(projects.id)),
    db.select().from(clients).where(eq(clients.published, true)).orderBy(asc(clients.sortOrder), asc(clients.id)),
    db.select().from(accolades).where(eq(accolades.published, true)).orderBy(asc(accolades.sortOrder), asc(accolades.id)),
    db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(asc(testimonials.sortOrder), asc(testimonials.id)),
    db.select().from(faqs).where(eq(faqs.published, true)).orderBy(asc(faqs.sortOrder), asc(faqs.id)),
    db.select().from(demos).where(eq(demos.published, true)).orderBy(asc(demos.sortOrder), asc(demos.id)),
  ]);
  return {
    profile: p[0],
    projects: projectRows,
    clients: clientRows,
    accolades: accoladeRows,
    testimonials: testimonialRows,
    faqs: faqRows,
    demos: demoRows,
  };
}

export async function getProjectBySlug(slug: string) {
  await ensureSeeded();
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);
  return row ?? null;
}

export async function getProjectNav(slug: string) {
  const list = await db
    .select({ slug: projects.slug, title: projects.title, client: projects.client, coverImage: projects.coverImage })
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder), asc(projects.id));
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1 || list.length < 2) return { prev: null, next: null };
  return { prev: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
}

export async function getDemoBySlug(slug: string) {
  await ensureSeeded();
  const [row] = await db.select().from(demos).where(eq(demos.slug, slug)).limit(1);
  return row ?? null;
}
