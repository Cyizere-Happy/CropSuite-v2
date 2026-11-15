# CropSuite V2 frontend discovery and UI/UX audit

Audit date: 15 November 2026. Repository inspected at local commit `cc3aa6b`. Paths below are relative to the project root.

## 1. Executive summary

CropSuite has a distinctive full-screen, monochrome farmer film and a light, green agricultural identity. A visitor can enter Demo Mode, complete seven farmer setup steps, review a locally saved plan, and use a responsive dashboard. Crop selection, field details, dashboard navigation, editing and export have interactive implementations. The dashboard communicates a plan made from farmer inputs; assessment, weather, crop comparisons, climate evidence and rotation recommendations remain pending.

The largest communication gap is between the landing page's present-tense promise that CropSuite compares options and explains suggestions and the current demo's pending assessment state. Blank phone mockups make the product difficult to understand even though usable onboarding and dashboard screens now exist. NASA POWER and FAO GAEZ appear as names without an explanation of the data, coverage, time period or limits. The film's farmer silhouette is an established asset, but no separate Crop Suit mascot asset or companion interaction was found in the frontend.

The live homepage returned HTTP 200 in headless Chrome at 1440 × 900 and 375 × 812. Both renders exposed the intro dialog and video, reported no document-level horizontal overflow and emitted no uncaught page errors during the short initial check. This does not establish that all live routes, video playback, contrast, assistive technology or deployments were comprehensively tested in this audit. The detailed interaction observations below come from source inspection and the earlier local acceptance run documented in `artifacts/cropsuite-acceptance/README.md`. The live deployment's commit identity was not independently established.

## 2. Actual frontend architecture

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16.3.4 App Router, React and React DOM 19.2.8, TypeScript. Routes live under `app/`. `app/layout.tsx` provides metadata, Jost, global CSS and the intro boot script. |
| Styling | Tailwind CSS 4 through PostCSS, `app/globals.css`, and `components/farmer/farmer.css`. Landing mostly uses utility classes; farmer screens use scoped CSS classes and local variables. |
| Client behavior | React state, browser events and `useSyncExternalStore`. Next `Link` and `useRouter` drive navigation. `lib/farmer/store.ts` stores a versioned, sanitized demo draft in `localStorage`; intro completion uses `sessionStorage`. |
| Supporting libraries | `qrcode` renders the optional Android download QR. Icons, the donut chart, field outline and decorative shapes use inline SVG. There is no dedicated animation, chart or mapping dependency in `package.json`. |
| Integration boundaries | `lib/farmer/auth.ts` returns an unavailable message. `lib/apk.ts` reads an optional public APK URL. Source inspection found no connected recommendation, weather, map or climate-data UI service. |
| Route layout | `app/(farmer)/layout.tsx` imports farmer CSS. `app/login/page.tsx` also imports it. The route group does not appear in URLs. |
| Other paths | `/og-dev` and `/api/og-dev` are Open Graph development and image endpoints, not farmer screens. `app/icon.svg`, Apple icon and social images are metadata assets. |

The `output` configuration in `next.config.ts` uses the Vercel adapter's default output on Vercel and standalone output for the existing Docker path. This report does not assess backend implementation or deployment readiness.

## 3. Complete route and screen inventory

