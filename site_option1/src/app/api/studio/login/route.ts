import { cookies } from "next/headers";
import { checkPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const attempts = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.t < 10 * 60_000 && rec.n >= 8) {
    return Response.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    /* fallthrough */
  }

  if (!checkPassword(password)) {
    attempts.set(ip, { n: rec && now - rec.t < 10 * 60_000 ? rec.n + 1 : 1, t: rec && now - rec.t < 10 * 60_000 ? rec.t : now });
    await new Promise((r) => setTimeout(r, 400));
    return Response.json({ error: "That password isn't right." }, { status: 401 });
  }

  attempts.delete(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
