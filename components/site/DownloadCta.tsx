import Image from "next/image";
import appIcon from "../../public/cropsuite-app-icon.png";
import { apk } from "@/lib/apk";
import { closingMessage, containerClass, siteConfig } from "@/lib/site-config";
import { AndroidDownloadButton } from "./AndroidDownloadButton";
import { SectionReveal } from "./SectionReveal";

/** A slim, single-row download strip on a dark ground for contrast. */
export function DownloadCta() {
  const meta = [
    "CropSuite for Android",
    apk.version ? `v${apk.version}` : null,
    apk.size,
    apk.updated,
    `${siteConfig.pilot.district} pilot, ${siteConfig.pilot.country}`,
    "Maize & common beans",
  ].filter(Boolean);

  return (
    <section id="download" className="bg-ink text-white">
      <SectionReveal
        className={`${containerClass} flex flex-col items-center gap-6 py-11 sm:flex-row sm:justify-between`}
      >
        <div className="flex items-center gap-4">
          <Image
            src={appIcon}
            alt="CropSuite app icon"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl ring-1 ring-white/15"
            placeholder="blur"
          />
          <div>
            <p className="text-lg font-extrabold">{closingMessage}</p>
            <p className="mt-0.5 text-xs text-white/55">{meta.join(" · ")}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <AndroidDownloadButton size="md" variant="onDark" />
          {!apk.available && (
            <p className="max-w-xs text-xs text-white/45 sm:text-right">
              Activates automatically once the release APK is published.
            </p>
          )}
        </div>
      </SectionReveal>
    </section>
  );
}
