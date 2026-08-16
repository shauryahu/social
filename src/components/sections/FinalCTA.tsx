"use client";

import { useEffect, useRef, useState } from "react";
import TelegramInquiry from "./TelegramInquiry";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
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
      className="relative z-10 pt-24 pb-20 px-4 md:px-8 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Very large violet glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "90vw",
          height: "90vw",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(74,22,168,0.25) 0%, rgba(74,22,168,0.08) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Label */}
        <div
          className="mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{
              color: "#9B5CFF",
              background: "rgba(155,92,255,0.1)",
              border: "1px solid rgba(155,92,255,0.2)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Ready to Start?
          </span>
        </div>

        {/* Headline */}
        <h2
          id="cta-heading"
          className="mb-5"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#FFFFFF",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s",
          }}
        >
          Your Digital Problem Deserves
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #C5A7FF 0%, #9B5CFF 50%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            a Smarter Solution.
          </span>
        </h2>

        {/* Supporting line */}
        <p
          className="mb-10 text-lg"
          style={{
            color: "rgba(217,214,227,0.55)",
            fontFamily: "var(--font-inter)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s",
          }}
        >
          Connect with SocialAssist and find the right path forward.
        </p>

        {/* Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto mb-12 sm:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.3s, transform 0.7s ease-out 0.3s",
          }}
        >
          <a
            href="https://t.me/socialassist"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4A16A8, #7C3AED, #9B5CFF)",
              boxShadow: "0 0 40px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Contact
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M1 8h14M9 3l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <button
            onClick={() => scrollTo("services")}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              color: "#D9D6E3",
              fontFamily: "var(--font-inter)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.4)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            }}
          >
            Explore Services
          </button>
        </div>

        {/* Embedded Telegram Inquiry Form directly below 'Smarter Solution' headline & buttons */}
        <div className="mt-8 mb-16 text-left">
          <TelegramInquiry />
        </div>

        {/* Slogan */}
        <div
          className="mt-12"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.5s",
          }}
        >
          <p
            className="text-xs font-medium tracking-[0.4em] uppercase"
            style={{ color: "rgba(197,167,255,0.35)", fontFamily: "var(--font-inter)" }}
          >
            We Resolve · We Protect · We Elevate
          </p>
        </div>
      </div>
    </section>
  );
}
