import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      resource="faqs"
      title="Questions & answers"
      intro="Answer what prospective clients ask before they write to you: how you work, timelines, tools, regulated industries."
    />
  );
}
