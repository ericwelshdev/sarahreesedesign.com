import { supabase } from "./supabase";
import type { MediaItem } from "../types";

const STUDIO_KEY = "studio_session";
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export interface StudioSession {
  token: string;
  expiresAt: number;
}

export function saveSession(token: string): void {
  const session: StudioSession = { token, expiresAt: Date.now() + SESSION_TTL_MS };
  localStorage.setItem(STUDIO_KEY, JSON.stringify(session));
}

export function loadSession(): StudioSession | null {
  try {
    const raw = localStorage.getItem(STUDIO_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StudioSession;
    if (!session.token || typeof session.expiresAt !== "number") return null;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STUDIO_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STUDIO_KEY);
}

export function authHeader(): Record<string, string> {
  const session = loadSession();
  return session ? { Authorization: `Bearer ${session.token}` } : {};
}

export async function studioLogin(password: string): Promise<void> {
  const res = await supabase.functions.invoke("studio-auth", {
    body: { action: "login", password },
  });
  if (res.error) throw new Error(res.error.message);
  const data = res.data as { ok?: boolean; token?: string; error?: string };
  if (!data?.ok || !data.token) throw new Error(data?.error || "Login failed");
  saveSession(data.token);
}

function fnUrl(): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base.replace(/\/$/, "")}/functions/v1/studio-api`;
}

async function studioFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const res = await fetch(`${fnUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...init.headers,
    },
  });
  if (res.status === 401) {
    clearSession();
    throw new Error("Session expired — sign in again.");
  }
  return res;
}

async function readBody<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export interface ResourceRow {
  id: number | string;
  [key: string]: unknown;
}

export const studioApi = {
  list: (resource: string) =>
    studioFetch(`/${resource}`).then((r) => readBody<ResourceRow[]>(r)),

  create: (resource: string, body: unknown) =>
    studioFetch(`/${resource}`, { method: "POST", body: JSON.stringify(body) }).then((r) =>
      readBody<ResourceRow>(r)
    ),

  update: (resource: string, id: number | string, body: unknown) =>
    studioFetch(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(body) }).then((r) =>
      readBody<ResourceRow>(r)
    ),

  remove: (resource: string, id: number | string) =>
    studioFetch(`/${resource}/${id}`, { method: "DELETE" }).then(() => undefined),

  uploadMedia: async (file: File): Promise<MediaItem> => {
    const bytes = await file.arrayBuffer();
    let binary = "";
    const chunk = 0x8000;
    const view = new Uint8Array(bytes);
    for (let i = 0; i < view.length; i += chunk) {
      binary += String.fromCharCode(...view.subarray(i, i + chunk));
    }
    const body = { filename: file.name, mime: file.type, data: btoa(binary) };
    const res = await studioFetch(`/media`, { method: "POST", body: JSON.stringify(body) });
    return readBody<MediaItem>(res);
  },

  removeMedia: (id: string) => studioFetch(`/media/${id}`, { method: "DELETE" }).then(() => undefined),

  listMedia: () => studioFetch(`/media`).then((r) => readBody<MediaItem[]>(r)),
};
