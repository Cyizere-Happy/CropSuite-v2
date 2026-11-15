import { environmentalData } from "@/lib/environment/server";
import { evaluateRotations } from "@/lib/farmer/rotationEngine";

export const runtime = "nodejs";
export const maxDuration = 30;
const calls = new Map<string, { count: number; until: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = calls.get(ip);
  if (!current || current.until <= now) calls.set(ip, { count: 1, until: now + 600000 });
  else if (++current.count > 20) return Response.json({ error: "Please wait before requesting more weather updates." }, { status: 429 });
  if (calls.size > 1000) for (const [key, value] of calls) { if (value.until < now) calls.delete(key); }
  let body: { lat?: unknown; lon?: unknown; water?: unknown; selected?: unknown; previous?: unknown; allowAlternatives?: unknown; plantingMonth?: unknown };
  try { body = await request.json(); if (!body || typeof body !== "object") throw new Error(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const { lat, lon } = body;
  if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return Response.json({ error: "Choose a valid location on the map." }, { status: 400 });
  const list = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length <= 80).slice(0, 20) : [];
  const [data, rotation] = await Promise.all([environmentalData(lat, lon), typeof body.water === "string" ? evaluateRotations({ lat, lon, water: body.water, selected: list(body.selected), previous: list(body.previous), allowAlternatives: body.allowAlternatives === true, plantingMonth: typeof body.plantingMonth === "string" && /^\d{4}-\d{2}$/.test(body.plantingMonth) ? body.plantingMonth : "" }) : null]);
  return Response.json({ ...data, rotation }, { headers: { "Cache-Control": "private, no-store" } });
}
