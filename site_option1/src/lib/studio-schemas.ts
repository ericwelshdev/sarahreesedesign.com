// Client-safe CMS definitions. The same schemas power the editor forms
// in the studio AND the server-side coercion in /api/studio.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "color"
  | "strings"
  | "list";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  itemFields?: Field[];
  itemLabel?: string;
  rows?: number;
  readOnly?: boolean;
  half?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export interface ResourceConfig {
  key: string;
  singular: string;
  plural: string;
  titleKey: string;
  subtitleKey?: string;
  badgeKey?: string;
  sections: Section[];
  canCreate: boolean;
  canDelete: boolean;
  sortKey: "sortOrder" | "id-desc";
  previewPath?: string; // e.g. "/work/" + slug
  previewKey?: string;
  defaults: Record<string, unknown>;
}

const CATEGORY_OPTIONS = [
  { value: "brand", label: "Brand Identity" },
  { value: "web", label: "Web & Digital" },
  { value: "campaign", label: "Campaigns" },
];

const projects: ResourceConfig = {
  key: "projects",
  singular: "case study",
  plural: "Case studies",
  titleKey: "title",
  subtitleKey: "client",
  badgeKey: "category",
  canCreate: true,
  canDelete: true,
  sortKey: "sortOrder",
  previewPath: "/work/",
  previewKey: "slug",
  defaults: {
    title: "",
    slug: "",
    client: "",
    category: "brand",
    year: String(new Date().getFullYear()),
    published: false,
    featured: false,
    sortOrder: 99,
    palette: [],
    process: [],
    typography: [],
    metrics: [],
    hurdles: [],
    decisions: [],
    gallery: [],
    credits: [],
    copyExamples: [],
    voicePrinciples: [],
    disciplines: [],
  },
  sections: [
    {
      id: "basics",
      title: "1. Basics & visibility",
      description: "What shows on the project card and at the top of the case study. Unpublished projects stay hidden from the live site.",
      fields: [
        { key: "title", label: "Project title", type: "text", half: true },
        { key: "client", label: "Client", type: "text", half: true },
        { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, half: true },
        { key: "year", label: "Year", type: "text", half: true },
        { key: "slug", label: "URL slug", type: "text", hint: "Leave blank to generate from the title. Appears as /work/your-slug.", half: true },
        { key: "sortOrder", label: "Display order", type: "number", hint: "Lower numbers appear first.", half: true },
        { key: "published", label: "Published on the live site", type: "boolean" },
        { key: "featured", label: "Feature in the homepage lead", type: "boolean" },
        { key: "summary", label: "One-line summary", type: "textarea", rows: 2, hint: "Shown on cards and as the case study subhead." },
        { key: "role", label: "Her role", type: "text", half: true },
        { key: "disciplines", label: "Disciplines (one per line)", type: "strings", rows: 4, half: true },
        { key: "coverImage", label: "Card cover image", type: "image", half: true },
        { key: "heroImage", label: "Case study hero image", type: "image", half: true },
      ],
    },
    {
      id: "story",
      title: "2. The story: challenge, approach, outcome",
      description: "The narrative a client reads first. Be specific about the problem and what you chose to do about it.",
      fields: [
        { key: "challenge", label: "The challenge", type: "textarea", rows: 5, hint: "What was hard? What was the risk of getting it wrong?" },
        { key: "approach", label: "The approach", type: "textarea", rows: 6, hint: "Your strategy and the idea at the center of it." },
        { key: "outcome", label: "The outcome", type: "textarea", rows: 4 },
        { key: "directorNote", label: "Creative director's note", type: "textarea", rows: 3, hint: "A pull-quote in your own voice. The insight a client should remember." },
        {
          key: "metrics",
          label: "Results & metrics",
          type: "list",
          itemLabel: "metric",
          itemFields: [
            { key: "value", label: "Value", type: "text", placeholder: "+64%", half: true },
            { key: "label", label: "Label", type: "text", placeholder: "Talent campaign lift", half: true },
            { key: "detail", label: "Context", type: "text" },
          ],
        },
      ],
    },
    {
      id: "process",
      title: "3. Process, step by step",
      description: "How the work actually got made. Clients hire process as much as taste.",
      fields: [
        {
          key: "process",
          label: "Phases",
          type: "list",
          itemLabel: "phase",
          itemFields: [
            { key: "title", label: "Phase name", type: "text", half: true },
            { key: "duration", label: "Timing", type: "text", placeholder: "Weeks 1-2", half: true },
            { key: "description", label: "What happened & what you decided", type: "textarea", rows: 4 },
            { key: "outputs", label: "Deliverables (one per line)", type: "strings", rows: 3 },
          ],
        },
      ],
    },
    {
      id: "color",
      title: "4. Color story",
      description: "Show the palette and defend every color. This is where clients see judgment.",
      fields: [
        { key: "paletteStory", label: "Palette philosophy", type: "textarea", rows: 4, hint: "What did you move away from? What feeling did you chase?" },
        {
          key: "palette",
          label: "Colors",
          type: "list",
          itemLabel: "color",
          itemFields: [
            { key: "name", label: "Name", type: "text", half: true },
            { key: "hex", label: "Color", type: "color", half: true },
            { key: "role", label: "Role", type: "text", placeholder: "Primary, accent, neutral...", half: true },
            { key: "rationale", label: "Why this color", type: "textarea", rows: 3 },
          ],
        },
      ],
    },
    {
      id: "type",
      title: "5. Typography",
      fields: [
        {
          key: "typography",
          label: "Type roles",
          type: "list",
          itemLabel: "type role",
          itemFields: [
            { key: "role", label: "Role", type: "text", placeholder: "Display, body, data...", half: true },
            { key: "family", label: "Typeface / description", type: "text", half: true },
            {
              key: "classification",
              label: "Preview style",
              type: "select",
              options: [
                { value: "sans", label: "Sans" },
                { value: "serif", label: "Serif" },
                { value: "mono", label: "Mono" },
              ],
              half: true,
            },
            { key: "sample", label: "Sample text", type: "text", half: true },
            { key: "rationale", label: "Why this typeface", type: "textarea", rows: 3 },
          ],
        },
      ],
    },
    {
      id: "voice",
      title: "6. Messaging & voice",
      description: "How the words were shaped. Before/after copy is the most persuasive proof of this skill.",
      fields: [
        { key: "voiceNarrative", label: "Voice & message approach", type: "textarea", rows: 4 },
        { key: "voicePrinciples", label: "Voice principles (one per line)", type: "strings", rows: 4 },
        {
          key: "copyExamples",
          label: "Before / after copy",
          type: "list",
          itemLabel: "example",
          itemFields: [
            { key: "before", label: "Before", type: "textarea", rows: 2, half: true },
            { key: "after", label: "After", type: "textarea", rows: 2, half: true },
            { key: "note", label: "What changed and why", type: "text" },
          ],
        },
      ],
    },
    {
      id: "hurdles",
      title: "7. Guardrails: legal, compliance & constraints",
      description: "Regulatory, privacy, brand or stakeholder constraints and how the creative idea survived them.",
      fields: [
        {
          key: "hurdles",
          label: "Constraints",
          type: "list",
          itemLabel: "constraint",
          itemFields: [
            { key: "kind", label: "Type", type: "text", placeholder: "Legal, Privacy, Accessibility, Stakeholder...", half: true },
            { key: "title", label: "Headline", type: "text", half: true },
            { key: "constraint", label: "The constraint", type: "textarea", rows: 3 },
            { key: "resolution", label: "How it was resolved", type: "textarea", rows: 3 },
          ],
        },
      ],
    },
    {
      id: "decisions",
      title: "8. Key design decisions",
      fields: [
        {
          key: "decisions",
          label: "Decisions",
          type: "list",
          itemLabel: "decision",
          itemFields: [
            { key: "area", label: "Area", type: "text", placeholder: "Layout, imagery, naming...", half: true },
            { key: "decision", label: "Decision", type: "text", half: true },
            { key: "rationale", label: "Rationale", type: "textarea", rows: 3 },
          ],
        },
      ],
    },
    {
      id: "gallery",
      title: "9. Gallery, credits & live link",
      fields: [
        {
          key: "gallery",
          label: "Gallery",
          type: "list",
          itemLabel: "image",
          itemFields: [
            { key: "src", label: "Image", type: "image" },
            { key: "caption", label: "Caption", type: "text" },
          ],
        },
        {
          key: "credits",
          label: "Team credits",
          type: "list",
          itemLabel: "credit",
          itemFields: [
            { key: "name", label: "Name", type: "text", half: true },
            { key: "role", label: "Role", type: "text", half: true },
          ],
        },
        { key: "demoSlug", label: "Linked live demo (slug)", type: "text", hint: "Matches a Live Site in the studio. Adds an 'Explore the live site' link.", half: true },
        { key: "liveUrl", label: "External live URL", type: "text", placeholder: "https://", half: true },
      ],
    },
  ],
};

