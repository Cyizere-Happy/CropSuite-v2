import { explainReason, type ReasonCode } from "./reasons";
import type { FarmerOnboardingDraft } from "./model";
import { cropNames } from "./model";
import type { Environment } from "@/lib/environment/types";
import type { RotationAnalysis } from "./rotationEngine";

const families: Record<string, string> = { maize: "cereal", sorghum: "cereal", rice: "cereal", "common beans": "legume", soybeans: "legume", groundnuts: "legume" };

export function cropConsiderations(draft: FarmerOnboardingDraft, data: (Environment & { rotation?: RotationAnalysis | null }) | null, language: "en" | "rw" = "en") {
  const chosen = cropNames(draft.selection);
  const examples = chosen.length ? chosen : ["Maize", "Common beans"];
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
    const soil = language === "rw" ? (baseline ? `Igipimo cya FAO ni ${baseline.baseline} / 10,000 kuri aka gace. Si igipimo cy’ubutaka bw’umurima wawe cyangwa umusaruro uzabona.` : compared.length ? `Ibipimo bya FAO ni: ${compared.join("; ")}. Ni amakuru y’agace, si ibipimo by’ubutaka bw’umurima wawe.` : zero ? "Igipimo cy’amateka cya FAO ni zeru muri ubu buryo bwo kubona amazi. Ntikigaragaza neza uko umurima wawe umeze." : "Nta makuru y’ibanze ya FAO yabonetse kuri iki gihingwa aha hantu. Ubutaka bwawe ntibwapimwe.") : (baseline ? `FAO’s ${data?.rotation?.scenario} baseline index is ${baseline.baseline} / 10,000 for this grid cell. It is not a field soil test or a yield forecast.` : compared.length ? `FAO baseline indices: ${compared.join("; ")}. These are grid estimates, not field soil tests or yield forecasts.` : zero ? "The FAO historical baseline index is zero under your selected water scenario. This does not establish actual field conditions." : "No FAO baseline value was found for this crop at the selected point. Your field has not been measured.");
    return { name, example: !chosen.length, status: baseline || compared.length ? (language === "rw" ? "Amakuru ya FAO arahari" : "FAO baseline available") : zero ? (language === "rw" ? "Igipimo cya FAO: zeru" : "FAO baseline: zero") : (language === "rw" ? "Harakenewe andi makuru" : "More information needed"), rotation, reasonCodes: { rotation: rotationCode, weather: weatherCode }, weather: explainReason(weatherCode, language, { rain: data?.forecast.rainMm ?? "" }), soil };
  });
}
