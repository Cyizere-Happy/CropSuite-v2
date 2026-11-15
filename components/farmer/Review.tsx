import Link from "next/link";
import { type FarmerOnboardingDraft, cropNames, formatPlace, formatPlanting, steps } from "@/lib/farmer/model";
import { Icon } from "./Icon";
import { Notice } from "./Shared";

export function planSections(draft: FarmerOnboardingDraft) {
  const { selection, location, planting, history, goals, resources } = draft;
  return [
    { step: steps[0], rows: [
      ["Selected crops", cropNames(selection).join(", ")],
      ["Crop suggestion preference", selection.suggestions],
    ] },
    { step: steps[1], rows: [
      ["Location", formatPlace(location)],
      ["Field", draft.fieldName.trim() || "My First Field"],
      ["Map pin", location.pin],
      ["Approximate area", location.area ? location.area + " ha" : ""],
    ] },
    { step: steps[2], rows: [
      ["Target planting period", formatPlanting(planting)],
      ["Harvest deadline", planting.harvest],
    ] },
    { step: steps[3], rows: [
      ["Most recent crop", history.recent],
      ["Previous seasons", history.previous],
      ["Planting pattern", history.sequence],
      ["Harvest outcome", history.outcome],
      ["Problems", history.problems],
    ] },
    { step: steps[4], rows: [["Priorities", goals.join(", ")]] },
    { step: steps[5], rows: [
      ["Irrigation", resources.irrigation],
      ["Planting budget", resources.budget ? new Intl.NumberFormat("en-RW").format(Number(resources.budget)) + " RWF" : ""],
      ["Seeds available", resources.seeds],
      ["Soil observations", resources.soil],
      ["Drainage", resources.drainage],
      ["Access to inputs", resources.inputs],
    ] },
  ];
}

export function Review({ draft }: { draft: FarmerOnboardingDraft }) {
  return (
    <>
      <div className="cs-review-grid">
        {planSections(draft).map(({ step, rows }) => (
          <section className="cs-card cs-review-card" key={step.id}>
            <div className="cs-card-heading">
              <span><Icon name={step.icon} /></span><h2>{step.label}</h2>
              <Link className="cs-text-link" href={"/onboarding/" + step.id + "?edit=1"} aria-label={"Edit " + step.label.toLowerCase()}><Icon name="edit" /> Edit</Link>
            </div>
            <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}</dl>
          </section>
        ))}
      </div>
      <Notice>Your answers are a planting plan. Agricultural assessments will be available after evidence and services are connected.</Notice>
    </>
  );
}

