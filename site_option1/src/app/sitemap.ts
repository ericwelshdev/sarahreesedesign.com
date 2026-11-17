import type { MetadataRoute } from "next";
import { getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { projects } = await getSite();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
