import { useState } from "react";
import type { Faq } from "../types";

export default function Faq({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <section className="section" id="faq" style={{ paddingTop: 0 }}>
      <div className="wrap-narrow">
        <p className="eyebrow" data-reveal>03 — A few answers</p>
        <h2 className="h2" style={{ margin: "10px 0 30px" }} data-reveal>
          Curious minds <span className="serif" style={{ color: "var(--accent)" }}>ask questions.</span>
        </h2>
        <div data-reveal>
          {faqs.map((f) => {
            const open = openId === f.id;
            return (
              <div className={`acc-row${open ? " open" : ""}`} key={f.id}>
                <button className="acc-btn" onClick={() => setOpenId(open ? null : f.id)} aria-expanded={open}>
                  {f.question}
                  <span className="acc-plus" aria-hidden />
                </button>
                <div className="acc-body">
                  <div className="acc-inner">
                    <p>{f.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
