"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useIndicator } from "./ui/useIndicator";

const icon = (d: ReactNode) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);

const ITEMS = [
  { id: "top", label: "Home", icon: icon(<path d="M4 11l8-6.5 8 6.5v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />) },
  { id: "work", label: "Work", icon: icon(<><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></>) },
  { id: "live", label: "Live", icon: icon(<><rect x="7" y="2.5" width="10" height="19" rx="3" /><path d="M10.5 18.5h3" /></>) },
  { id: "about", label: "Dossier", icon: icon(<><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5" /></>) },
  { id: "contact", label: "Contact", icon: icon(<><rect x="3" y="5.5" width="18" height="13" rx="3" /><path d="M4 8l8 5.5L20 8" /></>) },
];

export default function Nav({ initials, status }: { initials: string; status: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState("top");
  const current = onHome ? active : pathname.startsWith("/work") ? "work" : null;
  const { containerRef, register, style } = useIndicator(current);

  useEffect(() => {
    if (!onHome) return;
    const targets = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [onHome]);

  return (
    <nav className="island" aria-label="Primary">
      <Link href="/#top" className="island-logo" aria-label="Home">
        {initials}
      </Link>
      <div className="nav-list" ref={containerRef}>
        <span className="nav-pill" style={style} aria-hidden />
        {ITEMS.map((i) => (
          <Link key={i.id} href={`/#${i.id}`} ref={register(i.id)} className="nav-item" aria-current={current === i.id ? "true" : undefined} data-active={current === i.id}>
            {i.icon}
            <span>{i.label}</span>
          </Link>
        ))}
      </div>
      <span className="island-sep" aria-hidden />
      <Link href="/#contact" className="island-cta">
        <span className="dot" data-s={status} style={{ width: 6, height: 6 }} />
        Start a project
      </Link>
    </nav>
  );
}
