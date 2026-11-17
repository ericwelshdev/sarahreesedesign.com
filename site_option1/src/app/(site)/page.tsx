import Hero from "@/components/Hero";
import ShowreelStage from "@/components/ShowreelStage";
import WorkArchive from "@/components/WorkArchive";
import DeviceSandbox from "@/components/DeviceSandbox";
import ClientIndex from "@/components/ClientIndex";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { Bio, Press, Testimonials } from "@/components/Dossier";
import { getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await getSite();
  const { profile } = site;
  const titles = Object.fromEntries(site.projects.map((p) => [p.slug, p.title]));
  const covers = Object.fromEntries(site.projects.map((p) => [p.slug, p.coverImage]));

  return (
    <>
      <Hero profile={profile} />
      <ShowreelStage src={profile.showreelUrl} poster={profile.showreelPoster} label={profile.showreelLabel} />

      <WorkArchive projects={site.projects} />

      {site.demos.length > 0 && (
        <DeviceSandbox
          demos={site.demos.map((d) => ({
            slug: d.slug,
            name: d.name,
            kicker: d.kicker,
            description: d.description,
            accent: d.accent,
            liveUrl: d.liveUrl,
            projectSlug: d.projectSlug,
            breakdown: d.breakdown,
            projectTitle: titles[d.projectSlug],
          }))}
        />
      )}

      <section id="about" className="section wrap">
        <Bio profile={profile} />
        <div className="mt-24 md:mt-36">
          <ClientIndex clients={site.clients} fallbackImages={covers} />
        </div>
        <div className="mt-24 md:mt-36">
          <Press accolades={site.accolades} />
        </div>
        <div className="mt-24 md:mt-36">
          <Testimonials testimonials={site.testimonials} />
        </div>
        <div className="mt-24 md:mt-36">
          <Faq faqs={site.faqs} />
        </div>
      </section>

      <Contact profile={profile} />
    </>
  );
}
