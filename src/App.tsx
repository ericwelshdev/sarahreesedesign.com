import { useEffect, useState } from "react";
import { getSite, type SiteData } from "./lib/data";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import WorkArchive from "./components/WorkArchive";
import CaseStudySheet from "./components/CaseStudySheet";
import ClientIndex from "./components/ClientIndex";
import Dossier from "./components/Dossier";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Studio from "./studio/StudioGate";
import type { StudioTab } from "./studio/StudioTab";
import type { Project } from "./types";

export default function App() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTab, setStudioTab] = useState<StudioTab | undefined>(undefined);
  const [studioProject, setStudioProject] = useState<number | null>(null);

  const refresh = () => {
    getSite()
      .then(setSite)
      .catch((e: Error) => setError(e.message));
  };

  useEffect(refresh, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("in");
        }
      },
      { threshold: 0.12 }
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => observer.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, [site]);

  if (error) {
    return (
      <div className="wrap" style={{ paddingBlock: 120, textAlign: "center" }}>
        <h1 className="h2">The site couldn't load.</h1>
        <p className="lede" style={{ marginTop: 12 }}>{error}</p>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={refresh}>
          Try again
        </button>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="wrap" style={{ paddingBlock: 160, textAlign: "center", color: "var(--graphite)" }}>
        Loading…
      </div>
    );
  }

  const { profile, projects, clients, accolades, testimonials, faqs } = site;
  const initials = profile
    ? profile.name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("") || "SR"
    : "SR";

  const openStudio = (tab?: StudioTab, projectId?: number) => {
    setStudioTab(tab);
    setStudioProject(projectId ?? null);
    setStudioOpen(true);
  };

  return (
    <>
      <Nav
        initials={initials}
        status={profile?.availability ?? "open"}
        onStudio={() => openStudio()}
      />
      <main id="top">
        {profile && (
          <Hero
            profile={profile}
            onStartProject={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            onViewWork={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          />
        )}
        <WorkArchive
          projects={projects}
          onOpen={setSelected}
          onEdit={(p) => openStudio("projects", p.id)}
        />
        <section className="section" id="about">
          <div className="wrap-narrow">
            <p className="eyebrow" data-reveal>02 — In good company</p>
            <h2 className="h2" style={{ margin: "10px 0 34px" }} data-reveal>
              Brands I've <span className="serif" style={{ color: "var(--accent)" }}>built with.</span>
            </h2>
          </div>
          <div className="wrap">
            <ClientIndex clients={clients} />
          </div>
          <div className="wrap" style={{ marginTop: 72 }}>
            <Dossier accolades={accolades} testimonials={testimonials} profile={profile} />
          </div>
        </section>
        <Faq faqs={faqs} />
        <Contact profile={profile} onSaved={refresh} />
      </main>
      <Footer profile={profile} onStudio={() => openStudio()} />
      <CaseStudySheet
        project={selected}
        onClose={() => setSelected(null)}
        onEdit={(p) => {
          setSelected(null);
          openStudio("projects", p.id);
        }}
      />
      {studioOpen && (
        <Studio
          initialTab={studioTab}
          initialProjectId={studioProject}
          onClose={() => {
            setStudioOpen(false);
            setStudioTab(undefined);
            setStudioProject(null);
            refresh();
          }}
          profile={profile}
        />
      )}
    </>
  );
}
