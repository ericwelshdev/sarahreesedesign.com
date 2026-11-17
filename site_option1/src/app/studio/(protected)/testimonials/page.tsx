import ResourcePage from "@/components/studio/ResourcePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ResourcePage
      resource="testimonials"
      title="Kind words"
      intro="Quotes from clients and collaborators. Mark one as the spotlight to feature it large; the rest appear in a swipeable carousel."
    />
  );
}
