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
npm ci
cp .env.example .env.local   # optional; page works without it
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint         # eslint (next/core-web-vitals + next/typescript)
npm run type-check   # tsc --noEmit
npm run build        # production build (output: "standalone")
npm start            # serve the production build
```

## Deployment

The app is containerised (`Dockerfile`, `output: "standalone"`) and deployed to a
self-hosted server as an isolated container. It does **not** touch the existing
admin dashboard on the same host.

| | |
| --- | --- |
| Container name | `treepulse-landing` |
| Host → container port | `3001` → `3000` |
| Image | `ghcr.io/cyizere-happy/treepulse_landing_page:sha-<commit>` (+ `latest`) |
| Server dir | `/opt/treepulse-landing` (`compose.production.yml`, `deploy.sh`) |
| Public URL | `http://41.186.188.96:3001` |

### Pipeline

* **`.github/workflows/ci.yml`** — on PRs and pushes to `main`: `npm ci`, lint,
  type-check, build. `permissions: contents: read`.
* **`.github/workflows/deploy.yml`** — on push to `main`:
  1. `verify` — lint / type-check / build.
  2. `build-and-push` — build the image, push `sha-<full-commit>` **and**
     `latest` to GHCR using the built-in `GITHUB_TOKEN`
     (`permissions: packages: write`), with GHA layer caching. The APK URL is
     injected from the **repository variable** `NEXT_PUBLIC_ANDROID_APK_URL`
     (a variable, not a secret — it is intentionally in the client bundle).
  3. `deploy` — `environment: production`, `concurrency: treepulse-production`.
     Writes the CI deploy key to a `600` file, pins `known_hosts`
     (`StrictHostKeyChecking=yes`), and runs `ssh devops@server "deploy sha-<sha>"`.
     The server's authorized_keys forces `/opt/treepulse-landing/deploy.sh`,
     which validates the `sha-<40 hex>` tag, pulls that immutable image, updates
     only `treepulse-landing`, waits for its health check, verifies
     `http://127.0.0.1:3001`, confirms the admin dashboard still responds, and
     rolls back on any failure. The key file is removed with `if: always()`.

### Required GitHub Actions configuration

Repository → Settings → Secrets and variables → Actions:

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `DEPLOY_HOST` | server IP |
| Secret | `DEPLOY_USER` | `devops` |
| Secret | `DEPLOY_PORT` | `22` |
| Secret | `DEPLOY_SSH_PRIVATE_KEY` | contents of the **CI-only** `treepulse_github_actions` key |
| Secret | `DEPLOY_KNOWN_HOSTS` | verified `ssh-keyscan` line for the server |
| Variable | `NEXT_PUBLIC_ANDROID_APK_URL` | stable public APK URL, or empty for the "Coming soon" state |

The CI key is a **separate** deploy-only key, restricted on the server to
`command="/opt/treepulse-landing/deploy.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty`.
The engineer's personal key stays a separate unrestricted line.

### One-off server preparation

```bash
sudo mkdir -p /opt/treepulse-landing && sudo chown -R devops:devops /opt/treepulse-landing
# copy compose.production.yml and deploy/deploy.sh into /opt/treepulse-landing/
chmod 750 /opt/treepulse-landing/deploy.sh
# if the GHCR package is private: docker login ghcr.io -u <user> --password-stdin  (read:packages token)
```

Then push to `main` and watch **Actions**.

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
