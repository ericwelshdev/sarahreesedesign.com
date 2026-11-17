import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(inquiries)
      .values({
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        company: String(body.company || "Independent / Startup").trim(),
        scopes: String(body.scopes || "Brand Identity & Creative Direction").trim(),
        budgetRange: String(body.budgetRange || "$25k – $50k").trim(),
        timeline: String(body.timeline || "Q2 / Q3").trim(),
        message: String(body.message || "Interested in collaborating.").trim(),
        status: "New Brief",
      })
      .returning();

    return NextResponse.json({ inquiry: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
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
      return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
    }

    const [updated] = await db
      .update(inquiries)
      .set({
        status: body.status || "Reviewed",
      })
      .where(eq(inquiries.id, id))
      .returning();

    return NextResponse.json({ inquiry: updated });
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
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
      return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
    }

    await db.delete(inquiries).where(eq(inquiries.id, id));
    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
