"use client";

import { useEffect, useRef, useState } from "react";

export default function BrandProtection() {
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

  const threats = [
    { label: "Impersonation", icon: "⦾" },
    { label: "Fake Profiles", icon: "⦾" },
    { label: "Fraudulent Representation", icon: "⦾" },
    { label: "Reputation Issues", icon: "⦾" },
  ];

  return (
    <section
      id="brand-protection"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="brand-protection-heading"
    >
      {/* Dark glass bg strip */}
      <div
        className="absolute inset-x-0 top-12 bottom-12 pointer-events-none"
        style={{
          background: "rgba(8,8,12,0.6)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Shield visual */}
        <div
          className="flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <div className="animate-float relative" style={{ width: "min(300px, 85vw)" }}>
            {/* Outer glow */}
            <div
              className="absolute rounded-full"
              style={{
                inset: -30,
                background: "radial-gradient(circle, rgba(74,22,168,0.2) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />

            {/* Shield card */}
            <div
              className="relative rounded-3xl p-10 flex flex-col items-center"
              style={{
                background: "rgba(16,16,22,0.8)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(124,58,237,0.25)",
                boxShadow: "0 0 60px rgba(74,22,168,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* Shield SVG */}
              <svg width="90" height="100" viewBox="0 0 90 100" fill="none">
                <path
                  d="M45 5L10 18v25c0 22.5 14.5 42 35 50 20.5-8 35-27.5 35-50V18L45 5z"
                  fill="url(#bpg1)"
                  opacity="0.15"
                />
                <path
                  d="M45 5L10 18v25c0 22.5 14.5 42 35 50 20.5-8 35-27.5 35-50V18L45 5z"
                  stroke="url(#bpg2)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Fingerprint lines */}
                <path d="M32 40c0-7.18 5.82-13 13-13s13 5.82 13 13c0 7.18-5.82 13-13 13" stroke="url(#bpg2)" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                <path d="M37 40c0-4.42 3.58-8 8-8s8 3.58 8 8c0 4.42-3.58 8-8 8" stroke="url(#bpg2)" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
                <circle cx="45" cy="40" r="3" fill="url(#bpg3)"/>
                {/* Lock bottom */}
                <rect x="38" y="55" width="14" height="10" rx="2" fill="url(#bpg1)" opacity="0.5" stroke="url(#bpg2)" strokeWidth="1"/>
                <path d="M41 55v-4a4 4 0 0 1 8 0v4" stroke="url(#bpg2)" strokeWidth="1.2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="bpg1" x1="10" y1="5" x2="80" y2="95" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED"/>
                    <stop offset="1" stopColor="#4A16A8"/>
                  </linearGradient>
                  <linearGradient id="bpg2" x1="10" y1="5" x2="80" y2="95" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C5A7FF"/>
                    <stop offset="1" stopColor="#7C3AED"/>
                  </linearGradient>
                  <linearGradient id="bpg3" x1="42" y1="37" x2="48" y2="43" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF"/>
                    <stop offset="1" stopColor="#C5A7FF"/>
                  </linearGradient>
                </defs>
              </svg>

              <h3
                className="mt-5 text-lg font-semibold text-center"
                style={{ color: "#FFFFFF", fontFamily: "var(--font-space-grotesk)" }}
              >
                Identity Protected
              </h3>
              <p
                className="text-xs text-center mt-1"
                style={{ color: "rgba(197,167,255,0.5)", fontFamily: "var(--font-inter)" }}
              >
                Your brand is yours.
              </p>

              {/* Threat tags */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {threats.map((t) => (
                  <span
                    key={t.label}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(74,22,168,0.15)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      color: "rgba(197,167,255,0.7)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(30px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase mb-4 block"
            style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}
          >
            Brand Protection
          </span>
          <h2
            id="brand-protection-heading"
            className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Your Identity Should{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Belong to You.
            </span>
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "rgba(217,214,227,0.65)", fontFamily: "var(--font-inter)" }}
          >
            When someone else uses your name, likeness, or brand without
            authorization, it undermines trust and damages credibility.
            SocialAssist helps you identify and address impersonation, fake
            profiles, and fraudulent representation across platforms.
          </p>

          {[
            { label: "Impersonation & fake profiles", desc: "Identify and report unauthorized accounts" },
            { label: "Fraudulent representation", desc: "Address misleading brand usage" },
            { label: "Reputation protection", desc: "Support for reputation-related concerns" },
            { label: "Brand identity security", desc: "Protecting your digital presence" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-3 mb-4 p-3 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(16,16,22,0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(74,22,168,0.25)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#C5A7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "#FFFFFF", fontFamily: "var(--font-inter)" }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(217,214,227,0.45)", fontFamily: "var(--font-inter)" }}>{item.desc}</p>
              </div>
            </div>
          ))}

          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-4 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4A16A8, #7C3AED)",
              boxShadow: "0 0 24px rgba(74,22,168,0.3)",
            }}
          >
            Protect Your Brand →
          </button>
        </div>
      </div>
    </section>
  );
}