const clients: ResourceConfig = {
  key: "clients",
  singular: "client",
  plural: "Client index",
  titleKey: "name",
  subtitleKey: "descriptor",
  canCreate: true,
  canDelete: true,
  sortKey: "sortOrder",
  defaults: { name: "", descriptor: "", blurb: "", previewImage: "", projectSlug: "", published: true, sortOrder: 99 },
  sections: [
    {
      id: "main",
      title: "Client details",
      fields: [
        { key: "name", label: "Brand / client name", type: "text", half: true },
        { key: "descriptor", label: "Descriptor", type: "text", placeholder: "Brand Identity · Healthcare", half: true },
        { key: "blurb", label: "Hover preview text", type: "textarea", rows: 3 },
        { key: "previewImage", label: "Preview image", type: "image" },
        { key: "projectSlug", label: "Linked case study slug", type: "text", half: true },
        { key: "sortOrder", label: "Display order", type: "number", half: true },
        { key: "published", label: "Visible on live site", type: "boolean" },
      ],
    },
  ],
};

const accolades: ResourceConfig = {
  key: "accolades",
  singular: "recognition",
  plural: "Awards, speaking & press",
  titleKey: "title",
  subtitleKey: "organization",
  badgeKey: "kind",
  canCreate: true,
  canDelete: true,
  sortKey: "sortOrder",
  defaults: { kind: "award", title: "", organization: "", year: String(new Date().getFullYear()), note: "", url: "", published: true, sortOrder: 99 },
  sections: [
    {
      id: "main",
      title: "Recognition details",
      fields: [
        {
          key: "kind",
          label: "Type",
          type: "select",
          options: [
            { value: "award", label: "Award" },
            { value: "speaking", label: "Speaking" },
            { value: "press", label: "Press" },
          ],
          half: true,
        },
        { key: "year", label: "Year", type: "text", half: true },
        { key: "title", label: "Title", type: "text" },
        { key: "organization", label: "Organization / publication", type: "text", half: true },
        { key: "url", label: "Link", type: "text", placeholder: "https://", half: true },
        { key: "note", label: "Note", type: "text" },
        { key: "sortOrder", label: "Display order", type: "number", half: true },
        { key: "published", label: "Visible on live site", type: "boolean" },
      ],
    },
  ],
};

