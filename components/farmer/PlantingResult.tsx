"use client";

import Image from "next/image";
import Link from "next/link";
import { cropNames, crops, type FarmerOnboardingDraft } from "@/lib/farmer/model";
import { cropFacts } from "@/lib/farmer/cropFacts";

function CropEvidence({ name }: { name: string }) {
  const facts = cropFacts[name.toLowerCase()];
  if (!facts) return <div className="cs-result-evidence"><strong>What to check</strong><p>Compare this crop’s water needs and growing time with the season, your soil and the resources you have.</p><p>Ask a local agricultural adviser about a suitable variety and planting date.</p></div>;
  return <div className="cs-result-evidence"><strong>Why these conditions matter</strong><p>{facts.water}</p><p>{facts.rotation}</p>{name.toLowerCase() === "common beans" && <p>A previous maize crop does not tell us your soil pH. A soil test can help you understand it.</p>}<div className="cs-result-sources">{facts.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div></div>;
}

function nextSeason(now: Date) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  if (month <= 5) return `March–May ${year} (Season B)`;
  if (month <= 11) return `October–November ${year} (Season A)`;
  return `March–May ${year + 1} (Season B)`;
}

export function PlantingResult({ draft }: { draft: FarmerOnboardingDraft }) {
  const names = cropNames(draft.selection);
  const chosen = names[0];
  if (!chosen) return null;
  const openToAlternatives = draft.selection.suggestions === "I'm open to suggestions";
  const other = names[1] || (openToAlternatives ? (chosen.toLowerCase() === "common beans" ? "Maize" : "Common beans") : "");
  const selectedAlternative = names.includes(other);
  const image = (name: string) => crops.find((crop) => crop.name.toLowerCase() === name.toLowerCase())?.image;
  return <section className="cs-planting-result" id="planting-result" aria-labelledby="planting-result-title">
    <div className="cs-result-heading"><div><span>YOUR CROPSUITE RESULT · EXAMPLE</span><h2 id="planting-result-title">Your next planting options</h2><p>Here is an example of how CropSuite can turn your answers into a plan.</p></div><span className="cs-result-season">{nextSeason(new Date())}</span></div>
    <div className="cs-result-cards"><article className="cs-result-card">{image(chosen) && <Image src={image(chosen)!} alt="" width={400} height={220} unoptimized />}<div><span className="cs-result-tag">From your choices</span><h3>Consider planting {chosen}</h3><p>You selected {chosen}. This example highlights one of your choices; it is not a yield ranking.</p><CropEvidence name={chosen} /></div></article>
      {other ? <article className="cs-result-card">{image(other) && <Image src={image(other)!} alt="" width={400} height={220} unoptimized />}<div><span className="cs-result-tag">{selectedAlternative ? "Another crop you selected" : "Another crop to consider"}</span><h3>Also explore {other}</h3><p>{selectedAlternative ? `You also chose ${other}.` : `If you can get ${other} seed, you could explore it alongside your choice.`} Compare growing time, water, cost and local market before deciding.</p><CropEvidence name={other} /><p className="cs-result-reason"><strong>Could it improve your harvest?</strong> This demo does not calculate or guarantee a higher yield.</p></div></article> : <article className="cs-result-card cs-result-preference"><div><span className="cs-result-tag">Your preference</span><h3>Explore more crops</h3><p>Add another crop or change your preference to compare an additional example.</p><Link className="cs-text-link" href="/onboarding/journey/crops">Change crop choices →</Link></div></article>}</div>
    <div className="cs-result-context"><strong>Your farm and the local climate</strong><p>Your water answer: {draft.guide.water || (draft.resources.irrigation ? `Water without rain: ${draft.resources.irrigation}` : "not provided")}. A study cites about 919 mm of rain per year for Kayonza, but this average does not tell us whether rain will arrive when your crop needs it.</p><a href="https://soil.copernicus.org/articles/7/767/2021/soil-7-767-2021.html" target="_blank" rel="noreferrer">Kayonza climate study ↗</a></div>
    <p className="cs-result-footnote"><strong>Example, not a forecast or verified recommendation.</strong> The season is a Rwanda-wide reference, not a field-specific planting date. Rainfall, seed variety and field conditions vary; check local advice and your harvest timing before planting. <a href="https://www.statistics.gov.rw/sites/default/files/documents/2025-07/Rwanda%20CFSVA%202024.pdf" target="_blank" rel="noreferrer">See Rwanda’s seasonal calendar ↗</a></p>
  </section>;
}
