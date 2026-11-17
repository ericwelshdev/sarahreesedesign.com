import { NextRequest, NextResponse } from "next/server";
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
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  try {
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

    return NextResponse.json({
      profile,
      projects: allProjects,
      accolades: allAccolades,
      clientPartners: allPartners,
      testimonials: allTestimonials,
      faqs: allFaqs,
      inquiries: allInquiries,
    });
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const [existing] = await db.select().from(directorProfile).limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(directorProfile)
      .set({
        name: body.name ?? existing.name,
        monogram: body.monogram ?? existing.monogram,
        wordmark: body.wordmark ?? existing.wordmark,
        roleTagline: body.roleTagline ?? existing.roleTagline,
        locationTagline: body.locationTagline ?? existing.locationTagline,
        availabilityStatus:
          body.availabilityStatus ?? existing.availabilityStatus,
        heroHeadline: body.heroHeadline ?? existing.heroHeadline,
        heroSubheadline: body.heroSubheadline ?? existing.heroSubheadline,
        perspectiveTitle: body.perspectiveTitle ?? existing.perspectiveTitle,
        perspectiveHighlight:
          body.perspectiveHighlight ?? existing.perspectiveHighlight,
        perspectiveBody: body.perspectiveBody ?? existing.perspectiveBody,
        aboutHeadline: body.aboutHeadline ?? existing.aboutHeadline,
        aboutHighlight: body.aboutHighlight ?? existing.aboutHighlight,
        aboutBio: body.aboutBio ?? existing.aboutBio,
        shortVersion: body.shortVersion ?? existing.shortVersion,
        toolkit: body.toolkit ?? existing.toolkit,
        email: body.email ?? existing.email,
        locationFooter: body.locationFooter ?? existing.locationFooter,
        yearsExperience: body.yearsExperience ?? existing.yearsExperience,
        fortuneClientsCount:
          body.fortuneClientsCount ?? existing.fortuneClientsCount,
        systemsLaunchedCount:
          body.systemsLaunchedCount ?? existing.systemsLaunchedCount,
        updatedAt: new Date(),
      })
      .where(eq(directorProfile.id, existing.id))
      .returning();

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("Failed to update director profile:", error);
    return NextResponse.json(
      { error: "Failed to update director profile" },
      { status: 500 }
    );
  }
}
