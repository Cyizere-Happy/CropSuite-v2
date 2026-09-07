import { containerClass, overviewCards, siteConfig } from "@/lib/site-config";
import { FeatureIcon } from "./icons";
import { OverviewShape, SectionCurve } from "./decor";
import { SectionReveal } from "./SectionReveal";

export function Overview() {
  return (
    <section
      id="overview"
      className="relative overflow-x-clip bg-bg py-16 sm:py-24"
    >
      <div
        className={`${containerClass} grid items-center gap-12 lg:grid-cols-2 lg:gap-14`}
      >
        <div className="relative order-2 lg:order-1">
          <OverviewShape className="absolute left-1/2 top-1/2 -z-0 h-[116%] w-[112%] -translate-x-1/2 -translate-y-1/2" />
          <SectionReveal
            stagger
            className="relative grid grid-cols-2 gap-3 sm:gap-4"
          >
            {overviewCards.map((card) => (
              <article
                key={card.title}
                className="h-full rounded-2xl border border-line/70 bg-surface p-3.5 shadow-soft sm:p-4"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage text-primary-deep">
                  <FeatureIcon name={card.icon} className="h-4 w-4" />
                </span>
                <p className="mt-2.5 text-[13px] font-extrabold text-ink">
                  {card.title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  {card.body}
                </p>
              </article>
            ))}
          </SectionReveal>
        </div>

        <SectionReveal
          anim="slide-left"
          className="order-1 max-w-[24rem] lg:order-2"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-deep">
            Overview
          </p>
          <h2 className="mt-3 text-[1.7rem] font-black leading-tight text-ink sm:text-[2.15rem]">
            One field app, the whole planting cycle
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Register a plot, capture every tree, return for the 3-month
            inspection, and follow each record through to payout. Data syncs to
            the backend; recent screens stay readable offline.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {siteConfig.languages.map((lang) => (
              <li
                key={lang}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted"
              >
                {lang}
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>

      <SectionCurve fill="var(--color-surface)" />
    </section>
  );
}
