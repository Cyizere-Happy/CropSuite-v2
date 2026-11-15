"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type HTMLInputTypeAttribute } from "react";
import {
  categories, crops, cropNames, drainageChoices, goalChoices, harvestChoices, inputChoices, irrigationChoices,
  sequenceChoices, suggestionChoices, toggleValue, type CropSelection, type FarmerOnboardingDraft, type Step,
} from "@/lib/farmer/model";
import type { FormErrors } from "@/lib/farmer/validation";
import { Icon } from "./Icon";
import { ChoiceCard, EmptyState, Field, FieldError, Notice, Options } from "./Shared";

type Update = (update: (current: FarmerOnboardingDraft) => FarmerOnboardingDraft) => void;
type StepProps = { draft: FarmerOnboardingDraft; update: Update; errors: FormErrors };

function onValue(change: (value: string) => void) {
  return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => change(event.target.value);
}

function InputField({
  label, name, value, change, error, optional, hint, placeholder, type = "text", maxLength = 80, min, max, step,
}: {
  label: string; name: string; value: string; change: (value: string) => void; error?: string; optional?: boolean;
  hint?: string; placeholder?: string; type?: HTMLInputTypeAttribute; maxLength?: number; min?: string; max?: string; step?: string;
}) {
  return (
    <Field label={label} name={name} error={error} optional={optional} hint={hint}>
      <input id={name} value={value} onChange={onValue(change)} type={type} maxLength={maxLength}
        min={min} max={max} step={step} placeholder={placeholder} aria-required={!optional}
        aria-invalid={!!error} aria-describedby={[hint && name + "-hint", error && name + "-error"].filter(Boolean).join(" ") || undefined} />
    </Field>
  );
}

function SelectField({ label, name, value, change, choices, optional, error }: {
  label: string; name: string; value: string; change: (value: string) => void; choices: readonly string[]; optional?: boolean; error?: string;
}) {
  return (
    <Field label={label} name={name} optional={optional} error={error}>
      <select id={name} value={value} onChange={onValue(change)} aria-required={!optional} aria-invalid={!!error} aria-describedby={error ? name + "-error" : undefined}>
        <Options options={choices} />
      </select>
    </Field>
  );
}

function NotesField({ label, name, value, change, placeholder }: {
  label: string; name: string; value: string; change: (value: string) => void; placeholder: string;
}) {
  return (
    <Field label={label} name={name} optional>
      <textarea id={name} value={value} onChange={onValue(change)} placeholder={placeholder} maxLength={500} rows={2} />
    </Field>
  );
}

function CropCard({ crop, selected, onClick }: { crop: (typeof crops)[number]; selected: boolean; onClick: () => void }) {
  return (
    <button className="cs-crop" type="button" aria-pressed={selected} aria-label={crop.name} onClick={onClick}>
      <div className="cs-crop-image">
        <Image src={crop.image} alt="" width={358} height={177} unoptimized />
        <span className="cs-crop-check"><Icon name={selected ? "check" : "plus"} /></span>
      </div>
      <span className="cs-crop-caption"><strong>{crop.name}</strong><small>{crop.coverage}</small></span>
    </button>
  );
}

