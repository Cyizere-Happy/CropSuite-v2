import { HomeIndicator, StatusBar } from "./parts";

/**
 * Phone screen content for the mockups.
 *
 * CropSuite's real screens are still in design, so every mockup shows a clean,
 * blank display (status bar + home indicator only) rather than an invented
 * interface. The `ScreenName` slots are kept so real screenshots can be dropped
 * in later without touching the phone frames or their placement.
 *
 * Root font-size is set in `cqi` (share of the phone display width); everything
 * else is in `em`, so the chrome scales with the mockup at any size.
 */

export type ScreenName =
  | "login"
  | "dashboard"
  | "farms"
  | "earnings"
  | "notifications";

const shell =
  "flex h-full w-full flex-col overflow-hidden bg-surface text-[5.2cqi] leading-[1.5] text-ink";

// `name` is accepted (and ignored for now) so callers keep their slot wiring.
export function AppScreen({ name }: { name: ScreenName }) {
  return (
    <div className={shell} data-screen={name}>
      <StatusBar />
      <div className="flex-1" />
      <HomeIndicator />
    </div>
  );
}
