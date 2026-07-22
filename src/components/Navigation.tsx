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
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));

      // If at bottom of page, highlight last section (inquiry)
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;

      if (isAtBottom) {
        setActiveSection(sections[sections.length - 1]);
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
      setActiveSection(current);
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
      {/* ── FIXED Dynamic Island nav ── */}
      <header
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "calc(100vw - 32px)",
          maxWidth: "max-content",
        }}
        className="flex justify-center"
        role="banner"
      >
        {/* ── Desktop capsule ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{
            background: scrolled
              ? "rgba(16, 16, 24, 0.5)"
              : "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0, 0, 0, 0.4)"
              : "0 4px 20px rgba(0, 0, 0, 0.25)",
            transition: "all 0.35s ease",
          }}
        >
          {/* SA logo — toplogo1 transparent PNG logo */}
          <button
            onClick={() => scrollTo("#home")}
            className="mr-2 flex-shrink-0 focus-visible:outline-none"
            aria-label="SocialAssist Home"
            style={{ lineHeight: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/toplogo1.png"
              alt="SA"
              width={28}
              height={28}
              style={{
                objectFit: "contain",
                background: "transparent",
                display: "block",
                filter: "drop-shadow(0 0 8px rgba(124,58,237,0.7)) drop-shadow(0 0 14px rgba(155,92,255,0.45))",
              }}
            />
          </button>

          {/* Thin divider */}
          <div
            className="mr-2"
            style={{
              width: "1px",
              height: "14px",
              background: "rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />

          {/* Nav links */}
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="relative px-3 py-1 rounded-full text-sm font-medium transition-all duration-250 focus-visible:outline-none whitespace-nowrap"
                style={{
                  color: isActive ? "#C5A7FF" : "rgba(235,232,245,0.85)",
                  background: isActive ? "rgba(124,58,237,0.22)" : "transparent",
                  border: isActive ? "1px solid rgba(197,167,255,0.2)" : "1px solid transparent",
                  textShadow: isActive ? "0 0 12px rgba(155,92,255,0.6)" : "0 1px 2px rgba(0,0,0,0.5)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}

          {/* Contact CTA pill */}
          <button
            onClick={() => scrollTo("#contact")}
            className="ml-2 px-3.5 py-1 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 focus-visible:outline-none whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #9B5CFF 100%)",
              boxShadow: "0 0 14px rgba(124,58,237,0.5)",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
            }}
          >
            Contact
          </button>
        </nav>

        {/* ── Mobile capsule ── */}
        <div className="flex md:hidden items-center justify-between w-full max-w-sm">
          <nav
            className="flex items-center justify-between w-full px-4 py-2 rounded-full cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: scrolled ? "rgba(16, 16, 24, 0.45)" : "rgba(16, 16, 24, 0.4)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-center gap-2">
              {/* Logo — toplogo1 PNG */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo("#home");
                }}
                style={{ lineHeight: 0 }}
                aria-label="Home"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/toplogo1.png"
                  alt="SocialAssist"
                  width={26}
                  height={26}
                  style={{
                    objectFit: "contain",
                    background: "transparent",
                    display: "block",
                    filter: "drop-shadow(0 0 8px rgba(124,58,237,0.7)) drop-shadow(0 0 14px rgba(155,92,255,0.45))",
                  }}
                />
              </button>

              <span
                className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                SocialAssist
              </span>
            </div>

            {/* Chevron Arrow Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileOpen(!mobileOpen);
              }}
              className="flex items-center justify-center p-1 focus-visible:outline-none"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C5A7FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: mobileOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </nav>
      </div>
    </header >

      {/* ── Mobile dropdown (Light Translucent Glassmorphism) ── */ }
  {
    mobileOpen && (
      <div
        style={{
          position: "fixed",
          top: "72px",
          left: "16px",
          right: "16px",
          zIndex: 9998,
          borderRadius: "24px",
          padding: "16px",
          background: "rgba(22, 18, 36, 0.68)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
        }}
        className="md:hidden"
      >
        <nav aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? "#C5A7FF" : "rgba(235, 232, 245, 0.85)",
                  background: isActive ? "rgba(124, 58, 237, 0.25)" : "transparent",
                  border: isActive ? "1px solid rgba(197, 167, 255, 0.25)" : "1px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => scrollTo("#contact")}
            className="w-full mt-3 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #9B5CFF 100%)",
              boxShadow: "0 0 20px rgba(124,58,237,0.45)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Contact
          </button>
        </nav>
      </div>
    )
  }
    </>
  );
}
