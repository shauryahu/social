"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffects() {
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const glow = cursorGlowRef.current;
    if (!glow) return;

    const onMove = (e: MouseEvent) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "1";
    };

    const onLeave = () => {
      if (glow) glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Fixed background base */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ background: "#08080C" }}
      >
        {/* Primary violet orb — upper left */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "70vw",
            height: "70vw",
            left: "-20vw",
            top: "-15vw",
            background:
              "radial-gradient(circle, rgba(74,22,168,0.35) 0%, rgba(74,22,168,0.1) 45%, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "0s",
          }}
        />
        {/* Secondary purple orb — lower right */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "60vw",
            height: "60vw",
            right: "-15vw",
            bottom: "5vw",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(74,22,168,0.08) 50%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "3s",
          }}
        />
        {/* Tertiary soft lavender — center */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "45vw",
            height: "45vw",
            left: "30vw",
            top: "20vw",
            background:
              "radial-gradient(circle, rgba(155,92,255,0.12) 0%, transparent 65%)",
            filter: "blur(120px)",
            animationDelay: "6s",
          }}
        />
        {/* White soft highlight — top center */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "30vw",
            height: "30vw",
            left: "35vw",
            top: "-5vw",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "9s",
          }}
        />
        {/* Very subtle grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            opacity: 0.6,
          }}
        />
      </div>

      {/* Cursor glow — desktop only */}
      <div
        ref={cursorGlowRef}
        aria-hidden="true"
        className="fixed pointer-events-none z-10 opacity-0 transition-opacity duration-300"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, rgba(74,22,168,0.04) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </>
  );
}
