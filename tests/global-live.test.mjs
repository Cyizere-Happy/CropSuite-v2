// Optional live provider check; requires a running server and valid credentials.
import test from "node:test";
import assert from "node:assert/strict";

const places = [
  ["Kayonza, Rwanda", -1.9, 30.65], ["Nairobi, Kenya", -1.2921, 36.8219],
  ["Accra, Ghana", 5.6037, -0.187], ["São Paulo, Brazil", -23.5505, -46.6333],
  ["New Delhi, India", 28.6139, 77.209], ["Paris, France", 48.8566, 2.3522],
];
const base = process.env.CROPSUITE_TEST_URL || "http://localhost:3002";
for (const [place, lat, lon] of places) {
  test(`live global services: ${place}`, { timeout: 55000 }, async () => {
    const response = await fetch(`${base}/api/environment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat, lon, water: "I depend on rainfall", selected: ["Maize"], previous: ["Maize"], allowAlternatives: true, plantingMonth: "2027-02" }), signal: AbortSignal.timeout(50000) });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.forecast.provider, "Meteomatics");
    assert.equal(body.history.provider, "NASA POWER");
    if (body.forecast.status === "available") assert.equal(Date.parse(body.forecast.end) - Date.parse(body.forecast.start), 48 * 3600000);
    if (body.history.status === "available") {
      assert.equal(body.history.monthly.length, 12);
      assert.equal(body.history.periodEnd - body.history.periodStart, 4);
      assert.ok(body.history.monthly.every((item) => item.minRainMm <= item.meanRainMm && item.meanRainMm <= item.maxRainMm));
    }
    const rotation = body.rotation;
    assert.ok(["exploratory", "unavailable"].includes(rotation.status));
    assert.ok(rotation.candidates.every((item) => item.baseline > 0 && /HP0120/.test(item.dataset)));
    assert.ok(rotation.plans.every((plan) => plan.crops.length === 3));
    console.log(JSON.stringify({ place, forecast: body.forecast.status, history: body.history.status, candidates: rotation.candidates.map((item) => `${item.name}:${item.baseline}`), excluded: rotation.excluded, unavailable: rotation.unavailable, plans: rotation.plans.length }));
  });
}
