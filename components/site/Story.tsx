"use client";

import { useState } from "react";
import Image from "next/image";
import { containerClass } from "@/lib/site-config";
import { SectionReveal } from "./SectionReveal";

const questions = [
  { label: "Your field", question: "Where is your farm?", answer: "Your location helps identify the regional information that may be relevant." },
  { label: "Your crops", question: "What would you like to grow?", answer: "Your preferred crops give the planning process a place to start." },
  { label: "Previous crop", question: "What grew here last season?", answer: "Crop history can help you consider what a rotation might look like." },
  { label: "Your water", question: "Do you have access to irrigation?", answer: "Water access can shape the conditions and choices that need review." },
  { label: "Your timing", question: "When would you like to harvest?", answer: "A deadline can help you consider whether a growing period fits your plans." },
];

export function FarmerStory() {
  const [active, setActive] = useState(0);
  return <section id="overview" className="cs-story-section bg-bg"><div className={`${containerClass} cs-story-grid`}>
    <SectionReveal><p className="cs-story-eyebrow">It starts with you</p><h2>Before we suggest a crop, we listen.</h2><p>A farmer may be choosing between maize and beans, depending on rainfall, or planning around a harvest deadline. Every field and every family has its own story.</p><p>CropSuite starts by asking what you know. Your experience provides local detail that regional data cannot capture.</p></SectionReveal>
    <SectionReveal className="cs-question-panel"><p className="cs-story-eyebrow">Explore the questions</p><div className="cs-question-tabs" role="group" aria-label="Explore farmer questions">{questions.map((item, index) => <button type="button" key={item.label} aria-pressed={active === index} onClick={() => setActive(index)}>{item.label}</button>)}</div><div className="cs-question-answer" aria-live="polite"><span>Farmer knowledge</span><h3>{questions[active].question}</h3><p>{questions[active].answer}</p></div><p className="cs-story-note">An example of the questions in your farm setup. Answers can be updated.</p></SectionReveal>
  </div><div className={`${containerClass} cs-story-path`} aria-label="The intended planning journey"><span>Your field</span><span>Your crop choices</span><span>Climate evidence</span><span>Crop comparison</span><span>Rotation plan</span></div><div className={containerClass}><p className="cs-story-note">The comparison, climate evidence and rotation assessment are illustrative or pending in this demo.</p></div></section>;
}

export function KayonzaStory() {
  return <section className="cs-story-section bg-white"><div className={`${containerClass} cs-place-grid`}><SectionReveal><p className="cs-story-eyebrow">Our starting point</p><h2>Why Kayonza?</h2><p>We’re beginning in Kayonza, in Rwanda’s Eastern Province, where rainfall varies across seasons and locations. For farmers who depend on rain, choosing when and what to plant can involve difficult trade-offs.</p><p>CropSuite explores how local farming knowledge and regional Earth data can support more informed decisions.</p><a className="cs-story-link" href="https://doi.org/10.1155/2023/5372701" target="_blank" rel="noreferrer">Research behind this pilot ↗</a><p className="cs-story-note">Kayonza is our pilot. Individual field conditions can still differ from regional estimates.</p></SectionReveal><div className="cs-place-image" role="img" aria-label="Illustrative aerial view of agricultural fields"><div><span>Eastern Province</span><strong>Kayonza, Rwanda</strong><small>Our pilot · Illustrative imagery</small></div></div></div></section>;
}

export function EvidenceStory() {
  return (
    <section id="features" className="cs-story-section cs-evidence-story">
      <div className={containerClass}>
        <SectionReveal className="cs-story-intro">
          <p className="cs-story-eyebrow">Knowledge from field to sky</p>
          <h2>A better view of your field begins beyond your field.</h2>
          <p>NASA provides historical climate information that can help us examine rainfall and temperature patterns across growing periods. CropSuite brings that wider picture together with crop information and what the farmer tells us.</p>
        </SectionReveal>
        <div className="cs-evidence-layers">
          <article>
            <span>Farmer knowledge</span>
            <h3>The farmer knows the field.</h3>
            <p>Location, crop choices, previous seasons, water access, resources and observations begin the conversation.</p>
          </article>
          <article>
            <div className="cs-source-mark">
              <Image src="/Nasa Logo.png" alt="" width={706} height={433} />
              <span>NASA POWER</span>
            </div>
            <h3>NASA provides the wider climate picture.</h3>
            <p>Historical rainfall and temperature estimates can help reveal patterns across growing periods, including dry spells and heat exposure.</p>
            <div className="cs-climate-example" aria-label="Illustrative climate pattern, no measurements shown"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <small>Illustrative pattern · No measurements shown</small>
          </article>
          <article>
            <div className="cs-source-mark">
              <Image src="/Fao Logo.webp" alt="" width={331} height={335} />
              <span>FAO GAEZ</span>
            </div>
            <h3>Agricultural models help us understand crop possibilities.</h3>
            <p>FAO GAEZ assesses modeled crop suitability under particular climate, soil, water and management conditions. It is a separate agricultural model.</p>
          </article>
        </div>
        <p className="cs-equation">Your knowledge <span>+</span> Earth data <span>+</span> crop science <span>=</span> a more informed planting plan.</p>
        <p className="cs-story-note">Climate and suitability assessments are not connected in this demo. The farmer remains the decision-maker.</p>
      </div>
    </section>
  );
}

export function Methodology() {
  return <section className="cs-story-section bg-white"><div className={`${containerClass} cs-method`}><SectionReveal><p className="cs-story-eyebrow">Sources and limitations</p><h2>Built on evidence. Grounded in your reality.</h2><p>Farmer knowledge, regional climate estimates and agricultural models each tell a different part of the story. Regional information can support decisions, but it cannot replace field observations or guarantee harvest results.</p><p>CropSuite is a NASA Space Apps Challenge 2026 project exploring crop rotation with Earth data. NASA does not endorse CropSuite.</p></SectionReveal><div className="cs-source-list"><a href="https://power.larc.nasa.gov/docs/services/api/temporal/daily/" target="_blank" rel="noreferrer"><strong>NASA POWER</strong><span>Climate information · daily data documentation ↗</span></a><a href="https://www.fao.org/gaez/gaezv4/en/" target="_blank" rel="noreferrer"><strong>FAO GAEZ</strong><span>Modeled agricultural suitability ↗</span></a><a href="https://doi.org/10.1155/2023/5372701" target="_blank" rel="noreferrer"><strong>Kayonza rainfall research</strong><span>Regional rainfall variability study ↗</span></a><a href="https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/" target="_blank" rel="noreferrer"><strong>NASA Space Apps Challenge</strong><span>Field Shift challenge ↗</span></a></div></div></section>;
}

export function StoryCta() {
  return <section className="cs-story-section cs-story-cta"><div className={containerClass}><p className="cs-story-eyebrow">Your next season</p><h2>Your next season starts with understanding your field.</h2><p>Tell CropSuite what you’re planning, what grew before, and what matters most to you. Explore how that information can shape a better-informed plan.</p><div><a className="cs-story-button" href="/login">Explore My Farm <span aria-hidden="true">→</span></a><a className="cs-story-link" href="#overview">How CropSuite Works</a></div></div></section>;
}
