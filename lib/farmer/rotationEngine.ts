import { gaezCrops, lookupGaez, type Scenario } from "@/lib/environment/gaez";

const names: Record<string, string> = { maize: "Maize", "common-beans": "Common beans", sorghum: "Sorghum", soybeans: "Soybeans", groundnuts: "Groundnuts" };
const families: Record<string, string> = { maize: "cereal", sorghum: "cereal", "common-beans": "legume", soybeans: "legume", groundnuts: "legume" };
const idFor = (name: string) => name.trim().toLowerCase().replaceAll(" ", "-");
export type RotationInput = { lat: number; lon: number; water: string; selected: string[]; previous: string[]; allowAlternatives: boolean; plantingMonth: string };

export async function evaluateRotations(input: RotationInput) {
  const scenario: Scenario | null = input.water === "I depend on rainfall" ? "rainfed" : input.water === "I use irrigation" ? "irrigated" : null;
  const selected = input.selected.map(idFor);
  const previous = input.previous.map(idFor);
  const ids = input.allowAlternatives || !selected.length ? [...gaezCrops] : selected;
  const missing = selected.filter((id) => !gaezCrops.some((crop) => crop === id));
  const hasSupportedCrop = ids.some((id) => gaezCrops.some((crop) => crop === id));
  if (!scenario) {
    const scenarios = await Promise.all((["rainfed", "irrigated"] as const).map(async (waterScenario) => {
      const records = await Promise.all(ids.map((id) => lookupGaez(input.lat, input.lon, id, waterScenario)));
      return { scenario: waterScenario, candidates: records.flatMap((item) => item.status === "available" ? [{ id: item.crop, name: names[item.crop] || item.crop, baseline: item.rawIndex, dataset: item.dataset, url: item.url }] : []), unavailable: records.flatMap((item) => item.status === "unavailable" ? [{ crop: item.crop, reason: item.reason }] : []) };
    }));
    const available = scenarios.some((item) => item.candidates.length > 0);
    return { status: available ? "comparison" as const : "unavailable" as const, reason: available ? "Your water is not reliably rainfed or fully irrigated, so both baseline scenarios are shown without selecting a winner." : hasSupportedCrop ? "No FAO baseline cells were found for these crops at the saved map point. Check the point or choose another location." : "These crops do not yet have FAO baseline layers in CropSuite. Choose one of the supported crops.", candidates: [], plans: [], missing, excluded: [], scenario: null, scenarios, plantingMonth: input.plantingMonth };
  }
  const records = await Promise.all(ids.map((id) => lookupGaez(input.lat, input.lon, id, scenario)));
  const candidates = records.flatMap((item) => item.status === "available" && item.rawIndex > 0 ? [{ id: item.crop, name: names[item.crop] || item.crop, family: families[item.crop] || "unknown", baseline: item.rawIndex, dataset: item.dataset, url: item.url, selected: selected.includes(item.crop) }] : []);
  const unavailable = records.filter((item) => item.status === "unavailable").map((item) => item.crop);
  const excluded = records.filter((item) => item.status === "available" && item.rawIndex === 0).map((item) => item.crop);
  // Exploratory ordering only: each season uses the same 2001–2020 GAEZ index.
  // Subtract 500 index units for adjacent crops in the same family; add 250
  // for a farmer's chosen first crop. These weights are not FAO-validated.
  const plans: { crops: string[]; score: number; repeatedFamily: boolean }[] = [];
  for (const first of candidates) for (const second of candidates) for (const third of candidates) {
    const before = previous.map((id) => families[id]).filter(Boolean);
    const repeatBefore = before.includes(first.family);
    const repeat1 = first.family === second.family;
    const repeat2 = second.family === third.family;
    const score = first.baseline + second.baseline + third.baseline - 500 * (Number(repeatBefore) + Number(repeat1) + Number(repeat2)) + (first.selected ? 250 : 0);
    plans.push({ crops: [first.name, second.name, third.name], score, repeatedFamily: repeatBefore || repeat1 || repeat2 });
  }
  plans.sort((a, b) => b.score - a.score || a.crops.join().localeCompare(b.crops.join()));
  const reason = plans.length ? "Comparison uses historical GAEZ grid-cell estimates and simple rotation assumptions. It is provisional and does not assess this field or predict yield." : !hasSupportedCrop ? "These crops do not yet have FAO baseline layers in CropSuite. Choose one of the supported crops." : excluded.length ? "The available FAO indices are zero under this scenario. This baseline does not establish a suitable option for the selected point." : "No FAO baseline cells were found for these crops at the saved map point. Check the point or choose another location.";
  return { status: plans.length ? "exploratory" as const : "unavailable" as const, reason, scenario, candidates, plans: plans.slice(0, 3), missing: [...new Set([...missing, ...unavailable])], unavailable: records.flatMap((item) => item.status === "unavailable" ? [{ crop: item.crop, reason: item.reason }] : []), excluded, plantingMonth: input.plantingMonth, assumptions: { repeatedFamilyPenalty: 500, selectedCropBonus: 250, indexScale: "0–10000", period: "2001–2020", management: "low input", warning: "Weights are illustrative, not FAO-approved or independently validated. Weather is not included in the ranking." } };
}
export type RotationAnalysis = Awaited<ReturnType<typeof evaluateRotations>>;
