import { CropSuiteMark } from "./CropSuiteMark";

/** Lockup: the mark plus the "CropSuite" wordmark. */
export function CropSuiteLogo({
  className = "",
  markClassName = "h-8 w-8",
  wordClassName = "text-lg",
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-primary-deep ${className}`}>
      <CropSuiteMark className={markClassName} />
      <span
        className={`font-extrabold tracking-tight text-ink ${wordClassName}`}
      >
        Crop<span className="text-primary-deep">Suite</span>
      </span>
    </span>
  );
}
