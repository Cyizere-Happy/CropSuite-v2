import { AppScreen } from "@/components/app-screens/AppScreen";
import Link from "next/link";
import { PhoneMockup } from "@/components/device/PhoneMockup";
import { ScreenIcon } from "@/components/app-screens/parts";
import { apk, apkFacts } from "@/lib/apk";
import { containerClass, pilotFacts } from "@/lib/site-config";
import { QrCode } from "./QrCode";
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
            Starting in Kayonza, Rwanda
          </span>

          <h1 className="mt-5 text-[2.15rem] font-black leading-[1.08] tracking-tight text-ink sm:text-[2.9rem]">
            <span
              className="tp-hero-mask"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              <span>Your land knows a story.</span>
            </span>
            <span
              className="tp-hero-mask"
              style={{ "--d": "300ms" } as React.CSSProperties}
            >
              <span>Let’s understand what comes next.</span>
            </span>
          </h1>

          <p
            className="tp-hero-item mt-4 text-[15px] leading-relaxed text-muted sm:text-base"
            style={{ "--d": "480ms" } as React.CSSProperties}
          >
            Every farmer faces different decisions. CropSuite begins with what you know about your field and the crops you want to grow, and explores how NASA Earth data could inform your next planting season.
          </p>

          <div
            className="tp-hero-item mt-7 flex flex-wrap items-center gap-3"
            style={{ "--d": "600ms" } as React.CSSProperties}
          >
            <Link
              href="/onboarding/journey/farm"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-deep px-5 py-3 text-sm font-bold text-white shadow-[0_16px_30px_-12px_rgba(46,107,50,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#244f27]"
            >
              <ScreenIcon name="leaf" className="h-5 w-5" />
              Explore My Farm
            </Link>
            <a
              href="#overview"
              className="inline-flex items-center rounded-full border border-line bg-surface/80 px-5 py-3 text-sm font-bold text-ink backdrop-blur transition-colors hover:border-primary-deep hover:text-primary-deep"
            >
              See How It Works
            </a>
          </div>

          {apk.url ? (
            <div
              className="tp-hero-item mt-6 flex items-center gap-4 rounded-2xl border border-line bg-surface/80 p-3 backdrop-blur"
              style={{ "--d": "720ms" } as React.CSSProperties}
            >
              <QrCode
                value={apk.url}
                label="QR code — scan with an Android camera to download the CropSuite APK"
                className="h-[90px] w-[90px] flex-none rounded-lg bg-white p-1.5 [&>svg]:h-full [&>svg]:w-full sm:h-[104px] sm:w-[104px]"
              />
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">Scan to install</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">
                  Point your Android camera at the code
                </p>
                <p className="mt-1.5 flex flex-wrap gap-x-1.5 text-[11px] font-semibold text-muted">
                  {facts.map((f, i) => (
                    <span key={f.label} className="whitespace-nowrap">
                      {i > 0 && <span className="mr-1.5 text-line">·</span>}
                      {f.value}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ) : (
            <p
              className="tp-hero-item mt-6 flex flex-wrap gap-x-2 text-xs font-semibold text-muted"
              style={{ "--d": "720ms" } as React.CSSProperties}
            >
              {pilotFacts.map((fact, i) => (
                <span key={fact} className="whitespace-nowrap">
                  {i > 0 && <span className="mr-2 text-line">·</span>}
                  {fact}
                </span>
              ))}
            </p>
          )}
          <p className="tp-hero-item mt-4 text-xs leading-relaxed text-muted" style={{ "--d": "800ms" } as React.CSSProperties}>A NASA Space Apps Challenge 2026 project exploring crop rotation with Earth data.</p>
        </div>

        <div className="tp-hero-phone relative mx-auto w-[210px] sm:w-[248px]">
          <PhoneMockup
            label="CropSuite demo farm with a real map of the Kayonza area and maize and beans selected"
            className="w-full"
            floaty
          >
            <AppScreen name="dashboard" />
          </PhoneMockup>
          <p className="mt-3 text-center text-xs font-semibold text-muted">Illustrative demo</p>

          <div className="tp-float-soft absolute -left-6 bottom-8 w-[148px] rounded-2xl border border-line bg-surface p-3.5 shadow-soft sm:-left-16 sm:bottom-10 sm:w-[168px]">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-muted">
              <ScreenIcon name="map-pin" className="h-3 w-3 text-primary-deep" />
              Kayonza pilot
            </p>
            <p className="mt-1 text-base font-black text-ink sm:text-lg">
              Maize &amp; beans
            </p>
            <p className="mt-1.5 text-[10px] font-semibold text-muted">
              <span className="text-primary-deep">Compare</span> · plan ·{" "}
              <span className="text-amber">rotate</span>
            </p>
          </div>
        </div>
      </div>

      <SectionCurve fill="var(--color-bg)" />
    </section>
  );
}