| Screen | Route | File | Purpose and current UI | Interactions and missing frontend elements |
| --- | --- | --- | --- | --- |
| Intro and home | `/` | `app/page.tsx`, `components/intro/IntroGate.tsx`, `components/site/*` | Session-first cinematic dialog followed by landing sections and phone frames. | Skip, Escape, sound, captions, play fallback, replay, navigation and CTAs. Phone contents are blank. |
| Sign in | `/login` | `app/login/page.tsx`, `components/auth/AuthScreen.tsx` | Email/password form, Google button, demo entry. | Submit and Google show coming-soon messages. Links to sign-up and reset. Demo starts onboarding. |
| Create account | `/signup` | `app/(farmer)/signup/page.tsx`, `AuthScreen.tsx` | Email/password account form. | Validation and unavailable message; no completed-account state. |
| Reset password | `/forgot-password` | `app/(farmer)/forgot-password/page.tsx`, `AuthScreen.tsx` | Email entry for reset. | Shows unavailable message; links back. |
| Setup redirect | `/onboarding` | `app/(farmer)/onboarding/page.tsx` | Redirects to crop selection. | No separate landing page. |
| Crop selection | `/onboarding/crops` | `app/(farmer)/onboarding/[step]/page.tsx`, `OnboardingSteps.tsx` | 24 photo cards, crop search, six categories, custom crop and suggestion preference. | Search, filtering, multi-select, summary and validation work. No crop suitability result. |
| Farm location | `/onboarding/location` | `OnboardingSteps.tsx` | District, sector, optional village, field name, hectares and coordinate text. | Kayonza or another district; valid latitude/longitude can be pasted. There is no interactive map pin picker or measured boundary. |
| Planting period | `/onboarding/planting` | `OnboardingSteps.tsx` | Month/year, optional date and harvest deadline, Help me choose. | Date validation and conditional controls. Guidance remains pending. |
| History | `/onboarding/history` | `OnboardingSteps.tsx` | Recent crop choices including unknown/no previous crop, previous seasons, sequence, outcome and problems. | Choice cards and other-crop select; conditional history form. No rotation result. |
| Goals | `/onboarding/goals` | `OnboardingSteps.tsx` | Six multi-select priorities. | Selectable cards, at least one required. |
| Resources | `/onboarding/resources` | `OnboardingSteps.tsx` | Optional irrigation, area, budget, seeds, soil, drainage and inputs. | Inputs and unknown choices; no calculated resource assessment. |
| Review | `/onboarding/review` | `components/farmer/Review.tsx` | Six editable summary cards and dashboard entry. | Each section links to an edit route with `?edit=1`; no scientific submission/result screen. |
| Dashboard overview | `/dashboard` | `components/farmer/Dashboard.tsx`, `DashboardPanels.tsx`, `FieldWorkspace.tsx`, `FieldTable.tsx` | Field workspace and table, search, weather, resource, activity and analytics cards. | Details, map zoom/expand, selector, export, filters, searches and sidebar. Data limitations are labeled. |
| My Fields | `/dashboard/fields` | `Dashboard.tsx` | Field table and field location rows. | Filter and edit or open map. One derived demo field. |
| Crop Planning | `/dashboard/crop-planning` | `Dashboard.tsx`, `Review.tsx` | Farmer-entered crops, planting, goals and resources. | Edit links. No comparative results. |
| Planting Assessments | `/dashboard/assessments` | `Dashboard.tsx` | Pending assessment empty state with pilot note. | Link to crop plan. |
| Farm History | `/dashboard/history` | `Dashboard.tsx` | Saved history and empty activity log. | Edit history. No rotation timeline. |
| Reports | `/dashboard/reports` | `Dashboard.tsx` | JSON plan export and pending analytics list. | Download plan. No generated scientific report. |
| Settings | `/dashboard/settings` | `Dashboard.tsx` | Display name and demo-session controls. | Save profile locally or leave demo. |
| Help | `/dashboard/help` | `Dashboard.tsx` | Three native disclosure items about editing, map and storage. | Expand/collapse and links. No interactive assistant. |
| Loading/access/errors | Several | `components/farmer/Shared.tsx`, `Onboarding.tsx`, `Dashboard.tsx`, `OnboardingSteps.tsx` | `LoadingState`, `EmptyState`, `Notice`, field errors and error summary. | Incomplete/unauthorized demo routes offer a route back. Unknown dynamic steps and dashboard sections use `notFound()`. No bespoke global application error screen found. |
| Dialogs and disclosures | On `/` and `/dashboard` | `IntroGate.tsx`, `FieldWorkspace.tsx`, `Dashboard.tsx` | Intro is an ARIA dialog; expanded map uses native `<dialog>`; help uses `<details>`. | Intro has Escape/skip; expanded map opens/closes; help toggles. |

## 4. Landing page audit in display order

