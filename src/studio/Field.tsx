import { useRef, useState } from "react";
import { studioApi } from "./shared";
import type { FieldDef } from "./resources";
type Row = Record<string, unknown>;

interface Props {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  onToast: (msg: string, err?: boolean) => void;
}

export default function Field({ field, value, onChange, onToast }: Props) {
  switch (field.type) {
    case "text":
    case "number":
      return (
        <input
          className="st-input"
          type={field.type === "number" ? "number" : "text"}
          value={value == null ? "" : String(value)}
          readOnly={field.readOnly}
          onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          className="st-input"
          rows={field.rows ?? 3}
          value={value == null ? "" : String(value)}
          readOnly={field.readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "boolean":
      return (
        <label style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 14 }}>
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      );
    case "select":
    case "status":
      return (
        <select
          className="st-input"
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "strings":
      return (
        <textarea
          className="st-input"
          rows={field.rows ?? 4}
          value={Array.isArray(value) ? value.join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
      );
    case "image":
      return <ImageField value={String(value ?? "")} onChange={onChange} onToast={onToast} />;
    case "metrics":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ value: "", label: "", detail: "" }}
          label="metric"
          fields={[
            { key: "value", label: "Value" },
            { key: "label", label: "Label" },
            { key: "detail", label: "Detail" },
          ]}
        />
      );
    case "palette":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ name: "", hex: "#888888", role: "", rationale: "" }}
          label="color"
          fields={[
            { key: "name", label: "Name" },
            { key: "hex", label: "Hex", color: true },
            { key: "role", label: "Role" },
            { key: "rationale", label: "Rationale" },
          ]}
        />
      );
    case "process":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ title: "", duration: "", description: "", outputs: [] }}
          label="phase"
          fields={[
            { key: "title", label: "Title" },
            { key: "duration", label: "Duration" },
            { key: "description", label: "Description", textarea: true },
            { key: "outputs", label: "Outputs", lines: true },
          ]}
        />
      );
    case "credits":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ name: "", role: "" }}
          label="credit"
          fields={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
          ]}
        />
      );
    case "gallery":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ src: "", caption: "" }}
          label="image"
          fields={[
            { key: "src", label: "Image", image: true },
            { key: "caption", label: "Caption" },
          ]}
          onToast={onToast}
        />
      );
    case "copyExamples":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ before: "", after: "", note: "" }}
          label="example"
          fields={[
            { key: "before", label: "Before" },
            { key: "after", label: "After" },
            { key: "note", label: "Note" },
          ]}
        />
      );
    case "hurdles":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ kind: "", title: "", constraint: "", resolution: "" }}
          label="guardrail"
          fields={[
            { key: "kind", label: "Kind" },
            { key: "title", label: "Title" },
            { key: "constraint", label: "Constraint", textarea: true },
            { key: "resolution", label: "Resolution", textarea: true },
          ]}
        />
      );
    case "decisions":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ area: "", decision: "", rationale: "" }}
          label="decision"
          fields={[
            { key: "area", label: "Area" },
            { key: "decision", label: "Decision" },
            { key: "rationale", label: "Rationale" },
          ]}
        />
      );
    case "typography":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ role: "", family: "", classification: "sans", sample: "Aa", rationale: "" }}
          label="type spec"
          fields={[
            { key: "role", label: "Role" },
            { key: "family", label: "Family" },
            { key: "classification", label: "Classification", select: ["sans", "serif", "mono"] },
            { key: "sample", label: "Sample" },
            { key: "rationale", label: "Rationale" },
          ]}
        />
      );
    case "stats":
      // eslint-disable-next-line no-fallthrough
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ value: "", label: "" }}
          label="stat"
          fields={[
            { key: "value", label: "Value" },
            { key: "label", label: "Label" },
          ]}
        />
      );
    case "principles":
      return (
        <ListEditor
          value={value}
          onChange={onChange}
          blank={{ title: "", body: "" }}
          label="principle"
          fields={[
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
        />
      );
    default:
      return null;
  }
}

