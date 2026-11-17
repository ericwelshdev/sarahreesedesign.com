import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    if (body.isSpotlight) {
      await db.update(testimonials).set({ isSpotlight: false });
    }

    const [created] = await db
      .insert(testimonials)
      .values({
        quote: (body.quote || "").trim(),
        author: (body.author || "Collaborator").trim(),
        role: (body.role || "Product & Brand Partner").trim(),
        company: (body.company || "Enterprise Client").trim(),
        isSpotlight: Boolean(body.isSpotlight),
        sortOrder: body.sortOrder ?? 10,
      })
      .returning();

    return NextResponse.json({ testimonial: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const id = Number(body.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid testimonial id" }, { status: 400 });
    }

    if (body.isSpotlight) {
      await db.update(testimonials).set({ isSpotlight: false });
    }

    const [updated] = await db
      .update(testimonials)
      .set({
        isSpotlight: Boolean(body.isSpotlight),
      })
      .where(eq(testimonials.id, id))
      .returning();

    return NextResponse.json({ testimonial: updated });
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
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
      return NextResponse.json({ error: "Invalid testimonial id" }, { status: 400 });
    }

    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
