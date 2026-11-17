import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SARAH REESE — Independent Creative Director & Brand Architect",
  description:
    "Creative director crafting brands, campaigns and products people remember. Over a decade of work with startups and Fortune 500 brands alike.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <body className="bg-[#F7F5F0] text-[#111110] font-sans antialiased selection:bg-[#D4F82A] selection:text-[#111110]">
        {children}
      </body>
    </html>
  );
}
