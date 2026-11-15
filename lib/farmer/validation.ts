import { type FarmerOnboardingDraft, type Step, cropNames, steps } from "./model";

export type FormErrors = Record<string, string>;

export function isMonth(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value) && value.slice(0, 4) !== "0000";
}

export function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !isMonth(value.slice(0, 7))) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function isAmount(value: string, minimum: number) {
  return value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= minimum;
}

export function isPin(value: string) {
  const parts = value.split(",").map((part) => part.trim());
  return parts.length === 2 && parts.every((part) => /^-?\d+(\.\d+)?$/.test(part)) &&
    Math.abs(Number(parts[0])) <= 90 && Math.abs(Number(parts[1])) <= 180;
}

export function validateStep(step: Step, draft: FarmerOnboardingDraft): FormErrors {
  const errors: FormErrors = {};

  if (step === "crops") {
    if (cropNames(draft.selection).length === 0) errors.crops = "Choose at least one crop or enter your own.";
    if (!draft.selection.suggestions) errors.suggestions = "Choose a preference for crop suggestions.";
  }

  if (step === "location") {
    const { district, sector, area, pin } = draft.location;
    if (!district.trim()) errors.district = "Enter your farm’s district.";
    if (!sector.trim()) errors.sector = "Enter your farm’s sector.";
    if (area && !isAmount(area, 0.0001)) errors.area = "Enter an area greater than zero.";
    if (pin && !isPin(pin)) errors.pin = "Enter latitude and longitude separated by a comma.";
  }

  if (step === "planting") {
    const { help, month, date, harvest } = draft.planting;
    if (!help && !isMonth(month)) errors.month = "Choose a planting month and year, or select Help me choose.";
    if (!help && date && (!isDate(date) || date.slice(0, 7) !== month)) errors.date = "Choose a date within your planting month.";
    if (harvest && (!isDate(harvest) || (!help && month && harvest <= (date || month + "-01")))) {
      errors.harvest = "Choose a valid harvest deadline after planting.";
    }
  }

  if (step === "history" && !draft.history.recent.trim()) errors.recent = "Choose a previous crop or tell us if you don't remember.";
  if (step === "goals" && draft.goals.length === 0) errors.goals = "Choose at least one farming priority.";

  if (step === "resources") {
    if (draft.location.area && !isAmount(draft.location.area, 0.0001)) errors.area = "Enter an area greater than zero.";
    if (draft.resources.budget && !isAmount(draft.resources.budget, 0)) errors.budget = "Enter a budget of zero or more.";
  }

  return errors;
}

export function firstIncomplete(draft: FarmerOnboardingDraft, before = "review") {
  const limit = steps.findIndex(({ id }) => id === before);
  return steps.slice(0, limit).find(({ id }) => {
    const errors = validateStep(id, draft);
    // The resources form also edits and validates the shared area field.
    if (before === "resources" && id === "location") delete errors.area;
    return Object.keys(errors).length > 0;
  });
}