function CropStep({ draft, update, errors }: StepProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All crops");
  const [customOpen, setCustomOpen] = useState(!!draft.selection.custom);
  const selection = draft.selection;

  function change(patch: Partial<CropSelection>) {
    update((current) => ({ ...current, selection: { ...current.selection, ...patch } }));
  }

  const matches = crops.filter((crop) => (filter === "All crops" || crop.category === filter)
    && (crop.name + (crop.id === "maize" ? " corn" : "")).toLowerCase().includes(query.trim().toLowerCase()));
  const names = cropNames(selection);
  const visible = matches.length > 0;

  return (
    <>
      <div className="cs-crop-tools">
        <label className="cs-search"><Icon name="search" /><input type="search" value={query} onChange={onValue(setQuery)} aria-label="Search crops" placeholder="Search crops…" /></label>
        <label className="cs-filter-select"><Icon name="filter" /><select aria-label="Crop category" value={filter} onChange={onValue(setFilter)}>
          {["All crops", ...categories].map((category) => <option key={category}>{category}</option>)}
        </select></label>
      </div>
      <div className="cs-crop-tabs" role="group" aria-label="Crop categories">
        {["All crops", ...categories].map((category) => (
          <button type="button" key={category} onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>
        ))}
      </div>
      <div className="cs-crop-summary">
        <div aria-live="polite">
          <span><Icon name="sprout" /> {names.length} {names.length === 1 ? "crop" : "crops"} selected</span>
          {names.length > 0 && <span>{names.join(", ")}</span>}
        </div>
        <a className="cs-text-link" href="#crop-suggestions">Suggestion preference</a>
      </div>
      {errors.crops && <FieldError name="crops">{errors.crops}</FieldError>}
      {visible ? <div className="cs-crop-grid" role="group" aria-label="Crop catalogue">
        {matches.map((crop) => <CropCard key={crop.id} crop={crop} selected={selection.ids.includes(crop.id)} onClick={() => change({ ids: toggleValue(selection.ids, crop.id) })} />)}
      </div> : <EmptyState icon="search" title="No crops found"><button className="cs-text-link" type="button" onClick={() => { setQuery(""); setFilter("All crops"); }}>Clear search and filters</button></EmptyState>}
      <div className="cs-card cs-custom">
        <button type="button" className="cs-text-link" aria-expanded={customOpen} onClick={() => setCustomOpen(!customOpen)}>
          <Icon name={customOpen ? "minus" : "plus"} /> My crop isn&apos;t listed
        </button>
        {customOpen && <InputField label="Crop name" name="custom" value={selection.custom} change={(custom) => change({ custom })} optional placeholder="Enter another crop name" />}
        {selection.custom.trim() && <small>Assessment coverage pending</small>}
      </div>
      <fieldset id="crop-suggestions" className="cs-card cs-radio-card" aria-describedby={errors.suggestions ? "suggestions-error" : undefined}>
        <legend>Would you like us to suggest other crops?</legend>
        {suggestionChoices.map((choice) => (
          <label key={choice}><input type="radio" name="suggestions" checked={selection.suggestions === choice} onChange={() => change({ suggestions: choice })} /> {choice}</label>
        ))}
        {errors.suggestions && <FieldError name="suggestions">{errors.suggestions}</FieldError>}
      </fieldset>
      <Notice>Maize and common beans are in the proposed Kayonza evaluation scope, pending source validation. Crop choices record your interests for planning.</Notice>
    </>
  );
}

function LocationStep({ draft, update, errors }: StepProps) {
  const { location, fieldName } = draft;
  const [districtChoice, setDistrictChoice] = useState(location.district === "Kayonza" ? "Kayonza" : location.district ? "Other district" : "");
  const outside = districtChoice === "Other district";
  const change = (key: keyof typeof location, value: string) =>
    update((current) => ({ ...current, location: { ...current.location, [key]: value } }));

  return (
    <>
      <div className="cs-card cs-form-card">
        <div className="cs-card-heading"><span><Icon name="pin" /></span><div><h2>Farm address</h2><p>Start with your district and sector.</p></div></div>
        <div className="cs-form-grid">
          <SelectField label="District" name="district" value={districtChoice} choices={["Kayonza", "Other district"]} error={outside ? undefined : errors.district} change={(value) => {
            setDistrictChoice(value);
            if (value !== districtChoice) update((current) => ({ ...current, location: { ...current.location, district: value === "Kayonza" ? "Kayonza" : "", sector: "", village: "", pin: "" } }));
          }} />
          {outside && <InputField label="District name" name="other-district" value={location.district} change={(value) => change("district", value)} error={errors.district} placeholder="Enter your district" />}
          <InputField label="Sector" name="sector" value={location.sector} change={(value) => change("sector", value)} error={errors.sector} placeholder="Enter your sector" />
          <InputField label="Village" name="village" value={location.village} change={(value) => change("village", value)} optional placeholder="Enter your village" />
          <InputField label="Field name" name="field-name" value={fieldName} change={(value) => update((current) => ({ ...current, fieldName: value }))} optional placeholder="My First Field" maxLength={60} />
        </div>
      </div>
      <div className="cs-card cs-form-card">
        <div className="cs-card-heading"><span><Icon name="map" /></span><div><h2>Field details</h2><p>Add measurements you already have.</p></div></div>
        <div className="cs-form-grid">
          <InputField label="Approximate field size (ha)" name="area" value={location.area} change={(value) => change("area", value)} error={errors.area} optional type="number" min="0.0001" step="any" />
          <InputField label="Map pin coordinates" name="pin" value={location.pin} change={(value) => change("pin", value)} maxLength={48} error={errors.pin} optional hint="Paste latitude, longitude from a map you use." />
        </div>
      </div>
      <Notice>{outside ? "You can save a plan outside Kayonza. Agricultural assessment coverage for this location is pending." : "Kayonza is the initial pilot district. Agricultural assessment is pending source validation and integration."}</Notice>
    </>
  );
}