const testimonials: ResourceConfig = {
  key: "testimonials",
  singular: "testimonial",
  plural: "Kind words",
  titleKey: "author",
  subtitleKey: "company",
  canCreate: true,
  canDelete: true,
  sortKey: "sortOrder",
  defaults: { quote: "", author: "", role: "", company: "", spotlight: false, published: true, sortOrder: 99 },
  sections: [
    {
      id: "main",
      title: "Testimonial",
      fields: [
        { key: "quote", label: "Quote", type: "textarea", rows: 5 },
        { key: "author", label: "Name", type: "text", half: true },
        { key: "role", label: "Title", type: "text", half: true },
        { key: "company", label: "Company", type: "text", half: true },
        { key: "sortOrder", label: "Display order", type: "number", half: true },
        { key: "spotlight", label: "Spotlight (large quote at the top). Only one is used.", type: "boolean" },
        { key: "published", label: "Visible on live site", type: "boolean" },
      ],
    },
  ],
};

const faqs: ResourceConfig = {
  key: "faqs",
  singular: "question",
  plural: "FAQ",
  titleKey: "question",
  canCreate: true,
  canDelete: true,
  sortKey: "sortOrder",
  defaults: { question: "", answer: "", published: true, sortOrder: 99 },
  sections: [
    {
      id: "main",
      title: "Question & answer",
      fields: [
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea", rows: 6 },
        { key: "sortOrder", label: "Display order", type: "number", half: true },
        { key: "published", label: "Visible on live site", type: "boolean" },
      ],
    },
  ],
};

