import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./studio.css";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: ReactNode }) {
  return <div className="studio">{children}</div>;
}
