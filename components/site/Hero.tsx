import { AppScreen } from "@/components/app-screens/AppScreen";
import { PhoneMockup } from "@/components/device/PhoneMockup";
import { ScreenIcon } from "@/components/app-screens/parts";
import { apkFacts } from "@/lib/apk";
import { containerClass } from "@/lib/site-config";
import { AndroidDownloadButton } from "./AndroidDownloadButton";
import { CountUp } from "./CountUp";
import { SectionCurve } from "./decor";

export function Hero() {
  const facts = apkFacts();

  return (
    <section
      id="home"
      className="relative overflow-x-clip pb-16 pt-6 sm:pb-24 sm:pt-10"
    >
      <div
        className={`${containerClass} grid items-center gap-10 lg:grid-cols-2 lg:gap-12`}
      >
        <div className="max-w-[26rem]">
          <span
            className="tp-hero-item inline-flex items-center gap-2 rounded-full border border-primary-deep/20 bg-surface/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-deep backdrop-blur"
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            <ScreenIcon name="leaf" className="h-3.5 w-3.5" />
            Android field app
          </span>

          <h1 className="mt-5 text-[2.15rem] font-black leading-[1.08] tracking-tight text-ink sm:text-[2.9rem]">
            <span
              className="tp-hero-mask"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              <span>Map your farm.</span>
            </span>
            <span
              className="tp-hero-mask"
              style={{ "--d": "300ms" } as React.CSSProperties}
            >
              <span>Track every tree.</span>
            </span>
          </h1>

          <p
            className="tp-hero-item mt-4 text-[15px] leading-relaxed text-muted sm:text-base"
            style={{ "--d": "480ms" } as React.CSSProperties}
          >
            The Android app that helps tree-planting farmers in Rwanda map plots,
            monitor trees, and track what each verified tree earns.
          </p>

          <div
            className="tp-hero-item mt-7 flex flex-wrap items-center gap-3"
            style={{ "--d": "600ms" } as React.CSSProperties}
          >
            <AndroidDownloadButton size="md" />
            <a
              href="#features"
              className="inline-flex items-center rounded-full border border-line bg-surface/80 px-5 py-3 text-sm font-bold text-ink backdrop-blur transition-colors hover:border-primary-deep hover:text-primary-deep"
            >
              See features
            </a>
          </div>

          <p
            className="tp-hero-item mt-6 flex flex-wrap gap-x-2 text-xs font-semibold text-muted"
            style={{ "--d": "720ms" } as React.CSSProperties}
          >
            {facts.map((f, i) => (
              <span key={f.label} className="whitespace-nowrap">
                {i > 0 && <span className="mr-2 text-line">·</span>}
                {f.value}
              </span>
            ))}
          </p>
        </div>

        <div className="tp-hero-phone relative mx-auto w-[210px] sm:w-[248px]">
          <PhoneMockup
            label="TreePulse home screen — 'What would you like to do today?' with farm registration, tree registration, and earnings"
            className="w-full"
            floaty
          >
            <AppScreen name="dashboard" />
          </PhoneMockup>

          <div className="tp-float-soft absolute -left-6 bottom-8 w-[148px] rounded-2xl border border-line bg-surface p-3.5 shadow-soft sm:-left-16 sm:bottom-10 sm:w-[168px]">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-muted">
              <ScreenIcon name="wallet" className="h-3 w-3 text-primary-deep" />
              Secure Wallet
            </p>
            <p className="mt-1 text-base font-black text-ink sm:text-lg">
              <CountUp value={184500} suffix=" RWF" />
            </p>
            <p className="mt-1.5 text-[10px] font-semibold text-muted">
              <span className="text-primary-deep">37</span> approved ·{" "}
              <span className="text-amber">12</span> pending
            </p>
          </div>
        </div>
      </div>

      <SectionCurve fill="var(--color-bg)" />
    </section>
  );
}
