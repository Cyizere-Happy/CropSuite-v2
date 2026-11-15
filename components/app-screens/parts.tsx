/**
 * Shared chrome for the reconstructed CropSuite screens.
 *
 * Every screen sets a root font-size in `cqi` (a share of the phone display
 * width) and expresses all type, spacing and icon sizes in `em`, so the whole
 * screen scales cleanly with the mockup at any width.
 */

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const tone = dark ? "text-white" : "text-ink";
  return (
    <div
      className={`flex items-center justify-between px-[1.6em] pb-[0.3em] pt-[2.6em] text-[0.72em] font-bold ${tone}`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-[0.35em]" aria-hidden="true">
        <svg viewBox="0 0 18 12" className="h-[0.8em] w-[1.2em] fill-current">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-[0.8em] w-[1.05em] fill-current">
          <path d="M8 11.5 1 4.5a10 10 0 0 1 14 0L8 11.5Z" opacity="0.9" />
        </svg>
        <svg viewBox="0 0 26 12" className="h-[0.8em] w-[1.7em] fill-current">
          <rect x="0.5" y="1" width="22" height="10" rx="2.5" fill="none" stroke="currentColor" />
          <rect x="2.5" y="3" width="16" height="6" rx="1" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" />
        </svg>
      </span>
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div className="flex justify-center pb-[0.7em] pt-[0.5em]">
      <span className="h-[0.3em] w-[8em] rounded-full bg-ink/20" />
    </div>
  );
}

export type IconName =
  | "bell"
  | "settings"
  | "chevron-left"
  | "chevron-right"
  | "plus"
  | "search"
  | "wallet"
  | "check-circle"
  | "x-circle"
  | "tree"
  | "landmark"
  | "eye"
  | "refresh"
  | "clock"
  | "leaf"
  | "map-pin"
  | "calendar"
  | "rotate"
  | "info";

const iconPaths: Record<IconName, React.ReactNode> = {
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M9 20a3 3 0 0 0 6 0" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </>
  ),
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2Z" />
      <circle cx="16" cy="13" r="1.4" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 5-5" />
    </>
  ),
  "x-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
  tree: (
    <>
      <path d="M12 22v-6" />
      <path d="M12 16a5 5 0 0 0 5-5 4 4 0 0 0-1-2.6A4.5 4.5 0 0 0 12 2a4.5 4.5 0 0 0-4 4.4A4 4 0 0 0 7 11a5 5 0 0 0 5 5Z" />
    </>
  ),
  leaf: <path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16Zm0 0c4-8 8-10 12-11" />,
  landmark: (
    <>
      <path d="M3 21h18M4 10h16M5 10 12 4l7 6M6 10v11M18 10v11M10 10v11M14 10v11" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18M8 15h3" />
    </>
  ),
  rotate: (
    <>
      <path d="M20 11a8 8 0 0 0-14.5-4.5L3 9M3 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.5 4.5L21 15M21 20v-5h-5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
};

export function ScreenIcon({
  name,
  className = "h-[1.3em] w-[1.3em]",
  strokeWidth = 1.9,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}
