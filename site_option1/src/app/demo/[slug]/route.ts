import { getDemoBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = await getDemoBySlug(slug);
  if (!demo || !demo.html) return new Response("Not found", { status: 404 });
  return new Response(demo.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Demo HTML is editor-supplied: run it in an opaque origin so it can never touch the studio session.
      "Content-Security-Policy": "sandbox allow-scripts allow-popups allow-forms; frame-ancestors 'self'",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
