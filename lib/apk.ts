/**
 * Android APK download configuration.
 *
 * The CI workflow in TreePulse-App/.github/workflows/deploy.yml builds a release
 * APK on every relevant push to `main` and publishes it to a GitHub Release as a
 * stable asset named `treepulse-latest.apk`. Point NEXT_PUBLIC_ANDROID_APK_URL at
 * that asset (for example:
 *   https://github.com/Cyizere-Happy/TreePulse-App/releases/latest/download/treepulse-latest.apk
 * ).
 *
 * When the URL is not configured the download buttons render a disabled
 * "coming soon" state instead of a dead link.
 */

import { siteConfig } from "./site-config";

const rawUrl = process.env.NEXT_PUBLIC_ANDROID_APK_URL?.trim();

function isSafeHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const apk = {
  /** Absolute URL to the latest APK, or null when not configured. */
  url: isSafeHttpUrl(rawUrl) ? rawUrl : null,
  available: isSafeHttpUrl(rawUrl),
  /** Suggested download filename. */
  fileName: "treepulse-latest.apk",
  /**
   * Version string. Falls back to the version declared in the mobile app's
   * app.json / package.json, which is real repository metadata.
   */
  version: process.env.NEXT_PUBLIC_APK_VERSION?.trim() || siteConfig.appVersion,
  /** File size, e.g. "58 MB" — shown only when the build pipeline provides it. */
  size: process.env.NEXT_PUBLIC_APK_SIZE?.trim() || null,
  /** ISO date or human date of the last successful build — shown only when provided. */
  updated: process.env.NEXT_PUBLIC_APK_UPDATED?.trim() || null,
} as const;

/** Facts always safe to display next to the download button. */
export function apkFacts(): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [
    { label: "Platform", value: "Android" },
    { label: "Format", value: "APK" },
    { label: "Version", value: apk.version },
  ];
  if (apk.size) facts.push({ label: "Size", value: apk.size });
  if (apk.updated) facts.push({ label: "Updated", value: formatUpdated(apk.updated) });
  return facts;
}

function formatUpdated(value: string): string {
  const asDate = new Date(value);
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return value;
}
