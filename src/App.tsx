import { useCallback, useEffect, useState } from "react";
import { getSite, type SiteData } from "./lib/data";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import WorkArchive from "./components/WorkArchive";
import ClientIndex from "./components/ClientIndex";
import Dossier from "./components/Dossier";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectPage from "./components/ProjectPage";
import Studio from "./studio/StudioGate";

interface Route {
  name: "home" | "project" | "studio";
  slug?: string;
}

function parseRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/studio") return { name: "studio" };
  const match = path.match(/^\/work\/([^/]+)$/);
  if (match) return { name: "project", slug: decodeURIComponent(match[1]) };
  return { name: "home" };
}

export function navigate(to: string) {
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [site, setSite] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onPop = () => {
      setRoute(parseRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const refresh = useCallback(() => {
    getSite()
      .then(setSite)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(refresh, [refresh]);

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
  }, [route, site]);

  if (route.name === "studio") {
    return <Studio onClose={() => navigate("/")} />;
  }

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

  const scrollToContact = () => {
    if (route.name !== "home") {
      navigate("/#contact");
      setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 60);
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (route.name === "project") {
    const project = projects.find((p) => p.slug === route.slug);
    if (project) {
      return (
        <>
          <Nav
            initials={initials}
            name={profile?.name ?? ""}
            status={profile?.availability ?? "open"}
            onHome={() => navigate("/")}
            onContact={scrollToContact}
            showSections={false}
          />
          <main>
            <ProjectPage
              project={project}
              onBack={() => navigate("/#work")}
              onContact={scrollToContact}
            />
          </main>
          <Footer profile={profile} />
        </>
      );
    }
  }

  return (
    <>
      <Nav
        initials={initials}
        name={profile?.name ?? ""}
        status={profile?.availability ?? "open"}
        onHome={() => navigate("/")}
        onContact={scrollToContact}
      />
      <main id="top">
        {profile && (
          <Hero
            profile={profile}
            onStartProject={scrollToContact}
            onViewWork={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          />
        )}
        <WorkArchive
          projects={projects}
          onOpen={(p) => navigate(`/work/${encodeURIComponent(p.slug)}`)}
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
      <Footer profile={profile} />
    </>
  );
}
