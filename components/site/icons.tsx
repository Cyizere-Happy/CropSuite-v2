/**
 * Small line icons used above feature headings and in the Overview cards.
 * Drawn in the same stroke style as lucide-react-native, which the mobile
 * app uses for its iconography.
 */
type IconName = "map" | "tree" | "clipboard" | "wallet";

const paths: Record<IconName, React.ReactNode> = {
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  tree: (
    <>
      <path d="M12 22v-6" />
      <path d="M12 16a5 5 0 0 0 5-5 4 4 0 0 0-1-2.6A4.5 4.5 0 0 0 12 2a4.5 4.5 0 0 0-4 4.4A4 4 0 0 0 7 11a5 5 0 0 0 5 5Z" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2Z" />
      <circle cx="16" cy="13" r="1.4" />
    </>
  ),
};

export function FeatureIcon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
