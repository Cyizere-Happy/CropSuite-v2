"use client";

import { useRef, useState } from "react";
import { type FarmField, formatPlace, formatPlanting } from "@/lib/farmer/model";
import { Icon } from "./Icon";

function FieldDetails({ field, close }: { field: FarmField; close: () => void }) {
  return (
    <section className="cs-field-details" aria-label="Selected field details">
      <div className="cs-field-title">
        <div><h2>{field.name}</h2><p>{formatPlace(field.location)}</p></div>
        <button type="button" aria-label="Close field details" title="Close field details" onClick={close}><Icon name="close" /></button>
      </div>
      <div className="cs-field-assessment">
        <div className="cs-field-assessment-graphic" aria-hidden="true">
          <svg viewBox="0 0 140 70" fill="none">
            <path d="M8 68a62 62 0 0 1 124 0M15 68a55 55 0 0 1 110 0M22 68a48 48 0 0 1 96 0" />
          </svg>
          <Icon name="sprout" />
        </div>
        <div><small>Planting assessment</small><strong>{field.assessment}</strong></div>
      </div>
      <dl>
        <div><dt>Selected crops</dt><dd>{field.crops.join(", ")}</dd></div>
        <div><dt>Approx. field area</dt><dd>{field.location.area ? field.location.area + " ha" : "Not provided"}</dd></div>
        <div><dt>Planting period</dt><dd>{formatPlanting(field.planting)}</dd></div>
      </dl>
    </section>
  );
}

export type FieldView = "details" | "outline" | "hidden";

export function FieldWorkspace({ field, view, setView, exportPlan }: {
  field: FarmField; view: FieldView; setView: (view: FieldView) => void; exportPlan: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const selected = view !== "hidden";
  const details = view === "details";
  const dialog = useRef<HTMLDialogElement>(null);

  function selectField(open: boolean) {
    setView(open ? "details" : "hidden");
  }

  function surface(expanded: boolean) {
    return (
      <section className="cs-field-map" aria-label={expanded ? "Expanded demo field workspace" : "Demo field workspace"}>
        <div className="cs-map-image" style={{ transform: "scale(" + zoom + ")" }}>
          {selected && <svg className="cs-field-outline" viewBox="0 0 1000 750" preserveAspectRatio="none" aria-hidden="true">
            <path d="M77 391C131 373 209 356 282 366c79 12 137 19 194 53 57 35 95 95 71 150-24 53-33 106-60 154L154 692c-28-51-57-115-63-173-6-55-16-89-14-128Z" />
          </svg>}
        </div>
        <div className="cs-map-top">
          <span className="cs-map-tag"><span /> Demo field view</span>
          <div>
            <button className="cs-map-export" onClick={exportPlan} type="button">Export</button>
            <label className="cs-map-field-select" title="Field selector">
              <Icon name="layers" /><select aria-label="Field selector" value={selected ? field.id : ""} onChange={(event) => selectField(!!event.target.value)}>
                <option value="">Hide field overlay</option><option value={field.id}>{field.name}</option>
              </select><Icon name="chevron" />
            </label>
          </div>
        </div>
        {selected && <button className="cs-field-marker" type="button" aria-label={"Show details for " + field.name} aria-expanded={details}
          onClick={() => setView(details ? "outline" : "details")}>
          <Icon name="sprout" /><strong>{field.name}</strong><span>{field.crops.join(", ")}</span>
        </button>}
        {selected && details && <FieldDetails field={field} close={() => setView("outline")} />}
        <div className="cs-map-bottom">
          <button className="cs-map-preview" type="button" title="Reset map view" aria-label="Reset map view" onClick={() => { setZoom(1); selectField(true); }} />
          <small>Illustrative image and outline</small>
          <div className="cs-map-controls">
            <button title={expanded ? "Close expanded map" : "Expand map"} aria-label={expanded ? "Close expanded map" : "Expand map"}
              type="button" onClick={() => expanded ? dialog.current?.close() : dialog.current?.showModal()}>
              <Icon name={expanded ? "close" : "expand"} />
            </button>
            <div>
              <button type="button" disabled={zoom >= 1.6} title="Zoom in" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.6, value + 0.15))}><Icon name="plus" /></button>
              <button type="button" disabled={zoom <= 1} title="Zoom out" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(1, value - 0.15))}><Icon name="minus" /></button>
            </div>
            <button type="button" title="Locate selected field" aria-label="Locate selected field" onClick={() => { setZoom(1); selectField(true); }}><Icon name="locate" /></button>
          </div>
        </div>
      </section>
    );
  }

  return <>{surface(false)}<dialog className="cs-expanded-map" aria-label="Expanded field map" ref={dialog}>{surface(true)}</dialog></>;
}

