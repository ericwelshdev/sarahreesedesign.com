import { useState } from "react";
import type { Project } from "../types";
import { CATEGORY_LABEL } from "../types";

export default function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  const colors = project.palette.length > 0 ? project.palette.map((color) => color.hex) : ["#D4F82A", "#F26B4E", "#111110"];

  return (
    <div
      className={`project-visual${compact ? " project-visual-compact" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[Math.min(1, colors.length - 1)]} 48%, ${colors[Math.min(2, colors.length - 1)]} 100%)`,
      }}
    >
      {project.cover_image && !failed && (
        <img src={project.cover_image} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
      <div className="project-visual-shade" />
      <div className="project-visual-meta">
        <span className="font-mono">{project.client}</span>
        <strong>{project.title}</strong>
        <span>{CATEGORY_LABEL[project.category]} · {project.year}</span>
      </div>
      <div className="project-visual-mark" aria-hidden>
        {project.client.slice(0, 2).toUpperCase()}
      </div>
    </div>
  );
}
