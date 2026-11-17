"use client";

import React, { useState } from "react";
import {
  PortfolioPayload,
  Project,
  DirectorProfile,
  Accolade,
  Testimonial,
  FaqItem,
  Inquiry,
  ClientPartner,
} from "@/types/portfolio";
import CaseStudyModal from "@/components/CaseStudyModal";
import AboutView from "@/components/AboutView";
import ConversationModal from "@/components/ConversationModal";
import DirectorStudioModal from "@/components/DirectorStudioModal";
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  SlidersHorizontal,
  Edit3,
  Award,
  Sparkles,
  CheckCircle2,
  Eye,
} from "lucide-react";

interface PortfolioExperienceProps {
  initialData: PortfolioPayload;
  initialView?: "home" | "about" | "case-study";
  initialProjectSlug?: string;
}

export default function PortfolioExperience({
  initialData,
  initialView = "home",
  initialProjectSlug,
}: PortfolioExperienceProps) {
  const [profile, setProfile] = useState<DirectorProfile>(initialData.profile);
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [accolades, setAccolades] = useState<Accolade[]>(initialData.accolades);
  const [clientPartners] = useState<ClientPartner[]>(
    initialData.clientPartners
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialData.testimonials
  );
  const [faqs, setFaqs] = useState<FaqItem[]>(initialData.faqs);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialData.inquiries);

  // Active View State ("home" | "about" | "case-study")
  const [activeView, setActiveView] = useState<"home" | "about" | "case-study">(
    initialView
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    if (initialProjectSlug) {
      return (
        initialData.projects.find((p) => p.slug === initialProjectSlug) ||
        initialData.projects[0] ||
        null
      );
    }
    return null;
  });

  // Work Gallery Filter & Archive Toggle
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showFullArchive, setShowFullArchive] = useState<boolean>(false);

  // Active Client Partner Spotlight (Section 03 / IN GOOD COMPANY)
  const [activePartner, setActivePartner] = useState<ClientPartner | null>(
    null
  );

  // Active Testimonial Index on the Chartreuse Billboard (Section 04 / KIND WORDS)
  const spotlightIdx = Math.max(
    0,
    testimonials.findIndex((t) => t.isSpotlight)
  );
  const [activeQuoteIndex, setActiveQuoteIndex] =
    useState<number>(spotlightIdx);

  // Active FAQ Accordion Index (Section 05 / A FEW ANSWERS)
  const [openFaqId, setOpenFaqId] = useState<number | null>(
    initialData.faqs[0]?.id ?? null
  );

  // Studio Edit Mode Overlay Highlights + Modal
  const [studioQuickEditBar, setStudioQuickEditBar] = useState<boolean>(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState<boolean>(false);
  const [studioTab, setStudioTab] = useState<
    "projects" | "profile" | "accolades" | "testimonials" | "inquiries"
  >("projects");
  const [projectToEditInStudio, setProjectToEditInStudio] =
    useState<Project | null>(null);

  // Start a Conversation Modal
  const [isConversationOpen, setIsConversationOpen] = useState<boolean>(false);
  const [conversationContext, setConversationContext] = useState<string>("");

  const categories = ["ALL", "BRANDING", "CAMPAIGNS", "PRODUCT & UI"];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === "ALL" ||
      p.category.toUpperCase() === selectedCategory;
    if (!matchesCategory) return false;
    if (showFullArchive || selectedCategory !== "ALL") return true;
    return p.featured;
  });

  const displayedProjects =
    filteredProjects.length > 0 ? filteredProjects : projects;

  const activeBillboardTestimonial =
    testimonials[activeQuoteIndex] ||
    testimonials.find((t) => t.isSpotlight) ||
    testimonials[0];

  const handleOpenCaseStudy = (project: Project) => {
    setSelectedProject(project);
    setActiveView("case-study");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenStudioForProject = (project?: Project) => {
    setProjectToEditInStudio(project || null);
    setStudioTab("projects");
    setIsStudioModalOpen(true);
  };

  const handleOpenStudioTab = (
    tab: "projects" | "profile" | "accolades" | "testimonials" | "inquiries"
  ) => {
    setProjectToEditInStudio(null);
    setStudioTab(tab);
    setIsStudioModalOpen(true);
  };

  const handleStartConversation = (context = "") => {
    setConversationContext(context);
    setIsConversationOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (activeView !== "home") {
      setActiveView("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#111110] relative">
      {/* FLOATING TRANSLUCENT GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-40 h-[72px] backdrop-blur-xl bg-[#F7F5F0]/88 border-b border-[#111110]/8 transition-all">
        <div className="max-w-[1380px] mx-auto px-6 md:px-12 h-full flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-display text-base sm:text-lg font-extrabold tracking-[-0.05em] text-[#111110] hover:opacity-75 transition-opacity cursor-pointer"
            >
              {profile.wordmark || "SARAHREESE"}
            </button>

            <span className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#111110]/10 font-mono text-[10px] uppercase tracking-[0.12em] text-[#6E6C67]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A] ring-2 ring-[#111110]/20" />
              <span>{profile.availabilityStatus}</span>
            </span>
          </div>

          {/* Center / Right Navigation Links + Studio Trigger + CTA */}
          <nav className="flex items-center gap-5 md:gap-7">
            <button
              onClick={() => {
                setActiveView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                activeView === "home"
                  ? "text-[#111110] font-semibold"
                  : "text-[#6E6C67] hover:text-[#111110]"
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => scrollToSection("selected-work")}
              className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                activeView === "case-study"
                  ? "text-[#111110] font-semibold"
                  : "text-[#6E6C67] hover:text-[#111110]"
              }`}
            >
              WORK
            </button>

            <button
              onClick={() => {
                setActiveView("about");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                activeView === "about"
                  ? "text-[#111110] font-semibold"
                  : "text-[#6E6C67] hover:text-[#111110]"
              }`}
            >
              ABOUT
            </button>

            <button
              onClick={() => handleStartConversation()}
              className="hidden md:inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6C67] hover:text-[#111110] transition-colors cursor-pointer"
            >
              CONTACT
            </button>

            {/* Director Studio CMS Button */}
            <button
              onClick={() => setIsStudioModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#111110]/20 bg-white/90 hover:bg-[#D4F82A] text-[#111110] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer shadow-xs"
              title="Open Director Studio CMS to edit projects, bio, and accolades"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Director Studio</span>
            </button>

            {/* Primary Pill CTA matching Screenshot 1, 2, 3 */}
            <button
              onClick={() => handleStartConversation()}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-[#111110] text-[#F7F5F0] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>START A CONVERSATION</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>
      </header>

      {/* FLOATING QUICK-CUSTOMIZE STUDIO BAR (Allows one-click editing or adding projects anytime) */}
      {studioQuickEditBar && (
        <div className="bg-[#111110] text-[#F7F5F0] border-b border-white/10 py-2.5 px-6">
          <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#D4F82A]" />
              <span>
                <strong>Interactive Director Mode Active:</strong> Click any project or section to customize content in real time.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenStudioForProject()}
                className="px-3 py-1 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-[10px] font-bold uppercase cursor-pointer"
              >
                + Add Project
              </button>
              <button
                onClick={() => handleOpenStudioTab("profile")}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F5F0] font-mono text-[10px] uppercase cursor-pointer"
              >
                Edit Bio & Copy
              </button>
              <button
                onClick={() => setStudioQuickEditBar(false)}
                className="font-mono text-[10px] text-[#F7F5F0]/60 hover:text-white ml-2 cursor-pointer"
              >
                Hide Bar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: DEDICATED CASE STUDY READER (Matches Screenshot 2) */}
      {activeView === "case-study" && selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          allProjects={projects}
          onClose={() => {
            setActiveView("home");
            setTimeout(() => {
              document
                .getElementById("selected-work")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onEditProject={(proj) => handleOpenStudioForProject(proj)}
          onStartConversation={(ctx) => handleStartConversation(ctx)}
        />
      )}

      {/* VIEW 2: DEDICATED ABOUT & COLLABORATORS PAGE (Matches Screenshot 3) */}
      {activeView === "about" && (
        <AboutView
          profile={profile}
          accolades={accolades}
          testimonials={testimonials}
          clientPartners={clientPartners}
          onBackToHome={() => {
            setActiveView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenStudio={(tab) => handleOpenStudioTab(tab)}
          onStartConversation={(ctx) => handleStartConversation(ctx)}
        />
      )}

      {/* VIEW 3: PRIMARY EDITORIAL HOME GALLERY (Matches Screenshot 1 + Modernized Apple Elevation) */}
      {activeView === "home" && (
        <main className="flex-1">
          {/* ============================================================== */}
          {/* HERO SECTION */}
          {/* ============================================================== */}
          <section className="relative overflow-hidden pt-16 sm:pt-24 md:pt-32 pb-24 md:pb-36 border-b border-[#111110]/8">
            {/* Subtle Vertical Outlined CREATIVE DIRECTOR Architectural Watermark on Right */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute right-4 top-10 select-none pointer-events-none writing-vertical font-display font-extrabold text-[125px] leading-[0.82] tracking-[-0.04em] stroke-watermark uppercase opacity-80"
            >
              CREATIVE
              <br />
              DIRECTOR
            </div>

            <div className="max-w-[1380px] mx-auto px-6 md:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Signature SR Chartreuse Monogram Badge + Vertical Scroll Indicator */}
                <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-4 pt-2">
                  <button
                    onClick={() => scrollToSection("selected-work")}
                    className="w-12 h-12 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-xs font-bold flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
                    title="Scroll to Selected Work"
                  >
                    {profile.monogram || "SR"}
                  </button>
                  <div className="hidden lg:block writing-vertical font-mono text-[10px] uppercase tracking-[0.22em] text-[#6E6C67]/75 mt-3 ml-4">
                    SCROLL TO EXPLORE
                  </div>
                </div>

                {/* Main Center-Left Display Statement */}
                <div className="lg:col-span-9">
                  {/* Eyebrow Metadata */}
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6C67] mb-7">
                    <span>{profile.roleTagline}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F26B4E]" />
                    <span>{profile.locationTagline}</span>
                    <button
                      onClick={() => handleOpenStudioTab("profile")}
                      className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/80 border border-[#111110]/15 text-[10px] text-[#111110] hover:bg-[#D4F82A] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit Hero</span>
                    </button>
                  </div>

                  {/* Monumental Display Headline */}
                  <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold tracking-[-0.042em] leading-[0.96] text-[#111110] max-w-4xl mb-12">
                    {profile.heroHeadline}
                  </h1>

                  {/* Bottom Row of Hero: Subtitle on Left, EXPLORE THE WORK ↓ on Right */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-4 max-w-4xl">
                    <p className="text-base sm:text-lg text-[#6E6C67] leading-[1.6] max-w-md font-normal">
                      {profile.heroSubheadline}
                    </p>

                    <div className="flex items-center gap-5 shrink-0">
                      <button
                        onClick={() => scrollToSection("selected-work")}
                        className="inline-flex items-center gap-2 pb-1.5 border-b-2 border-[#111110] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#111110] hover:text-[#F26B4E] hover:border-[#F26B4E] transition-colors cursor-pointer group"
                      >
                        <span>EXPLORE THE WORK</span>
                        <ArrowDown className="w-3.5 h-3.5 text-[#F26B4E] group-hover:translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Modernized Apple-Style Executive Credentials & Quick-Jump Bar */}
                  <div className="mt-16 pt-8 border-t border-[#111110]/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6E6C67]">
                        EXPERIENCE
                      </div>
                      <div className="font-display text-2xl font-bold text-[#111110] mt-0.5">
                        {profile.yearsExperience}
                      </div>
                      <div className="text-xs text-[#6E6C67]">
                        Startups & Fortune 500
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6E6C67]">
                        ENTERPRISE ROSTER
                      </div>
                      <div className="font-display text-2xl font-bold text-[#111110] mt-0.5">
                        {profile.fortuneClientsCount}
                      </div>
                      <div className="text-xs text-[#6E6C67]">
                        Google, Microsoft, Volvo, eHealth
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6E6C67]">
                        BRAND SYSTEMS
                      </div>
                      <div className="font-display text-2xl font-bold text-[#111110] mt-0.5">
                        {profile.systemsLaunchedCount}
                      </div>
                      <div className="text-xs text-[#6E6C67]">
                        Identity, Campaigns & UI
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#F26B4E]">
                        PORTFOLIO CMS
                      </div>
                      <button
                        onClick={() => handleOpenStudioForProject()}
                        className="mt-1 inline-flex items-center gap-1.5 text-left font-mono text-xs font-semibold text-[#111110] hover:text-[#F26B4E] transition-colors cursor-pointer"
                      >
                        <span>+ Add / Edit Case Studies</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* 01 / PERSPECTIVE SECTION (Matches Screenshot 1 + Accolades) */}
          {/* ============================================================== */}
          <section
            id="perspective"
            className="py-24 md:py-36 max-w-[1140px] mx-auto px-6 md:px-12"
          >
            {/* Section Index Hairline */}
            <div className="flex items-center justify-between pb-4 border-b border-[#111110]/12 mb-14">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6C67]">
                01 / PERSPECTIVE
              </span>
              <button
                onClick={() => handleOpenStudioTab("profile")}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#6E6C67] hover:text-[#111110] inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Perspective</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
              {/* Left 5 Cols: "Strategy with a human pulse." */}
              <div className="md:col-span-5">
                <h2 className="font-display text-4xl sm:text-5xl md:text-[56px] font-bold tracking-[-0.038em] leading-[1.02]">
                  <span className="block text-[#111110]">
                    {profile.perspectiveTitle}
                  </span>
                  <span className="block text-[#F26B4E]">
                    {profile.perspectiveHighlight}
                  </span>
                </h2>
              </div>

              {/* Right 7 Cols: Manifesto Statement + Link to About */}
              <div className="md:col-span-7 space-y-8">
                <p className="font-display text-2xl sm:text-3xl md:text-[32px] font-medium tracking-[-0.025em] leading-[1.32] text-[#111110]">
                  {profile.perspectiveBody}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-6">
                  <button
                    onClick={() => {
                      setActiveView("about");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 pb-1.5 border-b border-[#111110] font-mono text-xs uppercase tracking-[0.14em] text-[#111110] hover:text-[#F26B4E] hover:border-[#F26B4E] transition-colors cursor-pointer"
                  >
                    <span>A LITTLE MORE ABOUT ME</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#F26B4E]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Apple-Polished Executive Capabilities & Recognition Strip */}
            <div className="mt-20 pt-12 border-t border-[#111110]/10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[#6E6C67]">
                  <Award className="w-3.5 h-3.5 text-[#F26B4E]" />
                  <span>SELECTED ACCOLADES & RECOGNITION</span>
                </div>
                <button
                  onClick={() => handleOpenStudioTab("accolades")}
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#111110] hover:text-[#F26B4E] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>+ Manage Accolades ({accolades.length})</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accolades.slice(0, 3).map((acc) => (
                  <div
                    key={acc.id}
                    className="p-5 rounded-2xl bg-white/75 border border-[#111110]/10 hover:border-[#111110]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-[10px] font-bold">
                          {acc.year}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6E6C67]">
                          {acc.category}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base text-[#111110] leading-snug">
                        {acc.title}
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#111110]/8 flex items-center justify-between text-xs text-[#6E6C67]">
                      <span>{acc.organization}</span>
                      <span className="font-mono text-[10px] text-[#F26B4E] truncate max-w-[140px]">
                        {acc.projectRef}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* 02 / SELECTED WORK STAGE (Full-Bleed Obsidian Ink #111110) */}
          {/* ============================================================== */}
          <section
            id="selected-work"
            className="w-full bg-[#111110] text-[#F7F5F0] py-24 md:py-36"
          >
            <div className="max-w-[1240px] mx-auto px-6 md:px-12">
              {/* Top Section Header Row matching Screenshot 1 + Category Filters + Add Work */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/12 mb-12">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F7F5F0]/60">
                    02 / SELECTED WORK
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-mono text-[10px] text-[#D4F82A]">
                    {displayedProjects.length} CASE STUDIES
                  </span>
                </div>

                {/* Interactive Discipline Filters + View Archive + Add Case Study */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#1A1A18] border border-white/10">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-[#D4F82A] text-[#111110] font-bold"
                            : "text-[#F7F5F0]/65 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowFullArchive((prev) => !prev)}
                    className="px-3.5 py-1.5 rounded-full border border-white/15 hover:border-[#D4F82A] font-mono text-[10px] uppercase tracking-[0.14em] text-[#F7F5F0] hover:text-[#D4F82A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>
                      {showFullArchive
                        ? "SHOW FEATURED (4)"
                        : `VIEW ARCHIVE (${projects.length})`}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#F26B4E]" />
                  </button>

                  <button
                    onClick={() => handleOpenStudioForProject()}
                    className="px-3.5 py-1.5 rounded-full bg-[#D4F82A] text-[#111110] hover:bg-[#F26B4E] hover:text-white font-mono text-[10px] font-bold uppercase tracking-[0.12em] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* 2x2 Asymmetric Editorial Case Study Grid matching Screenshot 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
                {displayedProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group flex flex-col cursor-pointer"
                    onClick={() => handleOpenCaseStudy(project)}
                  >
                    {/* Artwork Frame with Signature #D4F82A Number Badge */}
                    <div className="relative aspect-[4/3.6] w-full overflow-hidden bg-[#1A1A18] mb-4 border border-white/10 group-hover:border-[#D4F82A]/60 transition-all duration-500">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700 ease-out"
                      />

                      {/* Subtle dark gradient vignette on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111110]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <p className="text-sm text-[#F7F5F0]/90 line-clamp-2 mb-3 font-normal">
                          {project.summary}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15">
                          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#D4F82A]">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read Full Case Study</span>
                          </div>
                          {project.impactMetrics?.[0] && (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[10px]">
                              {project.impactMetrics[0].value}{" "}
                              {project.impactMetrics[0].label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Signature #D4F82A Circular Numbered Badge in Top-Right */}
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-xs font-bold flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        {project.numberBadge}
                      </div>

                      {/* Quick Edit Button in Top-Left (stops propagation to open Studio directly) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenStudioForProject(project);
                        }}
                        className="opacity-0 group-hover:opacity-100 absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-[#111110]/80 hover:bg-[#D4F82A] text-[#F7F5F0] hover:text-[#111110] border border-white/20 font-mono text-[10px] uppercase tracking-[0.1em] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Work</span>
                      </button>
                    </div>

                    {/* Card Caption Footer matching Screenshot 1 */}
                    <div className="flex items-baseline justify-between gap-4 pt-1">
                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.025em] text-[#F7F5F0] group-hover:text-[#D4F82A] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[#F7F5F0]/55 mt-0.5">
                          {project.client}
                        </p>
                      </div>

                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F7F5F0]/55 shrink-0">
                        {project.category}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* 03 / IN GOOD COMPANY (Matches Screenshot 1 + Interactive Dossier) */}
          {/* ============================================================== */}
          <section className="py-24 md:py-32 max-w-[1140px] mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between pb-4 border-b border-[#111110]/12 mb-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6C67]">
                03 / IN GOOD COMPANY
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67]">
                CLICK ANY BRAND PARTNER TO INSPECT ENGAGEMENT SCOPE
              </span>
            </div>

            {/* Client Wordmarks Row matching Screenshot 1 (Google, Volvo in Coral, Dove, Wimbledon in Coral, Lyst, Microsoft, eHealth) */}
            <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-4">
              {clientPartners.map((partner) => {
                const isSelected = activePartner?.id === partner.id;
                return (
                  <button
                    key={partner.id}
                    onClick={() =>
                      setActivePartner(isSelected ? null : partner)
                    }
                    className={`font-display text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-[-0.035em] transition-all cursor-pointer ${
                      partner.highlightColor
                        ? "text-[#F26B4E] hover:opacity-80"
                        : "text-[#111110] hover:text-[#F26B4E]"
                    } ${
                      isSelected
                        ? "underline decoration-2 underline-offset-8"
                        : ""
                    }`}
                  >
                    {partner.name}
                  </button>
                );
              })}
            </div>

            {/* Expandable Apple-Style Engagement Dossier Card */}
            {activePartner && (
              <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#111110]/12 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4F82A] text-[#111110] font-bold">
                      {activePartner.name}
                    </span>
                    <span className="text-[#6E6C67]">{activePartner.sector}</span>
                    <span>•</span>
                    <span className="text-[#F26B4E]">
                      {activePartner.yearSpan}
                    </span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-[#111110]">
                    {activePartner.engagementRole}
                  </h4>
                  <p className="text-sm text-[#6E6C67]">
                    Deliverables: {activePartner.deliverableHighlight}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleStartConversation(
                      `Interested in Sarah's ${activePartner.name} (${activePartner.engagementRole}) experience`
                    )
                  }
                  className="px-5 py-2.5 rounded-full bg-[#111110] text-[#F7F5F0] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs uppercase tracking-[0.12em] inline-flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Request Relevant Deck</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* ============================================================== */}
          {/* 04 / KIND WORDS (Full-Bleed Electric Chartreuse #D4F82A Banner) */}
          {/* ============================================================== */}
          <section className="w-full bg-[#D4F82A] text-[#111110] py-24 md:py-36">
            <div className="max-w-[1240px] mx-auto px-6 md:px-12">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#111110]/15 mb-14">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111110]/70">
                  04 / KIND WORDS
                </span>

                <div className="flex items-center gap-2">
                  {testimonials.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveQuoteIndex(idx)}
                      className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.1em] transition-all cursor-pointer ${
                        activeQuoteIndex === idx
                          ? "bg-[#111110] text-[#D4F82A] font-bold"
                          : "bg-[#111110]/10 text-[#111110] hover:bg-[#111110]/20"
                      }`}
                    >
                      0{idx + 1} {t.company || t.author.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {activeBillboardTestimonial && (
                <div className="max-w-4xl">
                  <blockquote className="font-display text-3xl sm:text-5xl md:text-[54px] font-bold tracking-[-0.035em] leading-[1.08] text-[#111110] mb-10">
                    “{activeBillboardTestimonial.quote}”
                  </blockquote>

                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <div className="font-bold text-sm text-[#111110]">
                        {activeBillboardTestimonial.author}
                      </div>
                      <div className="text-xs text-[#111110]/70 mt-0.5">
                        {activeBillboardTestimonial.role}
                        {activeBillboardTestimonial.company
                          ? ` at ${activeBillboardTestimonial.company}`
                          : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView("about");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#111110] pb-1 border-b border-[#111110] hover:opacity-75 transition-opacity cursor-pointer"
                    >
                      <span>Read All {testimonials.length} Collaborator Reviews</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* 05 / A FEW ANSWERS (Curious minds ask questions. Accordion) */}
          {/* ============================================================== */}
          <section className="py-24 md:py-36 max-w-[1140px] mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between pb-4 border-b border-[#111110]/12 mb-14">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6C67]">
                05 / A FEW ANSWERS
              </span>
              <button
                onClick={() => handleOpenStudioTab("testimonials")}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#6E6C67] hover:text-[#111110] inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Manage Q&amp;A</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
              {/* Left 5 Cols: "Curious minds ask questions." */}
              <div className="md:col-span-5">
                <h2 className="font-display text-4xl sm:text-5xl md:text-[56px] font-bold tracking-[-0.038em] leading-[1.02]">
                  <span className="block text-[#111110]">Curious</span>
                  <span className="block text-[#111110]">minds</span>
                  <span className="block text-[#F26B4E]">ask</span>
                  <span className="block text-[#F26B4E]">questions.</span>
                </h2>
              </div>

              {/* Right 7 Cols: Interactive Hairline Accordion */}
              <div className="md:col-span-7 divide-y divide-[#111110]/12 border-t border-b border-[#111110]/12">
                {faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="py-6">
                      <button
                        onClick={() =>
                          setOpenFaqId(isOpen ? null : faq.id)
                        }
                        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                      >
                        <span className="font-display text-lg sm:text-xl font-bold text-[#111110] group-hover:text-[#F26B4E] transition-colors">
                          {faq.question}
                        </span>
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-[#111110] shrink-0">
                          {isOpen ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-4 pr-8 text-base text-[#6E6C67] leading-[1.7] animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================== */}
      {/* OBSIDIAN FOOTER ("Let's make something worth remembering.") */}
      {/* Matches Screenshot 1, 2, and 3 */}
      {/* ============================================================== */}
      <footer className="w-full bg-[#111110] text-[#F7F5F0] pt-24 pb-12 mt-auto">
        <div className="max-w-[1140px] mx-auto px-6 md:px-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F7F5F0]/55 mb-5">
            HAVE A GOOD ONE.
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-20 border-b border-white/10">
            <h2 className="font-display text-5xl sm:text-6xl md:text-[76px] font-bold tracking-[-0.04em] leading-[0.98]">
              <span className="block text-[#F7F5F0]">
                Let’s make something
              </span>
              <span className="block text-[#F26B4E]">
                worth remembering.
              </span>
            </h2>

            {/* Signature Oversized #D4F82A Circular Arrow Button */}
            <button
              onClick={() => handleStartConversation()}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4F82A] text-[#111110] hover:bg-[#F26B4E] hover:text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0"
              aria-label="Start a conversation"
            >
              <ArrowUpRight className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Legal / Location / Links Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#F7F5F0]/60">
            <div>{profile.locationFooter}</div>

            <div className="flex flex-wrap items-center gap-6 text-[#F7F5F0]">
              <button
                onClick={() => scrollToSection("selected-work")}
                className="hover:text-[#D4F82A] transition-colors cursor-pointer"
              >
                Work
              </button>
              <button
                onClick={() => {
                  setActiveView("about");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[#D4F82A] transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => setIsStudioModalOpen(true)}
                className="hover:text-[#D4F82A] transition-colors cursor-pointer"
              >
                Director Studio
              </button>
              <button
                onClick={() => handleStartConversation()}
                className="hover:text-[#D4F82A] transition-colors cursor-pointer"
              >
                {profile.email}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* INTERACTIVE MODALS: CONVERSATION BRIEF & DIRECTOR STUDIO CMS */}
      {/* ============================================================== */}
      <ConversationModal
        isOpen={isConversationOpen}
        onClose={() => setIsConversationOpen(false)}
        defaultContext={conversationContext}
        email={profile.email}
        onInquiryCreated={(newInq) =>
          setInquiries((prev) => [newInq, ...prev])
        }
      />

      <DirectorStudioModal
        isOpen={isStudioModalOpen}
        onClose={() => setIsStudioModalOpen(false)}
        initialTab={studioTab}
        initialProjectToEdit={projectToEditInStudio}
        profile={profile}
        projects={projects}
        accolades={accolades}
        testimonials={testimonials}
        faqs={faqs}
        inquiries={inquiries}
        onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
        onProjectSaved={(savedProject, isNew) => {
          if (isNew) {
            setProjects((prev) => [...prev, savedProject]);
          } else {
            setProjects((prev) =>
              prev.map((p) => (p.id === savedProject.id ? savedProject : p))
            );
            if (selectedProject?.id === savedProject.id) {
              setSelectedProject(savedProject);
            }
          }
        }}
        onProjectDeleted={(deletedId) => {
          setProjects((prev) => prev.filter((p) => p.id !== deletedId));
          if (selectedProject?.id === deletedId) {
            setActiveView("home");
            setSelectedProject(null);
          }
        }}
        onAccoladeAdded={(newAcc) =>
          setAccolades((prev) => [newAcc, ...prev])
        }
        onAccoladeDeleted={(delId) =>
          setAccolades((prev) => prev.filter((a) => a.id !== delId))
        }
        onTestimonialAdded={(newT) => {
          if (newT.isSpotlight) {
            setTestimonials((prev) => [
              newT,
              ...prev.map((item) => ({ ...item, isSpotlight: false })),
            ]);
            setActiveQuoteIndex(0);
          } else {
            setTestimonials((prev) => [...prev, newT]);
          }
        }}
        onTestimonialSpotlightChanged={(spotId) => {
          setTestimonials((prev) =>
            prev.map((item) => ({
              ...item,
              isSpotlight: item.id === spotId,
            }))
          );
          const idx = testimonials.findIndex((t) => t.id === spotId);
          if (idx >= 0) setActiveQuoteIndex(idx);
        }}
        onTestimonialDeleted={(delId) =>
          setTestimonials((prev) => prev.filter((t) => t.id !== delId))
        }
        onFaqAdded={(newFaq) => setFaqs((prev) => [...prev, newFaq])}
        onFaqDeleted={(delId) =>
          setFaqs((prev) => prev.filter((f) => f.id !== delId))
        }
        onInquiryUpdated={(updatedInq) =>
          setInquiries((prev) =>
            prev.map((i) => (i.id === updatedInq.id ? updatedInq : i))
          )
        }
        onInquiryDeleted={(delId) =>
          setInquiries((prev) => prev.filter((i) => i.id !== delId))
        }
      />
    </div>
  );
}
