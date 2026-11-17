import { boolean, customType, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type {
  Credit,
  CopyExample,
  Decision,
  DemoNote,
  GalleryItem,
  Hurdle,
  Metric,
  PaletteColor,
  Principle,
  ProcessStep,
  Stat,
  TypeSpec,
} from "@/lib/types";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

/** Single-row site profile (id is always 1). */
export const profile = pgTable("profile", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().default(""),
  title: text("title").notNull().default(""),
  location: text("location").notNull().default(""),
  email: text("email").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  instagramUrl: text("instagram_url").notNull().default(""),
  availability: text("availability").notNull().default("open"),
  availabilityText: text("availability_text").notNull().default(""),
  heroHeadline: text("hero_headline").notNull().default(""),
  heroAccent: text("hero_accent").notNull().default(""),
  heroSub: text("hero_sub").notNull().default(""),
  stats: jsonb("stats").$type<Stat[]>().notNull().default([]),
  showreelUrl: text("showreel_url").notNull().default(""),
  showreelPoster: text("showreel_poster").notNull().default(""),
  showreelLabel: text("showreel_label").notNull().default(""),
  portraitUrl: text("portrait_url").notNull().default(""),
  aboutHeadline: text("about_headline").notNull().default(""),
  aboutAccent: text("about_accent").notNull().default(""),
  bio: text("bio").notNull().default(""),
  shortVersion: text("short_version").notNull().default(""),
  principles: jsonb("principles").$type<Principle[]>().notNull().default([]),
  capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
  footerNote: text("footer_note").notNull().default(""),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  client: text("client").notNull().default(""),
  category: text("category").notNull().default("brand"),
  year: text("year").notNull().default(""),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  summary: text("summary").notNull().default(""),
  role: text("role").notNull().default(""),
  disciplines: jsonb("disciplines").$type<string[]>().notNull().default([]),
  coverImage: text("cover_image").notNull().default(""),
  heroImage: text("hero_image").notNull().default(""),
  demoSlug: text("demo_slug").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  challenge: text("challenge").notNull().default(""),
  approach: text("approach").notNull().default(""),
  outcome: text("outcome").notNull().default(""),
  directorNote: text("director_note").notNull().default(""),
  metrics: jsonb("metrics").$type<Metric[]>().notNull().default([]),
  process: jsonb("process").$type<ProcessStep[]>().notNull().default([]),
  paletteStory: text("palette_story").notNull().default(""),
  palette: jsonb("palette").$type<PaletteColor[]>().notNull().default([]),
  typography: jsonb("typography").$type<TypeSpec[]>().notNull().default([]),
  voiceNarrative: text("voice_narrative").notNull().default(""),
  voicePrinciples: jsonb("voice_principles").$type<string[]>().notNull().default([]),
  copyExamples: jsonb("copy_examples").$type<CopyExample[]>().notNull().default([]),
  hurdles: jsonb("hurdles").$type<Hurdle[]>().notNull().default([]),
  decisions: jsonb("decisions").$type<Decision[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<GalleryItem[]>().notNull().default([]),
  credits: jsonb("credits").$type<Credit[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  descriptor: text("descriptor").notNull().default(""),
  blurb: text("blurb").notNull().default(""),
  previewImage: text("preview_image").notNull().default(""),
  projectSlug: text("project_slug").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const accolades = pgTable("accolades", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull().default("award"),
  title: text("title").notNull(),
  organization: text("organization").notNull().default(""),
  year: text("year").notNull().default(""),
  note: text("note").notNull().default(""),
  url: text("url").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull().default(""),
  role: text("role").notNull().default(""),
  company: text("company").notNull().default(""),
  spotlight: boolean("spotlight").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** Self-contained mini-sites rendered inside the device sandbox. */
export const demos = pgTable("demos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kicker: text("kicker").notNull().default(""),
  description: text("description").notNull().default(""),
  accent: text("accent").notNull().default("#1D1D1F"),
  projectSlug: text("project_slug").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  html: text("html").notNull().default(""),
  breakdown: jsonb("breakdown").$type<DemoNote[]>().notNull().default([]),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull().default(""),
  projectType: text("project_type").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: text("filename").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Profile = typeof profile.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Accolade = typeof accolades.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Demo = typeof demos.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
