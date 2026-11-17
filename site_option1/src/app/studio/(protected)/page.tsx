import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { inquiries, projects, demos, testimonials, accolades } from "@/db/schema";
import { requireStudio } from "@/lib/auth";
import { projectCompleteness } from "@/lib/completeness";

export const dynamic = "force-dynamic";

export default async function Overview() {
  await requireStudio();
  await ensureSeeded();
  const [list, [inq], [dm], [tm], [ac]] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id)),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "new")),
    db.select({ n: count() }).from(demos),
    db.select({ n: count() }).from(testimonials),
    db.select({ n: count() }).from(accolades),
  ]);
  const published = list.filter((p) => p.published).length;
  const usingDefaultPassword = !process.env.STUDIO_PASSWORD;

  const cards = [
    { label: "Published case studies", value: published, href: "/studio/projects", sub: `${list.length - published} drafts` },
    { label: "New inquiries", value: inq.n, href: "/studio/inbox", sub: "Awaiting a reply" },
    { label: "Live sites in sandbox", value: dm.n, href: "/studio/demos", sub: "Interactive demos" },
    { label: "Awards & press", value: ac.n, href: "/studio/accolades", sub: `${tm.n} testimonials` },
  ];

  return (
    <div className="grid gap-8">
      <div className="max-w-[70ch]">
        <h1 className="text-3xl font-semibold md:text-4xl" style={{ letterSpacing: "-0.04em" }}>Overview</h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#6e6e73" }}>
          Everything on the public site is edited here. Changes go live the moment you save.
        </p>
      </div>

      {usingDefaultPassword && (
        <div className="rounded-2xl border p-4 text-sm" style={{ background: "#fff8e6", borderColor: "#f5d27a" }} role="alert">
          <strong>Set a private password.</strong> The studio is using the built-in default password. Add a <code>STUDIO_PASSWORD</code> environment variable to lock it down.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="st-card p-5 transition-transform active:scale-[0.98]" style={{ transitionTimingFunction: "var(--spring)" }}>
            <p className="text-xs font-medium" style={{ color: "#6e6e73" }}>{c.label}</p>
            <p className="mt-2 text-4xl font-semibold" style={{ letterSpacing: "-0.04em" }}>{c.value}</p>
            <p className="mt-1 text-xs" style={{ color: "#86868b" }}>{c.sub}</p>
          </Link>
        ))}
      </div>

      <section className="st-card p-5 md:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Case study health</h2>
        <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>How completely each project tells the story clients look for: process, color rationale, messaging, and legal guardrails.</p>
        <div className="mt-6 grid gap-5">
          {list.map((p) => {
            const c = projectCompleteness(p as unknown as Record<string, unknown>);
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <Link href="/studio/projects" className="font-medium underline-offset-4 hover:underline">{p.title}{!p.published && <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-[11px] uppercase">Draft</span>}</Link>
                  <span className="tabular-nums" style={{ color: "#6e6e73" }}>{c.percent}%</span>
                </div>
                <div className="st-meter mt-2"><i style={{ width: `${c.percent}%` }} /></div>
                {c.missing.length > 0 && <p className="st-hint">Missing: {c.missing.join(" · ")}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="st-card p-5 md:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Quick guide</h2>
        <ul className="mt-4 grid gap-3 text-[15px] md:grid-cols-2" style={{ color: "#424245" }}>
          <li><strong>Add a project.</strong> Case studies → New. Keep it unpublished until it is ready.</li>
          <li><strong>Show your thinking.</strong> Fill in process, color story, messaging and guardrails. This is what sets a creative director apart.</li>
          <li><strong>Update availability.</strong> Profile &amp; copy → availability status.</li>
          <li><strong>Add a live site.</strong> Live sites → paste HTML or an external URL, then write the breakdown.</li>
        </ul>
      </section>
    </div>
  );
}
