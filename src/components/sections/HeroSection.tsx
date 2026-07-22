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
      className="relative min-h-screen flex flex-col items-center justify-start pt-28 pb-16 px-4 md:px-8 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-start text-left max-w-4xl w-full">

        {/* Wide Long Logo matching Est. 2021 badge length */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            filter: "drop-shadow(0 0 20px rgba(124,58,237,0.45))",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/longlogo.png"
            alt="SocialAssist Long Logo"
            className="w-auto h-auto max-w-[280px] sm:max-w-[300px] object-cover block"
            style={{ borderRadius: "14px" }}
          />
        </div>

        {/* Est. label */}
        <div
          className="mt-4 px-4 py-1 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(74,22,168,0.2)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#C5A7FF",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s",
            fontFamily: "var(--font-inter)",
          }}
        >
          Est. 2021 · Digital Assistance Network
        </div>

        {/* Brand name title over slogan */}
        <div
          className="mt-6 flex items-center gap-2 text-sm md:text-base font-semibold tracking-[0.25em] uppercase"
          style={{
            color: "#C5A7FF",
            fontFamily: "var(--font-space-grotesk)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.75s ease-out 0.2s, transform 0.75s ease-out 0.2s",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#9B5CFF] inline-block shadow-[0_0_8px_#9B5CFF]" />
          SocialAssist
        </div>

        {/* Main headline / Slogan */}
        <h1
          id="hero-heading"
          className="mt-3 leading-tight font-bold tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontFamily: "var(--font-space-grotesk)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>We Resolve.</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #C5A7FF 0%, #9B5CFF 50%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We Protect.
          </span>
          <br />
          <span style={{ color: "rgba(217,214,227,0.9)" }}>We Elevate.</span>
        </h1>

        {/* Supporting copy */}
        <p
          className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed"
          style={{
            color: "rgba(217,214,227,0.65)",
            fontFamily: "var(--font-inter)",
            fontWeight: 400,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          Specialized social media assistance, verification support, digital
          protection, crypto exchange and automated advertising — connected
          through one network.
        </p>

        {/* CTA Buttons */}
        <div
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.45s, transform 0.8s ease-out 0.45s",
          }}
        >
          <button
            onClick={scrollToServices}
            className="group relative px-7 py-3.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4A16A8 0%, #7C3AED 50%, #9B5CFF 100%)",
              boxShadow: "0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Services
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          <button
            onClick={scrollToContact}
            className="group px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "#D9D6E3",
              fontFamily: "var(--font-inter)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.5)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
            }}
          >
            Contact
          </button>
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

              {/* Mute hint badge */}
              {muted && (
                <button
                  onClick={toggleMute}
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(124,58,237,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(197,167,255,0.3)",
                    color: "#fff",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  🔇 Tap to unmute
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
