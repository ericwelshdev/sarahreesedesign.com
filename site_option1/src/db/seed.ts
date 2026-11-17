import { execSync } from "node:child_process";
import { db } from "./index";
import { accolades, clients, demos, faqs, profile, projects, testimonials } from "./schema";
import { seedProjectsA } from "./seed-projects-a";
import { seedProjectsB } from "./seed-projects-b";
import { seedDemos } from "./seed-demos";

let seeding: Promise<void> | null = null;

async function run() {
  // Atomic guard: only the process that creates the profile row seeds the rest.
  const inserted = await db
    .insert(profile)
    .values({
      id: 1,
      name: "Sarah Reese",
      title: "Independent Creative Director",
      location: "California · Worldwide",
      email: "hi@sarahreesedesign.com",
      linkedinUrl: "https://www.linkedin.com/",
      instagramUrl: "https://www.instagram.com/",
      availability: "open",
      availabilityText: "Booking Q3: brand systems and creative direction",
      heroHeadline: "Creative direction for brands, campaigns and products",
      heroAccent: "people remember.",
      heroSub:
        "Interdisciplinary visual artist with a knack for all things marketing. Over a decade of work with startups and Fortune 500 brands alike.",
      stats: [
        { value: "10+", label: "Years directing" },
        { value: "40+", label: "Brands shaped" },
        { value: "6", label: "Recognitions" },
      ],
      showreelUrl: "/videos/showreel.mp4",
      showreelPoster: "/images/projects/enterprise-keynote.jpg",
      showreelLabel: "Showreel 2025",
      portraitUrl: "/images/portrait.jpg",
      aboutHeadline: "Strategy with a",
      aboutAccent: "human pulse.",
      bio:
        "I'm Sarah, and I'm here to make awesome stuff. I've been creating unique, high-level visual and marketing strategies for over a decade, and I've been lucky enough to work with startups and big companies alike, from independent boutique shops to Fortune 500 brands.\n\nIn working with clients I seek to create partnerships that deliver strategic and emotionally resonant campaigns that successfully achieve brand goals. Good design creates a feeling before it creates a thought. I build visual systems that make brands easier to understand, harder to forget, and a little more human.",
      shortVersion:
        "I turn strategy into visual language. Over a decade across startups, agencies and Fortune 500 teams has taught me that the best work is both clear and surprising.",
      principles: [
        {
          title: "Strategy before style",
          body: "Every color, headline and layout traces back to a decision about who this is for and what they should feel. If I can't explain it, it doesn't ship.",
        },
        {
          title: "Systems over one-offs",
          body: "I design toolkits that teams can extend without me, with templates, rules and playbooks that keep the work consistent long after launch.",
        },
        {
          title: "Words are design material",
          body: "Message, tone and legal guardrails are part of the creative brief. The sentence is as designed as the layout.",
        },
        {
          title: "Lead with people",
          body: "Great work comes from rooms where people feel safe to say what they really think. I see my job as making others' best ideas better.",
        },
      ],
      capabilities: [
        "Brand strategy",
        "Identity systems",
        "Art direction",
        "Campaign development",
        "UX / UI & digital",
        "Editorial & print",
        "Creative leadership",
        "Presentation systems",
      ],
      footerNote: "Working remotely, based in California. Previously Seattle, WA.",
      seoTitle: "Sarah Reese | Independent Creative Director",
      seoDescription:
        "Creative director crafting brands, campaigns and products people remember. Case studies, process and live work from over a decade with startups and Fortune 500 brands.",
    })
    .onConflictDoNothing()
    .returning({ id: profile.id });

  if (inserted.length === 0) return;

  await db.insert(projects).values([...seedProjectsA, ...seedProjectsB]);
  await db.insert(demos).values(seedDemos);

  await db.insert(clients).values([
    { name: "Google", descriptor: "Campaigns · Presentation systems", blurb: "Executive storytelling and customer-facing investment narratives built on a shared slide system.", projectSlug: "enterprise-investment-keynote", previewImage: "/images/projects/enterprise-keynote.jpg", sortOrder: 1 },
    { name: "Volvo", descriptor: "Web & Digital · Product UI", blurb: "A sourced, honest education hub for drivers considering electrification.", projectSlug: "sustainable-mobility-education", previewImage: "/images/projects/mobility-hub.jpg", sortOrder: 2 },
    { name: "Microsoft", descriptor: "Campaigns · Product marketing", blurb: "Narrative frameworks and keynote systems for partner and customer briefings.", projectSlug: "enterprise-investment-keynote", previewImage: "/images/projects/enterprise-keynote.jpg", sortOrder: 3 },
    { name: "eHealth", descriptor: "Brand Identity · DI&I", blurb: "A sub-brand and illustration language for a national healthcare marketplace's inclusion programs.", projectSlug: "dii-brand-development", previewImage: "/images/projects/dii-brand.jpg", sortOrder: 4 },
    { name: "Lyst", descriptor: "Campaigns · Fashion", blurb: "A resale campaign that made second-hand the smartest edit in the wardrobe.", projectSlug: "lyst-the-wardrobe-edit", previewImage: "/images/projects/wardrobe-edit.jpg", sortOrder: 5 },
    { name: "Natural Highs", descriptor: "Brand Identity · Recovery", blurb: "A hand-drawn identity for a recovery community that refuses to look clinical.", projectSlug: "natural-highs-brand-identity", previewImage: "/images/projects/natural-highs.jpg", sortOrder: 6 },
    { name: "a.e. Wells", descriptor: "Brand Identity · Lifestyle", blurb: "A sun-baked, social-first lifestyle brand built on permission slips.", projectSlug: "serendipity-by-ae-wells", previewImage: "/images/projects/serendipity.jpg", sortOrder: 7 },
    { name: "Restore OT", descriptor: "Web & Digital · Healthcare", blurb: "A photography-led brand and website for an occupational therapy practice.", projectSlug: "restore-ot-brand-and-web", previewImage: "/images/projects/restore-ot.jpg", sortOrder: 8 },
  ]);

  await db.insert(accolades).values([
    { kind: "award", title: "Honoree, Health & Wellness Websites", organization: "Webby Awards", year: "2024", note: "Restore OT web experience", sortOrder: 1 },
    { kind: "award", title: "Honorable Mention, Web Design", organization: "Awwwards", year: "2023", note: "Natural Highs brand site", sortOrder: 2 },
    { kind: "award", title: "Shortlist, Design", organization: "Cannes Lions", year: "2023", note: "The Wardrobe Edit", sortOrder: 3 },
    { kind: "speaking", title: "Brand systems people actually use", organization: "Design Leadership Summit", year: "2024", note: "Keynote on templates, playbooks and handing work off well", sortOrder: 4 },
    { kind: "speaking", title: "Writing the legal line without losing the idea", organization: "Creative Mornings", year: "2023", note: "Talk on designing within regulatory guardrails", sortOrder: 5 },
    { kind: "press", title: "Designing inclusion without the clichés", organization: "Brand Quarterly", year: "2024", note: "Feature on the eHealth DI&I identity", sortOrder: 6 },
    { kind: "press", title: "Ten designers redefining healthcare brands", organization: "Print Magazine", year: "2023", note: "Profile", sortOrder: 7 },
  ]);

  await db.insert(testimonials).values([
    { quote: "She helped us push boundaries, while maintaining visual consistency and brand identity... integral in building customer-facing presentations, detailing our existing and future investments.", author: "Marissa Salazar", role: "Senior Product Marketing Manager", company: "Microsoft", spotlight: true, sortOrder: 1 },
    { quote: "Sarah is one of the most talented creatives I have worked with. She is a visionary and a deeply experienced and eminently talented creative leader.", author: "Mark Waldo", role: "Director of Product Marketing", company: "eHealth", sortOrder: 2 },
    { quote: "Sarah is a gem and any company would be so lucky to work with her. She is independent, creative, always looks at the big picture, and fosters strong relationships with her team.", author: "Alejandra M.", role: "Project Manager", company: "Creative Partner", sortOrder: 3 },
    { quote: "Her genuine interest in wanting to see others do their best makes her a great leader, along with excellent design skills.", author: "Andrew W.", role: "Designer", company: "Brand Studio", sortOrder: 4 },
    { quote: "If you want her to do nice designs, give her lots of caffeine and compliments.", author: "Eric", role: "Founder & Executive Partner", company: "Client", sortOrder: 5 },
  ]);

  await db.insert(faqs).values([
    { question: "Who am I?", answer: "I'm Sarah, and I'm here to make awesome stuff. I've been creating unique, high-level visual and marketing strategies for over a decade, working with startups and big companies alike, from independent boutique shops to Fortune 500 brands.", sortOrder: 1 },
    { question: "How do you work with clients?", answer: "I start by listening: stakeholder conversations, audience interviews and a hard look at what exists. Then I define a creative territory, build the system, and hand it off with templates and a playbook your team can run without me. Most engagements run eight to fourteen weeks.", sortOrder: 2 },
    { question: "Where do you find inspiration?", answer: "Outside the algorithm first: mid-century editorial archives, architecture, tactile packaging, and candid conversations with the people a brand is meant to serve.", sortOrder: 3 },
    { question: "What professional tools do you use?", answer: "Figma, Adobe Creative Cloud, Webflow, Keynote and PowerPoint for executive systems, Cinema 4D, and modern AI-assisted concepting. Every enduring brand world still starts with sharp strategy and a pencil sketch.", sortOrder: 4 },
    { question: "Do you work with legal and compliance teams?", answer: "Constantly. Regulated categories like healthcare, recovery, finance and sustainability need creative direction that works inside the guardrails. I bring counsel in early so the strongest idea is also the one that gets approved.", sortOrder: 5 },
  ]);
}

function isMissingTable(err: unknown) {
  const e = err as { code?: string; cause?: { code?: string } };
  return (e?.code ?? e?.cause?.code) === "42P01";
}

/** If the database is brand new (no tables yet), apply the schema once and retry. */
async function seedWithBootstrap() {
  try {
    await run();
  } catch (err) {
    if (!isMissingTable(err)) throw err;
    execSync("npx drizzle-kit push --force", { stdio: "ignore", timeout: 120_000 });
    await run();
  }
}

export function ensureSeeded(): Promise<void> {
  if (!seeding) {
    seeding = seedWithBootstrap().catch((err) => {
      seeding = null;
      throw err;
    });
  }
  return seeding;
}
