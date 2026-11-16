"use client";

import { useEffect, useRef, useState } from "react";

export default function BrandProtection() {
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

  const threats = [
    { label: "Executive Impersonation", status: "Instant Takedown" },
    { label: "Fake Merchant Profiles", status: "Zero-Day Removal" },
    { label: "Fraudulent Trademark Representation", status: "Legal Escalation" },
    { label: "Targeted Reputation Attacks", status: "Continuous Defense" },
  ];

  return (
    <section
      id="brand-protection"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden"
      aria-labelledby="brand-protection-heading"
    >
      {/* Background Soft Blue/Cyan Light Glow */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[55vw] max-w-[800px] h-[500px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Shield Visual Presentation (3D Shield & Threat Radar) */}
        <div
          className="flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <div className="relative w-full max-w-md">
            {/* Ambient Shield Aura */}
            <div
              className="absolute inset-0 m-auto w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            {/* 3D Glass Shield Container */}
            <div
              className="relative rounded-3xl p-8 sm:p-10 flex flex-col items-center border border-white/10 bg-[#101018]/85 backdrop-blur-2xl shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500"
            >
              {/* Top Specular Shimmer */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

              {/* 3D Realistic Layered Defense Shield */}
              <div className="relative w-28 h-32 sm:w-32 sm:h-36 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                {/* Back Shield Shadow & Glow */}
                <svg
                  width="120"
                  height="136"
                  viewBox="0 0 90 100"
                  fill="none"
                  className="drop-shadow-[0_12px_28px_rgba(37,99,235,0.45)]"
                >
                  {/* Outer Beveled Shield Border */}
                  <path
                    d="M45 4L8 18v27c0 24 15.5 45 37 51 21.5-6 37-27 37-51V18L45 4z"
                    fill="url(#shield-grad-base)"
                  />
                  {/* Inner Metallic Bevel */}
                  <path
                    d="M45 8L12 20v24c0 21.5 14 40.5 33 46 19-5.5 33-24.5 33-46V20L45 8z"
                    fill="url(#shield-grad-inner)"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                  />
                  {/* Defense Core Keyhole / Lock Vector */}
                  <path
                    d="M45 34a7 7 0 0 0-7 7c0 2.8 1.6 5.2 4 6.3V56a3 3 0 0 0 6 0v-8.7c2.4-1.1 4-3.5 4-6.3a7 7 0 0 0-7-7z"
                    fill="#FFFFFF"
                    className="drop-shadow-[0_0_12px_#38bdf8]"
                  />
                  <defs>
                    <linearGradient id="shield-grad-base" x1="8" y1="4" x2="82" y2="96" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1E293B" />
                      <stop offset="0.5" stopColor="#0F172A" />
                      <stop offset="1" stopColor="#0284C7" />
                    </linearGradient>
                    <linearGradient id="shield-grad-inner" x1="12" y1="8" x2="78" y2="90" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0F172A" />
                      <stop offset="0.5" stopColor="#1E3A8A" />
                      <stop offset="1" stopColor="#0369A1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Concentric Defensive Radar Rings */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping pointer-events-none opacity-30" />
              </div>

              <h3
                className="mt-6 text-xl sm:text-2xl font-bold text-center text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Zero-Trust Brand Shield
              </h3>
              <p
                className="text-xs sm:text-sm text-center mt-1 text-zinc-400 font-normal"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Comprehensive protection against impersonators & unauthorized representation
              </p>

              {/* Threat Mitigation Status List */}
              <div className="mt-6 w-full space-y-2">
                {threats.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs"
                  >
                    <span className="text-zinc-300 font-medium">{t.label}</span>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Copy */}
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
            ✦ Intellectual Property & Brand Defense ✦
          </span>
          <h2
            id="brand-protection-heading"
            className="text-3xl md:text-5xl font-black mb-5 leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Your Identity Should{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Belong to You.
            </span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-6 text-zinc-300 font-normal"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            When malicious actors hijack your name, likeness, or intellectual property without authorization,
            it severely damages consumer trust and enterprise valuation. SocialAssist deploys rapid legal
            takedown notices and platform-verified takedown channels to permanently dismantle bad actors.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { label: "Executive & VIP Impersonation", desc: "Immediate takedown of deceptive clone accounts on Instagram, X & Telegram" },
              { label: "Fraudulent Commercial Representation", desc: "Eliminating scam stores, fake token projects, and phishing landing pages" },
              { label: "Copyright & DMCA Escalation", desc: "Direct legal portal removal of stolen media, assets, and trademarked materials" },
              { label: "Proactive Digital Perimeter Monitoring", desc: "Ongoing surveillance to stop copycat profiles before they gain traction" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-3.5 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/15 transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-cyan-500/15 border border-cyan-400/30">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>
                    {item.label}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] flex items-center gap-2 border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 shadow-lg shadow-cyan-950/40"
          >
            <span>Initiate Brand Protection Review</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
