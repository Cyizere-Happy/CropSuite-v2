import { IntroGate } from "@/components/intro/IntroGate";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Overview } from "@/components/site/Overview";
import { Features } from "@/components/site/Features";
import { Screenshots } from "@/components/site/Screenshots";
import { DownloadCta } from "@/components/site/DownloadCta";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroBackdrop } from "@/components/site/decor";
import { introAssets } from "@/lib/intro";

export default function Home() {
  const intro = introAssets();

  return (
    <>
      {/* Cinematic introduction — a layer BEFORE the landing page, shown once per
          browser session. The landing page below is unchanged. */}
      <IntroGate videoSrc={intro.videoSrc} posterSrc={intro.posterSrc} />

      <a
        href="#home"
        className="sr-only rounded-lg bg-primary-deep px-4 py-2 text-sm font-bold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>

      {/* The organic backdrop sits behind the transparent nav, as in the reference. */}
      <div className="relative">
        <HeroBackdrop />
        <Nav />
        <main>
          <Hero />
          <Overview />
          <Features />
          <Screenshots />
          <DownloadCta />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
