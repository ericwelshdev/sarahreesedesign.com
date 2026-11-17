"use client";

import React, { useState, useEffect } from "react";
import {
  DirectorProfile,
  Project,
  Accolade,
  Testimonial,
  FaqItem,
  Inquiry,
  ImpactMetric,
  PaletteSwatch,
} from "@/types/portfolio";
import {
  X,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  FolderKanban,
  UserCheck,
  Award,
  MessageSquareQuote,
  Inbox,
  Star,
} from "lucide-react";

interface DirectorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "projects" | "profile" | "accolades" | "testimonials" | "inquiries";
  initialProjectToEdit?: Project | null;
  profile: DirectorProfile;
  projects: Project[];
  accolades: Accolade[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  inquiries: Inquiry[];
  onProfileUpdated: (updated: DirectorProfile) => void;
  onProjectSaved: (saved: Project, isNew: boolean) => void;
  onProjectDeleted: (id: number) => void;
  onAccoladeAdded: (accolade: Accolade) => void;
  onAccoladeDeleted: (id: number) => void;
  onTestimonialAdded: (t: Testimonial) => void;
  onTestimonialSpotlightChanged: (id: number) => void;
  onTestimonialDeleted: (id: number) => void;
  onFaqAdded: (faq: FaqItem) => void;
  onFaqDeleted: (id: number) => void;
  onInquiryUpdated: (inquiry: Inquiry) => void;
  onInquiryDeleted: (id: number) => void;
}

const PRESET_ARTWORK = [
  { label: "DI&I Emerald Editorial Portrait", url: "/images/projects/dii-brand.jpg" },
  { label: "Expressive Ink Fox Illustration", url: "/images/projects/natural-highs.jpg" },
  { label: "Serendipity Terracotta Mobile UI", url: "/images/projects/serendipity.jpg" },
  { label: "Restore OT Calm Studio Interior", url: "/images/projects/restore-ot.jpg" },
  { label: "Enterprise Executive Keynote Glass", url: "/images/projects/google-keynote.jpg" },
  { label: "Nordic Mobility Material System", url: "/images/projects/volvo-mobility.jpg" },
];