function ImageField({
  value,
  onChange,
  onToast,
}: {
  value: string;
  onChange: (v: string) => void;
  onToast: (msg: string, err?: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const item = await studioApi.uploadMedia(file);
      onChange(item.url);
      onToast("Image uploaded");
    } catch (e) {
      onToast(e instanceof Error ? e.message : "Upload failed", true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input
        className="st-input"
        value={value}
        placeholder="Paste an image URL or upload"
        onChange={(e) => onChange(e.target.value)}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
        <button type="button" className="st-btn st-btn-ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
        {value && (
          <img
            src={value}
            alt=""
            style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 10, border: "1px solid var(--hair)" }}
          />
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

interface ListFieldSpec {
  key: string;
  label: string;
  textarea?: boolean;
  lines?: boolean;
  color?: boolean;
  image?: boolean;
  select?: string[];
}

function ListEditor({
  value,
  onChange,
  blank,
  label,
  fields,
  onToast,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  blank: Row;
  label: string;
  fields: ListFieldSpec[];
  onToast?: (msg: string, err?: boolean) => void;
}) {
  const items = (Array.isArray(value) ? value : []) as Row[];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const update = (idx: number, key: string, v: unknown) => {
    const next = items.map((item, i) => (i === idx ? { ...item, [key]: v } : item));
    onChange(next);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div>
      {items.map((item, idx) => {
        const open = openIdx === idx;
        const head =
          String(item.name ?? item.title ?? item.value ?? item.question ?? item.area ?? item.author ?? item.src ?? "") ||
          `${label} ${idx + 1}`;
        return (
          <div key={idx} style={{ border: "1px solid var(--hair)", borderRadius: 12, marginBottom: 8, background: "#fff" }}>
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : idx)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                background: "none",
                border: 0,
                cursor: "pointer",
                font: "inherit",
                fontSize: 14,
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{head}</span>
              <span style={{ display: "inline-flex", gap: 4, flex: "none" }}>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    move(idx, -1);
                  }}
                  style={{ opacity: 0.5, padding: "0 4px" }}
                >
                  ↑
                </span>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    move(idx, 1);
                  }}
                  style={{ opacity: 0.5, padding: "0 4px" }}
                >
                  ↓
                </span>
              </span>
            </button>
            {open && (
              <div style={{ padding: "4px 14px 14px", display: "grid", gap: 12 }}>
                {fields.map((f) => {
                  const id = `${idx}-${f.key}`;
                  return (
                    <div key={f.key}>
                      <label className="st-label" htmlFor={id}>
                        {f.label}
                      </label>
                      {f.image ? (
                        <ImageField
                          value={String(item[f.key] ?? "")}
                          onChange={(v) => update(idx, f.key, v)}
                          onToast={onToast ?? (() => {})}
                        />
                      ) : f.color ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="color"
                            value={/^#[0-9a-fA-F]{6}$/.test(String(item[f.key] ?? "")) ? String(item[f.key]) : "#888888"}
                            onChange={(e) => update(idx, f.key, e.target.value)}
                            style={{ width: 42, height: 38, border: "1px solid var(--hair-strong)", borderRadius: 10, cursor: "pointer", background: "none" }}
                          />
                          <input
                            className="st-input"
                            id={id}
                            value={String(item[f.key] ?? "")}
                            onChange={(e) => update(idx, f.key, e.target.value)}
                          />
                        </div>
                      ) : f.select ? (
                        <select
                          className="st-input"
                          id={id}
                          value={String(item[f.key] ?? f.select[0])}
                          onChange={(e) => update(idx, f.key, e.target.value)}
                        >
                          {f.select.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : f.lines ? (
                        <textarea
                          className="st-input"
                          id={id}
                          rows={2}
                          value={Array.isArray(item[f.key]) ? (item[f.key] as string[]).join("\n") : ""}
                          onChange={(e) =>
                            update(
                              idx,
                              f.key,
                              e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                            )
                          }
                        />
                      ) : f.textarea ? (
                        <textarea
                          className="st-input"
                          id={id}
                          rows={3}
                          value={String(item[f.key] ?? "")}
                          onChange={(e) => update(idx, f.key, e.target.value)}
                        />
                      ) : (
                        <input
                          className="st-input"
                          id={id}
                          value={String(item[f.key] ?? "")}
                          onChange={(e) => update(idx, f.key, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="st-btn st-btn-danger"
                  onClick={() => {
                    onChange(items.filter((_, i) => i !== idx));
                    setOpenIdx(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
      <button type="button" className="st-btn st-btn-ghost" onClick={() => onChange([...items, { ...blank }])}>
        + Add {label}
      </button>
    </div>
  );
}