| Section and file | Copy and visual design | Interactive behavior | Assessment and potential refinement |
| --- | --- | --- | --- |
| Intro, `components/intro/IntroGate.tsx`, `public/intro-captions.json` | “A Seed of Hope” film, monochrome farmer silhouette on a pale stage. Timed poetic text includes “What should she plant?” and “What if knowledge could guide her?” | Autoplay attempts sound, then muted playback; play and sound prompts, skip, Escape, captions toggle, fallback on video error and later footer replay. | Strong emotional introduction and negative space. The film does not by itself explain the product or pilot. Preserve the atmosphere and make the handoff to current demo capabilities clear. |
| Sticky navigation, `components/site/Nav.tsx` | Logo, Home, Overview, Features, Screenshots and Start Planning. Transparent until scroll, then translucent background and blur. | Anchor links, `/login`, responsive hamburger, Escape to close. | Direct entry is visible. The navigation does not explain that authentication is unavailable before reaching the form. |
| Hero, `components/site/Hero.tsx` | “Know your crop. Plan what’s next.” and “CropSuite helps farmers understand their land, compare crop options, and plan their next growing season with confidence informed by data.” Two-column text and floating phone, Kayonza and maize/beans labels. | Start Planning, Explore CropSuite; optional QR if APK URL is configured. | The concise headline and farmer-facing language work. The phone is intentionally blank and the present-tense comparison promise is ahead of the current demo. |
| Overview, `components/site/Overview.tsx`, `lib/site-config.ts` | “From your soil to your next season”; four cards: Know your land, Choose your crops, Plan your season, Think beyond one harvest. Tags name Kayonza, crops, NASA POWER and FAO GAEZ. | Scroll reveal; informational cards. | A clear four-part structure. “It compares your options against available environmental evidence and shows the reasoning behind every suggestion” implies functioning outputs that are absent in the current demo. Dataset tags lack explanations. |
| Features, `components/site/Features.tsx`, `lib/site-config.ts` | “Built around the decisions farmers already make”, followed by “Start from your farm location”, “Compare crops, then pick your planting window”, and “Decisions you understand”. Alternating phones and copy. | Scroll reveals, optional Android download controls. | Alternating layout is readable and worth retaining. Phone displays repeat the same blank state. The text names future comparison, evidence and rotation without showing an example or its present availability. |
| Screenshots, `components/site/Screenshots.tsx` | “A look inside the app”; My Farm, Crop Comparison and Next Crop phones, each “Screen in design”. Copy says real screenshots will replace blank displays. | Horizontal snap-scroll on small screens. | Honest placeholders, but now out of step with the actual browser onboarding/dashboard. No real crop comparison or rotation screen exists to show. |
| Download, `components/site/DownloadCta.tsx`, `AndroidDownloadButton.tsx` | Dark strip, app icon, “Every great harvest begins with a better-informed decision.” and pilot/crop metadata. | APK link and QR depend on a valid `NEXT_PUBLIC_ANDROID_APK_URL`; otherwise disabled “Android — coming soon”. | Strong visual close. It currently emphasizes Android although the functional demo is a browser experience. Actual live environment configuration was not inspected. |
| Footer, `components/site/SiteFooter.tsx` | Rwanda pilot description, navigation, former name FieldShift, “CropSuite does not guarantee yields, prices, weather or harvests”. | Anchor links and “Replay our story”. | Useful honest qualification and replay. Scientific limitations appear late and are not tied to individual feature promises. |

The phone frames are not screenshots or interactive prototypes. `components/app-screens/AppScreen.tsx` ignores its screen name and renders only a status bar, empty body and home indicator. `PhoneMockup.tsx` supplies the frame.

## 5. Current design system

| Element | Source values and observations |
| --- | --- |
| Typeface | Jost, Latin subset, `next/font/google`, `display: swap`, `--font-jost`; fallbacks are system sans. `app/layout.tsx`, `app/globals.css`. No second loaded font found. |
| Typography | Landing hero `2.15rem`/`2.9rem` at `sm`, weight `font-black`, line-height 1.08; section headings `1.7rem`/`2.15rem`; body commonly `14–16px`, card labels as small as `11px`. Farmer headings use `clamp(1.9rem, 3.5vw, 3.25rem)`, weight 660; form labels around `.93rem`. Jost's geometric forms fit a modern cinematic identity, though compact small labels and numerous heavy weights deserve readability testing. |
| Landing tokens | `app/globals.css`: background `#f8faf8`, surface `#ffffff`, primary `#3f8b43`, deep green `#2e6b32`, strong `#15803d`, sage `#e4efe2`, mint `#d6ead9`, ink `#0f172a`, muted `#64748b`, line `#e2e8f0`, blue `#3b82f6`, amber `#f59e0b`, danger `#ef4444`. |
| Farmer tokens | `components/farmer/farmer.css`: ink `#19251e`, muted `#5e6e63`, green `#1c6247`, deep `#124d37`, soft `#e9f3e9`, line `#e2e9e2`, paper `#f6f8f4`. Individual chart colors are hardcoded in `DashboardPanels.tsx`. |
| Layout | Landing `containerClass` is max-width `1080px`, with `px-6`, `sm:px-12`, `lg:px-24`; section vertical padding typically `py-16 sm:py-24`; landing feature/overview columns switch at `lg`. Onboarding max-width `1320px`, desktop 225px step rail and max 960px main. Dashboard desktop grid uses `2.13fr` to `1fr` with minimum right column 280px and 9–10px gaps. |
| Shapes and controls | Landing pill buttons `rounded-full`, cards frequently `rounded-2xl`; farmer buttons 10px, cards 13px, dashboard panels/map 16px. Farmer button minimum height 44px; map and icon controls include smaller sizes. |
| Effects | Landing `--shadow-soft: 0 20px 45px -20px rgba(15,23,42,.25)`; card `0 12px 30px -12px rgba(46,107,50,.22)` and phone `0 40px 80px -24px rgba(15,23,42,.35)`. Translucent backdrops, blur, curves and soft green organic shapes recur. |
| Motion | `globals.css` defines fade, zoom, slide, mask, float, sheen and drop keyframes with `cubic-bezier(0.16,1,0.3,1)` and `cubic-bezier(0.22,1,0.36,1)`. `SectionReveal.tsx` uses IntersectionObserver, 12% threshold and a -10% bottom margin. Hero/reveal durations are roughly 0.7–1.1s, with staggered delays. Buttons use color and small translate hover effects. |
| Scroll | Smooth scrolling and 96px anchor scroll margin; screenshot carousel uses snap scrolling on phones. Desktop dashboard content scrolls inside its full-viewport shell, while the sidebar stays visible. Reduced-motion CSS restores final visible states and disables smooth scrolling. |

