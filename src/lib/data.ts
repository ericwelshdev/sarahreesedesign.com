import { supabase } from "./supabase";
import type {
  Accolade,
  Client,
  Faq,
  Inquiry,
  Profile,
  Project,
  Testimonial,
} from "../types";

export interface SiteData {
  profile: Profile | null;
  projects: Project[];
  clients: Client[];
  accolades: Accolade[];
  testimonials: Testimonial[];
  faqs: Faq[];
}

const CONTENT = "profile, projects, clients, accolades, testimonials, faqs" as const;

async function read(): Promise<SiteData> {
  const [profileRes, projectsRes, clientsRes, accoladesRes, testimonialsRes, faqsRes] =
    await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("projects").select("*").order("sort_order").order("id"),
      supabase.from("clients").select("*").order("sort_order").order("id"),
      supabase.from("accolades").select("*").order("sort_order").order("id"),
      supabase.from("testimonials").select("*").order("sort_order").order("id"),
      supabase.from("faqs").select("*").order("sort_order").order("id"),
    ]);

  const firstError =
    profileRes.error ||
    projectsRes.error ||
    clientsRes.error ||
    accoladesRes.error ||
    testimonialsRes.error ||
    faqsRes.error;
  if (firstError) throw new Error(firstError.message);

  return {
    profile: (profileRes.data as Profile | null) ?? null,
    projects: ((projectsRes.data as Project[]) ?? []).filter((p) => p.published),
    clients: ((clientsRes.data as Client[]) ?? []).filter((c) => c.published),
    accolades: ((accoladesRes.data as Accolade[]) ?? []).filter((a) => a.published),
    testimonials: ((testimonialsRes.data as Testimonial[]) ?? []).filter((t) => t.published),
    faqs: ((faqsRes.data as Faq[]) ?? []).filter((f) => f.published),
  };
}

export function getSite(): Promise<SiteData> {
  return read();
}

export type { CONTENT };
export type { Inquiry };
