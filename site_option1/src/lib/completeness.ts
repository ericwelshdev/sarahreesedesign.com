type Loose = Record<string, unknown>;

const len = (v: unknown) => (Array.isArray(v) ? v.length : 0);
const has = (v: unknown) => typeof v === "string" && v.trim().length > 0;

/** Scores how fully a case study tells the story clients look for. */
export function projectCompleteness(p: Loose) {
  const checks: { label: string; ok: boolean }[] = [
    { label: "Summary", ok: has(p.summary) },
    { label: "Cover & hero images", ok: has(p.coverImage) && has(p.heroImage) },
    { label: "Challenge, approach and outcome", ok: has(p.challenge) && has(p.approach) && has(p.outcome) },
    { label: "Creative director's note", ok: has(p.directorNote) },
    { label: "Results & metrics (2+)", ok: len(p.metrics) >= 2 },
    { label: "Process phases (3+)", ok: len(p.process) >= 3 },
    { label: "Color palette (3+ colors with rationale)", ok: len(p.palette) >= 3 && has(p.paletteStory) },
    { label: "Typography roles", ok: len(p.typography) >= 1 },
    { label: "Messaging: voice + before/after copy", ok: has(p.voiceNarrative) && len(p.copyExamples) >= 1 },
    { label: "Legal / compliance guardrails", ok: len(p.hurdles) >= 1 },
    { label: "Key design decisions (2+)", ok: len(p.decisions) >= 2 },
    { label: "Gallery images", ok: len(p.gallery) >= 1 },
    { label: "Team credits", ok: len(p.credits) >= 1 },
  ];
  const done = checks.filter((c) => c.ok).length;
  return { percent: Math.round((done / checks.length) * 100), checks, missing: checks.filter((c) => !c.ok).map((c) => c.label) };
}