The two green palettes share a family but use separate values and sizing systems. Consolidation is a future design decision, particularly for text sizes, focus states and button shapes. No font change is proposed by this audit.

## 6. Existing assets and animations

| Asset | Location and role |
| --- | --- |
| Intro film | `public/cropsuite_seed_of_hope_50s.mp4`, approximately 40.3 MB, 1920 × 1080 and 50 seconds per `lib/intro.ts`. The poster is `public/cropsuite_intro_poster.jpg`, 37,365 bytes. The optional preferred `cropsuite_intro_web_720p.mp4` is referenced but not present. |
| Intro text | `public/intro-captions.json` contains 11 timed poetic cues and placement coordinates. It explicitly says these are not a verified transcript of the narration. `IntroGate.tsx` starts its caption bar off even though the JSON contains default-visible metadata. |
| Brand and icons | `public/cropsuite-app-icon.png`, `app/icon.svg`, `app/apple-icon.png`, social images, `components/brand/CropSuiteLogo.tsx` and `CropSuiteMark.tsx`. The mark is a line-art seedling. `components/farmer/Icon.tsx` and site icon components contain SVG paths. |
| Crop imagery | `public/farmer/crops/` contains 24 WebP tiles matching the catalogue in `lib/farmer/model.ts`, about 9.8–20.9 KB each. Crop cards use `next/image` with `unoptimized`. Asset provenance and generation prompts are recorded in `artifacts/cropsuite-acceptance/README.md`. |
| Field imagery | `public/farmer/field.webp`, 771,402 bytes, and `field-preview.webp`, 13,350 bytes. The dashboard labels the photo and outline illustrative. The same field image also appears in the authentication layout. |
| Other visuals | Phone frames and empty screen chrome are code in `components/device/PhoneMockup.tsx` and `components/app-screens/`. Organic shapes are SVG in `components/site/decor.tsx`. No GIF or dedicated mascot asset was found in `public/` or the component inventory. A character inside the film cannot be ruled out from file names alone. |

## 7. Farmer journey and questionnaire flow

1. A first browser-session visit opens the full-screen intro. The user can skip, wait for completion, or later replay it from the footer. The landing hero and nav link to `/login` as “Start Planning”.
2. The user sees sign-in, can visit create-account or password-reset pages, or selects “Continue in Demo Mode”. Email and Google actions report authentication coming soon rather than entering the product.
3. Crop selection appears first, followed by location, planting period, history, goals, resources and review. Desktop shows a named step rail and progress bar. Below 720px the rail is hidden while step number and progress remain. Back links and review edit links preserve stored answers.
4. Selection requires a crop or custom crop and a suggestion preference. Location requires district and sector. Planting requires a valid month unless “Help me choose” is selected. History requires a recent crop, no prior crop or an unknown answer. At least one goal is required. Resource fields are optional. `lib/farmer/validation.ts` checks field size, coordinate ranges, date consistency and budget.
5. Review presents farmer-provided details. “Continue to My Dashboard” marks the demo plan complete locally. It does not display an assessment, recommendation, yield or comparison result. `lib/farmer/store.ts` uses `cropsuite.farmer.v1`, checks stored shapes and permitted options, listens for cross-tab storage events, and falls back to in-memory state if storage fails. The browser storage notice appears in that case.
6. The dashboard derives one field from the plan, using “My First Field” if unnamed. The farmer can reopen the review and edit data. Separate users or devices do not automatically share this local draft.

## 8. Dashboard inventory and UX analysis

