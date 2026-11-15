import { explainReason, type ReasonCode } from "./reasons";
import type { FarmerOnboardingDraft } from "./model";
import { cropNames } from "./model";
import type { Environment } from "@/lib/environment/types";
import type { RotationAnalysis } from "./rotationEngine";

const families: Record<string, string> = { maize: "cereal", sorghum: "cereal", rice: "cereal", "common beans": "legume", soybeans: "legume", groundnuts: "legume" };

export function cropConsiderations(draft: FarmerOnboardingDraft, data: (Environment & { rotation?: RotationAnalysis | null }) | null, language: "en" | "rw" = "en") {
  const chosen = cropNames(draft.selection);
  const examples = chosen.length ? chosen : (data?.rotation?.candidates.slice(0, 2).map((candidate) => candidate.name) || []);
  const previous = draft.history.recent.split(", ").map((crop) => crop.toLowerCase());
  return examples.map((name) => {
    const family = families[name.toLowerCase()];
    const id = name.toLowerCase().replaceAll(" ", "-");
    const baseline = data?.rotation?.candidates.find((candidate) => candidate.id === id);
    const compared = data?.rotation?.status === "comparison" && "scenarios" in data.rotation ? data.rotation.scenarios.flatMap((scenario) => scenario.candidates.filter((candidate) => candidate.id === id).map((candidate) => `${language === "rw" ? (scenario.scenario === "rainfed" ? "imvura" : "kuvomera") : scenario.scenario}: ${candidate.baseline} / 10,000`)) : [];
    const zero = data?.rotation?.excluded?.some((item) => item === id) ?? false;
    const repeated = family && previous.some((crop) => families[crop] === family);
    const rotationCode: ReasonCode = !draft.history.recent || previous.includes("i don't remember") ? "previous_unknown" : repeated ? "same_family" : family && previous.some((crop) => families[crop]) ? "different_family" : "previous_recorded";
    const weatherCode: ReasonCode = data?.forecast.status === "available" ? "forecast_available" : "forecast_unavailable";
    const rotation = explainReason(rotationCode, language);
    const soil = language === "rw" ? (baseline ? "Amakuru ya FAO yo mu gihe cyashize agaragaza ko iki gihingwa cyagereranywa muri aka gace. Banza urebe ubutaka bw’umurima wawe; ntabwo bwapimwe hano." : compared.length ? "Reba amakuru ashingiye ku mvura no ku kuhira hepfo. Banza urebe n’ubutaka bw’umurima wawe." : zero ? "Amakuru ya FAO nta mahitamo agaragaza kuri iki gihingwa mu buryo bw’amazi wahisemo. Baza umujyanama wo hafi." : "Nta makuru ya FAO yabonetse kuri iki gihingwa aha hantu. Ubutaka bw’umurima wawe ntibwapimwe.") : (baseline ? "Historical FAO information makes this crop worth exploring for this area. Check your field’s soil; it has not been tested here." : compared.length ? "Compare the rainfed and irrigated information below, and check your field’s soil." : zero ? "The FAO baseline does not identify this crop as an option under the selected water conditions. Ask a local adviser." : "No FAO baseline was found for this crop at the selected point. Your field’s soil has not been tested here.");
    return { name, example: !chosen.length, status: baseline || compared.length ? (language === "rw" ? "Hari amakuru yo kugereranya" : "Information available to compare") : zero ? (language === "rw" ? "Banza ubaze umujyanama" : "Check with an adviser") : (language === "rw" ? "Harakenewe andi makuru" : "More information needed"), rotation, reasonCodes: { rotation: rotationCode, weather: weatherCode }, weather: explainReason(weatherCode, language, { rain: data?.forecast.rainMm ?? "" }), soil };
  });
}
