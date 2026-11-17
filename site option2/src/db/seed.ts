import { db, pool } from "@/db";
import {
  directorProfile,
  projects,
  accolades,
  clientPartners,
  testimonials,
  faqs,
  inquiries,
} from "@/db/schema";
import { count } from "drizzle-orm";

let isInitialized = false;

export async function ensureSeeded() {
  if (isInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS director_profile (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        monogram TEXT NOT NULL,
        wordmark TEXT NOT NULL,
        role_tagline TEXT NOT NULL,
        location_tagline TEXT NOT NULL,
        availability_status TEXT NOT NULL,
        hero_headline TEXT NOT NULL,
        hero_subheadline TEXT NOT NULL,
        perspective_title TEXT NOT NULL,
        perspective_highlight TEXT NOT NULL,
        perspective_body TEXT NOT NULL,
        about_headline TEXT NOT NULL,
        about_highlight TEXT NOT NULL,
        about_bio TEXT NOT NULL,
        short_version TEXT NOT NULL,
        toolkit TEXT NOT NULL,
        email TEXT NOT NULL,
        location_footer TEXT NOT NULL,
        years_experience TEXT NOT NULL,
        fortune_clients_count TEXT NOT NULL,
        systems_launched_count TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        number_badge TEXT NOT NULL,
        title TEXT NOT NULL,
        client TEXT NOT NULL,
        category TEXT NOT NULL,
        year TEXT NOT NULL,
        featured BOOLEAN DEFAULT TRUE NOT NULL,
        sort_order INTEGER DEFAULT 1 NOT NULL,
        summary TEXT NOT NULL,
        role TEXT NOT NULL,
        disciplines TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        detail_hero_image TEXT NOT NULL,
        secondary_image TEXT NOT NULL,
        challenge TEXT NOT NULL,
        approach TEXT NOT NULL,
        outcome TEXT NOT NULL,
        director_note TEXT NOT NULL,
        impact_metrics JSONB NOT NULL,
        brand_palette JSONB NOT NULL,
        deliverables JSONB NOT NULL,
        live_url TEXT DEFAULT '' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS accolades (
        id SERIAL PRIMARY KEY,
        year TEXT NOT NULL,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        project_ref TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER DEFAULT 1 NOT NULL
      );

      CREATE TABLE IF NOT EXISTS client_partners (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        highlight_color BOOLEAN DEFAULT FALSE NOT NULL,
        engagement_role TEXT NOT NULL,
        sector TEXT NOT NULL,
        year_span TEXT NOT NULL,
        deliverable_highlight TEXT NOT NULL,
        sort_order INTEGER DEFAULT 1 NOT NULL
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL,
        author TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        is_spotlight BOOLEAN DEFAULT FALSE NOT NULL,
        sort_order INTEGER DEFAULT 1 NOT NULL
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER DEFAULT 1 NOT NULL
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT NOT NULL,
        scopes TEXT NOT NULL,
        budget_range TEXT NOT NULL,
        timeline TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New Brief' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    const [{ value: profileCount }] = await db
      .select({ value: count() })
      .from(directorProfile);

    if (Number(profileCount) === 0) {
      await db.insert(directorProfile).values({
        name: "Sarah Reese",
        monogram: "SR",
        wordmark: "SARAHREESE",
        roleTagline: "INDEPENDENT CREATIVE DIRECTOR",
        locationTagline: "CALIFORNIA / WORLDWIDE",
        availabilityStatus: "Booking Q2/Q3 Brand Systems & Creative Direction",
        heroHeadline:
          "Creative director crafting brands, campaigns and products people remember.",
        heroSubheadline:
          "Interdisciplinary visual artist with a knack for all things marketing. Over a decade of work with startups and Fortune 500 brands alike.",
        perspectiveTitle: "Strategy with a",
        perspectiveHighlight: "human pulse.",
        perspectiveBody:
          "Good design creates a feeling before it creates a thought. I build visual systems that make brands easier to understand, harder to forget, and a little more human.",
        aboutHeadline: "Curiosity is",
        aboutHighlight: "the specialty.",
        aboutBio:
          "I'm Sarah — here to make awesome stuff. I've been creating unique high-level visual and marketing strategies for over a decade. I've been lucky enough to have worked with startups and big companies alike — from independent boutique shops to Fortune 500 brands. In working with clients I seek to create partnerships to deliver strategic and emotionally resonant campaigns that successfully achieve brand goals.",
        shortVersion:
          "I turn strategy into visual language. Over a decade across startups, agencies, and Fortune 500 teams has taught me that the best work is both clear and surprising.",
        toolkit:
          "Brand strategy, identity systems, editorial design, UX/UI, art direction, campaign development, digital design, print, and the occasional deep dive into something entirely new.",
        email: "hi@sarahreesedesign.com",
        locationFooter:
          "Working remotely, based in California. Previously Seattle, WA.",
        yearsExperience: "12+ YRS",
        fortuneClientsCount: "15+ GLOBAL",
        systemsLaunchedCount: "65+ SHIPPED",
      });
    }

    const [{ value: projectCount }] = await db
      .select({ value: count() })
      .from(projects);

    if (Number(projectCount) === 0) {
      await db.insert(projects).values([
        {
          slug: "dii-brand-development",
          numberBadge: "01",
          title: "DI&I Brand Development",
          client: "eHealth",
          category: "BRANDING",
          year: "2024",
          featured: true,
          sortOrder: 1,
          summary:
            "Building a diversity and inclusion brand identity from the ground up for a national e-commerce healthcare leader.",
          role: "DI&I Brand Development",
          disciplines:
            "Brand Strategy / Identity Design / Illustration / Internal Communications",
          coverImage: "/images/projects/dii-brand.jpg",
          detailHeroImage: "/images/projects/natural-highs.jpg",
          secondaryImage: "/images/projects/dii-brand.jpg",
          challenge:
            "eHealth needed a visual identity for its diversity, equity and inclusion initiatives that felt authentic to employees and customers alike — not a bolt-on corporate gesture.",
          approach:
            "I developed a distinct sub-brand with its own palette, typography and illustration language, flexible enough to stretch across internal comms, recruiting and customer-facing campaigns while staying unmistakably part of the eHealth family.",
          outcome:
            "A living brand system adopted across internal communications, hiring campaigns and community outreach.",
          directorNote:
            "To avoid corporate clichés, we grounded the visual system in bespoke continuous-line ink illustrations and editorial portraiture—giving employee resource groups a modular toolkit they could genuinely own.",
          impactMetrics: [
            {
              label: "ERG Adoption Rate",
              value: "100%",
              detail: "Adopted across all internal Employee Resource Groups nationwide",
            },
            {
              label: "Talent Campaign Lift",
              value: "+64%",
              detail: "Increase in inclusive recruitment campaign engagement",
            },
            {
              label: "System Assets",
              value: "48+",
              detail: "Modular templates, custom illustrations & brand guidelines",
            },
          ],
          brandPalette: [
            { name: "Forest Emerald", hex: "#14452F" },
            { name: "Archive Alabaster", hex: "#F7F5F0" },
            { name: "Electric Chartreuse", hex: "#D4F82A" },
            { name: "Editorial Coral", hex: "#F26B4E" },
            { name: "Obsidian Ink", hex: "#111110" },
          ],
          deliverables: [
            "Sub-Brand Architecture & Naming System",
            "Bespoke Line-Art Illustration Library",
            "Internal Communications & Recruiting Deck System",
            "42-Page Living Brand Guidelines Playbook",
          ],
          liveUrl: "https://ehealth.com",
        },
        {
          slug: "natural-highs-brand-identity",
          numberBadge: "02",
          title: "Natural Highs — Brand Identity",
          client: "Natural Highs Recovery Group",
          category: "BRANDING",
          year: "2024",
          featured: true,
          sortOrder: 2,
          summary:
            "Reimagining holistic recovery and community wellness through expressive ink illustration and stigma-free visual storytelling.",
          role: "Creative Direction & Brand Identity",
          disciplines:
            "Brand Strategy / Identity Design / Custom Illustration / Print & Social Systems",
          coverImage: "/images/projects/natural-highs.jpg",
          detailHeroImage: "/images/projects/natural-highs.jpg",
          secondaryImage: "/images/projects/serendipity.jpg",
          challenge:
            "Natural Highs Recovery Group needed an approachable, deeply human identity in Melbourne, Victoria that broke away from sterile clinical tropes while resonating with youth and adults seeking mindful recovery.",
          approach:
            "Anchored by raw, expressive fountain-pen line illustrations and tactile editorial typography, I crafted an identity system that celebrates imperfection, warmth, and courageous personal transformation.",
          outcome:
            "Rolled out across digital platforms, 14.4K+ community social channels, workshop journals, and physical studio spaces—transforming how participants connect with recovery.",
          directorNote:
            "Every line drawing was sketched in a single continuous motion without lifting the pen—symbolizing resilience, continuity, and the beauty of an unedited human journey.",
          impactMetrics: [
            {
              label: "Community Growth",
              value: "14.4K",
              detail: "Active engaged followers across Melbourne & global chapters",
            },
            {
              label: "Workshop Attendance",
              value: "2.8x",
              detail: "Increase in first-time participant signups post-rebrand",
            },
            {
              label: "Touchpoints Unified",
              value: "30+",
              detail: "Print journals, mobile social systems & environmental signage",
            },
          ],
          brandPalette: [
            { name: "Warm Parchment", hex: "#F3F2EE" },
            { name: "India Ink", hex: "#121211" },
            { name: "Ochre Sun", hex: "#E5C646" },
            { name: "Terracotta Clay", hex: "#D15B3E" },
          ],
          deliverables: [
            "Primary & Secondary Logomark Suite",
            "Signature Ink Illustration Series",
            "Social Media & Community Storytelling System",
            "Printed Recovery Workbook & Merch Collection",
          ],
          liveUrl: "https://sarahreesedesign.com",
        },
        {
          slug: "serendipity-by-ae-wells",
          numberBadge: "03",
          title: "Serendipity by a.e. Wells",
          client: "Serendipity by a.e. Wells",
          category: "BRANDING",
          year: "2023",
          featured: true,
          sortOrder: 3,
          summary:
            "Editorial publication design, kinetic social campaign architecture, and interactive digital launch for a contemporary author and lifestyle voice.",
          role: "Art Direction & Campaign Systems",
          disciplines:
            "Editorial Design / Art Direction / Campaign Development / Digital UI",
          coverImage: "/images/projects/serendipity.jpg",
          detailHeroImage: "/images/projects/dii-brand.jpg",
          secondaryImage: "/images/projects/serendipity.jpg",
          challenge:
            "Launching an independent literary and lifestyle brand in a saturated digital landscape required an unmistakable visual hook that bridged classic editorial print sensibility with playful digital interactivity.",
          approach:
            "Combining rich forest greens, burnt terracotta, and high-contrast serif typography with interactive micro-campaigns ('be lazy / anger mode / get it done / do a little dance'), we created a cohesive world across print and mobile.",
          outcome:
            "Exceeded launch pre-order targets by 320% and established an enduring visual template for subsequent editions, podcasts, and reader activations.",
          directorNote:
            "We treated every social square and mobile interaction like a miniature magazine cover—pairing classic literary serifs with unapologetically modern UI micro-moments.",
          impactMetrics: [
            {
              label: "Launch Pre-Orders",
              value: "320%",
              detail: "Outperformed initial first-edition print run projection",
            },
            {
              label: "Social Engagement",
              value: "+195%",
              detail: "Share rate on interactive mood-selector campaign cards",
            },
            {
              label: "Campaign Deliverables",
              value: "75+",
              detail: "Book jacket, editorial lookbook & digital launch kit",
            },
          ],
          brandPalette: [
            { name: "Burnt Terracotta", hex: "#C84B28" },
            { name: "Canary Accent", hex: "#E8D33F" },
            { name: "Deep Emerald", hex: "#165038" },
            { name: "Carbon UI", hex: "#181817" },
          ],
          deliverables: [
            "Hardcover & Digital Publication Art Direction",
            "Studio Portrait Photography Direction",
            "Interactive Social Campaign & UI Sticker System",
            "Author Press Kit & Launch Microsite",
          ],
          liveUrl: "https://sarahreesedesign.com",
        },
        {
          slug: "restore-ot",
          numberBadge: "04",
          title: "Restore OT",
          client: "Restore OT",
          category: "BRANDING",
          year: "2023",
          featured: true,
          sortOrder: 4,
          summary:
            "Calm, tactile brand architecture and human-centered patient experience for a modern occupational therapy practice.",
          role: "Lead Creative Director",
          disciplines:
            "Brand Architecture / UX/UI Direction / Environmental Design / Art Direction",
          coverImage: "/images/projects/restore-ot.jpg",
          detailHeroImage: "/images/projects/restore-ot.jpg",
          secondaryImage: "/images/projects/natural-highs.jpg",
          challenge:
            "Restore OT wanted to replace clinical healthcare anxiety with calm, restorative confidence—requiring a complete overhaul of their visual identity, interior art direction, and digital patient onboarding.",
          approach:
            "Using warm alabaster tones, cyanotype botanical artwork, and serene architectural photography, I built a visual and digital ecosystem focused on clarity, accessibility, and sensory calm.",
          outcome:
            "Streamlined digital patient intake by 85% and elevated Restore OT into a premier flagship occupational therapy practice.",
          directorNote:
            "Healthcare design often forgets how nervous patients feel before walking through the door. Every color contrast, typographic hierarchy, and studio photograph was tuned to lower cortisol on sight.",
          impactMetrics: [
            {
              label: "Booking Conversion",
              value: "+85%",
              detail: "Increase in completed digital patient intake flows",
            },
            {
              label: "Patient Brand Trust",
              value: "4.9★",
              detail: "Post-visit perception rating for clarity and warmth",
            },
            {
              label: "System Rollout",
              value: "100%",
              detail: "Unified across web, clinic interiors, and patient guides",
            },
          ],
          brandPalette: [
            { name: "Sanctuary Stone", hex: "#EAE6DF" },
            { name: "Cyanotype Blue", hex: "#4A6B82" },
            { name: "Botanical Leaf", hex: "#3B5E4C" },
            { name: "Warm Walnut", hex: "#5A4638" },
          ],
          deliverables: [
            "Complete Visual Identity & Wordmark",
            "Clinic Interior & Photography Art Direction",
            "Patient Intake UX/UI & Digital Portal",
            "Accessible Print & Care Guide Templates",
          ],
          liveUrl: "https://sarahreesedesign.com",
        },
        {
          slug: "microsoft-google-executive-storytelling",
          numberBadge: "05",
          title: "Enterprise Investment & Keynote Systems",
          client: "Microsoft & Google",
          category: "CAMPAIGNS",
          year: "2024",
          featured: false,
          sortOrder: 5,
          summary:
            "High-stakes customer-facing presentation architecture and visual storytelling detailing existing and future product investments.",
          role: "Creative Director — Executive Comms",
          disciplines:
            "Executive Storytelling / Visual Systems / Data Visualization / Motion Direction",
          coverImage: "/images/projects/google-keynote.jpg",
          detailHeroImage: "/images/projects/google-keynote.jpg",
          secondaryImage: "/images/projects/dii-brand.jpg",
          challenge:
            "Enterprise product marketing teams needed to push creative boundaries during flagship customer roadshows and executive briefings while maintaining rigorous brand consistency.",
          approach:
            "I partnered directly with senior product marketing leaders to translate dense technical roadmaps into crystal-clear architectural diagrams, kinetic typography, and cohesive slide systems.",
          outcome:
            "Adopted by executive speakers and product marketing teams to communicate multi-year investment visions to global enterprise customers.",
          directorNote:
            "When presenting multi-million dollar cloud and AI roadmaps, clarity is persuasion. We stripped away cluttered slide tropes in favor of Apple-grade visual restraint.",
          impactMetrics: [
            {
              label: "Executive Decks",
              value: "25+",
              detail: "Keynote and customer-facing investment presentations",
            },
            {
              label: "Prep Velocity",
              value: "3.5x",
              detail: "Faster narrative assembly using modular component slides",
            },
            {
              label: "Stakeholder Alignment",
              value: "100%",
              detail: "Cross-org adoption across product marketing leadership",
            },
          ],
          brandPalette: [
            { name: "Keynote Obsidian", hex: "#0E0E0E" },
            { name: "Signal Chartreuse", hex: "#D4F82A" },
            { name: "Pulse Coral", hex: "#F26B4E" },
            { name: "Gallery White", hex: "#F7F5F0" },
          ],
          deliverables: [
            "Executive Keynote Visual Architecture",
            "Modular Data Visualization Component Library",
            "Customer Roadshow Narrative Decks",
            "Motion Transitions & Speaker Visual Guides",
          ],
          liveUrl: "https://sarahreesedesign.com",
        },
        {
          slug: "volvo-nordic-digital-campaign",
          numberBadge: "06",
          title: "Sustainable Mobility Editorial System",
          client: "Volvo",
          category: "PRODUCT & UI",
          year: "2023",
          featured: false,
          sortOrder: 6,
          summary:
            "Tactile digital lookbook and interactive campaign experience highlighting Scandinavian material sustainability and human-centric safety.",
          role: "Senior Art Director",
          disciplines:
            "Digital Product Design / Editorial Direction / Campaign Strategy / Design Systems",
          coverImage: "/images/projects/volvo-mobility.jpg",
          detailHeroImage: "/images/projects/volvo-mobility.jpg",
          secondaryImage: "/images/projects/restore-ot.jpg",
          challenge:
            "Communicating next-generation sustainable interior materials and electric mobility required an editorial digital experience that felt as tactile and composed as sitting inside the cabin.",
          approach:
            "We blended macro material photography, calm Nordic typography, and responsive interactive storytelling modules that invited drivers to explore sustainability metrics effortlessly.",
          outcome:
            "Delivered a high-converting digital campaign experience praised for its serene minimalism and unmistakable brand fidelity.",
          directorNote:
            "Luxury today is defined by restraint and transparency. We let raw wool textures, recycled polymers, and generous negative space carry the story.",
          impactMetrics: [
            {
              label: "Dwell Time",
              value: "4m 18s",
              detail: "Average interactive story exploration time",
            },
            {
              label: "Brochure Requests",
              value: "+52%",
              detail: "Lift in qualified electric vehicle configuration starts",
            },
            {
              label: "Global Markets",
              value: "12",
              detail: "Localized editorial campaign deployment",
            },
          ],
          brandPalette: [
            { name: "Nordic Birch", hex: "#EFECE6" },
            { name: "Fjord Slate", hex: "#2C3539" },
            { name: "Amber Signal", hex: "#E06D4C" },
            { name: "Graphite Iron", hex: "#161718" },
          ],
          deliverables: [
            "Interactive Editorial Microsite UX/UI",
            "Material Sustainability Visual Lexicon",
            "Multi-Market Social & Display Suite",
            "Design System Component Documentation",
          ],
          liveUrl: "https://sarahreesedesign.com",
        },
      ]);
    }

    const [{ value: accoladeCount }] = await db
      .select({ value: count() })
      .from(accolades);

    if (Number(accoladeCount) === 0) {
      await db.insert(accolades).values([
        {
          year: "2025",
          title: "Excellence in Brand Identity & Inclusive Systems",
          organization: "Communication Arts Design Annual",
          projectRef: "DI&I Brand Development — eHealth",
          category: "Integrated Brand System",
          sortOrder: 1,
        },
        {
          year: "2024",
          title: "Best Visual Storytelling & Executive Comms",
          organization: "Enterprise Creative Leadership Index",
          projectRef: "Microsoft & Fortune 500 Keynote Systems",
          category: "Strategic Presentation Architecture",
          sortOrder: 2,
        },
        {
          year: "2024",
          title: "Featured Independent Creative Director",
          organization: "Typewolf & Editorial Gallery Spotlight",
          projectRef: "Natural Highs & Serendipity Identity Suite",
          category: "Typography & Art Direction",
          sortOrder: 3,
        },
        {
          year: "2023",
          title: "Digital Experience & Print Craft Distinction",
          organization: "AIGA West Coast Design Showcase",
          projectRef: "Serendipity by a.e. Wells",
          category: "Editorial & Multi-Channel Launch",
          sortOrder: 4,
        },
        {
          year: "2022",
          title: "Human-Centered Healthcare Brand Transformation",
          organization: "Modern Wellness Design Awards",
          projectRef: "Restore OT Flagship Identity",
          category: "Brand Architecture & UX",
          sortOrder: 5,
        },
      ]);
    }

    const [{ value: partnerCount }] = await db
      .select({ value: count() })
      .from(clientPartners);

    if (Number(partnerCount) === 0) {
      await db.insert(clientPartners).values([
        {
          name: "Google",
          highlightColor: false,
          engagementRole: "Executive Keynote Systems & Cloud Brand Storytelling",
          sector: "Global Technology",
          yearSpan: "2021 — 2024",
          deliverableHighlight: "Multi-product visual narratives & keynote architecture",
          sortOrder: 1,
        },
        {
          name: "Volvo",
          highlightColor: true,
          engagementRole: "Sustainable Mobility Campaign & Digital Art Direction",
          sector: "Automotive & Mobility",
          yearSpan: "2022 — 2023",
          deliverableHighlight: "Nordic EV digital editorial systems & campaign UI",
          sortOrder: 2,
        },
        {
          name: "Dove",
          highlightColor: false,
          engagementRole: "Human-Centered Campaign Direction & Identity Assets",
          sector: "Consumer Beauty & Care",
          yearSpan: "2020 — 2022",
          deliverableHighlight: "Inclusive beauty campaign storytelling & print systems",
          sortOrder: 3,
        },
        {
          name: "Wimbledon",
          highlightColor: true,
          engagementRole: "Heritage Editorial Design & Digital Spectator Campaign",
          sector: "Global Sports & Culture",
          yearSpan: "2021 — 2022",
          deliverableHighlight: "Championship visual activations & social editorial kit",
          sortOrder: 4,
        },
        {
          name: "Lyst",
          highlightColor: false,
          engagementRole: "Fashion Intelligence Editorial & Brand Report Design",
          sector: "Luxury & Fashion Tech",
          yearSpan: "2022 — 2024",
          deliverableHighlight: "High-contrast data editorial reports & campaign identity",
          sortOrder: 5,
        },
        {
          name: "Microsoft",
          highlightColor: false,
          engagementRole: "Customer-Facing Investment Decks & Brand Consistency",
          sector: "Enterprise Cloud & AI",
          yearSpan: "2022 — Present",
          deliverableHighlight: "Executive presentations detailing existing & future investments",
          sortOrder: 6,
        },
        {
          name: "eHealth",
          highlightColor: true,
          engagementRole: "DI&I Sub-Brand Architecture & Marketing Leadership",
          sector: "National Healthcare",
          yearSpan: "2021 — 2024",
          deliverableHighlight: "Full DI&I visual identity, illustration library & internal comms",
          sortOrder: 7,
        },
      ]);
    }

    const [{ value: testimonialCount }] = await db
      .select({ value: count() })
      .from(testimonials);

    if (Number(testimonialCount) === 0) {
      await db.insert(testimonials).values([
        {
          quote:
            "She helped us push boundaries, while maintaining visual consistency and brand identity...integral in building customer-facing presentations, detailing our existing and future investments.",
          author: "Marissa Salazar",
          role: "Senior Product Marketing Manager",
          company: "Microsoft",
          isSpotlight: true,
          sortOrder: 1,
        },
        {
          quote:
            "Sara is one of the most talented creatives I have worked with. She is a visionary and a deeply experienced and eminently talented creative leader...",
          author: "Mark Waldo",
          role: "Director of Product Marketing",
          company: "eHealth",
          isSpotlight: false,
          sortOrder: 2,
        },
        {
          quote:
            "Sara is a gem and any company would be so lucky to work with her — she is independent, creative, always looks at the big picture, and fosters strong relationships with her team.",
          author: "Alejandra M.",
          role: "Project Manager",
          company: "Creative Partner",
          isSpotlight: false,
          sortOrder: 3,
        },
        {
          quote:
            "Her genuine interest in wanting to see others do their best makes her a great leader, along with excellent design skills.",
          author: "Andrew W.",
          role: "Designer",
          company: "Brand Studio",
          isSpotlight: false,
          sortOrder: 4,
        },
        {
          quote:
            "If you want her to do nice designs, give her lots of caffeine and compliments.",
          author: "Eric",
          role: "Client",
          company: "Founder & Executive Partner",
          isSpotlight: false,
          sortOrder: 5,
        },
      ]);
    }

    const [{ value: faqCount }] = await db
      .select({ value: count() })
      .from(faqs);

    if (Number(faqCount) === 0) {
      await db.insert(faqs).values([
        {
          question: "Who am I?",
          answer:
            "I'm Sarah. Here to make awesome stuff. I've been creating unique high level visual and marketing strategies for over a decade. I've been lucky enough to have worked with startups and big companies alike — from independent boutique shops to Fortune 500 brands. In working with clients I seek to create partnerships to deliver strategic and emotionally resonant campaigns that successfully achieve brand goals.",
          sortOrder: 1,
        },
        {
          question: "Where do you find inspiration?",
          answer:
            "Outside the algorithm first — mid-century editorial design archives, architectural galleries across California, contemporary printmakers, tactile packaging systems, and candid conversations with founders and audiences about what genuinely moves them.",
          sortOrder: 2,
        },
        {
          question: "What professional tools do you use?",
          answer:
            "Figma, Adobe Creative Cloud (Illustrator, InDesign, Photoshop, After Effects), Webflow, Keynote/PowerPoint executive systems, Cinema 4D, and modern AI-assisted concepting — though every enduring brand world still starts with sharp strategy and hand-drawn ink sketches.",
          sortOrder: 3,
        },
        {
          question: "What is your specialty?",
          answer:
            "Turning complex strategic positioning into cohesive, unforgettable visual systems — bridging brand identity, art direction, executive storytelling, editorial craft, and digital product experiences.",
          sortOrder: 4,
        },
      ]);
    }

    const [{ value: inquiryCount }] = await db
      .select({ value: count() })
      .from(inquiries);

    if (Number(inquiryCount) === 0) {
      await db.insert(inquiries).values([
        {
          name: "Elena Rostova",
          email: "elena@luminahealth.io",
          company: "Lumina Digital Health",
          scopes: "Brand Identity, Creative Direction, UX/UI System",
          budgetRange: "$35k – $60k",
          timeline: "Q2 Launch (8 Weeks)",
          message:
            "We loved your DI&I Brand Development work for eHealth and Restore OT. We are preparing for our Series B brand evolution and would love you to lead our visual identity and executive narrative.",
          status: "Priority Brief",
        },
      ]);
    }

    isInitialized = true;
  } catch (error) {
    console.error("Database seed check encountered an issue:", error);
  }
}
