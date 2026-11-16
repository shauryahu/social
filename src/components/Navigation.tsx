"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Scroll spy & background shadow on scroll
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

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  // Dismiss on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isExpanded &&
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    setActiveSection(id === "contact" ? "inquiry" : id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsExpanded(false);
  };

  return (
    <div ref={navContainerRef} className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* 
        ── EXPANDED STATE TRANSLUCENT OVERLAY ──
        120Hz GPU compositor layer (opacity only, zero layout reflows)
      */}
      <div
        className={`fixed inset-0 z-[-1] transition-opacity duration-300 ease-out ${
          isExpanded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(5, 7, 12, 0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          willChange: "opacity",
        }}
        onClick={() => setIsExpanded(false)}
        aria-hidden="true"
      />

      {/* ── TOP COMPACT FLOATING CAPSULE BAR ── */}
      <header
        className="pointer-events-auto pt-4 px-3 flex justify-center w-full"
        role="banner"
      >
        <div
          className="rounded-full px-3.5 py-1.5 flex items-center justify-between gap-2 sm:gap-3 transition-colors duration-200"
          style={{
            background: scrolled
              ? "rgba(12, 14, 22, 0.85)"
              : "rgba(18, 20, 30, 0.72)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: isExpanded
              ? "1px solid rgba(56, 189, 248, 0.35)"
              : "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: scrolled
              ? "0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
              : "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Brand Logo & Name */}
          <button
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none group text-left"
            aria-label="SocialAssist Home"
          >
            <Image
              src="/images/toplogo1.png"
              alt="SocialAssist Logo"
              width={26}
              height={26}
              className="w-6 h-6 object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className="text-xs font-bold tracking-[0.16em] uppercase text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              SocialAssist
            </span>
          </button>

          {/* Desktop Direct Links */}
          <nav aria-label="Quick links" className="hidden md:flex items-center gap-1 ml-2">
            <div className="w-px h-3.5 bg-white/15 mr-1" />
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150"
                  style={{
                    color: isActive ? "#FFFFFF" : "rgba(226, 232, 240, 0.65)",
                    background: isActive
                      ? "rgba(56, 189, 248, 0.16)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(56, 189, 248, 0.35)"
                      : "1px solid transparent",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Direct CTA + 120Hz Smooth Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => scrollTo("#contact")}
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Contact
            </button>

            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors duration-150 text-xs font-semibold ${
                isExpanded
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10"
              }`}
              title={isExpanded ? "Close Menu (Esc)" : "Expand Navigation Menu"}
              aria-expanded={isExpanded}
            >
              <span className="text-[11px] font-mono uppercase tracking-wider hidden xs:inline">
                {isExpanded ? "Close" : "Menu"}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200"
                style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0)" }}
              >
                {isExpanded ? (
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M2.5 5h11M2.5 8h11M2.5 11h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 
        ── EXPANDED FLOATING GLASS PANEL ──
        Pure GPU Transform & Opacity Animation (Zero layout reflows, Apple 120Hz fluid spring)
      */}
      <div
        className={`pointer-events-auto mx-auto mt-2 w-[calc(100vw-28px)] max-w-xl transition-all duration-250 ${
          isExpanded
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-[0.97] pointer-events-none"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="rounded-3xl p-5 sm:p-6 overflow-hidden"
          style={{
            background: "rgba(14, 16, 25, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.28)",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 32px rgba(56, 189, 248, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
          }}
        >
          {/* Header row in expanded menu */}
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pb-3 border-b border-white/10">
            <span className="tracking-wider uppercase font-semibold text-white/90">Navigation Directory</span>
            <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Active: #{activeSection}
            </span>
          </div>

          {/* Grid of Navigation Destination Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`p-3 rounded-2xl text-left transition-all duration-150 flex flex-col justify-between ${
                    isActive
                      ? "bg-cyan-500/15 border border-cyan-400/40 text-white shadow-md shadow-cyan-950/30"
                      : "bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/20 text-zinc-300 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-zinc-400 font-mono mt-1">
                    {item.href}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer of Expanded Menu */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <span>Direct Escalation Desk:</span>
              <a
                href="https://t.me/socialassist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:underline font-mono"
              >
                @socialassist
              </a>
            </div>

            <button
              onClick={() => scrollTo("#contact")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-950/40 hover:opacity-95 transition-transform duration-150 active:scale-[0.98]"
            >
              Contact Operator →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
