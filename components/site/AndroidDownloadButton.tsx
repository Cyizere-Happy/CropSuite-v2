import { apk } from "@/lib/apk";

function AndroidGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 9a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1Zm12 0a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1ZM8 18a1 1 0 0 0 1 1h1v2a1 1 0 0 0 2 0v-2h0v2a1 1 0 0 0 2 0v-2h1a1 1 0 0 0 1-1V9H8v9ZM15.5 4.6l1-1.5a.4.4 0 0 0-.66-.44l-1.05 1.57A6.9 6.9 0 0 0 12 3.7c-1 0-1.96.19-2.8.53L8.16 2.66a.4.4 0 1 0-.66.44l1 1.5A5.5 5.5 0 0 0 6 8.2h12a5.5 5.5 0 0 0-2.5-3.6ZM10 6.6a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Zm4 0a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Z" />
    </svg>
  );
}

/**
 * Primary "Download for Android" button.
 * - NEXT_PUBLIC_ANDROID_APK_URL set → a real link to the latest APK.
 * - Not set → a disabled "coming soon" button (never a "#" link).
 */
export function AndroidDownloadButton({
  size = "md",
  variant = "solid",
  className = "",
  label = "Download for Android",
}: {
  size?: "md" | "lg";
  variant?: "solid" | "onDark";
  className?: string;
  label?: string;
}) {
  const sizing =
    size === "lg" ? "px-7 py-4 text-base gap-3" : "px-5 py-3 text-sm gap-2.5";
  const base =
    "group inline-flex items-center justify-center rounded-full font-bold transition-all duration-200";
  const glyph = size === "lg" ? "h-6 w-6" : "h-5 w-5";

  if (!apk.available) {
    const skin =
      variant === "onDark"
        ? "border border-white/25 bg-white/10 text-white/75"
        : "border border-line bg-surface text-muted";
    return (
      <button
        type="button"
        disabled
        className={`${base} ${sizing} ${skin} cursor-not-allowed ${className}`}
        title="The Android build is not published yet"
      >
        <AndroidGlyph className={glyph} />
        Android — coming soon
      </button>
    );
  }

  const skin =
    variant === "onDark"
      ? "bg-white text-primary-deep hover:bg-sage"
      : "bg-primary-deep text-white shadow-[0_16px_30px_-12px_rgba(46,107,50,0.6)] hover:bg-[#244f27]";

  return (
    <a
      href={apk.url ?? undefined}
      download={apk.fileName}
      rel="noopener"
      className={`${base} ${sizing} ${skin} hover:-translate-y-0.5 ${className}`}
    >
      <AndroidGlyph className={glyph} />
      {label}
    </a>
  );
}
