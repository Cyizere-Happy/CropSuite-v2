import { AppScreen, type ScreenName } from "@/components/app-screens/AppScreen";
import { PhoneMockup } from "@/components/device/PhoneMockup";
import { containerClass } from "@/lib/site-config";
import { SectionReveal } from "./SectionReveal";

const shots: { screen: ScreenName; label: string; caption: string }[] = [
  { screen: "dashboard", label: "Home", caption: "Pick your next action" },
  { screen: "earnings", label: "Earnings", caption: "The Global Secure Wallet" },
  { screen: "notifications", label: "Alerts", caption: "Approvals & inspections" },
];

/**
 * Three phones in a clean row — every screen fully visible — with the middle
 * one lifted and a soft green shape behind the group. On small screens it
 * becomes a snap-scroll strip so each phone still shows at full size.
 */
export function Screenshots() {
  return (
    <section id="screenshots" className="overflow-x-clip bg-bg py-16 sm:py-24">
      <div className={containerClass}>
        <SectionReveal className="mx-auto max-w-md text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-deep">
            Screenshots
          </p>
          <h2 className="mt-3 text-[1.7rem] font-black leading-tight text-ink sm:text-[2.15rem]">
            A look inside the app
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Rebuilt from the live TreePulse interface, with demo records in place
            of real data.
          </p>
        </SectionReveal>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[72%] w-[min(620px,94%)] -translate-x-1/2 -translate-y-1/2 rounded-[26%] bg-gradient-to-br from-sage to-[#d5e9d2]"
          />
          <SectionReveal
            as="ul"
            stagger
            className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] sm:justify-center sm:gap-8 sm:overflow-visible lg:gap-14"
          >
            {shots.map((shot, i) => (
              <li
                key={shot.screen}
                className={`relative flex w-[176px] flex-none snap-center flex-col items-center text-center sm:w-[188px] ${
                  i === 1 ? "sm:-top-6" : "sm:top-2"
                }`}
              >
                <PhoneMockup
                  label={`TreePulse ${shot.label} screen — ${shot.caption}`}
                  className="w-full"
                  floaty={i === 1}
                >
                  <AppScreen name={shot.screen} />
                </PhoneMockup>
                <p className="mt-4 text-sm font-extrabold text-ink">
                  {shot.label}
                </p>
                <p className="mt-0.5 text-xs text-muted">{shot.caption}</p>
              </li>
            ))}
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
