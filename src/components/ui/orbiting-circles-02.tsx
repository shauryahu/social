"use client";

import React, { useMemo } from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

interface OrbitItem {
  alt: string;
  src: string;
  angle: number;
}

interface OrbitConfig {
  cls: string;
  duration: number;
  direction: "cw" | "ccw";
  icons: OrbitItem[];
}

// 7 official platform logos across 3 concentric orbits
// Strategically distributed by circumference:
// - Inner orbit (r1): 2 platforms (Instagram, WhatsApp) spaced 90°
// - Middle orbit (r2): 2 platforms (Facebook, TikTok) counter-rotating (CCW) spaced 90°
// - Outer orbit (r3): 3 platforms (X, YouTube, OnlyFans) spaced 60°
// Initial angles ensure all 7 platforms are visible across the upper sky without clustering
const BASE_ORBITS: OrbitConfig[] = [
  {
    cls: "r1",
    duration: 22,
    direction: "cw",
    icons: [
      { alt: "Instagram", src: "/assets/logos/instagram.png", angle: -45 },
      { alt: "WhatsApp", src: "/assets/logos/whatsapp.png", angle: 45 },
    ],
  },
  {
    cls: "r2",
    duration: 28,
    direction: "ccw",
    icons: [
      { alt: "Facebook", src: "/assets/logos/facebook.png", angle: 0 },
      { alt: "TikTok", src: "/assets/logos/tiktok.png", angle: -90 },
    ],
  },
  {
    cls: "r3",
    duration: 34,
    direction: "cw",
    icons: [
      { alt: "X", src: "/assets/logos/x.png", angle: -85 },
      { alt: "YouTube", src: "/assets/logos/youtube.png", angle: -25 },
      { alt: "OnlyFans", src: "/assets/logos/onlyfans.png", angle: 35 },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
  // Populate continuous orbital tracks with mirror pairs (angle + 180)
  // so platforms continuously cycle without dead gaps
  const orbits = useMemo(() => {
    return BASE_ORBITS.map((orbit) => {
      const mirrors: OrbitItem[] = orbit.icons.map((ic) => ({
        alt: `${ic.alt}`,
        src: ic.src,
        angle: ic.angle + 180,
      }));
      return {
        ...orbit,
        icons: [...orbit.icons, ...mirrors],
      };
    });
  }, []);

  return (
    <div className="orbiting-globe-stage relative w-full overflow-hidden flex justify-center items-end">
      <style>{`
        .orbiting-globe-stage {
          --chip: 2.75rem;
          --orbit-stroke: rgba(148, 163, 184, 0.35);
          --chip-bg: rgba(255, 255, 255, 0.95);
          --chip-border: rgba(226, 232, 240, 0.95);
          --chip-shadow: 0 8px 22px -6px rgba(70, 60, 190, 0.35), 0 2px 6px rgba(0, 0, 0, 0.05);
          --chip-hover-shadow: 0 14px 30px -6px rgba(99, 102, 241, 0.55);

          height: 20.5rem;
          min-height: 20.5rem;
        }

        :root[data-theme="dark"] .orbiting-globe-stage,
        .dark .orbiting-globe-stage {
          --orbit-stroke: rgba(255, 255, 255, 0.16);
          --chip-bg: rgba(20, 24, 38, 0.92);
          --chip-border: rgba(255, 255, 255, 0.14);
          --chip-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.65);
          --chip-hover-shadow: 0 14px 32px -4px rgba(56, 189, 248, 0.45);
        }

        @media (min-width: 640px) {
          .orbiting-globe-stage {
            --chip: 3.0rem;
            height: 23.5rem;
            min-height: 23.5rem;
          }
        }

        @media (min-width: 1024px) {
          .orbiting-globe-stage {
            --chip: 3.35rem;
            height: 26.5rem;
            min-height: 26.5rem;
          }
        }

        /* Original Hemisphere with subtle edge-only feathering at bottom, left, and right */
        .og-globe {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          aspect-ratio: 1/1;
          pointer-events: none;
          width: 17rem;
          height: 17rem;
          z-index: 10;
          /* Edge-only feathering: center 100% sharp; outermost perimeter and bottom horizon dissolve softly */
          -webkit-mask-image: 
            radial-gradient(circle at 50% 50%, black 0%, black 76%, rgba(0,0,0,0.82) 84%, rgba(0,0,0,0.35) 91%, transparent 96%),
            linear-gradient(to bottom, black 0%, black 43%, rgba(0,0,0,0.7) 46%, rgba(0,0,0,0.2) 48.5%, transparent 50%);
          mask-image: 
            radial-gradient(circle at 50% 50%, black 0%, black 76%, rgba(0,0,0,0.82) 84%, rgba(0,0,0,0.35) 91%, transparent 96%),
            linear-gradient(to bottom, black 0%, black 43%, rgba(0,0,0,0.7) 46%, rgba(0,0,0,0.2) 48.5%, transparent 50%);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
        }

        @media (min-width: 640px) {
          .og-globe {
            width: 20rem;
            height: 20rem;
          }
        }

        @media (min-width: 1024px) {
          .og-globe {
            width: 22.5rem;
            height: 22.5rem;
          }
        }

        /* Seamless Orbit Lines with feathered atmospheric mask */
        .og-paths-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 8;
          -webkit-mask-image: 
            linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 4%, rgba(0,0,0,0.7) 14%, black 28%, black 100%),
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 4%, black 12%, black 88%, rgba(0,0,0,0.4) 96%, transparent 100%);
          mask-image: 
            linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 4%, rgba(0,0,0,0.7) 14%, black 28%, black 100%),
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 4%, black 12%, black 88%, rgba(0,0,0,0.4) 96%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
        }

        .og-ring-path {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          border-radius: 9999px;
          border: 1.5px solid var(--orbit-stroke);
          box-sizing: border-box;
          pointer-events: none;
        }

        /* Mobile Dimensions (Strictly collision-free: ΔR = 3.25rem > chip 2.75rem) */
        .og-ring-path.r1 { width: 21rem; height: 21rem; }
        .og-ring-path.r2 { width: 27.5rem; height: 27.5rem; }
        .og-ring-path.r3 { width: 34rem; height: 34rem; }

        @media (min-width: 640px) {
          .og-ring-path.r1 { width: 24.5rem; height: 24.5rem; }
          .og-ring-path.r2 { width: 31.7rem; height: 31.7rem; }
          .og-ring-path.r3 { width: 38.9rem; height: 38.9rem; }
        }

        @media (min-width: 1024px) {
          .og-ring-path.r1 { width: 27.6rem; height: 27.6rem; }
          .og-ring-path.r2 { width: 35.6rem; height: 35.6rem; }
          .og-ring-path.r3 { width: 43.6rem; height: 43.6rem; }
        }

        /* Orbiting Platform Logos with Horizon Entrance & Exit mask */
        .og-chips-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 20;
          -webkit-mask-image: 
            linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 4%, rgba(0,0,0,0.85) 16%, black 28%, black 100%),
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 3%, black 10%, black 90%, rgba(0,0,0,0.3) 97%, transparent 100%);
          mask-image: 
            linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 4%, rgba(0,0,0,0.85) 16%, black 28%, black 100%),
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 3%, black 10%, black 90%, rgba(0,0,0,0.3) 97%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
        }

        .og-rotator {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          border-radius: 9999px;
          pointer-events: none;
        }

        /* Mobile Dimensions (Strictly collision-free: ΔR = 3.25rem > chip 2.75rem) */
        .og-rotator.r1 { width: 21rem; height: 21rem; }
        .og-rotator.r2 { width: 27.5rem; height: 27.5rem; }
        .og-rotator.r3 { width: 34rem; height: 34rem; }

        @media (min-width: 640px) {
          /* Tablet Dimensions (ΔR = 3.6rem > chip 3.0rem) */
          .og-rotator.r1 { width: 24.5rem; height: 24.5rem; }
          .og-rotator.r2 { width: 31.7rem; height: 31.7rem; }
          .og-rotator.r3 { width: 38.9rem; height: 38.9rem; }
        }

        @media (min-width: 1024px) {
          /* Desktop Dimensions (ΔR = 4.0rem > chip 3.35rem) */
          .og-rotator.r1 { width: 27.6rem; height: 27.6rem; }
          .og-rotator.r2 { width: 35.6rem; height: 35.6rem; }
          .og-rotator.r3 { width: 43.6rem; height: 43.6rem; }
        }

        .og-slot {
          position: absolute;
          top: 0;
          left: 50%;
          height: 50%;
          margin-left: calc(var(--chip) / -2);
          transform-origin: bottom;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          pointer-events: none;
        }

        .og-chip {
          position: relative;
          z-index: 25;
          width: var(--chip);
          height: var(--chip);
          margin-top: calc(var(--chip) / -2);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: var(--chip-bg);
          border: 1px solid var(--chip-border);
          box-shadow: var(--chip-shadow);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease;
          cursor: pointer;
          pointer-events: auto;
        }

        .og-chip:hover {
          transform: scale(1.18);
          box-shadow: var(--chip-hover-shadow);
        }

        .og-chip img {
          display: block;
          width: 72%;
          height: 72%;
          object-fit: contain;
          border-radius: 22%;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
          pointer-events: none;
          user-select: none;
        }

        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)); }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .og-slot, .og-chip {
            animation: none !important;
          }
        }
      `}</style>

      {/* Layer 1: Seamless Orbit Lines with feathered atmospheric mask */}
      <div className="og-paths-layer" aria-hidden="true">
        {orbits.map((orbit) => (
          <div key={orbit.cls} className={`og-ring-path ${orbit.cls}`} />
        ))}
      </div>

      {/* Center original particle globe with edge-only feathering */}
      <div className="og-globe">
        <ParticleSphereAnimation />
      </div>

      {/* Layer 2: Orbiting Platform Logos with Horizon Entrance & Exit mask */}
      <div className="og-chips-layer">
        {orbits.map((orbit) => {
          const isCW = orbit.direction === "cw";
          const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
          const counterAnim = isCW ? "counter-cw" : "counter-ccw";

          return (
            <div key={orbit.cls} className={`og-rotator ${orbit.cls}`}>
              {orbit.icons.map((ic, iIdx) => (
                <div
                  key={`${ic.alt}-${iIdx}`}
                  className="og-slot"
                  style={{
                    ["--start-angle" as any]: `${ic.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  }}
                >
                  <div
                    className="og-chip"
                    style={{
                      ["--counter-offset" as any]: `${-ic.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    }}
                    title={ic.alt}
                  >
                    <img
                      src={ic.src}
                      alt={ic.alt}
                      width={44}
                      height={44}
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
