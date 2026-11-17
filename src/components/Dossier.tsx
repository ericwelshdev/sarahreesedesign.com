import type { Accolade, Profile, Testimonial } from "../types";

const KIND_LABEL: Record<Accolade["kind"], string> = {
  award: "Awards",
  speaking: "Speaking",
  press: "Press",
};

export default function Dossier({
  accolades,
  testimonials,
  profile,
}: {
  accolades: Accolade[];
  testimonials: Testimonial[];
  profile: Profile | null;
}) {
  const spotlight = testimonials.find((t) => t.spotlight) ?? testimonials[0];
  const rest = testimonials.filter((t) => t.id !== spotlight?.id);

  const grouped = (["award", "speaking", "press"] as const)
    .map((kind) => ({ kind, items: accolades.filter((a) => a.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      {profile?.bio && (
        <div style={{ marginBottom: 64 }} data-reveal>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Creative director dossier</p>
          <p className="lede" style={{ maxWidth: 720, whiteSpace: "pre-line", color: "var(--ink)" }}>
            {profile.bio}
          </p>
          {profile.short_version && (
            <blockquote
              className="serif"
              style={{
                fontSize: "1.3rem",
                lineHeight: 1.5,
                borderLeft: "3px solid var(--accent)",
                paddingLeft: 20,
                marginTop: 28,
              }}
            >
              {profile.short_version}
            </blockquote>
          )}
          {profile.principles?.length > 0 && (
            <div style={{ display: "grid", gap: 14, marginTop: 34 }}>
              {profile.principles.map((p, i) => (
                <div className="card" key={p.title} style={{ padding: "20px 24px", display: "flex", gap: 18 }}>
                  <span className="font-mono" style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>{p.title}</strong>
                    <p style={{ color: "var(--graphite)", fontSize: 14.5, marginTop: 4, lineHeight: 1.6 }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {profile.capabilities?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 26 }}>
              {profile.capabilities.map((cap) => (
                <span className="chip" key={cap} style={{ cursor: "default" }}>
                  {cap}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {grouped.length > 0 && (
        <div style={{ marginBottom: 64 }} data-reveal>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Press & recognition</p>
          {grouped.map((group) => (
            <div key={group.kind} style={{ marginBottom: 26 }}>
              <p className="font-mono" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, margin: "14px 0 6px" }}>
                {KIND_LABEL[group.kind]}
              </p>
              {group.items.map((a) => (
                <div className="press-row" key={a.id}>
                  <span className="press-year">{a.year}</span>
                  <span>
                    <span className="press-title">{a.title}</span>
                    {a.note && <span className="press-org"> — {a.note}</span>}
                  </span>
                  <span className="press-org">{a.organization}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {spotlight && (
        <div data-reveal>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Kind words</p>
          <div className="spotlight-band">
            <p
              className="font-display"
              style={{ fontSize: "clamp(1.35rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}
            >
              “{spotlight.quote}”
            </p>
            <p style={{ marginTop: 18, fontWeight: 600 }}>
              {spotlight.author}
              <span style={{ opacity: 0.7, fontWeight: 500 }}>
                {spotlight.role ? ` · ${spotlight.role}` : ""}
                {spotlight.company ? ` · ${spotlight.company}` : ""}
              </span>
            </p>
          </div>
          {rest.length > 0 && (
            <div className="snap-row" style={{ marginTop: 20 }}>
              {rest.map((t) => (
                <figure className="quote-card" key={t.id}>
                  <blockquote style={{ lineHeight: 1.55, fontSize: "0.98rem" }}>“{t.quote}”</blockquote>
                  <figcaption style={{ marginTop: 14, fontSize: 13.5, color: "var(--graphite)" }}>
                    <strong style={{ color: "var(--ink)" }}>{t.author}</strong>
                    {t.role ? ` · ${t.role}` : ""}
                    {t.company ? ` · ${t.company}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
