import { TreePulseLogo } from "@/components/brand/TreePulseLogo";
import { containerClass, navLinks, siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/70 bg-surface">
      <div
        className={`${containerClass} flex flex-col gap-8 py-12 sm:flex-row sm:justify-between`}
      >
        <div className="max-w-xs">
          <TreePulseLogo markClassName="h-7 w-7" wordClassName="text-base" />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            For tree-planting farmers in Rwanda. In{" "}
            {siteConfig.languages.join(", ")}.
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
          <a
            href={siteConfig.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-ink transition-colors hover:text-primary-deep"
          >
            Source
          </a>
        </nav>
      </div>

      <div className="border-t border-line/70">
        <p className={`${containerClass} py-5 text-xs text-muted`}>
          © {year} TreePulse · app version {siteConfig.appVersion} · a landing
          page for the TreePulse mobile app
        </p>
      </div>
    </footer>
  );
}
