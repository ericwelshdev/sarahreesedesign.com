"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { Project } from "@/db/schema";
import { CATEGORY_LABEL } from "@/lib/types";
import Segmented from "./ui/Segmented";
import Sheet from "./ui/Sheet";

const FILTERS = [
  { value: "all", label: "All Work" },
  { value: "web", label: "Web & Digital" },
  { value: "brand", label: "Brand Identity" },
  { value: "campaign", label: "Campaigns" },
];

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return <div className={className} style={{ background: "linear-gradient(135deg,#e8e8ed,#d2d2d7)", width: "100%", height: "100%" }} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}

export default function WorkArchive({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [lastSlug, setLastSlug] = useState<string | null>(null);

  const visible = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.category === filter)), [projects, filter]);
  const active = projects.find((p) => p.slug === (openSlug ?? lastSlug)) ?? null;
  const close = useCallback(() => setOpenSlug(null), []);
  const present = (slug: string) => {
    setLastSlug(slug);
    setOpenSlug(slug);
  };

  const counts = (value: string) => (value === "all" ? projects.length : projects.filter((p) => p.category === value).length);

  return (
    <section id="work" className="section wrap">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 className="h2 mt-3 max-w-[14ch]">
            Work, and the thinking <em className="serif" style={{ color: "var(--accent)" }}>behind it.</em>
          </h2>
        </div>
        <p className="lede max-w-[38ch]">Open any project for the full story: process, color decisions, messaging, and how the idea survived legal.</p>
      </div>

      <div className="mt-10 md:mt-14" data-reveal>
        <Segmented
          label="Filter work by discipline"
          value={filter}
          onChange={setFilter}
          options={FILTERS.filter((f) => counts(f.value) > 0 || f.value === "all")}
        />
      </div>

      <div className="work-grid mt-8 md:mt-12" aria-live="polite">
        {visible.map((p, i) => (
          <button
            key={`${filter}-${p.id}`}
            type="button"
            className={`work-card ${i % 3 === 0 ? "wide" : ""}`}
            style={{ ["--i" as string]: i }}
            onClick={() => present(p.slug)}
            aria-haspopup="dialog"
          >
            <div className="work-media">
              <Img src={p.coverImage} alt={`${p.title} cover`} />
              <span className="work-tag glass">{CATEGORY_LABEL[p.category] ?? p.category}</span>
              <span className="work-num glass">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 px-1">
              <div>
                <h3 className="h3">{p.title}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{p.client}</p>
              </div>
              <span className="mt-1 text-sm tabular-nums" style={{ color: "var(--faint)" }}>{p.year}</span>
            </div>
          </button>
        ))}
        {visible.length === 0 && <p className="lede">Nothing here yet.</p>}
      </div>

      <Sheet open={openSlug !== null} onClose={close} label={active ? `${active.title} project details` : "Project details"}>
        {active && <ProjectSheet project={active} onClose={close} />}
      </Sheet>
    </section>
  );
}