| Element | Current communication and controls | UX opportunity |
| --- | --- | --- |
| Sidebar, `Dashboard.tsx` | Icon-only desktop rail with accessible names/title; dashboard, fields, planning, assessments, history, reports, settings, help and profile. Mobile has a labeled menu. | Discoverability of icon-only destinations and current location can be improved while retaining the compact workspace. |
| Search, `Dashboard.tsx` | Matches section titles, current field name and selected crop names. Links to sections or fields. | Clarify search scope; it does not search external farm records or scientific evidence. |
| Field map, `FieldWorkspace.tsx` | Static sample aerial image, simulated outline and a field label based on the farmer's plan. “Demo field view” and “Illustrative image and outline” are visible. | Keep labels prominent when adapting or expanding the view. Avoid implying the outline or zoom represents a measured location. |
| Field card | Name, farmer-entered location/crops/area/date and “Assessment not yet connected”; dotted decorative arc. | A long crop list can make the panel scroll, as seen in the user-provided screenshot. The arc can resemble a gauge even without a score; explain its pending state through hierarchy. |
| Map controls | Field overlay selector, details toggle, preview reset, zoom, expand/close, locate/reset, JSON export. | Zoom scales a static image, not geographic map tiles. Explore clearer control descriptions for that behavior. |
| Weather, `DashboardPanels.tsx` | Entered location; `—°C`, humidity, rain forecast and wind unavailable; “Weather data not connected”. | An unambiguous empty state exists. Separate current weather and historical climate concepts before adding climate visuals. |
| Resource monitoring | Hardcoded example donut and legend for water, seeds, soil, planting resources and inputs. Week/Month/Year change sample slices. “Sample” and “Illustrative breakdown” are shown. | Chart shape and time controls can look like farmer measurements despite labels. Present the recorded resources and their provenance before any future chart. |
| Weekly activity | Fixed 7 × 6 colored heatmap, “Example calendar”, link to Farm History. | No actual log or activity recording exists. A sample can be mistaken for an actual calendar at a glance. |
| Plan analytics | Crop comparison, planting windows and climate evidence legend; empty guide lines and “Awaiting connected data”; links to Reports. | No historical climate chart, comparison, rotation timeline or evidence detail exists. Differentiate future destinations from available results. |
| Field table, `FieldTable.tsx` | Current field, selected crops, planting period, pending assessment and water availability. Date and water filters; actions open map or editing. Small screens stack row data. | Surface unknowns and actions clearly; long crop lists and small action controls need device testing. |
| Pages | Fields, Planning, Assessments, History, Reports, Settings and Help are implemented as route-specific content in `Dashboard.tsx`. Reports exports the local plan. | Most pages are summaries and pending states. Add meaningful explanation of future work without suggesting generated results exist. |
| Mascot/assistant | No assistant or companion component found. | Decide the role, voice and approved asset before proposing a companion interface. |

## 9. NASA and agricultural content currently displayed

| Topic | Classification | Actual copy and source | Assessment |
| --- | --- | --- | --- |
| Farmer's problem | PRESENT BUT WEAK | Intro asks “What should she plant?” and “What if the harvest fails?” in `public/intro-captions.json`. | The film conveys uncertainty; the landing page does not explain the decision problem or constraints in concrete terms. |
| Pilot location | PRESENT BUT WEAK | Hero “Kayonza pilot · Rwanda”; footer “Initial pilot: Kayonza, Rwanda.” `Hero.tsx`, `SiteFooter.tsx`. | Location is visible; why Kayonza was chosen is not established. An explanation requires verified project context. |
| NASA connection | PRESENT BUT WEAK | “CropSuite is informed by datasets such as NASA POWER and FAO GAEZ where they are verified and integrated.” `lib/site-config.ts`; dataset pills in Overview. | Names appear, but historical rainfall, temperature, time period, resolution and interpretation are not explained. Integration is conditional. |
| Farmer's role | PRESENT BUT WEAK | “Tell CropSuite where you farm, which crops you are considering, when you want to plant and what grew there before.” `Overview.tsx`. | The form collects irrigation and resources too, but the landing page does not connect each answer to a decision or explain unknown values. |
| Crop comparison | MISLEADING OR UNSUPPORTED | “It compares your options against available environmental evidence and shows the reasoning behind every suggestion.” `Overview.tsx`; “Compare crops, then pick your planting window” in `lib/site-config.ts`. | Comparison and reasoning are future capabilities; the current dashboard has pending labels. Present-tense copy may imply they work today. |
| Crop rotation | PRESENT BUT WEAK | “What to plant next, with crop-rotation guidance” and “Consider what to plant next with crop-rotation guidance” in `lib/site-config.ts`. | The benefit is named. History is collected, but no guidance, explanation or visual timeline is shown. |
| Dashboard | PRESENT BUT WEAK | “A look inside the app” and “Real screenshots will replace these blank displays.” `Screenshots.tsx`. | The current landing phones do not demonstrate the implemented browser workspace, climate exploration, alternatives or rotation. |
| Scientific trust | PRESENT BUT WEAK | “Assessment not yet connected” and “Weather data not connected” in the dashboard; “CropSuite does not guarantee yields, prices, weather or harvests” in footer. | These labels are helpful. The landing does not distinguish farmer-entered data, observations, models and hypothetical examples at the point of each claim. |