const demos: ResourceConfig = {
  key: "demos",
  singular: "live site",
  plural: "Live sites (sandbox)",
  titleKey: "name",
  subtitleKey: "kicker",
  canCreate: true,
  canDelete: true,
  sortKey: "sortOrder",
  previewPath: "/demo/",
  previewKey: "slug",
  defaults: { slug: "", name: "", kicker: "", description: "", accent: "#1D1D1F", projectSlug: "", liveUrl: "", html: "", breakdown: [], published: true, sortOrder: 99 },
  sections: [
    {
      id: "main",
      title: "Site details",
      description: "Shown in the Interactive Device Sandbox on the homepage.",
      fields: [
        { key: "name", label: "Site name", type: "text", half: true },
        { key: "kicker", label: "Type label", type: "text", placeholder: "Brand site · Healthcare", half: true },
        { key: "description", label: "Description", type: "textarea", rows: 3 },
        { key: "accent", label: "Accent color", type: "color", half: true },
        { key: "projectSlug", label: "Linked case study slug", type: "text", half: true },
        { key: "slug", label: "URL slug", type: "text", hint: "Blank = generated from name.", half: true },
        { key: "sortOrder", label: "Display order", type: "number", half: true },
        { key: "published", label: "Visible on live site", type: "boolean" },
      ],
    },
    {
      id: "source",
      title: "Where the site comes from",
      description:
        "Either paste a self-contained HTML page (it runs in a sandboxed frame), or enter an external URL. Some websites block embedding; if so, use the HTML option or just the Launch button.",
      fields: [
        { key: "liveUrl", label: "External URL (optional)", type: "text", placeholder: "https://" },
        { key: "html", label: "Self-contained HTML (used when no external URL is set)", type: "textarea", rows: 14 },
      ],
    },
    {
      id: "breakdown",
      title: "Case study breakdown",
      description: "The talking points behind the 'Case Study Breakdown' toggle.",
      fields: [
        {
          key: "breakdown",
          label: "Breakdown notes",
          type: "list",
          itemLabel: "note",
          itemFields: [
            { key: "label", label: "Label", type: "text", placeholder: "Goal, Layout, Tone...", half: true },
            { key: "text", label: "Text", type: "textarea", rows: 3 },
          ],
        },
      ],
    },
  ],
};

const inquiries: ResourceConfig = {
  key: "inquiries",
  singular: "inquiry",
  plural: "Inbox",
  titleKey: "name",
  subtitleKey: "email",
  badgeKey: "status",
  canCreate: false,
  canDelete: true,
  sortKey: "id-desc",
  defaults: {},
  sections: [
    {
      id: "main",
      title: "Project inquiry",
      fields: [
        { key: "name", label: "Name", type: "text", readOnly: true, half: true },
        { key: "email", label: "Email", type: "text", readOnly: true, half: true },
        { key: "company", label: "Company", type: "text", readOnly: true, half: true },
        { key: "projectType", label: "Looking for", type: "text", readOnly: true, half: true },
        { key: "budget", label: "Budget", type: "text", readOnly: true, half: true },
        { key: "createdAt", label: "Received", type: "text", readOnly: true, half: true },
        { key: "message", label: "Message", type: "textarea", rows: 8, readOnly: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "new", label: "New" },
            { value: "replied", label: "Replied" },
            { value: "archived", label: "Archived" },
          ],
        },
      ],
    },
  ],
};

