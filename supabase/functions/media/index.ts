const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean); // ["media", id]
    const id = parts[1] ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await admin
      .from("media")
      .select("mime, data")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const bytes = Uint8Array.from(atob(data.data as string), (c) => c.charCodeAt(0));
    return new Response(bytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": String(data.mime),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Unexpected error", { status: 500, headers: corsHeaders });
  }
});
