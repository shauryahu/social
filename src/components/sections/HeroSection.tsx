"use client";

import { useEffect, useState } from "react";
import CinematicLaptop from "@/components/3d/CinematicLaptop";
import Hero3DBackground from "@/components/3d/Hero3DBackground";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

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
      {/* ── Large Immersive 3D Background Elements ── */}
      <Hero3DBackground />

      {/* Background Cinematic Atmosphere: Soft Metallic Blue & Midnight Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[500px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Hero content container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full mx-auto">
        {/* 1. Est. 2021 · Apple-style pill badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-700"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "#E2E8F0",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            fontFamily: "var(--font-inter)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          <span>Est. 2021 · Digital Assistance & Resolution Network</span>
        </div>

        {/* 2. Glass Capsule enclosing SA Brand Icon + SocialAssist Title */}
        <div
          className="mt-6 inline-flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-500 hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.015) 100%)",
            backdropFilter: "blur(28px) saturate(190%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow:
              "0 12px 40px rgba(0, 0, 0, 0.45), 0 0 24px rgba(56, 189, 248, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.75s ease-out 0.1s, transform 0.75s ease-out 0.1s",
          }}
        >
          {/* SA Logo PNG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/toplogo1.png"
            alt="SocialAssist Logo"
            width={72}
            height={72}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain block drop-shadow-[0_0_16px_rgba(139,92,246,0.6)]"
          />

          <div className="w-px h-6 bg-white/15" />

          <div
            className="text-lg sm:text-xl font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              textShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          >
            SocialAssist
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/20 text-cyan-300 font-mono tracking-normal font-medium">
              2.0
            </span>
          </div>
        </div>

        {/* 3. Main Headline — Apple-Inspired High-Impact Precision */}
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
          <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.2)]">
            We Resolve.
          </span>{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 35px rgba(56,189,248,0.3))",
            }}
          >
            We Protect.
          </span>{" "}
          <span className="text-zinc-200">
            We Elevate.
          </span>
        </h1>

        {/* Supporting copy */}
        <p
          className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-zinc-300/90 font-normal"
          style={{
            fontFamily: "var(--font-inter)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
          }}
        >
          Specialized{" "}
          <strong className="font-semibold text-white">social media assistance</strong>,{" "}
          <strong className="font-semibold text-white">verification support</strong>,{" "}
          <strong className="font-semibold text-white">brand protection</strong>,{" "}
          <strong className="font-semibold text-white">crypto OTC exchange</strong>, and{" "}
          <strong className="font-semibold text-white">automated advertising</strong> — unified through one high-security network.
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
            className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white overflow-hidden transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)",
              boxShadow: "0 8px 30px rgba(79, 70, 229, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
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
            className="group w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base text-zinc-200 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center justify-center border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Contact Network
          </button>
        </div>

        {/* Metrics Grid */}
        <div
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.85s ease-out 0.45s, transform 0.85s ease-out 0.45s",
          }}
        >
          {[
            { value: "500+", label: "Cases Resolved", sub: "Verified resolution" },
            { value: "100%", label: "Secure Network", sub: "Strict confidentiality" },
            { value: "24/7", label: "Direct Support", sub: "Telegram escalation" },
            { value: "99.9%", label: "Success Rate", sub: "Tier-1 internal channels" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-white/10 bg-[#12121A]/70 backdrop-blur-xl hover:border-white/20 transition-all duration-300 text-left group"
            >
              <div
                className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-200 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* 4. SIGNATURE CINEMATIC 3D LAPTOP ANIMATION
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
            <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
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
