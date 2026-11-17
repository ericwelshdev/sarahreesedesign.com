export type Availability = "open" | "limited" | "booked";
export type Category = "web" | "brand" | "campaign";

export interface Stat {
  value: string;
  label: string;
}

export interface Principle {
  title: string;
  body: string;
}

export interface Metric {
  value: string;
  label: string;
  detail: string;
}

export interface PaletteColor {
  name: string;
  hex: string;
  role: string;
  rationale: string;
}

export interface TypeSpec {
  role: string;
  family: string;
  classification: "sans" | "serif" | "mono";
  sample: string;
  rationale: string;
}

export interface ProcessStep {
  title: string;
  duration: string;
  description: string;
  outputs: string[];
}

export interface CopyExample {
  before: string;
  after: string;
  note: string;
}

export interface Hurdle {
  kind: string;
  title: string;
  constraint: string;
  resolution: string;
}

export interface Decision {
  area: string;
  decision: string;
  rationale: string;
}

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface Credit {
  name: string;
  role: string;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin_url: string;
  instagram_url: string;
  availability: Availability;
  availability_text: string;
  hero_headline: string;
  hero_accent: string;
  hero_sub: string;
  showreel_url: string;
  showreel_poster: string;
  showreel_label: string;
  portrait_url: string;
  about_headline: string;
  about_accent: string;
  bio: string;
  short_version: string;
  footer_note: string;
  seo_title: string;
  seo_description: string;
  stats: Stat[];
  principles: Principle[];
  capabilities: string[];
  updated_at?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  client: string;
  category: Category;
  year: string;
  summary: string;
  role: string;
  cover_image: string;
  hero_image: string;
  demo_slug: string;
  live_url: string;
  challenge: string;
  approach: string;
  outcome: string;
  director_note: string;
  palette_story: string;
  voice_narrative: string;
  published: boolean;
  featured: boolean;
  sort_order: number;
  disciplines: string[];
  metrics: Metric[];
  process: ProcessStep[];
  palette: PaletteColor[];
  typography: TypeSpec[];
  voice_principles: string[];
  copy_examples: CopyExample[];
  hurdles: Hurdle[];
  decisions: Decision[];
  gallery: GalleryItem[];
  credits: Credit[];
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  name: string;
  descriptor: string;
  blurb: string;
  preview_image: string;
  project_slug: string;
  published: boolean;
  sort_order: number;
}

export interface Accolade {
  id: number;
  kind: "award" | "speaking" | "press";
  title: string;
  organization: string;
  year: string;
  note: string;
  url: string;
  published: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  spotlight: boolean;
  published: boolean;
  sort_order: number;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  published: boolean;
  sort_order: number;
}

export type InquiryStatus = "new" | "replied" | "archived";

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  project_type: string;
  budget: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  mime: string;
  size: number;
  url: string;
  created_at: string;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  web: "Web & Digital",
  brand: "Brand Identity",
  campaign: "Campaigns",
};

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  replied: "Replied",
  archived: "Archived",
};
