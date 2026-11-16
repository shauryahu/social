"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [phase, setPhase] = useState<"logo" | "bar" | "glow" | "done">("logo");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("bar"), 250);
    const t2 = setTimeout(() => setPhase("glow"), 900);
    const t3 = setTimeout(() => setPhase("done"), 1200);
    const t4 = setTimeout(() => onCompleteRef.current(), 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-label="Loading SocialAssist"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gpu-layer transition-colors duration-300"
      style={{
        background: isLight ? "#FAFAFC" : "#08080C",
        opacity: 1,
        transition: "opacity 0.3s ease-out",
        pointerEvents: "all",
      }}
    >
      {/* Background glow — GPU hardware layer */}
      <div
        className="absolute rounded-full gpu-layer"
        style={{
          width: "50vw",
          height: "50vw",
          background: isLight
            ? "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(74,22,168,0.45) 0%, transparent 65%)",
          filter: "blur(40px)",
          opacity: phase === "glow" ? 0 : 0.8,
          transition: "opacity 0.4s ease-out",
        }}
      />

      {/* Logo — toplogo1 PNG with single hardware drop-shadow */}
      <div
        className="gpu-layer"
        style={{
          opacity: phase === "glow" ? 0 : 1,
          transform: phase === "glow" ? "translate3d(0,0,0) scale(0.88)" : "translate3d(0,0,0) scale(1)",
          transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
          filter: "drop-shadow(0 0 20px rgba(155,92,255,0.75))",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/toplogo1.png"
          alt="SocialAssist"
          width={100}
          height={100}
          style={{ objectFit: "contain", display: "block" }}
        />
      </div>

      {/* Brand name & Slogan */}
      <div
        className="mt-4 text-center gpu-layer"
        style={{
          opacity: phase === "glow" ? 0 : 1,
          transform: phase === "glow" ? "translate3d(0,6px,0)" : "translate3d(0,0,0)",
          transition: "opacity 0.4s ease-out 0.08s, transform 0.4s ease-out 0.08s",
        }}
      >
        <p
          className="text-sm font-medium tracking-[0.35em] uppercase"
          style={{
            color: isLight ? "#6B21A8" : "rgba(197,167,255,0.85)",
            fontFamily: "var(--font-inter)",
          }}
        >
          Social Assist
        </p>
        <p
          className="text-xs font-medium tracking-wider mt-1.5"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #9B5CFF 50%, #4A16A8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          We Resolve. We Protect. We Elevate.
        </p>
      </div>

      {/* Loading bar */}
      <div
        className="mt-8 rounded-full overflow-hidden gpu-layer"
        style={{
          width: "140px",
          height: "2px",
          background: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255,255,255,0.08)",
          opacity: phase === "bar" ? 1 : 0,
          transition: "opacity 0.25s ease-out",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: phase === "bar" ? "100%" : "0%",
            background:
              "linear-gradient(90deg, #4A16A8, #7C3AED, #9B5CFF, #C5A7FF)",
            boxShadow: "0 0 8px rgba(155,92,255,0.8)",
            transition:
              phase === "bar"
                ? "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
          }}
        />
      </div>
    </div>
  );
}
