import Link from "next/link";
import { formatPlace, type FarmerResources, type FarmLocation } from "@/lib/farmer/model";
import { Icon } from "./Icon";
import { displayOption } from "./Shared";
import { kayonzaClimate } from "@/lib/farmer/demoClimate";

export function WeatherPanel({ location }: { location: FarmLocation }) {
  return (
    <section className="cs-panel cs-simple-panel" aria-label="Weather">
      <div className="cs-weather-location"><Icon name="pin" /> <span>{formatPlace(location)}</span></div>
      <div className="cs-climate-heading"><div><span>Historical climate reference · Kayonza</span><strong>{kayonzaClimate.annualRainfall} <small>mm / year</small></strong></div><Icon name="drop" /></div>
      <p>Reported district average. Rainfall varies by location and year; this is not a forecast.</p>
      <div className="cs-rain-chart" aria-label="Illustrative monthly rainfall: wetter around April and November, drier from June to August">{kayonzaClimate.monthlyExample.map((rain, index) => <div key={index}><span style={{ height: `${rain / 145 * 100}%` }} /><small>{"JFMAMJJASOND"[index]}</small></div>)}</div>
      <p>Example monthly pattern · wetter in March–May and October–December.</p>
      <a className="cs-text-link" href={kayonzaClimate.source} target="_blank" rel="noreferrer">Read the Kayonza climate study <Icon name="right" /></a>
    </section>
  );
}

export function ResourcesPanel({ resources }: { resources: FarmerResources }) {
  return (
    <section className="cs-panel cs-simple-panel">
      <h2>What you have</h2>
      <dl className="cs-dashboard-rows">
        <div><dt>Can water crops without rain</dt><dd>{displayOption(resources.irrigation) || "Not shared"}</dd></div>
        <div><dt>Seeds</dt><dd>{resources.seeds.trim() || "Not shared"}</dd></div>
        <div><dt>Soil notes</dt><dd>{resources.soil.trim() || "Not shared"}</dd></div>
      </dl>
      <Link className="cs-text-link" href="/onboarding/resources?edit=1">Change these answers <Icon name="right" /></Link>
    </section>
  );
}

export function ActivityPanel() {
  return (
    <section className="cs-panel cs-simple-panel">
      <h2>What grew before</h2>
      <p>Your previous crops can help you think about what to grow next.</p>
      <Link className="cs-text-link" href="/dashboard/history">See your farming history <Icon name="right" /></Link>
    </section>
  );
}

export function AnalyticsPanel() {
  return (
    <section className="cs-panel cs-simple-panel">
      <h2>Plan your next season</h2>
      <p>See examples of crop choices and how crops can change across seasons.</p>
      <Link className="cs-text-link" href="/dashboard/crop-planning">Explore examples <Icon name="right" /></Link>
    </section>
  );
}
