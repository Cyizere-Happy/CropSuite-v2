/**
 * CropSuite brand mark: a line-art seedling rising from a seed in the furrow,
 * with planting rows beneath it. Drawn in the same stroke style, viewBox and
 * weight as the previous mark so it fits every existing slot (nav, footer,
 * favicon, app icon) at exactly the same size, and inherits the brand colour.
 */
export function CropSuiteMark({
  className,
  title = "CropSuite",
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
      {/* seed in the furrow */}
      <path d="M26 50c0-4 3-7 6-7s6 3 6 7" />
      {/* stem */}
      <path d="M32 43V24" />
      {/* left leaf */}
      <path d="M32 32c-9 1-15-3-18-11 9-1 15 3 18 11Z" />
      {/* right leaf */}
      <path d="M32 26c9 1 15-3 18-11-9-1-15 3-18 11Z" />
      {/* ground + planting rows */}
      <path d="M12 50h40M16 57h8M30 57h8M44 57h6" />
    </svg>
  );
}
