"use client";

// TEMPORARY (dev only): renders the Open Graph card on a canvas with the site's
// Jost font and POSTs the PNG to /api/og-dev, which writes
// app/opengraph-image.png and app/twitter-image.png. Deleted after use.

import { useEffect, useState } from "react";

const MARK = [
  "M26 50c0-4 3-7 6-7s6 3 6 7",
  "M32 43V24",
  "M32 32c-9 1-15-3-18-11 9-1 15 3 18 11Z",
  "M32 26c9 1 15-3 18-11-9-1-15 3-18 11Z",
  "M12 50h40M16 57h8M30 57h8M44 57h6",
];

const GREEN_DEEP = "#2e6b32";

export default function OgDev() {
  const [status, setStatus] = useState("drawing…");

  useEffect(() => {
    (async () => {
      const family = getComputedStyle(document.body).fontFamily;
      await Promise.all([
        document.fonts.load(`900 110px ${family}`),
        document.fonts.load(`400 40px ${family}`),
        document.fonts.load(`700 28px ${family}`),
      ]);
      const W = 1200;
      const H = 630;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#f8faf8");
      g.addColorStop(1, "#dfeadd");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#bcd9b8";
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(990, 80, 290, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a9cfa5";
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(1120, 560, 240, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(84, 118);
      ctx.scale(3.4, 3.4);
      ctx.strokeStyle = GREEN_DEEP;
      ctx.lineWidth = 3.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const d of MARK) ctx.stroke(new Path2D(d));
      ctx.restore();

      ctx.fillStyle = "#0f172a";
      ctx.font = `900 110px ${family}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText("Crop", 92, 430);
      const w = ctx.measureText("Crop").width;
      ctx.fillStyle = GREEN_DEEP;
      ctx.fillText("Suite", 92 + w, 430);

      ctx.fillStyle = "#64748b";
      ctx.font = `400 40px ${family}`;
      ctx.fillText("Know what to plant. Plan what comes next.", 94, 500);

      ctx.fillStyle = GREEN_DEEP;
      ctx.font = `700 28px ${family}`;
      ctx.fillText(
        "Crop planning · Kayonza pilot, Rwanda · Maize & common beans",
        94,
        552,
      );

      const blob: Blob = await new Promise((res) =>
        canvas.toBlob((b) => res(b!), "image/png"),
      );
      const r = await fetch("/api/og-dev", { method: "POST", body: blob });
      setStatus(r.ok ? "written" : "failed " + r.status);
      document.body.appendChild(canvas);
    })();
  }, []);

  return <p id="og-status">{status}</p>;
}
