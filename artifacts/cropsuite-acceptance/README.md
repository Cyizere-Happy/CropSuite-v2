# CropSuite frontend acceptance

The browser checks ran in Chrome against the local Next.js production build. Screenshots use test answers. The desktop capture uses a 1440 × 1036 viewport and the mobile capture uses a 390 × 844 viewport.

## Screenshots

| Screen | Capture |
| --- | --- |
| Crop selection | [Open screenshot](01-crop-selection.png) |
| Farm location | [Open screenshot](02-farm-location.png) |
| Planting season | [Open screenshot](03-planting-season.png) |
| Farming history | [Open screenshot](04-farming-history.png) |
| Available resources | [Open screenshot](05-resources.png) |
| Review information | [Open screenshot](06-review.png) |
| Desktop dashboard | [Open screenshot](07-dashboard-desktop.png) |
| Mobile dashboard | [Open screenshot](08-dashboard-mobile.png) |

## Verified behavior

- The introduction opened, the video URL served byte ranges, and captions, mute and skip controls responded. Start Planning opened the sign-in screen.
- Sign-in, account creation, Google entry and password reset displayed the pending authentication state. Demo Mode opened crop selection.
- Crop search, category filters, multi-selection and a custom crop worked. The questionnaire preserved answers while moving back and forward. The test verified an outside-pilot district after a refresh, then completed a Kayonza plan.
- Required answers, coordinates, harvest order and positive field area validated. Unknown irrigation stayed unknown. The review allowed section edits, and the completed plan survived refresh.
- The dashboard displayed the stored crop, location and resource information. Field selection, detail toggling, zoom, expand, table filtering, sidebar pages, search, profile edits and JSON export worked. On mobile, the map controls remained reachable while the field card was open and field actions were available in the stacked table.
- ESLint, TypeScript and the production build passed. The browser checks reported no console errors or uncaught page errors.

## Dashboard comparison

The final desktop central workspace measured 861 × 741 pixels in the 1440 × 1036 capture. The rail, map, monitoring table and right-hand panel stack follow the reference layout. The dark field card uses a pending assessment indicator, and the weather, activity, resource and analytics panels identify unavailable or illustrative data. The field outline and photo are illustrative. A farmer can paste coordinates into the location form.

## Image assets

The built-in image generation tool created the original photos. The optimized map image and preview are saved to [field.webp](../../public/farmer/field.webp) and [field-preview.webp](../../public/farmer/field-preview.webp). The catalogue tiles are saved under [public/farmer/crops](../../public/farmer/crops).

**Field image prompt**

> Generate a photorealistic aerial drone photograph for the background of the CropSuite demo map. Landscape approximately 1.2:1 or 4:3. Looking straight down (slight oblique angle) filling the entire frame with a quilt of dense textured mature golden-green maize, vivid green crops, and dark green rows in organically shaped farmland plots in eastern Rwanda. Distinct narrow curving brown walking paths divide the plots; a tiny farm shed in the upper left. Composition: large olive-green plot with a curving path edge in the lower-left to center, broad diagonal blocks of richly textured fields and paths across upper half, saturated yet natural well-lit greens and warm golds. Like an editorial aerial photograph, fine texture, no sky, no text, no dashboard, no map markers or overlay.

**Crop catalogue prompt**

> Create a contact sheet for crop catalogue UI assets, 4 columns and 6 rows, 24 perfectly aligned equal rectangular photo tiles, edge to edge, zero gutters or borders, no lettering. Landscape source image, each cell has its own natural light sharp realistic close-up editorial crop photograph with centered crop and dark or green organic backdrop. EXACT row-major order: row 1 maize cob, rice panicles, red sorghum seed head, golden wheat ears; row 2 pearl millet head, speckled dry common beans, green soybeans in pods, groundnuts in shell; row 3 green peas in pods, cassava roots, orange sweet potatoes, Irish potatoes; row 4 ripe red tomatoes, brown and red onions, green cabbage, orange carrots; row 5 bell peppers, purple eggplant, green-yellow bananas, green avocados one halved; row 6 ripe mangoes one halved, purple passionfruit one halved, red coffee cherries, tea leaves on plant. No montage inside the tiles, no text.

