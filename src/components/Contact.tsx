import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

const PROJECT_TYPES = [
  "Brand identity",
  "Campaign",
  "Web & digital",
  "Creative leadership",
  "Something else",
];

const BUDGETS = ["Under $25k", "$25k – $50k", "$50k – $100k", "$100k – $150k", "$150k+", "Not sure yet"];

export default function Contact({
  profile,
  onSaved,
}: {
  profile: Profile | null;
  onSaved: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
    website: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setErrorMsg("");
    const { error } = await supabase.from("inquiries").insert({
      name: form.name.trim().slice(0, 120),
      email: form.email.trim().slice(0, 200),
      company: form.company.trim().slice(0, 160),
      project_type: form.projectType.slice(0, 60),
      budget: form.budget.slice(0, 40),
      message: form.message.trim().slice(0, 5000),
    });
    if (error) {
      setErrorMsg(error.message);
      setState("error");
      return;
    }
    setState("done");
    onSaved();
  };

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="dark-panel" data-reveal>
          <div style={{ display: "grid", gap: 44, gridTemplateColumns: "minmax(0,1fr)", minHeight: 0 }}>
            <style>{`@media (min-width: 880px){ .contact-grid { grid-template-columns: 1fr 1.15fr !important; } }`}</style>
            <div className="contact-grid" style={{ display: "grid", gap: 44, gridTemplateColumns: "minmax(0,1fr)" }}>
              <div>
                <p className="eyebrow" style={{ color: "rgba(245,244,239,0.55)" }}>04 — Contact</p>
                <h2 className="h2" style={{ margin: "12px 0 18px" }}>
                  Let's make something{" "}
                  <span className="serif" style={{ color: "var(--accent)" }}>worth remembering.</span>
                </h2>
                {profile && (
                  <>
                    <p style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 14.5, opacity: 0.85 }}>
                      <span className="dot" data-s={profile.availability} />
                      {profile.availability_text || profile.availability}
                    </p>
                    <p style={{ marginTop: 18 }}>
                      <a
                        href={`mailto:${profile.email}`}
                        style={{ color: "var(--chartreuse)", fontWeight: 600, fontSize: 15 }}
                      >
                        {profile.email}
                      </a>
                    </p>
                  </>
                )}
              </div>
              <div>
                {state === "done" ? (
                  <div style={{ padding: "30px 0" }}>
                    <p className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                      Message received.
                    </p>
                    <p style={{ opacity: 0.75, marginTop: 8 }}>You'll get a reply within two business days.</p>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                      <div>
                        <label className="field-label" htmlFor="c-name">Name</label>
                        <input id="c-name" className="field" value={form.name} onChange={set("name")} required placeholder="Your name" />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="c-email">Email</label>
                        <input id="c-email" type="email" className="field" value={form.email} onChange={set("email")} required placeholder="you@company.com" />
                      </div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <label className="field-label" htmlFor="c-company">Company</label>
                      <input id="c-company" className="field" value={form.company} onChange={set("company")} placeholder="Company or project" />
                    </div>
                    <div style={{ marginTop: 18 }}>
                      <span className="field-label">Project type</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {PROJECT_TYPES.map((t) => (
                          <button
                            type="button"
                            key={t}
                            className={`choice${form.projectType === t ? " on" : ""}`}
                            onClick={() => setForm((f) => ({ ...f, projectType: t }))}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: 18, display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                      <div>
                        <label className="field-label" htmlFor="c-budget">Budget</label>
                        <select id="c-budget" className="field" value={form.budget} onChange={set("budget")}>
                          <option value="">Select…</option>
                          {BUDGETS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ alignSelf: "end" }} />
                    </div>
                    <div style={{ marginTop: 18 }}>
                      <label className="field-label" htmlFor="c-msg">About the project</label>
                      <textarea
                        id="c-msg"
                        className="field"
                        rows={4}
                        value={form.message}
                        onChange={set("message")}
                        required
                        placeholder="What are you making, and who is it for?"
                      />
                    </div>
                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={set("website")}
                      style={{ position: "absolute", left: -9999, width: 1, height: 1 }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                    {state === "error" && (
                      <p style={{ color: "#ffb4a6", marginTop: 14, fontSize: 14 }}>
                        Something went wrong — {errorMsg || "please try again."}
                      </p>
                    )}
                    <button className="btn btn-light" style={{ marginTop: 22 }} disabled={state === "sending"}>
                      {state === "sending" ? "Sending…" : "Send it over"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
