import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { ReplayIntroButton } from "@/components/intro/ReplayIntroButton";
import { containerClass, navLinks, siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/70 bg-surface">
      <div
        className={`${containerClass} flex flex-col gap-8 py-12 sm:flex-row sm:justify-between`}
      >
        <div className="max-w-xs">
          <CropSuiteLogo markClassName="h-7 w-7" wordClassName="text-base" />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Crop-planning decision support for farmers in Rwanda. Initial
            pilot: {siteConfig.pilot.district}, {siteConfig.pilot.country}.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink transition-colors hover:text-primary-deep"
            >
              {link.label}
            </a>
          ))}
          <ReplayIntroButton className="text-sm font-semibold text-ink transition-colors hover:text-primary-deep">
            Replay our story
          </ReplayIntroButton>
        </nav>
      </div>

      <div className="border-t border-line/70">
        <p className={`${containerClass} py-5 text-xs text-muted`}>
          © {year} {siteConfig.name} · formerly {siteConfig.formerName} ·
          CropSuite does not guarantee yields, prices, weather or harvests
        </p>
      </div>
    </footer>
  );
}
