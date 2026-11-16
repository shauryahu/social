"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { InstagramIcon, FacebookIcon, TikTokIcon, XIcon } from "@/components/icons/PlatformIcons";

export default function VerificationSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTier, setActiveTier] = useState<"creator" | "brand" | "executive">("brand");

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

  const TIERS = {
    creator: { label: "Creator & Artist", timeline: "48–72h", passRate: "97%", req: "Notability & Press Coverage" },
    brand: { label: "Brand & Enterprise", timeline: "24–48h", passRate: "99%", req: "Entity Verification & Trademark" },
    executive: { label: "Executive & Founder", timeline: "24–72h", passRate: "96%", req: "Corporate Authority & Bios" },
  };

  return (
    <section
      id="verification"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden"
      aria-labelledby="verification-heading"
    >
      {/* Background Soft Blue/Cyan Light Glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "55vw",
          height: "55vw",
          right: "-10vw",
          top: "-5vw",
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Content with AUTHORITATIVE OFFICIAL VERIFICATION LOGO */}
        <div
          className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-24px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          {/* 
            OFFICIAL VERIFICATION LOGO
            Placed directly and centrally above 'Official Verification in'
            Using exact user-provided authoritative 3D PNG asset
          */}
          <div className="flex items-center justify-center lg:justify-start mb-5">
            <div className="relative inline-block">
              {/* Subtle Ambient Glow */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 75%)",
                  filter: "blur(24px)",
                }}
              />
              <Image
                src="/images/official-verification-badge.png"
                alt="Official Verification Badge"
                width={120}
                height={120}
                priority
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_16px_32px_rgba(29,78,216,0.45)] transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Mandatory Exact Headings: "Official Verification in" followed by "Build Credibility. Strengthen Presence." */}
          <span
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 block text-cyan-400 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Official Verification in
          </span>

          <h2
            id="verification-heading"
            className="text-3xl md:text-5xl font-black mb-5 leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Build Credibility.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Strengthen Presence.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg leading-relaxed mb-4 text-zinc-300 font-normal max-w-xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            SocialAssist provides strategic advisory and documentation navigation for official platform
            verification. We help public figures, corporations, and digital entities meet stringent
            notability guidelines across Meta, X, TikTok, and global directories.
          </p>

          <p
            className="text-xs leading-relaxed mb-8 text-zinc-500 font-normal max-w-xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Compliance Note: Official badge approval is granted at platform discretion. SocialAssist provides
            verified portal representation, PR portfolio preparation, and end-to-end procedural support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full max-w-xl text-left">
            {[
              "Official portal submission pathways",
              "Notability press & media syndication",
              "Legal trademark documentation support",
              "Profile metadata optimization",
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
            className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] text-white flex items-center gap-2 border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 shadow-lg shadow-cyan-950/40"
          >
            <span>Explore Verification Pathways</span>
            <span>→</span>
          </button>
        </div>

        {/* Right Column: 3D Interactive Credibility Showcase with Authoritative Badge */}
        <div
          className="order-1 lg:order-2 flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(24px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          <div
            className="relative flex flex-col items-center justify-center rounded-3xl p-7 sm:p-9 w-full max-w-md border border-white/10 bg-[#101018]/85 backdrop-blur-2xl shadow-2xl overflow-hidden group"
          >
            {/* Ambient Badge Backlight */}
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Central Badge Presentation using Official PNG */}
            <div className="relative flex items-center justify-center my-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/images/official-verification-badge.png"
                  alt="SocialAssist Official Verification"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(37,99,235,0.5)]"
                />
              </div>
            </div>

            <h3
              className="text-xl sm:text-2xl font-bold mb-1 text-center text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Authoritative Verification
            </h3>
            <p
              className="text-xs sm:text-sm text-center text-zinc-400 font-normal mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Certified presence across Meta, X, TikTok and global platforms
            </p>

            {/* Interactive Tier Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 w-full mb-5 text-xs">
              {(["brand", "creator", "executive"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`py-1.5 px-2 rounded-lg font-medium capitalize transition-all ${
                    activeTier === tier
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Live Tier Insight Card */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] w-full text-xs space-y-2">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="text-zinc-400">Target Category:</span>
                <span className="font-semibold text-white">{TIERS[activeTier].label}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="text-zinc-400">Estimated Turnaround:</span>
                <span className="font-mono text-cyan-300 font-semibold">{TIERS[activeTier].timeline}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="text-zinc-400">Primary Prerequisite:</span>
                <span className="text-zinc-200">{TIERS[activeTier].req}</span>
              </div>
            </div>

            {/* Supported Platform Badges */}
            <div className="mt-5 flex items-center justify-center gap-3 w-full pt-4 border-t border-white/10">
              <InstagramIcon className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
              <FacebookIcon className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
              <TikTokIcon className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
              <XIcon className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
