import "server-only";
import { inflateSync } from "node:zlib";
import catalog from "./data/gaez-rwanda.json";
import { supportedCropIds } from "@/lib/farmer/supportedCrops";

export type Scenario = "rainfed" | "irrigated";
export const gaezCrops = supportedCropIds;
type Layer = (typeof catalog.layers)[keyof typeof catalog.layers];
const decoded = new Map<string, Buffer>();
const globalCache = new Map<string, { until: number; value: GaezResult }>();
type MissingReason = "unsupported_crop" | "invalid_coordinates" | "no_data" | "outside_extent" | "invalid_raster" | "provider_unavailable";
export type GaezResult = { status: "unavailable"; crop: string; scenario: Scenario; source: string; message: string; reason: MissingReason } | { status: "available"; crop: string; scenario: Scenario; source: string; dataset: string; url: string; rawIndex: number; units: string; period: string; climate: string; resolution: string; management: string; limitation: string };
const pending = new Map<string, Promise<GaezResult>>();
let active = 0;
const queue: (() => void)[] = [];
async function limited<T>(work: () => Promise<T>): Promise<T> {
  if (active >= 3) await new Promise<void>((resolve) => queue.push(resolve));
  else active++;
  try { return await work(); } finally { const next = queue.shift(); if (next) next(); else active--; }
}

export async function lookupGaez(lat: number, lon: number, crop: string, scenario: Scenario): Promise<GaezResult> {
  const key = `${crop}:${scenario}` as keyof typeof catalog.layers;
  const layer: Layer | undefined = catalog.layers[key];
  const missing = (reason: MissingReason): GaezResult => ({ status: "unavailable", crop, scenario, source: "FAO GAEZ v5", reason, message: "No verified GAEZ value for this crop, scenario or location." });
  if (!layer) return missing("unsupported_crop");
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return missing("invalid_coordinates");
  // Compensate for floating-point representation of exact grid boundaries.
  const col = Math.floor((lon - layer.west) / layer.xres + 1e-9);
  const row = Math.floor((lat - layer.north) / layer.yres + 1e-9);
  if (col < 0 || col >= layer.width || row < 0 || row >= layer.height) {
    // The FAO global files are Cloud Optimized GeoTIFFs. Read only the required
    // cell by HTTP range; never download a global raster for a single request.
    const cacheKey = `${key}:${Math.floor((lon + 180) * 120 + 1e-9)}:${Math.floor((90 - lat) * 120 + 1e-9)}`;
    const cached = globalCache.get(cacheKey);
    if (cached && cached.until > Date.now()) return cached.value;
    const inFlight = pending.get(cacheKey);
    if (inFlight) return inFlight;
    const request = limited(async (): Promise<GaezResult> => { try {
      const { fromUrl } = await import("geotiff");
      const signal = AbortSignal.timeout(15000);
      const tiff = await fromUrl(layer.url, { allowFullFile: false }, signal);
      const image = await tiff.getImage();
      if (image.getGeoKeys()?.GeographicTypeGeoKey !== 4326) return missing("invalid_raster");
      const [west, north] = image.getOrigin();
      const [xres, yres] = image.getResolution();
      if (Math.abs(xres - 1 / 120) > 1e-9 || Math.abs(yres + 1 / 120) > 1e-9) return missing("invalid_raster");
      const x = Math.floor((lon - west) / xres + 1e-9);
      const y = Math.floor((lat - north) / yres + 1e-9);
      if (x < 0 || x >= image.getWidth() || y < 0 || y >= image.getHeight()) return missing("outside_extent");
      const raster = await image.readRasters({ window: [x, y, x + 1, y + 1], signal });
      const raw = Number(raster[0][0]);
      const value: GaezResult = !Number.isFinite(raw) || raw === layer.nodata || raw < 0 ? missing("no_data") : raw > 10000 ? missing("invalid_raster") : { status: "available", crop, scenario, source: "FAO GAEZ v5", dataset: layer.dataset, url: layer.url, rawIndex: raw, units: "index 0–10000", period: catalog.baseline, climate: catalog.climate, resolution: catalog.resolution, management: catalog.management, limitation: "Historical grid-cell estimate under low-input management, not a field measurement or yield forecast." };
      globalCache.set(cacheKey, { value, until: Date.now() + (value.status === "available" ? 86400000 : 60000) });
      if (globalCache.size > 500) globalCache.delete(globalCache.keys().next().value!);
      return value;
    } catch { return missing("provider_unavailable"); } });
    pending.set(cacheKey, request);
    try { return await request; } finally { pending.delete(cacheKey); }
  }
  try {
    let values = decoded.get(key);
    if (!values) { values = inflateSync(Buffer.from(layer.values, "base64")); decoded.set(key, values); }
    if (values.length !== layer.width * layer.height * 2) return missing("invalid_raster");
    const raw = values.readInt16LE((row * layer.width + col) * 2);
    if (raw === layer.nodata || raw < 0) return missing("no_data");
    if (raw > 10000) return missing("invalid_raster");
    return { status: "available" as const, crop, scenario, source: "FAO GAEZ v5", dataset: layer.dataset, url: layer.url, rawIndex: raw, units: "index 0–10000", period: catalog.baseline, climate: catalog.climate, resolution: catalog.resolution, management: catalog.management, limitation: "Historical grid-cell estimate under low-input management, not a field measurement or yield forecast." };
  } catch { return missing("invalid_raster"); }
}
