import { useState } from "react";
import type { Category, Project } from "../types";
import { CATEGORY_LABEL } from "../types";
import ProjectVisual from "./ProjectVisual";

interface Props {
  projects: Project[];
  onOpen: (p: Project) => void;
}

const FILTERS: Array<Category | "all"> = ["all", "brand", "campaign", "web"];

export default function WorkArchive({ projects, onOpen }: Props) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const shown = projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <p className="eyebrow" data-reveal>01 — Selected work</p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-end", justifyContent: "space-between", margin: "10px 0 30px" }}
          data-reveal
        >
          <h2 className="h2" style={{ maxWidth: "16ch" }}>
            Work, and the thinking <span className="serif" style={{ color: "var(--accent)" }}>behind it.</span>
          </h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`chip${filter === f ? " on" : ""}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f === "all" ? "All" : CATEGORY_LABEL[f]}
              </button>
            ))}
          </div>
        </div>
        <div className="work-grid">
          {shown.map((p, i) => (
            <div key={p.id} className="work-card" data-reveal>
              <button className="work-cover" style={{ width: "100%" }} onClick={() => onOpen(p)}>
                <span className="work-tag">{CATEGORY_LABEL[p.category]}</span>
                <span className="work-num">{i + 1}</span>
                <ProjectVisual project={p} compact />
              </button>
              <div className="work-title">{p.title}</div>
              <div className="work-sub">
                {p.client} · {p.year}
              </div>
            </div>
          ))}
        </div>
        {shown.length === 0 && (
          <p className="lede" style={{ paddingBlock: 40 }}>
            Nothing in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
