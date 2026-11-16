"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function HeroArchitecturalGrid() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage: isLight
          ? "linear-gradient(to bottom, transparent 0%, transparent 690px, rgba(0,0,0,0.4) 735px, rgba(0,0,0,1) 785px, rgba(0,0,0,0.5) 88%, transparent 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.15) 80%, transparent 100%)",
        WebkitMaskImage: isLight
          ? "linear-gradient(to bottom, transparent 0%, transparent 690px, rgba(0,0,0,0.4) 735px, rgba(0,0,0,1) 785px, rgba(0,0,0,0.5) 88%, transparent 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.15) 80%, transparent 100%)",
      }}
    >
      {/* 1. Fine High-Tech Architectural Grid Matrix */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(15, 23, 42, 0.045) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.045) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
          backgroundSize: "64px 64px",
          backgroundPosition: "center top",
        }}
      />

      {/* 2. Secondary Sub-Grid with Subtle Metallic Accent */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(15, 23, 42, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.02) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
          backgroundSize: "16px 16px",
          backgroundPosition: "center top",
        }}
      />

      {/* 3. Central Architectural Axis Lines */}
      <div className="absolute inset-0 flex justify-center">
        {/* Center Vertical Rule */}
        <div
          className={`w-px h-full ${
            isLight
              ? "bg-gradient-to-b from-transparent via-slate-300/30 to-transparent"
              : "bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
          }`}
        />
        {/* Left Bounding Guide */}
        <div
          className={`hidden lg:block absolute left-1/2 -translate-x-[480px] w-px h-full ${
            isLight
              ? "bg-gradient-to-b from-transparent via-slate-200/50 to-transparent"
              : "bg-gradient-to-b from-transparent via-white/5 to-transparent"
          }`}
        />
        {/* Right Bounding Guide */}
        <div
          className={`hidden lg:block absolute left-1/2 translate-x-[480px] w-px h-full ${
            isLight
              ? "bg-gradient-to-b from-transparent via-slate-200/50 to-transparent"
              : "bg-gradient-to-b from-transparent via-white/5 to-transparent"
          }`}
        />
      </div>

      {/* 4. Elegant Top Radial Ambient Light Beam */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.12) 0%, rgba(224, 242, 254, 0.08) 40%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.07) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
