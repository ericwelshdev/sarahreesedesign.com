"use client";

import { useRef, useState } from "react";

interface Item {
  id: string;
  filename: string;
  size: number;
  url: string;
}

export default function MediaLibrary({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg("");
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/studio/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setMsg(`${file.name}: ${data.error || "upload failed"}`);
        continue;
      }
      setItems((prev) => [{ id: data.id, filename: file.name, size: file.size, url: data.url }, ...prev]);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this image? Any project still using it will show a broken image.")) return;
    const res = await fetch(`/api/studio/media/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url).catch(() => {});
    setMsg(`Copied ${url}`);
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="st-btn st-btn-primary" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Uploading…" : "+ Upload images"}
        </button>
        <input ref={fileRef} type="file" multiple hidden accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        <span className="text-sm" style={{ color: "#6e6e73" }} role="status">{msg || "JPG, PNG, WebP, GIF or AVIF · up to 8 MB each"}</span>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {items.map((i) => (
          <div key={i.id} className="st-card overflow-hidden" style={{ borderRadius: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.url} alt={i.filename} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="p-3">
              <p className="truncate text-xs font-medium">{i.filename}</p>
              <p className="text-[11px]" style={{ color: "#86868b" }}>{(i.size / 1024).toFixed(0)} KB</p>
              <div className="mt-2 flex gap-1">
                <button type="button" className="st-btn st-btn-sm flex-1" onClick={() => copy(i.url)}>Copy URL</button>
                <button type="button" className="st-btn st-btn-sm st-btn-danger" onClick={() => remove(i.id)} aria-label={`Delete ${i.filename}`}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="mt-8 text-sm" style={{ color: "#6e6e73" }}>No uploads yet. Images you upload here (or from any image field) are stored in the database and served from your site.</p>}
    </div>
  );
}
