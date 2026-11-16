"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const WHY_ITEMS = [
  {
    title: "Established Experience",
    desc: "Operating since 2021 with proven expertise across digital platforms.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="url(#wi1)" strokeWidth="1.2"/>
        <path d="M10 6v4l3 2" stroke="url(#wi1)" strokeWidth="1.2" strokeLinecap="round"/>
        <defs><linearGradient id="wi1" x1="2" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    title: "Multi-Platform",
    desc: "Support across Instagram, Facebook, WhatsApp, TikTok, X, and more.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" fill="url(#wi2)" opacity="0.8"/>
        <circle cx="10" cy="10" r="7" stroke="url(#wi2)" strokeWidth="1" strokeDasharray="3 2"/>
        <defs><linearGradient id="wi2" x1="3" y1="3" x2="17" y2="17" gradientUnits="userSpaceOnUse"><stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#9B5CFF"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    title: "Specialized Assistance",
    desc: "Solutions purpose-built for specific digital problems.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10l5 5 7-8" stroke="url(#wi3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs><linearGradient id="wi3" x1="4" y1="10" x2="16" y2="10" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFFFF"/><stop offset="1" stopColor="#C5A7FF"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    title: "Integrated Network",
    desc: "Account assistance, exchange, and advertising in one ecosystem.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="2" stroke="url(#wi4)" strokeWidth="1.2"/>
        <rect x="11" y="2" width="7" height="7" rx="2" stroke="url(#wi4)" strokeWidth="1.2"/>
        <rect x="6.5" y="11" width="7" height="7" rx="2" stroke="url(#wi4)" strokeWidth="1.2"/>
        <defs><linearGradient id="wi4" x1="2" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    title: "Direct Communication",
    desc: "Clear pathways for contacting the team without intermediaries.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6l-4 3V5z" stroke="url(#wi5)" strokeWidth="1.2" strokeLinejoin="round"/>
        <defs><linearGradient id="wi5" x1="2" y1="3" x2="18" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#9B5CFF"/></linearGradient></defs>
      </svg>
    ),
  },
];

export default function AboutSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* About + Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Brand story */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            }}
          >
            <span
              className={`text-xs font-semibold tracking-widest uppercase mb-4 block font-mono ${
                isLight ? "text-purple-700" : "text-purple-400"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ✦ About SocialAssist ✦
            </span>
            <h2
              id="about-heading"
              className={`text-3xl md:text-4xl font-black mb-6 leading-tight tracking-tight ${
                isLight ? "text-slate-950" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Built Around Digital Problems.{" "}
              <span
                className={
                  isLight
                    ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 font-black"
                    : "inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 font-black"
                }
              >
                Designed Around Solutions.
              </span>
            </h2>
            <p
              className={`text-base leading-relaxed mb-5 ${
                isLight ? "text-slate-700 font-medium" : "text-zinc-300"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              SocialAssist was established in{" "}
              <span className={`font-bold ${isLight ? "text-purple-700" : "text-purple-300"}`}>2021</span> with a
              singular goal: provide specialized assistance for increasingly
              complex problems across modern social platforms. The digital
              landscape had grown — and so had its problems.
            </p>
            <p
              className={`text-base leading-relaxed mb-5 ${
                isLight ? "text-slate-700 font-medium" : "text-zinc-300"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              What began as account recovery and restoration evolved into a
              broader network of digital services — encompassing verification
              support, brand protection, cryptocurrency exchange, and automated
              advertising solutions.
            </p>
            <p
              className={`text-base leading-relaxed ${
                isLight ? "text-slate-700 font-medium" : "text-zinc-300"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Today, SocialAssist operates as a unified digital assistance
              network — one point of contact for multiple platform-related
              needs.
            </p>

            {/* Founder badge */}
            <div
              className={`mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl ${
                isLight
                  ? "bg-white/95 border border-slate-200/90 shadow-md"
                  : "bg-[#101016]/70 border border-white/10"
              }`}
              style={{
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                G
              </div>
              <div>
                <p
                  className={`text-sm font-bold ${isLight ? "text-slate-950" : "text-white"}`}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Gixxu
                </p>
                <p
                  className={`text-xs ${isLight ? "text-slate-500 font-medium" : "text-purple-300/80"}`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Founder, SocialAssist · Est. 2021
                </p>
              </div>
            </div>
          </div>

          {/* Timeline / stat visual */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s",
            }}
          >
            <div
              className={`rounded-3xl p-8 h-full ${
                isLight
                  ? "bg-white/95 border border-slate-200/90 shadow-xl"
                  : "bg-[#101016]/55 border border-white/10 shadow-2xl"
              }`}
              style={{
                backdropFilter: "blur(20px)",
              }}
            >
              <h3
                className={`text-lg font-bold mb-6 ${isLight ? "text-slate-950" : "text-white"}`}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                The Journey
              </h3>

              {[
                { year: "2021", label: "Foundation", desc: "SocialAssist established. Focus on account recovery." },
                { year: "2022", label: "Expansion", desc: "Verification support and brand protection added." },
                { year: "2023", label: "Evolution", desc: "Crypto exchange services and automation introduced." },
                { year: "2024+", label: "Network", desc: "Full integrated digital assistance ecosystem." },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isLight
                          ? "bg-purple-100 text-purple-800 border border-purple-300"
                          : "bg-purple-900/40 text-purple-200 border border-purple-500/30"
                      }`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {i + 1}
                    </div>
                    {i < 3 && (
                      <div
                        className={`w-px flex-1 mt-1 ${isLight ? "bg-purple-200" : "bg-purple-500/20"}`}
                        style={{ minHeight: 20 }}
                      />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-xs font-bold ${isLight ? "text-purple-700" : "text-purple-400"}`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item.year}
                      </span>
                      <span
                        className={`text-sm font-bold ${isLight ? "text-slate-950" : "text-white"}`}
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${isLight ? "text-slate-600 font-medium" : "text-zinc-400"}`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why SocialAssist */}
        <div
          className="text-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease-out 0.2s",
          }}
        >
          <h2
            className={`text-2xl md:text-3xl font-black ${isLight ? "text-slate-950" : "text-white"}`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Why{" "}
            <span
              className={
                isLight
                  ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 font-black"
                  : "inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 font-black"
              }
            >
              SocialAssist
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {WHY_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`p-5 rounded-2xl ${
                isLight
                  ? "bg-white/95 border border-slate-200/90 shadow-md"
                  : "bg-[#101016]/60 border border-white/10"
              }`}
              style={{
                backdropFilter: "blur(16px)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease-out ${0.2 + i * 0.08}s, transform 0.5s ease-out ${0.2 + i * 0.08}s`,
              }}
            >
              <div className="mb-3">{item.icon}</div>
              <h3
                className={`text-sm font-bold mb-1.5 ${isLight ? "text-slate-950" : "text-white"}`}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {item.title}
              </h3>
              <p
                className={`text-xs leading-relaxed ${isLight ? "text-slate-600 font-medium" : "text-zinc-400"}`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
