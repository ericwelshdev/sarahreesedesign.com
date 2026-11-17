"use client";

import React from "react";
import {
  DirectorProfile,
  Accolade,
  Testimonial,
  ClientPartner,
} from "@/types/portfolio";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Edit3,
  Sparkles,
  Layers,
  Compass,
  PenTool,
  Monitor,
} from "lucide-react";

interface AboutViewProps {
  profile: DirectorProfile;
  accolades: Accolade[];
  testimonials: Testimonial[];
  clientPartners: ClientPartner[];
  onBackToHome: () => void;
  onOpenStudio: (
    tab: "projects" | "profile" | "accolades" | "testimonials" | "inquiries"
  ) => void;
  onStartConversation: (context?: string) => void;
}

const CORE_PILLARS = [
  {
    index: "01",
    title: "Brand Strategy & Architecture",
    icon: Compass,
    description:
      "Positioning, sub-brand architecture, narrative frameworks, and competitive differentiation for category-defining startups and Fortune 500 enterprises.",
    skills: [
      "Brand Positioning",
      "Naming & Taxonomy",
      "DE&I / Sub-Brand Systems",
      "Executive Narrative",
    ],
  },
  {
    index: "02",
    title: "Identity Systems & Typography",
    icon: PenTool,
    description:
      "Bespoke logomarks, expressive continuous-line illustration systems, custom color architecture, and living design guidelines built to scale.",
    skills: [
      "Visual Identity",
      "Custom Illustration",
      "Typographic Hierarchy",
      "40+ Page Playbooks",
    ],
  },
  {
    index: "03",
    title: "Campaigns & Art Direction",
    icon: Sparkles,
    description:
      "Multi-channel campaign concepts, studio portrait photography direction, editorial publications, and kinetic social storytelling.",
    skills: [
      "Photo & Studio Direction",
      "Integrated Campaigns",
      "Book & Print Editorial",
      "Social Launch Kits",
    ],
  },
  {
    index: "04",
    title: "Digital Product & Executive Decks",
    icon: Monitor,
    description:
      "Apple-grade customer-facing investment presentations, flagship keynote slide systems, and serene digital product interfaces.",
    skills: [
      "Keynote Architecture",
      "UX/UI Design Systems",
      "Data Visualization",
      "Interactive Lookbooks",
    ],
  },
];

