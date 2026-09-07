/**
 * Central content + configuration for the TreePulse landing page.
 *
 * Every product claim, feature description and screen label below is derived
 * from the TreePulse mobile app source (TreePulse-App/). Nothing here is
 * invented marketing copy or an unverified statistic.
 *
 * Key sources:
 *  - src/theme/colors.ts .................. brand colours
 *  - src/locales/translations/en.json .... in-app wording
 *  - src/screens/SelectionScreen.tsx ..... "What would you like to do today?"
 *  - src/screens/FarmRegistrationScreen.tsx / farm_registration i18n .. GPS boundary mapping
 *  - src/screens/TreeRegistrationScreen.tsx / tree_registration i18n .. batch tree capture
 *  - src/screens/TreeMonitoringScreen.tsx / tree_monitoring i18n ...... 3-month inspections, <15m rule
 *  - src/screens/TreeStatusScreen.tsx / tree_status i18n ............. Global Secure Wallet, RWF payouts
 *  - src/screens/MyFarmsScreen.tsx / my_farms i18n .................. registered plots
 *  - src/screens/NotificationsScreen.tsx .......................... approval + inspection alerts
 *  - src/services/api.ts ......................................... NestJS backend integration
 *  - app.json ................................................... version, package name, permissions
 */

export const siteConfig = {
  name: "TreePulse",
  /** From app.json -> expo.version and package.json */
  appVersion: "1.0.0",
  /** From app.json -> expo.android.package */
  androidPackage: "com.treepulse",
  /** Real public repository for the mobile app */
  repoUrl: "https://github.com/Cyizere-Happy/TreePulse-App",
  /** Languages actually bundled in src/locales/translations */
  languages: ["English", "Kinyarwanda", "Kiswahili", "French"],
  description:
    "TreePulse is the field companion for tree-planting farmers in Rwanda: map a farm by walking its boundary, geo-tag and photograph every tree, complete 3-month health inspections, and track which trees are verified and what they earn.",
} as const;

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

/** Four capability cards for the Overview section (no invented metrics). */
export const overviewCards: {
  icon: "map" | "tree" | "clipboard" | "wallet";
  title: string;
  body: string;
}[] = [
  {
    icon: "map",
    title: "Boundary mapping",
    body: "Walk the perimeter; get the plot area in hectares.",
  },
  {
    icon: "tree",
    title: "Geo-tagged trees",
    body: "Each tree saved with a photo, species and location.",
  },
  {
    icon: "clipboard",
    title: "3-month checks",
    body: "Guided inspections, verified within 15 m of the tree.",
  },
  {
    icon: "wallet",
    title: "RWF payouts",
    body: "Approved, rejected and pending trees, totalled per plot.",
  },
];

export type FeatureContent = {
  id: string;
  icon: "map" | "tree" | "wallet";
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
    id: "mapping",
    icon: "map",
    eyebrow: "Farm registration",
    title: "Walk the boundary, get your area",
    body: "TreePulse records a corner each time you tap as you walk the plot edge, then returns the size in hectares when you close the loop. Every farm keeps its UPI number, district and approval status.",
    screen: "farms",
    media: "right",
    tilt: true,
    download: true,
  },
  {
    id: "monitoring",
    icon: "tree",
    eyebrow: "Tree monitoring",
    title: "Register trees, then inspect on schedule",
    body: "Capture trees in a batch with a photo and species for each. Three months on, TreePulse lists the trees that are due and checks you are within 15 m before it accepts the update.",
    screen: "notifications",
    media: "left",
  },
  {
    id: "earnings",
    icon: "wallet",
    eyebrow: "Earnings & verification",
    title: "Every verified tree is a payout",
    body: "The Global Secure Wallet totals approved trees across all of your plots and shows what is still pending. Open one plot for its UPI number, verification rate and payout.",
    screen: "earnings",
    media: "right",
    download: true,
  },
];
