import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accolades } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const [created] = await db
      .insert(accolades)
      .values({
        year: body.year || "2025",
        title: (body.title || "Design Distinction").trim(),
        organization: (body.organization || "Design Annual").trim(),
        projectRef: (body.projectRef || "Selected Brand System").trim(),
        category: (body.category || "Brand Identity").trim(),
        sortOrder: body.sortOrder ?? 1,
      })
      .returning();

    return NextResponse.json({ accolade: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create accolade:", error);
    return NextResponse.json(
      { error: "Failed to create accolade" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid accolade id" }, { status: 400 });
    }

    await db.delete(accolades).where(eq(accolades.id, id));
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error("Failed to delete accolade:", error);
    return NextResponse.json(
      { error: "Failed to delete accolade" },
      { status: 500 }
    );
  }
}