const profile: ResourceConfig = {
  key: "profile",
  singular: "profile",
  plural: "Profile & site copy",
  titleKey: "name",
  canCreate: false,
  canDelete: false,
  sortKey: "id-desc",
  defaults: {},
  sections: [
    {
      id: "identity",
      title: "Identity & availability",
      fields: [
        { key: "name", label: "Name", type: "text", half: true },
        { key: "title", label: "Title", type: "text", half: true },
        { key: "location", label: "Location", type: "text", half: true },
        { key: "email", label: "Contact email", type: "text", half: true },
        { key: "linkedinUrl", label: "LinkedIn URL", type: "text", half: true },
        { key: "instagramUrl", label: "Instagram URL", type: "text", half: true },
        {
          key: "availability",
          label: "Availability status",
          type: "select",
          options: [
            { value: "open", label: "Open for new projects" },
            { value: "limited", label: "Limited availability" },
            { value: "booked", label: "Fully booked" },
          ],
          half: true,
        },
        { key: "availabilityText", label: "Availability message", type: "text", half: true },
      ],
    },
    {
      id: "hero",
      title: "Homepage hero & showreel",
      fields: [
        { key: "heroHeadline", label: "Headline", type: "textarea", rows: 2 },
        { key: "heroAccent", label: "Italic accent words (end of headline)", type: "text" },
        { key: "heroSub", label: "Supporting line", type: "textarea", rows: 3 },
        {
          key: "stats",
          label: "Headline stats",
          type: "list",
          itemLabel: "stat",
          itemFields: [
            { key: "value", label: "Value", type: "text", half: true },
            { key: "label", label: "Label", type: "text", half: true },
          ],
        },
        { key: "showreelUrl", label: "Showreel video URL (mp4)", type: "text", hint: "A path like /videos/showreel.mp4 or a direct https link to an .mp4. Leave blank to show only the poster." },
        { key: "showreelPoster", label: "Showreel poster image", type: "image", half: true },
        { key: "showreelLabel", label: "Showreel caption", type: "text", half: true },
      ],
    },
    {
      id: "about",
      title: "About: leadership bio & philosophy",
      fields: [
        { key: "portraitUrl", label: "Portrait", type: "image" },
        { key: "aboutHeadline", label: "Headline", type: "text", half: true },
        { key: "aboutAccent", label: "Italic accent words", type: "text", half: true },
        { key: "bio", label: "Bio (blank line between paragraphs)", type: "textarea", rows: 10 },
        { key: "shortVersion", label: "The short version", type: "textarea", rows: 3 },
        {
          key: "principles",
          label: "Leadership principles",
          type: "list",
          itemLabel: "principle",
          itemFields: [
            { key: "title", label: "Title", type: "text" },
            { key: "body", label: "Body", type: "textarea", rows: 3 },
          ],
        },
        { key: "capabilities", label: "Capabilities (one per line)", type: "strings", rows: 8 },
      ],
    },
    {
      id: "meta",
      title: "Footer & search",
      fields: [
        { key: "footerNote", label: "Footer note", type: "text" },
        { key: "seoTitle", label: "Browser / search title", type: "text" },
        { key: "seoDescription", label: "Search description", type: "textarea", rows: 3 },
      ],
    },
  ],
};

export const RESOURCES: Record<string, ResourceConfig> = {
  projects,
  clients,
  accolades,
  testimonials,
  faqs,
  demos,
  inquiries,
  profile,
};
