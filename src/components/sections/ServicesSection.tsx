"use client";

import { useEffect, useRef, useState } from "react";

const SERVICES = [
  {
    id: "account-assistance",
    title: "Account Assistance",
    description:
      "Support for restricted, disabled, suspended, compromised and inaccessible social media accounts across all major platforms.",
    cta: "Get Assistance",
    href: "#contact",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="url(#g1s)" strokeWidth="1.5" strokeDasharray="4 2"/>
        <circle cx="18" cy="14" r="5" fill="url(#g2s)" opacity="0.9"/>
        <path d="M8 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="url(#g1s)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="g1s" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="g2s" x1="13" y1="9" x2="23" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#9B5CFF"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    glow: "rgba(124,58,237,0.25)",
  },
  {
    id: "verification",
    title: "Verification",
    description:
      "Professional assistance and guidance for social media verification and credibility processes.",
    cta: "Explore Verification",
    href: "#contact",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" rx="16" stroke="url(#gv1s)" strokeWidth="1.5"/>
        <path d="M11 18l5 5 9-10" stroke="url(#gv2s)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18" cy="18" r="7" fill="url(#gv3s)" opacity="0.15"/>
        <defs>
          <linearGradient id="gv1s" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#4A16A8"/>
          </linearGradient>
          <linearGradient id="gv2s" x1="11" y1="18" x2="25" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#9B5CFF"/>
          </linearGradient>
          <linearGradient id="gv3s" x1="11" y1="11" x2="25" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B5CFF"/><stop offset="1" stopColor="#C5A7FF"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    glow: "rgba(155,92,255,0.2)",
  },
  {
    id: "brand-protection",
    title: "Brand Protection",
    description:
      "Support for impersonation, fake profiles, fraudulent representation and digital brand protection.",
    cta: "Protect Your Brand",
    href: "#contact",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 3L5 8v10c0 8.284 5.82 16.036 13 18 7.18-1.964 13-9.716 13-18V8L18 3z" fill="url(#gs1s)" opacity="0.2"/>
        <path d="M18 3L5 8v10c0 8.284 5.82 16.036 13 18 7.18-1.964 13-9.716 13-18V8L18 3z" stroke="url(#gs2s)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 18l4 4 8-8" stroke="url(#gs3s)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="gs1s" x1="5" y1="3" x2="31" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B5CFF"/><stop offset="1" stopColor="#4A16A8"/>
          </linearGradient>
          <linearGradient id="gs2s" x1="5" y1="3" x2="31" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="gs3s" x1="12" y1="18" x2="20" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#9B5CFF"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    glow: "rgba(74,22,168,0.3)",
  },
  {
    id: "crypto-exchange",
    title: "Crypto Exchange",
    description:
      "Streamlined crypto-to-INR and other supported cryptocurrency exchange inquiries through a trusted process.",
    cta: "Start Exchange",
    href: "#exchange",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="15" fill="url(#gc1s)" opacity="0.15"/>
        <circle cx="18" cy="18" r="15" stroke="url(#gc2s)" strokeWidth="1.5"/>
        <text x="18" y="23" textAnchor="middle" fontSize="14" fontWeight="700" fill="url(#gc3s)" fontFamily="sans-serif">₹</text>
        <path d="M26 8l2 2-2 2M10 8l-2 2 2 2" stroke="url(#gc2s)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="gc1s" x1="3" y1="3" x2="33" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B5CFF"/><stop offset="1" stopColor="#4A16A8"/>
          </linearGradient>
          <linearGradient id="gc2s" x1="3" y1="3" x2="33" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="gc3s" x1="12" y1="12" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF"/><stop offset="1" stopColor="#C5A7FF"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    glow: "rgba(155,92,255,0.18)",
  },
  {
    id: "automated-advertising",
    title: "Automated Advertising",
    description:
      "Automation solutions for distributing promotional content across supported social media communities and marketplaces.",
    cta: "Explore Automation",
    href: "#automation",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="13" y="13" width="10" height="10" rx="5" fill="url(#ga1s)" opacity="0.9"/>
        <circle cx="18" cy="18" r="15" stroke="url(#ga2s)" strokeWidth="1" strokeDasharray="3 2"/>
        <circle cx="18" cy="5" r="2.5" fill="url(#ga1s)" opacity="0.7"/>
        <circle cx="29.5" cy="24" r="2.5" fill="url(#ga1s)" opacity="0.7"/>
        <circle cx="6.5" cy="24" r="2.5" fill="url(#ga1s)" opacity="0.7"/>
        <line x1="18" y1="18" x2="18" y2="7.5" stroke="url(#ga2s)" strokeWidth="1"/>
        <line x1="18" y1="18" x2="27.7" y2="23.5" stroke="url(#ga2s)" strokeWidth="1"/>
        <line x1="18" y1="18" x2="8.3" y2="23.5" stroke="url(#ga2s)" strokeWidth="1"/>
        <defs>
          <linearGradient id="ga1s" x1="13" y1="13" x2="23" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A7FF"/><stop offset="1" stopColor="#9B5CFF"/>
          </linearGradient>
          <linearGradient id="ga2s" x1="3" y1="3" x2="33" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B5CFF" stopOpacity="0.8"/><stop offset="1" stopColor="#4A16A8" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    glow: "rgba(124,58,237,0.22)",
  },
];

// ── Video player for services.mp4 ──
function ServicesVideo({ visible }: { visible: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
      else { videoRef.current.pause(); setPlaying(false); }
    }
  };

  return (
    <div
      className="mx-auto mb-16"
      style={{
        maxWidth: "780px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        filter: visible ? "blur(0px)" : "blur(4px)",
        transition: "opacity 0.9s ease-out 0.1s, transform 0.9s ease-out 0.1s, filter 0.8s ease-out 0.1s",
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(14,14,20,0.75)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 0 60px rgba(74,22,168,0.28), 0 0 120px rgba(74,22,168,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Chrome bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28CA42" }} />
          <span
            className="ml-auto text-xs"
            style={{ color: "rgba(197,167,255,0.45)", fontFamily: "'Inter', sans-serif" }}
          >
            SocialAssist · Services Overview
          </span>
        </div>

        {/* Video */}
        <div className="relative" style={{ aspectRatio: "16/9" }}>
          <video
            ref={videoRef}
            src="/videos/services.mp4"
            autoPlay
            muted={muted}
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-label="SocialAssist services overview video"
          />

          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(8,8,12,0.45), transparent)",
            }}
          />

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:scale-110 transition-transform duration-200"
              style={{
                background: "rgba(8,8,12,0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#C5A7FF">
                  <rect x="2" y="1" width="3" height="10" rx="1"/>
                  <rect x="7" y="1" width="3" height="10" rx="1"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#C5A7FF">
                  <path d="M3 2l7 4-7 4V2z"/>
                </svg>
              )}
            </button>
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:scale-110 transition-transform duration-200"
              style={{
                background: muted ? "rgba(124,58,237,0.55)" : "rgba(8,8,12,0.75)",
                backdropFilter: "blur(10px)",
                border: muted ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.1)",
              }}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
          </div>

          {muted && (
            <button
              onClick={toggleMute}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(124,58,237,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(197,167,255,0.3)",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              🔇 Tap to unmute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single service card ──
function ServiceCard({
  service,
  index,
  visible,
}: {
  service: (typeof SERVICES)[0];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const scrollToTarget = () => {
    const target = document.getElementById(service.href.replace("#", ""));
    if (target) target.scrollIntoView({ behavior: "smooth" });
    else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="flex flex-col p-6 rounded-2xl cursor-pointer relative overflow-hidden"
      style={{
        background: hovered ? "rgba(16,16,22,0.88)" : "rgba(14,14,20,0.62)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hovered
          ? "1px solid rgba(124,58,237,0.42)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered
          ? `0 20px 48px ${service.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 4px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? "translateY(-6px)" : "translateY(0)"
          : "translateY(24px)",
        transition: `opacity 0.55s ease-out ${index * 0.08}s, transform 0.38s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={scrollToTarget}
      role="article"
      aria-label={service.title}
    >
      {/* Corner accent glow */}
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${service.glow} 0%, transparent 70%)`,
          transform: "translate(35%, -35%)",
          filter: "blur(18px)",
          opacity: hovered ? 1 : 0.45,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Icon */}
      <div
        className="mb-4"
        style={{
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 0.3s ease",
        }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3
        className="text-base font-semibold mb-2"
        style={{
          color: hovered ? "#C5A7FF" : "#FFFFFF",
          fontFamily: "'Space Grotesk', sans-serif",
          transition: "color 0.3s ease",
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-1 mb-5"
        style={{ color: "rgba(217,214,227,0.6)", fontFamily: "'Inter', sans-serif" }}
      >
        {service.description}
      </p>

      {/* CTA */}
      <div
        className="flex items-center gap-1.5 text-sm font-medium"
        style={{
          color: hovered ? "#C5A7FF" : "rgba(155,92,255,0.8)",
          fontFamily: "'Inter', sans-serif",
          transition: "color 0.3s ease",
        }}
      >
        {service.cta}
        <svg
          width="13"
          height="13"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}
        >
          <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <div
          className="text-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase mb-3 block"
            style={{ color: "#9B5CFF", fontFamily: "'Inter', sans-serif" }}
          >
            What We Provide
          </span>
          <h2
            id="services-heading"
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFFFFF" }}
          >
            Everything Digital.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              One Network.
            </span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(217,214,227,0.58)", fontFamily: "'Inter', sans-serif" }}
          >
            Specialized solutions designed around modern social platforms.
          </p>
        </div>

        {/* ── Services video (services.mp4) ── */}
        <ServicesVideo visible={visible} />

        {/* ── Service cards grid — clean 6-col layout ── */}
        {/*
          Row 1: 3 cards, each spans 2 of 6 cols
          Row 2: 2 cards, each spans 3 of 6 cols → naturally centered
        */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
        >
          {/* Top 3 cards — each 2 cols */}
          {SERVICES.slice(0, 3).map((service, i) => (
            <div
              key={service.id}
              style={{ gridColumn: "span 2" }}
              className="col-span-6 sm:col-span-3 lg:[grid-column:span_2]"
            >
              <ServiceCard service={service} index={i} visible={visible} />
            </div>
          ))}

          {/* Bottom 2 cards — each 3 cols, naturally centered */}
          {SERVICES.slice(3).map((service, i) => (
            <div
              key={service.id}
              style={{ gridColumn: "span 3" }}
              className="col-span-6 sm:col-span-3 lg:[grid-column:span_3]"
            >
              <ServiceCard service={service} index={i + 3} visible={visible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
