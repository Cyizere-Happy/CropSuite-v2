// Run against a local server: node --test tests/environment-rate-limit.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.CROPSUITE_TEST_URL || "http://localhost:3002";
const payload = { lat: -1.9, lon: 30.65, water: "I depend on rainfall", selected: ["Maize"], previous: ["Maize"], allowAlternatives: true, plantingMonth: "2027-02" };
// Separate client IDs keep these deliberately quota-exhausting checks isolated.
const client = `rate-test-${Date.now()}`;
async function request(body, suffix = "") {
  return fetch(`${base}/api/environment`, { method: "POST", headers: { "Content-Type": "application/json", "x-real-ip": client + suffix }, body: JSON.stringify(body), signal: AbortSignal.timeout(45000) });
}

test("repeat and concurrent identical requests reuse results without consuming the expensive lookup limit", { timeout: 90000 }, async () => {
  const batch = await Promise.all(Array.from({ length: 8 }, () => request(payload, "-repeat")));
  assert.ok(batch.every((response) => response.status === 200));
  for (let i = 0; i < 25; i++) {
    const response = await request(payload, "-repeat");
    assert.equal(response.status, 200);
    assert.equal((await response.json()).cache, "cached");
  }
});

test("distinct lookups remain bounded and include a retry interval; cached results remain available", { timeout: 90000 }, async () => {
  for (let year = 2030; year < 2050; year++) {
    const response = await request({ ...payload, plantingMonth: `${year}-02` }, "-distinct");
    assert.equal(response.status, 200);
  }
  const limited = await request({ ...payload, plantingMonth: "2050-02" }, "-distinct");
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  assert.equal((await request({ ...payload, plantingMonth: "2030-02" }, "-distinct")).status, 200);
});
