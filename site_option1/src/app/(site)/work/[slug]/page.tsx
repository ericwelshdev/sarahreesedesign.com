import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Swatches from "@/components/Swatches";
import { getProfile, getProjectBySlug, getProjectNav } from "@/lib/data";
import { CATEGORY_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title} · ${p.client}`,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, images: p.heroImage ? [p.heroImage] : undefined },
  };
}

function Block({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28" style={{ marginTop: "clamp(64px, 9vw, 112px)" }}>
      <div data-reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2 mt-3" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)" }}>{title}</h2>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) notFound();
  const [nav, profile] = await Promise.all([getProjectNav(slug), getProfile()]);

  const toc = [
    { id: "story", label: "The story", show: true },
    { id: "process", label: "Process", show: p.process.length > 0 },
    { id: "color", label: "Color story", show: p.palette.length > 0 },
    { id: "type", label: "Typography", show: p.typography.length > 0 },
    { id: "voice", label: "Messaging & voice", show: !!p.voiceNarrative || p.copyExamples.length > 0 },
    { id: "guardrails", label: "Guardrails", show: p.hurdles.length > 0 },
    { id: "decisions", label: "Key decisions", show: p.decisions.length > 0 },
    { id: "gallery", label: "Gallery", show: p.gallery.length > 0 },
  ].filter((t) => t.show);

  return (
    <article className="wrap" style={{ paddingTop: "clamp(40px, 8vw, 110px)" }}>
      <Link href="/#work" className="inline-flex min-h-11 items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
        ← All work
      </Link>

      <header className="mt-6" data-reveal>
        <p className="eyebrow">
          {CATEGORY_LABEL[p.category] ?? p.category} · {p.client} · {p.year}
        </p>
        <h1 className="display mt-4 max-w-[18ch]">{p.title}</h1>
        <p className="lede mt-6 max-w-[56ch]">{p.summary}</p>
      </header>

      {p.heroImage && (
        <div data-reveal className="mt-10 overflow-hidden md:mt-14" style={{ borderRadius: 32, border: "1px solid var(--hair)", background: "#e8e8ed" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.heroImage} alt={`${p.title} hero`} className="block max-h-[78vh] w-full object-cover" />
        </div>
      )}

      {p.metrics.length > 0 && (
        <div className="snap-x bleed mt-4" data-reveal>
          {p.metrics.map((m) => (
            <div key={m.label} className="card p-6" style={{ flex: "1 0 240px" }}>
              <div className="text-5xl font-semibold" style={{ letterSpacing: "-0.045em" }}>{m.value}</div>
              <div className="mt-3 text-sm font-medium">{m.label}</div>
              <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{m.detail}</div>
            </div>
          ))}
        </div>
      )}

      <div className="cs-grid mt-14 md:mt-20">
        <aside className="cs-aside" data-reveal>
          <dl className="grid gap-5 text-sm">
            <div><dt className="eyebrow">Role</dt><dd className="mt-1 font-medium">{p.role}</dd></div>
            <div><dt className="eyebrow">Client</dt><dd className="mt-1 font-medium">{p.client}</dd></div>
            <div>
              <dt className="eyebrow">Disciplines</dt>
              <dd className="mt-2 flex flex-wrap gap-2">{p.disciplines.map((d) => <span key={d} className="chip" style={{ background: "#fff", border: "1px solid var(--hair)" }}>{d}</span>)}</dd>
            </div>
            {p.credits.length > 0 && (
              <div>
                <dt className="eyebrow">Credits</dt>
                <dd className="mt-2 grid gap-1">
                  {p.credits.map((c) => (
                    <div key={c.name + c.role}><span className="font-medium">{c.name}</span> <span style={{ color: "var(--muted)" }}>· {c.role}</span></div>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <nav className="toc mt-8 hidden border-t pt-4 lg:block" style={{ borderColor: "var(--hair-strong)" }} aria-label="On this page">
            {toc.map((t) => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
          </nav>
          {(p.demoSlug || p.liveUrl) && (
            <div className="mt-6 grid gap-2">
              {p.demoSlug && <Link href="/#live" className="btn btn-ghost">Explore the live site</Link>}
              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Visit live site ↗</a>}
            </div>
          )}
        </aside>

        <div>
          <section id="story" className="scroll-mt-28" style={{ marginTop: 0 }}>
            <div className="grid gap-10">
              {[
                ["01 · The challenge", p.challenge],
                ["02 · The approach", p.approach],
                ["03 · The outcome", p.outcome],
              ]
                .filter(([, t]) => t)
                .map(([label, text]) => (
                  <div key={label} data-reveal>
                    <h2 className="h3">{label}</h2>
                    <p className="body-copy mt-3 max-w-[62ch]" style={{ fontSize: "1.15rem" }}>{text}</p>
                  </div>
                ))}
            </div>
            {p.directorNote && (
              <figure data-reveal className="mt-12 rounded-[28px] p-8 md:p-10" style={{ background: "#fff", border: "1px solid var(--hair)" }}>
                <figcaption className="eyebrow" style={{ color: "var(--accent)" }}>Creative director&apos;s note</figcaption>
                <blockquote className="serif mt-4 text-2xl leading-snug md:text-4xl">“{p.directorNote}”</blockquote>
                <p className="mt-5 text-sm" style={{ color: "var(--muted)" }}>{profile.name}</p>
              </figure>
            )}
          </section>

          {p.process.length > 0 && (
            <Block id="process" eyebrow="How it got made" title="Process, step by step">
              <ol className="timeline">
                {p.process.map((s, i) => (
                  <li key={s.title + i} className="flex gap-5" data-reveal>
                    <span className="tl-num">{i + 1}</span>
                    <div className="pb-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="h3">{s.title}</h3>
                        {s.duration && <span className="chip">{s.duration}</span>}
                      </div>
                      <p className="body-copy mt-2 max-w-[60ch]">{s.description}</p>
                      {s.outputs.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {s.outputs.map((o) => <span key={o} className="chip" style={{ background: "#fff", border: "1px solid var(--hair)" }}>{o}</span>)}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {p.palette.length > 0 && (
            <Block id="color" eyebrow="Color" title="The color story">
              {p.paletteStory && <p className="body-copy mb-8 max-w-[62ch]" style={{ fontSize: "1.15rem" }}>{p.paletteStory}</p>}
              <Swatches colors={p.palette} />
              <p className="mt-3 text-xs" style={{ color: "var(--faint)" }}>Tap a swatch to copy its hex value.</p>
            </Block>
          )}

          {p.typography.length > 0 && (
            <Block id="type" eyebrow="Typography" title="Type with a point of view">
              <div className="grid gap-3">
                {p.typography.map((t, i) => (
                  <div key={t.role + i} className="card grid gap-4 p-6 md:grid-cols-[1.1fr_1fr] md:p-8" data-reveal>
                    <div>
                      <p className="eyebrow">{t.role}</p>
                      <p className={`spec-${t.classification} mt-3 text-4xl leading-tight md:text-5xl`}>{t.sample || "Aa"}</p>
                    </div>
                    <div>
                      <p className="font-medium">{t.family}</p>
                      <p className="body-copy mt-2" style={{ fontSize: "1rem" }}>{t.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {(p.voiceNarrative || p.copyExamples.length > 0) && (
            <Block id="voice" eyebrow="Messaging" title="Finding the words">
              {p.voiceNarrative && <p className="body-copy max-w-[62ch]" style={{ fontSize: "1.15rem" }}>{p.voiceNarrative}</p>}
              {p.voicePrinciples.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.voicePrinciples.map((v) => (
                    <span key={v} className="chip" style={{ minHeight: 36, fontSize: 14, background: "var(--ink)", color: "#fff" }}>{v}</span>
                  ))}
                </div>
              )}
              <div className="mt-8 grid gap-3">
                {p.copyExamples.map((c, i) => (
                  <div key={i} className="card overflow-hidden" data-reveal>
                    <div className="grid md:grid-cols-2">
                      <div className="p-6 md:p-8" style={{ background: "#fafafa" }}>
                        <p className="eyebrow">Before</p>
                        <p className="mt-3 text-lg leading-snug" style={{ color: "var(--faint)", textDecoration: "line-through", textDecorationColor: "rgba(0,0,0,.2)" }}>{c.before}</p>
                      </div>
                      <div className="p-6 md:p-8">
                        <p className="eyebrow" style={{ color: "var(--accent)" }}>After</p>
                        <p className="mt-3 text-xl font-medium leading-snug" style={{ letterSpacing: "-0.02em" }}>{c.after}</p>
                      </div>
                    </div>
                    {c.note && <p className="border-t px-6 py-4 text-sm md:px-8" style={{ borderColor: "var(--hair)", color: "var(--muted)" }}>{c.note}</p>}
                  </div>
                ))}
              </div>
            </Block>
          )}

          {p.hurdles.length > 0 && (
            <Block id="guardrails" eyebrow="Constraints & compliance" title="Navigating the room">
              <p className="lede max-w-[56ch]">Legal, privacy, accessibility and stakeholder constraints shaped the work. Here is how the idea survived them.</p>
              <div className="mt-8 grid gap-3">
                {p.hurdles.map((h, i) => (
                  <div key={h.title + i} className="card p-6 md:p-8" data-reveal>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="chip" style={{ background: "var(--ink)", color: "#fff" }}>{h.kind}</span>
                      <h3 className="h3">{h.title}</h3>
                    </div>
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="eyebrow">The constraint</p>
                        <p className="body-copy mt-2" style={{ fontSize: "1rem" }}>{h.constraint}</p>
                      </div>
                      <div>
                        <p className="eyebrow" style={{ color: "var(--accent)" }}>How it was resolved</p>
                        <p className="body-copy mt-2" style={{ fontSize: "1rem" }}>{h.resolution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {p.decisions.length > 0 && (
            <Block id="decisions" eyebrow="Craft" title="Key design decisions">
              <div style={{ borderBottom: "1px solid var(--hair-strong)" }}>
                {p.decisions.map((d, i) => (
                  <div key={d.decision + i} className="grid gap-2 border-t py-6 md:grid-cols-[130px_1fr_1.1fr] md:gap-8" style={{ borderColor: "var(--hair-strong)" }} data-reveal>
                    <p className="eyebrow pt-1">{d.area}</p>
                    <p className="font-medium" style={{ fontSize: "1.1rem", letterSpacing: "-0.015em" }}>{d.decision}</p>
                    <p className="body-copy" style={{ fontSize: "1rem" }}>{d.rationale}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {p.gallery.length > 0 && (
            <Block id="gallery" eyebrow="Gallery" title="The work">
              <div className="snap-x bleed">
                {p.gallery.map((g, i) => (
                  <figure key={g.src + i} style={{ width: "min(82vw, 520px)" }}>
                    <div className="overflow-hidden" style={{ borderRadius: 28, border: "1px solid var(--hair)", aspectRatio: "4/5", background: "#e8e8ed" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.src} alt={g.caption || p.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    {g.caption && <figcaption className="mt-3 text-sm" style={{ color: "var(--muted)" }}>{g.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </Block>
          )}
        </div>
      </div>

      <div className="mt-24 grid gap-3 md:mt-32 md:grid-cols-2">
        {nav.prev && (
          <Link href={`/work/${nav.prev.slug}`} className="pager-card">
            <p className="eyebrow">← Previous</p>
            <p className="h3 mt-2">{nav.prev.title}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{nav.prev.client}</p>
          </Link>
        )}
        {nav.next && (
          <Link href={`/work/${nav.next.slug}`} className="pager-card md:text-right">
            <p className="eyebrow">Next →</p>
            <p className="h3 mt-2">{nav.next.title}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{nav.next.client}</p>
          </Link>
        )}
      </div>

      <div className="dark-panel mt-16 md:mt-24" data-reveal style={{ marginBottom: 72 }}>
        <p className="eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>Similar challenge?</p>
        <h2 className="display mt-3" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
          Let&apos;s make something <em className="serif" style={{ color: "var(--accent)" }}>worth remembering.</em>
        </h2>
        <Link href="/#contact" className="btn btn-light mt-8">Start a conversation ↗</Link>
      </div>
    </article>
  );
}
