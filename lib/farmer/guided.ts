import { cropNames, type FarmerOnboardingDraft } from "./model";
import { isAmount, isMonth, isPin } from "./validation";

export const waterChoices = ["I depend on rainfall", "I use irrigation", "Sometimes both", "I'm not sure"] as const;
export const fieldChoices = ["Water sometimes collects in the field", "The soil dries quickly", "The land is sloped", "I haven't noticed anything"] as const;
export const needChoices = ["Very limited", "Some resources available", "Resources are available", "Prefer not to say"] as const;
export const goalOptions = [
  { label: "Food for my family", value: "Feeding my family" },
  { label: "Income from selling crops", value: "Earning income" },
  { label: "Both", value: "Both food and income" },
] as const;
export const journeyStages = ["farm", "crops", "needs", "plan", "thanks"] as const;
export type JourneyStage = (typeof journeyStages)[number];

export interface GuidedAnswers {
  water: string;
  observations: string[];
  resources: string;
  flexible: boolean;
  harvestMonth: string;
  example: boolean;
}

export const blankGuidedAnswers: GuidedAnswers = {
  water: "", observations: [], resources: "", flexible: false, harvestMonth: "", example: false,
};

export const planningSources = {
  nasa: { label: "NASA POWER", url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/", status: "source-verified" },
  fao: { label: "FAO GAEZ", url: "https://www.fao.org/gaez/gaezv4/en/", status: "source-verified" },
} as const;

export const climateQuestions = {
  status: "pending",
  items: [
    { title: "Rainfall", question: "How much rain fell during past growing periods?" },
    { title: "Dry spells", question: "How often were there longer periods without rain?" },
    { title: "Temperature", question: "What temperatures occurred during those periods?" },
    { title: "Timing", question: "How might these patterns relate to a crop’s growing period?" },
  ],
} as const;

export const cropEvidence = {
  status: "illustrative",
  label: "Example option to explore",
  explanation: "Compare seasonal rainfall, time to grow, available water and supplies before deciding. This example is not a field-specific assessment.",
} as const;

export const exampleRotations = {
  status: "illustrative",
  sequences: [["Maize", "Common beans", "Maize"], ["Common beans", "Maize", "Common beans"]],
} as const;

export const exampleFarm = {
  status: "illustrative",
  district: "Kayonza",
  previousCrop: "Maize",
  water: "I depend on rainfall",
} as const;

export function guidedErrors(stage: JourneyStage, draft: FarmerOnboardingDraft): string[] {
  const answers = draft.guide;
  if (stage === "farm") {
    return [
      !draft.location.district.trim() && !isPin(draft.location.pin) ? "Enter a district or use your location." : "",
      !draft.history.recent.trim() ? "Choose what you grew before, or say you don't remember." : "",
      !answers.water ? "Choose how you usually water your crops." : "",
    ].filter(Boolean);
  }
  if (stage === "crops") {
    return [
      cropNames(draft.selection).length === 0 ? "Choose at least one crop." : "",
      !draft.selection.suggestions ? "Choose whether to explore other crops." : "",
    ].filter(Boolean);
  }
  if (stage === "needs") {
    return [
      !draft.goals.some((goal) => goalOptions.some((item) => item.value === goal)) ? "Choose what matters most to you." : "",
      !answers.flexible && !isMonth(answers.harvestMonth) ? "Choose a harvest month or say you are flexible." : "",
      !answers.resources ? "Choose the answer that best describes your resources." : "",
      draft.resources.budget && !isAmount(draft.resources.budget, 0) ? "Enter a budget of zero or more." : "",
    ].filter(Boolean);
  }
  return [];
}
