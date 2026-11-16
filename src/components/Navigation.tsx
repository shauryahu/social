"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Platforms", href: "#platforms" },
  { label: "Exchange", href: "#exchange" },
  { label: "Automation", href: "#automation" },
  { label: "About", href: "#about" },
  { label: "Inquiry", href: "#inquiry" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));

    const updateActiveSection = () => {
      const isScrolledNow = window.scrollY > 40;
      setScrolled((prev) => (prev !== isScrolledNow ? isScrolledNow : prev));

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;

      if (isAtBottom) {
        setActiveSection(sections[sections.length - 1]);
        ticking = false;
        return;
      }

      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) current = id;
        }
      }
      setActiveSection((prev) => (prev !== current ? current : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    setActiveSection(id === "contact" ? "inquiry" : id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Apple-Grade Floating Dynamic Island Navigation Bar ── */}
      <header
        style={{
          position: "fixed",
          top: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "calc(100vw - 32px)",
          maxWidth: "max-content",
        }}
        className="flex justify-center"
        role="banner"
      >
        {/* ── Desktop Capsule ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(12, 12, 18, 0.85)"
              : "rgba(18, 18, 26, 0.72)",
            backdropFilter: "blur(28px) saturate(190%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: scrolled
              ? "0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.18)"
              : "0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Authentic SocialAssist Logo */}
          <button
            onClick={() => scrollTo("#home")}
            className="mr-2 flex items-center gap-2 flex-shrink-0 focus-visible:outline-none group"
            aria-label="SocialAssist Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/toplogo1.png"
              alt="SocialAssist"
              width={28}
              height={28}
              className="w-7 h-7 object-contain block drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="text-xs font-bold tracking-[0.15em] uppercase text-white hidden lg:inline"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              SocialAssist
            </span>
          </button>

          {/* Thin Vertical Metallic Divider */}
          <div className="mr-1.5 w-px h-4 bg-white/15 flex-shrink-0" />

          {/* Navigation Links */}
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none whitespace-nowrap"
                style={{
                  color: isActive ? "#FFFFFF" : "rgba(226, 232, 240, 0.7)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(56, 189, 248, 0.4)"
                    : "1px solid transparent",
                  boxShadow: isActive ? "0 0 16px rgba(56, 189, 248, 0.25)" : "none",
                  fontFamily: "var(--font-inter)",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}

          {/* Contact Action Pill */}
          <button
            onClick={() => scrollTo("#contact")}
            className="ml-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 focus-visible:outline-none whitespace-nowrap text-white flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)",
              boxShadow: "0 0 20px rgba(79, 70, 229, 0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span>Contact</span>
            <span className="text-[10px]">→</span>
          </button>
        </nav>

        {/* ── Mobile Capsule Bar ── */}
        <div className="flex md:hidden items-center justify-between w-full max-w-sm">
          <nav
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: scrolled ? "rgba(12, 12, 18, 0.9)" : "rgba(18, 18, 26, 0.8)",
              backdropFilter: "blur(28px) saturate(190%)",
              WebkitBackdropFilter: "blur(28px) saturate(190%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo("#home");
                }}
                className="line-none focus:outline-none"
                aria-label="Home"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/toplogo1.png"
                  alt="SocialAssist"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain block drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                />
              </button>
              <span
                className="text-xs font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                SocialAssist
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-300 capitalize bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {activeSection}
              </span>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  {mobileOpen ? (
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  ) : (
                    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Mobile Dropdown Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9998] flex flex-col justify-start pt-24 px-6 md:hidden"
          style={{
            background: "rgba(7, 7, 10, 0.95)",
            backdropFilter: "blur(30px) saturate(190%)",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full max-w-sm mx-auto p-4 rounded-3xl border border-white/10 bg-[#12121A]/90 space-y-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between"
                  style={{
                    color: isActive ? "#FFFFFF" : "rgba(226, 232, 240, 0.7)",
                    background: isActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
                    border: isActive ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid transparent",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />}
                </button>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => scrollTo("#contact")}
                className="w-full py-3 rounded-2xl font-bold text-sm text-center text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-950/40"
              >
                Contact Network
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
