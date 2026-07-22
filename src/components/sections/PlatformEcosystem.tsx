"use client";

import { useEffect, useRef, useState } from "react";

const PLATFORMS = [
  {
    name: "Instagram",
    color: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="#E1306C" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="#1877F2" width="28" height="28">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l5.09-1.34A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="#25D366" strokeWidth="1.5"/>
        <path d="M8.5 9.5c.5 1 1.5 3 3.5 4s3-1 3-1-.5-1-1.5-1.5-2 .5-2 .5S9 10 8.5 9.5z" fill="#25D366"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    color: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "X",
    color: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" fill="#FFFFFF" width="28" height="28">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "OnlyFans",
    color: "#00AFF0",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <circle cx="12" cy="12" r="9" stroke="#00AFF0" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4" fill="#00AFF0" opacity="0.7"/>
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="#00AFF0" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Reddit",
    color: "#FF4500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <circle cx="12" cy="12" r="10" stroke="#FF4500" strokeWidth="1.5"/>
        <circle cx="9" cy="13" r="1" fill="#FF4500"/>
        <circle cx="15" cy="13" r="1" fill="#FF4500"/>
        <path d="M9 16s1 1 3 1 3-1 3-1" stroke="#FF4500" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="18" cy="6" r="1.5" fill="#FF4500" opacity="0.5"/>
        <path d="M18 6l-5 2" stroke="#FF4500" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Discord",
    color: "#5865F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#5865F2"/>
      </svg>
    ),
  },
];

export default function PlatformEcosystem() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Grid layout: 4 top, center, 4 bottom
  const top = PLATFORMS.slice(0, 4);
  const bottom = PLATFORMS.slice(4);

  return (
    <section
      id="platforms"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="platforms-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease-out",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase mb-3 block"
            style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}
          >
            Platform Coverage
          </span>
          <h2
            id="platforms-heading"
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            One Network.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Multiple Platforms.
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(217,214,227,0.6)", fontFamily: "var(--font-inter)" }}
          >
            SocialAssist operates across every major social media platform,
            delivering specialized solutions wherever you need them.
          </p>
        </div>

        {/* Platform grid with central SA node */}
        <div
          className="relative flex flex-col items-center gap-8"
          style={{
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
            transition: "transform 0.6s ease-out",
          }}
        >
          {/* Top row */}
          <div className="flex gap-4 flex-wrap justify-center">
            {top.map((p, i) => (
              <PlatformIcon key={p.name} platform={p} index={i} visible={visible} />
            ))}
          </div>

          {/* Center SA node */}
          <div
            className="relative flex items-center justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.3s",
            }}
          >
            <div
              className="animate-float-slow flex items-center justify-center rounded-2xl overflow-hidden"
              style={{
                width: 110,
                height: 110,
                background: "rgba(14,14,20,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Logo image implanted full into rectangle without glow or crop */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="SocialAssist Logo"
                className="w-full h-full object-cover"
                style={{
                  filter: "none",
                  display: "block",
                }}
              />
            </div>



            {/* Connector lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: visible ? 0.3 : 0, transition: "opacity 1s ease-out 0.5s" }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <div
                  key={angle}
                  className="absolute"
                  style={{
                    width: "80px",
                    height: "1px",
                    background: "linear-gradient(90deg, rgba(124,58,237,0.6), transparent)",
                    transformOrigin: "left center",
                    left: "50%",
                    top: "50%",
                    transform: `translateY(-50%) rotate(${angle}deg)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex gap-4 flex-wrap justify-center">
            {bottom.map((p, i) => (
              <PlatformIcon key={p.name} platform={p} index={i + 4} visible={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformIcon({
  platform,
  index,
  visible,
}: {
  platform: (typeof PLATFORMS)[0];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 0.06;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex items-center justify-center rounded-2xl transition-all duration-300"
        style={{
          width: 64,
          height: 64,
          background: hovered
            ? `rgba(16,16,22,0.9)`
            : "rgba(16,16,22,0.6)",
          backdropFilter: "blur(16px)",
          border: hovered
            ? `1px solid ${platform.color}40`
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 8px 24px ${platform.color}30, 0 0 0 1px ${platform.color}20`
            : "0 4px 12px rgba(0,0,0,0.2)",
          transform: hovered ? "translateY(-4px) scale(1.08)" : "translateY(0) scale(1)",
        }}
      >
        {platform.icon}
      </div>
      <span
        className="text-xs font-medium"
        style={{
          color: hovered ? "#C5A7FF" : "rgba(217,214,227,0.5)",
          fontFamily: "var(--font-inter)",
          transition: "color 0.2s ease",
        }}
      >
        {platform.name}
      </span>
    </div>
  );
}
