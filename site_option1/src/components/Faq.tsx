"use client";

import { useState } from "react";
import type { Faq as FaqRow } from "@/db/schema";

export default function Faq({ faqs }: { faqs: FaqRow[] }) {
  const [open, setOpen] = useState<number | null>(faqs[0]?.id ?? null);
  if (faqs.length === 0) return null;
  return (
    <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
      <div data-reveal>
        <p className="eyebrow">A few answers</p>
        <h3 className="h2 mt-3">
          Curious minds <em className="serif" style={{ color: "var(--accent)" }}>ask questions.</em>
        </h3>
      </div>
      <div data-reveal style={{ borderBottom: "1px solid var(--hair-strong)" }}>
        {faqs.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} data-open={isOpen} style={{ borderTop: "1px solid var(--hair-strong)" }}>
              <button type="button" className="acc-btn" aria-expanded={isOpen} aria-controls={`faq-${f.id}`} onClick={() => setOpen(isOpen ? null : f.id)}>
                <span>{f.question}</span>
                <span className="acc-plus" aria-hidden />
              </button>
              <div id={`faq-${f.id}`} className="collapse" data-open={isOpen} role="region">
                <div>
                  <p className="body-copy pb-6 pr-10">{f.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
