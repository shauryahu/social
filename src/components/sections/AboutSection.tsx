"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import CurvedLensCarousel, { type LensSlide } from "@/components/ui/3d-curved-carousel";
import JourneyScrollTimeline from "@/components/ui/JourneyScrollTimeline";

const WHY_SLIDES: LensSlide[] = [
  {
    kicker: "SINCE 2021",
    title: "Established Experience",
    caption: "Operating since 2021 with proven expertise across digital platforms.",
    image: "/images/why/established-experience.webp",
  },
  {
    kicker: "GLOBAL REACH",
    title: "Multi-Platform",
    caption: "Support across Instagram, Facebook, WhatsApp, TikTok, X, and more.",
    image: "/images/why/multi-platform.webp",
  },
  {
    kicker: "TAILORED SOLUTIONS",
    title: "Specialized Assistance",
    caption: "Solutions purpose-built for specific digital problems.",
    image: "/images/why/specialized-assistance.webp",
  },
  {
    kicker: "ALL-IN-ONE ECOSYSTEM",
    title: "Integrated Network",
    caption: "Account assistance, exchange, and advertising in one ecosystem.",
    image: "/images/why/integrated-network.webp",
  },
  {
    kicker: "NO INTERMEDIARIES",
    title: "Direct Communication",
    caption: "Clear pathways for contacting the team without intermediaries.",
    image: "/images/why/direct-communication.webp",
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
        {/* About + Story + Interactive 3D Journey Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 items-start">
          {/* Brand story (Sticky on Desktop) */}
          <div
            className="lg:col-span-5 lg:sticky lg:top-28 self-start"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
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

          {/* Interactive 3D Scroll Timeline (Sticky Runway on Desktop) */}
          <div
            className="lg:col-span-7"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
              transition: "opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s",
            }}
          >
            <JourneyScrollTimeline isLight={isLight} />
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
            className="text-2xl md:text-3xl font-black text-black"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Why SocialAssist
          </h2>
        </div>

        <div
          className="w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#DDE0E4] border border-[#DDE0E4] shadow-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out 0.25s, transform 0.6s ease-out 0.25s",
          }}
        >
          <CurvedLensCarousel
            slides={WHY_SLIDES}
            label="WHY SOCIALASSIST"
            bend={0.5}
            background="#DDE0E4"
            ink="#000000"
            height="580px"
          />
        </div>
      </div>
    </section>
  );
}
