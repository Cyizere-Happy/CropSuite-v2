/**
 * Decorative, non-interactive background art. All inline SVG (no requests),
 * aria-hidden, built from the TreePulse green tokens — the rebrand of the
 * reference layout's purple/pink organic shapes.
 */

/** Big layered blob for the top of the page — sits BEHIND the nav, like the reference. */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden sm:h-[640px]"
    >
      <svg
        className="absolute -right-[34%] -top-[26%] h-[92%] w-[78%] opacity-90 sm:-right-[6%] sm:-top-[34%] sm:h-[150%] sm:w-[64%] sm:opacity-100 lg:w-[54%]"
        viewBox="0 0 600 600"
        fill="none"
      >
        <defs>
          <linearGradient id="tp-hero-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#93d090" />
            <stop offset="1" stopColor="#4e8a4c" />
          </linearGradient>
          <linearGradient id="tp-hero-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfe9cc" />
            <stop offset="1" stopColor="#7cc179" />
          </linearGradient>
        </defs>
        <path
          fill="url(#tp-hero-b)"
          d="M317 41c86-24 189 5 235 74 45 69 33 178-18 253-52 75-142 116-232 110-90-7-181-61-206-142-25-82 17-192 84-260C247 8 231 65 317 41Z"
          opacity="0.5"
        />
        <path
          fill="url(#tp-hero-a)"
          d="M357 20c74 6 148 66 175 141 27 76 7 168-49 231-56 62-148 96-227 74-79-21-145-98-160-183-15-84 21-176 92-227C259-13 283 14 357 20Z"
          opacity="0.9"
        />
      </svg>
      <svg
        className="absolute -bottom-[24%] -left-[26%] hidden h-[60%] w-[40%] sm:block sm:w-[34%]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          fill="#ecf5eb"
          d="M210 24c66 8 128 55 149 118 21 63 1 141-46 186-47 45-121 57-183 33S28 258 24 193C20 129 55 60 118 33c40-17 26-17 92-9Z"
        />
      </svg>
    </div>
  );
}

/** Curved transition into the next section. */
export function SectionCurve({
  fill = "var(--color-bg)",
  className = "",
}: {
  fill?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 translate-y-px ${className}`}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-[46px] w-full sm:h-[80px]"
        fill="none"
      >
        <path d="M0 84c220-56 470-84 720-56s500 84 720 28V120H0Z" fill={fill} />
      </svg>
    </div>
  );
}

/** Rounded geometric shape behind a phone in the feature rows. */
export function DeviceShape({
  variant = "a",
  className = "",
}: {
  variant?: "a" | "b" | "c";
  className?: string;
}) {
  const g = {
    a: ["#9dd39a", "#57a055"],
    b: ["#cfe9cc", "#7cc179"],
    c: ["#b6dfb3", "#63ac60"],
  } as const;
  const [from, to] = g[variant];
  return (
    <svg aria-hidden="true" viewBox="0 0 320 320" className={className} fill="none">
      <defs>
        <linearGradient id={`tp-shape-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#tp-shape-${variant})`}
        d="M84 24h152c33 0 60 27 60 60v112c0 33-27 60-60 60H84c-33 0-60-27-60-60V84c0-33 27-60 60-60Z"
        transform="rotate(-5 160 160)"
        opacity="0.92"
      />
    </svg>
  );
}

/** Abstract shape holding the four Overview cards. */
export function OverviewShape({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 420" className={className} fill="none">
      <defs>
        <linearGradient id="tp-ov" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a6d8a3" />
          <stop offset="1" stopColor="#57a055" />
        </linearGradient>
      </defs>
      <path
        fill="url(#tp-ov)"
        d="M120 20h180c55 0 100 45 100 100v180c0 55-45 100-100 100H120C65 400 20 355 20 300V120C20 65 65 20 120 20Z"
        transform="rotate(-11 210 210)"
        opacity="0.9"
      />
      <path
        fill="#ecf5eb"
        d="M150 60h140c50 0 90 40 90 90v140c0 50-40 90-90 90H150c-50 0-90-40-90-90V150c0-50 40-90 90-90Z"
        transform="rotate(7 210 210)"
        opacity="0.45"
      />
    </svg>
  );
}
