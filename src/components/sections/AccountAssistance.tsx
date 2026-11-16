"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon, XIcon } from "@/components/icons/PlatformIcons";

export default function AccountAssistance() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(1);

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

  const STAGES = [
    {
      title: "Suspension / Lockout",
      badge: "Incident Flagged",
      color: "#EF4444",
      desc: "Account disabled for alleged TOC, 180-day appeal lockout, or 2FA takeover.",
      metrics: "Access: 0% · Status: Disabled",
    },
    {
      title: "Direct Network Escalation",
      badge: "In Protocol",
      color: "#38BDF8",
      desc: "Submitting verified case file via dedicated representative portals without passwords.",
      metrics: "Audit: Passed · Turnaround: 24-48h",
    },
    {
      title: "Restoration & Fortification",
      badge: "Resolved",
      color: "#10B981",
      desc: "Full administrative access recovered, security keys refreshed, and profile safeguarded.",
      metrics: "Access: 100% · Status: Active",
    },
  ];

  return (
    <section
      id="account-assistance"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden"
      aria-labelledby="account-heading"
    >
      {/* Background Soft Blue/Indigo Glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[55vw] max-w-[800px] h-[500px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — 3D Interactive Restoration Interface */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-24px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 dark-console-box backdrop-blur-2xl shadow-2xl">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28CA42]" />
              </div>
              <div className="text-[11px] font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                SocialAssist · Case Recovery Engine v2.0
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Problem to Solution Stage Selector */}
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Recovery Progression:</span>
                <span className="text-cyan-400 font-bold">Stage 0{activeStage + 1} of 03</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STAGES.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveStage(idx as 0 | 1 | 2)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      activeStage === idx
                        ? "bg-white/10 border-white/30 shadow-md"
                        : "bg-white/[0.02] border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/15"
                    }`}
                  >
                    <div className="text-[10px] font-mono text-zinc-400">Step 0{idx + 1}</div>
                    <div className="text-xs font-semibold text-white mt-0.5 truncate">{s.title}</div>
                  </button>
                ))}
              </div>

              {/* Active Stage Simulation Card */}
              <div
                className="p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden"
                style={{
                  background:
                    activeStage === 0
                      ? "rgba(239, 68, 68, 0.06)"
                      : activeStage === 1
                      ? "rgba(56, 189, 248, 0.08)"
                      : "rgba(16, 185, 129, 0.08)",
                  borderColor:
                    activeStage === 0
                      ? "rgba(239, 68, 68, 0.25)"
                      : activeStage === 1
                      ? "rgba(56, 189, 248, 0.3)"
                      : "rgba(16, 185, 129, 0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold"
                    style={{
                      background: `${STAGES[activeStage].color}20`,
                      color: STAGES[activeStage].color,
                      border: `1px solid ${STAGES[activeStage].color}40`,
                    }}
                  >
                    {STAGES[activeStage].badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {STAGES[activeStage].metrics}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-1.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {STAGES[activeStage].title}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal" style={{ fontFamily: "var(--font-inter)" }}>
                  {STAGES[activeStage].desc}
                </p>
              </div>

              {/* Supported Platforms Strip */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono">Covered Channels:</span>
                <div className="flex items-center gap-2.5">
                  <InstagramIcon className="w-4 h-4 opacity-75" />
                  <FacebookIcon className="w-4 h-4 opacity-75" />
                  <TikTokIcon className="w-4 h-4 opacity-75" />
                  <WhatsAppIcon className="w-4 h-4 opacity-75" />
                  <XIcon className="w-4 h-4 opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Copy */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(24px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block text-cyan-400 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ✦ Rapid Account Restoration Protocol ✦
          </span>
          <h2
            id="account-heading"
            className="text-3xl md:text-5xl font-black mb-5 leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            When Access Stops,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Assistance Starts.
            </span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-4 text-zinc-300 font-normal"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            SocialAssist provides specialized escalation for creators, brands, and public figures facing
            account restrictions, unfair suspensions, disabled profiles, and compromised access across
            Instagram, Facebook, TikTok, WhatsApp, and X.
          </p>
          <p
            className="text-sm leading-relaxed mb-8 text-zinc-400 font-normal"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Whether your account has been breached by malicious actors, disabled through automated bot false-positives,
            or locked in a 180-day appeal loop — our internal rep channels navigate the direct appeals process.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              "Disabled & restricted account appeals",
              "Hacked & compromised profile recovery",
              "Permanent 180-day suspension relief",
              "2FA device lockout resolution",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-500/15 border border-cyan-400/30">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-zinc-300 font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className={`px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-[1.03] flex items-center gap-2 ${
              isLight
                ? "btn-light-cyan text-slate-950 font-bold shadow-md hover:shadow-lg"
                : "text-white border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 shadow-lg shadow-cyan-950/40"
            }`}
          >
            <span>Request Account Assistance</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
