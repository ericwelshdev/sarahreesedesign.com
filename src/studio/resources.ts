export type ResourceKey =
  | "projects"
  | "clients"
  | "accolades"
  | "testimonials"
  | "faqs"
  | "inquiries"
  | "profile";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "strings"
  | "metrics"
  | "palette"
  | "process"
  | "credits"
  | "gallery"
  | "copyExamples"
  | "hurdles"
  | "decisions"
  | "typography"
  | "stats"
  | "principles"
  | "image"
  | "status";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: string[];
  rows?: number;
  half?: boolean;
  readOnly?: boolean;
}

export interface SectionDef {
  title: string;
  fields: FieldDef[];
}

export interface ResourceDef {
  key: ResourceKey;
  singular: string;
  plural: string;
  titleKey: string;
  subtitleKey?: string;
  badgeKey?: string;
  sections: SectionDef[];
  canCreate: boolean;
  canDelete: boolean;
  singleton?: boolean;
}

const STATUS_OPTIONS = ["new", "replied", "archived"];

export const RESOURCES: Record<ResourceKey, ResourceDef> = {
  projects: {
    key: "projects",
    singular: "Case study",
    plural: "Case studies",
    titleKey: "title",
    subtitleKey: "client",
    badgeKey: "published",
    canCreate: true,
    canDelete: true,
    sections: [
      {
        title: "Basics",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "client", label: "Client", type: "text", half: true },
          { key: "year", label: "Year", type: "text", half: true },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: ["brand", "campaign", "web"],
            half: true,
          },
          { key: "featured", label: "Pin to selected work", type: "boolean", half: true },
          { key: "published", label: "Published", type: "boolean", half: true },
          { key: "sort_order", label: "Sort order", type: "number", half: true },
          { key: "summary", label: "Summary", type: "textarea", rows: 3 },
          { key: "role", label: "Your role", type: "text" },
          { key: "cover_image", label: "Cover image", type: "image" },
          { key: "hero_image", label: "Hero image", type: "image" },
        ],
      },
      {
        title: "Story",
        fields: [
          { key: "challenge", label: "The challenge", type: "textarea", rows: 4 },
          { key: "approach", label: "The approach", type: "textarea", rows: 4 },
          { key: "outcome", label: "The outcome", type: "textarea", rows: 4 },
          { key: "director_note", label: "Director's note (pull quote)", type: "textarea", rows: 3 },
          { key: "disciplines", label: "Disciplines", type: "strings", hint: "One per line" },
        ],
      },
      {
        title: "Metrics",
        fields: [
          { key: "metrics", label: "Impact metrics", type: "metrics", hint: "Value, label and detail for each stat card" },
        ],
      },
      {
        title: "Process",
        fields: [{ key: "process", label: "Process steps", type: "process" }],
      },
      {
        title: "Color",
        fields: [
          { key: "palette_story", label: "Palette story", type: "textarea", rows: 2 },
          { key: "palette", label: "Palette", type: "palette" },
        ],
      },
      {
        title: "Typography & voice",
        fields: [
          { key: "typography", label: "Typography", type: "typography" },
          { key: "voice_narrative", label: "Voice narrative", type: "textarea", rows: 3 },
          { key: "voice_principles", label: "Voice principles", type: "strings", hint: "One per line" },
          { key: "copy_examples", label: "Copy examples", type: "copyExamples" },
        ],
      },
      {
        title: "Guardrails & decisions",
        fields: [
          { key: "hurdles", label: "Guardrails (hurdles)", type: "hurdles" },
          { key: "decisions", label: "Key decisions", type: "decisions" },
        ],
      },
      {
        title: "Gallery & credits",
        fields: [
          { key: "gallery", label: "Gallery", type: "gallery" },
          { key: "credits", label: "Credits", type: "credits" },
        ],
      },
    ],
  },
  clients: {
    key: "clients",
    singular: "Client",
    plural: "Clients",
    titleKey: "name",
    subtitleKey: "descriptor",
    badgeKey: "published",
    canCreate: true,
    canDelete: true,
    sections: [
      {
        title: "Client details",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "descriptor", label: "Descriptor", type: "text", half: true },
          { key: "sort_order", label: "Sort order", type: "number", half: true },
          { key: "blurb", label: "Blurb", type: "textarea", rows: 2 },
          { key: "preview_image", label: "Preview image", type: "image" },
          { key: "project_slug", label: "Linked project slug", type: "text", half: true },
          { key: "published", label: "Published", type: "boolean", half: true },
        ],
      },
    ],
  },
  accolades: {
    key: "accolades",
    singular: "Accolade",
    plural: "Press & awards",
    titleKey: "title",
    subtitleKey: "organization",
    badgeKey: "kind",
    canCreate: true,
    canDelete: true,
    sections: [
      {
        title: "Accolade details",
        fields: [
          { key: "title", label: "Title", type: "text" },
          {
            key: "kind",
            label: "Kind",
            type: "select",
            options: ["award", "speaking", "press"],
            half: true,
          },
          { key: "year", label: "Year", type: "text", half: true },
          { key: "organization", label: "Organization", type: "text", half: true },
          { key: "sort_order", label: "Sort order", type: "number", half: true },
          { key: "note", label: "Note", type: "text", half: true },
          { key: "url", label: "URL", type: "text", half: true },
          { key: "published", label: "Published", type: "boolean", half: true },
        ],
      },
    ],
  },
  testimonials: {
    key: "testimonials",
    singular: "Testimonial",
    plural: "Kind words",
    titleKey: "author",
    subtitleKey: "company",
    badgeKey: "spotlight",
    canCreate: true,
    canDelete: true,
    sections: [
      {
        title: "Quote",
        fields: [
          { key: "quote", label: "Quote", type: "textarea", rows: 4 },
          { key: "author", label: "Author", type: "text", half: true },
          { key: "role", label: "Role", type: "text", half: true },
          { key: "company", label: "Company", type: "text", half: true },
          { key: "spotlight", label: "Spotlight (featured on the chartreuse band)", type: "boolean" },
          { key: "sort_order", label: "Sort order", type: "number", half: true },
          { key: "published", label: "Published", type: "boolean", half: true },
        ],
      },
    ],
  },
  faqs: {
    key: "faqs",
    singular: "FAQ",
    plural: "FAQs",
    titleKey: "question",
    badgeKey: "published",
    canCreate: true,
    canDelete: true,
    sections: [
      {
        title: "Question",
        fields: [
          { key: "question", label: "Question", type: "text" },
          { key: "answer", label: "Answer", type: "textarea", rows: 4 },
          { key: "sort_order", label: "Sort order", type: "number", half: true },
          { key: "published", label: "Published", type: "boolean", half: true },
        ],
      },
    ],
  },
  inquiries: {
    key: "inquiries",
    singular: "Inquiry",
    plural: "Inbox",
    titleKey: "name",
    subtitleKey: "email",
    badgeKey: "status",
    canCreate: false,
    canDelete: true,
    sections: [
      {
        title: "Brief",
        fields: [
          { key: "status", label: "Status", type: "status" },
          { key: "name", label: "Name", type: "text", readOnly: true, half: true },
          { key: "email", label: "Email", type: "text", readOnly: true, half: true },
          { key: "company", label: "Company", type: "text", readOnly: true, half: true },
          { key: "created_at", label: "Received", type: "text", readOnly: true, half: true },
          { key: "project_type", label: "Project type", type: "text", readOnly: true, half: true },
          { key: "budget", label: "Budget", type: "text", readOnly: true, half: true },
          { key: "message", label: "Message", type: "textarea", rows: 5, readOnly: true },
        ],
      },
    ],
  },
  profile: {
    key: "profile",
    singular: "Profile",
    plural: "Profile & site copy",
    titleKey: "name",
    canCreate: false,
    canDelete: false,
    singleton: true,
    sections: [
      {
        title: "Identity",
        fields: [
          { key: "name", label: "Name", type: "text", half: true },
          { key: "title", label: "Title", type: "text", half: true },
          { key: "location", label: "Location", type: "text", half: true },
          { key: "email", label: "Email", type: "text", half: true },
          { key: "linkedin_url", label: "LinkedIn URL", type: "text", half: true },
          { key: "instagram_url", label: "Instagram URL", type: "text", half: true },
          { key: "availability", label: "Availability", type: "select", options: ["open", "limited", "booked"], half: true },
          { key: "availability_text", label: "Availability text", type: "text", half: true },
        ],
      },
      {
        title: "Homepage hero",
        fields: [
          { key: "hero_headline", label: "Headline", type: "text" },
          { key: "hero_accent", label: "Headline accent (italic serif ending)", type: "text" },
          { key: "hero_sub", label: "Sub-headline", type: "textarea", rows: 3 },
          { key: "portrait_url", label: "Portrait image", type: "image" },
          { key: "showreel_url", label: "Showreel URL", type: "text", half: true },
          { key: "showreel_poster", label: "Showreel poster", type: "image", half: true },
          { key: "showreel_label", label: "Showreel label", type: "text", half: true },
        ],
      },
      {
        title: "About",
        fields: [
          { key: "about_headline", label: "About headline", type: "text", half: true },
          { key: "about_accent", label: "About accent", type: "text", half: true },
          { key: "bio", label: "Bio", type: "textarea", rows: 6, hint: "Blank lines split paragraphs" },
          { key: "short_version", label: "The short version", type: "textarea", rows: 4 },
        ],
      },
      {
        title: "Stats, principles & capabilities",
        fields: [
          { key: "stats", label: "Stats", type: "stats" },
          { key: "principles", label: "Principles", type: "principles" },
          { key: "capabilities", label: "Capabilities", type: "strings", hint: "One per line" },
        ],
      },
      {
        title: "Footer & SEO",
        fields: [
          { key: "footer_note", label: "Footer note", type: "text" },
          { key: "seo_title", label: "SEO title", type: "text", half: true },
          { key: "seo_description", label: "SEO description", type: "text", half: true },
        ],
      },
    ],
  },
};

export const STATUS_OPTIONS_EXPORT = STATUS_OPTIONS;
