"use client";

import { useEffect, useState } from "react";
import { TreePulseLogo } from "@/components/brand/TreePulseLogo";
import { containerClass, navLinks } from "@/lib/site-config";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`tp-nav-in sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line/60 bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`${containerClass} flex items-center justify-between py-4`}
      >
        <a href="#home" onClick={() => setOpen(false)} aria-label="TreePulse — top">
          <TreePulseLogo markClassName="h-7 w-7" wordClassName="text-base" />
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-semibold text-muted transition-colors hover:text-primary-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#download"
          className="hidden rounded-full bg-primary-deep px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#437a41] md:inline-block"
        >
          Download
        </a>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line/60 bg-bg px-6 pb-6 pt-2 sm:px-12 md:hidden"
      >
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-semibold text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#download"
          onClick={() => setOpen(false)}
          className="mt-2 block rounded-full bg-primary-deep px-5 py-3 text-center text-sm font-bold text-white"
        >
          Download
        </a>
      </div>
    </header>
  );
}
