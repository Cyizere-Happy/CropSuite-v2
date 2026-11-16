import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the recorded demo snapshot contains a complete, labeled example plan", async () => {
  const snapshot = JSON.parse(await readFile(new URL("../lib/farmer/demo-snapshot.json", import.meta.url), "utf8"));
  assert.equal(snapshot.cache, "sample");
  assert.equal(snapshot.forecast.status, "available");
  assert.equal(snapshot.forecast.provider, "Meteomatics");
  assert.ok(Date.parse(snapshot.forecast.end) > Date.parse(snapshot.forecast.start));
  assert.equal(snapshot.history.status, "available");
  assert.equal(snapshot.history.provider, "NASA POWER");
  assert.equal(snapshot.history.monthly.length, 12);
  assert.equal(snapshot.rotation.status, "exploratory");
  assert.equal(snapshot.rotation.scenario, "rainfed");
  assert.ok(snapshot.rotation.candidates.some((crop) => crop.id === "maize" && crop.baseline > 0));
  assert.ok(snapshot.rotation.plans.length > 0);
  assert.ok(snapshot.rotation.plans.every((plan) => plan.crops.length === 3));
  assert.match(snapshot.rotation.assumptions.warning, /not FAO-approved/);
});
