import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      resource="inquiries"
      title="Inbox"
      intro="Project inquiries from the contact form on the homepage. Mark them replied or archived to keep the inbox clear."
    />
  );
}
