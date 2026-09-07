# TreePulse landing page

A production landing page that advertises the **TreePulse** mobile app
(`../TreePulse-App`). Built with **Next.js 16 (App Router)**, **TypeScript**,
**Tailwind CSS v4** and reusable React components.

The visual composition — in-hero navigation, layered organic background shapes,
phone placements, curved section transitions, the four-card overview block and
the alternating feature rows — follows the supplied reference (`../Landing_Page.jpg`).
Branding, colours, copy, screens and calls to action are all TreePulse's.

## What it says about TreePulse (all derived from the app source)

| Landing-page claim | Source in `../TreePulse-App` |
| --- | --- |
| Brand colours (`#6EBA6D` primary, `#4E8A4C` deep, sage/mint, ink/muted) | `src/theme/colors.ts` |
| Jost typography | `@expo-google-fonts/jost` in `package.json`, used across every screen |
| Logo mark (line-art tree + ECG pulse) | vector recreation of `assets/icon.png` / `assets/adaptive-icon.png` |
| "Walk your plot… get your area in hectares" | `src/screens/FarmRegistrationScreen.tsx`, `farm_registration` in `src/locales/translations/en.json` |
| "Register trees in batches with a photo and species" | `src/screens/TreeRegistrationScreen.tsx`, `tree_registration` i18n |
| "3-month inspection… within 15 m of the tree" | `src/screens/TreeMonitoringScreen.tsx`, `tree_monitoring.partial_msg` i18n |
| "Global Secure Wallet", approved / rejected / pending, RWF payouts | `src/screens/TreeStatusScreen.tsx`, `tree_status` i18n |
| Registered farms with UPI, district, approval status | `src/screens/MyFarmsScreen.tsx`, `src/screens/FarmDetailsScreen.tsx` |
| Approval + inspection notifications | `src/screens/NotificationsScreen.tsx` |
| Backend sync / offline cached screens | `src/services/api.ts`, "Offline – showing cached data" banners |
| English, Kinyarwanda, Kiswahili, French | `src/locales/translations/*.json` |
| App version `1.0.0`, package `com.treepulse` | `app.json` |

## Screenshots

The Expo app targets native modules (camera, GPS, maps) and could not be
launched to capture real device screenshots in this environment. Per the brief,
the five screens shown (`components/app-screens/`) are **faithful HTML/CSS
reconstructions** of the real screens — same layout, same colour tokens, same
Jost type, same in-app wording — with **safe demo records** (generic Rwandan
place names, a plausible UPI format, round counts) instead of any real farmer,
account, coordinate or payout data.

## Phone mockups

`components/device/PhoneMockup.tsx` is a pure CSS device: brushed-metal edge,
black bezel, rounded display with the screen clipped inside, dynamic-island
cutout, side buttons and a soft shadow. Width-driven sizing keeps the 9 / 19.5
ratio undistorted from 320 px to desktop. The first feature block tilts the
device with `perspective()`; the tilt flattens under 768 px.

```tsx
<PhoneMockup label="…" className="w-[290px]" tilt floaty>
  <AppScreen name="earnings" />
</PhoneMockup>
```

## APK download

The **Download for Android** buttons link to `NEXT_PUBLIC_ANDROID_APK_URL`. When
that variable is missing the buttons render a disabled **"Android app — coming
soon"** state (never a `#` link).

`../TreePulse-App/.github/workflows/deploy.yml` builds a release APK when mobile
source or build config changes on `main`, uploads it as the
`treepulse-release-apk` workflow artifact, and republishes it to the `latest`
GitHub Release as **`treepulse-latest.apk`**. Point the env var at the stable
asset URL:

```
NEXT_PUBLIC_ANDROID_APK_URL=https://github.com/Cyizere-Happy/TreePulse-App/releases/latest/download/treepulse-latest.apk
```

Optional metadata shown beside the button — `NEXT_PUBLIC_APK_VERSION`
(defaults to `1.0.0` from `app.json`), `NEXT_PUBLIC_APK_SIZE`,
`NEXT_PUBLIC_APK_UPDATED` — the CI run writes these into `release-metadata.json`
attached to the release.

See `.env.example` for the full list.

## Run locally

```bash
cd landing_page
npm install
cp .env.example .env.local   # optional; page works without it
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint     # eslint (next/core-web-vitals + next/typescript)
npx tsc --noEmit # type-check
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx            Jost font, metadata, viewport
  page.tsx              section assembly + skip link
  globals.css           Tailwind v4 @theme tokens (mapped 1:1 to the app palette)
  icon.svg / apple-icon.png / opengraph-image.png / twitter-image.png
components/
  brand/                TreePulseMark (SVG), TreePulseLogo
  device/PhoneMockup    reusable CSS phone case
  app-screens/          login · dashboard · farms · earnings · notifications
  site/                 Nav · Hero · Overview · Features · Screenshots · DownloadCta · SiteFooter
                        + decor (organic shapes / curves), icons, AndroidDownloadButton, SectionReveal
lib/
  site-config.ts        all page content, cross-referenced to the app source
  apk.ts                APK URL + metadata resolution
public/treepulse-app-icon.png   real app icon (downscaled to 512px)
```
