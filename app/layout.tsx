import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

/**
 * Jost is the typeface used throughout the TreePulse mobile app
 * (@expo-google-fonts/jost). Self-hosted here via next/font — no layout shift,
 * no request to Google at runtime.
 */
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://treepulse.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TreePulse — map your farm, register every tree",
    template: "%s · TreePulse",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "TreePulse",
    "tree planting",
    "farm mapping",
    "Rwanda",
    "reforestation",
    "tree monitoring",
    "Android app",
  ],
  authors: [{ name: "TreePulse" }],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "TreePulse — map your farm, register every tree",
    description: siteConfig.description,
    url: siteUrl,
    locale: "en_RW",
  },
  twitter: {
    card: "summary_large_image",
    title: "TreePulse — map your farm, register every tree",
    description: siteConfig.description,
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#6eba6d",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} h-full`}>
      <head>
        <noscript>
          {/* Without JS the scroll-reveal wrappers never toggle — show everything. */}
          <style>{`.tp-reveal,.tp-reveal[data-stagger]>*,.tp-hero-item,.tp-hero-phone{opacity:1!important;transform:none!important;filter:none!important;animation:none!important}.tp-hero-mask>span{transform:none!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
