"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowUpRight, CheckCircle2, Sparkles, Mail } from "lucide-react";
import { Inquiry } from "@/types/portfolio";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContext?: string;
  email: string;
  onInquiryCreated: (inquiry: Inquiry) => void;
}

const SCOPE_OPTIONS = [
  "Brand Identity & System",
  "Creative Direction",
  "Campaign & Art Direction",
  "Executive Keynote Architecture",
  "Digital Product / UX/UI",
  "Editorial & Print System",
];

const BUDGET_OPTIONS = [
  "$15k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+ Enterprise",
  "Advisory Retainer",
];

const TIMELINE_OPTIONS = [
  "Immediate (2–4 Weeks)",
  "Q2 Launch (6–8 Weeks)",
  "Q3 Strategic Initiative",
  "Ongoing Partnership",
];

export default function ConversationModal({
  isOpen,
  onClose,
  defaultContext = "",
  email,
  onInquiryCreated,
}: ConversationModalProps) {
  const [name, setName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "Brand Identity & System",
    "Creative Direction",
  ]);
  const [budgetRange, setBudgetRange] = useState("$25k – $50k");
  const [timeline, setTimeline] = useState("Q2 Launch (6–8 Weeks)");
  const [message, setMessage] = useState(defaultContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (defaultContext) {
      setMessage(defaultContext);
    }
  }, [defaultContext]);

  if (!isOpen) return null;

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !clientEmail.trim()) {
      setErrorMsg("Please enter your name and email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: clientEmail,
          company: company || "Independent Partner",
          scopes: selectedScopes.join(", ") || "Brand Direction",
          budgetRange,
          timeline,
          message:
            message ||
            "Looking to collaborate on an upcoming brand and creative direction initiative.",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      if (data.inquiry) {
        onInquiryCreated(data.inquiry);
      }
      setSubmittedSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Could not send project brief."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setName("");
    setClientEmail("");
    setCompany("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111110]/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#F7F5F0] text-[#111110] border border-[#111110]/15 shadow-2xl p-6 sm:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#111110]/10">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D4F82A] text-[#111110] font-mono text-[11px] font-bold flex items-center justify-center">
              SR
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#6E6C67]">
              START A CONVERSATION / PROJECT BRIEF
            </span>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full border border-[#111110]/15 flex items-center justify-center hover:bg-[#111110] hover:text-[#F7F5F0] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-14 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4F82A] text-[#111110] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#F26B4E]">
                BRIEF RECEIVED & SAVED TO STUDIO
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
                Let’s make something worth remembering.
              </h3>
              <p className="text-[#6E6C67] max-w-md mx-auto text-sm leading-relaxed">
                Thank you, <span className="text-[#111110] font-medium">{name}</span>. Your project scope ({selectedScopes.join(", ")}) has been logged directly into Sarah’s Director Studio inbox.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-3 rounded-full bg-[#111110] text-[#F7F5F0] font-mono text-xs uppercase tracking-[0.12em] hover:bg-[#D4F82A] hover:text-[#111110] transition-colors cursor-pointer"
              >
                Return to Portfolio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-6 space-y-6">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.035em] leading-[1.05]">
                Tell Sarah about your{" "}
                <span className="text-[#F26B4E]">next chapter.</span>
              </h2>
              <p className="text-sm text-[#6E6C67] mt-2 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#111110]" />
                <span>Direct studio dispatch to {email}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#F26B4E]/15 border border-[#F26B4E] text-xs text-[#111110] font-medium">
                {errorMsg}
              </div>
            )}

            {/* Scope Selector Pills */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6C67] mb-2.5">
                01 / SELECT DISCIPLINES & SCOPE
              </label>
              <div className="flex flex-wrap gap-2">
                {SCOPE_OPTIONS.map((scope) => {
                  const active = selectedScopes.includes(scope);
                  return (
                    <button
                      type="button"
                      key={scope}
                      onClick={() => toggleScope(scope)}
                      className={`px-3.5 py-2 rounded-full font-mono text-xs transition-all cursor-pointer border ${
                        active
                          ? "bg-[#111110] text-[#D4F82A] border-[#111110] font-medium"
                          : "bg-white/70 text-[#111110] border-[#111110]/15 hover:border-[#111110]"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {scope}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#111110]/15 text-sm focus:outline-none focus:border-[#111110]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                  WORK EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#111110]/15 text-sm focus:outline-none focus:border-[#111110]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                  BRAND / ORGANIZATION
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Ventures"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#111110]/15 text-sm focus:outline-none focus:border-[#111110]"
                />
              </div>
            </div>

            {/* Budget & Timeline Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                  02 / ESTIMATED INVESTMENT
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#111110]/15 text-sm focus:outline-none focus:border-[#111110]"
                >
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                  03 / TARGET TIMELINE
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#111110]/15 text-sm focus:outline-none focus:border-[#111110]"
                >
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project Context */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6C67] mb-1.5">
                04 / PROJECT GOALS & CONTEXT
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a bit about what you're building, the challenge you're solving, or the brand transformation you have in mind..."
                className="w-full p-3.5 rounded-xl bg-white border border-[#111110]/15 text-sm focus:outline-none focus:border-[#111110]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#6E6C67]">
                <Sparkles className="w-3.5 h-3.5 text-[#F26B4E]" />
                <span>Typically responds within 24 business hours</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#111110] text-[#F7F5F0] hover:bg-[#D4F82A] hover:text-[#111110] font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? "Sending Brief..." : "Send Project Brief"}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
