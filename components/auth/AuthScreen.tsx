"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { Icon } from "@/components/farmer/Icon";
import { authentication, type AuthRequest } from "@/lib/farmer/auth";
import { startDemo } from "@/lib/farmer/store";
import { GoogleSignInButton } from "./GoogleSignInButton";

const copy = {
  "sign-in": { title: "Welcome to CropSuite", description: "Sign in to pick up your farm plan.", button: "Sign in" },
  "sign-up": { title: "Create your account", description: "Start planning your next planting season.", button: "Create account" },
  reset: { title: "Forgot your password?", description: "Enter the email address you use for CropSuite.", button: "Request password reset" },
};

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" | "reset" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const current = copy[mode];

  async function request(input: AuthRequest) {
    setPending(true);
    try {
      const result = await authentication.request(input);
      setMessage(result.message);
    } catch {
      setMessage("Authentication is unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    void request(mode === "reset" ? { action: "reset", email } : { action: mode, email, password: String(form.get("password")) });
  }

  return (
    <main className="cs-farmer cs-auth">
      <div className="cs-auth-image">
        <Link href="/" aria-label="CropSuite home" className="cs-auth-brand"><CropSuiteLogo /></Link>
        <div className="cs-auth-image-copy"><Icon name="sprout" /><p>Plan what comes next.</p></div>
      </div>
      <div className="cs-auth-content">
        <Link href="/" className="cs-text-link cs-auth-back"><Icon name="left" /> Back to CropSuite</Link>
        <section className="cs-auth-form" aria-labelledby="auth-title">
          <h1 id="auth-title">{current.title}</h1>
          <p>{current.description}</p>
          {mode !== "reset" && <><GoogleSignInButton disabled={pending} onClick={() => void request({ action: "google" })} /><div className="cs-auth-divider">or use email</div></>}
          <form onSubmit={submit}>
            <label htmlFor="email">Email address</label>
            <input required id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            {mode !== "reset" && <>
              <div className="cs-auth-label"><label htmlFor="password">Password</label>{mode === "sign-in" && <Link href="/forgot-password">Forgot password?</Link>}</div>
              <input required id="password" name="password" type="password" minLength={mode === "sign-up" ? 8 : undefined} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} />
            </>}
            <button className="cs-button cs-button-primary" disabled={pending}>{current.button}</button>
          </form>
          {message && <p className="cs-auth-status" role="status">{message}</p>}
          <div className="cs-auth-demo">
            <button className="cs-button cs-button-secondary" type="button" onClick={() => { startDemo(); router.push("/onboarding/crops"); }}>
              Continue in Demo Mode <Icon name="right" />
            </button>
            <p>Your demo plan is saved in this browser.</p>
          </div>
          <div className="cs-auth-switch">
            {mode === "sign-in" ? <>New to CropSuite? <Link href="/signup">Create an account</Link></> : <Link href="/login">Back to sign in</Link>}
          </div>
        </section>
      </div>
    </main>
  );
}

