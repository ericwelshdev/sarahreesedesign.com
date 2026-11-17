import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureSeeded();
    const allProjects = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id));
    return NextResponse.json({ projects: allProjects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const existing = await db.select().from(projects);
    const nextNum = existing.length + 1;
    const badge =
      body.numberBadge ||
      (nextNum < 10 ? `0${nextNum}` : `${nextNum}`);

    const rawTitle = (body.title || "Untitled Case Study").trim();
    const baseSlug = rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const [created] = await db
      .insert(projects)
      .values({
        slug: body.slug || uniqueSlug,
        numberBadge: badge,
        title: rawTitle,
        client: (body.client || "Independent Partner").trim(),
        category: (body.category || "BRANDING").toUpperCase(),
        year: body.year || "2025",
        featured: body.featured !== undefined ? Boolean(body.featured) : true,
        sortOrder: body.sortOrder ?? nextNum,
        summary:
          body.summary ||
          "Strategic brand identity and visual system crafted for enduring market resonance.",
        role: body.role || "Creative Direction & Brand Identity",
        disciplines:
          body.disciplines ||
          "Brand Strategy / Identity Design / Art Direction / Digital Experience",
        coverImage: body.coverImage || "/images/projects/dii-brand.jpg",
        detailHeroImage:
          body.detailHeroImage ||
          body.coverImage ||
          "/images/projects/natural-highs.jpg",
        secondaryImage:
          body.secondaryImage ||
          body.coverImage ||
          "/images/projects/serendipity.jpg",
        challenge:
          body.challenge ||
          "Establishing a distinctive, emotionally resonant brand language capable of scaling across digital and physical customer touchpoints.",
        approach:
          body.approach ||
          "Developed a cohesive typographic and visual architecture rooted in human storytelling, high-contrast editorial clarity, and modular components.",
        outcome:
          body.outcome ||
          "Delivered a comprehensive brand system that unified internal teams and accelerated audience engagement from day one.",
        directorNote:
          body.directorNote ||
          "Every visual decision was anchored in strategic simplicity—ensuring the brand feels unmistakable even when stripped to its bare essentials.",
        impactMetrics: Array.isArray(body.impactMetrics) && body.impactMetrics.length > 0
          ? body.impactMetrics
          : [
              {
                label: "Brand Adoption",
                value: "100%",
                detail: "Unified across digital, print, and campaign channels",
              },
              {
                label: "Audience Lift",
                value: "+78%",
                detail: "Increase in campaign recall and engagement velocity",
              },
              {
                label: "System Assets",
                value: "40+",
                detail: "Modular guidelines, templates, and art direction specs",
              },
            ],
        brandPalette: Array.isArray(body.brandPalette) && body.brandPalette.length > 0
          ? body.brandPalette
          : [
              { name: "Archive Alabaster", hex: "#F7F5F0" },
              { name: "Obsidian Ink", hex: "#111110" },
              { name: "Electric Chartreuse", hex: "#D4F82A" },
              { name: "Editorial Coral", hex: "#F26B4E" },
            ],
        deliverables: Array.isArray(body.deliverables) && body.deliverables.length > 0
          ? body.deliverables
          : [
              "Brand Strategy & Positioning Architecture",
              "Visual Identity & Typography System",
              "Campaign Art Direction & Digital UI Kit",
              "Comprehensive Brand Guidelines Playbook",
            ],
        liveUrl: body.liveUrl || "",
      })
      .returning();

    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
