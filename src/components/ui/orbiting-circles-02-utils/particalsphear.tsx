"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const cx = cv.getContext("2d");
    if (!cx) return;

    const N = 950;
    const pts: [number, number, number][] = [];
    for (let k = 0; k < N; k++) {
      const y = 1 - ((k + 0.5) / N) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = k * 2.399963;
      pts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const size = () => {
      if (!cv) return;
      const d = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth || 300;
      cv.width = Math.round(w * d);
      cv.height = Math.round(w * d);
    };

    size();
    let ro: ResizeObserver | null = null;
    if (typeof window !== "undefined" && window.ResizeObserver) {
      ro = new ResizeObserver(size);
      ro.observe(cv);
    }

    let animId: number;
    const t0 = performance.now();

    const draw = (now: number) => {
      if (!cv || !cx) return;
      const W = cv.width;
      const R = W * 0.43;
      const rot = reduce ? 0.6 : ((now - t0) / 1000) * 0.28;
      const tilt = 0.38;

      cx.clearRect(0, 0, W, W);

      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x = p[0];
        const y = p[1];
        const z = p[2];

        const x1 = x * cr + z * sr;
        const z1 = -x * sr + z * cr;

        const y1 = y * ct - z1 * st;
        const z2 = y * st + z1 * ct;

        const al = 0.18 + (0.82 * (z2 + 1)) / 2;
        const s = (0.7 + (1.4 * (z2 + 1)) / 2) * (W / 420);
        const hue = (235 + (y1 + 1) * 60 + (x1 + 1) * 14) % 360;

        cx.fillStyle = `hsla(${hue.toFixed(0)},85%,56%,${al.toFixed(3)})`;
        cx.beginPath();
        cx.arc(W / 2 + x1 * R, W / 2 + y1 * R, Math.max(0.4, s), 0, Math.PI * 2);
        cx.fill();
      }

      if (!reduce) {
        animId = requestAnimationFrame(draw);
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block w-full h-full"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
