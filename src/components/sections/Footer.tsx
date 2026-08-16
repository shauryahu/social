"use client";

import Image from "next/image";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Platforms", href: "#platforms" },
  { label: "Exchange", href: "#exchange" },
  { label: "Automation", href: "#automation" },
  { label: "About", href: "#about" },
  { label: "Inquiry", href: "#inquiry" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative z-10 py-16 px-4 md:px-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      role="contentinfo"
    >
      {/* Very subtle top glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Left — brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="SocialAssist Logo"
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
              />
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#FFFFFF", fontFamily: "var(--font-space-grotesk)" }}
                >
                  SocialAssist
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(197,167,255,0.4)", fontFamily: "var(--font-inter)" }}
                >
                  Est. 2021
                </p>
              </div>
            </div>
            <p
              className="text-xs tracking-wider text-center md:text-left"
              style={{ color: "rgba(197,167,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              We Resolve. We Protect. We Elevate.
            </p>
          </div>

          {/* Center — nav */}
          <nav aria-label="Footer navigation">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm transition-colors duration-200 focus-visible:outline-none"
                  style={{ color: "rgba(217,214,227,0.45)", fontFamily: "var(--font-inter)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#C5A7FF")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(217,214,227,0.45)")}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Right — legal */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p
              className="text-xs"
              style={{ color: "rgba(217,214,227,0.3)", fontFamily: "var(--font-inter)" }}
            >
              SocialAssist © 2021–Present
            </p>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div
          className="mt-10 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p
            className="text-xs text-center leading-relaxed"
            style={{ color: "rgba(217,214,227,0.2)", fontFamily: "var(--font-inter)", maxWidth: "700px", margin: "0 auto" }}
          >
            SocialAssist is an independent digital services network. We are not affiliated with,
            endorsed by, or officially connected to Instagram, Facebook, WhatsApp, TikTok, X, OnlyFans,
            Reddit, Discord, or any other social media platform. Crypto exchange services involve inherent
            risk. Exchange rates and availability may vary. Verification outcomes are determined by
            individual platforms. Service availability may be subject to change.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4">
            {["Privacy Policy", "Terms of Service", "Service Scope", "Exchange Disclaimer"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: "rgba(197,167,255,0.25)", fontFamily: "var(--font-inter)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(197,167,255,0.6)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(197,167,255,0.25)")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
