export const categories = ["Cereals", "Legumes", "Roots and tubers", "Vegetables", "Fruits and perennial crops", "Cash crops"] as const;
export type CropCategory = (typeof categories)[number];

const catalogue: Record<CropCategory, string[]> = {
  Cereals: ["Maize", "Rice", "Sorghum", "Wheat", "Millet"],
  Legumes: ["Common beans", "Soybeans", "Groundnuts", "Peas"],
  "Roots and tubers": ["Cassava", "Sweet potatoes", "Irish potatoes"],
  Vegetables: ["Tomatoes", "Onions", "Cabbage", "Carrots", "Peppers", "Eggplant"],
  "Fruits and perennial crops": ["Bananas", "Avocados", "Mangoes", "Passion fruit"],
  "Cash crops": ["Coffee", "Tea"],
};

export const crops = categories.flatMap((category) =>
  catalogue[category].map((name) => {
    const id = name.toLowerCase().replaceAll(" ", "-");
    return {
      category,
      id,
      name,
      image: "/farmer/crops/" + id + ".webp",
      coverage: name === "Maize" || name === "Common beans" ? "Pilot evaluation scope" : "Assessment coverage pending",
    };
  }),
);

export const suggestionChoices = ["Only my selected crops", "Only when another option is well supported", "I'm open to suggestions"] as const;

export const goalChoices = [
  { name: "Feeding my family", description: "Grow food for meals at home.", icon: "home" },
  { name: "Earning income", description: "Grow crops to sell after harvest.", icon: "coins" },
  { name: "Both food and income", description: "Plan for meals and for the market.", icon: "basket" },
  { name: "Protecting my soil", description: "Keep the soil productive for future seasons.", icon: "leaf" },
  { name: "Using less water", description: "Plan around the water I can access.", icon: "drop" },
  { name: "Harvesting sooner", description: "Look for crops that fit a shorter planting period.", icon: "clock" },
] as const;

export const steps = [
  { id: "crops", label: "Select crops", icon: "sprout", title: "What would you like to plant?", description: "We begin with the crops you’re considering. Your choices are the starting point for your plan." },
  { id: "location", label: "Farm location", icon: "pin", title: "Where is your farm?", description: "Your location helps identify which regional environmental information may be relevant to your field." },
  { id: "planting", label: "Planting season", icon: "calendar", title: "When are you planning to plant?", description: "Planting and harvest dates can help you consider whether a crop’s growing period fits your plans." },
  { id: "history", label: "Farming history", icon: "history", title: "What have you grown before?", description: "Knowing what grew here before can help you explore a possible crop rotation." },
  { id: "goals", label: "Farming goals", icon: "target", title: "What matters most to you?", description: "Choose the priorities you want to keep in mind while planning." },
  { id: "resources", label: "Available resources", icon: "basket", title: "What resources are available to you?", description: "Water, inputs and your observations help make a plan practical. Leave anything blank if you’re unsure." },
  { id: "review", label: "Review information", icon: "checklist", title: "Your Farm, Your Plan", description: "Review the details below before opening your dashboard." },
] as const;

export type Step = (typeof steps)[number]["id"];
export type AssessmentStatus = "Assessment not yet connected";

export interface FarmerProfile {
  displayName?: string;
}

export interface FarmLocation {
  district: string;
  sector: string;
  village: string;
  pin: string;
  area: string;
}

export interface CropSelection {
  ids: string[];
  custom: string;
  suggestions: "" | (typeof suggestionChoices)[number];
}

export interface PlantingPreferences {
  help: boolean;
  month: string;
  date: string;
  harvest: string;
}

export interface CropHistory {
  recent: string;
  previous: string;
  sequence: string;
  outcome: string;
  problems: string;
}

export const irrigationChoices = ["Available", "Limited or seasonal", "Unavailable", "I don't know", "Prefer not to say"] as const;
export const sequenceChoices = ["Grown together", "Grown sequentially", "I don't remember"] as const;
export const harvestChoices = ["Better than expected", "About as expected", "Below expectations", "I don't remember"] as const;
export const drainageChoices = ["No issues observed", "Water pools after rain", "Soil dries quickly", "I don't know", "Prefer not to say"] as const;
export const inputChoices = ["Can obtain inputs", "Limited access", "Cannot obtain inputs", "I don't know", "Prefer not to say"] as const;

export interface FarmerResources {
  irrigation: string;
  budget: string;
  seeds: string;
  soil: string;
  drainage: string;
  inputs: string;
}

export interface FarmerOnboardingDraft {
  profile: FarmerProfile;
  fieldName: string;
  selection: CropSelection;
  location: FarmLocation;
  planting: PlantingPreferences;
  history: CropHistory;
  goals: string[];
  resources: FarmerResources;
}

export interface FarmField {
  id: string;
  name: string;
  location: FarmLocation;
  crops: string[];
  planting: PlantingPreferences;
  irrigation: string;
  assessment: AssessmentStatus;
}

export const blankDraft: FarmerOnboardingDraft = {
  profile: {},
  fieldName: "",
  selection: { ids: [], custom: "", suggestions: "" },
  location: { district: "", sector: "", village: "", pin: "", area: "" },
  planting: { help: false, month: "", date: "", harvest: "" },
  history: { recent: "", previous: "", sequence: "", outcome: "", problems: "" },
  goals: [],
  resources: { irrigation: "", budget: "", seeds: "", soil: "", drainage: "", inputs: "" },
};

export function cropNames(selection: CropSelection) {
  const names = crops.filter(({ id }) => selection.ids.includes(id)).map(({ name }) => name);
  const custom = selection.custom.trim();
  if (custom && !names.some((name) => name.toLowerCase() === custom.toLowerCase())) names.push(custom);
  return names;
}

export function toField(draft: FarmerOnboardingDraft): FarmField {
  return {
    id: "first-field",
    name: draft.fieldName.trim() || "My First Field",
    location: draft.location,
    crops: cropNames(draft.selection),
    planting: draft.planting,
    irrigation: draft.resources.irrigation,
    assessment: "Assessment not yet connected",
  };
}

export function formatPlace(location: FarmLocation) {
  return [location.village.trim(), location.sector.trim(), location.district.trim()].filter(Boolean).join(", ") || "Location pending";
}

export function formatPlanting(planting: PlantingPreferences) {
  if (planting.help) return "Help choosing a planting period";
  if (!planting.month) return "Planting period pending";
  const format = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    day: planting.date ? "numeric" : undefined,
    timeZone: "UTC",
  });
  return format.format(new Date((planting.date || planting.month + "-01") + "T00:00:00Z"));
}

export function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

