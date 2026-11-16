"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Record<string, Ripple[]>>({});

  // Waterline indicator state (smooth spring-driven physics)
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
    scaleX: 1,
    direction: 1, // +1 right, -1 left
  });

  // Waterline droplet state (for liquid break-off during rapid/long navigation shifts)
  const [dropletStyle, setDropletStyle] = useState({
    x: 0,
    opacity: 0,
    scale: 0.6,
  });

  const navContainerRef = useRef<HTMLDivElement>(null);
  const navTrackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Physics animation refs for spring damping
  const animRef = useRef<number | null>(null);
  const runPhysicsLoopRef = useRef<(() => void) | null>(null);
  const physicsState = useRef({
    currentLeft: 0,
    currentWidth: 0,
    targetLeft: 0,
    targetWidth: 0,
    velocityLeft: 0,
    velocityWidth: 0,
    stretchFactor: 1,
    dropletX: 0,
    dropletVelocity: 0,
    isAnimating: false,
    direction: 1, // +1 right, -1 left
  });

  // Spring-based liquid deformation physics step
  const runSpringPhysics = useCallback(() => {
    if (typeof document !== "undefined" && document.hidden) {
      physicsState.current.isAnimating = false;
      return;
    }

    const p = physicsState.current;

    // Fluid spring constants tuned for realistic water viscosity
    const stiffness = 0.16;
    const damping = 0.74;

    // Positional spring
    const forceLeft = (p.targetLeft - p.currentLeft) * stiffness;
    p.velocityLeft = (p.velocityLeft + forceLeft) * damping;
    p.currentLeft += p.velocityLeft;

    // Dimension spring
    const forceWidth = (p.targetWidth - p.currentWidth) * stiffness;
    p.velocityWidth = (p.velocityWidth + forceWidth) * damping;
    p.currentWidth += p.velocityWidth;

    // Liquid stretch deformation: stretches horizontally proportional to velocity
    const speed = Math.abs(p.velocityLeft);
    const stretch = Math.min(Math.max(1 + speed * 0.038, 0.9), 1.35);

    // Liquid Droplet physics: when speed is high, a subtle droplet separates and lags behind
    const shouldSpawnDroplet = speed > 2.8;
    if (shouldSpawnDroplet) {
      const targetDroplet = p.currentLeft - p.direction * Math.min(speed * 3.5, 24);
      p.dropletVelocity = (p.dropletVelocity + (targetDroplet - p.dropletX) * 0.12) * 0.7;
      p.dropletX += p.dropletVelocity;
    } else {
      // Re-merge smoothly into the main liquid pill
      p.dropletVelocity = (p.dropletVelocity + (p.currentLeft + p.currentWidth * 0.5 - p.dropletX) * 0.22) * 0.65;
      p.dropletX += p.dropletVelocity;
    }

    const distToTarget = Math.abs(p.targetLeft - p.currentLeft);
    const widthDist = Math.abs(p.targetWidth - p.currentWidth);

    // Update state to trigger GPU transform
    setIndicatorStyle({
      left: p.currentLeft,
      width: Math.max(p.currentWidth, 16),
      opacity: 1,
      scaleX: stretch,
      direction: p.direction,
    });

    setDropletStyle({
      x: p.dropletX,
      opacity: shouldSpawnDroplet ? Math.min(speed * 0.18, 0.85) : Math.max(0, distToTarget * 0.02),
      scale: shouldSpawnDroplet ? Math.min(0.6 + speed * 0.08, 1.1) : 0.5,
    });

    // Check if settled to stop the RAF loop and preserve battery/GPU
    if (distToTarget < 0.15 && widthDist < 0.15 && speed < 0.1) {
      p.currentLeft = p.targetLeft;
      p.currentWidth = p.targetWidth;
      p.velocityLeft = 0;
      p.velocityWidth = 0;
      p.isAnimating = false;
      setIndicatorStyle({
        left: p.targetLeft,
        width: p.targetWidth,
        opacity: 1,
        scaleX: 1,
        direction: p.direction,
      });
      setDropletStyle((prev) => ({ ...prev, opacity: 0 }));
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    animRef.current = requestAnimationFrame(() => {
      runPhysicsLoopRef.current?.();
    });
  }, []);

  useEffect(() => {
    runPhysicsLoopRef.current = runSpringPhysics;
  }, [runSpringPhysics]);

  // Update physical target position based on the active tab DOM element
  const updateTargetFromDOM = useCallback(() => {
    const activeHref = `#${activeSection}`;
    const targetEl = itemRefs.current.get(activeHref);
    const trackEl = navTrackRef.current;

    if (!targetEl || !trackEl) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const trackRect = trackEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const targetLeft = targetRect.left - trackRect.left;
    const targetWidth = targetRect.width;

    const p = physicsState.current;
    const diff = targetLeft - p.currentLeft;
    p.direction = diff > 0 ? 1 : diff < 0 ? -1 : 0;
    p.targetLeft = targetLeft;
    p.targetWidth = targetWidth;

    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      p.currentLeft = targetLeft;
      p.currentWidth = targetWidth;
      setIndicatorStyle({
        left: targetLeft,
        width: targetWidth,
        opacity: 1,
        scaleX: 1,
        direction: p.direction,
      });
      setDropletStyle({ x: targetLeft, opacity: 0, scale: 0.6 });
      return;
    }

    // Start spring simulation loop if not already running
    if (!p.isAnimating) {
      p.isAnimating = true;
      runSpringPhysics();
    }
  }, [activeSection, runSpringPhysics]);

  // Scroll spy & background shadow on scroll
  useEffect(() => {
    let ticking = false;
    const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));

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
    window.addEventListener("resize", updateTargetFromDOM, { passive: true });

    // Handle tab visibility changes to pause loop
    const handleVisibilityChange = () => {
      if (document.hidden && animRef.current) {
        cancelAnimationFrame(animRef.current);
        physicsState.current.isAnimating = false;
      } else {
        updateTargetFromDOM();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateTargetFromDOM);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [updateTargetFromDOM]);

  // Recalculate target indicator position whenever activeSection changes
  useEffect(() => {
    const timer = setTimeout(updateTargetFromDOM, 20);
    return () => clearTimeout(timer);
  }, [activeSection, updateTargetFromDOM]);

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

  // Trigger smooth water ripple on click
  const triggerRipple = (href: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple: Ripple = { id: Date.now() + Math.random(), x, y };

    setRipples((prev) => ({
      ...prev,
      [href]: [...(prev[href] || []), newRipple],
    }));

    setTimeout(() => {
      setRipples((prev) => ({
        ...prev,
        [href]: (prev[href] || []).filter((r) => r.id !== newRipple.id),
      }));
    }, 500);
  };

  const scrollTo = (href: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) triggerRipple(href, e);
    const id = href.replace("#", "");
    setActiveSection(id === "contact" ? "inquiry" : id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsExpanded(false);
  };

  return (
    <div ref={navContainerRef} className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* 
        ── SVG GOOEY FILTER DEFINITION FOR NIMBUS WATERLINE EFFECT ──
        Applies organic liquid cohesion and droplet merging without blurring text
      */}
      <svg
        className="absolute w-0 h-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        style={{ position: "absolute", left: -9999, top: -9999 }}
      >
        <defs>
          <filter id="nimbus-waterline-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

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
        className="pointer-events-auto pt-4 px-3 flex justify-center w-full"
        role="banner"
      >
        <div
          className="relative rounded-full px-3 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2.5 transition-all duration-300 group"
          style={{
            background: scrolled
              ? "rgba(10, 13, 24, 0.82)"
              : "rgba(14, 18, 30, 0.72)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            border: isExpanded
              ? "1px solid rgba(56, 189, 248, 0.4)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: scrolled
              ? "0 18px 42px -8px rgba(0, 0, 0, 0.7), 0 0 24px -2px rgba(56, 189, 248, 0.18), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4)"
              : "0 8px 30px -5px rgba(0, 0, 0, 0.5), 0 0 18px -2px rgba(56, 189, 248, 0.12), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Top Specular Rim Reflection (Realistic Glass Reflection Highlight) */}
          <div
            className="absolute inset-x-4 top-0 h-[1.5px] rounded-t-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none opacity-80"
            aria-hidden="true"
          />

          {/* Bottom Waterline Light Sheen */}
          <div
            className="absolute inset-x-8 bottom-0 h-[1px] rounded-b-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none opacity-60"
            aria-hidden="true"
          />

          {/* Brand Logo & Name */}
          <button
            onClick={(e) => scrollTo("#home", e)}
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
              className="text-xs font-bold tracking-[0.16em] uppercase text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              SocialAssist
            </span>
          </button>

          {/* 
            ── DESKTOP WATERLINE LIQUID NAVIGATION TRACK ──
            Active liquid pill stretches fluidly with gooey deformation and droplet absorption
          */}
          <nav
            ref={navTrackRef}
            aria-label="Quick links"
            className="relative hidden md:flex items-center gap-0.5 ml-1 px-1 py-0.5 rounded-full"
          >
            {/* Subtle Vertical Glass Separator */}
            <div className="w-px h-3.5 bg-white/15 mr-1 pointer-events-none" />

            {/* 
              ── LIQUID LAYER (GOOEY FILTER APPLIED) ──
              Houses the stretching liquid pill + trailing water droplet
            */}
            <div
              className="absolute inset-0 pointer-events-none overflow-visible"
              style={{
                filter: "url(#nimbus-waterline-gooey)",
                WebkitFilter: "url(#nimbus-waterline-gooey)",
              }}
              aria-hidden="true"
            >
              {/* Active Liquid Pill Body */}
              <div
                className="absolute top-1 bottom-1 rounded-full waterline-liquid-surface transition-opacity duration-200"
                style={{
                  transform: `translate3d(${indicatorStyle.left}px, 0, 0) scaleX(${indicatorStyle.scaleX})`,
                  transformOrigin: indicatorStyle.direction >= 0 ? "left center" : "right center",
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                  willChange: "transform, width, opacity",
                }}
              >
                {/* Surface Meniscus Specular Highlight */}
                <div className="absolute inset-x-2 top-0 h-[1px] bg-white/70 rounded-full" />
              </div>

              {/* Trailing Liquid Water Droplet (Appears during longer jumps) */}
              <div
                className="absolute top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-opacity duration-150"
                style={{
                  transform: `translate3d(${dropletStyle.x}px, -50%, 0) scale(${dropletStyle.scale})`,
                  opacity: dropletStyle.opacity,
                  willChange: "transform, opacity",
                }}
              />
            </div>

            {/* 
              ── TEXT LABELS LAYER (Z-10, NEVER BLURRED) ──
              100% crisp typography on top of the liquid layer
            */}
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              const isHovered = hoveredHref === item.href;
              const itemRipples = ripples[item.href] || [];

              return (
                <button
                  key={item.href}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.href, el);
                    else itemRefs.current.delete(item.href);
                  }}
                  onClick={(e) => scrollTo(item.href, e)}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  className="relative z-10 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 overflow-hidden select-none focus-visible:outline-none"
                  style={{
                    color: isActive
                      ? "#FFFFFF"
                      : isHovered
                      ? "rgba(255, 255, 255, 0.95)"
                      : "rgba(226, 232, 240, 0.68)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {/* Hover Meniscus Response (Subtle water wave swell when hovering) */}
                  {isHovered && !isActive && (
                    <span
                      className="absolute inset-0 rounded-full bg-cyan-400/10 pointer-events-none transition-opacity duration-200"
                      aria-hidden="true"
                    />
                  )}

                  {/* Waterline Click Ripple Rings */}
                  {itemRipples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className="absolute w-8 h-8 rounded-full pointer-events-none animate-waterline-ripple"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        background: "radial-gradient(circle, rgba(56, 189, 248, 0.5) 0%, rgba(37, 99, 235, 0.2) 60%, transparent 80%)",
                      }}
                      aria-hidden="true"
                    />
                  ))}

                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Direct CTA + Nimbus Liquid Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={(e) => scrollTo("#contact", e)}
              className="relative hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] overflow-hidden group shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #7C3AED 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontFamily: "var(--font-inter)",
              }}
            >
              {/* Gloss Sheen on Contact Button */}
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
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.href}
                  onClick={(e) => scrollTo(item.href, e)}
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
              onClick={(e) => scrollTo("#contact", e)}
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
