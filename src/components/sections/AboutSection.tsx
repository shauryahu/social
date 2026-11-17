"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import CurvedLensCarousel, { type LensSlide } from "@/components/ui/3d-curved-carousel";

const WHY_SLIDES: LensSlide[] = [
  {
    kicker: "SINCE 2021",
    title: "Established Experience",
    caption: "Operating since 2021 with proven expertise across digital platforms.",
    image: "/images/why/established-experience.png",
  },
  {
    kicker: "GLOBAL REACH",
    title: "Multi-Platform",
    caption: "Support across Instagram, Facebook, WhatsApp, TikTok, X, and more.",
    image: "/images/why/multi-platform.png",
  },
  {
    kicker: "TAILORED SOLUTIONS",
    title: "Specialized Assistance",
    caption: "Solutions purpose-built for specific digital problems.",
    image: "/images/why/specialized-assistance.png",
  },
  {
    kicker: "ALL-IN-ONE ECOSYSTEM",
    title: "Integrated Network",
    caption: "Account assistance, exchange, and advertising in one ecosystem.",
    image: "/images/why/integrated-network.png",
  },
  {
    kicker: "NO INTERMEDIARIES",
    title: "Direct Communication",
    caption: "Clear pathways for contacting the team without intermediaries.",
    image: "/images/why/direct-communication.png",
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
          className="text-center mb-8"
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

        <div
          className={`w-full rounded-2xl sm:rounded-3xl overflow-hidden border ${
            isLight
              ? "border-slate-200/90 shadow-[0_12px_40px_-12px_rgba(70,90,140,0.12)] bg-gradient-to-b from-white/90 to-white/60"
              : "border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] bg-gradient-to-b from-[#101016]/80 to-[#0c0c12]/60"
          } backdrop-blur-xl`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out 0.25s, transform 0.6s ease-out 0.25s",
          }}
        >
          <CurvedLensCarousel
            slides={WHY_SLIDES}
            label="Why SocialAssist"
            bend={0.5}
            background="transparent"
            ink={isLight ? "#0f172a" : "#f8fafc"}
            height="580px"
          />
        </div>
      </div>
    </section>
  );
}
