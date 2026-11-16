import { blankDraft, type FarmerOnboardingDraft } from "./model";
import type { Environment } from "@/lib/environment/types";
import type { RotationAnalysis } from "./rotationEngine";
import snapshot from "./demo-snapshot.json";

// Fixed, public-data snapshot captured on 16 Nov 2026 for the example point.
// The 48-hour forecast is historical sample data, never a current forecast.
export const sampleSnapshot = snapshot as unknown as Environment & { cache: string; rotation: RotationAnalysis };
export function sampleFarm(month: string): FarmerOnboardingDraft {
  return {
    ...structuredClone(blankDraft),
    fieldName: "Example farm",
    selection: { ids: ["maize"], custom: "", suggestions: "I'm open to suggestions" },
    location: { country: "RW", province: "Eastern Province", district: "Kayonza", sector: "", village: "", pin: "-1.9, 30.65", precision: "farm", area: "" },
    planting: { help: false, month, date: "", harvest: "" },
    history: { recent: "Maize", previous: "", sequence: "", outcome: "", problems: "" },
    guide: { water: "I depend on rainfall", observations: [], resources: "", flexible: false, harvestMonth: "", example: true },
  };
}
