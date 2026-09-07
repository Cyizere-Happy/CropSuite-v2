"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

type Anim = "fade-up" | "fade" | "zoom" | "slide-left" | "slide-right";

/**
 * Reveals content as it scrolls into view, using the keyframes in globals.css.
 *  - `anim` picks the entrance style.
 *  - `stagger` animates the element's direct children in sequence instead.
 *  - Falls back to visible without IntersectionObserver; prefers-reduced-motion
 *    is handled in CSS.
 */
export function SectionReveal({
  children,
  as: Tag = "div",
  className = "",
  anim = "fade-up",
  delay = 0,
  stagger = false,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  anim?: Anim;
  delay?: number;
  stagger?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`tp-reveal ${className}`}
      data-visible={visible ? "true" : "false"}
      data-anim={anim === "fade-up" ? undefined : anim}
      data-stagger={stagger ? "" : undefined}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
