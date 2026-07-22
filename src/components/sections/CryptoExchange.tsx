"use client";

import { useEffect, useRef, useState } from "react";

export default function CryptoExchange() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [flowStep, setFlowStep] = useState(0);

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
    const interval = setInterval(() => {
      setFlowStep((s) => (s + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, [visible]);

  const FLOW = [
    { label: "Crypto", sub: "BTC · ETH · USDT", active: flowStep === 0 },
    { label: "Secure Exchange", sub: "Verified process", active: flowStep === 1 },
    { label: "INR", sub: "Indian Rupee", active: flowStep === 2 },
  ];

  const COINS = ["BTC", "ETH", "USDT", "LTC", "BNB"];

  return (
    <section
      id="exchange"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="exchange-heading"
    >
      {/* Violet glow accent */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          left: "-15vw",
          top: "50%",
          transform: "translateY(-50%)",
          background: "radial-gradient(circle, rgba(74,22,168,0.12) 0%, transparent 70%)",
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
            Crypto Exchange
          </span>
          <h2
            id="exchange-heading"
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Crypto.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Converted Simply.
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(217,214,227,0.6)", fontFamily: "var(--font-inter)" }}
          >
            Exchange supported cryptocurrencies to INR and other available
            options through a streamlined inquiry process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Flow visual */}
          <div
            className="flex flex-col items-center gap-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s",
            }}
          >
            {FLOW.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center w-full max-w-xs">
                {/* Step */}
                <div
                  className="w-full rounded-2xl p-5 flex items-center gap-4 transition-all duration-500"
                  style={{
                    background: step.active
                      ? "rgba(124,58,237,0.15)"
                      : "rgba(16,16,22,0.6)",
                    border: step.active
                      ? "1px solid rgba(124,58,237,0.4)"
                      : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: step.active
                      ? "0 8px 32px rgba(124,58,237,0.2)"
                      : "none",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-500"
                    style={{
                      background: step.active
                        ? "linear-gradient(135deg, #7C3AED, #9B5CFF)"
                        : "rgba(255,255,255,0.05)",
                      boxShadow: step.active ? "0 0 16px rgba(124,58,237,0.5)" : "none",
                      color: step.active ? "#fff" : "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    {i === 0 ? "₿" : i === 1 ? "⇄" : "₹"}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: step.active ? "#C5A7FF" : "rgba(217,214,227,0.6)",
                        fontFamily: "var(--font-space-grotesk)",
                        transition: "color 0.5s ease",
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(217,214,227,0.35)", fontFamily: "var(--font-inter)" }}
                    >
                      {step.sub}
                    </p>
                  </div>
                </div>

                {/* Connector */}
                {i < FLOW.length - 1 && (
                  <div
                    className="w-px my-1 transition-all duration-500"
                    style={{
                      height: 28,
                      background: step.active
                        ? "linear-gradient(to bottom, rgba(124,58,237,0.8), rgba(155,92,255,0.4))"
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                )}
              </div>
            ))}

            {/* Supported coins */}
            <div className="mt-6 flex gap-2 flex-wrap justify-center">
              {COINS.map((c) => (
                <span
                  key={c}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(155,92,255,0.08)",
                    border: "1px solid rgba(155,92,255,0.15)",
                    color: "rgba(197,167,255,0.7)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {c}
                </span>
              ))}
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
              Simple. Streamlined. Secure.
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "rgba(217,214,227,0.65)", fontFamily: "var(--font-inter)" }}
            >
              Submit an inquiry to exchange your supported cryptocurrencies to
              INR or other available options through SocialAssist&apos;s
              structured exchange process.
            </p>

            {[
              { label: "Supported assets", val: "BTC, ETH, USDT, LTC & more" },
              { label: "Output currency", val: "INR and other options" },
              { label: "Process", val: "Inquiry-based, human-assisted" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-sm" style={{ color: "rgba(217,214,227,0.5)", fontFamily: "var(--font-inter)" }}>
                  {row.label}
                </span>
                <span className="text-sm font-medium" style={{ color: "#D9D6E3", fontFamily: "var(--font-inter)" }}>
                  {row.val}
                </span>
              </div>
            ))}

            {/* Disclaimer */}
            <p
              className="mt-6 text-xs leading-relaxed p-3 rounded-xl"
              style={{
                color: "rgba(217,214,227,0.35)",
                fontFamily: "var(--font-inter)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              Exchange rates, availability and supported currencies may vary.
              SocialAssist operates an inquiry-based process. All exchange
              transactions carry inherent risk.
            </p>

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-6 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4A16A8, #7C3AED, #9B5CFF)",
                boxShadow: "0 0 24px rgba(124,58,237,0.3)",
              }}
            >
              Start Exchange →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
