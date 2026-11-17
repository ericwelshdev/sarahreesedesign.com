import { db } from "@/db";
import { inquiries } from "@/db/schema";

export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  if (recent.length >= 5) {
    return Response.json({ error: "You've sent a few messages already. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in.
  if (body.website) return Response.json({ ok: true });

  const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const message = str(body.message, 5000);
  if (!name) return Response.json({ error: "Please add your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "That email address doesn't look right." }, { status: 400 });
  if (message.length < 10) return Response.json({ error: "Tell me a little about the project (a sentence or two is fine)." }, { status: 400 });

  await db.insert(inquiries).values({
    name,
    email,
    company: str(body.company, 160),
    projectType: str(body.projectType, 80),
    budget: str(body.budget, 80),
    message,
  });
  hits.set(ip, [...recent, now]);
  return Response.json({ ok: true }, { status: 201 });
}
