"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import captions from "@/public/intro-captions.json";
import {
  INTRO_DONE_EVENT,
  INTRO_REPLAY_EVENT,
  INTRO_SESSION_KEY,
} from "@/lib/intro-events";

/**
 * The CropSuite introduction — shown once per browser session and replayable
 * on demand from the landing page.
 *
 *  - Plays `cropsuite_seed_of_hope_50s.mp4` edge to edge on landscape screens
 *    (object-fit: cover) and letterboxed in white on portrait phones. The film's
 *    light-grey stage is lifted to pure white and its edges are feathered, so
 *    the silhouettes read like a 3D model turning on the page itself.
 *  - Starts WITH the original narration whenever the browser allows it. If the
 *    browser blocks sound autoplay, the film still starts (muted) and a single
 *    "Tap for sound" action unmutes it. If even muted autoplay is blocked, a
 *    "Play introduction" action appears.
 *  - Timed poetic lines from `public/intro-captions.json` fade in over the
 *    white negative space, with or without sound. Independent captions bar,
 *    Skip at any moment (also Esc), and a working "Continue" fallback if the
 *    file fails to load.
 *  - Remembers completion in a session cookie; `Watch our story` opens it again.
 *
 * Cue sync reads `video.currentTime` on `timeupdate`, `seeked` and a
 * requestAnimationFrame loop while playing, so the text stays accurate through
 * buffering, pausing and seeking.
 *
 * The landing page underneath is untouched: an attribute on <html> simply
 * holds its on-load entrance animations until the introduction leaves.
 */

type Cue = (typeof captions.cues)[number];
type Phase = "active" | "leaving" | "idle";

type Stage = {
  /** Rendered video rectangle (may extend past the viewport in cover mode). */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Viewport size. */
  vw: number;
  vh: number;
  /** Landscape: fill the screen. Portrait: letterbox + words in the top band. */
  fit: "cover" | "contain";
  band: boolean;
};

const ASPECT = 16 / 9;
const LEAVE_MS = 700;
const cues: Cue[] = captions.cues;
const HIDE_AFTER = captions.hideCaptionsAfter ?? Number.POSITIVE_INFINITY;

const pill =
  "inline-flex items-center gap-2 rounded-full border border-line bg-surface/85 px-4 py-2.5 text-[13px] font-bold text-ink shadow-soft backdrop-blur transition-colors hover:border-primary-deep hover:text-primary-deep";
