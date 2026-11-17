import { desc } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { requireStudio } from "@/lib/auth";
import MediaLibrary from "@/components/studio/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireStudio();
  const rows = await db
    .select({ id: media.id, filename: media.filename, size: media.size })
    .from(media)
    .orderBy(desc(media.createdAt));
  return (
    <>
      <div className="mb-8 max-w-[70ch]">
        <h1 className="text-3xl font-semibold md:text-4xl" style={{ letterSpacing: "-0.04em" }}>Media library</h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#6e6e73" }}>
          Upload project imagery, then paste the URL into any image field, or upload directly from the field itself.
        </p>
      </div>
      <MediaLibrary initial={rows.map((r) => ({ ...r, url: `/api/media/${r.id}` }))} />
    </>
  );
}
