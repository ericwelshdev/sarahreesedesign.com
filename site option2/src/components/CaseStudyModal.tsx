"use client";

import React, { useState } from "react";
import { Project } from "@/types/portfolio";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface CaseStudyModalProps {
  project: Project;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onStartConversation: (defaultContext?: string) => void;
}

export default function CaseStudyModal({
  project,
  allProjects,
  onClose,
  onSelectProject,
  onEditProject,
  onStartConversation,
}: CaseStudyModalProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeVisual, setActiveVisual] = useState<"detail" | "cover" | "secondary">("detail");

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0
      ? allProjects[currentIndex - 1]
      : allProjects[allProjects.length - 1];
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const displayedImage =
    activeVisual === "detail"
      ? project.detailHeroImage || project.coverImage
      : activeVisual === "cover"
      ? project.coverImage
      : project.secondaryImage || project.coverImage;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111110] animate-fadeIn">
      {/* Sub-header Bar */}
      <div className="sticky top-[72px] z-30 backdrop-blur-xl bg-[#F7F5F0]/85 border-b border-[#111110]/10">
        <div className="max-w-[1380px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111110] hover:text-[#F26B4E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Work</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#6E6C67]">
            <span>Case Study {project.numberBadge}</span>
            <span>/</span>
            <span className="text-[#111110] font-medium">{project.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEditProject(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#111110]/15 bg-white/80 hover:bg-[#D4F82A] text-[#111110] font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Customize Case Study</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Content matching Screenshot 2 */}
      <article className="max-w-[1140px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-28">
        {/* Eyebrow: BRANDING / EHEALTH */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-[#6E6C67]">
            <span>{project.category}</span>
            <span>/</span>
            <span className="text-[#111110] font-medium">
              {project.client.toUpperCase()}
            </span>
            <span className="text-[#111110]/30">•</span>
            <span>{project.year}</span>
          </div>

          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-xs font-semibold">
            {project.numberBadge}
          </span>
        </div>

        {/* Display Title */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-[72px] font-bold tracking-[-0.04em] leading-[0.98] text-[#111110] max-w-3xl mb-8">
          {project.title}
        </h1>

        {/* Deck Summary */}
        <p className="text-lg md:text-[21px] text-[#6E6C67] leading-[1.55] max-w-2xl mb-14 font-normal">
          {project.summary}
        </p>

        {/* Primary Visual Showcase Frame + View Switcher */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden bg-white border border-[#111110]/10 shadow-[0_24px_60px_-15px_rgba(17,17,16,0.08)]">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#EFECE6] relative">
              <img
                src={displayedImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full backdrop-blur-md bg-[#111110]/75 text-[#F7F5F0] font-mono text-[11px] uppercase tracking-[0.12em]">
                  {activeVisual === "detail"
                    ? "01 / Identity & Illustration Language"
                    : activeVisual === "cover"
                    ? "02 / Campaign & Brand Application"
                    : "03 / System Touchpoints"}
                </span>
              </div>
            </div>
          </div>

          {/* Apple-style visual plate selector */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 p-1 rounded-full bg-[#EFECE6] border border-[#111110]/10">
              <button
                onClick={() => setActiveVisual("detail")}
                className={`px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer ${
                  activeVisual === "detail"
                    ? "bg-[#111110] text-[#F7F5F0]"
                    : "text-[#6E6C67] hover:text-[#111110]"
                }`}
              >
                Hero Concept Plate
              </button>
              <button
                onClick={() => setActiveVisual("cover")}
                className={`px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer ${
                  activeVisual === "cover"
                    ? "bg-[#111110] text-[#F7F5F0]"
                    : "text-[#6E6C67] hover:text-[#111110]"
                }`}
              >
                Brand Cover Plate
              </button>
              <button
                onClick={() => setActiveVisual("secondary")}
                className={`px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer ${
                  activeVisual === "secondary"
                    ? "bg-[#111110] text-[#F7F5F0]"
                    : "text-[#6E6C67] hover:text-[#111110]"
                }`}
              >
                System Extension
              </button>
            </div>

            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#6E6C67]">
              Art Direction & Visual System by Sarah Reese
            </span>
          </div>
        </div>

        {/* Impact Metrics Bento Row (Apple Executive Brief Upgrade) */}
        {project.impactMetrics && project.impactMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {project.impactMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/80 border border-[#111110]/10 flex flex-col justify-between hover:border-[#111110]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6C67]">
                    0{idx + 1} / {metric.label}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D4F82A] ring-2 ring-[#111110]/15" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold tracking-[-0.04em] text-[#111110] my-1">
                  {metric.value}
                </div>
                <p className="text-sm text-[#6E6C67] leading-relaxed mt-2">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Asymmetric 2-Column Case Study Body matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Metadata Sidebar (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-36 space-y-8">
            <div className="pb-6 border-b border-[#111110]/10">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6C67] mb-2">
                ROLE
              </div>
              <div className="text-sm font-semibold text-[#111110]">
                {project.role}
              </div>
            </div>

            <div className="pb-6 border-b border-[#111110]/10">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6C67] mb-2">
                DISCIPLINES
              </div>
              <div className="text-sm font-medium text-[#111110] leading-relaxed">
                {project.disciplines}
              </div>
            </div>

            {/* Interactive Brand System Palette */}
            {project.brandPalette && project.brandPalette.length > 0 && (
              <div className="pb-6 border-b border-[#111110]/10">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6C67] mb-3">
                  SYSTEM COLOR ARCHITECTURE (CLICK TO COPY)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {project.brandPalette.map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyHex(swatch.hex)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/70 hover:bg-white border border-[#111110]/10 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-lg border border-black/15 shadow-inner shrink-0"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs font-medium text-[#111110]">
                          {swatch.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#6E6C67] group-hover:text-[#111110] inline-flex items-center gap-1">
                        {copiedHex === swatch.hex ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <span>{swatch.hex}</span>
                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables Inventory */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="pb-6 border-b border-[#111110]/10">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6C67] mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>KEY DELIVERABLES SHIPPED</span>
                </div>
                <ul className="space-y-2">
                  {project.deliverables.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#111110]/85 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F26B4E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Commission Similar Scope CTA */}
            <div className="p-5 rounded-2xl bg-[#111110] text-[#F7F5F0]">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#D4F82A] mb-1.5">
                SIMILAR CHALLENGE?
              </div>
              <p className="text-xs text-[#F7F5F0]/80 leading-relaxed mb-4">
                Available to lead brand architecture, visual identity, or campaign systems for your team.
              </p>
              <button
                onClick={() =>
                  onStartConversation(
                    `Inquiring about a scope similar to ${project.title} (${project.client})`
                  )
                }
                className="w-full py-2.5 px-4 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-xs font-semibold uppercase tracking-[0.1em] hover:bg-[#F26B4E] hover:text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Inquire About Scope</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* Right Narrative Column (8 cols) — Exact 3-part structure from Screenshot 2 */}
          <div className="lg:col-span-8 space-y-14">
            <section>
              <h2 className="font-display text-2xl md:text-[28px] font-bold tracking-[-0.025em] text-[#111110] mb-4">
                The challenge
              </h2>
              <p className="text-base md:text-[18px] text-[#6E6C67] leading-[1.7] font-normal">
                {project.challenge}
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl md:text-[28px] font-bold tracking-[-0.025em] text-[#111110] mb-4">
                The approach
              </h2>
              <p className="text-base md:text-[18px] text-[#6E6C67] leading-[1.7] font-normal">
                {project.approach}
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl md:text-[28px] font-bold tracking-[-0.025em] text-[#111110] mb-4">
                The outcome
              </h2>
              <p className="text-base md:text-[18px] text-[#6E6C67] leading-[1.7] font-normal">
                {project.outcome}
              </p>
            </section>

            {/* Creative Director's Field Note Callout */}
            {project.directorNote && (
              <section className="p-8 md:p-10 rounded-2xl bg-[#EFECE6] border border-[#111110]/10 relative overflow-hidden">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[#F26B4E] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creative Director’s Perspective — Sarah Reese</span>
                </div>
                <blockquote className="font-display text-xl md:text-2xl font-semibold text-[#111110] leading-[1.4] tracking-[-0.02em]">
                  “{project.directorNote}”
                </blockquote>
              </section>
            )}

            {/* Side-by-Side Visual Diptych */}
            <section className="pt-4">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6C67] mb-4">
                VISUAL SYSTEM ARTIFACTS & APPLICATION
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-2xl overflow-hidden border border-[#111110]/10 bg-white aspect-[4/3]">
                  <img
                    src={project.coverImage}
                    alt={`${project.title} identity`}
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#111110]/10 bg-white aspect-[4/3]">
                  <img
                    src={project.secondaryImage || project.detailHeroImage}
                    alt={`${project.title} extension`}
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Back Link & Next/Prev Project Switcher */}
        <div className="mt-24 pt-12 border-t border-[#111110]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 pb-1.5 border-b-2 border-[#111110] font-mono text-xs uppercase tracking-[0.14em] text-[#111110] hover:text-[#F26B4E] hover:border-[#F26B4E] transition-colors cursor-pointer"
          >
            <span>← BACK TO ALL WORK</span>
          </button>

          <div className="flex items-center gap-4">
            {prevProject && (
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  onSelectProject(prevProject);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#111110]/15 hover:bg-[#111110] hover:text-[#F7F5F0] font-mono text-xs uppercase tracking-[0.1em] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev: {prevProject.numberBadge}</span>
              </button>
            )}
            {nextProject && (
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  onSelectProject(nextProject);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111110] text-[#F7F5F0] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs uppercase tracking-[0.1em] transition-all cursor-pointer"
              >
                <span>
                  Next: {nextProject.numberBadge} {nextProject.title}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