function ProjectSheet({ project: p, onClose }: { project: Project; onClose: () => void }) {
  return (
    <article>
      <p className="eyebrow">
        {CATEGORY_LABEL[p.category] ?? p.category} · {p.client} · {p.year}
      </p>
      <h3 className="display mt-3" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>{p.title}</h3>
      <p className="lede mt-4 max-w-[52ch]">{p.summary}</p>

      {p.heroImage && (
        <div className="mt-8 overflow-hidden" style={{ borderRadius: 24, border: "1px solid var(--hair)" }}>
          <Img src={p.heroImage} alt={`${p.title} hero`} className="block h-auto max-h-[460px] w-full object-cover" />
        </div>
      )}

      {p.metrics.length > 0 && (
        <div className="snap-x bleed mt-6">
          {p.metrics.map((m) => (
            <div key={m.label} className="card p-5" style={{ width: 220, borderRadius: 22 }}>
              <div className="text-4xl font-semibold" style={{ letterSpacing: "-0.04em" }}>{m.value}</div>
              <div className="mt-2 text-sm font-medium">{m.label}</div>
              <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{m.detail}</div>
            </div>
          ))}
        </div>
      )}

      <section className="sheet-sec">
        <h4 className="eyebrow">Creative direction</h4>
        <div className="card mt-3 grid gap-5 p-6 md:grid-cols-2" style={{ borderRadius: 24 }}>
          <div className="kv">
            <span className="text-xs" style={{ color: "var(--faint)" }}>Role</span>
            <span className="font-medium">{p.role}</span>
          </div>
          <div className="kv">
            <span className="text-xs" style={{ color: "var(--faint)" }}>Disciplines</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {p.disciplines.map((d) => <span key={d} className="chip">{d}</span>)}
            </div>
          </div>
        </div>
        {p.directorNote && (
          <blockquote className="serif mt-6 text-2xl leading-snug md:text-3xl" style={{ color: "var(--ink)" }}>
            “{p.directorNote}”
          </blockquote>
        )}
      </section>

      <section className="sheet-sec">
        <h4 className="eyebrow">Problem / Solution</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="card p-6" style={{ borderRadius: 24 }}>
            <p className="text-sm font-semibold">The problem</p>
            <p className="body-copy mt-2">{p.challenge}</p>
          </div>
          <div className="card p-6" style={{ borderRadius: 24 }}>
            <p className="text-sm font-semibold">The solution</p>
            <p className="body-copy mt-2">{p.approach}</p>
          </div>
        </div>
        {p.outcome && (
          <p className="body-copy mt-4 px-1"><strong style={{ color: "var(--ink)" }}>Outcome. </strong>{p.outcome}</p>
        )}
      </section>

      {p.palette.length > 0 && (
        <section className="sheet-sec">
          <h4 className="eyebrow">Color story</h4>
          <div className="swatch-strip mt-3" role="img" aria-label={`Palette: ${p.palette.map((c) => c.name).join(", ")}`}>
            {p.palette.map((c) => <div key={c.hex + c.name} style={{ background: c.hex }} title={`${c.name} ${c.hex}`} />)}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
            {p.palette.map((c) => <span key={c.hex + c.name}>{c.name} <span className="tabular-nums">{c.hex.toUpperCase()}</span></span>)}
          </div>
          {p.paletteStory && <p className="body-copy mt-4">{p.paletteStory}</p>}
        </section>
      )}

      {p.process.length > 0 && (
        <section className="sheet-sec">
          <h4 className="eyebrow">Process</h4>
          <ol className="mt-3 grid gap-2">
            {p.process.map((s, i) => (
              <li key={s.title + i} className="card flex items-center gap-4 px-5 py-4" style={{ borderRadius: 20 }}>
                <span className="text-sm tabular-nums" style={{ color: "var(--faint)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium">{s.title}</span>
                <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>{s.duration}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {p.credits.length > 0 && (
        <section className="sheet-sec">
          <h4 className="eyebrow">Team credits</h4>
          <ul className="mt-3">
            {p.credits.map((c) => (
              <li key={c.name + c.role} className="flex justify-between gap-4 border-t py-3 text-sm" style={{ borderColor: "var(--hair-strong)" }}>
                <span className="font-medium">{c.name}</span>
                <span style={{ color: "var(--muted)" }}>{c.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.gallery.length > 0 && (
        <section className="sheet-sec">
          <h4 className="eyebrow">Gallery</h4>
          <div className="snap-x bleed mt-3">
            {p.gallery.map((g, i) => (
              <figure key={g.src + i} style={{ width: "min(78vw, 420px)" }}>
                <div className="overflow-hidden" style={{ borderRadius: 22, border: "1px solid var(--hair)", aspectRatio: "4/5" }}>
                  <Img src={g.src} alt={g.caption || p.title} className="h-full w-full object-cover" />
                </div>
                {g.caption && <figcaption className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{g.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/work/${p.slug}`} className="btn btn-primary">Read the full case study →</Link>
        <Link href="/#contact" className="btn btn-ghost" onClick={onClose}>Start a similar project</Link>
      </div>
    </article>
  );
}