const solid =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-deep px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_-12px_rgba(46,107,50,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#244f27]";

function setHtmlState(value: "active" | "leaving" | null) {
  const el = document.documentElement;
  if (value) el.setAttribute("data-intro", value);
  else el.removeAttribute("data-intro");
}

function markSeen() {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${INTRO_SESSION_KEY}=1; Path=/; SameSite=Lax${secure}`;
  } catch { /* Storage fallback below. */ }
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    /* Private mode may prevent both storage mechanisms. */
  }
}

function hasSeen(): boolean {
  let cookieSeen = false;
  try {
    cookieSeen = document.cookie.split(";").some((item) => item.trim() === `${INTRO_SESSION_KEY}=1`);
  } catch { /* Continue with the storage fallback. */ }
  try { return cookieSeen || sessionStorage.getItem(INTRO_SESSION_KEY) === "1"; }
  catch { return cookieSeen; }
}
const subscribeNoop = () => () => {};
const serverSeen = () => false;

function cueAt(t: number): Cue | null {
  if (t >= HIDE_AFTER) return null;
  for (const cue of cues) if (t >= cue.start && t < cue.end) return cue;
  return null;
}

export function IntroGate({
  videoSrc,
  posterSrc,
}: {
  videoSrc: string;
  posterSrc: string;
}) {
  const seenThisSession = useSyncExternalStore(subscribeNoop, hasSeen, serverSeen);
  const [replays, setReplays] = useState(0);
  const [phase, setPhase] = useState<Phase>("active");
  const started = !seenThisSession || replays > 0 || phase === "leaving";
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  /** Browser blocked sound autoplay → playing muted, offer one tap for sound. */
  const [soundPrompt, setSoundPrompt] = useState(false);
  /** Browser blocked all autoplay → offer an explicit play action. */
  const [needsTap, setNeedsTap] = useState(false);
  const [failed, setFailed] = useState(false);
  const [download, setDownload] = useState<{ replay: number; attempt: number; url: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const videoReady = download?.replay === replays && download.attempt === attempt;

  /* ------------------------------------------------ show / hide decisions -- */

  useEffect(() => {
    // Returning visitor: make sure nothing holds the page.
    if (!started) setHtmlState(null);
  }, [started]);

  useEffect(() => {
    const onReplay = () => {
      if (leaveTimer.current) {
        window.clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      setFailed(false);
      setNeedsTap(false);
      setSoundPrompt(false);
      setMuted(false);
      setActiveId(null);
      setPhase("active");
      setHtmlState("active");
      setReplays((r) => r + 1);
    };
    window.addEventListener(INTRO_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, onReplay);
  }, []);

  const finish = useCallback(() => {
    if (leaveTimer.current) return; // already leaving
    markSeen();
    videoRef.current?.pause();
    setPhase("leaving");
    // The landing page's entrance animations start now, under the cross-fade.
    setHtmlState("leaving");
    window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null;
      setPhase("idle");
      setHtmlState(null);
    }, LEAVE_MS);
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  /* ---------------------------------------------------------- playback -- */

  useEffect(() => {
    if (!started || phase !== "active" || (replays === 0 && hasSeen())) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;

    async function loadVideo() {
      try {
        const response = await fetch(videoSrc, { signal: controller.signal });
        if (!response.ok) throw new Error("Video download failed");
        const video = await response.blob();
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(video);
        setDownload({ replay: replays, attempt, url: objectUrl });
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }

    void loadVideo();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [started, phase, replays, attempt, videoSrc]);

  useEffect(() => {
    if (!started || phase !== "active" || (replays === 0 && hasSeen())) return;
    setHtmlState("active");
    skipRef.current?.focus({ preventScroll: true });
  }, [started, phase, replays]);

  useEffect(() => {
    if (!started || phase !== "active" || !videoReady || failed) return;
    const video = videoRef.current;
    if (!video) return;

    if (replays > 0) {
      try {
        video.currentTime = 0;
      } catch {
        /* not seekable yet */
      }
    }

    let cancelled = false;
    const tryPlay = async () => {
      // 1) With the narration, as requested.
      video.muted = false;
      try {
        await video.play();
        if (!cancelled) {
          setMuted(false);
          setSoundPrompt(false);
          setNeedsTap(false);
        }
        return;
      } catch {
        /* sound autoplay blocked — fall through */
      }
      if (cancelled) return;
      // 2) Keep the film moving, offer one tap for sound.
      video.muted = true;
      try {
        await video.play();
        if (!cancelled) {
          setMuted(true);
          setSoundPrompt(true);
          setNeedsTap(false);
        }
      } catch {
        // 3) Nothing may autoplay here — ask for a tap.
        if (!cancelled) setNeedsTap(true);
      }
    };
    void tryPlay();
    return () => {
      cancelled = true;
    };
  }, [started, replays, phase, videoReady, failed]);

  useEffect(() => {
    if (!started || phase !== "active") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [started, phase, finish]);

  const syncTime = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    const id = cueAt(t)?.id ?? null;
    setActiveId((prev) => (prev === id ? prev : id));
    const bar = progressRef.current;
    if (bar && video.duration > 0) {
      bar.style.transform = `scaleX(${Math.min(1, t / video.duration)})`;
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();
    const tick = () => {
      syncTime();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop, syncTime]);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video
      .play()
      .then(() => {
        setMuted(false);
        setSoundPrompt(false);
        setNeedsTap(false);
      })
      .catch(() => setNeedsTap(true));
  };

  const setSound = (on: boolean) => {
    const video = videoRef.current;
    setMuted(!on);
    setSoundPrompt(false);
    if (video) {
      video.muted = !on;
      if (video.paused && !failed && !needsTap) {
        video.play().catch(() => setNeedsTap(true));
      }
    }
  };

  /* --------------------------------------------- video rectangle (16:9) -- */

  useEffect(() => {
    if (!started || phase === "idle") return;
    const node = rootRef.current;
    if (!node) return;

    const measure = () => {
      const vw = node.clientWidth;
      const vh = node.clientHeight;
      if (!vw || !vh) return;
      const landscape = vw / vh >= 1.25;
      if (landscape) {
        // Fill the screen; the overflow is only the film's white stage.
        const width = Math.max(vw, vh * ASPECT);
        const height = width / ASPECT;
        setStage({
          left: (vw - width) / 2,
          top: (vh - height) / 2,
          width,
          height,
          vw,
          vh,
          fit: "cover",
          band: false,
        });
      } else {
        const width = Math.min(vw, vh * ASPECT);
        const height = width / ASPECT;
        const top = (vh - height) / 2;
        setStage({
          left: (vw - width) / 2,
          top,
          width,
          height,
          vw,
          vh,
          fit: "contain",
          band: top >= 96,
        });
      }
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [started, phase]);

  if (!started || phase === "idle") return null;

  const activeCue = activeId ? cues.find((c) => c.id === activeId) ?? null : null;
  const showPoetry = !failed;
  const leaving = phase === "leaving";

  return (
    <div
      ref={rootRef}
      className="cs-intro font-sans"
      data-leaving={leaving ? "true" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="CropSuite introduction — A Seed of Hope"
    >
      <video
        ref={videoRef}
        className="cs-intro-video"
        data-fit={stage?.fit ?? "cover"}
        src={videoReady ? download.url : undefined}
        poster={posterSrc}
        playsInline
        preload="auto"
        onPlay={startLoop}
        onPlaying={startLoop}
        onPause={stopLoop}
        onEnded={() => {
          stopLoop();
          finish();
        }}
        onTimeUpdate={syncTime}
        onSeeked={syncTime}
        onLoadedMetadata={syncTime}
        onError={() => {
          stopLoop();
          setFailed(true);
        }}
      />
      {/* Feathers the film's edges into the page white. */}
      <div className="cs-intro-feather" aria-hidden="true" />

      {!videoReady && !failed && phase === "active" && (
        <div className="cs-intro-loading" role="status" aria-live="polite">
          <span className="cs-intro-loading-icon" aria-hidden="true" />
          <p>Loading your introduction…</p>
          <span>Please wait while the video loads.</span>
        </div>
      )}

      {/* Poetic lines in the film's white negative space. */}
      {stage && (
        <div className="pointer-events-none absolute inset-0" aria-hidden={!showPoetry}>
          {cues.map((cue) => (
            <CueLine
              key={cue.id}
              cue={cue}
              stage={stage}
              active={showPoetry && activeId === cue.id}
            />
          ))}
        </div>
      )}

      {/* Accessible captions bar (independent of the sound state). */}
      {captionsOn && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[78px] flex justify-center px-5 sm:bottom-[88px]"
          aria-live="polite"
        >
          <p
            className={`max-w-[42rem] rounded-2xl border border-line bg-surface/95 px-4 py-2 text-center text-sm font-semibold leading-snug text-ink shadow-soft transition-opacity duration-200 sm:text-base ${
              activeCue ? "opacity-100" : "opacity-0"
            }`}
          >
            {activeCue?.text ?? " "}
          </p>
        </div>
      )}

      {/* Sound autoplay blocked → one tap brings the narration in. */}
      {soundPrompt && !needsTap && !failed && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[78px] flex justify-center px-5 sm:bottom-[96px]">
          <button
            type="button"
            onClick={() => setSound(true)}
            className={`${solid} pointer-events-auto`}
          >
            <SoundIcon on />
            Tap for sound
          </button>
        </div>
      )}

      {/* All autoplay blocked → explicit play action. */}
      {needsTap && !failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button type="button" onClick={handlePlayClick} className={solid}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play introduction
          </button>
        </div>
      )}

      {/* Video failed → never block the website. */}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-sm rounded-2xl border border-line bg-surface p-5 text-center shadow-soft">
            <p className="text-base font-extrabold text-ink">
              The introduction could not be loaded.
            </p>
            <p className="mt-1 text-sm text-muted">
              You can continue straight to CropSuite.
            </p>
            <button
              type="button"
              onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}
              className="mt-4 inline-flex items-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-bold text-ink"
            >
              Try again
            </button>{" "}
            <button
              type="button"
              onClick={finish}
              className="mt-4 inline-flex items-center rounded-full bg-primary-deep px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#244f27]"
            >
              Continue to CropSuite
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-4 sm:px-8 sm:pb-7">
        <button ref={skipRef} type="button" onClick={finish} className={pill}>
          Skip introduction
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 5l9 7-9 7V5zM17 5v14" />
          </svg>
        </button>

        {videoReady && !failed && <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCaptionsOn((v) => !v)}
            aria-pressed={captionsOn}
            aria-label={captionsOn ? "Hide captions" : "Show captions"}
            className={`${pill} ${captionsOn ? "border-primary-deep text-primary-deep" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M10.5 10.2a2 2 0 1 0 0 3.6M17 10.2a2 2 0 1 0 0 3.6" />
            </svg>
            <span className="hidden sm:inline">Captions</span>
          </button>

          <button
            type="button"
            onClick={() => setSound(muted)}
            aria-pressed={!muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className={pill}
          >
            <SoundIcon on={muted} />
            {muted ? "Sound on" : "Sound off"}
          </button>
        </div>}
      </div>

      <div ref={progressRef} className="cs-progress" aria-hidden="true" />
    </div>
  );
}

/** Speaker glyph: `on` = the action turns sound on; otherwise shows it is on. */
function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      {on ? (
        <path d="m22 9-6 6M16 9l6 6" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- cues -- */

function CueLine({
  cue,
  stage,
  active,
}: {
  cue: Cue;
  stage: Stage;
  active: boolean;
}) {
  const alignRight = cue.align === "right";

  if (stage.band) {
    // Portrait: the film is a 16:9 strip in the middle; the words live in the
    // white band above it — same white, same negative space, readable size.
    const fontSize = Math.max(17, Math.min(26, stage.vw * 0.05));
    return (
      <div
        className="absolute left-0 right-0 flex items-center px-[7%]"
        style={{
          top: 0,
          height: stage.top,
          justifyContent: alignRight ? "flex-end" : "flex-start",
        }}
      >
        <p
          className="cs-cue"
          data-active={active ? "true" : "false"}
          style={{
            fontSize,
            textAlign: alignRight ? "right" : "left",
            maxWidth: "min(34ch, 86%)",
          }}
        >
          {cue.text}
        </p>
      </div>
    );
  }

  // Landscape: anchor the line at the cue's editorial position inside the real
  // video rectangle (upper-right early, upper-left once the CropSuite panel
  // appears), never over the farmer. In cover mode the rectangle can extend
  // past the viewport, so anchors are kept inside a safe margin.
  const margin = Math.max(20, stage.vw * 0.05);
  const fontSize = Math.max(15, Math.min(34, stage.width * 0.024));
  const anchorX = stage.left + (cue.xPercent / 100) * stage.width;
  const horizontal = alignRight
    ? { right: Math.max(margin, stage.vw - anchorX) }
    : { left: Math.max(margin, anchorX) };
  const top = Math.max(margin, stage.top + (cue.yPercent / 100) * stage.height);
  return (
    <div
      className="absolute"
      style={{ top, maxWidth: Math.min(stage.width, stage.vw) * 0.4, ...horizontal }}
    >
      <p
        className="cs-cue"
        data-active={active ? "true" : "false"}
        style={{ fontSize, textAlign: alignRight ? "right" : "left" }}
      >
        {cue.text}
      </p>
    </div>
  );
}
