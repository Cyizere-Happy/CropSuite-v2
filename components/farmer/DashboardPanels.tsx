"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { formatPlace, type FarmLocation } from "@/lib/farmer/model";
import { Icon } from "./Icon";

function PanelHeading({ children, href, linkLabel }: { children: ReactNode; href?: string; linkLabel?: string }) {
  return <div className="cs-panel-heading"><h2>{children}</h2>{href && <Link className="cs-icon-link" href={href} aria-label={linkLabel} title={linkLabel}><Icon name="upRight" /></Link>}</div>;
}

export function WeatherPanel({ location }: { location: FarmLocation }) {
  const readings = [{ name: "Humidity", icon: "drop" }, { name: "Rain forecast", icon: "cloud" }, { name: "Wind", icon: "wind" }] as const;
  return (
    <section className="cs-panel cs-weather" aria-label="Weather">
      <div className="cs-weather-location"><Icon name="pin" /> <span>{formatPlace(location)}</span></div>
      <div className="cs-weather-current"><div className="cs-temperature" aria-hidden="true">—°C</div><div><span><Icon name="cloud" /> Farm weather</span><p>Weather data not connected</p></div></div>
      <dl className="cs-weather-metrics">
        {readings.map(({ name, icon }) => <div key={name}><Icon name={icon} /><dt>{name}</dt><dd aria-label="Unavailable">—</dd></div>)}
      </dl>
    </section>
  );
}

const resources = [
  { name: "Water availability", color: "#104d37" },
  { name: "Seed availability", color: "#19865e" },
  { name: "Soil information", color: "#b6ed79" },
  { name: "Planting resources", color: "#e9ad42" },
  { name: "Input requirements", color: "#df765d" },
];
const periods = {
  Week: [29, 24, 20, 15, 12],
  Month: [23, 29, 16, 18, 14],
  Year: [24, 18, 23, 21, 14],
};

export function ResourcesPanel() {
  const [period, setPeriod] = useState<keyof typeof periods>("Week");
  const slices = periods[period];
  return (
    <section className="cs-panel cs-resource">
      <PanelHeading>Resource Monitoring</PanelHeading>
      <div className="cs-period-control" role="group" aria-label="Sample resource period">
        {(Object.keys(periods) as Array<keyof typeof periods>).map((option) => (
          <button type="button" key={option} aria-pressed={period === option} onClick={() => setPeriod(option)}>{option}</button>
        ))}
      </div>
      <div className="cs-resource-body">
        <div>
          <ul className="cs-chart-legend">{resources.map(({ name, color }) => <li key={name}><i style={{ background: color }} />{name}</li>)}</ul>
          <p className="cs-panel-note">Illustrative breakdown</p>
        </div>
        <div className="cs-donut" role="img" aria-label={"Illustrative resource chart, " + period.toLowerCase() + " view"}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            {slices.map((slice, i) => {
              const start = slices.slice(0, i).reduce((sum, value) => sum + value, 0);
              return <circle key={resources[i].name} cx="60" cy="60" r="46" pathLength="100" stroke={resources[i].color} strokeDasharray={(slice - 2) + " " + (102 - slice)} strokeDashoffset={-start} />;
            })}
          </svg>
          <span>Sample</span>
        </div>
      </div>
    </section>
  );
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activity = [
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 3, 3, 3, 0, 0],
  [0, 3, 3, 3, 3, 2, 0],
  [1, 1, 3, 4, 3, 3, 1],
  [0, 1, 1, 3, 4, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

export function ActivityPanel() {
  return (
    <section className="cs-panel cs-activity">
      <PanelHeading href="/dashboard/history" linkLabel="Open farm history">Weekly Activity</PanelHeading>
      <div className="cs-heatmap" role="img" aria-label="Sample weekly activity calendar">
        <span />
        {weekdays.map((day) => <span key={day}>{day}</span>)}
        {activity.flatMap((row, index) => [<span className="cs-heat-time" key={"time" + index}>{index + 1} pm</span>,
          ...row.map((level, day) => <i key={index + "-" + day} data-level={level} />)])}
      </div>
      <div className="cs-heatmap-footer"><span>Example calendar</span><span>Less {activity[0].slice(0, 5).map((_, i) => <i key={i} data-level={i} />)} More</span></div>
    </section>
  );
}

const analytics = ["Crop comparison", "Planting windows", "Climate evidence", "Farm activities", "Planting-plan history"];

export function AnalyticsPanel() {
  return (
    <section className="cs-panel cs-analytics">
      <PanelHeading href="/dashboard/reports" linkLabel="Open reports">Plan Analytics</PanelHeading>
      <ul className="cs-chart-legend">{analytics.slice(0, 3).map((label, index) => <li key={label}><i style={{ background: resources[index].color }} />{label}</li>)}</ul>
      <div className="cs-analytics-placeholder" aria-hidden="true"><i /><i /><i /></div>
      <p className="cs-panel-note">Awaiting connected data</p>
    </section>
  );
}

