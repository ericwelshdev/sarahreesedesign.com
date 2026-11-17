"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RESOURCES } from "@/lib/studio-schemas";
import { projectCompleteness } from "@/lib/completeness";
import { FieldsGrid, type Row } from "./FormEngine";

type Sel = number | "new" | null;

function cloneRow<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export default function ResourceManager({ resource, initial, singleton = false }: { resource: string; initial: Row[]; singleton?: boolean }) {
  const config = RESOURCES[resource];
  const [rows, setRows] = useState<Row[]>(initial);
  const [sel, setSel] = useState<Sel>(initial[0] ? (initial[0].id as number) : null);
  const [draft, setDraft] = useState<Row>(initial[0] ? cloneRow(initial[0]) : {});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const original = sel && sel !== "new" ? rows.find((r) => r.id === sel) : null;
  const dirty = useMemo(() => (sel === "new" ? true : original ? JSON.stringify(original) !== JSON.stringify(draft) : false), [sel, original, draft]);

  const flash = useCallback((kind: "ok" | "error", text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const select = (id: number) => {
    if (dirty && !confirm("You have unsaved changes. Discard them?")) return;
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setSel(id);
    setDraft(cloneRow(row));
    if (window.innerWidth < 1024) setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const create = () => {
    if (dirty && !confirm("You have unsaved changes. Discard them?")) return;
    setSel("new");
    setDraft(cloneRow(config.defaults));
    if (window.innerWidth < 1024) setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const sortRows = useCallback(
    (list: Row[]) =>
      [...list].sort((a, b) =>
        config.sortKey === "sortOrder" ? (Number(a.sortOrder) - Number(b.sortOrder)) || (Number(a.id) - Number(b.id)) : Number(b.id) - Number(a.id),
      ),
    [config.sortKey],
  );

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const isNew = sel === "new";
      const res = await fetch(isNew ? `/api/studio/${resource}` : `/api/studio/${resource}/${sel}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      const row = data.row as Row;
      setRows((prev) => sortRows(isNew ? [...prev, row] : prev.map((r) => (r.id === row.id ? row : r))));
      setSel(row.id as number);
      setDraft(cloneRow(row));
      flash("ok", singleton ? "Saved. The live site is updated." : isNew ? "Created." : "Saved. The live site is updated.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }, [saving, sel, resource, draft, sortRows, flash, singleton]);

  const remove = async () => {
    if (sel === "new" || sel === null) return;
    if (!confirm(`Delete this ${config.singular}? This can't be undone.`)) return;
    const res = await fetch(`/api/studio/${resource}/${sel}`, { method: "DELETE" });
    if (!res.ok) return flash("error", "Could not delete");
    const next = rows.filter((r) => r.id !== sel);
    setRows(next);
    if (next[0]) {
      setSel(next[0].id as number);
      setDraft(cloneRow(next[0]));
    } else {
      setSel(null);
      setDraft({});
    }
    flash("ok", "Deleted.");
  };

  // Cmd/Ctrl+S to save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (sel !== null && dirty) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, sel, dirty]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const filtered = rows.filter((r) => !query || JSON.stringify([r[config.titleKey], r[config.subtitleKey ?? ""]]).toLowerCase().includes(query.toLowerCase()));
  const title = String(draft[config.titleKey] ?? "") || (sel === "new" ? `New ${config.singular}` : config.plural);
  const completeness = resource === "projects" && sel !== null ? projectCompleteness(draft) : null;
  const previewHref = config.previewPath && config.previewKey && draft[config.previewKey] && sel !== "new" ? `${config.previewPath}${draft[config.previewKey]}` : null;

  return (
    <div className={singleton ? "" : "grid gap-6 lg:grid-cols-[320px_1fr]"}>
      {!singleton && (
        <aside className="lg:sticky lg:top-[132px] lg:max-h-[calc(100vh-150px)] lg:self-start lg:overflow-y-auto">
          <div className="flex gap-2">
            {config.canCreate && (
              <button type="button" className="st-btn st-btn-primary flex-1" onClick={create}>+ New {config.singular}</button>
            )}
          </div>
          {rows.length > 8 && (
            <input className="st-input mt-3" placeholder={`Search ${config.plural.toLowerCase()}…`} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
          )}
          <div className="mt-3 grid gap-1">
            {sel === "new" && (
              <div className="st-item" aria-current="true"><span className="font-medium">New {config.singular}</span></div>
            )}
            {filtered.map((r) => {
              const badge = config.badgeKey ? String(r[config.badgeKey] ?? "") : "";
              const unpublished = r.published === false;
              const isNewInbox = resource === "inquiries" && r.status === "new";
              return (
                <button key={String(r.id)} type="button" className="st-item" aria-current={sel === r.id} onClick={() => select(r.id as number)}>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium">{String(r[config.titleKey] ?? "Untitled")}</span>
                    {config.subtitleKey && <span className="block truncate text-xs opacity-60">{String(r[config.subtitleKey] ?? "")}</span>}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-wider opacity-70">
                    {unpublished && <span className="rounded-full bg-black/10 px-2 py-0.5">Draft</span>}
                    {isNewInbox && <span className="rounded-full px-2 py-0.5 text-white" style={{ background: "#ff5b3a" }}>New</span>}
                    {badge && !isNewInbox && <span>{badge}</span>}
                  </span>
                </button>
              );
            })}
            {rows.length === 0 && sel !== "new" && <p className="p-3 text-sm" style={{ color: "#6e6e73" }}>Nothing here yet.</p>}
          </div>
        </aside>
      )}

      <div ref={editorRef} className="st-card scroll-mt-32 p-5 md:p-8">
        {sel === null ? (
          <p style={{ color: "#6e6e73" }}>{config.canCreate ? `Create your first ${config.singular} to get started.` : "Nothing to show yet."}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff5b3a" }}>
                  {sel === "new" ? `New ${config.singular}` : singleton ? "Editing" : `Editing ${config.singular}`}
                </p>
                <h2 className="mt-1 truncate text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {previewHref && <a className="st-btn" href={previewHref} target="_blank" rel="noopener noreferrer">View live ↗</a>}
                {config.canDelete && sel !== "new" && <button type="button" className="st-btn st-btn-danger" onClick={remove}>Delete</button>}
                <button type="button" className="st-btn st-btn-primary" onClick={save} disabled={saving || (!dirty && sel !== "new")}>
                  {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
                </button>
              </div>
            </div>

            {completeness && (
              <div className="mt-6 rounded-2xl p-4" style={{ background: "#f5f5f7" }}>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Case study completeness</span>
                  <span className="tabular-nums">{completeness.percent}%</span>
                </div>
                <div className="st-meter mt-2"><i style={{ width: `${completeness.percent}%` }} /></div>
                {completeness.missing.length > 0 && (
                  <p className="st-hint">Clients look for: {completeness.missing.join(" · ")}</p>
                )}
              </div>
            )}

            <div className="mt-6">
              {config.sections.map((sec, i) => (
                <details key={sec.id} className="st-sec" open={config.sections.length === 1 || i === 0}>
                  <summary>{sec.title}</summary>
                  <div className="pb-8">
                    {sec.description && <p className="mb-5 max-w-[70ch] text-sm" style={{ color: "#6e6e73" }}>{sec.description}</p>}
                    <FieldsGrid fields={sec.fields} value={draft} onChange={setDraft} />
                  </div>
                </details>
              ))}
            </div>
          </>
        )}
      </div>

      {toast && <div className="st-toast" data-kind={toast.kind === "error" ? "error" : "ok"} role="status">{toast.text}</div>}
    </div>
  );
}
