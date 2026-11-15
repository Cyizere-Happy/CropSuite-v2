import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-side lookup for the CropSuite introduction assets in /public.
 *
 * The cinematic master is `cropsuite_seed_of_hope_50s.mp4` (1920×1080, 50 s,
 * stereo narration). When a web-optimised `cropsuite_intro_web_720p.mp4` is
 * dropped into /public it is preferred automatically; nothing else changes.
 */
const WEB_FILE = "cropsuite_intro_web_720p.mp4";
const MASTER_FILE = "cropsuite_seed_of_hope_50s.mp4";
const POSTER_FILE = "cropsuite_intro_poster.jpg";

export function introAssets(): { videoSrc: string; posterSrc: string } {
  const publicDir = path.join(process.cwd(), "public");
  const useWeb = existsSync(path.join(publicDir, WEB_FILE));
  return {
    videoSrc: `/${useWeb ? WEB_FILE : MASTER_FILE}`,
    posterSrc: `/${POSTER_FILE}`,
  };
}
