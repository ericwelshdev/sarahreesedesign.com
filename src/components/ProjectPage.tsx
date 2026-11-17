import type { Project } from "../types";
import { CATEGORY_LABEL } from "../types";
import ProjectVisual from "./ProjectVisual";

interface Props {
  project: Project;
  onBack: () => void;
  onContact: () => void;
}

export default function ProjectPage({ project, onBack, onContact }: Props) {
  return (
    <article className="project-page">
      <div className="wrap">
        <button className="project-back" onClick={onBack}>← All work</button>
        <div className="project-hero-grid">
          <div className="project-hero-copy" data-reveal>
            <p className="eyebrow">{CATEGORY_LABEL[project.category]} / {project.client} · {project.year}</p>
            <h1 className="display">{project.title}</h1>
            <p className="project-summary">{project.summary}</p>
            <div className="project-tags">
              {project.disciplines.map((discipline) => <span className="chip" key={discipline}>{discipline}</span>)}
            </div>
          </div>
          <div data-reveal><ProjectVisual project={project} /></div>
        </div>

        <div className="project-meta-grid" data-reveal>
          <Meta label="Role" value={project.role} />
          <Meta label="Client" value={project.client} />
          <Meta label="Year" value={project.year} />
          <Meta label="Scope" value={project.disciplines.join(" · ")} />
        </div>

        {project.metrics.length > 0 && (
          <section className="project-section" data-reveal>
            <SectionLabel number="00" label="What changed" />
            <div className="project-metrics">
              {project.metrics.map((metric) => (
                <div className="project-metric" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <p>{metric.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="project-section project-story-grid" data-reveal>
          <SectionLabel number="01" label="The brief" />
          <div>
            <StoryBlock title="The challenge" body={project.challenge} />
            <StoryBlock title="The creative premise" body={project.approach} />
            <StoryBlock title="The outcome" body={project.outcome} />
          </div>
        </section>

        {project.palette.length > 0 && (
          <section className="project-section project-dark-section" data-reveal>
            <SectionLabel number="02" label="Color direction" light />
            <div>
              <h2 className="h2">Color with a job to do.</h2>
              <p className="project-section-intro">{project.palette_story}</p>
              <div className="project-palette-strip">
                {project.palette.map((color) => <span key={color.hex + color.name} style={{ background: color.hex }} title={`${color.name} ${color.hex}`} />)}
              </div>
              <div className="project-palette-list">
                {project.palette.map((color) => (
                  <div className="project-palette-row" key={color.hex + color.role}>
                    <span className="project-color-dot" style={{ background: color.hex }} />
                    <strong>{color.name}</strong>
                    <span className="font-mono">{color.hex}</span>
                    <span className="project-palette-role">{color.role}</span>
                    <p>{color.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(project.typography.length > 0 || project.voice_narrative || project.voice_principles.length > 0 || project.copy_examples.length > 0) && (
          <section className="project-section project-voice-grid" data-reveal>
            <SectionLabel number="03" label="Message & expression" />
            <div>
              <h2 className="h2">Make the point <span className="serif" style={{ color: "var(--accent)" }}>land.</span></h2>
              {project.voice_narrative && <p className="project-section-intro">{project.voice_narrative}</p>}
              {project.voice_principles.length > 0 && (
                <div className="project-principles">
                  {project.voice_principles.map((principle, index) => <span key={principle}><b>{String(index + 1).padStart(2, "0")}</b>{principle}</span>)}
                </div>
              )}
              {project.copy_examples.length > 0 && (
                <div className="project-copy-list">
                  {project.copy_examples.map((copy) => (
                    <div className="project-copy-row" key={copy.before + copy.after}>
                      <p><span>Before</span><s>{copy.before}</s></p>
                      <p><span>After</span><strong>{copy.after}</strong></p>
                      <small>{copy.note}</small>
                    </div>
                  ))}
                </div>
              )}
              {project.typography.length > 0 && (
                <div className="project-type-list">
                  {project.typography.map((type) => (
                    <div className={`project-type-card spec-${type.classification}`} key={type.role + type.family}>
                      <span>{type.role}</span><strong>{type.sample}</strong><p>{type.family} — {type.rationale}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {project.hurdles.length > 0 && (
          <section className="project-section" data-reveal>
            <SectionLabel number="04" label="Constraints became direction" />
            <div>
              <h2 className="h2">The hard parts are part of the work.</h2>
              <div className="project-hurdles">
                {project.hurdles.map((hurdle) => (
                  <div className="project-hurdle" key={hurdle.title}>
                    <span className="eyebrow">{hurdle.kind}</span>
                    <h3>{hurdle.title}</h3>
                    <div><span>Constraint</span><p>{hurdle.constraint}</p></div>
                    <div><span>Direction</span><p>{hurdle.resolution}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.decisions.length > 0 && (
          <section className="project-section project-decisions-section" data-reveal>
            <SectionLabel number="05" label="Creative decisions" />
            <div>
              <h2 className="h2">Every choice carries <span className="serif" style={{ color: "var(--accent)" }}>weight.</span></h2>
              <div className="project-decision-list">
                {project.decisions.map((decision) => (
                  <div className="project-decision" key={decision.area + decision.decision}>
                    <span className="font-mono">{decision.area}</span><strong>{decision.decision}</strong><p>{decision.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.process.length > 0 && (
          <section className="project-section project-process-section" data-reveal>
            <SectionLabel number="06" label="Working process" />
            <div>
              <h2 className="h2">From ambiguity to <span className="serif" style={{ color: "var(--accent)" }}>something ownable.</span></h2>
              <div className="project-process-list">
                {project.process.map((step, index) => (
                  <div className="project-process-step" key={step.title + index}>
                    <span className="project-step-number">{String(index + 1).padStart(2, "0")}</span>
                    <div><div className="project-step-heading"><h3>{step.title}</h3><span className="font-mono">{step.duration}</span></div><p>{step.description}</p><div className="project-output-list">{step.outputs.map((output) => <span key={output}>{output}</span>)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.gallery.length > 0 && (
          <section className="project-section" data-reveal>
            <SectionLabel number="07" label="Selected artifacts" />
            <div className="project-gallery">
              {project.gallery.map((item, index) => (
                <figure className="project-gallery-item" key={item.src + index} style={{ background: project.palette[index % Math.max(project.palette.length, 1)]?.hex ?? "var(--stone)" }}>
                  <img src={item.src} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="project-end" data-reveal>
          <p className="eyebrow">A similar challenge?</p>
          <h2 className="h2">Let's talk about what your project needs to <span className="serif" style={{ color: "var(--accent)" }}>become.</span></h2>
          <button className="btn btn-primary" onClick={onContact}>Start a conversation →</button>
        </section>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><span className="eyebrow">{label}</span><strong>{value || "—"}</strong></div>;
}

function SectionLabel({ number, label, light = false }: { number: string; label: string; light?: boolean }) {
  return <div className={`project-section-label${light ? " light" : ""}`}><span>{number}</span><b>{label}</b></div>;
}

function StoryBlock({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return <div className="project-story-block"><span className="eyebrow">{title}</span><p>{body}</p></div>;
}
