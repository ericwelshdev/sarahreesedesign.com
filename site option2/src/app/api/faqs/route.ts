import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const [created] = await db
      .insert(faqs)
      .values({
        question: (body.question || "New Question?").trim(),
        answer: (body.answer || "").trim(),
        sortOrder: body.sortOrder ?? 10,
      })
      .returning();

    return NextResponse.json({ faq: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const id = Number(body.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid FAQ id" }, { status: 400 });
    }

    const [updated] = await db
      .update(faqs)
      .set({
        question: body.question,
        answer: body.answer,
      })
      .where(eq(faqs.id, id))
      .returning();

    return NextResponse.json({ faq: updated });
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
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
      return NextResponse.json({ error: "Invalid FAQ id" }, { status: 400 });
    }

    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error("Failed to delete FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
