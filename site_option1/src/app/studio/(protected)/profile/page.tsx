import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      singleton
      resource="profile"
      title="Profile & site copy"
      intro="Your hero statement, showreel, availability, bio and leadership principles. Change availability here whenever your calendar changes, and the pill on the homepage updates instantly."
    />
  );
}
