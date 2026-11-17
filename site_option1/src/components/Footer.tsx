import Link from "next/link";
import type { Profile } from "@/db/schema";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t" style={{ borderColor: "var(--hair-strong)", paddingBottom: "calc(120px + env(safe-area-inset-bottom))" }}>
      <div className="wrap flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} {profile.name}. {profile.footerNote}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link href="/#work" className="inline-flex min-h-11 items-center">Work</Link>
          <Link href="/#about" className="inline-flex min-h-11 items-center">Dossier</Link>
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">LinkedIn</a>
          )}
          {profile.instagramUrl && (
            <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">Instagram</a>
          )}
          <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center font-medium">{profile.email}</a>
          <Link href="/studio" className="inline-flex min-h-11 items-center" style={{ color: "var(--faint)" }} rel="nofollow">
            Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
