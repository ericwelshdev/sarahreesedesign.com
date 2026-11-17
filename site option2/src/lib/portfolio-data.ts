import { db } from "@/db";
import {
  directorProfile,
  projects,
  accolades,
  clientPartners,
  testimonials,
  faqs,
  inquiries,
} from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { asc, desc } from "drizzle-orm";
import { PortfolioPayload } from "@/types/portfolio";

export async function getPortfolioPayload(): Promise<PortfolioPayload> {
  await ensureSeeded();

  const [profile] = await db.select().from(directorProfile).limit(1);
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.id));
  const allAccolades = await db
    .select()
    .from(accolades)
    .orderBy(asc(accolades.sortOrder), desc(accolades.id));
  const allPartners = await db
    .select()
    .from(clientPartners)
    .orderBy(asc(clientPartners.sortOrder), asc(clientPartners.id));
  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
  const allFaqs = await db
    .select()
    .from(faqs)
    .orderBy(asc(faqs.sortOrder), asc(faqs.id));
  const allInquiries = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt), desc(inquiries.id));

  return {
    profile,
    projects: allProjects,
    accolades: allAccolades,
    clientPartners: allPartners,
    testimonials: allTestimonials,
    faqs: allFaqs,
    inquiries: allInquiries.map((inq) => ({
      ...inq,
      createdAt: inq.createdAt.toISOString(),
    })),
  };
}