Additional concept inventory: soil observations and drainage are farmer-entered in `OnboardingSteps.tsx`; irrigation availability is a choice in `model.ts`. Planting month/date and “Help me choose” are collected, while actual planting-window guidance is pending. FAO GAEZ and NASA POWER are named only in landing configuration/tags; no historical rainfall chart, dry-spell metric, attainable yield, modeled suitability score, source citation or observed temperature series was found in the displayed frontend. The weather temperature is an unavailable placeholder. Metadata also mentions crop rotation and Kayonza in `app/layout.tsx`. This is a frontend-content inventory, not an audit of external sources or scientific validity.

The demo does not display a fabricated individual yield or crop success percentage. The sample donut and activity cells have explicit sample labels; their quantitative visual form may nevertheless be read as real information. The fictional map is labeled, though its field name and entered location sit on the image. The farmer's soil notes should continue to be presented as observations rather than sensor measurements.

## 10. Visual storytelling assessment

The intro is a fixed `inset: 0` overlay that precedes the page. `IntroGate.tsx` uses a 16:9 stage calculation: landscape uses cover; portrait uses contain with white letterboxing and a text band where space permits. The poster visibly shows a walking farmer carrying a hoe. The cue JSON describes fields, crop possibilities, children, market, a planning panel and a family reunion. The audit inspected the poster and cue metadata; it did not independently verify every frame or the narration.

On-screen cue positions and fades follow playback time. A requestAnimationFrame loop updates while playing, with `timeupdate` and seek synchronization; the intro cross-fades over 700ms into the landing page. Body scroll is locked during the intro and hero entrance animations wait until the intro leaves. Later page reveals are viewport-triggered rather than a scroll-driven film sequence. The footer replay dispatches an intro event.

The requested emergence of Rwanda's hills and a named Crop Suit companion cannot be confirmed from the inspected poster and code. No separately addressable mascot appears in the public assets or UI. Preserve the existing silhouette, composition, restrained palette, timed text and skip/replay controls. Verify the full film and its audio against the intended story before extending it.

## 11. Responsive, accessibility and performance findings

### Confirmed from source or current checks

| Finding | Evidence and impact |
| --- | --- |
| Homepage fits the two checked widths | Live 1440px and 375px initial renders had matching document and viewport widths; this does not cover every section state or browser. |
| Portrait and desktop adaptation exists | `IntroGate.tsx` switches cover/contain; farmer CSS changes at 1150px, 890px, 720px and 390px; desktop dashboard fills the viewport and mobile panels stack. |
| Intro captions are not verified subtitles | `public/intro-captions.json` explicitly says the poetic cues are not a transcript. An optional caption bar uses these cues, so it does not establish full access to narration. |
| Reduced motion covers CSS motion, not the video | `app/globals.css` removes or shortens animations and smooth scrolling; `IntroGate.tsx` still attempts to play the film. User choice to skip exists. |
| Keyboard and form foundations exist | Intro skip gets focus, Escape closes it, controls have labels; forms use labels, error summary with focus, `aria-invalid`, native radios and buttons; global `:focus-visible` exists. |
| Some controls are small | Desktop map controls are 32 × 32px and dashboard icon links 29 × 29px in `farmer.css`; desktop sidebar links are 42 × 42px. Mobile map controls increase to 37 × 35px. Smaller touch targets make use harder. |
| Large video is loaded aggressively | The available master is approximately 40.3 MB; `<video preload="auto">` is present, and the optional smaller file is absent. Actual transfer depends on browser/network behavior. |
| Font handling and fallbacks exist | Jost is built through `next/font` with `display: swap`; image dimensions are specified for crop tiles. This supports stability but does not establish a measured CLS score. |
| Sample graphics are labeled | Map, resource donut and heatmap include illustrative/sample text, but are visually prominent beside real entered data. |
| Mobile step list is hidden | Below 720px, progress remains but the labeled step navigation is `display: none`. Previous and next controls remain. |

### Suspected or unverified

- Color contrast for small muted text, white-on-image field labels, disabled controls and chart legends has not been measured with a contrast tool.
- Full keyboard focus containment and focus return for the custom intro dialog require assistive-technology testing. The source sets `aria-modal` and focuses Skip, but no focus trap was identified in the inspected component.
- Long crop lists, large text zoom, narrow landscape layouts, slower connections and chart color differentiation need dedicated testing. The user-supplied dashboard image shows a long crop list scrolling inside the field card.
- Video playback, narration intelligibility and synchronised captions were not audited end to end against the live site in this pass. Prior local acceptance tested control responses and video byte ranges; it did not verify narration transcription.
- The 40.3 MB asset, animated filter and frame loop may affect mobile data use and playback performance. No network throttling, Core Web Vitals or battery measurements were performed.

## 12. Missing content and screens

