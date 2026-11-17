import Link from "next/link";
import type { Profile } from "@/db/schema";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section id="top" className="wrap" style={{ paddingTop: "clamp(48px, 9vw, 120px)", paddingBottom: "clamp(40px, 6vw, 72px)" }}>
      <div data-reveal className="flex flex-wrap items-center gap-3">
        <span className="avail">
          <span className="dot" data-s={profile.availability} />
          {profile.availabilityText || "Available for new projects"}
        </span>
      </div>

      <p data-reveal style={{ ["--d" as string]: "60ms" }} className="eyebrow mt-8 md:mt-12">
        {profile.name} · {profile.title} · {profile.location}
      </p>

      <h1 data-reveal style={{ ["--d" as string]: "120ms" }} className="display mt-5 max-w-[16ch] md:max-w-[18ch]">
        {profile.heroHeadline}{" "}
        {profile.heroAccent && <em className="serif" style={{ color: "var(--accent)" }}>{profile.heroAccent}</em>}
      </h1>

      <div data-reveal style={{ ["--d" as string]: "200ms" }} className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[1.2fr_1fr] md:items-end">
        <p className="lede max-w-[46ch]">{profile.heroSub}</p>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/#work" className="btn btn-primary">
            View selected work
          </Link>
          <Link href="/#contact" className="btn btn-ghost">
            Start a conversation
          </Link>
        </div>
      </div>

      {profile.stats.length > 0 && (
        <dl data-reveal className="mt-12 grid grid-cols-3 gap-4 border-t pt-6 md:mt-16" style={{ ["--d" as string]: "280ms", borderColor: "var(--hair-strong)" }}>
          {profile.stats.map((s) => (
            <div key={s.label}>
              <dt className="text-3xl font-semibold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.04em" }}>{s.value}</dt>
              <dd className="mt-1 text-xs md:text-sm" style={{ color: "var(--muted)" }}>{s.label}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
