"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Client } from "@/db/schema";

/**
 * Typographic client index. On desktop, hovering a name raises a floating preview card that follows the cursor.
 * On touch devices, tapping a name expands an inline preview.
 */
export default function ClientIndex({ clients, fallbackImages }: { clients: Client[]; fallbackImages: Record<string, string> }) {
  const [active, setActive] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const imgFor = (c: Client) => c.previewImage || fallbackImages[c.projectSlug] || "";
  const current = clients.find((c) => c.id === active) ?? null;

  const move = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const w = 300;
    const x = Math.min(window.innerWidth - w - 24, e.clientX + 28);
    const y = Math.max(16, Math.min(window.innerHeight - 340, e.clientY - 150));
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  };

  return (
    <div>
      <div data-reveal className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h3 className="h2" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)" }}>Selected clients &amp; brands</h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          <span className="hidden [@media(hover:hover)]:inline">Hover a name to preview the work.</span>
          <span className="[@media(hover:hover)]:hidden">Tap a name to preview the work.</span>
        </p>
      </div>

      <ul className="cl-list" onMouseMove={move} onMouseLeave={() => setActive(null)} data-reveal>
        {clients.map((c) => {
          const open = tapped === c.id;
          const img = imgFor(c);
          return (
            <li key={c.id}>
              <button
                type="button"
                className="cl-row"
                aria-expanded={open}
                onMouseEnter={() => setActive(c.id)}
                onFocus={() => setActive(c.id)}
                onBlur={() => setActive(null)}
                onClick={() => setTapped(open ? null : c.id)}
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="cl-name">{c.name}</span>
                  <span className="hidden text-sm sm:block" style={{ color: "var(--faint)" }}>{c.descriptor}</span>
                </span>
              </button>
              <div className="cl-inline collapse" data-open={open}>
                <div>
                  <div className="card mb-4 grid gap-4 p-4 sm:grid-cols-[120px_1fr]" style={{ borderRadius: 22 }}>
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" loading="lazy" className="h-28 w-full rounded-2xl object-cover sm:h-[120px]" />
                    )}
                    <div>
                      <p className="text-xs" style={{ color: "var(--faint)" }}>{c.descriptor}</p>
                      <p className="mt-1 text-[15px] leading-relaxed">{c.blurb}</p>
                      {c.projectSlug && (
                        <Link href={`/work/${c.projectSlug}`} className="mt-2 inline-flex min-h-11 items-center text-sm font-medium" style={{ color: "var(--accent)" }}>
                          View case study →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div ref={cardRef} className="float-card" data-on={current !== null} aria-hidden style={{ left: -999, top: -999, transform: current ? "scale(1)" : undefined }}>
        {current && (
          <>
            {imgFor(current) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgFor(current)} alt="" className="h-44 w-full object-cover" />
            )}
            <div className="p-4">
              <p className="text-xs" style={{ color: "var(--faint)" }}>{current.descriptor}</p>
              <p className="mt-1 text-sm leading-relaxed">{current.blurb}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
