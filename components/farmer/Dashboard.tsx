"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { CropSuiteMark } from "@/components/brand/CropSuiteMark";
import { dashboardHref, dashboardSections, type DashboardSection } from "@/lib/farmer/dashboard";
import { toField, type FarmerOnboardingDraft, type FarmField } from "@/lib/farmer/model";
import { leaveDemo, updateDraft, useFarmerSession } from "@/lib/farmer/store";
import { firstIncomplete } from "@/lib/farmer/validation";
import { ActivityPanel, AnalyticsPanel, ResourcesPanel, WeatherPanel } from "./DashboardPanels";
import { FieldWorkspace, type FieldView } from "./FieldWorkspace";
import { FieldTable } from "./FieldTable";
import { Icon } from "./Icon";
import { planSections } from "./Review";
import { displayOption, EmptyState, Field, LoadingState, Notice } from "./Shared";
import { CropComparison, EvidenceExplanation, RotationExample } from "./PlanningExamples";
import { PlantingResult } from "./PlantingResult";

function downloadPlan(draft: FarmerOnboardingDraft) {
  const data = new Blob([JSON.stringify({ version: 1, plan: draft }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cropsuite-farm-plan.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Sidebar({ section, profile }: { section: DashboardSection; profile?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="cs-sidebar" data-open={open}>
      <div className="cs-sidebar-header">
        <Link className="cs-sidebar-brand" href="/dashboard" aria-label="CropSuite dashboard"><CropSuiteMark /></Link>
        <Link className="cs-sidebar-mobile-brand" href="/dashboard" aria-label="CropSuite dashboard"><CropSuiteLogo /></Link>
        <span className="cs-sidebar-mode">Demo Mode</span>
        <button type="button" className="cs-icon-link cs-sidebar-toggle" aria-expanded={open} aria-controls="dashboard-nav"
          aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      </div>
      <nav id="dashboard-nav" aria-label="Farmer dashboard">
        {dashboardSections.map(({ id, title, icon }) => <Link href={dashboardHref(id)} key={id} title={title} aria-current={section === id ? "page" : undefined} onClick={() => setOpen(false)}>
          <Icon name={icon} /><span>{title}</span>
        </Link>)}
        <Link className="cs-sidebar-mobile-profile" href="/dashboard/settings"><Icon name="user" /><span>{profile || "Farmer profile"}</span></Link>
      </nav>
      <Link className="cs-sidebar-profile" href="/dashboard/settings" aria-label="Farmer profile" title={profile || "Farmer profile"}>
        {profile ? <span>{profile.trim().charAt(0).toUpperCase()}</span> : <Icon name="user" />}
      </Link>
    </aside>
  );
}

function DashboardSearch({ field }: { field: FarmField }) {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const sections = dashboardSections.filter(({ title }) => title.toLowerCase().includes(search));
  const fieldMatch = [field.name, ...field.crops].some((item) => item.toLowerCase().includes(search));
  return (
    <div className="cs-dashboard-search">
      <label className="cs-search"><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search dashboard" placeholder="Search fields, crops, or pages…" /></label>
      {search && <div className="cs-search-matches">
        {sections.map(({ id, title, icon }) => <Link href={dashboardHref(id)} key={id} onClick={() => setQuery("")}><Icon name={icon} /> {title}</Link>)}
        {fieldMatch && <Link href="/dashboard/fields" onClick={() => setQuery("")}><Icon name="sprout" /> {field.name}</Link>}
        {!sections.length && !fieldMatch && <p>No matches for this search.</p>}
      </div>}
    </div>
  );
}

function DashboardOverview({ draft, field }: { draft: FarmerOnboardingDraft; field: FarmField }) {
  const [view, setView] = useState<FieldView>("details");

  return (
    <main className="cs-dashboard-grid">
      <h1 className="sr-only">Farmer dashboard</h1>
      <div className="cs-dashboard-map-column" id="field-workspace">
        <Link className="cs-result-banner" href="/dashboard/crop-planning"><span><strong>Your planting options are ready</strong><small>See your crops, season and another option</small></span><span aria-hidden="true">→</span></Link>
        <FieldWorkspace field={field} view={view} setView={setView} exportPlan={() => downloadPlan(draft)} />
      </div>
      <div className="cs-dashboard-table-column"><PlantingResult draft={draft} /><FieldTable field={field} showDetails={() => {
        setView("details");
        document.getElementById("field-workspace")?.scrollIntoView({ block: "start" });
      }} /><section className="cs-panel cs-home-plan"><h2>My farm</h2><DataRows rows={[["Location", planSections(draft)[1].rows[0][1]], ["Preferred crops", field.crops.join(", ")], ["Previous crop", draft.history.recent], ["Can water crops without rain", displayOption(draft.resources.irrigation)], ["Your priorities", draft.goals.join(", ")]]} /><Link className="cs-text-link" href="/onboarding/review">Edit farm information <Icon name="right" /></Link></section><section className="cs-panel cs-home-plan"><h2>My planting plan</h2><p>Explore how your field details can inform future choices.</p><Link className="cs-text-link" href="/dashboard/crop-planning">Explore planting options and rotation <Icon name="right" /></Link></section><EvidenceExplanation /></div>
      <div className="cs-dashboard-search-slot"><DashboardSearch field={field} /></div>
      <aside className="cs-dashboard-panels" aria-label="Farm monitoring panels">
        <WeatherPanel location={field.location} />
        <ResourcesPanel resources={draft.resources} />
        <ActivityPanel />
        <AnalyticsPanel />
      </aside>
    </main>
  );
}

function DataRows({ rows }: { rows: string[][] }) {
  return <dl className="cs-dashboard-rows">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}</dl>;
}

function ContentPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="cs-panel cs-content-panel"><h2>{title}</h2>{children}</section>;
}

function ProfileSettings({ draft }: { draft: FarmerOnboardingDraft }) {
  const router = useRouter();
  const [name, setName] = useState(draft.profile.displayName || "");
  const [saved, setSaved] = useState(false);

  function save(event: FormEvent) {
    event.preventDefault();
    updateDraft((current) => ({ ...current, profile: { displayName: name.trim() } }));
    setSaved(true);
  }

  return <>
    <ContentPanel title="Farmer profile">
      <form className="cs-profile-form" onSubmit={save}>
        <Field name="display-name" label="Display name" optional><input id="display-name" value={name} maxLength={60} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></Field>
        <button className="cs-button cs-button-primary">Save profile</button>
        {saved && <p role="status">Profile saved.</p>}
      </form>
    </ContentPanel>
    <ContentPanel title="Demo session">
      <p>Use this browser to resume your saved plan after leaving Demo Mode.</p>
      <button className="cs-button cs-button-secondary" type="button" onClick={() => { leaveDemo(); router.push("/login"); }}><Icon name="logout" /> Leave Demo Mode</button>
    </ContentPanel>
  </>;
}

function SectionContent({ section, draft, field }: { section: DashboardSection; draft: FarmerOnboardingDraft; field: FarmField }) {
  const plan = planSections(draft);
  switch (section) {
    case "fields":
      return <><FieldTable field={field} /><ContentPanel title={field.name}><DataRows rows={plan[1].rows} /></ContentPanel></>;
    case "crop-planning":
      return <><PlantingResult draft={draft} /><ContentPanel title="Your farm, in your words"><DataRows rows={[["Location", plan[1].rows[0][1]], ["Preferred crops", field.crops.join(", ")], ["Previous crop", draft.history.recent], ["Can water crops without rain", displayOption(draft.resources.irrigation)], ["Your priorities", draft.goals.join(", ")]]} /><Link className="cs-text-link" href="/onboarding/review"><Icon name="edit" /> Edit your farm plan</Link></ContentPanel><CropComparison selected={field.crops} /><RotationExample /><EvidenceExplanation /></>;
    case "assessments":
      return <ContentPanel title="Assessment status"><EmptyState icon="clipboard" title={field.assessment}>
        <p>Maize and common beans are in the proposed Kayonza pilot scope, pending source validation.</p>
        <Link className="cs-text-link" href="/dashboard/crop-planning">See your crop plan <Icon name="right" /></Link>
      </EmptyState></ContentPanel>;
    case "history":
      return <><ContentPanel title="Farming history you shared"><DataRows rows={plan[3].rows} /><Link className="cs-text-link" href="/onboarding/history?edit=1"><Icon name="edit" /> Edit farming history</Link></ContentPanel>
        <ContentPanel title="Activity log"><EmptyState icon="calendar" title="No activities recorded" /></ContentPanel></>;
    case "reports":
      return <><ContentPanel title="Export your planting plan"><p>Download a JSON copy of the information you provided.</p>
        <button type="button" className="cs-button cs-button-primary" onClick={() => downloadPlan(draft)}>Download plan</button></ContentPanel>
        <ContentPanel title="Analytics"><DataRows rows={["Crop comparison", "Planting windows", "Climate evidence", "Farm activities", "Planting-plan history"].map((label) => [label, "Pending integration"])} /></ContentPanel></>;
    case "settings":
      return <ProfileSettings draft={draft} />;
    case "help":
      return <ContentPanel title="Using your workspace">
        <details><summary>How do I change my farm information?</summary><p>Open <Link href="/onboarding/review">Edit farm plan</Link> and choose the section you want to update.</p></details>
        <details><summary>How is the map created?</summary><p>The map uses OpenStreetMap. It shows your saved location point if provided; otherwise it opens around Kayonza. It does not show a field boundary.</p></details>
        <details><summary>Where is my plan saved?</summary><p>Your answers are stored in this browser. Download a copy from <Link href="/dashboard/reports">Reports</Link>.</p></details>
      </ContentPanel>;
    default:
      return null;
  }
}

export function Dashboard({ section }: { section: DashboardSection }) {
  const session = useFarmerSession();
  if (!session) return <LoadingState />;
  const { draft, demo, completed } = session;
  const incomplete = firstIncomplete(draft);
  if (!demo || !completed || incomplete) {
    return <main className="cs-farmer cs-access"><EmptyState icon={demo ? "checklist" : "lock"} title={demo ? "Finish your farm setup" : "Open your CropSuite workspace"}>
      <Link className="cs-button cs-button-primary" href={demo ? "/onboarding/" + (incomplete?.id ?? "review") : "/login"}>{demo ? "Continue farm setup" : "Go to sign in"}</Link>
    </EmptyState></main>;
  }

  const field = toField(draft);
  const title = dashboardSections.find(({ id }) => id === section)?.title;

  return (
    <div className="cs-farmer cs-dashboard-page">
      <div className="cs-dashboard-shell">
        <Sidebar section={section} profile={draft.profile.displayName} />
        <div className="cs-dashboard-content">
          {!session.persistent && <Notice>Browser storage is unavailable. Keep this tab open to retain your answers.</Notice>}
          {section === "" ? <DashboardOverview draft={draft} field={field} /> : <main className="cs-dash-section">
            <div className="cs-dash-section-heading"><div><small>Farmer workspace</small><h1>{title}</h1></div><Link className="cs-button cs-button-secondary" href="/onboarding/review"><Icon name="edit" /> Edit farm plan</Link></div>
            <SectionContent section={section} draft={draft} field={field} />
          </main>}
        </div>
      </div>
    </div>
  );
}

