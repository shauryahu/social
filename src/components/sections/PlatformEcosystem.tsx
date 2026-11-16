"use client";

import { useEffect, useRef, useState } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  TikTokIcon,
  XIcon,
  OnlyFansIcon,
  RedditIcon,
  DiscordIcon,
  TelegramIcon,
  YouTubeIcon,
} from "@/components/icons/PlatformIcons";
import { useTheme } from "@/components/ThemeProvider";

interface PlatformItem {
  name: string;
  category: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
}

const PLATFORMS: PlatformItem[] = [
  {
    name: "Instagram",
    category: "Meta Network",
    color: "#E1306C",
    glow: "rgba(225, 48, 108, 0.35)",
    icon: <InstagramIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(225,48,108,0.4)]" />,
  },
  {
    name: "Facebook",
    category: "Meta Ecosystem",
    color: "#1877F2",
    glow: "rgba(24, 119, 242, 0.35)",
    icon: <FacebookIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(24,119,242,0.4)]" />,
  },
  {
    name: "WhatsApp",
    category: "Business & Chat",
    color: "#25D366",
    glow: "rgba(37, 211, 102, 0.35)",
    icon: <WhatsAppIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(37,211,102,0.4)]" />,
  },
  {
    name: "TikTok",
    category: "ByteDance Media",
    color: "#00F2FE",
    glow: "rgba(0, 242, 254, 0.35)",
    icon: <TikTokIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(0,242,254,0.4)]" />,
  },
  {
    name: "X (Twitter)",
    category: "Global Network",
    color: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.25)",
    icon: <XIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]" />,
  },
  {
    name: "Telegram",
    category: "Direct Channel",
    color: "#229ED9",
    glow: "rgba(34, 158, 217, 0.35)",
    icon: <TelegramIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(34,158,217,0.4)]" />,
  },
  {
    name: "Discord",
    category: "Community Guilds",
    color: "#5865F2",
    glow: "rgba(88, 101, 242, 0.35)",
    icon: <DiscordIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(88,101,242,0.4)]" />,
  },
  {
    name: "Reddit",
    category: "Forum & Subreddits",
    color: "#FF4500",
    glow: "rgba(255, 69, 0, 0.35)",
    icon: <RedditIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(255,69,0,0.4)]" />,
  },
  {
    name: "OnlyFans",
    category: "Creator Platform",
    color: "#00AFF0",
    glow: "rgba(0, 175, 240, 0.35)",
    icon: <OnlyFansIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(0,175,240,0.4)]" />,
  },
  {
    name: "YouTube",
    category: "Google Video",
    color: "#FF0000",
    glow: "rgba(255, 0, 0, 0.35)",
    icon: <YouTubeIcon className="w-8 h-8 drop-shadow-[0_4px_12px_rgba(255,0,0,0.4)]" />,
  },
];

