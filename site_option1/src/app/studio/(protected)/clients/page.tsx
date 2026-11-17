import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      resource="clients"
      title="Client & brand index"
      intro="The typographic list on the homepage. Each name reveals a preview card on hover (or tap on mobile)."
    />
  );
}
