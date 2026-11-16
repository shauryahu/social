"use client";

import { useTheme } from "@/components/ThemeProvider";
import RidgelineDitherFooter, {
  RidgelineColumn,
  RidgelineSocial,
} from "@/components/ui/ridgeline-dither-footer";

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const columns: RidgelineColumn[] = [
    {
      title: "Services",
      links: [
        { label: "Account Recovery", href: "#services" },
        { label: "Official Verification", href: "#verification", badge: "VIP" },
        { label: "Brand Protection", href: "#services" },
        { label: "Crypto OTC Exchange", href: "#exchange" },
        { label: "Automated Advertising", href: "#automation" },
      ],
    },
    {
      title: "Network",
      links: [
        { label: "Platform Ecosystem", href: "#platforms" },
        { label: "Executive Concierge", href: "#inquiry" },
        { label: "Telegram VIP Desk", href: "https://t.me/socialassist", badge: "24/7" },
        { label: "Case Security & Escrow", href: "#about" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About SocialAssist", href: "#about" },
        { label: "Network Standards", href: "#about" },
        { label: "Client Inquiries", href: "#inquiry" },
        { label: "Direct Contact", href: "#contact" },
      ],
    },
    {
      title: "Legal & Compliance",
      links: [
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Service Scope & Risk", href: "#" },
        { label: "Platform Compliance", href: "#" },
      ],
    },
  ];

  const socials: RidgelineSocial[] = [
    { icon: "x", href: "https://x.com", label: "X (Twitter)" },
    { icon: "instagram", href: "https://instagram.com", label: "Instagram" },
    { icon: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { icon: "github", href: "https://github.com", label: "GitHub" },
  ];

  const darkPalette = {
    paper: "#030309",
    ink: "#f8fafc",
    muted: "#94a3b8",
    line: "rgba(255, 255, 255, 0.08)",
    heart: "#a855f7",
    tones: [
      "#030309",
      "#0a0e1c",
      "#131a33",
      "#1e2a52",
      "#2e3e75",
      "#465899",
      "#6d82c2",
    ],
  };

  const lightPalette = {
    paper: "#f8fafc",
    ink: "#0f172a",
    muted: "#64748b",
    line: "rgba(15, 23, 42, 0.08)",
    heart: "#9333ea",
    tones: [
      "#f8fafc",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#334155",
      "#0f172a",
    ],
  };

  const customLogo = (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={isLight ? "/images/logo-apple-black.png" : "/images/logo-apple-white.png"}
        alt="SocialAssist Logo"
        width={32}
        height={32}
        className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
      />
    </div>
  );

  return (
    <div id="footer" className="relative z-10 w-full" role="contentinfo">
      {/* Ridgeline Dither Mountain Footer */}
      <RidgelineDitherFooter
        name="SocialAssist"
        brandHref="#home"
        logo={customLogo}
        tagline="We Resolve. We Protect. We Elevate. Specialized social media assistance, verification support, brand protection, and crypto OTC exchange unified through one high-security network."
        columns={columns}
        socials={socials}
        copyright={`SocialAssist Network © 2021–${new Date().getFullYear()}. All rights reserved.`}
        credit={{ label: "SocialAssist Intelligence Desk", href: "#inquiry" }}
        palette={isLight ? lightPalette : darkPalette}
        ridges={7}
        pixel={2}
        mist={0.75}
        drift={0.9}
        radius={140}
        seed={42}
        maxWidth="1200px"
        height="740px"
        sceneMinHeight="280px"
        fontFamily="var(--font-inter), -apple-system, sans-serif"
        monoFamily="var(--font-space-grotesk), monospace"
      />

      {/* Regulatory & Institutional Scope Disclaimer */}
      <div
        className="w-full py-6 px-4 md:px-8 border-t transition-colors duration-300"
        style={{
          backgroundColor: isLight ? "#f8fafc" : "#030309",
          borderColor: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <p
            className="text-[11px] leading-relaxed font-normal"
            style={{
              color: isLight ? "#64748b" : "rgba(217, 214, 227, 0.4)",
              fontFamily: "var(--font-inter)",
            }}
          >
            SocialAssist is an independent digital services network. We are not affiliated with, endorsed
            by, or officially connected to Meta Platforms (Instagram, Facebook, WhatsApp), ByteDance (TikTok),
            X Corp., Fenix International (OnlyFans), Reddit, Discord, or any other social media platform.
            Crypto exchange services involve inherent market volatility and asset risk. Exchange rates and
            liquidity availability may vary. Verification outcomes are determined by individual platform
            guidelines. Service availability is subject to verification of counterparty credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
