"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffects() {
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const glow = cursorGlowRef.current;
    if (!glow) return;

    let latestX = 0;
    let latestY = 0;

    const updatePosition = () => {
      if (glow) {
        glow.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
      }
      animationFrameRef.current = null;
    };

    const onMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updatePosition);
      }
    };

    const onLeave = () => {
      if (glow) glow.style.opacity = "0";
    };

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
      {/* Fixed background base */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden gpu-layer"
        style={{ background: "#08080C" }}
      >
        {/* Primary violet orb — upper left */}
        <div
          className="animate-orb absolute rounded-full gpu-layer"
          style={{
            width: "70vw",
            height: "70vw",
            left: "-20vw",
            top: "-15vw",
            background:
              "radial-gradient(circle, rgba(74,22,168,0.38) 0%, rgba(74,22,168,0.12) 40%, transparent 65%)",
            filter: "blur(40px)",
            animationDelay: "0s",
          }}
        />
        {/* Secondary purple orb — lower right */}
        <div
          className="animate-orb absolute rounded-full gpu-layer"
          style={{
            width: "60vw",
            height: "60vw",
            right: "-15vw",
            bottom: "5vw",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(74,22,168,0.1) 45%, transparent 65%)",
            filter: "blur(50px)",
            animationDelay: "3s",
          }}
        />
        {/* Tertiary soft lavender — center */}
        <div
          className="animate-orb absolute rounded-full gpu-layer"
          style={{
            width: "45vw",
            height: "45vw",
            left: "30vw",
            top: "20vw",
            background:
              "radial-gradient(circle, rgba(155,92,255,0.15) 0%, transparent 60%)",
            filter: "blur(60px)",
            animationDelay: "6s",
          }}
        />
        {/* White soft highlight — top center */}
        <div
          className="animate-orb absolute rounded-full gpu-layer"
          style={{
            width: "30vw",
            height: "30vw",
            left: "35vw",
            top: "-5vw",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)",
            filter: "blur(30px)",
            animationDelay: "9s",
          }}
        />
      </div>

      {/* Cursor glow — desktop only */}
      <div
        ref={cursorGlowRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300 gpu-layer"
        style={{
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(74,22,168,0.05) 40%, transparent 70%)",
          filter: "blur(12px)",
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}

