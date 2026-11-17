import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "studio_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function password() {
  return process.env.STUDIO_PASSWORD || "creative-director";
}
function secret() {
  return process.env.STUDIO_SECRET || `studio::${password()}::v1`;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function checkPassword(input: string) {
  const expected = createHmac("sha256", "pw").update(password()).digest("hex");
  const given = createHmac("sha256", "pw").update(input).digest("hex");
  return safeEqual(expected, given);
}

export function createSessionToken() {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  return Number(payload) > Date.now();
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
  maxAge: MAX_AGE,
};

export async function isStudioAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** For server components / pages in the studio. Redirects to login. */
export async function requireStudio() {
  if (!(await isStudioAuthed())) redirect("/studio/login");
}

/** For route handlers. Returns a 401 Response or null. */
export async function guardApi() {
  if (!(await isStudioAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