function PlantingStep({ draft, update, errors }: StepProps) {
  const planting = draft.planting;
  const change = (patch: Partial<typeof planting>) => update((current) => ({ ...current, planting: { ...current.planting, ...patch } }));

  return (
    <>
      <div className="cs-card cs-form-card">
        <div className="cs-card-heading"><span><Icon name="calendar" /></span><div><h2>Target planting period</h2><p>Plan around the dates that work for your farm.</p></div></div>
        <div className="cs-form-grid">
          {!planting.help && <>
            <InputField label="Planting month and year" name="month" value={planting.month} change={(month) => change({ month, date: planting.date.slice(0, 7) === month ? planting.date : "" })} error={errors.month} type="month" placeholder="YYYY-MM" />
            <InputField label="Specific planting date" name="date" value={planting.date} change={(date) => change({ date })} error={errors.date} optional type="date" min={planting.month ? planting.month + "-01" : undefined} />
          </>}
          <InputField label="Harvest deadline" name="harvest" value={planting.harvest} change={(harvest) => change({ harvest })} error={errors.harvest} optional type="date" />
        </div>
        <label className="cs-check-label"><input type="checkbox" checked={planting.help} onChange={(event) => change({ help: event.target.checked })} /><span><strong>Help me choose</strong><small>I’m still deciding when to plant.</small></span></label>
      </div>
      {planting.help && <Notice>We’ll save that you’d like help choosing a planting period. Planting-window guidance is pending integration.</Notice>}
    </>
  );
}

const commonHistory = ["Maize", "Common beans", "Cassava", "No previous crop", "I don't remember"];
const otherHistory = crops.filter(({ name }) => !commonHistory.includes(name)).map(({ name }) => name);

function HistoryStep({ draft, update, errors }: StepProps) {
  const history = draft.history;
  const custom = history.recent && !commonHistory.includes(history.recent) && !otherHistory.includes(history.recent);
  const [picker, setPicker] = useState(custom ? "Other crop" : "");
  const change = (key: keyof typeof history, value: string) => update((current) => ({ ...current, history: { ...current.history, [key]: value } }));

  function select(recent: string) {
    setPicker("");
    update((current) => ({ ...current, history: { ...current.history, recent, ...(recent === "No previous crop" ? { previous: "", sequence: "", outcome: "", problems: "" } : {}) } }));
  }

  return (
    <>
      <div className="cs-card cs-form-card">
        <div className="cs-card-heading"><span><Icon name="history" /></span><div><h2>Most recent crop</h2><p>Choose the crop you last grew in this field.</p></div></div>
        <div className="cs-choice-grid">
          {commonHistory.map((name) => <ChoiceCard key={name} label={name} icon={name === "I don't remember" ? "help" : "sprout"} selected={history.recent === name && !picker} onClick={() => select(name)} />)}
        </div>
        <SelectField label="Choose another crop" name="recent" value={picker || (otherHistory.includes(history.recent) ? history.recent : "")}
          choices={[...otherHistory, "Other crop"]} error={errors.recent} optional
          change={(value) => {
            if (value === "Other crop") {
              setPicker(value);
              change("recent", "");
            } else select(value);
          }} />
        {picker === "Other crop" && <InputField label="Previous crop name" name="recent-custom" value={history.recent} change={(value) => change("recent", value)} error={errors.recent} />}
      </div>
      {history.recent !== "No previous crop" && <div className="cs-card cs-form-card">
        <h2>Previous seasons</h2>
        <NotesField label="Other crops or seasons" name="previous" value={history.previous} change={(value) => change("previous", value)} placeholder="For example, common beans last season" />
        <div className="cs-form-grid">
          <SelectField label="How crops were grown" name="sequence" value={history.sequence} change={(value) => change("sequence", value)} choices={sequenceChoices} optional />
          <SelectField label="Previous harvest outcome" name="outcome" value={history.outcome} change={(value) => change("outcome", value)} choices={harvestChoices} optional />
        </div>
        <NotesField label="Problems you encountered" name="problems" value={history.problems} change={(value) => change("problems", value)} placeholder="For example, water stress or pests" />
      </div>}
    </>
  );
}

