"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPlanting, type FarmField } from "@/lib/farmer/model";
import { Icon } from "./Icon";
import { EmptyState } from "./Shared";

export function FieldTable({ field, showDetails }: { field: FarmField; showDetails?: () => void }) {
  const [period, setPeriod] = useState("");
  const [filter, setFilter] = useState("");
  const [actions, setActions] = useState(false);
  const hasWater = !!field.irrigation && !["I don't know", "Prefer not to say"].includes(field.irrigation);
  const month = field.planting.help ? "" : field.planting.month;
  const visible = (!period || period === month) && (!filter || (filter === "provided" ? hasWater : !hasWater));

  return (
    <section className="cs-panel cs-table-panel" aria-label="Field Monitoring Overview">
      <div className="cs-table-heading">
        <h2>Field Monitoring Overview</h2>
        <div>
          <label className="cs-table-filter"><Icon name="calendar" />
            <select aria-label="Filter by planting month" value={period} onChange={(event) => setPeriod(event.target.value)}>
              <option value="">All planting dates</option>
              {month && <option value={month}>{new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(month + "-01T00:00:00Z"))}</option>}
            </select>
          </label>
          <label className="cs-table-filter"><Icon name="filter" /><select aria-label="Filter by water availability" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">Filter</option><option value="provided">Water recorded</option><option value="unknown">Water unspecified</option>
          </select></label>
        </div>
      </div>
      {visible ? <div className="cs-table-scroll" tabIndex={0} aria-label="Field monitoring table" role="region"><table role="table">
        <thead><tr role="row"><th scope="col">Field name</th><th scope="col">Selected crops</th><th scope="col">Planting period</th><th scope="col">Assessment status</th><th scope="col">Water availability</th><th scope="col">Actions</th></tr></thead>
        <tbody><tr role="row">
          <th scope="row"><span><Icon name="sprout" /></span>{field.name}</th><td data-label="Selected crops">{field.crops.join(", ")}</td><td data-label="Planting period">{formatPlanting(field.planting)}</td>
          <td data-label="Assessment status"><span className="cs-status-pill">{field.assessment}</span></td><td data-label="Water availability">{field.irrigation || "Not provided"}</td>
          <td data-label="Actions"><button className="cs-icon-link" type="button" aria-expanded={actions} onClick={() => setActions(!actions)} aria-label="Field actions"><Icon name="more" /></button></td>
        </tr></tbody>
      </table></div> : <EmptyState icon="filter" title="No fields match these filters"><button type="button" className="cs-text-link" onClick={() => { setPeriod(""); setFilter(""); }}>Clear filters</button></EmptyState>}
      {visible && actions && <div className="cs-table-actions">
        {showDetails ? <button type="button" className="cs-text-link" onClick={showDetails}><Icon name="map" /> Show on map</button> : <Link className="cs-text-link" href="/dashboard"><Icon name="map" /> Open field map</Link>}
        <Link className="cs-text-link" href="/onboarding/location?edit=1"><Icon name="edit" /> Edit field information</Link>
      </div>}
    </section>
  );
}

