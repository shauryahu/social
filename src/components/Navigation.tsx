"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LiquidNavbar, NimbusIcons, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";

const NAV_ITEMS: (LiquidNavItem & { id: string })[] = [
  { id: "home", label: "Home", href: "#home", icon: NimbusIcons.home, fx: "glow" },
  { id: "services", label: "Services", href: "#services", icon: NimbusIcons.globe, fx: "spin" },
  { id: "platforms", label: "Platforms", href: "#platforms", icon: NimbusIcons.plane, fx: "plane" },
  { id: "exchange", label: "Exchange", href: "#exchange", icon: NimbusIcons.drop, fx: "drop" },
  { id: "automation", label: "Automation", href: "#automation", icon: NimbusIcons.user, fx: "wave" },
  { id: "about", label: "About", href: "#about", icon: NimbusIcons.home, fx: "pop" },
  { id: "inquiry", label: "Inquiry", href: "#inquiry", icon: NimbusIcons.drop, fx: "glow" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Scroll spy & background shadow on scroll
  useEffect(() => {
    let ticking = false;
    const sections = NAV_ITEMS.map((item) => item.id);

    const updateActiveSection = () => {
      const isScrolledNow = window.scrollY > 30;
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

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((it) => it.id === activeSection)
  );

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
          background: "rgba(5, 7, 14, 0.45)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          willChange: "opacity",
        }}
        onClick={() => setIsExpanded(false)}
        aria-hidden="true"
      />

      {/* ── TOP COMPACT FLOATING LIQUID GLASS BAR (NIMBUS WATERLINE) ── */}
      <header
        className="pointer-events-auto pt-3 px-2 sm:px-3 flex justify-center w-full"
        role="banner"
      >
        <div
          className="relative rounded-full px-2.5 sm:px-3 py-1 flex items-center justify-between gap-1 sm:gap-2.5 transition-all duration-300 group max-w-full overflow-x-auto no-scrollbar"
          style={{
            background: scrolled
              ? "rgba(10, 13, 24, 0.86)"
              : "rgba(14, 18, 30, 0.74)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            border: isExpanded
              ? "1px solid rgba(56, 189, 248, 0.4)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: scrolled
              ? "0 18px 42px -8px rgba(0, 0, 0, 0.75), 0 0 24px -2px rgba(56, 189, 248, 0.18), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4)"
              : "0 8px 30px -5px rgba(0, 0, 0, 0.5), 0 0 18px -2px rgba(56, 189, 248, 0.12), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Top Specular Rim Reflection (Realistic Glass Reflection Highlight) */}
          <div
            className="absolute inset-x-4 top-0 h-[1.5px] rounded-t-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none opacity-80"
            aria-hidden="true"
          />

          {/* Brand Logo & Name */}
          <button
            onClick={() => scrollTo("#home")}
            className="relative flex items-center gap-2 pl-1 pr-1.5 py-0.5 rounded-full flex-shrink-0 focus-visible:outline-none group text-left transition-transform duration-200 hover:scale-[1.02]"
            aria-label="SocialAssist Home"
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-[6px] bg-cyan-400/30 group-hover:bg-cyan-400/50 transition-all duration-300"
                aria-hidden="true"
              />
              <Image
                src="/images/toplogo1.png"
                alt="SocialAssist Logo"
                width={26}
                height={26}
                priority
                className="relative w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              />
            </div>
            <span
              className="text-xs font-bold tracking-[0.16em] uppercase text-white hidden xs:inline"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              SocialAssist
            </span>
          </button>

          {/* 
            ── NIMBUS UI LIQUID NAVBAR ("WATERLINE") ──
            Full WebGL water shader, spring deformation physics, icon animations, and ripples
          */}
          <div className="hidden md:flex items-center">
            <LiquidNavbar
              tone="dark"
              items={NAV_ITEMS}
              active={activeIndex}
              onChange={(idx, item) => {
                if (item.href) scrollTo(item.href);
              }}
              sound={false}
              className="text-xs !bg-transparent !p-0.5 !border-0"
            />
          </div>

          {/* Right Controls: Direct CTA + Nimbus Liquid Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => scrollTo("#contact")}
              className="relative hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] overflow-hidden group shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #7C3AED 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontFamily: "var(--font-inter)",
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-hidden="true"
              />
              <span className="relative z-10">Contact</span>
            </button>

            {/* Menu Toggle Button */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 text-xs font-semibold overflow-hidden ${
                isExpanded
                  ? "bg-cyan-500/20 text-white border border-cyan-400/40 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
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
                className="transition-transform duration-250 ease-out"
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
        ── EXPANDED FLOATING LIQUID GLASS PANEL ──
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
          className="relative rounded-3xl p-5 sm:p-6 overflow-hidden"
          style={{
            background: "rgba(11, 14, 25, 0.82)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            boxShadow:
              "0 28px 70px rgba(0, 0, 0, 0.75), 0 0 36px rgba(56, 189, 248, 0.16), inset 0 1.5px 1px rgba(255, 255, 255, 0.28), inset 0 -1px 2px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Top Glass Specular Highlight for Expanded Window */}
          <div
            className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
            aria-hidden="true"
          />

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
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.href}
                  onClick={() => item.href && scrollTo(item.href)}
                  className={`relative p-3 rounded-2xl text-left transition-all duration-150 flex flex-col justify-between overflow-hidden group ${
                    isActive
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 text-white shadow-lg shadow-cyan-950/40"
                      : "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 text-zinc-300 hover:text-white"
                  }`}
                >
                  {/* Subtle Top Specular line for active cards */}
                  {isActive && (
                    <div className="absolute inset-x-2 top-0 h-[1px] bg-white/40 pointer-events-none" />
                  )}
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-zinc-400 font-mono mt-1 group-hover:text-cyan-300 transition-colors">
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
