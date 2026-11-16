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
      {/* ── 1. Seamless Multi-Layered Atmospheric Background Transition ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 pointer-events-none z-0"
        style={{
          height: "clamp(1020px, 120vh, 1280px)",
          background: isLight
            ? `linear-gradient(
                180deg,
                #030309 0%,
                #030309 38%,
                #171821 50%,
                #222938 60%,
                #384357 69%,
                #586780 77%,
                #8898b0 84%,
                #cbd5e1 91%,
                #f1f5f9 96%,
                #ffffff 100%
              )`
            : "linear-gradient(180deg, #030309 0%, #030309 55%, #060913 80%, #030712 100%)",
        }}
      />

      {/* ── 2. Starfield Wave Mesh with Atmospheric Dissolve ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-auto z-0 overflow-hidden"
        style={{
          height: "clamp(900px, 105vh, 1100px)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.85) 54%, rgba(0,0,0,0.5) 66%, rgba(0,0,0,0.18) 78%, rgba(0,0,0,0.03) 88%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.85) 54%, rgba(0,0,0,0.5) 66%, rgba(0,0,0,0.18) 78%, rgba(0,0,0,0.03) 88%, transparent 95%)",
        }}
      >
        <WaveMesh
          colors={["transparent", "#e2e8f0", "#a855f7"]}
          crests={true}
          className="w-full h-full"
        />
      </div>

      {/* ── 3. Atmospheric Horizon Ambient Glow (Depth without Harsh Bloom) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[520px] sm:top-[560px] md:top-[600px] pointer-events-none z-0 flex justify-center"
      >
        <div
          className="w-full max-w-[1240px] h-[360px] sm:h-[420px] rounded-full"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(147, 197, 253, 0.15) 0%, rgba(168, 85, 247, 0.08) 40%, transparent 75%)"
              : "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(147, 197, 253, 0.12) 0%, rgba(168, 85, 247, 0.06) 40%, transparent 75%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      {/* ── 4. Minimal Architectural Grid Lines (Smoothly Emerging in Transition) ── */}
      <HeroArchitecturalGrid />

      {/* ── 5. Upper Cinematic Specular Violet Atmosphere ── */}
      <div
        aria-hidden="true"
        className="absolute top-[260px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1100px] h-[440px] pointer-events-none z-0 rounded-full"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.14) 0%, rgba(124, 58, 237, 0.04) 45%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.16) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%)",
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
