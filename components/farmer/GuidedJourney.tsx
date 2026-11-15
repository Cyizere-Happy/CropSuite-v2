"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { guidedErrors, journeyStages, type JourneyStage } from "@/lib/farmer/guided";
import { resetDemoPlan, startDemo, useFarmerSession } from "@/lib/farmer/store";
import { CropsStep, FarmStep, NeedsStep } from "./GuidedSteps";
import { GuidedPlan } from "./GuidedPlan";
import { LoadingState, Notice } from "./Shared";

const headings = {
  farm: { label: "Your Farm", title: "Let’s get to know your farm.", description: "Tell us about your farm to explore an example plan based on your answers and Kayonza’s climate." },
  crops: { label: "Your Crops", title: "What would you like to grow?", description: "Start with the crops you’re interested in. We’ll explore how they may fit your farm and growing season." },
  needs: { label: "Your Needs", title: "What matters most for your next season?", description: "A good farming plan should fit your goals, your time and the resources you have." },
  plan: { label: "Your Planting Plan", title: "Your Planting Plan", description: "" },
} as const;

export function GuidedJourney({ stage, returnTo }: { stage: JourneyStage; returnTo: "needs" | "plan" | null }) {
  const router = useRouter();
  const session = useFarmerSession();
  const [submitted, setSubmitted] = useState(false);
  const errorSummary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session && !session.demo) startDemo();
  }, [session]);

  if (!session) return <LoadingState />;
  const { draft } = session;
  const errors = submitted ? guidedErrors(stage, draft) : [];
  const stageIndex = journeyStages.indexOf(stage);
  const incomplete = journeyStages.slice(0, Math.min(stageIndex, 3)).find((item) => guidedErrors(item, draft).length > 0);

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issues = guidedErrors(stage, draft);
    if (issues.length) {
      setSubmitted(true);
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    router.push("/onboarding/journey/" + (returnTo || journeyStages[stageIndex + 1]));
  }

  function startAgain() {
    if (!window.confirm("Start again? This will erase all saved farm answers in this browser, including earlier plans.")) return;
    resetDemoPlan();
    router.push("/onboarding/journey/farm");
  }

  return <div className="cs-farmer cs-journey">
    <header className="cs-journey-header"><Link href="/" aria-label="CropSuite home"><CropSuiteLogo /></Link><span>Demonstration</span></header>
    <main className="cs-journey-main">
      {stage !== "thanks" && <nav className="cs-journey-progress" aria-label="Your planting plan progress"><div><span>Step {Math.min(stageIndex + 1, 4)} of 4</span><strong>{headings[stage as keyof typeof headings]?.label}</strong></div><progress value={Math.min(stageIndex + 1, 4)} max={4} aria-label="Progress through your planting plan" /><ol>{journeyStages.slice(0, 4).map((item, index) => <li key={item} aria-current={item === stage ? "step" : undefined} data-done={index < stageIndex}>{headings[item as keyof typeof headings].label}</li>)}</ol></nav>}
      {!session.persistent && <Notice>Your answers can only be kept while this tab is open.</Notice>}
      {stage === "farm" && session.completed && <p className="cs-journey-note cs-journey-previous">You have an earlier farm plan. <Link href="/dashboard">View previous farm details</Link></p>}
      {incomplete ? <section className="cs-journey-summary"><h1>Let’s finish the earlier questions.</h1><p>Your answers are still here. A few details are needed before you can continue.</p><Link className="cs-button cs-button-primary" href={"/onboarding/journey/" + incomplete}>Continue your plan</Link></section> : stage === "thanks" ? <section className="cs-journey-thanks"><span><CropSuiteLogo /></span><h1>Thank you for exploring CropSuite.</h1><p>Every farming decision starts with understanding your land and your needs. We hope this demonstration has shown how Earth data and your own knowledge can help shape better-informed growing seasons.</p><p>CropSuite is starting its journey with farmers in Kayonza, Rwanda.</p><div><Link className="cs-button cs-button-primary" href="/onboarding/journey/plan">Review My Plan</Link><button type="button" className="cs-button cs-button-secondary" onClick={startAgain}>Start Again</button></div><small>Starting again will erase all saved farm answers, including earlier plans, after you confirm.</small></section> : stage === "plan" ? <GuidedPlan draft={draft} /> : <>
        <div className="cs-journey-title"><p>Let’s make a plan together</p><h1>{headings[stage].title}</h1><span>{headings[stage].description}</span></div>
        <form className="cs-journey-form" onSubmit={next} noValidate>
          {errors.length > 0 && <div ref={errorSummary} tabIndex={-1} role="alert" className="cs-error-summary"><strong>Please check your answers</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
          {stage === "farm" ? <FarmStep draft={draft} /> : stage === "crops" ? <CropsStep draft={draft} /> : <NeedsStep draft={draft} />}
          <div className="cs-journey-actions"><Link className="cs-button cs-button-secondary" href={returnTo ? "/onboarding/journey/" + returnTo : stageIndex ? "/onboarding/journey/" + journeyStages[stageIndex - 1] : "/"}>Back</Link><button type="submit" className="cs-button cs-button-primary">{returnTo ? "Save and return" : stage === "needs" ? "Explore My Planting Plan" : "Continue"}</button></div>
        </form>
      </>}
    </main>
  </div>;
}
