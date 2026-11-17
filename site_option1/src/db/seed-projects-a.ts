import type { projects } from "./schema";

type NewProject = typeof projects.$inferInsert;

export const seedProjectsA: NewProject[] = [
  {
    slug: "dii-brand-development",
    title: "DI&I Brand Development",
    client: "eHealth",
    category: "brand",
    year: "2024",
    featured: true,
    sortOrder: 1,
    summary: "A diversity, equity and inclusion identity built from the ground up for a national e-commerce healthcare leader.",
    role: "Creative Director, Brand Lead",
    disciplines: ["Brand Strategy", "Identity Design", "Illustration", "Internal Communications"],
    coverImage: "/images/projects/dii-brand.jpg",
    heroImage: "/images/projects/dii-brand.jpg",
    challenge:
      "eHealth needed a visual identity for its diversity, equity and inclusion initiatives that felt authentic to employees and customers alike. The risk was a bolt-on corporate gesture: a rainbow of stock photography and a tagline nobody believed.",
    approach:
      "I built a distinct sub-brand with its own palette, typography and illustration language, flexible enough to stretch across internal comms, recruiting and customer-facing campaigns while staying unmistakably part of the eHealth family. Every decision started with a question: would an employee resource group be proud to put this on their own wall?",
    outcome:
      "A living brand system adopted across internal communications, hiring campaigns and community outreach, with a guidelines playbook the in-house team now extends without me.",
    directorNote:
      "To avoid corporate cliches, we grounded the system in bespoke continuous-line illustrations and editorial portraiture, giving employee resource groups a modular toolkit they could genuinely own.",
    metrics: [
      { value: "100%", label: "ERG adoption", detail: "Adopted by every employee resource group nationwide" },
      { value: "+64%", label: "Talent campaign lift", detail: "Increase in engagement on inclusive recruiting campaigns" },
      { value: "48+", label: "System assets", detail: "Modular templates, custom illustrations and guidelines" },
    ],
    process: [
      {
        title: "Listen first",
        duration: "Weeks 1-2",
        description:
          "Ran twelve listening sessions with employee resource group leads and HR partners. I asked what felt performative in past programs and what they wished leadership understood. Those answers became the creative brief.",
        outputs: ["Listening synthesis", "Creative brief", "Anti-goals list"],
      },
      {
        title: "Define the territory",
        duration: "Weeks 3-4",
        description:
          "Three directions presented as full-scale artifacts rather than mood boards. We chose the one that treated people as individuals instead of demographics, drawn rather than photographed, human and a little imperfect.",
        outputs: ["3 concept territories", "Naming options", "Stakeholder alignment deck"],
      },
      {
        title: "Build the system",
        duration: "Weeks 5-8",
        description:
          "Designed the palette, type pairing and a library of continuous-line illustrations with a small set of composition rules. Every asset was built as a template ERG leads could edit without a designer.",
        outputs: ["Color and type system", "Illustration library", "Template kit"],
      },
      {
        title: "Launch and hand off",
        duration: "Weeks 9-12",
        description:
          "Rolled out through an internal campaign, trained ERG leads, and wrote a 42-page living playbook covering voice, visuals and do-not-use examples.",
        outputs: ["Launch campaign", "42-page playbook", "Training session"],
      },
    ],
    paletteStory:
      "Healthcare palettes default to clinical blue and reassuring teal. We deliberately left that world. The DI&I palette borrows from editorial print: deep, warm and confident, with one unexpected high-energy accent so the system feels alive rather than institutional.",
    palette: [
      {
        name: "Forest Emerald",
        hex: "#14452F",
        role: "Primary",
        rationale:
          "A deep, grounded green that signals growth and care without the sterility of medical blue. It carries white type at AAA contrast, so it works for headlines on both print and screen.",
      },
      {
        name: "Archive Alabaster",
        hex: "#F7F5F0",
        role: "Neutral",
        rationale: "A warm paper white. It softens the system and lets illustration read like ink on paper, not a screen graphic.",
      },
      {
        name: "Electric Chartreuse",
        hex: "#D4F82A",
        role: "Accent",
        rationale:
          "The optimism. Used sparingly, as a highlighter-style mark, it gives every layout one point of energy and makes recruiting assets stand out in a crowded feed.",
      },
      {
        name: "Editorial Coral",
        hex: "#F26B4E",
        role: "Secondary accent",
        rationale: "Adds human warmth and pairs with Forest Emerald as near-complements. Reserved for emphasis words in headlines.",
      },
      {
        name: "Obsidian Ink",
        hex: "#111110",
        role: "Text",
        rationale: "Near-black rather than pure black to keep long-form body copy comfortable and consistent with the print feel.",
      },
    ],
    typography: [
      {
        role: "Display",
        family: "Tight grotesk, medium weight",
        classification: "sans",
        sample: "Everyone belongs here.",
        rationale: "Tight tracking and generous size make headlines feel confident and modern, never institutional.",
      },
      {
        role: "Body",
        family: "Humanist sans, regular",
        classification: "sans",
        sample: "Our ERGs shape how we hire, build and care.",
        rationale: "An open humanist body face for readability across intranet, print and plan documents.",
      },
    ],
    voiceNarrative:
      "The voice is warm, specific and unpretentious. We wrote the way people in the company actually talk and removed jargon like 'underrepresented populations' wherever a plain sentence would do.",
    voicePrinciples: ["Specific over sweeping", "Invite, never instruct", "Name people, not categories"],
    copyExamples: [
      {
        before: "We celebrate diverse backgrounds and perspectives across our global workforce.",
        after: "Bring the whole story. We built this team to hear it.",
        note: "Replaced a generic claim with an invitation that sounds like a person said it.",
      },
      {
        before: "Join our inclusive culture of belonging.",
        after: "You do your best work when you don't have to edit yourself.",
        note: "Moved from a corporate noun phrase to the employee's lived experience.",
      },
    ],
    hurdles: [
      {
        kind: "Legal",
        title: "Equal opportunity language",
        constraint:
          "Recruiting copy cannot imply a preference for, or exclusion of, any protected class. Early drafts that said 'we're looking for women in tech' crossed that line.",
        resolution:
          "Rewrote all recruiting lines as invitations to everyone, and reserved identity-specific messaging for ERG community channels. Counsel reviewed the full phrase bank before launch.",
      },
      {
        kind: "Consent",
        title: "Imagery and likeness",
        constraint: "Employee portraits can't be reused across campaigns without explicit, scoped releases.",
        resolution:
          "Shifted the core system to commissioned illustration. Where photography appears, each release names the exact channels and duration.",
      },
      {
        kind: "Accessibility",
        title: "Contrast on chartreuse",
        constraint: "Chartreuse on white fails contrast requirements.",
        resolution: "Chartreuse is only ever a background or highlight behind Obsidian Ink. Never as text on a light surface.",
      },
    ],
    decisions: [
      {
        area: "Layout",
        decision: "Asymmetric editorial grids with one oversized headline per layout",
        rationale: "A single dominant idea per page keeps even dense internal communications scannable.",
      },
      {
        area: "Imagery",
        decision: "Hand-drawn line art over stock photography",
        rationale: "Illustration avoids tokenizing real people and lets us represent anyone without staging a photo shoot.",
      },
      {
        area: "Naming",
        decision: "No acronym in the headline. 'DI&I' lives in a small label.",
        rationale: "The people matter more than the acronym, and the acronym tested as jargon in listening sessions.",
      },
    ],
    gallery: [{ src: "/images/projects/dii-brand.jpg", caption: "Editorial portrait plate from the recruiting campaign" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Mark Waldo", role: "Product Marketing Partner" },
      { name: "Priya Anand", role: "Illustrator" },
      { name: "Chris Dalton", role: "Legal & HR Counsel" },
    ],
  },
  {
    slug: "natural-highs-brand-identity",
    title: "Natural Highs: Brand Identity",
    client: "Natural Highs Recovery Group",
    category: "brand",
    year: "2023",
    featured: true,
    sortOrder: 2,
    summary: "A hand-drawn, human identity for a recovery community that refuses to look clinical.",
    role: "Creative Director, Identity Designer",
    disciplines: ["Naming Review", "Identity Design", "Illustration", "Social Direction"],
    coverImage: "/images/projects/natural-highs.jpg",
    heroImage: "/images/projects/natural-highs.jpg",
    demoSlug: "natural-highs",
    challenge:
      "Recovery brands tend to choose between two bad options: cold clinical authority or saccharine inspirational stock photography. Natural Highs wanted to feel like a trusted friend who happens to have a clinical team behind them.",
    approach:
      "The identity starts from a single expressive ink fox: curious, alert and a little wild. Everything else stays quiet around it: a calm palette, patient typography and copy that talks like a person. The fox sketches are hand-drawn so they never look like a template.",
    outcome:
      "A flexible identity across web, social and print. The group's Instagram followers more than doubled in the first six months, and intake staff report prospective members referencing the fox on first calls.",
    directorNote:
      "In recovery, polish can read as distance. We kept the imperfect line on purpose. It tells someone the brand isn't pretending to have it all figured out.",
    metrics: [
      { value: "2.3x", label: "Social following", detail: "Growth in the first six months after launch" },
      { value: "9", label: "Fox poses", detail: "Hand-drawn illustration library for web and social" },
      { value: "3", label: "Channels unified", detail: "Web, social and printed community materials" },
    ],
    process: [
      {
        title: "Immersion",
        duration: "Week 1",
        description:
          "Sat in on open community sessions as an observer, with consent from everyone in the room. I read intake materials and documented every word members used to describe what they wanted. 'Seen' and 'not judged' came up more than 'cured'.",
        outputs: ["Language inventory", "Audience tension map"],
      },
      {
        title: "Mark-making",
        duration: "Weeks 2-4",
        description:
          "Filled sketchbooks. Five animals were explored. The fox won because it reads as resourceful and adaptable, the survivor archetype, with none of the cuteness of a puppy or the aggression of a wolf.",
        outputs: ["Sketch explorations", "Mark shortlist"],
      },
      {
        title: "System and tone",
        duration: "Weeks 5-7",
        description: "Locked a tight palette, paired type, and wrote a voice guide with phrase banks for web, social and print.",
        outputs: ["Palette and type system", "Voice guide"],
      },
      {
        title: "Roll-out",
        duration: "Weeks 8-10",
        description: "Delivered the site, social templates and printed welcome kits, then trained staff on how to draw their own fox variations.",
        outputs: ["Website", "Social templates", "Welcome kit"],
      },
    ],
    paletteStory:
      "Recovery imagery usually lives in cool blues and purples. We went warm and natural. The palette feels like a morning outdoors: paper, earth and one flash of sunrise.",
    palette: [
      {
        name: "Bone",
        hex: "#E9E6DE",
        role: "Base",
        rationale: "A paper-like off-white so ink illustrations feel physical rather than digital.",
      },
      {
        name: "Charcoal Ink",
        hex: "#1B1B1A",
        role: "Text and line",
        rationale: "The color of the fox drawing itself. Used for all body copy and illustration.",
      },
      {
        name: "Sunrise Orange",
        hex: "#E8743B",
        role: "Accent",
        rationale: "Echoes the fox's coat and signals 'new day' without leaning on cliche sunrise imagery. Used for calls to action only.",
      },
      {
        name: "Moss",
        hex: "#5C6B4A",
        role: "Support",
        rationale: "A grounded green that references the natural-highs concept and adds depth to long-form pages.",
      },
      {
        name: "Dusk Blue",
        hex: "#3D4F63",
        role: "Support",
        rationale: "A quiet counterweight to orange, used for confidential and safe-space messaging so it feels calm.",
      },
    ],
    typography: [
      {
        role: "Display",
        family: "Soft transitional serif, italic accents",
        classification: "serif",
        sample: "You don't have to do this alone.",
        rationale: "Serif warmth makes headlines feel written, not marketed. Italics add a conversational voice.",
      },
      {
        role: "Interface",
        family: "Neutral grotesk",
        classification: "sans",
        sample: "Join a community session this week.",
        rationale: "Clean, quiet UI type that stays out of the way when someone is in a vulnerable moment.",
      },
    ],
    voiceNarrative:
      "We wrote like a friend with credentials. Short sentences, second person, no medical jargon on first contact, and never any promise we can't keep.",
    voicePrinciples: ["Plain words first", "Never promise outcomes", "Lead with belonging"],
    copyExamples: [
      {
        before: "Evidence-based inpatient and outpatient substance abuse treatment.",
        after: "Real support from people who've been there, and clinicians who know the science.",
        note: "Leads with human connection; clinical credentials follow in the second clause.",
      },
      {
        before: "Start your journey to a cured life today.",
        after: "Take the first step. We'll walk the next one with you.",
        note: "Removed 'cured' entirely. It is both inaccurate and a regulatory risk.",
      },
    ],
    hurdles: [
      {
        kind: "Regulatory",
        title: "Treatment advertising rules",
        constraint:
          "Substance-use treatment advertising is tightly regulated. We could not imply guaranteed outcomes, success rates without substantiation, or cure language.",
        resolution:
          "Built a pre-approved phrase bank with the compliance lead. All outcome-related statements link to a documented source, and the voice guide includes a 'never say' list.",
      },
      {
        kind: "Privacy",
        title: "Protecting members",
        constraint:
          "Recovery program participation is sensitive health information. Real member photography was off the table without exceptional consent.",
        resolution:
          "Moved the whole identity to illustration. The fox became the 'face' of the community, letting us show belonging without exposing anyone.",
      },
      {
        kind: "Stakeholder",
        title: "Clinical team vs. warmth",
        constraint: "The clinical team worried that a hand-drawn mark would undermine credibility.",
        resolution:
          "Presented side-by-side tests with intake counselors. The warmer system outperformed with prospective members, and the clinical team approved the approach with credentials placed prominently in every footer.",
      },
    ],
    decisions: [
      {
        area: "Mark",
        decision: "A different fox pose for every context instead of a locked logo",
        rationale: "The mark behaves like a community, not a corporation. It is consistent in line quality and varied in pose.",
      },
      {
        area: "Layout",
        decision: "Large type, one idea, a lot of white space on web",
        rationale: "Visitors may be anxious. We reduced cognitive load so the next step is always obvious.",
      },
      {
        area: "Color",
        decision: "Orange reserved for action only",
        rationale: "Predictable emphasis builds trust. Orange always means 'you can do something here'.",
      },
    ],
    gallery: [{ src: "/images/projects/natural-highs.jpg", caption: "Primary fox illustration, ink on handmade paper" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Dana Whitlock", role: "Program Director" },
      { name: "Eli Park", role: "Front-end Developer" },
    ],
  },
  {
    slug: "serendipity-by-ae-wells",
    title: "Serendipity by a.e. Wells",
    client: "a.e. Wells",
    category: "brand",
    year: "2023",
    featured: true,
    sortOrder: 3,
    summary: "A playful, social-first lifestyle brand built around the idea that the best things happen when you stop forcing them.",
    role: "Creative Director, Brand and Social Lead",
    disciplines: ["Naming and Trademark Support", "Identity", "Social Direction", "Packaging"],
    coverImage: "/images/projects/serendipity.jpg",
    heroImage: "/images/projects/serendipity.jpg",
    demoSlug: "serendipity",
    challenge:
      "a.e. Wells was launching a lifestyle line into a market full of minimalist beige. The goal was a brand with a point of view that could live natively on social, one that gave people permission to be a little lazy, a little loud and entirely themselves.",
    approach:
      "We built the brand around a manifesto of permission slips (be lazy, anger mode, get it done, do a little dance) and put it on a loud, sun-baked palette that looks like nothing else in the category. Social was designed first, with print and packaging derived from it.",
    outcome:
      "A distinctive brand world launched with a full social template system, packaging and a founder-voiced manifesto that became the most-saved content in the brand's feed.",
    directorNote:
      "Serendipity can't be art-directed in a literal sense. What I art-directed was the environment where surprise is possible: bold color, clear rules and space to play.",
    metrics: [
      { value: "4", label: "Permission slips", detail: "Manifesto lines that anchor all content" },
      { value: "30+", label: "Social templates", detail: "Built for stories, posts and reels" },
      { value: "1", label: "Launch week", detail: "Full brand world shipped on day one" },
    ],
    process: [
      {
        title: "Find the feeling",
        duration: "Weeks 1-2",
        description: "Workshopped with the founder to define the emotional core. We weren't describing a product, we were describing a mood: unhurried, sunlit and slightly mischievous.",
        outputs: ["Emotional brief", "Brand attributes"],
      },
      {
        title: "Name and protect",
        duration: "Weeks 2-4",
        description:
          "'Serendipity' is a common word, so I worked with counsel to build a distinctive lockup ('Serendipity by a.e. Wells') and mapped the trademark classes that mattered before design began.",
        outputs: ["Lockup system", "Trademark class map"],
      },
      {
        title: "Color and voice",
        duration: "Weeks 4-6",
        description: "Tested seven palettes at thumbnail size, because 90% of first impressions would be on a phone. Wrote the manifesto and a bank of lines for different moods.",
        outputs: ["Palette", "Manifesto", "Voice bank"],
      },
      {
        title: "Social-first toolkit",
        duration: "Weeks 6-9",
        description: "Built a template library and a content rhythm in which every third post is a rule-breaker by design.",
        outputs: ["Template library", "Content rhythm", "Packaging system"],
      },
    ],
    paletteStory:
      "Beige is the default for wellness. We went the other way: burnt orange, mustard and a deep forest anchor, colors you would see on an afternoon you didn't plan.",
    palette: [
      {
        name: "Burnt Sienna",
        hex: "#D1522B",
        role: "Primary",
        rationale: "Warm, saturated and instantly recognizable in a thumbnail-size feed. It anchors the brand at a distance.",
      },
      {
        name: "Mustard Sun",
        hex: "#E3C23A",
        role: "Secondary",
        rationale: "Creates the contrast block against orange that makes screens feel sun-bleached and joyful.",
      },
      {
        name: "Forest Anchor",
        hex: "#1F5A3E",
        role: "Grounding",
        rationale: "A deep green to rest the eye and stop the palette from feeling like a sports brand.",
      },
      {
        name: "Linen",
        hex: "#F4ECDD",
        role: "Neutral",
        rationale: "A soft cream for text-heavy posts and packaging inserts.",
      },
    ],
    typography: [
      {
        role: "Display",
        family: "High-contrast serif, oversized",
        classification: "serif",
        sample: "Serendipity",
        rationale: "Enormous, cropped serif lettering feels like a magazine cover and gives the brand its gloss.",
      },
      {
        role: "Manifesto",
        family: "Monospaced caption",
        classification: "mono",
        sample: "be lazy / anger mode / get it done",
        rationale: "A utilitarian, note-to-self feeling for the permission slips, in sharp contrast to the display serif.",
      },
    ],
    voiceNarrative:
      "Voice is warm, wry and permission-granting. Lowercase, short lines, and a refusal to hustle-shame. It is a friend telling you it's fine to cancel your plans.",
    voicePrinciples: ["Give permission, not orders", "Humor over hype", "Lowercase is a mood"],
    copyExamples: [
      {
        before: "Maximize your productivity and unlock your best self.",
        after: "get it done. or don't. do a little dance first.",
        note: "Flipped the productivity cliche to reflect the brand's whole stance.",
      },
      {
        before: "Shop our new spring collection now.",
        after: "new things. no pressure.",
        note: "Selling by removing urgency, which became a signature of the feed.",
      },
    ],
    hurdles: [
      {
        kind: "Legal",
        title: "Trademarking a common word",
        constraint: "'Serendipity' is already used across many categories and would be difficult to defend alone.",
        resolution:
          "Designed the lockup 'Serendipity by a.e. Wells' as the legal and visual unit, then ran a clearance search across the relevant classes before any asset was produced.",
      },
      {
        kind: "Platform",
        title: "Designing for a thumbnail",
        constraint: "Most people would see the brand for less than a second at 120 pixels wide.",
        resolution: "Every template was judged first at thumbnail scale. If the idea wasn't readable at that size, it was redesigned.",
      },
    ],
    decisions: [
      {
        area: "Color",
        decision: "Two loud warm colors and a quiet green, with no cool neutrals",
        rationale: "A restrictive palette is what makes the brand recognizable without a logo.",
      },
      {
        area: "Layout",
        decision: "Crop the logotype off the edge of the frame",
        rationale: "Cropping implies the brand is bigger than the frame and invites the viewer in.",
      },
      {
        area: "Copy",
        decision: "Every fourth post has no product in it",
        rationale: "Builds the brand as a point of view first, a store second.",
      },
    ],
    gallery: [{ src: "/images/projects/serendipity.jpg", caption: "Campaign still, burnt sienna and mustard sun" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Alexandra Wells", role: "Founder" },
      { name: "Noor Haddad", role: "Social Strategist" },
    ],
  },
  {
    slug: "restore-ot-brand-and-web",
    title: "Restore OT",
    client: "Restore OT",
    category: "web",
    year: "2022",
    featured: true,
    sortOrder: 4,
    summary: "A calm, photography-led brand and website for an occupational therapy practice that helps people get back to what they love.",
    role: "Creative Director, Web Experience Lead",
    disciplines: ["Brand Strategy", "Photography Direction", "Web Design", "Content Strategy"],
    coverImage: "/images/projects/restore-ot.jpg",
    heroImage: "/images/projects/restore-ot.jpg",
    demoSlug: "restore-ot",
    challenge:
      "Occupational therapy is poorly understood. People hear 'OT' and think job placement. Restore needed to explain what they do in seconds and make a nervous first-time patient feel at ease, all within healthcare marketing rules.",
    approach:
      "We designed around one idea: you are returning to life, not being treated for a condition. Photography shows people in ordinary, human moments. The website reads like a conversation, not a service menu.",
    outcome:
      "A site that explains OT in one scroll and drives bookings through a single, low-friction path. New-patient inquiries rose 41% in the first quarter.",
    directorNote:
      "The best photograph in the whole shoot was a man seen from behind, looking at a map on the wall. It says 'the person is the point' better than any smiling headshot could.",
    metrics: [
      { value: "+41%", label: "New-patient inquiries", detail: "First quarter after launch" },
      { value: "7s", label: "Time to 'get it'", detail: "Explainer comprehension in usability testing" },
      { value: "AA", label: "WCAG level", detail: "Across every page and component" },
    ],
    process: [
      {
        title: "Patient interviews",
        duration: "Weeks 1-2",
        description: "With consent, I interviewed past patients and their families about their first appointment: what they feared, what they were confused by, and what they wished they had known.",
        outputs: ["Insight themes", "Anxiety-to-answer map"],
      },
      {
        title: "Message hierarchy",
        duration: "Weeks 3-4",
        description: "Wrote the homepage in plain language before designing a single screen. If a sentence needed a medical term, it moved lower on the page.",
        outputs: ["Message hierarchy", "Site map", "Copy deck"],
      },
      {
        title: "Photography direction",
        duration: "Weeks 4-6",
        description: "Directed a two-day shoot with a shot list built around daily activities (gardening, cooking, typing) instead of therapy equipment.",
        outputs: ["Shot list", "Photo library", "Usage guide"],
      },
      {
        title: "Design and build",
        duration: "Weeks 6-12",
        description: "Designed mobile-first, because most prospective patients were searching on phones. Tested with older adults and caregivers, then launched.",
        outputs: ["Responsive site", "Accessibility audit", "Booking flow"],
      },
    ],
    paletteStory:
      "Clinics are drawn in clinical white and hospital blue. Restore's palette is drawn from the home: slate, linen, sage and a warm terracotta, so the practice feels like a room you want to walk into.",
    palette: [
      { name: "Glacier", hex: "#CFDCE0", role: "Surface", rationale: "A hushed blue-grey background that nods to wellness without hospital coldness." },
      { name: "Slate", hex: "#2F3E46", role: "Text and UI", rationale: "Dark but soft. High contrast for readability for older audiences while avoiding harsh black." },
      { name: "Terracotta", hex: "#C8745A", role: "Action", rationale: "Warm and human. It is used only on booking buttons so the path forward is unmistakable." },
      { name: "Linen", hex: "#F3EEE6", role: "Base", rationale: "A warm neutral that keeps long reading comfortable." },
      { name: "Sage", hex: "#8FA58A", role: "Support", rationale: "A calming, plant-derived green echoing the interior photography." },
    ],
    typography: [
      {
        role: "Headlines",
        family: "Friendly geometric sans, semibold",
        classification: "sans",
        sample: "Get back to what you love.",
        rationale: "Open letterforms are approachable and highly legible on small screens.",
      },
      {
        role: "Body",
        family: "Large humanist sans, 18px minimum",
        classification: "sans",
        sample: "We meet you where you are, at home, at work or in our clinic.",
        rationale: "A generous base size ensures comfort for older users without looking oversized.",
      },
    ],
    voiceNarrative:
      "Calm, plain and reassuring. We explained what happens in the first appointment in short, concrete sentences. Nothing sounds like a diagnosis.",
    voicePrinciples: ["Explain, don't diagnose", "Everyday verbs", "Remove the fear of the first visit"],
    copyExamples: [
      {
        before: "Comprehensive occupational therapy evaluation and intervention services.",
        after: "Tell us what you want to get back to. We'll build the plan around it.",
        note: "Moved from service-menu language to the person's goal.",
      },
      {
        before: "Our therapists help patients regain independence.",
        after: "Cooking dinner. Typing an email. Playing with your grandkids. That's the work.",
        note: "Concrete examples explain OT faster than any definition.",
      },
    ],
    hurdles: [
      {
        kind: "Privacy",
        title: "Patient stories and imagery",
        constraint: "Patient health information is protected, so real patient stories and photos needed explicit authorization and could not identify conditions.",
        resolution: "Used models and written, scoped releases for every image, with stories told as composites in which no condition is attributed to a real person.",
      },
      {
        kind: "Compliance",
        title: "Credential and claims language",
        constraint: "State rules govern how therapist credentials and treatment claims can be described in marketing.",
        resolution: "Credentials are stated exactly as licensed, no efficacy claims are made, and the compliance officer reviewed all copy before publication.",
      },
      {
        kind: "Accessibility",
        title: "An older, caregiver-heavy audience",
        constraint: "Many visitors are older adults or stressed caregivers on small screens.",
        resolution: "18px body type, 48px touch targets, no hover-dependent interactions and AA contrast throughout, all validated in testing sessions.",
      },
    ],
    decisions: [
      {
        area: "Imagery",
        decision: "Ordinary moments over therapy equipment",
        rationale: "People don't want to see a treatment table. They want to see the life they're returning to.",
      },
      {
        area: "Layout",
        decision: "One primary action per screen",
        rationale: "A stressed visitor can only handle one decision. Every page ends in the same booking button.",
      },
      {
        area: "Navigation",
        decision: "Four items maximum",
        rationale: "Reduced the menu from nine items to four after testing showed users scanned and gave up on the longer menu.",
      },
    ],
    gallery: [{ src: "/images/projects/restore-ot.jpg", caption: "Photography direction: the person is the point" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Dr. Maya Ellison", role: "Clinical Director" },
      { name: "Tom Becker", role: "Photographer" },
      { name: "Eli Park", role: "Front-end Developer" },
    ],
  },
];
