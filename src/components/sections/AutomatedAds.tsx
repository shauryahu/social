"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";
import OrbitingCirclesGlobeDemo from "@/components/ui/orbiting-circles-02";

interface FeatureCard {
  num: string;
  title: string;
  desc: string;
  detail: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    num: "01",
    title: "Multi-Platform Automation",
    desc: "Simultaneous distribution and programmatic campaign management across all supported platforms from a single controller.",
    detail:
      "Centralized orchestration coordinates asset formatting, caption localization, and synchronized deployment pipelines without requiring manual multi-app logins.",
  },
  {
    num: "02",
    title: "Targeted Audience Delivery",
    desc: "Reach specific interest groups, geographic communities, and targeted demographics with precision timing.",
    detail:
      "Time-zone intelligent scheduling aligns release cadences with peak engagement windows, optimizing organic visibility and impression efficiency.",
  },
  {
    num: "03",
    title: "Reliable Distribution Systems",
    desc: "Engineered pipelines ensure uninterrupted scheduled delivery without common rate limiting and posting failures.",
    detail:
      "Automated retry protocols and adaptive request throttling maintain zero-downtime execution, safeguarding campaigns against platform API interruptions.",
  },
  {
    num: "04",
    title: "Comprehensive Analytics",
    desc: "Full reporting on reach, impressions, audience engagement, and delivery performance across all active channels.",
    detail:
      "Unified cross-platform metrics aggregate click-through ratios, community retention, and conversion signals into clean, actionable intelligence.",
  },
];

export default function AutomatedAds() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    setActiveCard(index);
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setActiveCard((current) => (current === index ? null : current));
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setActiveCard((current) => (current === index ? null : index));
  }, []);

  return (
    <section
      id="automation"
      ref={ref}
      className="relative z-10 py-20 sm:py-24 lg:py-28 px-6 sm:px-9 lg:px-12 overflow-hidden"
      aria-labelledby="automation-heading"
    >
      {/* Soft background ambient accent */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          right: "-10vw",
          top: "0",
          background: isLight
            ? "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Seamless full-width atmospheric top & bottom edge blends */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-10"
        style={{
          background: isLight
            ? "linear-gradient(to top, transparent 0%, rgba(243, 244, 247, 0.4) 50%, #F3F4F7 100%)"
            : "linear-gradient(to top, transparent 0%, rgba(7, 7, 10, 0.4) 50%, #07070A 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10"
        style={{
          background: isLight
            ? "linear-gradient(to bottom, transparent 0%, rgba(243, 244, 247, 0.4) 50%, #F3F4F7 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(7, 7, 10, 0.4) 50%, #07070A 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Heading */}
        <div
          className="text-center mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block font-mono"
            style={{
              fontFamily: "var(--font-inter)",
              color: isLight ? "#0284C7" : "#38BDF8",
            }}
          >
            ✦ Precision Advertising Engine ✦
          </span>
          <h2
            id="automation-heading"
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight transition-colors duration-200"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: isLight ? "#0F172A" : "#FFFFFF",
            }}
          >
            Advertising That{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Keeps Moving.
            </span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto transition-colors duration-200"
            style={{
              fontFamily: "var(--font-inter)",
              color: isLight ? "#64748B" : "#A1A1AA",
            }}
          >
            Automated distribution solutions for brands looking to reach
            communities across supported social media platforms and
            marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Orbiting Circles Globe Visualization */}
          <div
            className="flex justify-center items-center relative w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s",
            }}
          >
            <OrbitingCirclesGlobeDemo />
          </div>

          {/* Apple iOS Glassmorphic Interactive Feature Cards */}
          <div
            className="flex flex-col gap-3.5"
            onMouseLeave={() => setActiveCard(null)}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s",
            }}
          >
            {FEATURE_CARDS.map((card, i) => {
              const isExpanded = activeCard === i;

              // Apple iOS / macOS glassmorphic styling
              const cardBg = isLight
                ? isExpanded
                  ? "rgba(255, 255, 255, 0.94)"
                  : "rgba(255, 255, 255, 0.65)"
                : isExpanded
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(255, 255, 255, 0.035)";

              const cardBorder = isLight
                ? isExpanded
                  ? "1px solid rgba(203, 213, 225, 0.9)"
                  : "1px solid rgba(226, 232, 240, 0.75)"
                : isExpanded
                ? "1px solid rgba(255, 255, 255, 0.18)"
                : "1px solid rgba(255, 255, 255, 0.08)";

              const cardShadow = isLight
                ? isExpanded
                  ? "0 12px 32px -4px rgba(15, 23, 42, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 1)"
                  : "0 3px 14px -2px rgba(15, 23, 42, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)"
                : isExpanded
                ? "0 12px 36px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)"
                : "0 4px 20px -2px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.09)";

              const numBg = isLight
                ? "rgba(0, 0, 0, 0.04)"
                : "rgba(255, 255, 255, 0.05)";
              const numBorder = isLight
                ? "1px solid rgba(0, 0, 0, 0.06)"
                : "1px solid rgba(255, 255, 255, 0.08)";
              const numColor = isLight ? "#64748B" : "#94A3B8";

              const titleColor = isLight ? "#0F172A" : "#FFFFFF";
              const descColor = isLight ? "#64748B" : "#94A3B8";
              const detailColor = isLight ? "#475569" : "#CBD5E1";
              const dividerColor = isLight
                ? "rgba(0, 0, 0, 0.06)"
                : "rgba(255, 255, 255, 0.07)";

              return (
                <div
                  key={card.title}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => handleCardClick(i)}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseOver={() => handleMouseEnter(i)}
                  onPointerEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(i);
                    }
                  }}
                  className="group relative rounded-2xl p-4 sm:p-5 cursor-pointer select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
                  style={{
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: cardShadow,
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  {/* Subtle top specular glass reflection */}
                  <div
                    className="absolute inset-x-0 top-0 h-px pointer-events-none transition-opacity duration-300"
                    style={{
                      opacity: isLight ? 0.8 : 0.45,
                      background: isLight
                        ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)"
                        : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                    }}
                  />

                  {/* Header Row: Minimal Number Badge + Heading & Primary Desc */}
                  <div className="flex items-start gap-3.5">
                    {/* Minimal Grey Numbering Badge */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors duration-300"
                      style={{
                        background: numBg,
                        border: numBorder,
                        color: numColor,
                      }}
                    >
                      {card.num}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[15px] sm:text-base font-semibold leading-snug tracking-tight transition-colors duration-200"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: titleColor,
                        }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="text-xs sm:text-[13.5px] leading-relaxed mt-1 transition-colors duration-200"
                        style={{
                          fontFamily: "var(--font-inter)",
                          color: descColor,
                        }}
                      >
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* Smooth Animated Secondary Description via CSS Grid */}
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div
                        className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isExpanded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2 pointer-events-none"
                        }`}
                        style={{
                          paddingTop: "0.75rem",
                          paddingLeft: "2.625rem",
                          paddingBottom: "0.25rem",
                          transitionDelay: isExpanded ? "50ms" : "0ms",
                        }}
                      >
                        {/* Delicate hairline separator */}
                        <div
                          className="h-px w-full mb-2"
                          style={{ background: dividerColor }}
                        />
                        <p
                          className="text-xs sm:text-[13px] leading-relaxed font-normal transition-colors duration-200"
                          style={{
                            fontFamily: "var(--font-inter)",
                            color: detailColor,
                          }}
                        >
                          {card.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
