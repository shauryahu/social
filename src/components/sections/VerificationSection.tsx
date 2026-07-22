"use client";

import { useEffect, useRef, useState } from "react";

export default function VerificationSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="verification"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="verification-heading"
    >
      {/* Light accent */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          right: "-10vw",
          top: "-10vw",
          background: "radial-gradient(circle, rgba(155,92,255,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Right column first on large screens */}
        <div
          className="order-2 lg:order-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase mb-4 block"
            style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}
          >
            Verification Support
          </span>
          <h2
            id="verification-heading"
            className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Build Credibility.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Strengthen Presence.
            </span>
          </h2>
          <p
            className="text-base leading-relaxed mb-5"
            style={{ color: "rgba(217,214,227,0.65)", fontFamily: "var(--font-inter)" }}
          >
            SocialAssist provides professional guidance and assistance related
            to social media verification processes. We help navigate the
            credibility requirements and processes across supported platforms.
          </p>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(217,214,227,0.45)", fontFamily: "var(--font-inter)" }}
          >
            Note: Verification outcomes are ultimately determined by each
            individual platform. SocialAssist provides professional guidance
            and support throughout the process.
          </p>

          {[
            "Platform verification guidance",
            "Account credibility improvement",
            "Documentation & requirements support",
            "Profile optimization consultation",
          ].map((feat, i) => (
            <div key={feat} className="flex items-center gap-3 mb-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(155,92,255,0.15)",
                  border: "1px solid rgba(155,92,255,0.3)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#C5A7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm" style={{ color: "rgba(217,214,227,0.75)", fontFamily: "var(--font-inter)" }}>{feat}</span>
            </div>
          ))}

          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(155,92,255,0.12)",
              border: "1px solid rgba(155,92,255,0.3)",
              backdropFilter: "blur(12px)",
              color: "#C5A7FF",
            }}
          >
            Explore Verification →
          </button>
        </div>

        {/* Visual */}
        <div
          className="order-1 lg:order-2 flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(30px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          <div
            className="animate-float-slow relative flex flex-col items-center justify-center rounded-3xl p-10"
            style={{
              width: "min(320px, 90vw)",
              background: "rgba(16,16,22,0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(155,92,255,0.2)",
              boxShadow: "0 0 80px rgba(155,92,255,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {/* Verification badge */}
            <div
              className="relative flex items-center justify-center mb-6"
              style={{
                width: 120,
                height: 120,
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  inset: 0,
                  background: "radial-gradient(circle, rgba(155,92,255,0.25) 0%, transparent 70%)",
                  filter: "blur(12px)",
                }}
              />
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" fill="rgba(155,92,255,0.1)" stroke="url(#vg1)" strokeWidth="1.5"/>
                <path d="M24 40l12 12 20-24" stroke="url(#vg2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="40" cy="40" r="28" stroke="url(#vg1)" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5"/>
                <defs>
                  <linearGradient id="vg1" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C5A7FF"/>
                    <stop offset="1" stopColor="#7C3AED"/>
                  </linearGradient>
                  <linearGradient id="vg2" x1="24" y1="40" x2="56" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF"/>
                    <stop offset="1" stopColor="#C5A7FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h3
              className="text-xl font-semibold mb-2 text-center"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
            >
              Verification Guidance
            </h3>
            <p
              className="text-sm text-center"
              style={{ color: "rgba(197,167,255,0.6)", fontFamily: "var(--font-inter)" }}
            >
              Professional support for your credibility journey
            </p>

            {/* Shimmer line */}
            <div
              className="mt-6 h-px w-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(155,92,255,0.5), transparent)",
              }}
            />

            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              {["Instagram", "Facebook", "TikTok", "X"].map(p => (
                <div
                  key={p}
                  className="text-center text-xs py-1.5 rounded-lg"
                  style={{
                    background: "rgba(155,92,255,0.08)",
                    border: "1px solid rgba(155,92,255,0.15)",
                    color: "rgba(217,214,227,0.6)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
