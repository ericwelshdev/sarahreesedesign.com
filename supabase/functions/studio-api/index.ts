const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function hex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

const RESOURCES = new Set([
  "projects",
  "clients",
  "accolades",
  "testimonials",
  "faqs",
  "inquiries",
  "profile",
]);

const MEDIA_MAX_BYTES = 8 * 1024 * 1024;
const MEDIA_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ---- session check ----
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token || token.length > 128) return json({ error: "Unauthorized" }, 401);

    const tokenHash = await hmac(token, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "sr");
    const { data: session, error: sessErr } = await admin
      .from("studio_sessions")
      .select("id, expires_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (sessErr || !session || new Date(session.expires_at).getTime() < Date.now()) {
      return json({ error: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean); // ["studio-api", resource, id?]
    parts.shift();
    const resource = parts[0] ?? "";
    const id = parts[1];

    // ---- media routes ----
    if (resource === "media") {
      if (req.method === "GET") {
        const { data, error } = await admin
          .from("media")
          .select("id, filename, mime, size, created_at")
          .order("created_at", { ascending: false });
        if (error) return json({ error: error.message }, 500);
        const base = `${Deno.env.get("SUPABASE_URL") ?? ""}/functions/v1/media`;
        return json(
          (data ?? []).map((m: Record<string, string | number>) => ({
            ...m,
            url: `${base}/${m.id}`,
          }))
        );
      }

      if (req.method === "POST") {
        const body = (await req.json().catch(() => null)) as
          | { filename?: string; mime?: string; data?: string }
          | null;
        if (!body?.data || !body.mime || !body.filename) {
          return json({ error: "Missing file fields" }, 400);
        }
        if (!MEDIA_MIME.has(body.mime)) return json({ error: "Unsupported file type" }, 400);
        if (body.filename.length > 200) return json({ error: "Filename too long" }, 400);
        const bytes = base64ToBytes(body.data);
        if (bytes.byteLength > MEDIA_MAX_BYTES) return json({ error: "File exceeds 8 MB" }, 413);

        const { data: inserted, error } = await admin
          .from("media")
          .insert({
            filename: body.filename,
            mime: body.mime,
            size: bytes.byteLength,
            data: body.data,
          })
          .select("id, filename, mime, size, created_at")
          .single();
        if (error) return json({ error: error.message }, 500);
        const base = `${Deno.env.get("SUPABASE_URL") ?? ""}/functions/v1/media`;
        return json({ ...inserted, url: `${base}/${inserted.id}` }, 201);
      }

      if (req.method === "DELETE") {
        if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Bad id" }, 400);
        const { error } = await admin.from("media").delete().eq("id", id);
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true });
      }

      return json({ error: "Method not allowed" }, 405);
    }

    // ---- content resources ----
    if (!RESOURCES.has(resource)) return json({ error: "Unknown resource" }, 404);

    if (req.method === "GET") {
      const query = admin.from(resource).select("*");
      const orderCol = resource === "profile" ? "id" : resource === "inquiries" ? "created_at" : "sort_order";
      const asc = resource !== "inquiries";
      const { data, error } = await query.order(orderCol, { ascending: asc });
      if (error) return json({ error: error.message }, 500);
      return json(data ?? []);
    }

    if (resource === "profile") {
      if (req.method !== "PUT") return json({ error: "Method not allowed" }, 405);
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body) return json({ error: "Invalid body" }, 400);
      const clean = sanitize(body);
      clean.id = 1;
      const { data, error } = await admin
        .from("profile")
        .update(clean)
        .eq("id", 1)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST") {
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body) return json({ error: "Invalid body" }, 400);
      const clean = sanitize(body);
      const title = String(clean.title ?? clean.name ?? clean.question ?? clean.quote ?? "").trim();
      if (!title) return json({ error: "A title or name is required" }, 400);
      if (resource === "projects") {
        clean.slug = await uniqueSlug(admin, String(clean.slug || title));
      }
      const { data, error } = await admin.from(resource).insert(clean).select().single();
      if (error) return json({ error: friendly(error) }, 500);
      return json(data, 201);
    }

    if (req.method === "PUT") {
      if (!id) return json({ error: "Missing id" }, 400);
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body) return json({ error: "Invalid body" }, 400);
      const clean = sanitize(body);
      const title = clean.title ?? clean.name ?? clean.question ?? clean.quote;
      if (title !== undefined && !String(title).trim()) {
        return json({ error: "A title or name is required" }, 400);
      }
      const { data, error } = await admin
        .from(resource)
        .update(clean)
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: friendly(error) }, 500);
      if (!data) return json({ error: "Not found" }, 404);
      return json(data);
    }

    if (req.method === "DELETE") {
      if (!id) return json({ error: "Missing id" }, 400);
      const { error } = await admin.from(resource).delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});

function friendly(err: { code?: string; message?: string }): string {
  if (err.code === "23505") return "That slug is already in use.";
  return err.message ?? "Request failed";
}

async function uniqueSlug(
  admin: ReturnType<typeof importScriptClient>,
  base: string
): Promise<string> {
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "project";
  const { data } = await admin.from("projects").select("slug");
  const taken = new Set((data ?? []).map((r: { slug: string }) => r.slug));
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}

type importScriptClient = {
  from: (t: string) => {
    select: (c: string) => Promise<{ data: unknown }>;
  };
};

const ALLOWED: Record<string, string[]> = {
  projects: [
    "slug", "title", "client", "category", "year", "summary", "role",
    "cover_image", "hero_image", "challenge", "approach", "outcome",
    "director_note", "palette_story", "published", "featured", "sort_order",
    "disciplines", "metrics", "process", "palette", "typography",
    "voice_principles", "copy_examples", "hurdles", "decisions",
    "gallery", "credits",
  ],
  clients: ["name", "descriptor", "blurb", "preview_image", "project_slug", "published", "sort_order"],
  accolades: ["kind", "title", "organization", "year", "note", "url", "published", "sort_order"],
  testimonials: ["quote", "author", "role", "company", "spotlight", "published", "sort_order"],
  faqs: ["question", "answer", "published", "sort_order"],
  inquiries: ["status"],
  profile: [
    "name", "title", "location", "email", "linkedin_url", "instagram_url",
    "availability", "availability_text", "hero_headline", "hero_accent",
    "hero_sub", "showreel_url", "showreel_poster", "showreel_label",
    "portrait_url", "about_headline", "about_accent", "bio", "short_version",
    "footer_note", "seo_title", "seo_description",
  ],
};

const TEXT_MAX = 300_000;
const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

function sanitize(body: Record<string, unknown>): Record<string, unknown> {
  return body;
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