export default function PlatformEcosystem() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    let ticking = false;
    let clientX = 0;
    let clientY = 0;

    const updateMousePos = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          const newX = ((clientX - rect.left) / rect.width - 0.5) * 16;
          const newY = ((clientY - rect.top) / rect.height - 0.5) * 16;
          setMousePos({ x: newX, y: newY });
        }
      }
      ticking = false;
    };

    const handler = (e: MouseEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateMousePos);
      }
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const top = PLATFORMS.slice(0, 5);
  const bottom = PLATFORMS.slice(5);

  return (
    <section
      id="platforms"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden"
      aria-labelledby="platforms-heading"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[900px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block text-cyan-500 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ✦ Verified Platform Coverage ✦
          </span>
          <h2
            id="platforms-heading"
            className={`text-3xl md:text-5xl font-black mb-4 tracking-tight ${
              isLight ? "text-slate-950" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            One Integrated Network.{" "}
            <span
              style={{
                background: isLight
                  ? "linear-gradient(135deg, #0284C7 0%, #6366F1 50%, #9333EA 100%)"
                  : "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Every Major Platform.
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto font-normal ${
              isLight ? "text-slate-600" : "text-zinc-400"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            SocialAssist operates across all major global digital platforms with direct policy channels,
            delivering specialized resolution and protection wherever your identity exists.
          </p>
        </div>

        {/* 3D Interactive Platform Matrix with Central SocialAssist Core */}
        <div
          className="relative flex flex-col items-center gap-6 sm:gap-8"
          style={{
            transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top Row: 5 Platforms */}
          <div className="flex gap-3 sm:gap-5 flex-wrap justify-center px-2">
            {top.map((p, i) => (
              <PlatformCard
                key={p.name}
                platform={p}
                index={i}
                visible={visible}
                isLight={isLight}
              />
            ))}
          </div>

          {/* Central SocialAssist Brand Core Node */}
          <div
            className="relative flex items-center justify-center my-3 sm:my-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.8s ease-out 0.25s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
            }}
          >
            <div
              className="flex items-center justify-center rounded-3xl p-3 sm:p-4 w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] transition-transform duration-500 hover:scale-105"
              style={{
                background: isLight
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.88) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(20, 20, 30, 0.85) 100%)",
                backdropFilter: "blur(28px) saturate(190%)",
                WebkitBackdropFilter: "blur(28px) saturate(190%)",
                border: isLight ? "1px solid rgba(15, 23, 42, 0.12)" : "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: isLight
                  ? "0 16px 40px rgba(15, 23, 42, 0.12), 0 0 32px rgba(56, 189, 248, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)"
                  : "0 16px 48px rgba(0,0,0,0.7), 0 0 32px rgba(56, 189, 248, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="SocialAssist Center Node"
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]"
              />
            </div>

            {/* Radial Connection Energy Rays */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: visible ? (isLight ? 0.25 : 0.35) : 0, transition: "opacity 1s ease-out 0.4s" }}
            >
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => (
                <div
                  key={angle}
                  className="absolute"
                  style={{
                    width: "100px",
                    height: "1px",
                    background: isLight
                      ? "linear-gradient(90deg, rgba(2, 132, 199, 0.5), transparent)"
                      : "linear-gradient(90deg, rgba(56,189,248,0.7), transparent)",
                    transformOrigin: "left center",
                    left: "50%",
                    top: "50%",
                    transform: `translateY(-50%) rotate(${angle}deg)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Row: 5 Platforms */}
          <div className="flex gap-3 sm:gap-5 flex-wrap justify-center px-2">
            {bottom.map((p, i) => (
              <PlatformCard
                key={p.name}
                platform={p}
                index={i + 5}
                visible={visible}
                isLight={isLight}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformCard({
  platform,
  index,
  visible,
  isLight = false,
}: {
  platform: PlatformItem;
  index: number;
  visible: boolean;
  isLight?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 0.05;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group select-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Glass Surface Tile with Authentic Logo */}
      <div
        className="flex flex-col items-center justify-center rounded-2xl transition-all duration-300 relative overflow-hidden"
        style={{
          width: 82,
          height: 82,
          background: isLight
            ? hovered
              ? "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(241, 245, 249, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)"
            : hovered
            ? "linear-gradient(135deg, rgba(30, 30, 42, 0.95) 0%, rgba(15, 15, 22, 0.9) 100%)"
            : "linear-gradient(135deg, rgba(20, 20, 28, 0.75) 0%, rgba(12, 12, 18, 0.65) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: hovered
            ? `1px solid ${platform.color}70`
            : isLight
            ? "1px solid rgba(15, 23, 42, 0.09)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: hovered
            ? `0 14px 30px ${platform.glow}, 0 0 0 1px ${platform.color}30, inset 0 1px 0 rgba(255,255,255,0.25)`
            : isLight
            ? "0 6px 18px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.95)"
            : "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          transform: hovered ? "translateY(-6px) scale(1.06)" : "translateY(0) scale(1)",
        }}
      >
        {/* Subtle Specular Top Highlight */}
        <div
          className={`absolute top-0 inset-x-0 h-px ${
            isLight
              ? "bg-gradient-to-r from-transparent via-white to-transparent"
              : "bg-gradient-to-r from-transparent via-white/25 to-transparent"
          }`}
        />

        <div className="transition-transform duration-300 group-hover:scale-110">
          {platform.icon}
        </div>
      </div>

      {/* Label and Platform Subtext */}
      <div className="text-center">
        <span
          className={`text-xs font-semibold block transition-colors duration-200 ${
            isLight
              ? hovered ? "text-slate-950 font-bold" : "text-slate-800"
              : hovered ? "text-white" : "text-zinc-200"
          }`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {platform.name}
        </span>
        <span
          className={`text-[10px] hidden sm:block font-mono ${
            isLight ? "text-slate-500 font-medium" : "text-zinc-500"
          }`}
        >
          {platform.category}
        </span>
      </div>
    </div>
  );
}
