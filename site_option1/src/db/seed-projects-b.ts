import type { projects } from "./schema";

type NewProject = typeof projects.$inferInsert;

export const seedProjectsB: NewProject[] = [
  {
    slug: "enterprise-investment-keynote",
    title: "Enterprise Investment & Keynote Systems",
    client: "Microsoft & Google",
    category: "campaign",
    year: "2024",
    featured: false,
    sortOrder: 5,
    summary: "A customer-facing presentation system that turned complex investment roadmaps into stories executives could tell in the room.",
    role: "Creative Director, Presentation Systems Lead",
    disciplines: ["Narrative Design", "Presentation Systems", "Data Visualization", "Executive Storytelling"],
    coverImage: "/images/projects/enterprise-keynote.jpg",
    heroImage: "/images/projects/enterprise-keynote.jpg",
    challenge:
      "Product marketing teams needed customer-facing presentations that detailed existing and future investments, with dozens of contributors, strict partner-brand rules and a very small margin for error on forward-looking statements.",
    approach:
      "Instead of designing a deck, I designed the system behind it: a narrative spine, a modular slide library and a visual language for data that let any presenter tell one clear story. Brand rules were baked into the templates so compliance happens by default.",
    outcome:
      "A shared presentation system now used across customer briefings. Contributors build faster, legal review cycles shortened, and the story stays consistent from the first slide to the last.",
    directorNote:
      "A good keynote has one idea per slide and one feeling per section. Our job was to make that the easy path for people who build decks at 11 PM before a briefing.",
    metrics: [
      { value: "-40%", label: "Review cycle time", detail: "Legal and brand review shortened by pre-approved modules" },
      { value: "60+", label: "Slide modules", detail: "Narrative, data and roadmap layouts in the library" },
      { value: "1", label: "Narrative spine", detail: "One story structure used by every presenter" },
    ],
    process: [
      {
        title: "Audit the sprawl",
        duration: "Weeks 1-2",
        description: "Collected and mapped 150+ existing decks. We found 11 different ways of showing a roadmap, and most contradicted each other.",
        outputs: ["Deck audit", "Pattern inventory"],
      },
      {
        title: "Write the spine",
        duration: "Weeks 3-4",
        description: "Defined a five-beat narrative (context, tension, investment, proof, next step) and tested it with sellers in live rehearsals.",
        outputs: ["Narrative framework", "Presenter notes guide"],
      },
      {
        title: "Design the modules",
        duration: "Weeks 5-9",
        description: "Designed a library of layout modules with locked brand constraints and flexible content. Charts follow one data visual grammar so numbers are compared fairly.",
        outputs: ["Slide library", "Data visual grammar"],
      },
      {
        title: "Equip and measure",
        duration: "Weeks 10-12",
        description: "Ran workshops, built a quick-start guide and tracked review turnaround and adoption through the first two quarters.",
        outputs: ["Workshops", "Quick-start guide", "Adoption dashboard"],
      },
    ],
    paletteStory:
      "Two powerful partner brands meant neither could dominate. The palette is deliberately neutral and dark, letting partner marks sit as equals while data accents carry the story.",
    palette: [
      { name: "Stage Black", hex: "#0B0C10", role: "Background", rationale: "Dark stages make projected color vivid in a conference room and reduce glare on screens." },
      { name: "Signal Cobalt", hex: "#2F6BFF", role: "Primary data", rationale: "A confident, trustworthy hue for the main series in every chart." },
      { name: "Aurora Violet", hex: "#8B5CF6", role: "Secondary data", rationale: "Distinct from cobalt even for most color-blind viewers, so comparison charts stay clear." },
      { name: "Amber Cue", hex: "#F5A524", role: "Highlight", rationale: "Used once per slide to point at the number that matters." },
      { name: "Paper", hex: "#F4F4F2", role: "Text", rationale: "A softer white that is easier on the eyes than pure white on a dark ground." },
    ],
    typography: [
      {
        role: "Headlines",
        family: "Large, tight grotesk",
        classification: "sans",
        sample: "Where we are investing next.",
        rationale: "Short declarative headlines at 60pt+ so they are legible from the back of the room.",
      },
      {
        role: "Data",
        family: "Tabular monospace for figures",
        classification: "mono",
        sample: "$4.2B / 18 regions / 2026",
        rationale: "Tabular figures align cleanly so numbers can be compared at a glance.",
      },
    ],
    voiceNarrative:
      "Confident but careful. Claims are specific, tied to a source and phrased so a presenter can say them out loud without sounding like a press release.",
    voicePrinciples: ["One claim per slide", "Say the number, then the meaning", "Plain verbs over buzzwords"],
    copyExamples: [
      {
        before: "Leveraging synergistic platform capabilities to enable transformative outcomes.",
        after: "Three investments. One goal: your teams ship faster.",
        note: "Replaced jargon with a countable structure presenters remember.",
      },
      {
        before: "We will deliver significant growth in the coming years.",
        after: "Planned for 2026: expanded capacity in 18 regions. Subject to the forward-looking statement on slide 2.",
        note: "Specific, sourced, and legally anchored.",
      },
    ],
    hurdles: [
      {
        kind: "Legal",
        title: "Forward-looking statements",
        constraint: "Slides describing future investments must carry accurate disclaimers and avoid implied commitments.",
        resolution: "Built a locked disclaimer module into every roadmap layout, plus a 'future tense' label that visually separates plans from facts.",
      },
      {
        kind: "Brand",
        title: "Two partner brands, no hierarchy",
        constraint: "Partner brand guidelines each prescribe clear space, logo order and color use.",
        resolution: "Created co-brand lockups that satisfy both rule sets. Neither logo can be recolored or resized in the template.",
      },
      {
        kind: "Confidentiality",
        title: "NDA-bound content",
        constraint: "Some customer content is under NDA and can't appear in shared libraries.",
        resolution: "Sample content uses clearly marked, fictional data, and a separate private layer is available per account team.",
      },
    ],
    decisions: [
      {
        area: "Layout",
        decision: "One idea per slide with a fixed headline zone",
        rationale: "Consistency across authors makes the final deck read as if written by one person.",
      },
      {
        area: "Data",
        decision: "Max two series per chart, with amber reserved for the takeaway",
        rationale: "Forces the author to decide what the audience should notice.",
      },
      {
        area: "Process",
        decision: "Compliance-by-template instead of compliance-by-review",
        rationale: "Moving rules into the layout removes whole categories of review comments.",
      },
    ],
    gallery: [{ src: "/images/projects/enterprise-keynote.jpg", caption: "Keynote opener, stage black with signal cobalt and aurora violet" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Marissa Salazar", role: "Senior Product Marketing Manager" },
      { name: "Jonah Reyes", role: "Data Visualization Designer" },
    ],
  },
  {
    slug: "sustainable-mobility-education",
    title: "Sustainable Mobility Education Hub",
    client: "Volvo",
    category: "web",
    year: "2024",
    featured: false,
    sortOrder: 6,
    summary: "A product and UI experience that teaches drivers what electrification actually means, without greenwashing a single sentence.",
    role: "Creative Director, UX/UI Lead",
    disciplines: ["UX/UI", "Content Design", "Information Architecture", "Motion Principles"],
    coverImage: "/images/projects/mobility-hub.jpg",
    heroImage: "/images/projects/mobility-hub.jpg",
    challenge:
      "Prospective EV drivers are curious but overwhelmed: range, charging, grid sources, battery lifecycle. The hub needed to educate honestly, in a category where environmental claims are legally and ethically fraught.",
    approach:
      "I treated it like an editorial product: short, visual explainers, honest ranges instead of single numbers and every environmental claim attached to its source. The interface borrows from Scandinavian restraint: quiet, clear and unhurried.",
    outcome:
      "A hub that became the default link in sales conversations. Visitors who used the charging explainer were far more likely to book a test drive, and the legal team approved the claims framework as a reusable standard.",
    directorNote:
      "Sustainability design fails when it performs virtue. We replaced 'eco' imagery with specificity: numbers, ranges, trade-offs, and the honesty to say what we don't know yet.",
    metrics: [
      { value: "2.6x", label: "Test-drive intent", detail: "Visitors who used the charging explainer vs. those who didn't" },
      { value: "AA", label: "WCAG level", detail: "Across all templates and interactive explainers" },
      { value: "100%", label: "Claims sourced", detail: "Every environmental statement links to a citation" },
    ],
    process: [
      {
        title: "Question mining",
        duration: "Weeks 1-3",
        description: "Pulled the 200 most-asked EV questions from search data, dealership notes and customer service logs, then clustered them into six anxieties.",
        outputs: ["Question map", "Anxiety clusters"],
      },
      {
        title: "Claims framework",
        duration: "Weeks 3-5",
        description: "Worked with legal and sustainability scientists to define what we could say, how to say it and what evidence must sit beside it.",
        outputs: ["Claims framework", "Citation pattern"],
      },
      {
        title: "Interface and motion",
        duration: "Weeks 5-10",
        description: "Designed explainers using range sliders instead of single numbers, with motion that reveals trade-offs rather than decorating them.",
        outputs: ["UI kit", "Interactive explainers", "Motion principles"],
      },
      {
        title: "Test and ship",
        duration: "Weeks 10-14",
        description: "Usability testing across three markets, localization pass for tone and launch with a measurement plan.",
        outputs: ["Test findings", "Localized templates", "Analytics plan"],
      },
    ],
    paletteStory:
      "The category is covered in lime green and leaf icons. We chose the palette of a Nordic morning: fjord, mist and moss, with a single amber signal reserved for 'pay attention to this trade-off'.",
    palette: [
      { name: "Fjord", hex: "#1F3A4D", role: "Primary", rationale: "A deep blue-grey with calm authority, used for navigation and headlines." },
      { name: "Mist", hex: "#E8EEF0", role: "Surface", rationale: "A cool, low-contrast surface that lets charts and photography breathe." },
      { name: "Moss Signal", hex: "#4C9A6A", role: "Positive", rationale: "A mature green used only for verified, sourced positive data, never as decoration." },
      { name: "Amber Alert", hex: "#F2B23E", role: "Trade-off", rationale: "Flags honest caveats, such as cold-weather range loss, so they are visible, not buried." },
      { name: "Carbon", hex: "#121416", role: "Text", rationale: "Near-black for optimal readability on Mist." },
    ],
    typography: [
      {
        role: "Interface",
        family: "Clean humanist sans, three weights",
        classification: "sans",
        sample: "How far can it really go?",
        rationale: "Limited weights keep the interface calm, matching a Scandinavian design language.",
      },
      {
        role: "Data",
        family: "Tabular sans for numbers",
        classification: "mono",
        sample: "380-520 km WLTP",
        rationale: "Ranges in tabular figures read as honest data, not marketing.",
      },
    ],
    voiceNarrative:
      "Curious, direct and humble. We answered questions in the order people ask them, and we were the first to name the caveats.",
    voicePrinciples: ["Ranges, not promises", "Name the trade-off", "Cite everything"],
    copyExamples: [
      {
        before: "Zero-emission driving for a greener planet.",
        after: "No tailpipe emissions. Here's what it takes to make the electricity and the battery, and how that's changing.",
        note: "'Zero-emission' alone is misleading. We replaced it with a precise claim and an invitation to learn more.",
      },
      {
        before: "Up to 520 km of range.",
        after: "380-520 km depending on speed, temperature and load. See how each changes it.",
        note: "A range with context builds more trust than a best-case figure.",
      },
    ],
    hurdles: [
      {
        kind: "Legal",
        title: "Environmental claims",
        constraint: "Vague or unsubstantiated environmental claims can be treated as misleading advertising under consumer protection rules in several markets.",
        resolution: "Designed a claims framework: specific, scoped, sourced. Each statement links to a citation, and absolute terms like 'eco-friendly' and 'green' were retired.",
      },
      {
        kind: "Localization",
        title: "Different rules in different markets",
        constraint: "Range testing standards and permissible claims differ by region.",
        resolution: "Built the components to take market-specific figures and disclaimers from a content model rather than embedding them in design.",
      },
    ],
    decisions: [
      {
        area: "Interaction",
        decision: "Sliders for range, speed and temperature",
        rationale: "Users learn more by changing a variable than by reading a paragraph.",
      },
      {
        area: "Imagery",
        decision: "Landscape and daily-life scenes, with no leaf iconography",
        rationale: "Leaves signal 'greenwashing' to a skeptical audience. Real places signal confidence.",
      },
      {
        area: "Color",
        decision: "Green only for verified positives",
        rationale: "If green is used decoratively it loses meaning. Scarcity builds trust.",
      },
    ],
    gallery: [{ src: "/images/projects/mobility-hub.jpg", caption: "Hub hero, coastal road at dawn" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Lars Eklund", role: "Sustainability Lead" },
      { name: "Hanna Berg", role: "UX Researcher" },
      { name: "Eli Park", role: "Front-end Developer" },
    ],
  },
  {
    slug: "lyst-the-wardrobe-edit",
    title: "The Wardrobe Edit",
    client: "Lyst",
    category: "campaign",
    year: "2023",
    featured: false,
    sortOrder: 7,
    summary: "A resale-season campaign that reframed second-hand fashion as the smartest edit in your closet.",
    role: "Creative Director, Campaign Lead",
    disciplines: ["Campaign Concept", "Art Direction", "Copywriting", "Paid Social"],
    coverImage: "/images/projects/wardrobe-edit.jpg",
    heroImage: "/images/projects/wardrobe-edit.jpg",
    challenge:
      "Resale has a reputation problem: bargain-bin, not aspirational. The campaign had to make pre-owned feel like the high-fashion move, without leaning on guilt or sustainability lectures.",
    approach:
      "We positioned resale as editing: the discipline of choosing what stays. Every asset is composed like a luxury flat lay with careful geometry and neutral stone tones, and every line of copy sounds like a stylist, not a deal site.",
    outcome:
      "A campaign that carried a premium feel across paid social, email and on-site merchandising, and lifted click-through on resale collections above the retailer's new-season benchmark.",
    directorNote:
      "Nobody feels aspirational about a discount. They feel aspirational about taste. So we never mentioned the price. We just made the coat look inevitable.",
    metrics: [
      { value: "+38%", label: "Resale CTR", detail: "Compared to the previous season's resale campaign" },
      { value: "0", label: "Discount mentions", detail: "Zero price-led headlines across the campaign" },
      { value: "5", label: "Channels", detail: "Paid social, email, on-site, OOH and editorial" },
    ],
    process: [
      {
        title: "Reposition",
        duration: "Weeks 1-2",
        description: "Reviewed competitor resale messaging; every brand led with price or guilt. We chose taste as the unclaimed territory.",
        outputs: ["Competitive audit", "Positioning statement"],
      },
      {
        title: "Concept and copy",
        duration: "Weeks 3-4",
        description: "Developed 'The Wardrobe Edit' as a campaign line and a stylist's voice with short, declarative copy.",
        outputs: ["Campaign platform", "Copy toolkit"],
      },
      {
        title: "Shoot and system",
        duration: "Weeks 5-7",
        description: "Art-directed flat-lay and portrait shoots with a fixed geometry grid so every channel crop stays on brand.",
        outputs: ["Shot list", "Crop system", "Asset library"],
      },
    ],
    paletteStory: "Stone, camel and ink: the colors of a considered wardrobe. Nothing shouts, everything coordinates.",
    palette: [
      { name: "Stone", hex: "#CFC8BC", role: "Ground", rationale: "A warm grey that makes clothing the hero and keeps the campaign feeling quiet and expensive." },
      { name: "Camel", hex: "#B58A5B", role: "Accent", rationale: "Pulled from the hero coat so product and brand feel like one." },
      { name: "Ink", hex: "#16161A", role: "Type", rationale: "Deep and crisp for editorial headlines." },
    ],
    typography: [
      {
        role: "Headlines",
        family: "Elegant high-contrast serif",
        classification: "serif",
        sample: "Edit like you mean it.",
        rationale: "A fashion-magazine voice that signals taste right away.",
      },
    ],
    voiceNarrative: "A stylist's voice: confident, brief and a bit dry. It assumes taste and never explains the joke.",
    voicePrinciples: ["Taste over thrift", "Never mention the price", "Short, certain sentences"],
    copyExamples: [
      {
        before: "Save up to 70% on pre-owned designer pieces.",
        after: "The coat you'd have bought. Just better timed.",
        note: "Removed the discount and sold the feeling of a smart decision.",
      },
    ],
    hurdles: [
      {
        kind: "Legal",
        title: "Authenticity and resale claims",
        constraint: "Resale marketing must be clear about condition and authenticity, and cannot use brand names in a misleading way.",
        resolution: "Agreed standard condition language and nominative-use rules with legal so every brand mention is factual and approved.",
      },
    ],
    decisions: [
      {
        area: "Layout",
        decision: "Fixed geometry grid for flat lays",
        rationale: "Consistent composition lets assets be cropped for five channels without losing the editorial feel.",
      },
      {
        area: "Copy",
        decision: "No percentages, no exclamation marks",
        rationale: "The brand voice is calm confidence. Urgency would undo the premium feel.",
      },
    ],
    gallery: [{ src: "/images/projects/wardrobe-edit.jpg", caption: "Hero flat lay, camel coat, loafers and silk scarf" }],
    credits: [
      { name: "Sarah Reese", role: "Creative Director" },
      { name: "Imogen Hale", role: "Fashion Stylist" },
      { name: "Ravi Menon", role: "Paid Social Lead" },
    ],
  },
];
