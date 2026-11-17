"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import TelegramInquiry from "./TelegramInquiry";

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

// Authentic Telegram paper-plane vector icon
function TelegramPlaneIcon({ className = "w-[22px] h-[22px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21.5 3.5L2.8 10.7C1.5 11.2 1.5 12 2.6 12.3L7.4 13.8L18.6 6.7C19.1 6.4 19.6 6.6 19.2 6.9L10.1 15.1H10.1L9.8 19.8C10.3 19.8 10.5 19.6 10.8 19.3L13.1 17.1L18 20.7C18.9 21.2 19.5 20.9 19.7 19.8L22.9 4.7C23.2 3.4 22.4 2.8 21.5 3.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function FinalCTA() {
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative z-10 pt-10 sm:pt-14 pb-20 px-4 md:px-8 overflow-hidden transition-colors duration-500"
      aria-labelledby="cta-heading"
      style={{
        backgroundColor: "#FAFAFD",
      }}
    >
      {/* ── 1. Subtle Square Grid (64px, rgba(80, 110, 170, 0.055), 1px) ── */}
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

      {/* ── 2. Upper-Left Ambient Gradient Shape: Blue & Lavender Radial Glow ── */}
      <div
        aria-hidden="true"
        className="absolute -top-[120px] -left-[120px] w-[560px] sm:w-[680px] h-[560px] sm:h-[680px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(22, 141, 235, 0.09) 0%, rgba(238, 231, 255, 0.70) 32%, rgba(228, 238, 255, 0.50) 58%, transparent 75%)",
          filter: "blur(90px)",
        }}
      />

      {/* ── 3. Lower-Right Ambient Gradient Shape: Soft Lavender & Pale Blue ── */}
      <div
        aria-hidden="true"
        className="absolute top-[220px] -right-[120px] sm:-right-[160px] w-[500px] sm:w-[640px] h-[500px] sm:h-[640px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 55% 55%, rgba(160, 45, 245, 0.07) 0%, rgba(238, 231, 255, 0.65) 35%, rgba(228, 238, 255, 0.45) 60%, transparent 75%)",
          filter: "blur(100px)",
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

        {/* Subtitle */}
        <p
          className="mt-5 text-[17.5px] sm:text-[18.5px] font-[450] leading-[1.6] text-center max-w-[850px] mx-auto px-4 transition-all duration-700 delay-200"
          style={{
            color: "#586780",
            fontFamily: "var(--font-inter), sans-serif",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          Connect with SocialAssist and find the direct, verified path forward.
        </p>

        {/* Action Buttons Row */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto transition-all duration-700 delay-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {/* Primary CTA — Open Telegram Channel with sliding icon animation */}
          <a
            href="https://t.me/socialassist"
            target="_blank"
            rel="noopener noreferrer"
            className="keep-white group relative h-[66px] ps-8 pe-[74px] hover:ps-[74px] hover:pe-8 rounded-full flex items-center justify-center text-white text-[17px] font-[650] tracking-[-0.01em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 select-none w-full sm:w-auto overflow-hidden cursor-pointer"
            style={{
              background:
                "linear-gradient(110deg, #42A5F5 0%, #326BEE 48%, #913CF4 100%)",
              boxShadow:
                "0 10px 28px -4px rgba(50, 107, 238, 0.35), 0 4px 12px -2px rgba(145, 60, 244, 0.25)",
              color: "#FFFFFF",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            <span
              className="keep-white relative z-10 transition-all duration-500 whitespace-nowrap"
              style={{ color: "#FFFFFF" }}
            >
              Open Telegram Channel
            </span>
            <div
              className="absolute right-[7px] w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:right-[calc(100%-59px)] group-hover:rotate-45"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
              }}
            >
              <TelegramPlaneIcon className="w-[22px] h-[22px] text-white shrink-0" />
            </div>
          </a>

          {/* Secondary CTA — Explore Services */}
          <button
            type="button"
            onClick={() => scrollTo("services")}
            className="group relative h-[66px] px-8 sm:px-9 rounded-full flex items-center justify-center gap-3 bg-white text-[17px] font-[600] tracking-[-0.01em] border border-[#E3E8F2] hover:border-[#D3DDF0] transition-all duration-250 ease-out hover:-translate-y-0.5 active:translate-y-0 select-none w-full sm:w-auto"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#101522",
              borderColor: "#E3E8F2",
              boxShadow:
                "0 4px 16px rgba(16, 21, 34, 0.05), 0 1px 3px rgba(16, 21, 34, 0.03)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            <LayoutGrid
              size={22}
              strokeWidth={1.8}
              style={{ color: "#101522" }}
              className="shrink-0"
            />
            <span style={{ color: "#101522" }}>Explore Services</span>
          </button>
        </div>

        {/* Embedded Telegram Inquiry Form */}
        <div className="mt-12 sm:mt-16 text-left">
          <TelegramInquiry />
        </div>
      </div>
    </section>
  );
}
