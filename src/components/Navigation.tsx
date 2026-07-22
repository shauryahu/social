"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Platforms", href: "#platforms" },
  { label: "Exchange", href: "#exchange" },
  { label: "Automation", href: "#automation" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
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
          width: "max-content",
          maxWidth: "calc(100vw - 32px)",
        }}
        role="banner"
      >
        {/* ── Desktop capsule ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{
            background: scrolled
              ? "rgba(16, 16, 24, 0.55)"
              : "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0, 0, 0, 0.45)"
              : "0 4px 20px rgba(0, 0, 0, 0.3)",
            transition: "all 0.35s ease",
          }}
        >
          {/* SA logo — toplogo1 transparent PNG logo with button-matching soft purple glow */}
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
        <div className="flex md:hidden items-center gap-3">
          <nav
            className="flex items-center px-3.5 py-2 rounded-full"
            style={{
              background: "rgba(16, 16, 24, 0.55)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
            }}
          >
            {/* Logo — toplogo1 PNG */}
            <button
              onClick={() => scrollTo("#home")}
              style={{ lineHeight: 0, marginRight: "10px" }}
              aria-label="Home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/toplogo1.png"
                alt="SocialAssist"
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

            <span
              className="text-sm font-semibold text-white mr-3 whitespace-nowrap"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SocialAssist
            </span>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col gap-[5px] focus-visible:outline-none"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-4 rounded-full"
                  style={{
                    height: "1.5px",
                    background: "#C5A7FF",
                    transition: "all 0.3s ease",
                    transform:
                      i === 0 && mobileOpen
                        ? "rotate(45deg) translate(2px, 2px)"
                        : i === 2 && mobileOpen
                        ? "rotate(-45deg) translate(2px, -2px)"
                        : "none",
                    opacity: i === 1 && mobileOpen ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </nav>
        </div>
      </header>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: "16px",
            right: "16px",
            zIndex: 9998,
            borderRadius: "20px",
            padding: "16px",
            background: "rgba(6,6,10,0.96)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 60px rgba(74,22,168,0.32)",
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
                    color: isActive ? "#C5A7FF" : "rgba(217,214,227,0.8)",
                    background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => scrollTo("#contact")}
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #9B5CFF 100%)",
                boxShadow: "0 0 16px rgba(124,58,237,0.3)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
