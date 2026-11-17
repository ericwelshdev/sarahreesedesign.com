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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const body = (await req.json().catch(() => ({}))) as { action?: string; password?: string };
    if (body.action !== "login") return json({ error: "Unknown action" }, 400);

    const password = typeof body.password === "string" ? body.password : "";
    if (password.length > 200) return json({ error: "Invalid credentials" }, 401);

    const expected = (Deno.env.get("STUDIO_PASSWORD") ?? "studio-default").trim();
    const given = await hmac(password.normalize("NFKC"), "sr-pw");
    const want = await hmac(expected.normalize("NFKC"), "sr-pw");
    if (!timingSafeEqual(given, want)) {
      await new Promise((r) => setTimeout(r, 400));
      return json({ error: "Incorrect password" }, 401);
    }

    // Issue a random bearer token; its SHA-256 hash is stored in studio_sessions
    // and every studio-api call is verified against that table.
    const raw = crypto.getRandomValues(new Uint8Array(32));
    const token = [...raw].map((b) => b.toString(16).padStart(2, "0")).join("");
    const tokenHash = await hmac(token, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "sr");

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await admin
      .from("studio_sessions")
      .insert({ token_hash: tokenHash, expires_at: expires });
    if (error) return json({ error: "Could not start session" }, 500);

    return json({ ok: true, token });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});
