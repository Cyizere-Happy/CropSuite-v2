"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { steps, type Step } from "@/lib/farmer/model";
import { completePlan, useFarmerSession, updateDraft } from "@/lib/farmer/store";
import { firstIncomplete, validateStep, type FormErrors } from "@/lib/farmer/validation";
import { Icon } from "./Icon";
import { StepForm } from "./OnboardingSteps";
import { Review } from "./Review";
import { EmptyState, LoadingState, Notice } from "./Shared";

export function Onboarding({ step, editing }: { step: Step; editing: boolean }) {
  const router = useRouter();
  const session = useFarmerSession();
  const [submitted, setSubmitted] = useState(false);
  const formError = useRef<HTMLDivElement>(null);
  if (!session) return <LoadingState />;
  if (!session.demo) {
    return <main className="cs-farmer cs-access"><EmptyState icon="lock" title="Start your CropSuite plan"><Link className="cs-button cs-button-primary" href="/login">Go to sign in</Link></EmptyState></main>;
  }

  const { draft } = session;
  const index = steps.findIndex(({ id }) => id === step);
  const current = steps[index];
  const incomplete = firstIncomplete(draft, step);
  const errors: FormErrors = submitted && step !== "review" ? validateStep(step, draft) : {};
  const previous = editing ? "/onboarding/review" : index > 0 ? "/onboarding/" + steps[index - 1].id : "/login";

  function next(event: FormEvent) {
    event.preventDefault();
    if (step === "review") {
      if (completePlan()) router.push("/dashboard");
      return;
    }
    if (Object.keys(validateStep(step, draft)).length > 0) {
      setSubmitted(true);
      requestAnimationFrame(() => formError.current?.focus());
      return;
    }
    router.push(editing ? "/onboarding/review" : "/onboarding/" + steps[index + 1].id);
  }

  return (
    <div className="cs-farmer cs-setup">
      <header className="cs-setup-header"><Link href="/" aria-label="CropSuite home"><CropSuiteLogo /></Link><span><span /> Demo Mode</span></header>
      <div className="cs-setup-layout">
        <aside className="cs-setup-nav">
          <div className="cs-setup-nav-heading"><strong>Farm setup</strong><small>Step {index + 1} of {steps.length}</small></div>
          <progress aria-label="Farm setup progress" value={index + 1} max={steps.length} />
          <nav aria-label="Onboarding steps">
            <ol>{steps.map((item, i) => {
              const done = i < index && Object.keys(validateStep(item.id, draft)).length === 0;
              const icon = done ? "check" : item.icon;
              const label = <><span><Icon name={icon} /></span>{item.label}</>;
              return <li key={item.id} data-current={item.id === step} data-done={done}>
                {i < index ? <Link href={"/onboarding/" + item.id}>{label}</Link> : <span aria-current={item.id === step ? "step" : undefined}>{label}</span>}
              </li>;
            })}</ol>
          </nav>
          {session.completed && !firstIncomplete(draft) && <Link className="cs-text-link cs-setup-dashboard" href="/dashboard"><Icon name="grid" /> Back to dashboard</Link>}
        </aside>
        <main className="cs-setup-main">
          <div className="cs-setup-title"><span><Icon name={current.icon} /></span><div><h1>{current.title}</h1><p>{current.description}</p></div></div>
          {!session.persistent && <Notice>Browser storage is unavailable. Keep this tab open to retain your answers.</Notice>}
          {incomplete && !editing ? (
            <EmptyState icon="checklist" title="Finish the previous steps first">
              <Link className="cs-button cs-button-primary" href={"/onboarding/" + incomplete.id}>Continue to {incomplete.label.toLowerCase()}</Link>
            </EmptyState>
          ) : (
            <form className="cs-setup-form" noValidate onSubmit={next}>
              {Object.keys(errors).length > 0 && <div className="cs-error-summary" tabIndex={-1} ref={formError} role="alert">
                <strong>Check the highlighted answers</strong><ul>{Object.values(errors).map((error) => <li key={error}>{error}</li>)}</ul>
              </div>}
              {step === "review" ? <Review draft={draft} /> : <StepForm step={step} draft={draft} update={updateDraft} errors={errors} />}
              <div className="cs-step-actions">
                <Link className="cs-button cs-button-secondary" href={previous}><Icon name="left" />{editing ? "Back to review" : "Back"}</Link>
                <button className="cs-button cs-button-primary" type="submit">{step === "review" ? "Continue to My Dashboard" : editing ? "Save and return to review" : "Continue"}<Icon name="right" /></button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

