import type { ReactNode } from "react";

/**
 * Reusable CSS phone case. The screenshot (children) is the central content —
 * fitted inside a rounded display, wrapped by a thin black bezel, a brushed
 * metal edge, a camera bar, side buttons and a soft shadow.
 *
 * Sizing is width-driven (via `className`, e.g. `w-[240px]`). The display is a
 * container-query context, so the screen components size their type and spacing
 * in `cqi` units and stay perfectly proportioned from 200 px to desktop — no
 * distortion, no awkward text wrapping.
 */
export function PhoneMockup({
  children,
  label,
  className = "w-[240px]",
  tilt = false,
  floaty = false,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  tilt?: boolean;
  floaty?: boolean;
}) {
  return (
    <figure className={`relative ${className} ${floaty ? "tp-float" : ""}`}>
      <div
        className={
          tilt
            ? "[transform:perspective(2000px)_rotateY(-15deg)_rotateX(6deg)_rotateZ(1deg)] [transform-style:preserve-3d] max-[767px]:[transform:none]"
            : ""
        }
      >
        <div
          className="relative aspect-[9/19.3] w-full rounded-[13.5%/6.4%] p-[3%] shadow-phone"
          style={{
            background:
              "linear-gradient(135deg,#e4e7eb 0%,#aab1b9 24%,#f0f2f4 50%,#9ba2aa 76%,#e4e7eb 100%)",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[11.5%/5.6%] bg-[#0a0d12] p-[2.4%]">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[9.4%/4.7%] bg-[#0a0d12] [container-type:inline-size]">
              <div aria-hidden="true" className="flex h-[5%] shrink-0 items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#303941]" />
              </div>
              <div className="min-h-0 flex-1 px-[2%] pb-[3%]">
                {children}
              </div>

              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(118deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0) 30%,rgba(255,255,255,0) 72%,rgba(255,255,255,0.05) 100%)",
                }}
              />
            </div>
          </div>

          <span className="absolute -left-[1.5%] top-[19%] h-[6%] w-[1.8%] rounded-l-sm bg-[#868d96]" />
          <span className="absolute -left-[1.5%] top-[29%] h-[10%] w-[1.8%] rounded-l-sm bg-[#868d96]" />
          <span className="absolute -left-[1.5%] top-[42%] h-[10%] w-[1.8%] rounded-l-sm bg-[#868d96]" />
          <span className="absolute -right-[1.5%] top-[34%] h-[14%] w-[1.8%] rounded-r-sm bg-[#868d96]" />
        </div>
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
