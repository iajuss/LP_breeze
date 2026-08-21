import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { homeMetadata } from "@/lib/seo";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = { metadataBase: new URL(siteConfig.url), ...homeMetadata };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning={false}
      className={`${dmSerifDisplay.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
