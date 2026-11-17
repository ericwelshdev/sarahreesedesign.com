import type { Profile } from "../types";

export default function Footer({ profile }: { profile: Profile | null }) {
  return (
    <footer className="dark-band" style={{ paddingBlock: "64px 40px" }}>
      <div className="wrap">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p className="font-display" style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {profile?.name ?? "Studio"}
            </p>
            <p style={{ opacity: 0.6, fontSize: 14, marginTop: 6 }}>{profile?.footer_note || profile?.title}</p>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 14 }}>
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} style={{ color: "inherit", opacity: 0.7 }} rel="noreferrer noopener">
                LinkedIn
              </a>
            )}
            {profile?.instagram_url && (
              <a href={profile.instagram_url} style={{ color: "inherit", opacity: 0.7 }} rel="noreferrer noopener">
                Instagram
              </a>
            )}
            <a href="/studio" style={{ color: "inherit", opacity: 0.45, fontSize: 14 }} rel="nofollow">
              Studio login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
