"use client";

import { useEffect, useRef, useState } from "react";

export default function AccountAssistance() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="account-assistance"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="account-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left — Visual */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(16,16,22,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 60px rgba(74,22,168,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Mock browser frame */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28CA42" }} />
              <div
                className="ml-3 flex-1 rounded-md px-3 py-1 text-xs"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(197,167,255,0.4)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Account Recovery · SocialAssist
              </div>
            </div>

            {/* Illustrated problem→solution visual */}
            <div className="p-8">
              {/* Problem state */}
              <div
                className="rounded-xl p-5 mb-4"
                style={{
                  background: "rgba(255,80,80,0.06)",
                  border: "1px solid rgba(255,80,80,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,80,80,0.15)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v6M8 11v1" stroke="#FF5050" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="8" cy="8" r="6.5" stroke="#FF5050" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#FF7070", fontFamily: "var(--font-inter)" }}>Account Disabled</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,112,112,0.6)", fontFamily: "var(--font-inter)" }}>Access restricted by platform</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {["Suspended profile", "No login access", "Content unavailable"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
                      <span style={{ color: "#FF5050" }}>×</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center my-2">
                <div
                  className="flex flex-col items-center gap-1"
                  style={{ color: "#9B5CFF" }}
                >
                  <div className="w-px h-5" style={{ background: "linear-gradient(to bottom, rgba(155,92,255,0.3), rgba(155,92,255,0.8))" }} />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 8l4 4 4-4" stroke="#9B5CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}>SocialAssist</span>
                  <div className="w-px h-5" style={{ background: "linear-gradient(to bottom, rgba(155,92,255,0.8), rgba(155,92,255,0.3))" }} />
                </div>
              </div>

              {/* Solution state */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(155,92,255,0.06)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.2)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#C5A7FF", fontFamily: "var(--font-inter)" }}>Access Restored</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(197,167,255,0.6)", fontFamily: "var(--font-inter)" }}>Account successfully recovered</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {["Profile restored", "Content accessible", "Account secured"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}>
                      <span style={{ color: "#9B5CFF" }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Copy */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(30px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase mb-4 block"
            style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}
          >
            Account Assistance
          </span>
          <h2
            id="account-heading"
            className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            When Access Stops,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Assistance Starts.
            </span>
          </h2>
          <p
            className="text-base leading-relaxed mb-5"
            style={{ color: "rgba(217,214,227,0.65)", fontFamily: "var(--font-inter)" }}
          >
            SocialAssist provides specialized support for users facing account
            restrictions, suspensions, disabled profiles, and other
            platform-related access issues across Instagram, Facebook, TikTok,
            WhatsApp, and more.
          </p>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "rgba(217,214,227,0.5)", fontFamily: "var(--font-inter)" }}
          >
            Whether your account has been compromised, incorrectly flagged, or
            locked out — our network provides a structured path toward
            resolution.
          </p>

          {/* Feature list */}
          {[
            "Disabled & restricted accounts",
            "Compromised account recovery",
            "Suspension & ban support",
            "Impersonation & identity issues",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3 mb-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#C5A7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm" style={{ color: "rgba(217,214,227,0.75)", fontFamily: "var(--font-inter)" }}>{feat}</span>
            </div>
          ))}

          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4A16A8, #7C3AED, #9B5CFF)",
              boxShadow: "0 0 24px rgba(124,58,237,0.3)",
            }}
          >
            Get Assistance →
          </button>
        </div>
      </div>
    </section>
  );
}
