/**
 * Tiny shared contract between the introduction layer and the landing page.
 * Kept dependency-free so client components can import it without pulling in
 * the whole IntroGate.
 */

/** Session cookie and sessionStorage fallback: "1" once watched or skipped. */
export const INTRO_SESSION_KEY = "cropsuite_intro_seen";

/** Dispatched on `window` to re-open the introduction ("Replay our story"). */
export const INTRO_REPLAY_EVENT = "cropsuite:replay-intro";

/** Dispatched on `window` the moment the introduction starts to leave. */
export const INTRO_DONE_EVENT = "cropsuite:intro-done";

/** True while the introduction is covering the page (set on <html data-intro>). */
export function introIsActive(): boolean {
  if (typeof document === "undefined") return false;
  const state = document.documentElement.getAttribute("data-intro");
  return state === "pending" || state === "active";
}
