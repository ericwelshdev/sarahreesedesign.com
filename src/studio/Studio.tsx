import { useEffect, useMemo, useState } from "react";
import { studioApi } from "./shared";
import { RESOURCES, type ResourceDef } from "./resources";
import Field from "./Field";

type Row = Record<string, unknown>;

const TABS: Array<{ key: "content" | "inbox" | "media" | "profile"; label: string }> = [
  { key: "content", label: "Content" },
  { key: "inbox", label: "Inbox" },
  { key: "media", label: "Media" },
  { key: "profile", label: "Profile" },
];

const CONTENT_KEYS = ["projects", "clients", "accolades", "testimonials", "faqs"] as const;

interface Props {
  onClose: () => void;
  onSignOut: () => void;
}

export default function Studio({ onClose, onSignOut }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("content");
  const [contentTab, setContentTab] = useState<(typeof CONTENT_KEYS)[number]>("projects");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "var(--bg)", overflowY: "auto" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--obsidian)",
          color: "#f5f4ef",
          padding: "14px 26px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          className="nav-logo"
          style={{ width: 36, height: 36, fontSize: 13 }}
          aria-hidden
        >
          SR
        </span>
        <div style={{ marginRight: "auto" }}>
          <p className="font-display" style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>
            Studio
          </p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>Content manager — changes publish instantly</p>
        </div>
        {TABS.map((t) => (
          <button
            key={t.key}
            className="st-tab"
            style={tab === t.key ? { background: "rgba(255,255,255,0.16)", color: "#fff" } : { color: "rgba(245,244,239,0.7)" }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <button className="st-btn st-btn-ghost" style={{ color: "#f5f4ef", borderColor: "rgba(255,255,255,0.3)" }} onClick={onClose}>
          View site
        </button>
        <button
          className="st-btn st-btn-ghost"
          style={{ color: "#f5f4ef", borderColor: "rgba(255,255,255,0.3)" }}
          onClick={() => {
            onSignOut();
            onClose();
          }}
        >
          Sign out
        </button>
      </header>

      <div className="wrap" style={{ paddingBlock: "34px 90px" }}>
        {tab === "content" && (
          <div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 26 }}>
              {CONTENT_KEYS.map((k) => (
                <button key={k} className={`st-tab${contentTab === k ? " on" : ""}`} onClick={() => setContentTab(k)}>
                  {RESOURCES[k].plural}
                </button>
              ))}
            </div>
            <ResourceEditor key={contentTab} def={RESOURCES[contentTab]} />
          </div>
        )}
        {tab === "inbox" && <ResourceEditor def={RESOURCES.inquiries} />}
        {tab === "media" && <MediaLibrary />}
        {tab === "profile" && <ResourceEditor def={RESOURCES.profile} />}
      </div>
    </div>
  );
}

function useToastInternal(): [string | null, boolean, (msg: string, err?: boolean) => void] {
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);
  const show = (msg: string, err?: boolean) => {
    setToast({ msg, err });
    window.setTimeout(() => setToast(null), 2600);
  };
  return [toast?.msg ?? null, toast?.err ?? false, show];
}

