"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

// Symmetrical 4-point sparkle star for badge decoration
function StarIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ color: "#168DEB" }}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

export default function FinalCTA() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative z-10 pt-10 sm:pt-14 pb-20 px-4 md:px-8 overflow-hidden transition-colors duration-500"
      aria-labelledby="cta-heading"
      style={{
        backgroundColor: isLight ? "transparent" : "#07070A",
      }}
    >
      {/* Target anchor for #inquiry links */}
      <div id="inquiry" className="absolute top-0 pointer-events-none" />
      {/* ── 1. Subtle Square Grid (Dark Mode Only) ── */}
      {!isLight && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(80, 110, 170, 0.055) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(80, 110, 170, 0.055) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            backgroundPosition: "center top",
          }}
        />
      )}

      {/* ── 2. Upper-Left & Lower-Right Ambient Shapes (Dark Mode Only) ── */}
      {!isLight && (
        <>
          <div
            aria-hidden="true"
            className="absolute -top-[120px] -left-[120px] w-[560px] sm:w-[680px] h-[560px] sm:h-[680px] rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle at 45% 45%, rgba(22, 141, 235, 0.09) 0%, rgba(238, 231, 255, 0.70) 32%, rgba(228, 238, 255, 0.50) 58%, transparent 75%)",
              filter: "blur(90px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-[220px] -right-[120px] sm:-right-[160px] w-[500px] sm:w-[640px] h-[500px] sm:h-[640px] rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle at 55% 55%, rgba(160, 45, 245, 0.07) 0%, rgba(238, 231, 255, 0.65) 35%, rgba(228, 238, 255, 0.45) 60%, transparent 75%)",
              filter: "blur(100px)",
            }}
          />
        </>
      )}

      {/* ── 3. Seamless Naturally Diffused Lavender Aura Behind Submission Form ── */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{
          top: "22%",
          width: "min(1400px, 98vw)",
          height: "960px",
          background: isLight
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(167, 139, 250, 0.18) 0%, rgba(196, 181, 253, 0.11) 32%, rgba(224, 219, 254, 0.05) 55%, transparent 75%)"
            : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(147, 51, 234, 0.14) 0%, rgba(124, 58, 237, 0.08) 32%, rgba(79, 70, 229, 0.03) 55%, transparent 75%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── 4. Seamless Background Merge into Footer ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none z-0"
        style={{
          height: "280px",
          background: isLight
            ? "linear-gradient(180deg, rgba(233, 235, 240, 0) 0%, rgba(233, 235, 240, 0.25) 30%, rgba(233, 235, 240, 0.65) 65%, rgba(233, 235, 240, 0.95) 90%, #e9ebf0 100%)"
            : "linear-gradient(180deg, rgba(7, 7, 10, 0) 0%, rgba(3, 3, 9, 0.35) 35%, rgba(3, 3, 9, 0.75) 75%, #030309 100%)",
        }}
      />

      {/* ── 4. Main Content Container ── */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Top Badge: ✦ DIRECT ESCALATION & RESOLUTION ✦ */}
        <div
          className="inline-flex items-center gap-2.5 px-4 sm:px-4.5 py-1.5 rounded-full text-[12.5px] font-[600] tracking-[1.2px] uppercase select-none transition-all duration-700 mb-6"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid #C7DFFF",
            color: "#0879CE",
            boxShadow:
              "0 2px 14px rgba(22, 141, 235, 0.08), 0 1px 3px rgba(50, 107, 238, 0.04)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          <StarIcon className="w-3 h-3 text-[#168DEB] shrink-0" />
          <span style={{ color: "#0879CE" }}>DIRECT ESCALATION &amp; RESOLUTION</span>
          <StarIcon className="w-3 h-3 text-[#168DEB] shrink-0" />
        </div>

        {/* Main Headline */}
        <h2
          id="cta-heading"
          className="font-[750] sm:font-[800] text-center tracking-[-0.03em] md:tracking-[-1.8px] leading-[1.12] text-[34px] sm:text-[42px] md:text-[50px] lg:text-[54px] max-w-4xl mx-auto transition-all duration-700 delay-100"
          style={{
            fontFamily:
              "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <span
            className="block text-[#101522]"
            style={{ color: "#101522" }}
          >
            Your Digital Problem Deserves
          </span>
          <span
            className="block mt-1 sm:mt-1.5 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #168DEB 0%, #326BEE 33%, #713CF6 67%, #A02DF5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            a Smarter Solution.
          </span>
        </h2>

        {/* Telegram Desk Custom Element */}
        <telegram-desk></telegram-desk>
      </div>
    </section>
  );
}
