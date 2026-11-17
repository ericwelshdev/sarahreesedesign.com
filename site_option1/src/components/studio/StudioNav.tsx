"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/studio", label: "Overview", exact: true },
  { href: "/studio/projects", label: "Case studies" },
  { href: "/studio/profile", label: "Profile & copy" },
  { href: "/studio/demos", label: "Live sites" },
  { href: "/studio/clients", label: "Clients" },
  { href: "/studio/accolades", label: "Press & awards" },
  { href: "/studio/testimonials", label: "Kind words" },
  { href: "/studio/faqs", label: "FAQ" },
  { href: "/studio/inbox", label: "Inbox", badge: true },
  { href: "/studio/media", label: "Media" },
];

export default function StudioNav({ name, newInquiries }: { name: string; newInquiries: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/studio/login", { method: "DELETE" });
    router.push("/studio/login");
    router.refresh();
  }

  return (
    <header className="st-top">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white" style={{ background: "#1d1d1f" }}>
            {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          <div>
            <p className="text-[15px] font-semibold leading-tight tracking-tight">Studio</p>
            <p className="text-xs leading-tight" style={{ color: "#6e6e73" }}>Content manager for {name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="st-btn st-btn-sm">View site ↗</Link>
          <button type="button" className="st-btn st-btn-sm" onClick={logout}>Sign out</button>
        </div>
      </div>
      <nav className="mx-auto max-w-[1400px] px-4 pb-3 md:px-8" aria-label="Studio sections">
        <div className="st-tabs">
          {TABS.map((t) => {
            const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
            return (
              <Link key={t.href} href={t.href} className="st-tab" aria-current={active ? "page" : undefined}>
                {t.label}
                {t.badge && newInquiries > 0 && <span className="st-badge">{newInquiries}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