export default function AboutView({
  profile,
  accolades,
  testimonials,
  clientPartners,
  onBackToHome,
  onOpenStudio,
  onStartConversation,
}: AboutViewProps) {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111110] animate-fadeIn">
      {/* Sub-navigation bar */}
      <div className="sticky top-[72px] z-30 backdrop-blur-xl bg-[#F7F5F0]/85 border-b border-[#111110]/10">
        <div className="max-w-[1380px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111110] hover:text-[#F26B4E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#6E6C67]">
            <span>A BIT ABOUT ME</span>
            <span>/</span>
            <span className="text-[#111110] font-medium">{profile.name}</span>
          </div>

          <button
            onClick={() => onOpenStudio("profile")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#111110]/15 bg-white/80 hover:bg-[#D4F82A] text-[#111110] font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Bio & Toolkit</span>
          </button>
        </div>
      </div>

      {/* Main Editorial Content matching Screenshot 3 */}
      <div className="max-w-[1140px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-28">
        {/* Eyebrow: A BIT ABOUT ME */}
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#6E6C67] mb-5">
          A BIT ABOUT ME
        </div>

        {/* Display Headline: Curiosity is / the specialty. */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-[84px] font-bold tracking-[-0.04em] leading-[0.96] mb-10">
          <span className="block text-[#111110]">{profile.aboutHeadline}</span>
          <span className="block text-[#F26B4E]">{profile.aboutHighlight}</span>
        </h1>

        {/* Main Bio Copy */}
        <div className="max-w-2xl mb-20">
          <p className="text-lg md:text-[21px] text-[#6E6C67] leading-[1.65] font-normal">
            {profile.aboutBio}
          </p>
        </div>

        {/* Hairline Divider & 2-Column THE SHORT VERSION / THE TOOLKIT from Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-10 border-t border-[#111110]/15 mb-24">
          <div className="md:col-span-6 pr-0 md:pr-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6C67] mb-5">
              THE SHORT VERSION
            </div>
            <p className="font-display text-2xl sm:text-[28px] font-semibold tracking-[-0.025em] leading-[1.32] text-[#111110]">
              {profile.shortVersion}
            </p>
          </div>

          <div className="md:col-span-6 pl-0 md:pl-8 md:border-l border-[#111110]/10">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6C67] mb-5">
              THE TOOLKIT
            </div>
            <p className="text-base sm:text-lg text-[#6E6C67] leading-[1.7] mb-6">
              {profile.toolkit}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.toolkit
                .split(",")
                .map((s) => s.trim().replace(/\.$/, ""))
                .filter(Boolean)
                .map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white border border-[#111110]/10 font-mono text-[11px] text-[#111110]"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Modernized Apple-Inspired Capabilities Matrix (4 Core Pillars) */}
        <div className="mb-28">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#111110]/15 mb-10">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#6E6C67]">
              CREATIVE DIRECTION CAPABILITIES & DISCIPLINES
            </div>
            <span className="font-mono text-xs text-[#F26B4E]">
              END-TO-END LEADERSHIP FROM CONCEPT TO LAUNCH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.index}
                  className="p-8 rounded-3xl bg-white/85 border border-[#111110]/10 hover:border-[#111110]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-xs font-bold">
                        {pillar.index}
                      </span>
                      <Icon className="w-5 h-5 text-[#111110]/50" />
                    </div>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.025em] text-[#111110] mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#6E6C67] leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#111110]/10">
                    {pillar.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-full bg-[#F7F5F0] font-mono text-[11px] text-[#111110]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accolades & Recognition Index */}
        <div className="mb-28">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#111110]/15 mb-8">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#6E6C67]">
              <Award className="w-4 h-4 text-[#F26B4E]" />
              <span>ACCOLADES, HONORS & INDUSTRY RECOGNITION</span>
            </div>
            <button
              onClick={() => onOpenStudio("accolades")}
              className="font-mono text-xs uppercase tracking-[0.12em] text-[#111110] hover:text-[#F26B4E] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>+ Add Accolade</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#111110]/10">
            {accolades.map((acc) => (
              <div
                key={acc.id}
                className="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center hover:bg-white/60 px-4 -mx-4 rounded-2xl transition-colors"
              >
                <div className="md:col-span-2 font-mono text-xs font-bold text-[#111110] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4F82A]" />
                  <span>{acc.year}</span>
                </div>
                <div className="md:col-span-5 font-display font-bold text-lg text-[#111110]">
                  {acc.title}
                </div>
                <div className="md:col-span-3 text-sm text-[#6E6C67]">
                  {acc.organization}
                </div>
                <div className="md:col-span-2 font-mono text-xs text-right text-[#F26B4E]">
                  {acc.projectRef}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT COLLABORATORS SAY — Full Editorial Quote Stack from Screenshot 3 */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#111110]/15 mb-12">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#6E6C67]">
              WHAT COLLABORATORS SAY
            </div>
            <button
              onClick={() => onOpenStudio("testimonials")}
              className="font-mono text-xs uppercase tracking-[0.12em] text-[#111110] hover:text-[#F26B4E] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Endorsements</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#111110]/12">
            {testimonials.map((t) => (
              <div key={t.id} className="py-12 first:pt-2">
                <blockquote className="font-display text-2xl sm:text-4xl md:text-[40px] font-bold tracking-[-0.03em] leading-[1.18] text-[#111110] mb-6 max-w-4xl">
                  “{t.quote}”
                </blockquote>
                <div>
                  <div className="font-semibold text-sm text-[#111110]">
                    {t.author}
                  </div>
                  <div className="text-xs text-[#6E6C67] mt-0.5">
                    {t.role}
                    {t.company && t.company !== t.role ? `, ${t.company}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
