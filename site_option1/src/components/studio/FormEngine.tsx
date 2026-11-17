"use client";

import { useId, useRef, useState } from "react";
import type { Field } from "@/lib/studio-schemas";

export type Row = Record<string, unknown>;

export function blankItem(fields: Field[]): Row {
  const out: Row = {};
  for (const f of fields) {
    out[f.key] =
      f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "list" || f.type === "strings" ? [] : f.type === "color" ? "#1d1d1f" : f.type === "select" ? (f.options?.[0]?.value ?? "") : "";
  }
  return out;
}

export function FieldsGrid({ fields, value, onChange }: { fields: Field[]; value: Row; onChange: (next: Row) => void }) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });
  return (
    <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.half ? "" : "md:col-span-2"}>
          <FieldInput field={f} value={value[f.key]} onChange={(v) => set(f.key, v)} />
        </div>
      ))}
    </div>
  );
}

function FieldInput({ field: f, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();

  if (f.type === "boolean") {
    return (
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium" htmlFor={id}>
        <input id={id} type="checkbox" className="h-5 w-5 accent-black" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {f.label}
      </label>
    );
  }

  if (f.type === "list") {
    return <ListField field={f} value={value} onChange={onChange} />;
  }

  return (
    <div>
      <label className="st-label" htmlFor={id}>{f.label}</label>
      {f.type === "text" && (
        <input id={id} className="st-input" type="text" value={String(value ?? "")} placeholder={f.placeholder} readOnly={f.readOnly} onChange={(e) => onChange(e.target.value)} />
      )}
      {f.type === "number" && (
        <input id={id} className="st-input" type="number" inputMode="numeric" value={Number(value ?? 0)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
      )}
      {f.type === "textarea" && (
        <textarea id={id} className="st-input" rows={f.rows ?? 4} value={String(value ?? "")} placeholder={f.placeholder} readOnly={f.readOnly} onChange={(e) => onChange(e.target.value)} />
      )}
      {f.type === "strings" && (
        <textarea id={id} className="st-input" rows={f.rows ?? 4} value={Array.isArray(value) ? (value as string[]).join("\n") : ""} onChange={(e) => onChange(e.target.value.split("\n"))} />
      )}
      {f.type === "select" && (
        <select id={id} className="st-input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {f.type === "color" && (
        <div className="flex items-center gap-2">
          <input aria-label={`${f.label} picker`} type="color" className="h-[46px] w-14 cursor-pointer rounded-xl border border-black/10 bg-transparent p-1" value={normalizeHex(String(value ?? "#000000"))} onChange={(e) => onChange(e.target.value)} />
          <input id={id} className="st-input" type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="#1D1D1F" />
        </div>
      )}
      {f.type === "image" && <ImageInput id={id} value={String(value ?? "")} onChange={onChange} />}
      {f.hint && <p className="st-hint">{f.hint}</p>}
    </div>
  );
}

function ImageInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/studio/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input id={id} className="st-input" type="text" value={value} placeholder="/images/… or https://… or upload" onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="st-btn" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      </div>
      {err && <p className="st-hint" style={{ color: "#d70015" }}>{err}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-3 h-24 w-auto max-w-full rounded-xl border border-black/10 object-cover" />
      )}
    </div>
  );
}

function ListField({ field: f, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const items: Row[] = Array.isArray(value) ? (value as Row[]) : [];
  const itemFields = f.itemFields ?? [];
  const label = f.itemLabel ?? "item";

  const patch = (i: number, next: Row) => onChange(items.map((it, idx) => (idx === i ? next : it)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const summary = (it: Row) => {
    const first = itemFields.find((x) => x.type === "text" || x.type === "image" || x.type === "textarea");
    const s = first ? String(it[first.key] ?? "") : "";
    return s.length > 56 ? s.slice(0, 56) + "…" : s;
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="st-label" style={{ marginBottom: 0 }}>{f.label} <span style={{ color: "#86868b", fontWeight: 400 }}>({items.length})</span></span>
      </div>
      <div className="grid gap-3">
        {items.map((it, i) => (
          <div key={i} className="st-list-item">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-semibold">
                <span style={{ color: "#86868b" }}>{label} {i + 1}</span>
                {summary(it) && <span> · {summary(it)}</span>}
              </p>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="st-btn st-btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" className="st-btn st-btn-sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
                <button type="button" className="st-btn st-btn-sm st-btn-danger" onClick={() => remove(i)} aria-label={`Remove ${label}`}>✕</button>
              </div>
            </div>
            <FieldsGrid fields={itemFields} value={it} onChange={(next) => patch(i, next)} />
          </div>
        ))}
        <button type="button" className="st-btn" style={{ justifySelf: "start" }} onClick={() => onChange([...items, blankItem(itemFields)])}>
          + Add {label}
        </button>
      </div>
      {f.hint && <p className="st-hint">{f.hint}</p>}
    </div>
  );
}

function normalizeHex(v: string) {
  const m = v.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(m)) return m;
  if (/^#[0-9a-fA-F]{3}$/.test(m)) return "#" + m.slice(1).split("").map((c) => c + c).join("");
  return "#000000";
}
