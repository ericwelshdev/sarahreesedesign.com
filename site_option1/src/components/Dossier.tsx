import type { Accolade, Profile, Testimonial } from "@/db/schema";

const KIND_LABEL: Record<string, string> = { award: "Award", speaking: "Speaking", press: "Press" };

export function Bio({ profile }: { profile: Profile }) {
  const paragraphs = profile.bio.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
      <div data-reveal className="md:sticky md:top-28 md:self-start">
        <p className="eyebrow">Creative director dossier</p>
        <h2 className="h2 mt-3">
          {profile.aboutHeadline}{" "}
          {profile.aboutAccent && <em className="serif" style={{ color: "var(--accent)" }}>{profile.aboutAccent}</em>}
        </h2>
        {profile.portraitUrl && (
          <div className="mt-8 overflow-hidden" style={{ borderRadius: 28, border: "1px solid var(--hair)", aspectRatio: "4/5", maxWidth: 380 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.portraitUrl} alt={`Portrait of ${profile.name}`} loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <div className="grid gap-5" data-reveal>
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "lede" : "body-copy"} style={i === 0 ? { color: "var(--ink)" } : undefined}>
              {p}
            </p>
          ))}
        </div>

        {profile.shortVersion && (
          <blockquote data-reveal className="serif mt-10 text-2xl leading-snug md:text-3xl">
            “{profile.shortVersion}”
          </blockquote>
        )}

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {profile.principles.map((p, i) => (
            <div key={p.title} data-reveal style={{ ["--d" as string]: `${i * 70}ms`, borderRadius: 24 }} className="card p-6">
              <span className="text-xs tabular-nums" style={{ color: "var(--faint)" }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h3 mt-3">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{p.body}</p>
            </div>
          ))}
        </div>

        {profile.capabilities.length > 0 && (
          <div data-reveal className="mt-10">
            <p className="eyebrow">Capabilities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.capabilities.map((c) => <span key={c} className="chip" style={{ minHeight: 34, fontSize: 13, background: "#fff", border: "1px solid var(--hair)" }}>{c}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Press({ accolades }: { accolades: Accolade[] }) {
  const groups = (["award", "speaking", "press"] as const)
    .map((k) => ({ kind: k, rows: accolades.filter((a) => a.kind === k) }))
    .filter((g) => g.rows.length > 0);
  return (
    <div>
      <div data-reveal className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h3 className="h2" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)" }}>Press, speaking &amp; recognition</h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{accolades.length} entries</p>
      </div>
      <div className="grid gap-12">
        {groups.map((g) => (
          <div key={g.kind} data-reveal>
            <p className="eyebrow mb-3">{KIND_LABEL[g.kind]}s</p>
            <div style={{ borderBottom: "1px solid var(--hair-strong)" }}>
              {g.rows.map((a) => {
                const inner = (
                  <>
                    <span className="text-sm tabular-nums" style={{ color: "var(--faint)" }}>{a.year}</span>
                    <span>
                      <span className="font-medium" style={{ letterSpacing: "-0.015em" }}>{a.title}</span>
                      {a.note && <span className="mt-0.5 block text-sm" style={{ color: "var(--faint)" }}>{a.note}</span>}
                    </span>
                    <span className="col-start-2 text-sm md:col-start-auto md:text-base" style={{ color: "var(--muted)" }}>{a.organization}</span>
                    <span className="hidden text-sm md:block" style={{ color: "var(--faint)" }}>{KIND_LABEL[a.kind]}</span>
                    <span className="hidden md:block" aria-hidden>{a.url ? "↗" : ""}</span>
                  </>
                );
                return a.url ? (
                  <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="press-row">{inner}</a>
                ) : (
                  <div key={a.id} className="press-row">{inner}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  const spot = testimonials.find((t) => t.spotlight) ?? testimonials[0];
  const rest = testimonials.filter((t) => t.id !== spot.id);
  return (
    <div>
      <p data-reveal className="eyebrow">Kind words</p>
      <figure data-reveal className="mt-4">
        <blockquote className="display" style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.6rem)", letterSpacing: "-0.035em", lineHeight: 1.08 }}>
          “{spot.quote}”
        </blockquote>
        <figcaption className="mt-6 text-sm">
          <span className="font-medium">{spot.author}</span>
          <span style={{ color: "var(--muted)" }}> · {[spot.role, spot.company].filter(Boolean).join(", ")}</span>
        </figcaption>
      </figure>
      {rest.length > 0 && (
        <div className="snap-x bleed mt-10 pb-2" data-reveal>
          {rest.map((t) => (
            <figure key={t.id} className="quote-card">
              <blockquote className="text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>“{t.quote}”</blockquote>
              <figcaption className="text-sm">
                <span className="font-medium">{t.author}</span>
                <br />
                <span style={{ color: "var(--muted)" }}>{[t.role, t.company].filter(Boolean).join(", ")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
