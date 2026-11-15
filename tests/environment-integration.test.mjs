// Run against the locally started application with: node --test tests/environment-integration.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.CROPSUITE_TEST_URL || "http://localhost:3002";
const input = { lat: -1.9, lon: 30.65, water: "I depend on rainfall", selected: ["Maize"], previous: ["Maize"], allowAlternatives: true, plantingMonth: "2027-02" };
async function query(overrides = {}) {
  const response = await fetch(`${base}/api/environment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...input, ...overrides }) });
  return { response, body: await response.json() };
}

test("verified Kayonza GAEZ raster extraction and evidence", async () => {
  const { response, body } = await query();
  assert.equal(response.status, 200);
  assert.equal(body.rotation.scenario, "rainfed");
  const maize = body.rotation.candidates.find((item) => item.id === "maize");
  assert.equal(maize.baseline, 2205); // Independently checked against the FAO GeoTIFF with Rasterio.
  assert.match(maize.dataset, /HP0120\.AGERA5\.HIST\.MZE\.LRLM$/);
  assert.equal(body.rotation.assumptions.period, "2001–2020");
  assert.match(body.rotation.assumptions.warning, /not FAO-approved/);
});

test("irrigation scenario, rotation ranking and alternatives", async () => {
  const { body } = await query({ water: "I use irrigation" });
  assert.equal(body.rotation.scenario, "irrigated");
  assert.ok(body.rotation.candidates.every((item) => item.dataset.endsWith(".LILM")));
  assert.ok(body.rotation.plans.length > 1);
  assert.ok(body.rotation.plans.every((plan) => plan.crops.length === 3));
  assert.ok(body.rotation.plans.every((plan, i, plans) => i === 0 || plans[i - 1].score >= plan.score));
  assert.notDeepEqual(body.rotation.plans[0].crops, body.rotation.plans[1].crops);
});

test("intermittent water compares both scenarios without fabricating a plan", async () => {
  const uncertain = await query({ water: "Sometimes both" });
  assert.equal(uncertain.body.rotation.status, "comparison");
  assert.deepEqual(uncertain.body.rotation.plans, []);
  assert.deepEqual(uncertain.body.rotation.scenarios.map((item) => item.scenario), ["rainfed", "irrigated"]);
  assert.ok(uncertain.body.rotation.scenarios.every((item) => item.candidates.length > 0));
});

test("unsupported crops do not get fabricated plans", async () => {
  const unsupported = await query({ selected: ["Rice"], allowAlternatives: false });
  assert.equal(unsupported.body.rotation.status, "unavailable");
  assert.deepEqual(unsupported.body.rotation.plans, []);
  assert.ok(unsupported.body.rotation.missing.includes("rice"));
  assert.deepEqual(unsupported.body.rotation.unavailable, [{ crop: "rice", reason: "unsupported_crop" }]);
});

test("Rwanda locations beyond the old Kayonza clip can use verified data", async () => {
  const expanded = await query({ lat: -1.95, lon: 29.9 });
  assert.equal(expanded.response.status, 200);
  assert.equal(expanded.body.rotation.candidates.find((candidate) => candidate.id === "maize")?.baseline, 1452);
});

test("a location outside Rwanda reads the official global raster", async () => {
  const global = await query({ lat: -0.25, lon: 37.15, allowAlternatives: false });
  assert.equal(global.response.status, 200);
  // Independently checked against the official FAO GeoTIFF using Rasterio.
  assert.equal(global.body.rotation.candidates.find((candidate) => candidate.id === "maize")?.baseline, 4323);
});

test("invalid coordinates are rejected", async () => {
  const { response } = await query({ lat: 99 });
  assert.equal(response.status, 400);
});

test("zero baseline excludes a crop under that scenario", async () => {
  const { body } = await query({ lat: -1.6125, lon: 30.429167, allowAlternatives: false });
  assert.ok(body.rotation.excluded.includes("maize"));
  assert.equal(body.rotation.plans.length, 0);
});

test("same-family history applies the documented rotation penalty", async () => {
  const repeated = await query({ allowAlternatives: false, previous: ["Maize"] });
  const different = await query({ allowAlternatives: false, previous: ["Common beans"] });
  assert.equal(different.body.rotation.plans[0].score - repeated.body.rotation.plans[0].score, 500);
  assert.equal(repeated.body.rotation.plans[0].repeatedFamily, true);
});

test("forecast and historical data retain distinct provenance", async () => {
  const { body } = await query();
  assert.equal(body.history.provider, "NASA POWER");
  assert.equal(body.forecast.provider, "Meteomatics");
  if (body.history.status === "available") assert.ok(body.history.year < new Date().getUTCFullYear());
  if (body.history.status === "available") {
    assert.equal(body.history.monthly.length, 12);
    assert.equal(body.history.periodEnd - body.history.periodStart, 4);
    assert.ok(body.history.monthly.every((item) => item.minRainMm <= item.meanRainMm && item.meanRainMm <= item.maxRainMm));
  }
  if (body.forecast.status === "available") assert.ok(Date.parse(body.forecast.end) > Date.parse(body.forecast.start));
  assert.doesNotMatch(JSON.stringify(body), /Authorization|METEOMATICS_PASSWORD/);
});
