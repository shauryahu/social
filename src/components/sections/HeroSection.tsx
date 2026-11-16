"use client";

import { useEffect, useState } from "react";
import CinematicLaptop from "@/components/3d/CinematicLaptop";
import HeroArchitecturalGrid from "@/components/HeroArchitecturalGrid";
import AnimatedStatistics from "@/components/AnimatedStatistics";
import { useTheme } from "@/components/ThemeProvider";
import WaveMesh from "@/components/ui/wave-mesh";

export default function HeroSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-start pt-32 sm:pt-36 pb-20 px-4 md:px-8 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ── Top Hero Wave Mesh (Pure Dark Black with Violet/Purple Accents) ── */}
      <div
        className="absolute top-0 inset-x-0 h-[740px] sm:h-[765px] md:h-[790px] overflow-hidden pointer-events-auto z-0"
        style={{
          background: "#000000",
          maskImage: isLight
            ? "linear-gradient(to bottom, #000000 0%, #000000 calc(100% - 110px), rgba(0,0,0,0.65) calc(100% - 55px), rgba(0,0,0,0.2) calc(100% - 15px), transparent 100%)"
            : "linear-gradient(to bottom, #000000 0%, #000000 calc(100% - 90px), rgba(0,0,0,0.5) calc(100% - 30px), transparent 100%)",
          WebkitMaskImage: isLight
            ? "linear-gradient(to bottom, #000000 0%, #000000 calc(100% - 110px), rgba(0,0,0,0.65) calc(100% - 55px), rgba(0,0,0,0.2) calc(100% - 15px), transparent 100%)"
            : "linear-gradient(to bottom, #000000 0%, #000000 calc(100% - 90px), rgba(0,0,0,0.5) calc(100% - 30px), transparent 100%)",
        }}
      >
        <WaveMesh
          colors={["#000000", "#e2e8f0", "#a855f7"]}
          crests={true}
          className="w-full h-full"
        />

        {/* Graduated Chromatic Merge: Solid Black -> Dark Grey -> Neutral Grey -> Light Grey -> White with Layered Diffusion Blurs */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{
            background: isLight
              ? `linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0) 0%,
                  rgba(8, 10, 16, 0.78) 20%,
                  rgba(22, 28, 40, 0.6) 40%,
                  rgba(55, 68, 90, 0.42) 60%,
                  rgba(148, 163, 184, 0.35) 78%,
                  rgba(226, 232, 240, 0.65) 90%,
                  rgba(255, 255, 255, 0.95) 97%,
                  #ffffff 100%
                )`
              : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(3,7,18,0.4) 30%, rgba(3,7,18,0.85) 70%, #030712 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Ethereal Optical Smoothing Layer: Ultra-Soft Secondary Blur */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: isLight
              ? "linear-gradient(to bottom, transparent 0%, rgba(226, 232, 240, 0.2) 45%, rgba(255, 255, 255, 0.92) 100%)"
              : "transparent",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
          }}
        />
      </div>

      {/* ── Minimal Architectural Grid Lines (Smooth Top-to-Bottom Fade) ── */}
      <HeroArchitecturalGrid />

      {/* Background Cinematic Atmosphere: Soft Violet / Purple Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.16) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Hero content container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full mx-auto">
        {/* Top Black Intro Block (White, Violet, Purple, Light Grey over Deep Black Wave Mesh) */}
        <div className="hero-black-intro flex flex-col items-center text-center w-full">
          {/* 1. Est. 2021 · Apple-style pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-700"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "#E2E8F0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
            <span className="text-[#E2E8F0]">Est. 2021 · Digital Assistance & Resolution Network</span>
          </div>

          {/* 2. Glass Capsule enclosing SA Brand Icon + SocialAssist Title */}
          <div
            className="mt-6 inline-flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)",
              backdropFilter: "blur(28px) saturate(190%)",
              WebkitBackdropFilter: "blur(28px) saturate(190%)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(168, 85, 247, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.75s ease-out 0.1s, transform 0.75s ease-out 0.1s",
            }}
          >
            {/* SA Clean Apple-Style Logo (White on Black) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-apple-white.png"
              alt="SocialAssist Logo"
              width={48}
              height={48}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain block transition-opacity duration-200"
            />

            <div className="w-px h-6 bg-purple-400/30" />

            <div
              className="text-lg sm:text-xl font-bold tracking-[0.2em] uppercase flex items-center text-white"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 20px rgba(255,255,255,0.25)",
              }}
            >
              SocialAssist
            </div>
          </div>

          {/* 3. Main Headline — White, Violet, Purple */}
          <h1
            id="hero-heading"
            className="mt-8 leading-[1.05] font-black tracking-tight"
            style={{
              fontSize: "clamp(2.4rem, 6.5vw, 5.2rem)",
              fontFamily: "var(--font-space-grotesk)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)]">
              We Resolve.
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 font-black drop-shadow-[0_4px_30px_rgba(168,85,247,0.35)]">
              We Protect.
            </span>{" "}
            <span className="text-purple-300 font-bold drop-shadow-[0_4px_24px_rgba(192,132,252,0.25)]">
              We Elevate.
            </span>
          </h1>

          {/* Supporting copy — Light Grey with White / Violet highlights */}
          <p
            className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed font-normal text-[#E2E8F0]"
            style={{
              fontFamily: "var(--font-inter)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
            }}
          >
            Specialized{" "}
            <strong className="font-semibold text-white">
              social media assistance
            </strong>
            ,{" "}
            <strong className="font-semibold text-purple-200">
              verification support
            </strong>
            ,{" "}
            <strong className="font-semibold text-white">
              brand protection
            </strong>
            ,{" "}
            <strong className="font-semibold text-purple-200">
              crypto OTC exchange
            </strong>
            , and{" "}
            <strong className="font-semibold text-white">
              automated advertising
            </strong>{" "}
            — unified through one high-security network.
          </p>

          {/* Action Buttons */}
          <div
            className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto justify-center items-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
            }}
          >
            <button
              onClick={scrollToServices}
              className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center justify-center gap-2 text-white shadow-[0_8px_30px_rgba(147,51,234,0.45)]"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #6D28D9 100%)",
                fontFamily: "var(--font-inter)",
              }}
            >
              <span>Explore Services</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M1 8h14M9 3l6 5-6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={scrollToContact}
              className="group w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center justify-center backdrop-blur-xl text-slate-100 border border-purple-400/40 bg-purple-950/40 hover:bg-purple-900/50 hover:border-purple-400/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Contact Network
            </button>
          </div>
        </div>

        {/* 4. Immersive Animated Count-Up Statistics & PeakChart */}
        <AnimatedStatistics />

        {/* 5. SIGNATURE CINEMATIC 3D LAPTOP ANIMATION
            Renders 3D metallic laptop with hinge opening, screen glow, and actual intro video inside
        */}
        <div
          className="mt-10 sm:mt-14 w-full"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
          }}
        >
          <div className="text-center mb-3">
            <span
              className={`text-[11px] uppercase tracking-widest font-mono ${isLight ? "text-slate-500 font-semibold" : "text-zinc-400"
                }`}
            >
              ✦ Cinematic Presentation · Real-time 3D Engine ✦
            </span>
          </div>

          {/* 3D Laptop Component with actual intro.mp4 */}
          <CinematicLaptop />
        </div>
      </div>
    </section>
  );
}
