import { AppScreen, type ScreenName } from "@/components/app-screens/AppScreen";
import { PhoneMockup } from "@/components/device/PhoneMockup";
import {
  containerClass,
  features,
  type FeatureContent,
} from "@/lib/site-config";
import { AndroidDownloadButton } from "./AndroidDownloadButton";
import { DeviceShape, SectionCurve } from "./decor";
import { FeatureIcon } from "./icons";
import { SectionReveal } from "./SectionReveal";

const screenLabels: Record<string, string> = {
  farms: "CropSuite phone placeholder — the My Farm screen is in design",
  notifications: "CropSuite phone placeholder — the Next Crop screen is in design",
  earnings: "CropSuite phone placeholder — the Crop Comparison screen is in design",
};

const shapeVariants = ["a", "b", "c"] as const;

function FeatureBlock({
  feature,
  index,
}: {
  feature: FeatureContent;
  index: number;
}) {
  const phoneOnLeft = feature.media === "left";

  return (
    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
      <SectionReveal
        anim={phoneOnLeft ? "slide-right" : "slide-left"}
        className={`relative flex justify-center ${
          phoneOnLeft ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <DeviceShape
          variant={shapeVariants[index % shapeVariants.length]}
          className={`absolute top-1/2 -z-0 h-[86%] w-[132%] max-w-[340px] -translate-y-1/2 ${
            phoneOnLeft ? "right-1/2 translate-x-[38%]" : "left-1/2 -translate-x-[38%]"
          }`}
        />
        <PhoneMockup
          label={screenLabels[feature.screen] ?? feature.title}
          className="w-[182px] sm:w-[200px]"
          tilt={feature.tilt}
          floaty={!feature.tilt}
        >
          <AppScreen name={feature.screen as ScreenName} />
        </PhoneMockup>
      </SectionReveal>

      <SectionReveal
        anim={phoneOnLeft ? "slide-left" : "slide-right"}
        delay={90}
        className={`max-w-[24rem] ${phoneOnLeft ? "lg:order-2" : "lg:order-1"}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-primary-deep">
          <FeatureIcon name={feature.icon} className="h-4 w-4" />
        </span>
        <p className="mt-3.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-deep">
          {feature.eyebrow}
        </p>
        <h3 className="mt-2 text-[1.4rem] font-black leading-tight text-ink sm:text-[1.6rem]">
          {feature.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          {feature.body}
        </p>
        {feature.download && (
          <div className="mt-5">
            <AndroidDownloadButton size="md" />
          </div>
        )}
      </SectionReveal>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-x-clip bg-surface py-16 sm:py-24"
    >
      <div className={containerClass}>
        <SectionReveal className="mx-auto max-w-lg text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-deep">
            Features
          </p>
          <h2 className="mt-3 text-[1.7rem] font-black leading-tight text-ink sm:text-[2.15rem]">
            Built around the decisions farmers already make
          </h2>
        </SectionReveal>

        <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14">
          {features.map((feature, i) => (
            <FeatureBlock key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </div>

      <SectionCurve fill="var(--color-bg)" />
    </section>
  );
}
