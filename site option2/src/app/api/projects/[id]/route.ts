import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSeeded();
    const { id } = await context.params;
    const projectId = Number(id);
    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await request.json();
    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(projects)
      .set({
        numberBadge: body.numberBadge ?? existing.numberBadge,
        title: body.title ?? existing.title,
        client: body.client ?? existing.client,
        category: body.category
          ? String(body.category).toUpperCase()
          : existing.category,
        year: body.year ?? existing.year,
        featured:
          body.featured !== undefined ? Boolean(body.featured) : existing.featured,
        sortOrder:
          body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sortOrder,
        summary: body.summary ?? existing.summary,
        role: body.role ?? existing.role,
        disciplines: body.disciplines ?? existing.disciplines,
        coverImage: body.coverImage ?? existing.coverImage,
        detailHeroImage: body.detailHeroImage ?? existing.detailHeroImage,
        secondaryImage: body.secondaryImage ?? existing.secondaryImage,
        challenge: body.challenge ?? existing.challenge,
        approach: body.approach ?? existing.approach,
        outcome: body.outcome ?? existing.outcome,
        directorNote: body.directorNote ?? existing.directorNote,
        impactMetrics: Array.isArray(body.impactMetrics)
          ? body.impactMetrics
          : existing.impactMetrics,
        brandPalette: Array.isArray(body.brandPalette)
          ? body.brandPalette
          : existing.brandPalette,
        deliverables: Array.isArray(body.deliverables)
          ? body.deliverables
          : existing.deliverables,
        liveUrl: body.liveUrl ?? existing.liveUrl,
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(request, context);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSeeded();
    const { id } = await context.params;
    const projectId = Number(id);
    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    await db.delete(projects).where(eq(projects.id, projectId));
    return NextResponse.json({ deleted: true, id: projectId });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
