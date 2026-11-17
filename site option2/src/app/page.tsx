import React from "react";
import { getPortfolioPayload } from "@/lib/portfolio-data";
import PortfolioExperience from "@/components/PortfolioExperience";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialData = await getPortfolioPayload();

  return <PortfolioExperience initialData={initialData} initialView="home" />;
}
