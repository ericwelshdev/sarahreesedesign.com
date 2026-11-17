import React from "react";
import { getPortfolioPayload } from "@/lib/portfolio-data";
import PortfolioExperience from "@/components/PortfolioExperience";

export const dynamic = "force-dynamic";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialData = await getPortfolioPayload();

  return (
    <PortfolioExperience
      initialData={initialData}
      initialView="case-study"
      initialProjectSlug={slug}
    />
  );
}
