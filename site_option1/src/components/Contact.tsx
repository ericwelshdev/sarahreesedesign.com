"use client";

import { useState } from "react";
import type { Profile } from "@/db/schema";

const TYPES = ["Brand identity", "Campaign", "Web & digital", "Creative leadership", "Something else"];
const BUDGETS = ["Under $25k", "$25k – $75k", "$75k – $150k", "$150k+", "Not sure yet"];

export default function Contact({ profile }: { profile: Profile }) {
  const [type, setType] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          budget: form.get("budget"),
          message: form.get("message"),
          website: form.get("website"),
          projectType: type,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <section id="contact" className="section wrap" style={{ paddingTop: 0 }}>
      <div className="dark-panel" data-reveal>
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          <div>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>Have a good one.</p>
            <h2 className="display mt-4" style={{ fontSize: "clamp(2.2rem, 5vw, 4.4rem)" }}>
              Let&apos;s make something <em className="serif" style={{ color: "var(--accent)" }}>worth remembering.</em>
            </h2>
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed" style={{ color: "rgba(255,255,255,.6)" }}>
              Tell me about the brand, the campaign or the product, and the constraints around it. I read every note personally.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,.7)" }}>
              <span className="dot" data-s={profile.availability} />
              {profile.availabilityText}
            </div>
            <a href={`mailto:${profile.email}`} className="mt-4 inline-flex min-h-11 items-center text-lg font-medium underline underline-offset-4" style={{ textDecorationColor: "rgba(255,255,255,.3)" }}>
              {profile.email}
            </a>
          </div>

          {state === "done" ? (
            <div className="flex flex-col items-start justify-center gap-4" role="status">
              <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: "var(--live)", color: "#06240f" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.8rem" }}>Message received.</h3>
              <p style={{ color: "rgba(255,255,255,.65)" }}>Thank you. I&apos;ll reply within two business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3" noValidate>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="field" name="name" placeholder="Your name" aria-label="Your name" autoComplete="name" required />
                <input className="field" name="email" type="email" placeholder="Email" aria-label="Email" autoComplete="email" required />
              </div>
              <input className="field" name="company" placeholder="Company (optional)" aria-label="Company" autoComplete="organization" />
              <div role="group" aria-label="Project type" className="flex flex-wrap gap-2 py-1">
                {TYPES.map((t) => (
                  <button key={t} type="button" className="choice" aria-pressed={type === t} onClick={() => setType(type === t ? "" : t)}>{t}</button>
                ))}
              </div>
              <select className="field" name="budget" aria-label="Budget" defaultValue="">
                <option value="" disabled>Budget range (optional)</option>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
              <textarea className="field" name="message" rows={5} placeholder="What are you making, and what makes it hard?" aria-label="Message" required />
              {error && <p role="alert" className="text-sm" style={{ color: "#ff8a7a" }}>{error}</p>}
              <button type="submit" className="btn btn-light mt-1 justify-self-start" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send message ↗"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
