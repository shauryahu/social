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
  const navRef = useRef<HTMLDivElement>(null);

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
      if (isExpanded && navRef.current && !navRef.current.contains(e.target as Node)) {
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
    <>
      {/* 
        ── EXPANDED STATE TRANSLUCENT OVERLAY (NEVER SOLID BLACK) ──
        Layer 2: Subtle darkening & background blur so the underlying page remains 100% visible
      */}
      <div
        className={`fixed inset-0 z-[9990] transition-all duration-400 ease-out ${
          isExpanded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(5, 7, 12, 0.45)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
        onClick={() => setIsExpanded(false)}
        aria-hidden="true"
      />

      {/* ── MAIN FLOATING DYNAMIC GLASS NAVIGATION ── */}
      <header
        ref={navRef}
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "calc(100vw - 28px)",
          maxWidth: isExpanded ? "640px" : "max-content",
          transition: "max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="flex justify-center"
        role="banner"
      >
        {/* The Glass Container (Smooth Corner-Radius & Dimension Transition) */}
        <div
          className={`w-full overflow-hidden transition-all duration-400 ease-out ${
            isExpanded ? "rounded-3xl p-5 sm:p-6" : "rounded-full px-3.5 py-1.5"
          }`}
          style={{
            background: isExpanded
              ? "rgba(14, 16, 25, 0.78)"
              : scrolled
              ? "rgba(12, 14, 22, 0.72)"
              : "rgba(18, 20, 30, 0.58)",
            backdropFilter: "blur(28px) saturate(190%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%)",
            border: isExpanded
              ? "1px solid rgba(56, 189, 248, 0.28)"
              : "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: isExpanded
              ? "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 32px rgba(56, 189, 248, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.25)"
              : scrolled
              ? "0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.16)"
              : "0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* ── COMPACT / CLOSED VIEW (DESKTOP + MOBILE BAR) ── */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
            {/* Brand Logo & Name */}
            <button
              onClick={() => scrollTo("#home")}
              className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none group text-left"
              aria-label="SocialAssist Home"
            >
              <Image
                src="/images/toplogo1.png"
                alt="SocialAssist"
                width={28}
                height={28}
                className="w-7 h-7 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className="text-xs font-bold tracking-[0.16em] uppercase text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                SocialAssist
              </span>
            </button>

            {/* Desktop Direct Links (Visible when NOT expanded on md+) */}
            {!isExpanded && (
              <nav aria-label="Quick links" className="hidden md:flex items-center gap-1 ml-2">
                <div className="w-px h-4 bg-white/15 mr-1" />
                {NAV_ITEMS.slice(0, 5).map((item) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200"
                      style={{
                        color: isActive ? "#FFFFFF" : "rgba(226, 232, 240, 0.65)",
                        background: isActive
                          ? "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)"
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
            )}

            {/* Controls Right Side (Expand Trigger + Direct CTA) */}
            <div className="flex items-center gap-2">
              {/* Direct Quick Contact CTA (Desktop only) */}
              {!isExpanded && (
                <button
                  onClick={() => scrollTo("#contact")}
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-indigo-950/40"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Contact
                </button>
              )}

              {/* Dynamic Expand/Collapse Toggle Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all text-xs font-semibold ${
                  isExpanded
                    ? "bg-white/15 text-white border border-white/25"
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
                  className="transition-transform duration-300"
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

          {/* 
            ── EXPANDED STATE CONTENT (TRANSLUCENT GLASS CONTENT) ──
            Smooth expansion showing structured sections without locking scroll or turning black
          */}
          {isExpanded && (
            <div className="mt-5 pt-4 border-t border-white/10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pb-1">
                <span>Navigation Directory</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Active: #{activeSection}
                </span>
              </div>

              {/* Grid of Navigation Destination Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className={`p-3 rounded-2xl text-left transition-all flex flex-col justify-between ${
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

              {/* Direct Actions & Support Footer Strip */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-950/40 hover:opacity-95 transition-all"
                >
                  Contact Operator →
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
