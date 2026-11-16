"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffects() {
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const glow = cursorGlowRef.current;
    if (!glow) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const updatePosition = () => {
      // Damped smooth spring interpolation for Apple-like fluid feel
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (glow) {
        glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (glow && glow.style.opacity !== "1") {
        glow.style.opacity = "1";
      }
    };

    const onLeave = () => {
      if (glow) glow.style.opacity = "0";
    };

    animationFrameRef.current = requestAnimationFrame(updatePosition);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Fixed Cinematic Atmosphere Base (Deep Black, Graphite, Midnight Blue, Silver) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ background: "#07070A" }}
      >
        {/* Subtle Micro-Grid Overlay for Depth */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* 1. Midnight Blue Orb — Upper Left Studio Key */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "65vw",
            height: "65vw",
            left: "-15vw",
            top: "-15vw",
            background:
              "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.08) 45%, transparent 70%)",
            filter: "blur(60px)",
            animationDuration: "24s",
          }}
        />

        {/* 2. Controlled Electric Blue Accent — Upper Center */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "45vw",
            height: "45vw",
            left: "25vw",
            top: "-5vw",
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, transparent 65%)",
            filter: "blur(70px)",
            animationDelay: "4s",
            animationDuration: "28s",
          }}
        />

        {/* 3. Subtle Violet Atmosphere — Lower Right */}
        <div
          className="animate-orb absolute rounded-full"
          style={{
            width: "55vw",
            height: "55vw",
            right: "-10vw",
            bottom: "0vw",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(76, 29, 149, 0.03) 50%, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "8s",
            animationDuration: "30s",
          }}
        />

        {/* 4. Soft Metallic Silver Shimmer — Top Center Header */}
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "25vw",
            left: "25vw",
            top: "0",
            background:
              "radial-gradient(ellipse at top, rgba(226, 232, 240, 0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Damped Cursor Follower Spotlight (Desktop) */}
      <div
        ref={cursorGlowRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-10 opacity-0 transition-opacity duration-500"
        style={{
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.03) 45%, transparent 70%)",
          filter: "blur(20px)",
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