export default function DirectorStudioModal({
  isOpen,
  onClose,
  initialTab = "projects",
  initialProjectToEdit = null,
  profile,
  projects,
  accolades,
  testimonials,
  faqs,
  inquiries,
  onProfileUpdated,
  onProjectSaved,
  onProjectDeleted,
  onAccoladeAdded,
  onAccoladeDeleted,
  onTestimonialAdded,
  onTestimonialSpotlightChanged,
  onTestimonialDeleted,
  onFaqAdded,
  onFaqDeleted,
  onInquiryUpdated,
  onInquiryDeleted,
}: DirectorStudioModalProps) {
  const [activeTab, setActiveTab] = useState<
    "projects" | "profile" | "accolades" | "testimonials" | "inquiries"
  >(initialTab);
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Project Editor State
  const [selectedProjectId, setSelectedProjectId] = useState<number | "new">(
    initialProjectToEdit ? initialProjectToEdit.id : projects[0]?.id ?? "new"
  );
  const [projTitle, setProjTitle] = useState("");
  const [projClient, setProjClient] = useState("");
  const [projBadge, setProjBadge] = useState("");
  const [projCategory, setProjCategory] = useState("BRANDING");
  const [projYear, setProjYear] = useState("2025");
  const [projFeatured, setProjFeatured] = useState(true);
  const [projRole, setProjRole] = useState("");
  const [projDisciplines, setProjDisciplines] = useState("");
  const [projSummary, setProjSummary] = useState("");
  const [projCoverImage, setProjCoverImage] = useState("/images/projects/dii-brand.jpg");
  const [projDetailImage, setProjDetailImage] = useState("/images/projects/natural-highs.jpg");
  const [projChallenge, setProjChallenge] = useState("");
  const [projApproach, setProjApproach] = useState("");
  const [projOutcome, setProjOutcome] = useState("");
  const [projDirectorNote, setProjDirectorNote] = useState("");
  const [projDeliverablesText, setProjDeliverablesText] = useState("");
  const [projMetrics, setProjMetrics] = useState<ImpactMetric[]>([
    { label: "Brand Adoption", value: "100%", detail: "Cross-channel rollout" },
    { label: "Engagement Lift", value: "+84%", detail: "First 90 days post-launch" },
    { label: "System Assets", value: "45+", detail: "Modular templates & specs" },
  ]);
  const [projPalette, setProjPalette] = useState<PaletteSwatch[]>([
    { name: "Archive Alabaster", hex: "#F7F5F0" },
    { name: "Obsidian Ink", hex: "#111110" },
    { name: "Electric Chartreuse", hex: "#D4F82A" },
    { name: "Editorial Coral", hex: "#F26B4E" },
  ]);

  // Profile Editor State
  const [profForm, setProfForm] = useState<DirectorProfile>(profile);

  // New Accolade State
  const [accYear, setAccYear] = useState("2025");
  const [accTitle, setAccTitle] = useState("");
  const [accOrg, setAccOrg] = useState("");
  const [accProjectRef, setAccProjectRef] = useState("");
  const [accCategory, setAccCategory] = useState("Brand Identity");

  // New Testimonial & FAQ State
  const [testQuote, setTestQuote] = useState("");
  const [testAuthor, setTestAuthor] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testCompany, setTestCompany] = useState("");
  const [testSpotlight, setTestSpotlight] = useState(false);

  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setProfForm(profile);
  }, [profile]);

  useEffect(() => {
    if (initialProjectToEdit) {
      setActiveTab("projects");
      loadProjectIntoForm(initialProjectToEdit);
    } else if (projects.length > 0 && selectedProjectId !== "new") {
      const found = projects.find((p) => p.id === selectedProjectId) || projects[0];
      if (found) loadProjectIntoForm(found);
    }
  }, [initialProjectToEdit, isOpen]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const loadProjectIntoForm = (p: Project) => {
    setSelectedProjectId(p.id);
    setProjTitle(p.title);
    setProjClient(p.client);
    setProjBadge(p.numberBadge);
    setProjCategory(p.category);
    setProjYear(p.year);
    setProjFeatured(p.featured);
    setProjRole(p.role);
    setProjDisciplines(p.disciplines);
    setProjSummary(p.summary);
    setProjCoverImage(p.coverImage);
    setProjDetailImage(p.detailHeroImage);
    setProjChallenge(p.challenge);
    setProjApproach(p.approach);
    setProjOutcome(p.outcome);
    setProjDirectorNote(p.directorNote);
    setProjDeliverablesText((p.deliverables || []).join("\n"));
    setProjMetrics(
      p.impactMetrics?.length
        ? p.impactMetrics
        : [
            { label: "Adoption", value: "100%", detail: "Global brand alignment" },
            { label: "Campaign Lift", value: "+70%", detail: "Audience engagement" },
            { label: "Deliverables", value: "40+", detail: "System components" },
          ]
    );
    setProjPalette(
      p.brandPalette?.length
        ? p.brandPalette
        : [
            { name: "Archive Alabaster", hex: "#F7F5F0" },
            { name: "Obsidian Ink", hex: "#111110" },
            { name: "Electric Chartreuse", hex: "#D4F82A" },
          ]
    );
  };

  const startNewProjectForm = () => {
    const nextNum = projects.length + 1;
    const nextBadge = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    setSelectedProjectId("new");
    setProjTitle("");
    setProjClient("");
    setProjBadge(nextBadge);
    setProjCategory("BRANDING");
    setProjYear("2025");
    setProjFeatured(true);
    setProjRole("Creative Direction & Brand Identity");
    setProjDisciplines(
      "Brand Strategy / Identity System / Art Direction / Digital Experience"
    );
    setProjSummary("");
    setProjCoverImage("/images/projects/dii-brand.jpg");
    setProjDetailImage("/images/projects/natural-highs.jpg");
    setProjChallenge("");
    setProjApproach("");
    setProjOutcome("");
    setProjDirectorNote("");
    setProjDeliverablesText(
      "Brand Strategy & Architecture\nVisual Identity & Typography System\nCampaign Art Direction\nLiving Brand Guidelines Playbook"
    );
    setProjMetrics([
      {
        label: "System Rollout",
        value: "100%",
        detail: "Adopted across digital and physical brand touchpoints",
      },
      {
        label: "Audience Engagement",
        value: "+92%",
        detail: "Measurable lift in campaign conversion and recall",
      },
      {
        label: "Assets Delivered",
        value: "50+",
        detail: "Modular templates, custom illustrations & UI kit",
      },
    ]);
    setProjPalette([
      { name: "Warm Alabaster", hex: "#F7F5F0" },
      { name: "Obsidian Ink", hex: "#111110" },
      { name: "Electric Chartreuse", hex: "#D4F82A" },
      { name: "Editorial Coral", hex: "#F26B4E" },
    ]);
  };

  if (!isOpen) return null;

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      showToast("Please provide a project title.");
      return;
    }

    setIsSaving(true);
    try {
      const deliverables = projDeliverablesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        numberBadge: projBadge || "07",
        title: projTitle.trim(),
        client: projClient.trim() || "Brand Partner",
        category: projCategory,
        year: projYear,
        featured: projFeatured,
        role: projRole,
        disciplines: projDisciplines,
        summary:
          projSummary ||
          "Strategic brand identity and visual system crafted for enduring impact.",
        coverImage: projCoverImage,
        detailHeroImage: projDetailImage || projCoverImage,
        secondaryImage: projCoverImage,
        challenge:
          projChallenge ||
          "Creating a cohesive visual system that humanizes strategy and scales effortlessly across every channel.",
        approach:
          projApproach ||
          "Developed a modular typographic, color, and art direction system grounded in human emotion and strategic clarity.",
        outcome:
          projOutcome ||
          "Adopted across internal and customer-facing channels with measurable brand lift.",
        directorNote:
          projDirectorNote ||
          "Good design creates a feeling before it creates a thought.",
        impactMetrics: projMetrics,
        brandPalette: projPalette,
        deliverables,
      };

      const isNew = selectedProjectId === "new";
      const url = isNew ? "/api/projects" : `/api/projects/${selectedProjectId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save case study");

      onProjectSaved(data.project, isNew);
      setSelectedProjectId(data.project.id);
      showToast(
        isNew
          ? `Published new case study "${data.project.title}"!`
          : `Saved changes to "${data.project.title}"!`
      );
    } catch (err) {
      console.error(err);
      showToast("Error saving project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCurrentProject = async () => {
    if (selectedProjectId === "new") return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${selectedProjectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const deletedId = Number(selectedProjectId);
        onProjectDeleted(deletedId);
        const remaining = projects.filter((p) => p.id !== deletedId);
        if (remaining.length > 0) {
          loadProjectIntoForm(remaining[0]);
        } else {
          startNewProjectForm();
        }
        showToast("Case study removed from portfolio.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profForm),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        onProfileUpdated(data.profile);
        showToast("Director Profile & Narrative saved to PostgreSQL!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAccolade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accTitle.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/accolades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: accYear,
          title: accTitle,
          organization: accOrg || "Design Recognition",
          projectRef: accProjectRef || "Selected Work",
          category: accCategory,
        }),
      });
      const data = await res.json();
      if (res.ok && data.accolade) {
        onAccoladeAdded(data.accolade);
        setAccTitle("");
        setAccOrg("");
        setAccProjectRef("");
        showToast("Added new accolade to recognition index!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuote.trim() || !testAuthor.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: testQuote,
          author: testAuthor,
          role: testRole || "Executive Partner",
          company: testCompany || "Brand Client",
          isSpotlight: testSpotlight,
        }),
      });
      const data = await res.json();
      if (res.ok && data.testimonial) {
        onTestimonialAdded(data.testimonial);
        setTestQuote("");
        setTestAuthor("");
        setTestRole("");
        setTestCompany("");
        setTestSpotlight(false);
        showToast("Collaborator endorsement published!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: faqQuestion,
          answer: faqAnswer,
        }),
      });
      const data = await res.json();
      if (res.ok && data.faq) {
        onFaqAdded(data.faq);
        setFaqQuestion("");
        setFaqAnswer("");
        showToast("New FAQ question published!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#111110]/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#F7F5F0] text-[#111110] h-full flex flex-col shadow-2xl border-l border-[#111110]/15 overflow-hidden">
        {/* Studio Header */}
        <div className="px-6 sm:px-8 py-5 bg-[#111110] text-[#F7F5F0] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-xs font-bold flex items-center justify-center">
              SR
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold tracking-[-0.02em]">
                  Director Studio CMS
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#D4F82A]/20 text-[#D4F82A] font-mono text-[10px] uppercase tracking-[0.12em]">
                  Live PostgreSQL Sync
                </span>
              </div>
              <p className="text-xs text-[#F7F5F0]/65">
                Customize case studies, add new work, edit manifesto & accolades, or review client briefs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#D4F82A] hover:text-[#111110] text-xs font-mono uppercase tracking-[0.12em] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Exit Studio</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="px-6 sm:px-8 py-3 bg-[#EFECE6] border-b border-[#111110]/10 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "projects"
                ? "bg-[#111110] text-[#D4F82A] font-semibold"
                : "text-[#6E6C67] hover:text-[#111110]"
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Case Studies ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "profile"
                ? "bg-[#111110] text-[#D4F82A] font-semibold"
                : "text-[#6E6C67] hover:text-[#111110]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile, Bio & Manifesto</span>
          </button>

          <button
            onClick={() => setActiveTab("accolades")}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "accolades"
                ? "bg-[#111110] text-[#D4F82A] font-semibold"
                : "text-[#6E6C67] hover:text-[#111110]"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Accolades ({accolades.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "testimonials"
                ? "bg-[#111110] text-[#D4F82A] font-semibold"
                : "text-[#6E6C67] hover:text-[#111110]"
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Kind Words & FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "inquiries"
                ? "bg-[#111110] text-[#D4F82A] font-semibold"
                : "text-[#6E6C67] hover:text-[#111110]"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Client Briefs ({inquiries.length})</span>
          </button>
        </div>

        {/* Live Toast Banner */}
        {toast && (
          <div className="mx-6 sm:mx-8 mt-4 px-4 py-3 rounded-xl bg-[#D4F82A] text-[#111110] font-mono text-xs font-semibold flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {toast}
            </span>
          </div>
        )}

        {/* Main Scrollable Studio Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: CASE STUDIES & PROJECTS EDITOR */}
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar: Project Selector + New Button */}
              <div className="lg:col-span-4 space-y-3">
                <button
                  type="button"
                  onClick={startNewProjectForm}
                  className={`w-full p-3.5 rounded-2xl border font-mono text-xs uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedProjectId === "new"
                      ? "bg-[#D4F82A] text-[#111110] border-[#111110] font-bold shadow-sm"
                      : "bg-white text-[#111110] border-[#111110]/20 hover:bg-[#D4F82A]/40"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Case Study</span>
                </button>

                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6E6C67] pt-2">
                  EXISTING PORTFOLIO WORKS
                </div>

                <div className="space-y-2">
                  {projects.map((p) => {
                    const isSelected = selectedProjectId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => loadProjectIntoForm(p)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-[#111110] text-[#F7F5F0] border-[#111110]"
                            : "bg-white/80 text-[#111110] border-[#111110]/10 hover:border-[#111110]/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                isSelected
                                  ? "bg-[#D4F82A] text-[#111110]"
                                  : "bg-[#EFECE6] text-[#111110]"
                              }`}
                            >
                              {p.numberBadge}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider opacity-70 truncate">
                              {p.client}
                            </span>
                          </div>
                          <div className="font-display font-bold text-sm truncate mt-1">
                            {p.title}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] uppercase opacity-60 shrink-0">
                          {p.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Comprehensive Case Study Editor Form */}
              <form
                onSubmit={handleSaveProject}
                className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#111110]/10 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#111110]/10">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#F26B4E]">
                      {selectedProjectId === "new"
                        ? "CREATING NEW CASE STUDY"
                        : `EDITING CASE STUDY #${projBadge}`}
                    </span>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">
                      {projTitle || "Untitled Case Study"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedProjectId !== "new" && (
                      <button
                        type="button"
                        onClick={handleDeleteCurrentProject}
                        className="px-3.5 py-2 rounded-full border border-red-300 text-red-700 hover:bg-red-50 font-mono text-xs uppercase tracking-[0.1em] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-full bg-[#111110] text-[#D4F82A] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>
                        {isSaving
                          ? "Saving..."
                          : selectedProjectId === "new"
                          ? "Publish Case Study"
                          : "Save Changes"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Core Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      BADGE #
                    </label>
                    <input
                      type="text"
                      value={projBadge}
                      onChange={(e) => setProjBadge(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm font-mono"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. Lyst Fashion Index Rebrand"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm font-medium"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      CLIENT / PARTNER *
                    </label>
                    <input
                      type="text"
                      required
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      placeholder="e.g. Lyst / Google / eHealth"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    >
                      <option value="BRANDING">BRANDING</option>
                      <option value="CAMPAIGNS">CAMPAIGNS</option>
                      <option value="PRODUCT & UI">PRODUCT & UI</option>
                      <option value="EDITORIAL">EDITORIAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      YEAR
                    </label>
                    <input
                      type="text"
                      value={projYear}
                      onChange={(e) => setProjYear(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={projFeatured}
                        onChange={(e) => setProjFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#111110]"
                      />
                      <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#111110]">
                        Pin to Selected Work (2x2 Grid)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Role & Disciplines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      SARAH&apos;S ROLE
                    </label>
                    <input
                      type="text"
                      value={projRole}
                      onChange={(e) => setProjRole(e.target.value)}
                      placeholder="Lead Creative Director"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      DISCIPLINES (SLASH SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={projDisciplines}
                      onChange={(e) => setProjDisciplines(e.target.value)}
                      placeholder="Brand Strategy / Identity Design / Art Direction"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                </div>

                {/* Executive Deck Summary */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                    EXECUTIVE SUMMARY (DISPLAYED BELOW CASE STUDY HEADLINE)
                  </label>
                  <textarea
                    rows={2}
                    value={projSummary}
                    onChange={(e) => setProjSummary(e.target.value)}
                    placeholder="Building a diversity and inclusion brand identity from the ground up..."
                    className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                </div>

                {/* Artwork Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F5F0] border border-[#111110]/10">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                      GRID COVER ARTWORK
                    </label>
                    <select
                      value={projCoverImage}
                      onChange={(e) => setProjCoverImage(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#111110]/15 text-xs mb-2"
                    >
                      {PRESET_ARTWORK.map((art) => (
                        <option key={art.url} value={art.url}>
                          {art.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={projCoverImage}
                      onChange={(e) => setProjCoverImage(e.target.value)}
                      placeholder="Or custom image URL..."
                      className="w-full h-9 px-3 rounded-lg bg-white border border-[#111110]/10 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                      CASE STUDY HERO PLATE
                    </label>
                    <select
                      value={projDetailImage}
                      onChange={(e) => setProjDetailImage(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#111110]/15 text-xs mb-2"
                    >
                      {PRESET_ARTWORK.map((art) => (
                        <option key={art.url} value={art.url}>
                          {art.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={projDetailImage}
                      onChange={(e) => setProjDetailImage(e.target.value)}
                      placeholder="Or custom hero image URL..."
                      className="w-full h-9 px-3 rounded-lg bg-white border border-[#111110]/10 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* 3-Part Case Study Narrative matching Screenshot 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#111110] font-semibold mb-1">
                      01 / THE CHALLENGE
                    </label>
                    <textarea
                      rows={3}
                      value={projChallenge}
                      onChange={(e) => setProjChallenge(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#111110] font-semibold mb-1">
                      02 / THE APPROACH
                    </label>
                    <textarea
                      rows={3}
                      value={projApproach}
                      onChange={(e) => setProjApproach(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#111110] font-semibold mb-1">
                      03 / THE OUTCOME
                    </label>
                    <textarea
                      rows={2}
                      value={projOutcome}
                      onChange={(e) => setProjOutcome(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E] font-semibold mb-1">
                      CREATIVE DIRECTOR&apos;S BEHIND-THE-SCENES NOTE
                    </label>
                    <textarea
                      rows={2}
                      value={projDirectorNote}
                      onChange={(e) => setProjDirectorNote(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                </div>

                {/* Impact Metrics Editor */}
                <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#111110]/10 space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67]">
                    CLIENT IMPACT & OUTCOME METRICS (3 KPI CARDS)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {projMetrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-[#111110]/10 space-y-2"
                      >
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => {
                            const next = [...projMetrics];
                            next[idx] = { ...next[idx], value: e.target.value };
                            setProjMetrics(next);
                          }}
                          placeholder="100% / +64%"
                          className="w-full px-2.5 py-1 rounded bg-[#F7F5F0] font-display font-bold text-base"
                        />
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => {
                            const next = [...projMetrics];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setProjMetrics(next);
                          }}
                          placeholder="Metric Label"
                          className="w-full px-2.5 py-1 rounded bg-[#F7F5F0] font-mono text-[11px]"
                        />
                        <input
                          type="text"
                          value={m.detail}
                          onChange={(e) => {
                            const next = [...projMetrics];
                            next[idx] = { ...next[idx], detail: e.target.value };
                            setProjMetrics(next);
                          }}
                          placeholder="Context detail"
                          className="w-full px-2.5 py-1 rounded bg-[#F7F5F0] text-xs text-[#6E6C67]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables & Brand Palette */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      KEY DELIVERABLES (ONE PER LINE)
                    </label>
                    <textarea
                      rows={4}
                      value={projDeliverablesText}
                      onChange={(e) => setProjDeliverablesText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                      BRAND PALETTE SWATCHES
                    </label>
                    <div className="space-y-2">
                      {projPalette.map((sw, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={sw.hex}
                            onChange={(e) => {
                              const next = [...projPalette];
                              next[idx] = { ...next[idx], hex: e.target.value };
                              setProjPalette(next);
                            }}
                            className="w-8 h-8 rounded cursor-pointer border border-black/15"
                          />
                          <input
                            type="text"
                            value={sw.name}
                            onChange={(e) => {
                              const next = [...projPalette];
                              next[idx] = { ...next[idx], name: e.target.value };
                              setProjPalette(next);
                            }}
                            className="flex-1 h-8 px-2.5 rounded-lg bg-[#F7F5F0] border border-[#111110]/15 text-xs"
                          />
                          <span className="font-mono text-[11px] text-[#6E6C67] w-16">
                            {sw.hex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROFILE, MANIFESTO & ABOUT EDITOR */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#111110]/10 space-y-6 max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#111110]/10">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                    CREATIVE DIRECTOR IDENTITY
                  </span>
                  <h3 className="font-display text-2xl font-bold">
                    Edit Headlines, Perspective & About Narrative
                  </h3>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-[#111110] text-[#D4F82A] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                    ROLE EYEBROW
                  </label>
                  <input
                    type="text"
                    value={profForm.roleTagline}
                    onChange={(e) =>
                      setProfForm({ ...profForm, roleTagline: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                    AVAILABILITY STATUS PILL
                  </label>
                  <input
                    type="text"
                    value={profForm.availabilityStatus}
                    onChange={(e) =>
                      setProfForm({
                        ...profForm,
                        availabilityStatus: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                  HERO DISPLAY STATEMENT
                </label>
                <textarea
                  rows={2}
                  value={profForm.heroHeadline}
                  onChange={(e) =>
                    setProfForm({ ...profForm, heroHeadline: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm font-display font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1">
                  HERO SUBHEADLINE
                </label>
                <textarea
                  rows={2}
                  value={profForm.heroSubheadline}
                  onChange={(e) =>
                    setProfForm({
                      ...profForm,
                      heroSubheadline: e.target.value,
                    })
                  }
                  className="w-full p-3.5 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F5F0] space-y-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                  01 / PERSPECTIVE SECTION
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                      LEAD LINE
                    </label>
                    <input
                      type="text"
                      value={profForm.perspectiveTitle}
                      onChange={(e) =>
                        setProfForm({
                          ...profForm,
                          perspectiveTitle: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                      CORAL HIGHLIGHT LINE
                    </label>
                    <input
                      type="text"
                      value={profForm.perspectiveHighlight}
                      onChange={(e) =>
                        setProfForm({
                          ...profForm,
                          perspectiveHighlight: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#111110]/15 text-sm text-[#F26B4E] font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                    PERSPECTIVE MANIFESTO COPY
                  </label>
                  <textarea
                    rows={3}
                    value={profForm.perspectiveBody}
                    onChange={(e) =>
                      setProfForm({
                        ...profForm,
                        perspectiveBody: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white border border-[#111110]/15 text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F5F0] space-y-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                  ABOUT PAGE (&quot;CURIOSITY IS THE SPECIALTY&quot;)
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                    FULL BIO NARRATIVE
                  </label>
                  <textarea
                    rows={4}
                    value={profForm.aboutBio}
                    onChange={(e) =>
                      setProfForm({ ...profForm, aboutBio: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white border border-[#111110]/15 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                      THE SHORT VERSION
                    </label>
                    <textarea
                      rows={3}
                      value={profForm.shortVersion}
                      onChange={(e) =>
                        setProfForm({
                          ...profForm,
                          shortVersion: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl bg-white border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                      THE TOOLKIT
                    </label>
                    <textarea
                      rows={3}
                      value={profForm.toolkit}
                      onChange={(e) =>
                        setProfForm({ ...profForm, toolkit: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-white border border-[#111110]/15 text-sm"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: ACCOLADES & AWARDS */}
          {activeTab === "accolades" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={handleAddAccolade}
                className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#111110]/10 space-y-4 h-fit"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                  ADD NEW RECOGNITION / AWARD
                </div>
                <h3 className="font-display text-xl font-bold">
                  Showcase Accolades
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                      YEAR
                    </label>
                    <input
                      type="text"
                      value={accYear}
                      onChange={(e) => setAccYear(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                      DISCIPLINE CATEGORY
                    </label>
                    <input
                      type="text"
                      value={accCategory}
                      onChange={(e) => setAccCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                    AWARD / HONORS TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={accTitle}
                    onChange={(e) => setAccTitle(e.target.value)}
                    placeholder="e.g. Webby Honoree — Best Brand Identity"
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                    ORGANIZATION / PUBLICATION
                  </label>
                  <input
                    type="text"
                    value={accOrg}
                    onChange={(e) => setAccOrg(e.target.value)}
                    placeholder="e.g. Communication Arts / AIGA / Fast Company"
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#6E6C67] mb-1">
                    RECOGNIZED WORK / CLIENT
                  </label>
                  <input
                    type="text"
                    value={accProjectRef}
                    onChange={(e) => setAccProjectRef(e.target.value)}
                    placeholder="e.g. DI&I Brand Development — eHealth"
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-full bg-[#111110] text-[#D4F82A] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                >
                  + Add Accolade
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                {accolades.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-5 rounded-2xl bg-white border border-[#111110]/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-[#6E6C67]">
                        <span className="px-2 py-0.5 rounded bg-[#D4F82A] text-[#111110] font-bold">
                          {acc.year}
                        </span>
                        <span>{acc.organization}</span>
                        <span>•</span>
                        <span className="text-[#F26B4E]">{acc.category}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-[#111110] mt-1">
                        {acc.title}
                      </h4>
                      <p className="text-xs text-[#6E6C67] mt-0.5">
                        Work: {acc.projectRef}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/accolades?id=${acc.id}`, {
                          method: "DELETE",
                        });
                        if (res.ok) {
                          onAccoladeDeleted(acc.id);
                          showToast("Removed accolade.");
                        }
                      }}
                      className="p-2 rounded-full text-[#6E6C67] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete accolade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TESTIMONIALS ("KIND WORDS") & FAQS */}
          {activeTab === "testimonials" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <form
                  onSubmit={handleAddTestimonial}
                  className="bg-white rounded-3xl p-6 border border-[#111110]/10 space-y-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                    04 / KIND WORDS ENDORSEMENT
                  </div>
                  <h3 className="font-display text-lg font-bold">
                    Add Collaborator or Client Quote
                  </h3>
                  <textarea
                    rows={3}
                    required
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    placeholder="Quote from executive, product marketing director, or founder..."
                    className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={testAuthor}
                      onChange={(e) => setTestAuthor(e.target.value)}
                      placeholder="Author Name *"
                      className="h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                    <input
                      type="text"
                      value={testCompany}
                      onChange={(e) => setTestCompany(e.target.value)}
                      placeholder="Company (e.g. Google)"
                      className="h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={testRole}
                    onChange={(e) => setTestRole(e.target.value)}
                    placeholder="Title (e.g. VP of Brand Marketing)"
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                  <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testSpotlight}
                      onChange={(e) => setTestSpotlight(e.target.checked)}
                      className="w-4 h-4 accent-[#111110]"
                    />
                    <span>Feature on #D4F82A Chartreuse Spotlight Banner</span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-2.5 rounded-full bg-[#111110] text-[#D4F82A] font-mono text-xs uppercase tracking-[0.12em] font-semibold cursor-pointer"
                  >
                    + Publish Endorsement
                  </button>
                </form>

                <form
                  onSubmit={handleAddFaq}
                  className="bg-white rounded-3xl p-6 border border-[#111110]/10 space-y-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                    05 / A FEW ANSWERS (FAQ)
                  </div>
                  <h3 className="font-display text-lg font-bold">
                    Add New Question & Answer
                  </h3>
                  <input
                    type="text"
                    required
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="e.g. How do you structure brand retainers?"
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                  <textarea
                    rows={3}
                    required
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Detailed answer..."
                    className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#111110]/15 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-2.5 rounded-full bg-[#111110] text-[#F7F5F0] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs uppercase tracking-[0.12em] font-semibold cursor-pointer transition-colors"
                  >
                    + Add FAQ Item
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6C67]">
                    COLLABORATOR QUOTES (CLICK STAR TO SET CHARTREUSE SPOTLIGHT)
                  </div>
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        t.isSpotlight
                          ? "bg-[#D4F82A]/35 border-[#111110]"
                          : "bg-white border-[#111110]/10"
                      }`}
                    >
                      <p className="font-display text-sm font-semibold text-[#111110] leading-relaxed">
                        “{t.quote}”
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="font-mono text-xs text-[#6E6C67]">
                          <strong className="text-[#111110]">{t.author}</strong> —{" "}
                          {t.role}
                          {t.company ? `, ${t.company}` : ""}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              const res = await fetch("/api/testimonials", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  id: t.id,
                                  isSpotlight: true,
                                }),
                              });
                              if (res.ok) {
                                onTestimonialSpotlightChanged(t.id);
                                showToast(
                                  `Set ${t.author}'s quote as the homepage Spotlight!`
                                );
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase inline-flex items-center gap-1 cursor-pointer ${
                              t.isSpotlight
                                ? "bg-[#111110] text-[#D4F82A]"
                                : "bg-[#EFECE6] text-[#6E6C67] hover:text-[#111110]"
                            }`}
                          >
                            <Star className="w-3 h-3" />
                            <span>
                              {t.isSpotlight ? "Spotlight Active" : "Make Spotlight"}
                            </span>
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `/api/testimonials?id=${t.id}`,
                                { method: "DELETE" }
                              );
                              if (res.ok) {
                                onTestimonialDeleted(t.id);
                                showToast("Deleted quote.");
                              }
                            }}
                            className="p-1.5 text-[#6E6C67] hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-[#111110]/10">
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6C67]">
                    CURIOUS MINDS FAQ ITEMS ({faqs.length})
                  </div>
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-2xl bg-white border border-[#111110]/10 flex items-start justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-display font-bold text-sm">
                          {f.question}
                        </h4>
                        <p className="text-xs text-[#6E6C67] mt-1 leading-relaxed">
                          {f.answer}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          const res = await fetch(`/api/faqs?id=${f.id}`, {
                            method: "DELETE",
                          });
                          if (res.ok) {
                            onFaqDeleted(f.id);
                            showToast("Removed FAQ item.");
                          }
                        }}
                        className="p-1.5 text-[#6E6C67] hover:text-red-600 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CLIENT BRIEF INBOX */}
          {activeTab === "inquiries" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F26B4E]">
                    PROSPECTIVE CLIENT PIPELINE
                  </span>
                  <h3 className="font-display text-2xl font-bold">
                    Submitted Project Briefs & Inquiries ({inquiries.length})
                  </h3>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-[#111110]/10 text-center text-[#6E6C67]">
                  No project briefs in the inbox yet.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-3xl bg-white border border-[#111110]/10 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-[11px] font-bold uppercase">
                          {inq.status}
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-lg text-[#111110]">
                            {inq.name}{" "}
                            <span className="text-[#6E6C67] font-normal">
                              ({inq.company})
                            </span>
                          </h4>
                          <div className="font-mono text-xs text-[#6E6C67]">
                            {inq.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const res = await fetch("/api/inquiries", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                id: inq.id,
                                status: newStatus,
                              }),
                            });
                            const data = await res.json();
                            if (res.ok && data.inquiry) {
                              onInquiryUpdated(data.inquiry);
                              showToast(`Updated brief status to ${newStatus}`);
                            }
                          }}
                          className="h-9 px-3 rounded-full bg-[#F7F5F0] border border-[#111110]/15 font-mono text-xs"
                        >
                          <option value="New Brief">New Brief</option>
                          <option value="Priority Brief">Priority Brief</option>
                          <option value="Discovery Scheduled">
                            Discovery Scheduled
                          </option>
                          <option value="Proposal Sent">Proposal Sent</option>
                        </select>

                        <button
                          onClick={async () => {
                            const res = await fetch(
                              `/api/inquiries?id=${inq.id}`,
                              { method: "DELETE" }
                            );
                            if (res.ok) {
                              onInquiryDeleted(inq.id);
                              showToast("Removed inquiry from inbox.");
                            }
                          }}
                          className="p-2 rounded-full text-[#6E6C67] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      <span className="px-3 py-1 rounded-lg bg-[#F7F5F0] text-[#111110]">
                        <strong>Scope:</strong> {inq.scopes}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-[#F7F5F0] text-[#111110]">
                        <strong>Budget:</strong> {inq.budgetRange}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-[#F7F5F0] text-[#111110]">
                        <strong>Timeline:</strong> {inq.timeline}
                      </span>
                    </div>

                    <p className="text-sm text-[#111110]/85 bg-[#F7F5F0] p-4 rounded-2xl leading-relaxed">
                      “{inq.message}”
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
