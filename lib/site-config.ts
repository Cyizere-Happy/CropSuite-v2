/**
 * Central content + configuration for the CropSuite landing page.
 *
 * CropSuite (originally developed as FieldShift) is a Rwanda-first crop-planning
 * and rotation decision-support platform. Everything below describes only what
 * the platform is designed to do — identify a farm location, compare candidate
 * crops, explore planting windows, consider the next crop in a rotation and
 * explain the reasoning and limits behind a plan. No yields, profits, weather
 * outcomes or adoption figures are claimed anywhere on the page.
 *
 *  - Initial pilot ............ Kayonza, Rwanda
 *  - Initial crop scope ....... maize and common beans
 *  - Environmental evidence ... NASA POWER and FAO GAEZ, where verified and integrated
 */

export const siteConfig = {
  name: "CropSuite",
  /** The working name the platform was first developed under. */
  formerName: "FieldShift",
  /** Where the first pilot runs. */
  pilot: { district: "Kayonza", country: "Rwanda" },
  /** Initial crop scope. */
  crops: ["Maize", "Common beans"],
  /** Environmental datasets the platform is informed by, where integrated. */
  datasets: ["NASA POWER", "FAO GAEZ"],
  description:
    "CropSuite is a Rwanda-first crop-planning and rotation decision-support platform. Farmers identify their farm location, compare the crops they are considering, explore planting windows and what could come next in a rotation, and see the reasons and limitations behind each plan. Initial pilot: Kayonza, Rwanda, focused on maize and common beans.",
} as const;

/** Short facts shown in the hero and the download strip (no invented numbers). */
export const pilotFacts = [
  "Kayonza, Rwanda",
  "Maize & common beans",
  "Rotation guidance",
] as const;

/** Pills shown in the Overview section. */
export const pilotTags = [
  "Kayonza pilot",
  "Maize",
  "Common beans",
  "NASA POWER",
  "FAO GAEZ",
] as const;

/** Closing message used on the dark strip above the footer. */
export const closingMessage =
  "Every great harvest begins with a better-informed decision.";

/**
 * Single source of truth for the page's horizontal rhythm. Every section — nav,
 * hero, overview, features, screenshots, download and footer — uses this exact
 * class so the left/right margins line up all the way down the page.
 */
export const containerClass =
  "mx-auto w-full max-w-[1080px] px-6 sm:px-12 lg:px-24";

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
];

export type FeatureIconName =
  | "map"
  | "tree"
  | "clipboard"
  | "wallet"
  | "calendar"
  | "rotate"
  | "info";

/** Four capability cards for the Overview section (no invented metrics). */
export const overviewCards: {
  icon: FeatureIconName;
  title: string;
  body: string;
}[] = [
  {
    icon: "map",
    title: "Know your land",
    body: "Agricultural and climate evidence for your farm location.",
  },
  {
    icon: "tree",
    title: "Choose your crops",
    body: "Compare the crops you want to grow and what shapes the choice.",
  },
  {
    icon: "calendar",
    title: "Plan your season",
    body: "Planting windows and the conditions that matter before you sow.",
  },
  {
    icon: "rotate",
    title: "Think beyond one harvest",
    body: "What to plant next, with crop-rotation guidance.",
  },
];

export type FeatureContent = {
  id: string;
  icon: FeatureIconName;
  eyebrow: string;
  title: string;
  body: string;
  /** Which reconstructed app screen to show in the phone. */
  screen: "farms" | "notifications" | "earnings";
  /** Layout: phone on the left or right of the copy. */
  media: "left" | "right";
  /** Tilt the device with CSS perspective (reference's first feature block). */
  tilt?: boolean;
  /** Show an APK download button in this block. */
  download?: boolean;
};

export const features: FeatureContent[] = [
  {
    id: "land",
    icon: "map",
    eyebrow: "Know your land",
    title: "Start from your farm location",
    body: "Explore agricultural and climate evidence relevant to your farm location. CropSuite is informed by datasets such as NASA POWER and FAO GAEZ where they are verified and integrated.",
    screen: "farms",
    media: "right",
    tilt: true,
    download: true,
  },
  {
    id: "crops",
    icon: "tree",
    eyebrow: "Choose your crops · Plan your season",
    title: "Compare crops, then pick your planting window",
    body: "Compare the crops you want to grow and understand the factors that may influence your planting decision. Then explore planting windows and the conditions that matter before you sow.",
    screen: "earnings",
    media: "left",
  },
  {
    id: "rotation",
    icon: "rotate",
    eyebrow: "Think beyond one harvest",
    title: "Decisions you understand",
    body: "Consider what to plant next with crop-rotation guidance, and see the reasons, assumptions and limitations behind your planting plan. CropSuite does not guarantee yields, prices or weather.",
    screen: "notifications",
    media: "right",
    download: true,
  },
];
