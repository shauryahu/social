"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  { label: "Established 2021", icon: "◈" },
  { label: "Multi-Platform Support", icon: "◈" },
  { label: "Digital Assistance", icon: "◈" },
  { label: "Global Network", icon: "◈" },
  { label: "Human + Automated Solutions", icon: "◈" },
];

export default function CredibilityStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 py-10 px-4"
      aria-label="Network credentials"
    >
      <div
        className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3"
      >
        {ITEMS.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(16,16,22,0.7)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 20px rgba(74,22,168,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 0.1}s, transform 0.5s ease-out ${i * 0.1}s`,
              }}
            >
              <span
                style={{
                  color: "#9B5CFF",
                  fontSize: "10px",
                }}
              >
                ✦
              </span>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: "#D9D6E3", fontFamily: "var(--font-inter)" }}
              >
                {item.label}
              </span>
            </div>
            {i < ITEMS.length - 1 && (
              <div
                className="hidden sm:block w-px h-4"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
