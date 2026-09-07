import { TreePulseMark } from "./TreePulseMark";

/** Lockup: the mark plus the "TreePulse" wordmark. */
export function TreePulseLogo({
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
      <TreePulseMark className={markClassName} />
      <span
        className={`font-extrabold tracking-tight text-ink ${wordClassName}`}
      >
        Tree<span className="text-primary-deep">Pulse</span>
      </span>
    </span>
  );
}
