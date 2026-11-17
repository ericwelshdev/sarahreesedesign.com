"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DemoNote } from "@/lib/types";
import Segmented from "./ui/Segmented";

export interface SandboxDemo {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  accent: string;
  liveUrl: string;
  projectSlug: string;
  breakdown: DemoNote[];
  projectTitle?: string;
}

const MODES = [
  { value: "mobile", label: "Mobile · 390" },
  { value: "desktop", label: "Desktop" },
];

// Nominal device sizes (screen is 390x844 on mobile, 1280x780 on desktop).
const SIZES = {
  mobile: { w: 414, h: 868 },
  desktop: { w: 1280, h: 826 },
};

export default function DeviceSandbox({ demos }: { demos: SandboxDemo[] }) {
  const [slug, setSlug] = useState(demos[0]?.slug ?? "");
  const [mode, setMode] = useState<"mobile" | "desktop">("mobile");
  const [showNotes, setShowNotes] = useState(false);
  const [stageW, setStageW] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const demo = demos.find((d) => d.slug === slug) ?? demos[0];
  if (!demo) return null;

  const size = SIZES[mode];
  const maxH = mode === "mobile" ? 700 : 9999;
  const scale = stageW ? Math.min(1, stageW / size.w, maxH / size.h) : 0.5;
  const src = demo.liveUrl || `/demo/${demo.slug}`;
  const launch = demo.liveUrl || `/demo/${demo.slug}`;
  const host = demo.liveUrl ? demo.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : `${demo.slug}.studio.preview`;

  return (
    <section id="live" className="section wrap">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="eyebrow">Live sites</p>
          <h2 className="h2 mt-3 max-w-[14ch]">
            Inspect the work <em className="serif" style={{ color: "var(--accent)" }}>in the wild.</em>
          </h2>
        </div>
        <p className="lede max-w-[38ch]">Real, interactive pages she directed. Switch devices, tap around, then read why every decision was made.</p>
      </div>

      <div className="snap-x bleed mt-10" data-reveal role="group" aria-label="Choose a live site">
        {demos.map((d) => (
          <button key={d.slug} type="button" className="demo-card" aria-pressed={d.slug === demo.slug} onClick={() => { setSlug(d.slug); setShowNotes(false); }}>
            <span className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: d.accent, display: "inline-block" }} />
              {d.kicker}
            </span>
            <span className="h3 mt-2 block">{d.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4" data-reveal>
        <Segmented label="Device" value={mode} onChange={(v) => setMode(v as "mobile" | "desktop")} options={MODES} />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-ghost" aria-expanded={showNotes} onClick={() => setShowNotes((s) => !s)}>
            Case Study Breakdown
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ transform: showNotes ? "rotate(180deg)" : "none", transition: "transform .6s var(--spring)" }}>
              <path d="M2 4.5l4 4 4-4" />
            </svg>
          </button>
          <a href={launch} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Launch Live Site ↗
          </a>
        </div>
      </div>

      <div className="collapse mt-4" data-open={showNotes}>
        <div>
          <div className="card grid gap-6 p-6 md:grid-cols-[1fr_1.4fr] md:p-8" aria-hidden={!showNotes}>
            <div>
              <p className="eyebrow">{demo.kicker}</p>
              <h3 className="h3 mt-2">{demo.name}</h3>
              <p className="body-copy mt-3">{demo.description}</p>
              {demo.projectSlug && (
                <Link href={`/work/${demo.projectSlug}`} className="btn btn-ghost mt-5" tabIndex={showNotes ? 0 : -1}>
                  Read the full case study →
                </Link>
              )}
            </div>
            <dl className="grid gap-0">
              {demo.breakdown.map((n) => (
                <div key={n.label} className="grid gap-1 border-t py-4 sm:grid-cols-[110px_1fr]" style={{ borderColor: "var(--hair-strong)" }}>
                  <dt className="eyebrow pt-1">{n.label}</dt>
                  <dd className="body-copy">{n.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="sandbox-stage mt-4" data-reveal ref={stageRef} style={{ padding: 0 }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "clamp(16px, 4vw, 48px) 0" }}>
          <div className="device-slot" style={{ width: size.w * scale, height: size.h * scale }}>
            <div className="device" data-mode={mode} style={{ width: size.w, height: size.h, transform: `scale(${scale})` }}>
              <div className="device-bar" aria-hidden>
                <i /><i /><i />
                <div className="device-url">{host}</div>
              </div>
              <div className="device-screen">
                <span className="device-island" aria-hidden />
                <span className="device-home" aria-hidden />
                <iframe
                  key={`${demo.slug}`}
                  src={src}
                  title={`${demo.name} live preview`}
                  loading="lazy"
                  sandbox={demo.liveUrl ? "allow-scripts allow-same-origin allow-forms allow-popups" : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs" style={{ color: "var(--faint)" }}>
        {mode === "mobile" ? "iPhone view, 390px wide. Scroll and tap inside the screen." : "Desktop view, rendered at 1280px and scaled to fit."}
      </p>
    </section>
  );
}