function GoalsStep({ draft, update, errors }: StepProps) {
  return (
    <>
      <div className="cs-choice-grid cs-goal-grid" role="group" aria-label="Farming goals">
        {goalChoices.map(({ name, description, icon }) => (
          <ChoiceCard key={name} label={name} description={description} icon={icon} selected={draft.goals.includes(name)}
            onClick={() => update((current) => ({ ...current, goals: toggleValue(current.goals, name) }))} />
        ))}
      </div>
      {errors.goals && <FieldError name="goals">{errors.goals}</FieldError>}
    </>
  );
}

function ResourcesStep({ draft, update, errors }: StepProps) {
  const resources = draft.resources;
  const change = (key: keyof typeof resources, value: string) => update((current) => ({ ...current, resources: { ...current.resources, [key]: value } }));

  return (
    <>
      <div className="cs-card cs-form-card">
        <div className="cs-card-heading"><span><Icon name="drop" /></span><div><h2>Water and planting resources</h2><p>Rainfed and irrigated farms can have different needs. Available inputs can shape what is practical.</p></div></div>
        <div className="cs-form-grid">
          <SelectField label="Irrigation availability" name="irrigation" value={resources.irrigation} change={(value) => change("irrigation", value)} choices={irrigationChoices} optional />
          <InputField label="Approximate farm area (ha)" name="area" value={draft.location.area}
            change={(area) => update((current) => ({ ...current, location: { ...current.location, area } }))} error={errors.area} optional type="number" min="0.0001" step="any" />
          <InputField label="Planting budget (RWF)" name="budget" value={resources.budget} change={(value) => change("budget", value)} error={errors.budget} optional type="number" min="0" step="any" />
          <SelectField label="Ability to obtain inputs" name="inputs" value={resources.inputs} change={(value) => change("inputs", value)} choices={inputChoices} optional />
        </div>
        <NotesField label="Seeds already available" name="seeds" value={resources.seeds} change={(value) => change("seeds", value)} placeholder="List any seeds you already have, or enter “I don’t know”." />
      </div>
      <div className="cs-card cs-form-card">
        <div className="cs-card-heading"><span><Icon name="leaf" /></span><div><h2>Soil and drainage</h2><p>Your observations add local detail that regional data may miss. It is okay not to know.</p></div></div>
        <SelectField label="Drainage issues" name="drainage" value={resources.drainage} change={(value) => change("drainage", value)} choices={drainageChoices} optional />
        <NotesField label="Soil observations" name="soil" value={resources.soil} change={(value) => change("soil", value)} placeholder="For example, rocky or sandy soil" />
      </div>
    </>
  );
}

const forms = { crops: CropStep, location: LocationStep, planting: PlantingStep, history: HistoryStep, goals: GoalsStep, resources: ResourcesStep };

export function StepForm({ step, ...props }: StepProps & { step: Exclude<Step, "review"> }) {
  const Screen = forms[step];
  return <Screen {...props} />;
}

