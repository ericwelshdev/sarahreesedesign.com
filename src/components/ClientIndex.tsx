import { useState } from "react";
import type { Client } from "../types";

export default function ClientIndex({ clients }: { clients: Client[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="cl-list">
      {clients.map((c) => {
        const open = openId === c.id;
        return (
          <div key={c.id}>
            <button
              className="cl-row"
              style={{ background: "none", border: "1px solid transparent", borderBlock: "none", width: "100%", cursor: "pointer" }}
              onClick={() => setOpenId(open ? null : c.id)}
              aria-expanded={open}
            >
              <span className="cl-name">{c.name}</span>
              <span className="cl-desc">{c.descriptor}</span>
            </button>
            <div
              className="acc-body"
              style={{ gridTemplateRows: open ? "1fr" : undefined }}
            >
              <div className="acc-inner">
                <p style={{ padding: "0 4px 20px", color: "var(--graphite)", lineHeight: 1.6, maxWidth: 560 }}>
                  {c.blurb}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
