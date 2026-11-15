"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cropNames, crops, toggleValue, type FarmerOnboardingDraft } from "@/lib/farmer/model";
import { exampleFarm, fieldChoices, goalOptions, needChoices, waterChoices } from "@/lib/farmer/guided";
import { updateDraft } from "@/lib/farmer/store";
import { Icon } from "./Icon";
import FarmMap from "./FarmMap";

type Props = { draft: FarmerOnboardingDraft };

function Question({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return <fieldset className="cs-journey-question"><legend>{title}</legend>{hint && <p>{hint}</p>}{children}</fieldset>;
}

function SingleChoices({ choices, value, onChange }: { choices: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <div className="cs-journey-choices">{choices.map((choice) => <button key={choice} type="button" aria-pressed={value === choice} onClick={() => onChange(choice)}>{choice}<span aria-hidden="true">{value === choice ? "✓" : "+"}</span></button>)}</div>;
}

export function FarmStep({ draft }: Props) {
  const [other, setOther] = useState(Boolean(draft.history.recent && !["Maize", "Common beans", "Sorghum", "Cassava", "I don't remember"].includes(draft.history.recent)));
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const locationRequest = useRef(0);

  useEffect(() => () => { locationRequest.current += 1; }, []);

  function useLocation() {
    if (!navigator.geolocation) { setLocationMessage("Location is unavailable. Please enter your district instead."); return; }
    const request = ++locationRequest.current;
    setLocating(true);
    setLocationMessage("Finding your location…");
    navigator.geolocation.getCurrentPosition((position) => {
      if (request !== locationRequest.current) return;
      const pin = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
      updateDraft((current) => ({ ...current, location: { ...current.location, pin } }));
      setLocating(false);
      setLocationMessage("Location added. This is a point, not a field boundary.");
    }, () => { if (request !== locationRequest.current) return; setLocating(false); setLocationMessage("We couldn't get your location. Please enter your district instead."); }, { timeout: 15000, maximumAge: 0 });
  }

  function useExample() {
    locationRequest.current += 1;
    setLocating(false);
    setOther(false);
    setLocationMessage("Example added. You can change any answer.");
    updateDraft((current) => ({ ...current,
      location: { ...current.location, district: exampleFarm.district, sector: "", village: "", pin: "" },
      history: { ...current.history, recent: exampleFarm.previousCrop },
      selection: { ...current.selection, ids: current.selection.ids.length || current.selection.custom.trim() ? current.selection.ids : ["maize", "common-beans"], suggestions: current.selection.suggestions || "Only my selected crops" },
      goals: current.goals.length ? current.goals : ["Feeding my family"],
      guide: { ...current.guide, water: exampleFarm.water, resources: current.guide.resources || "Some resources available", flexible: current.guide.harvestMonth ? current.guide.flexible : true, example: true },
    }));
  }

  return <>
    <div className="cs-journey-example"><div><strong>Just looking around?</strong><p>Try an example farm in Kayonza. This replaces the location, previous crop and water answers, and fills unanswered plan choices.</p></div><button type="button" className="cs-button cs-button-secondary" onClick={useExample}>Try with a Kayonza example</button></div>
    {draft.guide.example && <p className="cs-journey-note">This plan started with example answers. You can change them below.</p>}
    <Question title="Where is your farm?" hint="Your location helps us find the information that may be relevant to your area.">
      <div className="cs-journey-fields"><label htmlFor="journey-district">District</label><input id="journey-district" value={draft.location.district} placeholder="Enter your district" onChange={(event) => updateDraft((current) => ({ ...current, location: { ...current.location, district: event.target.value } }))} />
      <label htmlFor="journey-sector">Sector <span>Optional</span></label><input id="journey-sector" value={draft.location.sector} placeholder="Enter your sector" onChange={(event) => updateDraft((current) => ({ ...current, location: { ...current.location, sector: event.target.value } }))} />
      <button type="button" className="cs-text-link" onClick={useLocation} disabled={locating}><Icon name="locate" /> {locating ? "Finding your location…" : "Use my location"}</button>
      {draft.location.pin && <><p className="cs-journey-note">Location point saved: {draft.location.pin}</p><button type="button" className="cs-text-link" onClick={() => { locationRequest.current += 1; setLocating(false); setLocationMessage("Location point removed."); updateDraft((current) => ({ ...current, location: { ...current.location, pin: "" } })); }}>Remove location point</button></>}{locationMessage && <p className="cs-journey-note" role="status">{locationMessage}</p>}</div>
      <FarmMap pin={draft.location.pin} />
    </Question>
    <Question title="What did you grow here last season?" hint="This helps us think about what could come next.">
      <div className="cs-journey-choices">{["Maize", "Common beans", "Sorghum", "Cassava", "I don't remember"].map((crop) => { const image = crops.find((item) => item.name === crop)?.image; return <button key={crop} type="button" aria-pressed={!other && draft.history.recent === crop} onClick={() => { setOther(false); updateDraft((current) => ({ ...current, history: { ...current.history, recent: crop } })); }}><div className="cs-journey-previous-crop">{image && <Image src={image} alt="" width={48} height={48} unoptimized />}{crop}</div><span aria-hidden="true">{!other && draft.history.recent === crop ? "✓" : "+"}</span></button>; })}<button type="button" aria-pressed={other} onClick={() => { if (!other) { setOther(true); updateDraft((current) => ({ ...current, history: { ...current.history, recent: "" } })); } }}>Other<span aria-hidden="true">{other ? "✓" : "+"}</span></button></div>
      {other && <div className="cs-journey-fields"><label htmlFor="journey-previous">What did you grow?</label><input id="journey-previous" value={draft.history.recent} maxLength={80} onChange={(event) => updateDraft((current) => ({ ...current, history: { ...current.history, recent: event.target.value } }))} /></div>}
    </Question>
    <Question title="How do you usually water your crops?" hint="Water access can affect what works for your farm."><SingleChoices choices={waterChoices} value={draft.guide.water} onChange={(water) => updateDraft((current) => ({ ...current, guide: { ...current.guide, water } }))} /></Question>
    <Question title="Is there anything important about your field?" hint="Optional. Your observations help describe your field."><div className="cs-journey-choices">{fieldChoices.map((choice) => <button key={choice} type="button" aria-pressed={draft.guide.observations.includes(choice)} onClick={() => updateDraft((current) => ({ ...current, guide: { ...current.guide, observations: choice === "I haven't noticed anything" ? (current.guide.observations.includes(choice) ? [] : [choice]) : toggleValue(current.guide.observations.filter((item) => item !== "I haven't noticed anything"), choice) } }))}>{choice}<span aria-hidden="true">{draft.guide.observations.includes(choice) ? "✓" : "+"}</span></button>)}</div></Question>
  </>;
}

export function CropsStep({ draft }: Props) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const matches = crops.filter((crop) => (showAll || ["maize", "common-beans", "sorghum"].includes(crop.id) || draft.selection.ids.includes(crop.id)) && crop.name.toLowerCase().includes(query.toLowerCase().trim()));
  return <>
    <div className="cs-journey-fields"><label htmlFor="journey-search">Find a crop</label><input id="journey-search" type="search" placeholder="Search crops" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setShowAll(true); }} /></div>
    <div className="cs-journey-crops">{matches.map((crop) => <button type="button" key={crop.id} className="cs-journey-crop" aria-pressed={draft.selection.ids.includes(crop.id)} onClick={() => updateDraft((current) => ({ ...current, selection: { ...current.selection, ids: toggleValue(current.selection.ids, crop.id) } }))}><Image src={crop.image} alt="" width={358} height={177} unoptimized /><span><strong>{crop.name}</strong><small>Explore this crop</small></span><b aria-hidden="true">{draft.selection.ids.includes(crop.id) ? "✓" : "+"}</b></button>)}</div>
    {matches.length === 0 && <p>No crops found. Try another name.</p>}
    {!showAll && <button type="button" className="cs-text-link" onClick={() => setShowAll(true)}><Icon name="plus" /> Show more crops</button>}
    <div className="cs-journey-fields"><label htmlFor="journey-custom">My crop isn’t listed <span>Optional</span></label><input id="journey-custom" value={draft.selection.custom} placeholder="Enter another crop" maxLength={80} onChange={(event) => updateDraft((current) => ({ ...current, selection: { ...current.selection, custom: event.target.value } }))} /></div>
    <p className="cs-journey-note" aria-live="polite">{cropNames(draft.selection).length ? `Selected: ${cropNames(draft.selection).join(", ")}` : "Choose one or more crops."}</p>
    <Question title="Would you like to explore other possible crops too?" hint="We will respect your choices. Other options need evidence before they can be suggested."><SingleChoices choices={["Yes, show me alternatives", "No, only compare my choices"]} value={draft.selection.suggestions ? draft.selection.suggestions === "Only my selected crops" ? "No, only compare my choices" : "Yes, show me alternatives" : ""} onChange={(value) => updateDraft((current) => ({ ...current, selection: { ...current.selection, suggestions: value.startsWith("No") ? "Only my selected crops" : "I'm open to suggestions" } }))} /></Question>
  </>;
}

