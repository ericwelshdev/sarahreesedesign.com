"use client";

import { useState } from "react";
import type { PaletteColor } from "@/lib/types";

function readable(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return "#fff";
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#1d1d1f" : "#ffffff";
}

export default function Swatches({ colors }: { colors: PaletteColor[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div>
      <div className="swatch-strip" role="img" aria-label={`Palette proportions: ${colors.map((c) => c.name).join(", ")}`} style={{ height: 88, borderRadius: 24 }}>
        {colors.map((c) => (
          <div key={c.name + c.hex} style={{ background: c.hex }} title={c.name} />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {colors.map((c, i) => (
          <div key={c.name + c.hex} className="sw-card" data-reveal style={{ ["--d" as string]: `${(i % 2) * 70}ms` }}>
            <button type="button" className="sw-chip" style={{ background: c.hex, color: readable(c.hex) }} onClick={() => copy(c.hex)} aria-label={`Copy ${c.name} ${c.hex}`}>
              <span className="text-xs font-medium uppercase tracking-widest" style={{ opacity: 0.75 }}>{c.role}</span>
              <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <span className="text-xl font-semibold" style={{ letterSpacing: "-0.03em" }}>{c.name}</span>
                <span className="text-sm tabular-nums" style={{ opacity: 0.85 }}>{copied === c.hex ? "Copied" : c.hex.toUpperCase()}</span>
              </span>
            </button>
            <p className="p-5 text-[15px] leading-relaxed" style={{ color: "#424245" }}>{c.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
