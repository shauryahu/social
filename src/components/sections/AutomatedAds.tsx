"use client";

import { useEffect, useRef, useState } from "react";

const DESTINATIONS = [
  {
    name: "Instagram",
    angle: -60,
    color: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    angle: 0,
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    angle: 60,
    color: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Reddit",
    angle: 120,
    color: "#FF4500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="9" cy="13" r="1" fill="currentColor"/>
        <circle cx="15" cy="13" r="1" fill="currentColor"/>
        <path d="M9 16s1 1 3 1 3-1 3-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
        <path d="M18 6l-5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Discord",
    angle: 180,
    color: "#5865F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    angle: 240,
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l5.09-1.34A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8.5 9.5c.5 1 1.5 3 3.5 4s3-1 3-1-.5-1-1.5-1.5-2 .5-2 .5S9 10 8.5 9.5z" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function AutomatedAds() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeDest, setActiveDest] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
            className="text-xs font-medium tracking-widest uppercase mb-3 block"
            style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}
          >
            Automated Advertising
          </span>
          <h2
            id="automation-heading"
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Advertising That{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Keeps Moving.
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(217,214,227,0.6)", fontFamily: "var(--font-inter)" }}
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
            <div className="relative scale-85 xs:scale-90 sm:scale-100 origin-center transition-transform" style={{ width: 280, height: 280 }}>
              {/* Center engine node */}
              <div
                className="absolute flex flex-col items-center justify-center rounded-2xl"
                style={{
                  width: 80,
                  height: 80,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(16,16,22,0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.3)",
                  zIndex: 10,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="5" fill="url(#ag1)" opacity="0.9"/>
                  <circle cx="14" cy="14" r="11" stroke="url(#ag1)" strokeWidth="1" strokeDasharray="3 2"/>
                  <defs>
                    <linearGradient id="ag1" x1="3" y1="3" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#C5A7FF"/>
                      <stop offset="1" stopColor="#7C3AED"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span
                  className="text-[9px] mt-1 font-medium tracking-wider"
                  style={{ color: "rgba(197,167,255,0.7)", fontFamily: "var(--font-inter)" }}
                >
                  ENGINE
                </span>
              </div>

              {/* Destination nodes with app SVG icons & active soft glow */}
              {DESTINATIONS.map((dest, i) => {
                const rad = (dest.angle * Math.PI) / 180;
                const r = 115;
                const x = 140 + r * Math.cos(rad);
                const y = 140 + r * Math.sin(rad);
                const isActive = activeDest === i;

                return (
                  <div key={dest.name}>
                    {/* Line */}
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      width="280"
                      height="280"
                    >
                      <line
                        x1="140"
                        y1="140"
                        x2={x}
                        y2={y}
                        stroke={isActive ? dest.color : "rgba(124,58,237,0.2)"}
                        strokeWidth={isActive ? 1.8 : 0.75}
                        strokeDasharray={isActive ? "none" : "4 3"}
                        style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                      />
                      {/* Moving flow dot on active line */}
                      {isActive && (
                        <circle r="3.5" fill={dest.color} filter={`drop-shadow(0 0 6px ${dest.color})`}>
                          <animateMotion
                            dur="0.85s"
                            repeatCount="indefinite"
                            path={`M 140 140 L ${x} ${y}`}
                          />
                        </circle>
                      )}
                    </svg>

                    {/* Destination node with App SVG Icon & soft glow when flow reaches icon */}
                    <div
                      className="absolute flex items-center justify-center rounded-2xl transition-all duration-400 cursor-default"
                      title={dest.name}
                      style={{
                        width: 48,
                        height: 48,
                        left: x - 24,
                        top: y - 24,
                        background: isActive
                          ? "rgba(18,18,26,0.92)"
                          : "rgba(16,16,22,0.65)",
                        border: isActive
                          ? `1.5px solid ${dest.color}80`
                          : "1px solid rgba(255,255,255,0.08)",
                        boxShadow: isActive
                          ? `0 0 20px ${dest.color}50, 0 0 40px ${dest.color}25, inset 0 0 10px ${dest.color}15`
                          : "0 4px 12px rgba(0,0,0,0.25)",
                        backdropFilter: "blur(16px)",
                        transform: isActive ? "scale(1.12)" : "scale(1)",
                        zIndex: isActive ? 12 : 10,
                        color: isActive ? dest.color : "rgba(255,255,255,0.4)",
                        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      <div
                        style={{
                          transform: isActive ? "scale(1.05)" : "scale(0.95)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        {dest.icon}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
            >
              Reach More. Distribute Smarter.
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "rgba(217,214,227,0.65)", fontFamily: "var(--font-inter)" }}
            >
              SocialAssist provides automated bot-based promotional distribution
              solutions for brands that need consistent, scalable reach across
              supported social media communities and marketplaces.
            </p>

            {[
              { label: "Multi-platform distribution", desc: "Reach communities across major platforms simultaneously" },
              { label: "Scalable campaigns", desc: "Adjust volume, frequency, and targeting" },
              { label: "Configurable workflows", desc: "Define parameters, content, and destinations" },
              { label: "Campaign assistance", desc: "Human-guided setup and management" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 mb-4">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#C5A7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#FFFFFF", fontFamily: "var(--font-inter)" }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(217,214,227,0.45)", fontFamily: "var(--font-inter)" }}>{item.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-4 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.3)",
                backdropFilter: "blur(12px)",
                color: "#C5A7FF",
              }}
            >
              Explore Automation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
