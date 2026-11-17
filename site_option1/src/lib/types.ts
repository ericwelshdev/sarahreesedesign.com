// Shared, client-safe shapes for the JSON columns stored in PostgreSQL.

export type Metric = { value: string; label: string; detail: string };
export type PaletteColor = { name: string; hex: string; role: string; rationale: string };
export type TypeSpec = {
  role: string;
  family: string;
  classification: "sans" | "serif" | "mono";
  sample: string;
  rationale: string;
};
export type ProcessStep = { title: string; duration: string; description: string; outputs: string[] };
export type CopyExample = { before: string; after: string; note: string };
export type Hurdle = { kind: string; title: string; constraint: string; resolution: string };
export type Decision = { area: string; decision: string; rationale: string };
export type GalleryItem = { src: string; caption: string };
export type Credit = { name: string; role: string };
export type Principle = { title: string; body: string };
export type Stat = { value: string; label: string };
export type DemoNote = { label: string; text: string };

export type Availability = "open" | "limited" | "booked";
export type Category = "web" | "brand" | "campaign";

export const CATEGORY_LABEL: Record<string, string> = {
  web: "Web & Digital",
  brand: "Brand Identity",
  campaign: "Campaigns",
};
