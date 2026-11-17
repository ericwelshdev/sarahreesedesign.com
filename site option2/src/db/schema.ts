import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export interface ImpactMetric {
  label: string;
  value: string;
  detail: string;
}

export interface PaletteSwatch {
  name: string;
  hex: string;
}

export const directorProfile = pgTable("director_profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  monogram: text("monogram").notNull(),
  wordmark: text("wordmark").notNull(),
  roleTagline: text("role_tagline").notNull(),
  locationTagline: text("location_tagline").notNull(),
  availabilityStatus: text("availability_status").notNull(),
  heroHeadline: text("hero_headline").notNull(),
  heroSubheadline: text("hero_subheadline").notNull(),
  perspectiveTitle: text("perspective_title").notNull(),
  perspectiveHighlight: text("perspective_highlight").notNull(),
  perspectiveBody: text("perspective_body").notNull(),
  aboutHeadline: text("about_headline").notNull(),
  aboutHighlight: text("about_highlight").notNull(),
  aboutBio: text("about_bio").notNull(),
  shortVersion: text("short_version").notNull(),
  toolkit: text("toolkit").notNull(),
  email: text("email").notNull(),
  locationFooter: text("location_footer").notNull(),
  yearsExperience: text("years_experience").notNull(),
  fortuneClientsCount: text("fortune_clients_count").notNull(),
  systemsLaunchedCount: text("systems_launched_count").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  numberBadge: text("number_badge").notNull(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  featured: boolean("featured").default(true).notNull(),
  sortOrder: integer("sort_order").default(1).notNull(),
  summary: text("summary").notNull(),
  role: text("role").notNull(),
  disciplines: text("disciplines").notNull(),
  coverImage: text("cover_image").notNull(),
  detailHeroImage: text("detail_hero_image").notNull(),
  secondaryImage: text("secondary_image").notNull(),
  challenge: text("challenge").notNull(),
  approach: text("approach").notNull(),
  outcome: text("outcome").notNull(),
  directorNote: text("director_note").notNull(),
  impactMetrics: jsonb("impact_metrics").$type<ImpactMetric[]>().notNull(),
  brandPalette: jsonb("brand_palette").$type<PaletteSwatch[]>().notNull(),
  deliverables: jsonb("deliverables").$type<string[]>().notNull(),
  liveUrl: text("live_url").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accolades = pgTable("accolades", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  projectRef: text("project_ref").notNull(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").default(1).notNull(),
});

export const clientPartners = pgTable("client_partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  highlightColor: boolean("highlight_color").default(false).notNull(),
  engagementRole: text("engagement_role").notNull(),
  sector: text("sector").notNull(),
  yearSpan: text("year_span").notNull(),
  deliverableHighlight: text("deliverable_highlight").notNull(),
  sortOrder: integer("sort_order").default(1).notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  isSpotlight: boolean("is_spotlight").default(false).notNull(),
  sortOrder: integer("sort_order").default(1).notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(1).notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  scopes: text("scopes").notNull(),
  budgetRange: text("budget_range").notNull(),
  timeline: text("timeline").notNull(),
  message: text("message").notNull(),
  status: text("status").default("New Brief").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
