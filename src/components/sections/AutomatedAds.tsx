"use client";

import { useEffect, useRef, useState } from "react";
import MascotAutomationEcosystem from "@/components/ui/MascotAutomationEcosystem";

export default function AutomatedAds() {
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

  return (
    <section
      id="automation"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden"
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
          {/* Interactive 3D Mascot Automation Ecosystem visual */}
          <div
            className="flex justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s",
            }}
          >
            <MascotAutomationEcosystem />
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
