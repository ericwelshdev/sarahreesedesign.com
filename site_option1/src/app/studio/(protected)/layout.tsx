import type { ReactNode } from "react";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { inquiries } from "@/db/schema";
import { requireStudio } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import StudioNav from "@/components/studio/StudioNav";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await requireStudio();
  await ensureSeeded();
  const [profile, [{ n }]] = await Promise.all([
    getProfile(),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "new")),
  ]);
  return (
    <>
      <StudioNav name={profile.name} newInquiries={n} />
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-10">{children}</main>
    </>
  );
}