export function NeedsStep({ draft }: Props) {
  const selectedGoal = goalOptions.find((item) => draft.goals.includes(item.value));
  return <>
    <Question title="What matters most to you?" hint="Your plan should start with your goals."><SingleChoices choices={goalOptions.map((item) => item.label)} value={selectedGoal?.label || ""} onChange={(label) => updateDraft((current) => ({ ...current, goals: [...current.goals.filter((goal) => !goalOptions.some((item) => item.value === goal)), goalOptions.find((item) => item.label === label)!.value] }))} /></Question>
    <Question title="When would you like to harvest?" hint="This can help you think about whether a crop has enough time to grow."><div className="cs-journey-fields"><label htmlFor="journey-harvest">Harvest month <span>Choose a month or say you’re flexible</span></label><input id="journey-harvest" type="month" value={draft.guide.harvestMonth} disabled={draft.guide.flexible} onChange={(event) => updateDraft((current) => ({ ...current, guide: { ...current.guide, harvestMonth: event.target.value } }))} /><label className="cs-journey-check"><input type="checkbox" checked={draft.guide.flexible} onChange={(event) => updateDraft((current) => ({ ...current, guide: { ...current.guide, flexible: event.target.checked } }))} /> I’m flexible</label></div></Question>
    <Question title="Do you have resources for seeds and farming supplies?" hint="Your answer helps describe what you can use. We won’t calculate costs."><SingleChoices choices={needChoices} value={draft.guide.resources} onChange={(resources) => updateDraft((current) => ({ ...current, guide: { ...current.guide, resources } }))} /><details className="cs-journey-extra"><summary>Add a budget (optional)</summary><div className="cs-journey-fields"><label htmlFor="journey-budget">Budget in RWF</label><input id="journey-budget" type="number" min="0" step="any" value={draft.resources.budget} onChange={(event) => updateDraft((current) => ({ ...current, resources: { ...current.resources, budget: event.target.value } }))} /></div></details></Question>
    <section className="cs-journey-summary"><h2>What we’ve learned</h2><p>You’re exploring <strong>{cropNames(draft.selection).join(", ") || "your crops"}</strong> in <strong>{draft.location.district || "your saved location"}</strong>. You previously grew <strong>{draft.history.recent || "an unknown crop"}</strong>, and your water answer is <strong>{draft.guide.water || "not shared"}</strong>.</p><p>Your goal: <strong>{selectedGoal?.label || "not shared"}</strong>. Harvest: <strong>{draft.guide.flexible ? "Flexible" : draft.guide.harvestMonth || "not shared"}</strong>.</p><div className="cs-journey-edit"><Link href="/onboarding/journey/farm?from=needs">Edit farm</Link><Link href="/onboarding/journey/crops?from=needs">Edit crops</Link></div></section>
  </>;
}
