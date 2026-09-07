/**
 * Vector recreation of the TreePulse app icon
 * (TreePulse-App/assets/icon.png and adaptive-icon.png): a line-art tree —
 * three leaves and a trunk — with an ECG "pulse" line crossing the trunk.
 * Rebuilt as SVG so it stays crisp at every size and inherits the brand colour.
 */
export function TreePulseMark({
  className,
  title = "TreePulse",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* centre leaf */}
      <path d="M32 30c-6-4-6-13 0-22 6 9 6 18 0 22Z" />
      {/* left leaf */}
      <path d="M31 32c-7 2-14-1-20-9 9-3 17-1 20 5" />
      {/* right leaf */}
      <path d="M33 32c7 2 14-1 20-9-9-3-17-1-20 5" />
      {/* trunk */}
      <path d="M32 30v20" />
      {/* ground + roots */}
      <path d="M17 54h30M25 54c-2-3-5-4-8-4M39 54c2-3 5-4 8-4" />
      {/* pulse line branching from the trunk */}
      <path d="M32 41h4l3-7 3 12 3-6h6" />
    </svg>
  );
}
