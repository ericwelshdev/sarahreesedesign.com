export interface ImpactMetric {
  label: string;
  value: string;
  detail: string;
}

export interface PaletteSwatch {
  name: string;
  hex: string;
}

export interface DirectorProfile {
  id: number;
  name: string;
  monogram: string;
  wordmark: string;
  roleTagline: string;
  locationTagline: string;
  availabilityStatus: string;
  heroHeadline: string;
  heroSubheadline: string;
  perspectiveTitle: string;
  perspectiveHighlight: string;
  perspectiveBody: string;
  aboutHeadline: string;
  aboutHighlight: string;
  aboutBio: string;
  shortVersion: string;
  toolkit: string;
  email: string;
  locationFooter: string;
  yearsExperience: string;
  fortuneClientsCount: string;
  systemsLaunchedCount: string;
}

export interface Project {
  id: number;
  slug: string;
  numberBadge: string;
  title: string;
  client: string;
  category: string;
  year: string;
  featured: boolean;
  sortOrder: number;
  summary: string;
  role: string;
  disciplines: string;
  coverImage: string;
  detailHeroImage: string;
  secondaryImage: string;
  challenge: string;
  approach: string;
  outcome: string;
  directorNote: string;
  impactMetrics: ImpactMetric[];
  brandPalette: PaletteSwatch[];
  deliverables: string[];
  liveUrl: string;
}

export interface Accolade {
  id: number;
  year: string;
  title: string;
  organization: string;
  projectRef: string;
  category: string;
  sortOrder: number;
}

export interface ClientPartner {
  id: number;
  name: string;
  highlightColor: boolean;
  engagementRole: string;
  sector: string;
  yearSpan: string;
  deliverableHighlight: string;
  sortOrder: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  isSpotlight: boolean;
  sortOrder: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  scopes: string;
  budgetRange: string;
  timeline: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface PortfolioPayload {
  profile: DirectorProfile;
  projects: Project[];
  accolades: Accolade[];
  clientPartners: ClientPartner[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  inquiries: Inquiry[];
}
