"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-start pt-36 sm:pt-40 pb-16 px-4 md:px-8 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-start text-left max-w-4xl w-full">

        {/* 1. Est. 2021 Badge (Top Left) */}
        <div
          className="px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-widest uppercase inline-block"
          style={{
            background: "rgba(74,22,168,0.25)",
            border: "1px solid rgba(124,58,237,0.4)",
            color: "#C5A7FF",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s",
            fontFamily: "var(--font-inter)",
          }}
        >
          Est. 2021 · Digital Assistance Network
        </div>

        {/* 2. Translucent Blurry Glass Capsule enclosing Logo + · SOCIALASSIST */}
        <div
          className="mt-5 inline-flex items-center gap-3.5 sm:gap-5 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-full transition-transform duration-300 hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.35), 0 0 24px rgba(168, 85, 247, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.75s ease-out 0.15s, transform 0.75s ease-out 0.15s",
          }}
        >
          {/* Larger White SA Icon PNG Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/toplogo1.png"
            alt="SocialAssist SA Logo"
            width={96}
            height={96}
            className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain block"
            style={{
              filter:
                "drop-shadow(0 0 18px rgba(124,58,237,0.9)) drop-shadow(0 0 36px rgba(155,92,255,0.7))",
            }}
          />

          {/* Thin Vertical Glass Divider */}
          <div
            style={{
              width: "1px",
              height: "32px",
              background: "rgba(255, 255, 255, 0.18)",
            }}
          />

          {/* · SOCIALASSIST Text label next to logo inside capsule */}
          <div
            className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-black tracking-[0.25em] uppercase"
            style={{
              color: "#C5A7FF",
              fontFamily: "var(--font-space-grotesk)",
              textShadow: "0 0 18px rgba(155,92,255,0.7)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#9B5CFF] inline-block shadow-[0_0_14px_#9B5CFF]" />
            SocialAssist
          </div>
        </div>

        {/* 3. Main headline / Slogan — Ultra-Bold High-Impact Typography */}
        <h1
          id="hero-heading"
          className="mt-4 leading-[1.05] font-black tracking-tight"
          style={{
            fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
            fontFamily: "var(--font-space-grotesk)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s",
          }}
        >
          <span style={{ color: "#FFFFFF", textShadow: "0 0 40px rgba(255,255,255,0.15)" }}>
            We Resolve.
          </span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #E0C7FF 0%, #A855F7 50%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(168,85,247,0.35))",
            }}
          >
            We Protect.
          </span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #D8B4FE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We Elevate.
          </span>
        </h1>

        {/* Supporting copy — Bold & Clear High-Contrast Typography */}
        <p
          className="mt-5 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed font-medium"
          style={{
            color: "rgba(235,232,245,0.85)",
            fontFamily: "var(--font-inter)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          Specialized <strong className="font-bold text-white underline decoration-purple-500/50 underline-offset-4">social media assistance</strong>, <strong className="font-bold text-white">verification support</strong>, <strong className="font-bold text-white">digital protection</strong>, <strong className="font-bold text-white">crypto exchange</strong> and <strong className="font-bold text-white">automated advertising</strong> — connected through one network.
        </p>

        {/* CTA Buttons */}
        <div
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.45s, transform 0.8s ease-out 0.45s",
          }}
        >
          <button
            onClick={scrollToServices}
            className="group relative w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm sm:text-base text-white overflow-hidden transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #4A16A8 0%, #7C3AED 50%, #9B5CFF 100%)",
              boxShadow: "0 0 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2 tracking-wide">
              Explore Services
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          <button
            onClick={scrollToContact}
            className="group w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              color: "#FFFFFF",
              fontFamily: "var(--font-inter)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(168,85,247,0.6)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            }}
          >
            Contact
          </button>
        </div>
      </div>

        {/* High-Impact Bold Highlights Strip */}
        <div
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.85s ease-out 0.5s, transform 0.85s ease-out 0.5s",
          }}
        >
          {[
            { value: "500+", label: "Cases Resolved" },
            { value: "100%", label: "Secure Network" },
            { value: "24/7", label: "Direct Support" },
            { value: "99.9%", label: "Success Rate" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl border border-white/10"
              style={{
                background: "rgba(20, 16, 32, 0.55)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="text-2xl sm:text-3xl font-black"
                style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, #C5A7FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs sm:text-sm font-bold mt-1 text-purple-200/90"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* VIDEO — main intro */}
        <div
          className="mt-12 w-full max-w-3xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
            filter: visible ? "blur(0px)" : "blur(6px)",
            transition: "opacity 1s ease-out 0.55s, transform 1s ease-out 0.55s, filter 1s ease-out 0.55s",
          }}
        >
          {/* Glass video frame */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(16,16,22,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 0 60px rgba(74,22,168,0.3), 0 0 120px rgba(74,22,168,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Top bar chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28CA42" }} />
              <span
                className="ml-auto text-xs"
                style={{ color: "rgba(197,167,255,0.5)", fontFamily: "var(--font-inter)" }}
              >
                SocialAssist · Official
              </span>
            </div>

            {/* Video */}
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              <video
                ref={videoRef}
                src="/videos/intro.mp4"
                autoPlay
                muted={muted}
                loop
                playsInline
                className="w-full h-full object-cover"
                aria-label="SocialAssist introduction video"
              />

              {/* Subtle top gradient overlay — does NOT cover important content */}
              <div
                className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(8,8,12,0.5), transparent)",
                }}
              />

              {/* Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                {/* Play/pause */}
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: "rgba(8,8,12,0.75)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label={playing ? "Pause video" : "Play video"}
                >
                  {playing ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#C5A7FF">
                      <rect x="2" y="1" width="3" height="10" rx="1"/>
                      <rect x="7" y="1" width="3" height="10" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#C5A7FF">
                      <path d="M3 2l7 4-7 4V2z"/>
                    </svg>
                  )}
                </button>

                {/* Mute/unmute */}
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: muted ? "rgba(124,58,237,0.5)" : "rgba(8,8,12,0.75)",
                    backdropFilter: "blur(10px)",
                    border: muted
                      ? "1px solid rgba(124,58,237,0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                >
                  {muted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <line x1="23" y1="9" x2="17" y2="15"/>
                      <line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
