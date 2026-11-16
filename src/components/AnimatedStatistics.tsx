"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  id: string;
  target: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  sub: string;
}

const STATS: StatItem[] = [
  {
    id: "cases",
    target: 500,
    suffix: "+",
    label: "Cases Resolved",
    sub: "Verified resolution",
  },
  {
    id: "network",
    target: 100,
    suffix: "%",
    label: "Secure Network",
    sub: "Strict confidentiality",
  },
  {
    id: "support",
    target: 24,
    suffix: "/7",
    label: "Direct Support",
    sub: "Telegram escalation",
  },
  {
    id: "rate",
    target: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Success Rate",
    sub: "Tier-1 internal channels",
  },
];

export default function AnimatedStatistics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const [values, setValues] = useState<number[]>([500, 100, 24, 99.9]); // SSR default to final values

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          observer.disconnect();

          // Smooth exponential ease-out count-up
          const duration = 1400; // ms
          const startTime = performance.now();

          const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out expo: 1 - 2^(-10 * progress)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setValues(STATS.map((s) => s.target * easeProgress));

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setValues(STATS.map((s) => s.target));
            }
          };

          // Begin count-up animation from 0
          setValues([0, 0, 0, 0]);
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 w-full max-w-4xl mx-auto"
      aria-label="Key Performance Statistics"
    >
      {STATS.map((stat, idx) => {
        const val = values[idx] ?? stat.target;
        const formattedVal = stat.decimals
          ? val.toFixed(stat.decimals)
          : Math.floor(val).toString();

        return (
          <div
            key={stat.id}
            className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0E1017]/80 backdrop-blur-xl hover:border-white/20 transition-all duration-300 text-left group shadow-lg shadow-black/40 hover:shadow-cyan-950/20"
          >
            {/* Numerical Value */}
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-baseline gap-0.5 group-hover:text-cyan-300 transition-colors"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <span>{stat.prefix}</span>
              <span className="tabular-nums font-mono">{formattedVal}</span>
              <span className="text-cyan-400 text-xl sm:text-2xl font-bold">{stat.suffix}</span>
            </div>

            {/* Label */}
            <div
              className="text-xs sm:text-sm font-semibold text-zinc-100 mt-1.5 tracking-wide"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {stat.label}
            </div>

            {/* Supporting Description */}
            <div
              className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-normal"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {stat.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
