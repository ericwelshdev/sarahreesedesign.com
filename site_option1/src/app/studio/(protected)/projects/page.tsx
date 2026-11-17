import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      resource="projects"
      title="Case studies"
      intro="Each case study tells the full story clients hire for: the challenge, step-by-step process, color rationale, messaging, and how the work navigated legal and compliance. The meter shows what's still missing."
    />
  );
}
