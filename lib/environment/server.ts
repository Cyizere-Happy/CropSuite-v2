import "server-only";
import type { Environment, Forecast, History } from "./types";

const cache = new Map<string, { until: number; value: Environment }>();
const iso = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, "Z");
const mean = (values: number[]) => values.reduce((sum, n) => sum + n, 0) / values.length;
const rounded = (n: number) => Math.round(n * 10) / 10;

async function weather(lat: number, lon: number): Promise<Forecast> {
  const fallback: Forecast = { status: "unavailable", provider: "Meteomatics", message: "The forecast could not be retrieved. Try again later." };
  const user = process.env.METEOMATICS_USERNAME;
  const pass = process.env.METEOMATICS_PASSWORD;
  if (!user || !pass) return { ...fallback, message: "Weather access is not configured yet." };
  const now = new Date();
  now.setUTCMinutes(0, 0, 0);
  const start = new Date(now.getTime() + 3600000);
  const end = new Date(now.getTime() + 48 * 3600000);
  const url = `https://api.meteomatics.com/${iso(start)}--${iso(end)}:PT1H/t_2m:C,precip_1h:mm,wind_speed_10m:ms/${lat},${lon}/json`;
  try {
    const response = await fetch(url, { headers: { Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}` }, cache: "no-store", signal: AbortSignal.timeout(12000) });
    if (!response.ok) return { ...fallback, message: response.status === 401 || response.status === 403 ? "Weather access is unavailable or has expired." : response.status === 429 ? "Weather service limit reached. Please try later." : fallback.message };
    const json = await response.json();
    const values = (parameter: string) => {
      const dates: unknown = json.data?.find((entry: { parameter?: string }) => entry.parameter === parameter)?.coordinates?.[0]?.dates;
      if (!Array.isArray(dates)) return [];
      if (dates.length !== 48) return [];
      return dates.map((point: { date?: unknown; value?: unknown }, index) => {
        const time = typeof point.date === "string" ? Date.parse(point.date) : NaN;
        const expected = start.getTime() + index * 3600000;
        return time === expected && typeof point.value === "number" && Number.isFinite(point.value) && point.value > -900 ? point.value : NaN;
      }).filter((value): value is number => Number.isFinite(value));
    };
    const rain = values("precip_1h:mm"), temp = values("t_2m:C"), wind = values("wind_speed_10m:ms");
    if (rain.length !== 48 || temp.length !== 48 || wind.length !== 48) return { ...fallback, message: "The weather service returned an incomplete forecast." };
    return { status: "available", provider: "Meteomatics", message: "48-hour forecast", retrievedAt: new Date().toISOString(), issuedAt: null, start: iso(now), end: iso(end), rainMm: rounded(rain.reduce((a, b) => a + b, 0)), meanTempC: rounded(mean(temp)), maxWindMs: rounded(Math.max(...wind)) };
  } catch { return fallback; }
}

async function history(lat: number, lon: number): Promise<History> {
  const fallback: History = { status: "unavailable", provider: "NASA POWER", message: "Historical climate could not be retrieved." };
  const year = new Date().getUTCFullYear() - 1;
  const firstYear = year - 4;
  const query = new URLSearchParams({ parameters: "PRECTOTCORR,T2M,ALLSKY_SFC_SW_DWN", community: "AG", longitude: String(lon), latitude: String(lat), start: `${firstYear}0101`, end: `${year}1231`, format: "JSON", "time-standard": "UTC" });
  try {
    const response = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?${query}`, { cache: "no-store", signal: AbortSignal.timeout(16000) });
    if (!response.ok) return fallback;
    const json = await response.json();
    const parameters = json.properties?.parameter;
    const valid = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > -900;
    const months: { year: number; month: number; rain: number; temp: number; solar?: number; days: number }[] = [];
    for (let y = firstYear; y <= year; y++) for (let month = 1; month <= 12; month++) {
      const days = new Date(Date.UTC(y, month, 0)).getUTCDate();
      const rainfall: number[] = [], temperature: number[] = [], sunlight: number[] = [];
      for (let day = 1; day <= days; day++) {
        const key = `${y}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
        const r = parameters?.PRECTOTCORR?.[key], t = parameters?.T2M?.[key], s = parameters?.ALLSKY_SFC_SW_DWN?.[key];
        if (valid(r) && r >= 0) rainfall.push(r);
        if (valid(t)) temperature.push(t);
        if (valid(s) && s >= 0) sunlight.push(s);
      }
      if (rainfall.length !== days || temperature.length !== days) return { ...fallback, message: `Historical climate data for ${firstYear}–${year} was incomplete.` };
      months.push({ year: y, month, rain: rainfall.reduce((a, b) => a + b, 0), temp: mean(temperature), solar: sunlight.length === days ? mean(sunlight) : undefined, days });
    }
    const last = months.filter((item) => item.year === year);
    const monthly = Array.from({ length: 12 }, (_, index) => {
      const values = months.filter((item) => item.month === index + 1);
      const solar = values.map((item) => item.solar).filter((value): value is number => value !== undefined);
      return { month: index + 1, meanRainMm: rounded(mean(values.map((item) => item.rain))), minRainMm: rounded(Math.min(...values.map((item) => item.rain))), maxRainMm: rounded(Math.max(...values.map((item) => item.rain))), meanTempC: rounded(mean(values.map((item) => item.temp))), ...(solar.length === 5 ? { meanSolarMjM2Day: rounded(mean(solar)) } : {}) };
    });
    return { status: "available", provider: "NASA POWER", message: "Historical climate estimate", year, periodStart: firstYear, periodEnd: year, monthly, rainMm: rounded(last.reduce((sum, item) => sum + item.rain, 0)), meanTempC: rounded(last.reduce((sum, item) => sum + item.temp * item.days, 0) / last.reduce((sum, item) => sum + item.days, 0)), days: last.reduce((sum, item) => sum + item.days, 0), retrievedAt: new Date().toISOString() };
  } catch { return fallback; }
}

export async function environmentalData(lat: number, lon: number): Promise<Environment & { cache: "live" | "cached" }> {
  const key = `${lat.toFixed(5)},${lon.toFixed(5)}`;
  const found = cache.get(key);
  if (found && found.until > Date.now()) return { ...found.value, cache: "cached" };
  const [forecast, historical] = await Promise.all([weather(lat, lon), history(lat, lon)]);
  const value = { forecast, history: historical };
  // Short failures prevent stale errors after credentials or connectivity are fixed.
  cache.set(key, { value, until: Date.now() + (forecast.status === "available" && historical.status === "available" ? 15 * 60000 : 60000) });
  if (cache.size > 100) cache.delete(cache.keys().next().value!);
  return { ...value, cache: "live" };
}
