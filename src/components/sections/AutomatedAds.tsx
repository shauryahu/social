"use client";

import { useEffect, useRef, useState } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  RedditIcon,
  DiscordIcon,
  WhatsAppIcon,
} from "@/components/icons/PlatformIcons";

const DESTINATIONS = [
  {
    name: "Instagram",
    angle: -60,
    color: "#E1306C",
    icon: <InstagramIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(225,48,108,0.4)]" />,
  },
  {
    name: "Facebook",
    angle: 0,
    color: "#1877F2",
    icon: <FacebookIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(24,119,242,0.4)]" />,
  },
  {
    name: "TikTok",
    angle: 60,
    color: "#00F2FE",
    icon: <TikTokIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(0,242,254,0.4)]" />,
  },
  {
    name: "Reddit",
    angle: 120,
    color: "#FF4500",
    icon: <RedditIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(255,69,0,0.4)]" />,
  },
  {
    name: "Discord",
    angle: 180,
    color: "#5865F2",
    icon: <DiscordIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(88,101,242,0.4)]" />,
  },
  {
    name: "WhatsApp",
    angle: 240,
    color: "#25D366",
    icon: <WhatsAppIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(37,211,102,0.4)]" />,
  },
];

export default function AutomatedAds() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeDest, setActiveDest] = useState(0);

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

  useEffect(() => {
    if (!visible) return;
    const i = setInterval(() => setActiveDest((a) => (a + 1) % DESTINATIONS.length), 900);
    return () => clearInterval(i);
  }, [visible]);

  return (
    <section
      id="automation"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="automation-heading"
    >
      {/* Right accent */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          right: "-10vw",
          top: "0",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block text-cyan-400 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ✦ Precision Advertising Engine ✦
          </span>
          <h2
            id="automation-heading"
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Advertising That{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Keeps Moving.
            </span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto text-zinc-400"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Automated distribution solutions for brands looking to reach
            communities across supported social media platforms and
            marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Automation flow visual */}
          <div
            className="flex justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.1s",
            }}
          >
            <div className="relative scale-90 sm:scale-100 origin-center transition-transform" style={{ width: 300, height: 300 }}>
              {/* Center engine node */}
              <div
                className="absolute flex flex-col items-center justify-center rounded-2xl"
                style={{
                  width: 90,
                  height: 90,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "linear-gradient(135deg, rgba(25, 25, 38, 0.95), rgba(14, 14, 22, 0.95))",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  boxShadow: "0 0 40px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                  zIndex: 10,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/40 animate-pulse">
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
                </div>
                <span
                  className="text-[10px] mt-1.5 font-bold tracking-widest text-cyan-300 font-mono"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  AI CORE
                </span>
              </div>

              {/* Orbit circle */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: "1px dashed rgba(255,255,255,0.12)",
                }}
              />

              {/* Destination nodes */}
              {DESTINATIONS.map((dest, i) => {
                const rad = (dest.angle * Math.PI) / 180;
                const r = 118;
                const cx = 150 + r * Math.cos(rad);
                const cy = 150 + r * Math.sin(rad);
                const isActive = activeDest === i;

                return (
                  <div
                    key={dest.name}
                    className="absolute flex flex-col items-center justify-center rounded-2xl transition-all duration-300"
                    style={{
                      width: 52,
                      height: 52,
                      left: cx - 26,
                      top: cy - 26,
                      background: isActive
                        ? "linear-gradient(135deg, rgba(35, 35, 50, 0.95), rgba(20, 20, 30, 0.95))"
                        : "rgba(16,16,24,0.75)",
                      backdropFilter: "blur(16px)",
                      border: isActive
                        ? `1px solid ${dest.color}80`
                        : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: isActive
                        ? `0 0 24px ${dest.color}40, 0 4px 12px rgba(0,0,0,0.5)`
                        : "0 4px 12px rgba(0,0,0,0.3)",
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                      zIndex: isActive ? 5 : 2,
                    }}
                  >
                    <div className="transition-transform duration-200">
                      {dest.icon}
                    </div>
                  </div>
                );
              })}

              {/* Animated pulse beam towards active dest */}
              {(() => {
                const dest = DESTINATIONS[activeDest];
                const rad = (dest.angle * Math.PI) / 180;
                const r = 118;
                const tx = 150 + r * Math.cos(rad);
                const ty = 150 + r * Math.sin(rad);
                const angleDeg = (Math.atan2(ty - 150, tx - 150) * 180) / Math.PI;

                return (
                  <div
                    className="absolute pointer-events-none transition-all duration-300"
                    style={{
                      left: 150,
                      top: 150,
                      width: r - 26,
                      height: 2,
                      background: `linear-gradient(90deg, rgba(56,189,248,0.8), ${dest.color})`,
                      boxShadow: `0 0 12px ${dest.color}`,
                      transformOrigin: "left center",
                      transform: `rotate(${angleDeg}deg)`,
                      zIndex: 3,
                    }}
                  />
                );
              })()}
            </div>
          </div>

          {/* Feature list */}
          <div
            className="flex flex-col gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s",
            }}
          >
            {[
              {
                title: "Multi-Platform Automation",
                desc: "Simultaneous distribution and programmatic campaign management across all supported platforms from a single controller.",
              },
              {
                title: "Targeted Audience Delivery",
                desc: "Reach specific interest groups, geographic communities, and targeted demographics with precision timing.",
              },
              {
                title: "Reliable Distribution Systems",
                desc: "Engineered pipelines ensure uninterrupted scheduled delivery without common rate limiting and posting failures.",
              },
              {
                title: "Comprehensive Analytics",
                desc: "Full reporting on reach, impressions, audience engagement, and delivery performance across all active channels.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="flex gap-4 p-4 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200"
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-cyan-300 font-mono"
                  style={{
                    background: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                  }}
                >
                  0{i + 1}
                </div>
                <div>
                  <h3
                    className="text-base font-semibold text-white mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-zinc-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
