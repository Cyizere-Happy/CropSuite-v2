import { environmentalData } from "@/lib/environment/server";
import { evaluateRotations } from "@/lib/farmer/rotationEngine";

export const runtime = "nodejs";
export const maxDuration = 30;
const windowMs = 10 * 60_000;
const calls = new Map<string, { requests: number; lookups: number; until: number }>();
type Result = Awaited<ReturnType<typeof environmentalData>> & { rotation: Awaited<ReturnType<typeof evaluateRotations>> | null };
const results = new Map<string, { value: Result; until: number }>();
const pending = new Map<string, Promise<Result>>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  let current = calls.get(ip);
  if (!current || current.until <= now) { current = { requests: 0, lookups: 0, until: now + windowMs }; calls.set(ip, current); }
  const limited = () => Response.json({ error: "Too many requests. Please wait before trying again." }, { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((current.until - Date.now()) / 1000))), "Cache-Control": "private, no-store" } });
  if (++current.requests > 120) return limited();
  if (calls.size > 1000) for (const [key, value] of calls) { if (value.until < now) calls.delete(key); }
  let body: { lat?: unknown; lon?: unknown; water?: unknown; selected?: unknown; previous?: unknown; allowAlternatives?: unknown; plantingMonth?: unknown };
  try { body = await request.json(); if (!body || typeof body !== "object") throw new Error(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const { lat, lon } = body;
  if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return Response.json({ error: "Choose a valid location on the map." }, { status: 400 });
  const list = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length <= 80).slice(0, 20) : [];
  const water = typeof body.water === "string" ? body.water.slice(0, 80) : null;
  const input = { lat, lon, water: water || "", selected: list(body.selected), previous: list(body.previous), allowAlternatives: body.allowAlternatives === true, plantingMonth: typeof body.plantingMonth === "string" && /^\d{4}-\d{2}$/.test(body.plantingMonth) ? body.plantingMonth : "" };
  // Exact request keys preserve field coordinates, crop selections and water assumptions.
  const key = JSON.stringify({ ...input, water });
  const cached = results.get(key);
  if (cached && cached.until > now) return Response.json({ ...cached.value, cache: "cached" }, { headers: { "Cache-Control": "private, no-store" } });
  let task = pending.get(key);
  if (!task) {
    if (++current.lookups > 20) return limited();
    task = (async () => {
      const [data, rotation] = await Promise.all([environmentalData(lat, lon), water !== null ? evaluateRotations(input) : null]);
      return { ...data, rotation };
    })();
    pending.set(key, task);
  }
  try {
    const value = await task;
    // Brief reuse prevents repeated UI requests from consuming the lookup budget.
    const complete = value.forecast.status === "available" && value.history.status === "available";
    results.set(key, { value, until: Date.now() + (complete ? 60_000 : 10_000) });
    if (results.size > 200) results.delete(results.keys().next().value!);
    return Response.json(value, { headers: { "Cache-Control": "private, no-store" } });
  } finally {
    if (pending.get(key) === task) pending.delete(key);
  }
}
