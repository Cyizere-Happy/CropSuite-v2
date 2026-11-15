"use client";

import { INTRO_REPLAY_EVENT } from "@/lib/intro-events";

/** "Replay our story" — re-opens the CropSuite introduction on demand. */
export function ReplayIntroButton({
  className = "",
  children = "Replay our story",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(INTRO_REPLAY_EVENT))}
    >
      {children}
    </button>
  );
}
