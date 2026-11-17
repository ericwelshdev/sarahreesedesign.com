import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      resource="demos"
      title="Live sites (device sandbox)"
      intro="Interactive sites shown in the iPhone / desktop frame. Paste self-contained HTML or point to an external URL, then write the breakdown that explains the thinking."
    />
  );
}
