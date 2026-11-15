"use client";

import Image from "next/image";
import { useState } from "react";

const comparisons = [
  { name: "Maize", image: "/farmer/crops/maize.webp" },
  { name: "Common beans", image: "/farmer/crops/common-beans.webp" },
];

export function CropComparison() {
  return (
    <section className="cs-plan-example" aria-labelledby="comparison-title">
      <p className="cs-example-label">Illustrative planning example · Not a recommendation</p>
      <h2 id="comparison-title">Explore planting options</h2>
      <p>Start with crops you are considering. Evidence and local conditions would need review before comparing them for your field.</p>
      <div className="cs-comparison-grid">
        {comparisons.map((crop) => (
          <article className="cs-comparison" key={crop.name}>
            <Image src={crop.image} alt="" width={358} height={177} unoptimized />
            <div className="cs-comparison-body">
              <span className="cs-example-label">Example crop</span><h3>{crop.name}</h3>
              <dl>
                <div><dt>Variety</dt><dd>Not specified</dd></div>
                <div><dt>Historical climate</dt><dd>Unavailable</dd></div>
                <div><dt>Modeled suitability</dt><dd>Evidence pending</dd></div>
                <div><dt>Growing period</dt><dd>Needs review</dd></div>
                <div><dt>Water and resources</dt><dd>More information needed</dd></div>
                <div><dt>Rotation relevance</dt><dd>Needs review</dd></div>
              </dl>
              <details><summary>Why these details?</summary><p>Crop variety, field history, water, timing and available inputs can all matter. No field-specific assessment has been calculated.</p></details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RotationExample() {
  const [alternative, setAlternative] = useState(false);
  const sequence = alternative ? ["Common beans", "Maize", "Common beans"] : ["Maize", "Common beans", "Maize"];
  return (
    <section className="cs-plan-example" aria-labelledby="rotation-title">
      <p className="cs-example-label">Illustrative sequence · Not a recommendation</p>
      <h2 id="rotation-title">Think beyond one season</h2>
      <p>Crop history can help frame the next choice. Rotation may diversify a cropping system; its effects depend on local conditions and management.</p>
      <div className="cs-rotation">
        {sequence.map((crop, index) => (
          <article key={index}>
            <span>{["Previous crop", "Considering", "A following season"][index]}</span>
            <Image src={crop === "Maize" ? "/farmer/crops/maize.webp" : "/farmer/crops/common-beans.webp"} alt="" width={358} height={177} unoptimized />
            <strong>{crop}</strong>
          </article>
        ))}
      </div>
      <p>Water, growing periods and available resources would all need review for a practical plan.</p>
      <button type="button" className="cs-button cs-button-secondary" onClick={() => setAlternative(!alternative)}>Compare another example</button>
    </section>
  );
}

export function EvidenceExplanation() {
  return (
    <section className="cs-panel cs-content-panel cs-evidence-explanation">
      <h2>Why this matters</h2>
      <details><summary>What you told us</summary><p>Your location, crop choices, history and resources are saved in your plan.</p></details>
      <details><summary>What regional Earth data can tell us</summary><p>NASA POWER provides historical rainfall and temperature estimates. Climate evidence is not connected in this demo.</p></details>
      <details><summary>What crop information contributes</summary><p>Crop characteristics and modeled suitability can help frame questions about growing periods and conditions. Evidence is pending review.</p></details>
      <details><summary>What we still need to know</summary><p>Local observations, crop varieties, management and validated evidence would be needed to assess a field. Regional estimates cannot describe every field.</p></details>
    </section>
  );
}