export function ResourceEditor({ def }: { def: ResourceDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMsg, toastErr, showToast] = useToastInternal();

  const load = async () => {
    setLoading(true);
    try {
      const data = await studioApi.list(def.key);
      const list = def.key === "profile" ? (data.length ? data : [{}]) : data;
      setRows(list as Row[]);
      if (!def.singleton) {
        const first = (list as Row[])[0];
        setSelectedId(first ? (first.id as string | number) : null);
        setDraft(first ? { ...first } : null);
      } else {
        setSelectedId("profile");
        setDraft({ ...(list[0] as Row) });
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not load", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.key]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => typeof v === "string" && v.toLowerCase().includes(q))
    );
  }, [rows, search]);

  const dirty = useMemo(() => {
    if (!draft || !selectedId) return false;
    const original = rows.find((r) => r.id === selectedId);
    if (!original) return true;
    return JSON.stringify(stripMeta(draft)) !== JSON.stringify(stripMeta(original));
  }, [draft, rows, selectedId]);

  const select = (row: Row) => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setSelectedId(row.id as string | number);
    setDraft({ ...row });
    setIsNew(false);
  };

  const startNew = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setDraft({ [def.titleKey]: "" });
    setIsNew(true);
    setSelectedId(null);
  };

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    try {
      if (isNew) {
        const created = await studioApi.create(def.key, draft);
        setRows((rs) => [...rs, created as Row]);
        setSelectedId((created as Row).id as string | number);
        setDraft({ ...(created as Row) });
        setIsNew(false);
      } else if (def.singleton) {
        const updated = await studioApi.update("profile", 1, draft);
        setDraft({ ...(updated as Row) });
        setRows([{ ...(updated as Row) }]);
      } else {
        const updated = await studioApi.update(def.key, selectedId as string | number, draft);
        setRows((rs) => rs.map((r) => (r.id === updated.id ? (updated as Row) : r)));
        setDraft({ ...(updated as Row) });
      }
      showToast("Saved — the live site is updated.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Save failed", true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedId || isNew) return;
    if (!window.confirm(`Delete this ${def.singular.toLowerCase()}? This can't be undone.`)) return;
    try {
      await studioApi.remove(def.key, selectedId);
      const remaining = rows.filter((r) => r.id !== selectedId);
      setRows(remaining);
      const first = remaining[0];
      setSelectedId(first ? (first.id as string | number) : null);
      setDraft(first ? { ...first } : null);
      showToast("Deleted.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Delete failed", true);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, draft, isNew, selectedId]);

  if (loading) {
    return <p style={{ color: "var(--graphite)", padding: "30px 0" }}>Loading…</p>;
  }

  return (
    <div style={{ display: "grid", gap: 22, gridTemplateColumns: def.singleton ? "1fr" : "minmax(0,1fr)" }}>
      <style>{`@media (min-width: 900px){ .st-master-detail { grid-template-columns: 300px minmax(0,1fr) !important; } }`}</style>
      {toastMsg && <div className={`st-toast${toastErr ? " err" : ""}`}>{toastMsg}</div>}
      <div className="st-master-detail" style={{ display: "grid", gap: 22, gridTemplateColumns: "minmax(0,1fr)", alignItems: "start" }}>
        {!def.singleton && (
          <div className="st-card" style={{ padding: 14 }}>
            {def.canCreate && (
              <button className="st-btn st-btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 12 }} onClick={startNew}>
                + New {def.singular}
              </button>
            )}
            {rows.length > 8 && (
              <input className="st-input" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 10 }} />
            )}
            <div style={{ display: "grid", gap: 2, maxHeight: "70vh", overflowY: "auto" }}>
              {filtered.map((row) => {
                const on = row.id === selectedId && !isNew;
                const badge = def.badgeKey ? String(row[def.badgeKey] ?? "") : "";
                const badgeClass =
                  badge === "true" || badge === "published" || badge === "live"
                    ? "badge-live"
                    : badge === "new"
                      ? "badge-new"
                      : "badge-draft";
                return (
                  <button key={String(row.id)} className={`st-list-item${on ? " on" : ""}`} onClick={() => select(row)}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <strong style={{ display: "block", fontSize: 14 }}>
                        {String(row[def.titleKey] ?? "(untitled)")}
                      </strong>
                      {def.subtitleKey && (
                        <span style={{ fontSize: 12.5, color: "var(--graphite)" }}>
                          {String(row[def.subtitleKey] ?? "")}
                        </span>
                      )}
                    </span>
                    {def.badgeKey && (
                      <span className={`badge ${badgeClass}`}>{badge === "true" ? "live" : badge || "—"}</span>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && <p style={{ color: "var(--graphite)", fontSize: 13.5, padding: 8 }}>Nothing here yet.</p>}
            </div>
          </div>
        )}

        <div className="st-card" style={{ padding: 24 }}>
          {!draft ? (
            <p style={{ color: "var(--graphite)" }}>Select an item to edit{def.canCreate ? ", or create a new one." : "."}</p>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {isNew ? `New ${def.singular}` : String(draft[def.titleKey] || def.singular)}
                </h2>
                <div style={{ display: "flex", gap: 8 }}>
                  {def.canDelete && !isNew && !def.singleton && (
                    <button className="st-btn st-btn-danger" onClick={remove}>
                      Delete
                    </button>
                  )}
                  <button className="st-btn st-btn-primary" onClick={save} disabled={!dirty || saving}>
                    {saving ? "Saving…" : dirty ? "Save" : "Saved"}
                  </button>
                </div>
              </div>

              {def.sections.map((section) => (
                <details key={section.title} open={def.sections.length <= 2} style={{ borderBottom: "1px solid var(--hair)", paddingBottom: 14, marginBottom: 14 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: "-0.01em", marginBottom: 12 }}>
                    {section.title}
                  </summary>
                  <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr", paddingTop: 6 }}>
                    {section.fields.map((f) => (
                      <div key={f.key} style={f.half ? { gridColumn: "auto" } : { gridColumn: "1 / -1" }}>
                        {f.type !== "boolean" && (
                          <label className="st-label" htmlFor={f.key}>
                            {f.label}
                            {f.hint && <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--faint)" }}> — {f.hint}</span>}
                          </label>
                        )}
                        <Field
                          field={f}
                          value={draft[f.key]}
                          onChange={(v) => setDraft((d) => (d ? { ...d, [f.key]: v } : d))}
                          onToast={showToast}
                        />
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function stripMeta(row: Row): Row {
  const { created_at, updated_at, id, ...rest } = row;
  void created_at;
  void updated_at;
  void id;
  return rest;
}

function MediaLibrary() {
  const [items, setItems] = useState<import("../types").MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [toastMsg, toastErr, showToast] = useToastInternal();

  const load = async () => {
    try {
      setItems(await studioApi.listMedia());
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not load media", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (files: FileList) => {
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await studioApi.uploadMedia(file);
      }
      showToast("Upload complete.");
      await load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Upload failed", true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {toastMsg && <div className={`st-toast${toastErr ? " err" : ""}`}>{toastMsg}</div>}
      <div className="st-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Media library</h2>
          <label className="st-btn st-btn-primary" style={{ cursor: busy ? "wait" : "pointer" }}>
            {busy ? "Uploading…" : "Upload images"}
            <input
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => {
                if (e.target.files?.length) upload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {loading ? (
          <p style={{ color: "var(--graphite)" }}>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "var(--graphite)" }}>No uploads yet. Images you add to case studies appear here too.</p>
        ) : (
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
            {items.map((m) => (
              <div key={m.id} className="st-card" style={{ padding: 10 }}>
                <img src={m.url} alt={m.filename} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 10 }} />
                <p style={{ fontSize: 12, margin: "8px 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.filename}</p>
                <p style={{ fontSize: 11, color: "var(--graphite)", marginBottom: 8 }}>{Math.round(m.size / 1024)} KB</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="st-btn st-btn-ghost"
                    style={{ padding: "5px 10px", fontSize: 12 }}
                    onClick={() => {
                      navigator.clipboard.writeText(m.url).then(() => {
                        setCopied(m.id);
                        window.setTimeout(() => setCopied(null), 1500);
                      });
                    }}
                  >
                    {copied === m.id ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    className="st-btn st-btn-danger"
                    style={{ padding: "5px 10px", fontSize: 12 }}
                    onClick={async () => {
                      if (!window.confirm("Delete this image?")) return;
                      await studioApi.removeMedia(m.id);
                      await load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
