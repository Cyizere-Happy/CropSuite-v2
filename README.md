# CropSuite landing page

The public landing page for **CropSuite** (originally developed as
**FieldShift**) — a Rwanda-first crop-planning and rotation decision-support
platform. Built with **Next.js 16 (App Router)**, **TypeScript**,
**Tailwind CSS v4** and reusable React components.

The page keeps the complete visual system of the earlier TreePulse build of
this site — the same colour tokens, Jost typography, layout and section order,
phone mockups and their placement, backgrounds, curves and motion — and
replaces only the public branding and wording. A cinematic introduction video
now plays once per browser session before the landing page.

## What it says about CropSuite

Everything on the page is limited to what the platform is designed to do:

| Landing-page claim | Basis |
| --- | --- |
| Identify your farm location; explore agricultural and climate evidence | Core farmer flow (Know Your Land) |
| Compare the crops you are considering and the factors behind the choice | Choose Your Crops |
| Explore planting windows and the conditions that matter before you sow | Plan Your Season |
| Consider what to plant next with crop-rotation guidance | Think Beyond One Harvest |
| See the reasons, assumptions and limitations behind a plan | Decisions You Understand |
| Initial pilot: Kayonza, Rwanda · initial crops: maize and common beans | Pilot scope |
| Informed by NASA POWER and FAO GAEZ, where verified and integrated | Data sources |

The page makes **no** claims about yields, prices, weather outcomes or
harvests, and shows no adoption or performance statistics. The numbers inside
the phone mockups (plot sizes, a rainfall figure, a planting window) are
labelled demo records.

## Cinematic introduction

`components/intro/IntroGate.tsx` is a full-screen layer rendered **before** the
landing page (`app/page.tsx`); the landing page itself is untouched underneath.

* Assets in `public/`: `cropsuite_seed_of_hope_50s.mp4` (1920×1080, 50 s,
  stereo narration), `cropsuite_intro_poster.jpg`, `intro-captions.json`.
  Drop in `cropsuite_intro_web_720p.mp4` and `lib/intro.ts` prefers it
  automatically.
* Fills landscape screens edge to edge (`object-fit: cover`); on portrait
  phones it is letterboxed in the same white. The film's light-grey stage is
  lifted to page white (`filter: brightness`) and its edges are feathered, so
  the silhouettes sit directly on the page like a 3D model.
* Starts **with the narration** whenever the browser allows it. If sound
  autoplay is blocked the film still starts muted and a **Tap for sound**
  button brings the narration in; if all autoplay is blocked a **Play
  introduction** button appears.
* Timed poetic lines from `intro-captions.json` fade in over the white
  negative space with or without sound (upper-right early, upper-left once the
  CropSuite panel appears; two cues moved to the left after checking the
  frames). Cue sync uses `video.currentTime` on `timeupdate`, `seeked` and a
  rAF loop, so it survives buffering and seeking.
* Independent **Captions** toggle (bottom bar), **Skip introduction** at any
  time (also `Esc`) and a **Continue to CropSuite** fallback if the file fails.
* Completion is remembered in `sessionStorage` (`cropsuite_intro_seen`); a
  pre-paint script in `app/layout.tsx` flags `<html data-intro>` on the home
  page so returning visitors never see a flash and the hero's on-load
  animations wait until the layer leaves. **Replay our story** in the footer
  re-opens it.
* The captions JSON is editorial on-screen text, **not** a verified transcript
  of the narration.

## Get Started → sign-in

**Get Started** (nav + hero) opens `/login` (`app/login/page.tsx`): the same
tokens, type and background shapes, with a **Continue with Google** button.
No identity provider is connected yet — the button explains that instead of
pretending to sign anyone in (`components/auth/GoogleSignInButton.tsx`).

## Screenshots

The CropSuite screens are still in design, so every phone mockup shows a
clean, blank display (`components/app-screens/AppScreen.tsx`: status bar +
home indicator only). The frames, sizes, tilt, shadows and placement are the
original ones; real screenshots can be dropped into the same slots later.

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
that variable is missing the buttons render a disabled **"Android — coming
soon"** state (never a `#` link). Leave it empty until a CropSuite build exists;
the previous TreePulse APK must not be configured for this site.

Optional metadata shown beside the button: `NEXT_PUBLIC_APK_VERSION`,
`NEXT_PUBLIC_APK_SIZE`, `NEXT_PUBLIC_APK_UPDATED` (all hidden when empty).

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
  layout.tsx            Jost font, metadata, viewport, intro boot script
  page.tsx              intro layer + section assembly + skip link
  login/page.tsx        sign-in screen (Get Started)
  globals.css           Tailwind v4 @theme tokens (mapped 1:1 to the app palette)
  icon.svg / apple-icon.png / opengraph-image.png / twitter-image.png
components/
  brand/                CropSuiteMark (SVG), CropSuiteLogo
  intro/                IntroGate (cinematic introduction), ReplayIntroButton
  device/PhoneMockup    reusable CSS phone case
  app-screens/          blank phone display (status bar + home indicator) until real screens exist
  auth/                 GoogleSignInButton (placeholder until OAuth is connected)
  site/                 Nav · Hero · Overview · Features · Screenshots · DownloadCta · SiteFooter
                        + decor (organic shapes / curves), icons, AndroidDownloadButton, SectionReveal
lib/
  site-config.ts        all page content
  apk.ts                APK URL + metadata resolution
  intro.ts              picks the intro video file (720p web version if present)
  intro-events.ts       session key + replay/done events shared with the page
public/cropsuite-app-icon.png   app icon (512px), generated from the SVG mark
public/cropsuite_seed_of_hope_50s.mp4 · cropsuite_intro_poster.jpg · intro-captions.json
```