- No functional crop comparison, recommendation, suitability result, ranking, rotation visualization, planting-window result, historical climate series or evidence detail is present.
- No visual explanation connects farmer inputs to observed data, assumptions and a future evidence-supported choice.
- No verified explanation of why Kayonza was selected or the pilot's geographic and scientific limits appears in the landing copy.
- No clear, farmer-facing explanation of NASA POWER rainfall and temperature, FAO GAEZ, temporal coverage, spatial resolution or confidence is displayed.
- No separate mascot, AI assistant, guided companion or reusable mascot animation was found.
- No verified narration transcript is supplied. The existing caption JSON identifies its copy as poetic screen text.
- The phone mockups remain blank despite a usable browser demo. There is no actual interactive map picker, measured farm boundary or multi-field management flow.

## 13. Features to preserve

- The farmer silhouette, uncluttered white film stage, carefully timed words, full-viewport introduction and footer replay.
- Skip, sound, captions toggle, autoplay fallbacks, video error fallback, session behavior and reduced-motion final-state support, while improving transcript accessibility.
- The Jost typography, restrained green-and-white palette, soft curves, generous composition and mobile stacking as the starting visual language.
- The functional crop catalogue, unknown answers, validations, editable review, storage warning and local demo persistence.
- The large field workspace, responsive dashboard structure, transparent field card, labeled demo image and honest pending/empty states.
- The separation between farmer-entered facts, illustrative visualizations and unavailable services, strengthened wherever the distinction is easy to miss.

## 14. Prioritized frontend refinement opportunities

| Priority | Area and existing implementation | Problem or missed opportunity | Proposed direction | Likely files | Frontend-only |
| --- | --- | --- | --- | --- | --- |
| HIGH | A/J. `Hero.tsx`, `Overview.tsx`, `lib/site-config.ts` promise comparison in present tense. | The visible experience does not yet produce evidence-based suggestions. | Align capability wording and labels with the demo's actual state while retaining the cinematic story and expressing the intended future journey. | `Hero.tsx`, `Overview.tsx`, `Features.tsx`, `site-config.ts` | Yes. |
| HIGH | D/F. Seven-step wizard and dashboard retain farmer answers. | Users do not see how their answers would inform a decision. The dashboard starts with sample visuals. | Show a clear, labeled input-to-evidence-to-decision journey and meaningful pending states using only entered or explicitly illustrative content. | `OnboardingSteps.tsx`, `Review.tsx`, `Dashboard.tsx`, `DashboardPanels.tsx` | Yes for explanation and mock states. |
| HIGH | F/J. Donut, heatmap and map are visually rich, labeled examples. | Quantitative-looking graphics can be read as real farm activity. | Strengthen provenance and empty-state hierarchy; distinguish sample and user-entered information at the point of use. | `DashboardPanels.tsx`, `FieldWorkspace.tsx`, `FieldTable.tsx`, `farmer.css` | Yes. |
| HIGH | I. Intro has timed poetic text and an optional caption bar. | Cue file says it is not a verified audio transcript. | Obtain an accurate transcript and design accessible caption controls and reduced-motion behavior around it. | `IntroGate.tsx`, `public/intro-captions.json`, `app/globals.css` | UI can be frontend-only; transcript requires source verification. |
| HIGH | C/J. Dataset names appear in feature copy and pills. | A farmer cannot tell what Earth observations contribute, their time basis or limits. | Explain historical rainfall and temperature in plain language after validating sources, coverage and project scope. Clearly distinguish observations, models and farmer inputs. | `site-config.ts`, `Overview.tsx`, `Features.tsx`, future evidence UI | UI yes; factual content needs validation. |
| MEDIUM | B. Kayonza appears in hero and footer. | No explanation of selection or coverage. | Add a concise evidence-backed pilot rationale once project owners supply it. | `Hero.tsx`, `Overview.tsx`, `site-config.ts` | Yes, with verified copy. |
| MEDIUM | E. History form asks what grew before. | No sequence visualization or explanation of rotation exists. | Explore an explicitly illustrative season-by-season timeline, with unknown entries and no unsupported recommendations. | `OnboardingSteps.tsx`, `Review.tsx`, `Dashboard.tsx`, `farmer.css` | Yes for illustrative UI. |
| MEDIUM | Landing phones in `AppScreen.tsx` and `Screenshots.tsx` are empty. | Visitors cannot see actual available functionality. | Use accurate current browser screen imagery or representations, with pending features clearly identified. | `AppScreen.tsx`, `Screenshots.tsx`, `Hero.tsx`, `Features.tsx` | Yes. |
| MEDIUM | G. Two related token sets, small metadata and compact icon controls. | Hierarchy and readability vary between landing and app. | Audit type scale, contrast, target sizes and shared semantic tokens while preserving Jost and the visual character. | `app/globals.css`, `farmer.css`, `lib/site-config.ts` | Yes. |
| MEDIUM | I. Full-size master video and always-attempted autoplay. | Potential delay and data cost; reduced-motion preference does not prevent playback. | Evaluate a compressed asset, loading strategy, transcript and optional motion experience without losing skip/replay. | `lib/intro.ts`, `IntroGate.tsx`, `public/`, `app/globals.css` | Yes, subject to approved media and transcript. |
| LOW | H. Seedling brand mark exists; no companion implementation found. | The proposed Crop Suit character has no defined visual or interaction role. | Establish approved character assets, language and appropriate help moments before adding guidance. | `components/brand/`, future companion component, onboarding/dashboard | Yes for UI after decisions. |

