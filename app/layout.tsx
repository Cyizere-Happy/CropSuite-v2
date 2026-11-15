import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

/**
 * Jost is the typeface used throughout the product and this page.
 * Self-hosted here via next/font — no layout shift, no request to Google at
 * runtime.
 */
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cropsuite.example";
const pageTitle = "CropSuite — know what to plant, plan what comes next";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: "%s · CropSuite",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "CropSuite",
    "FieldShift",
    "crop planning",
    "crop rotation",
    "planting window",
    "decision support",
    "Rwanda",
    "Kayonza",
    "maize",
    "common beans",
  ],
  authors: [{ name: "CropSuite" }],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: pageTitle,
    description: siteConfig.description,
    url: siteUrl,
    locale: "en_RW",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: siteConfig.description,
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#3f8b43",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${jost.variable} h-full`} suppressHydrationWarning>
      <head>
        <noscript>
          {/* Without JS the scroll-reveal wrappers never toggle — show everything,
              and never show the (JS-driven) introduction layer. */}
          <style>{`.tp-reveal,.tp-reveal[data-stagger]>*,.tp-hero-item,.tp-hero-phone{opacity:1!important;transform:none!important;filter:none!important;animation:none!important}.tp-hero-mask>span{transform:none!important;animation:none!important}.cs-intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
