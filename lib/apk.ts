/**
 * Android APK download configuration.
 *
 * Point NEXT_PUBLIC_ANDROID_APK_URL at a stable, public URL for the latest
 * CropSuite Android build. When the URL is not configured the download buttons
 * render a disabled "coming soon" state instead of a dead link.
 */

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
  fileName: "CropSuite.apk",
  /** Version string — shown only when the build pipeline provides it. */
  version: process.env.NEXT_PUBLIC_APK_VERSION?.trim() || null,
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
  ];
  if (apk.version) facts.push({ label: "Version", value: apk.version });
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
