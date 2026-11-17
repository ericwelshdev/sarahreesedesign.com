import type { Metadata } from "next";
import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealRoot from "@/components/RevealRoot";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  return {
    title: { default: p.seoTitle || `${p.name} | ${p.title}`, template: `%s | ${p.name}` },
    description: p.seoDescription,
    openGraph: {
      title: p.seoTitle || `${p.name} | ${p.title}`,
      description: p.seoDescription,
      images: p.showreelPoster ? [p.showreelPoster] : undefined,
      type: "website",
    },
  };
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const p = await getProfile();
  const initials = p.name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <>
      <Nav initials={initials || "CD"} status={p.availability} />
      <RevealRoot />
      <main>{children}</main>
      <Footer profile={p} />
    </>
  );
}