## 15. Specific files likely to change during implementation

- Story and content: `lib/site-config.ts`, `components/site/Hero.tsx`, `Overview.tsx`, `Features.tsx`, `Screenshots.tsx`, `DownloadCta.tsx`, `SiteFooter.tsx`.
- Film and accessibility: `components/intro/IntroGate.tsx`, `ReplayIntroButton.tsx`, `lib/intro.ts`, `public/intro-captions.json`, approved assets under `public/`, and `app/globals.css`.
- Farmer flow: `components/farmer/Onboarding.tsx`, `OnboardingSteps.tsx`, `Review.tsx`, `Shared.tsx`, and `lib/farmer/model.ts` for data-driven text or illustrative frontend structures.
- Workspace: `components/farmer/Dashboard.tsx`, `DashboardPanels.tsx`, `FieldWorkspace.tsx`, `FieldTable.tsx`, `farmer.css`, and `lib/farmer/dashboard.ts`.
- Visual consistency: `app/layout.tsx`, `app/globals.css`, `components/brand/`, `components/device/PhoneMockup.tsx`, and `components/app-screens/AppScreen.tsx` if the approved direction requires them.

These are likely touch points, not an implementation prescription. Retain current routes, saved-data compatibility and working interactions when future changes are designed.

## 16. Proposed future frontend-only phases

1. **Truth and accessibility baseline.** Align present-tense promises with implemented capabilities, clarify sample data, audit contrast/targets and establish a verified narration transcript.
2. **Story and pilot explanation.** Refine the existing cinematic handoff and explain the farmer's decision, pilot rationale and Earth-data role using approved evidence.
3. **Inputs to plan.** Explain each questionnaire group, improve review and expose farmer-provided facts beside clearly pending evidence.
4. **Visual decision concepts.** Prototype labeled crop comparison, climate and rotation views with representative states and no unsupported results. Validate comprehension with farmers before connecting services.
5. **Workspace and cross-device polish.** Improve dashboard hierarchy, consistency, accessibility, long-content handling and performance. Validate mobile, desktop, reduced motion and slow network conditions.
6. **Companion direction.** If a mascot is approved, define its asset, role and writing, then introduce it where it helps users understand the flow.

## 17. Unknowns and limitations

- Why Kayonza was selected, the validated scientific sources, geographic coverage, actual data periods and the exact target audiences/languages need project-owner confirmation.
- The intended Crop Suit mascot, source artwork, naming and whether it appears in any film frames remain unverified.
- The entire film and narration were not transcribed or reviewed frame by frame in this audit. No claim is made that the current poetic captions reproduce audio.
- Live browser checks covered the homepage's initial desktop/mobile render only. Earlier local acceptance screenshots are in `artifacts/cropsuite-acceptance/`; their data and viewport choices are test fixtures, and live parity was not established.
- No screen-reader session, comprehensive keyboard audit, automated contrast scan, slow-network benchmark or full cross-browser/device study was performed. Frontend scientific copy was inventoried; scientific sources were not independently validated.
- The deployed APK URL and live environment configuration were not accessed. The UI branches based on configuration described in `lib/apk.ts`.
- Decide whether sample dashboard charts should remain visible, be visually subordinate, or give way to farmer-entered information. Decide what a frontend-only comparison and rotation demonstration may show before validated evidence is connected.

## WHAT WE SHOULD REFINE FIRST

1. **Align the landing promise with the demo.** Visitors currently see claims of comparison and explanatory suggestions before reaching a pending assessment.
2. **Make dashboard provenance unmistakable.** Farmer inputs, demo imagery, example charts and unavailable data need an immediate, consistent hierarchy.
3. **Explain the farmer's decision and the role of their answers.** Connect the existing questionnaire to the intended planning journey so each step has a clear purpose.
4. **Verify and explain the scientific story.** Confirm the Kayonza rationale and source scope, then describe historical Earth data and limitations in plain language.
5. **Make the intro accessible and efficient.** Obtain a verified transcript, review reduced-motion behavior and measure video loading while preserving the existing cinematic identity.
