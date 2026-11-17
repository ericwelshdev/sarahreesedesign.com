import type { Profile } from "../types";

interface Props {
  profile: Profile;
  onStartProject: () => void;
  onViewWork: () => void;
}

export default function Hero({ profile, onStartProject, onViewWork }: Props) {
  return (
    <section className="section" style={{ paddingTop: "clamp(120px, 18vw, 190px)" }}>
      <div className="wrap">
        <div style={{ marginBottom: 26 }} data-reveal>
          <span className="avail">
            <span className="dot" data-s={profile.availability} />
            {profile.availability_text || profile.availability}
          </span>
        </div>
        <p className="eyebrow" data-reveal style={{ "--d": "0.05s" } as React.CSSProperties}>
          {profile.name} · {profile.title} · {profile.location}
        </p>
        <h1 className="display" style={{ margin: "18px 0 22px", maxWidth: "14ch" }} data-reveal>
          {profile.hero_headline}{" "}
          <span className="serif" style={{ color: "var(--accent)" }}>
            {profile.hero_accent}
          </span>
        </h1>
        <p className="lede" style={{ maxWidth: 640 }} data-reveal>
          {profile.hero_sub}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "34px 0 64px" }} data-reveal>
          <button className="btn btn-primary" onClick={onViewWork}>
            View selected work
          </button>
          <button className="btn btn-ghost" onClick={onStartProject}>
            Start a conversation
          </button>
        </div>
        <div className="stat-grid" data-reveal>
          {profile.stats.map((stat) => (
            <div className="stat-cell" key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
