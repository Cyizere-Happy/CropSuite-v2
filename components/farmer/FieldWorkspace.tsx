"use client";

import { useRef } from "react";
import { type FarmField, formatPlace, formatPlanting } from "@/lib/farmer/model";
import { mapUrl } from "@/lib/farmer/map";
import { Icon } from "./Icon";

export type FieldView = "details" | "outline" | "hidden";

export function FieldWorkspace({ field, view, setView, exportPlan }: {
  field: FarmField; view: FieldView; setView: (view: FieldView) => void; exportPlan: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  function surface(expanded: boolean) {
    return <section className="cs-field-map cs-real-map" aria-label={expanded ? "Expanded farm map" : "Farm map"}>
      <iframe className="cs-map-frame" src={mapUrl(field.location.pin)} title={expanded ? "Expanded map of the farm area" : "Map of the farm area"} />
      <div className="cs-map-top"><span className="cs-map-tag"><span /> {field.location.pin ? "Your saved location" : "Kayonza reference map"}</span><div><button className="cs-map-export" onClick={exportPlan} type="button">Export</button><button className="cs-map-export" type="button" onClick={() => setView(view === "details" ? "outline" : "details")}>{view === "details" ? "Hide details" : "Field details"}</button><button className="cs-map-export" type="button" onClick={() => expanded ? dialog.current?.close() : dialog.current?.showModal()} aria-label={expanded ? "Close expanded map" : "Expand map"}><Icon name={expanded ? "close" : "expand"} /></button></div></div>
      {view === "details" && <section className="cs-field-details" aria-label="Selected field details"><div className="cs-field-title"><div><h2>{field.name}</h2><p>{formatPlace(field.location)}</p></div><button type="button" aria-label="Close field details" onClick={() => setView("outline")}><Icon name="close" /></button></div><div className="cs-field-assessment"><Icon name="sprout" /><div><small>Example planting plan</small><strong>Review water and planting time</strong></div></div><dl><div><dt>Your crops</dt><dd>{field.crops.join(", ")}</dd></div><div><dt>Field area</dt><dd>{field.location.area ? field.location.area + " ha" : "Not provided"}</dd></div><div><dt>Planting period</dt><dd>{formatPlanting(field.planting)}</dd></div></dl><p className="cs-map-example-note">Example guidance, not a field assessment.</p></section>}
      <div className="cs-map-bottom"><small>{field.location.pin ? "Saved location point · not a field boundary" : "Kayonza reference area · no farm point selected"} · Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></small></div>
    </section>;
  }
  return <>{surface(false)}<dialog className="cs-expanded-map" aria-label="Expanded field map" ref={dialog}>{surface(true)}</dialog></>;
}
