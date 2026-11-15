"use client";

import { useState } from "react";
import Link from "next/link";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return <header className="landing-header"><nav className="landing-nav landing-wrap" aria-label="Primary navigation">
    <a href="#home" aria-label="CropSuite home" onClick={() => setOpen(false)}><CropSuiteLogo markClassName="h-9 w-9" wordClassName="text-xl" /></a>
    <div className="landing-desktop-nav"><a href="#home">Home</a><a href="#how-it-works">How it works</a><a href="#our-approach">Our approach</a><Link className="landing-nav-button" href="/onboarding/journey/farm">Get Started <span aria-hidden="true">↗</span></Link></div>
    <button className="landing-menu-button" type="button" aria-expanded={open} aria-controls="landing-mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
  </nav><div id="landing-mobile-menu" className="landing-mobile-nav" hidden={!open}><a href="#home" onClick={() => setOpen(false)}>Home</a><a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a><a href="#our-approach" onClick={() => setOpen(false)}>Our approach</a><Link href="/onboarding/journey/farm" onClick={() => setOpen(false)}>Get Started →</Link></div></header>;
}
