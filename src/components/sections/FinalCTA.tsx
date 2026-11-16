"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import TelegramInquiry from "./TelegramInquiry";

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
      { threshold: 0.15 }
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
      {/* Background Soft Glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "80vw",
          height: "80vw",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          background: isLight
            ? "radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)",
          filter: "blur(90px)",
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
            className={`text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full font-mono ${
              isLight
                ? "text-sky-700 border border-sky-300 bg-sky-100/70 shadow-sm"
                : "text-cyan-400 border border-cyan-400/30 bg-cyan-950/30"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ✦ Direct Escalation & Resolution ✦
          </span>
        </div>

        {/* Headline */}
        <h2
          id="cta-heading"
          className={`mb-5 tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 800,
            lineHeight: 1.1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s",
          }}
        >
          Your Digital Problem Deserves
          <br />
          <span
            className={
              isLight
                ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-extrabold"
                : "inline-block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 font-extrabold"
            }
          >
            a Smarter Solution.
          </span>
        </h2>

        {/* Supporting line */}
        <p
          className={`mb-10 text-base sm:text-lg max-w-xl mx-auto font-normal ${
            isLight ? "text-slate-600" : "text-zinc-300"
          }`}
          style={{
            fontFamily: "var(--font-inter)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s",
          }}
        >
          Connect with SocialAssist and find the direct, verified path forward.
        </p>

        {/* Action Buttons */}
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
            className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
              isLight
                ? "btn-light-purple text-slate-950 font-bold shadow-md hover:shadow-lg"
                : "text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-950/50"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span>Open Telegram Channel</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M1 8h14M9 3l6 5-6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <button
            onClick={() => scrollTo("services")}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
              isLight
                ? "bg-white/90 text-slate-900 border border-slate-300/80 shadow-sm hover:bg-white"
                : "border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-zinc-200 backdrop-blur-xl"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Explore Services
          </button>
        </div>

        {/* Embedded Telegram Inquiry Form */}
        <div className="mt-8 text-left">
          <TelegramInquiry />
        </div>
      </div>
    </section>
  );
}
