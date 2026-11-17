import { useEffect, useRef, useState } from "react";
import type { Project } from "../types";
import { CATEGORY_LABEL } from "../types";

interface Props {
  project: Project | null;
  onClose: () => void;
  onEdit: (p: Project) => void;
}

export default function CaseStudySheet({ project, onClose, onEdit }: Props) {
  const [closing, setClosing] = useState(false);
  const dragRef = useRef<{ startY: number; y: number } | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 380);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!project) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current.y = e.clientY;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${dy}px)`;
      sheetRef.current.style.animation = "none";
    }
  };

  const onPointerUp = () => {
    if (!dragRef.current || !sheetRef.current) return;
    const dy = dragRef.current.y - dragRef.current.startY;
    sheetRef.current.style.transform = "";
    sheetRef.current.style.animation = "";
    dragRef.current = null;
    if (dy > 140) close();
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={close} />
      <div
        className={`sheet${closing ? " closing" : ""}`}
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <div
          className="sheet-head"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
        <div className="sheet-body">
          <div className="wrap-narrow">
            <p className="eyebrow">
              {CATEGORY_LABEL[project.category]} / {project.client} · {project.year}
            </p>
            <h2 className="h2" style={{ margin: "12px 0 14px" }}>
              {project.title}
            </h2>
            <p className="lede">{project.summary}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "22px 0" }}>
              <button className="btn btn-ghost" onClick={() => onEdit(project)}>
                Edit in Studio
              </button>
            </div>
            {project.hero_image && (
              <img
                src={project.hero_image}
                alt={project.title}
                style={{ width: "100%", borderRadius: 22, border: "1px solid var(--hair)" }}
              />
            )}

            {project.metrics.length > 0 && (
              <div className="stat-grid" style={{ margin: "34px 0" }}>
                {project.metrics.map((m) => (
                  <div className="stat-cell" key={m.label}>
                    <div className="stat-value">{m.value}</div>
                    <div className="stat-label">{m.label}</div>
                    {m.detail && (
                      <div style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 6 }}>{m.detail}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {project.challenge && (
              <Block title="The challenge" body={project.challenge} />
            )}
            {project.approach && <Block title="The approach" body={project.approach} />}
            {project.outcome && <Block title="The outcome" body={project.outcome} />}

            {project.director_note && (
              <blockquote
                className="serif"
                style={{
                  fontSize: "1.35rem",
                  lineHeight: 1.45,
                  borderLeft: "3px solid var(--accent)",
                  paddingLeft: 20,
                  margin: "36px 0",
                  color: "var(--ink)",
                }}
              >
                {project.director_note}
              </blockquote>
            )}

            {project.palette.length > 0 && (
              <div style={{ margin: "34px 0" }}>
                <p className="eyebrow" style={{ marginBottom: 14 }}>Color system</p>
                <div className="swatch-strip" style={{ marginBottom: 16 }}>
                  {project.palette.map((c) => (
                    <div key={c.hex + c.name} style={{ background: c.hex }} title={`${c.name} ${c.hex}`} />
                  ))}
                </div>
                {project.palette.map((c) => (
                  <div
                    key={c.role + c.hex}
                    style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid var(--hair)" }}
                  >
                    <span
                      style={{ width: 26, height: 26, borderRadius: 8, background: c.hex, border: "1px solid var(--hair)", flex: "none", alignSelf: "center" }}
                    />
                    <strong style={{ minWidth: 110 }}>{c.name}</strong>
                    <span className="font-mono" style={{ fontSize: 12, color: "var(--graphite)", minWidth: 80 }}>{c.hex}</span>
                    <span style={{ fontSize: 13.5, color: "var(--graphite)" }}>{c.rationale}</span>
                  </div>
                ))}
              </div>
            )}

            {project.process.length > 0 && (
              <div style={{ margin: "34px 0" }}>
                <p className="eyebrow" style={{ marginBottom: 14 }}>Process</p>
                {project.process.map((step, i) => (
                  <div key={step.title + i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--hair)" }}>
                    <span className="font-mono" style={{ color: "var(--accent)", fontWeight: 700 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{step.title}</strong>
                      {step.duration && (
                        <span className="font-mono" style={{ fontSize: 12, color: "var(--graphite)", marginLeft: 10 }}>
                          {step.duration}
                        </span>
                      )}
                      <p style={{ color: "var(--graphite)", fontSize: 14.5, marginTop: 4, lineHeight: 1.6 }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {project.credits.length > 0 && (
              <div style={{ margin: "34px 0" }}>
                <p className="eyebrow" style={{ marginBottom: 14 }}>Credits</p>
                {project.credits.map((c, i) => (
                  <div key={c.name + i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--hair)", fontSize: 14.5 }}>
                    <span>{c.name}</span>
                    <span style={{ color: "var(--graphite)" }}>{c.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ margin: "30px 0" }}>
      <p className="eyebrow" style={{ marginBottom: 10 }}>{title}</p>
      <p style={{ lineHeight: 1.65, fontSize: "1.02rem", color: "var(--ink)" }}>{body}</p>
    </div>
  );
}
