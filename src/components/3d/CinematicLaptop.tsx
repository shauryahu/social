"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface CinematicLaptopProps {
  className?: string;
}

export default function CinematicLaptop({ className = "" }: CinematicLaptopProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // State
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [initialOpen, setInitialOpen] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // 1. Initial Opening Movement on Site Load
  useEffect(() => {
    // Graceful initial entrance: starts slightly closed then opens smoothly
    const timer = setTimeout(() => {
      setInitialOpen(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // 2. Scroll-Synchronized Kinematic Motion (Opens & Closes with Scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Start opening as laptop approaches viewport center (rect.top enters viewport)
      // Fully open when in primary focus, then closes as it scrolls off-screen
      const startOpen = windowH * 0.95;
      const fullyOpen = windowH * 0.45;
      const startClose = windowH * 0.1;
      const fullyClosed = -rect.height * 0.5;

      let p = 0;
      if (rect.top > fullyOpen) {
        // Scrolling in from top
        p = (startOpen - rect.top) / (startOpen - fullyOpen);
      } else if (rect.top >= startClose) {
        // Center hero viewing zone
        p = 1;
      } else {
        // Scrolling away past the top
        p = (rect.top - fullyClosed) / (startClose - fullyClosed);
      }

      const clamped = Math.max(0, Math.min(1, p));
      setScrollProgress(clamped);

      // Auto play video when visible
      if (videoRef.current) {
        if (clamped > 0.1 && videoRef.current.paused && playing) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [playing]);

  // 3. Mouse Parallax for subtle 3D tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseTilt({ x: x * 6, y: -y * 4 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseTilt({ x: 0, y: 0 });
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  }, []);

  // Compute final kinematic lid angle:
  // When initialOpen is false, begins closed (82° down).
  // Once loaded and as scrolled, angle interpolates between ~85° (closed) and -10° (opened back).
  const effectiveProgress = initialOpen ? scrollProgress : 0;
  // Lid rotation: 82° (closed) down to -8° (open ergonomic viewing angle)
  const lidRotationX = 82 - effectiveProgress * 90;
  // Dynamic screen luminescence based on openness
  const screenGlowOpacity = Math.max(0, (effectiveProgress - 0.25) / 0.75);

  return (
    <div
      ref={sectionRef}
      className={`relative w-full max-w-5xl mx-auto py-6 sm:py-10 px-2 sm:px-4 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Status & Open Progress Indicator Strip ── */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-4 px-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-medium">
            Next-Gen MacBook Pro · Real-Time Cinematic Engine
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-zinc-500">Lid Open:</span>
          <span className="text-cyan-500 dark:text-cyan-400 font-bold tabular-nums">
            {Math.round(effectiveProgress * 100)}%
          </span>
        </div>
      </div>

      {/* ── 3D KINEMATIC STAGE ── */}
      <div
        className="relative w-full aspect-[16/10] max-h-[580px] flex items-center justify-center select-none"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 38%",
        }}
      >
        {/* Ambient Under-Chassis Specular Ground Shadow & Aura */}
        <div
          className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[720px] h-[70px] rounded-full pointer-events-none transition-all duration-700"
          style={{
            background: isLight
              ? `radial-gradient(ellipse at center, rgba(15, 23, 42, 0.28) 0%, rgba(14, 165, 233, ${
                  0.15 * screenGlowOpacity
                }) 35%, transparent 70%)`
              : `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(56, 189, 248, ${
                  0.25 * screenGlowOpacity
                }) 40%, transparent 70%)`,
            filter: "blur(28px)",
            transform: `scale(${0.9 + effectiveProgress * 0.1})`,
          }}
        />

        {/* ── 3D Tilting Laptop Body Rig ── */}
        <div
          className="relative w-full max-w-[780px] aspect-[650/400] transition-transform duration-300 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${mouseTilt.x}deg) rotateX(${22 + mouseTilt.y}deg)`,
          }}
        >
          {/* ══════════════ 1. THE BASE (KEYBOARD & LOWER UNIBODY CHASSIS) ══════════════ */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "50% 100%",
            }}
          >
            <svg
              viewBox="0 0 650 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xl"
            >
              {/* Lower unibody aluminum base chassis */}
              <path
                fill="#acadaf"
                d="M19.04,362.77h611.92v10.39c0,5.95-4.83,10.79-10.79,10.79H29.83c-5.95,0-10.79-4.83-10.79-10.79v-10.39h0Z"
              />

              {/* Base bottom feet and precision bevels */}
              <polygon
                fill="#b9b9bb"
                points="600.06 385.39 567.29 385.39 565.84 383.95 601.82 383.95 600.06 385.39"
              />
              <polygon
                fill="#292929"
                points="598.73 386.82 568.64 386.82 567.32 385.39 600.35 385.39 598.73 386.82"
              />
              <polygon
                fill="#b9b9bb"
                points="82.64 385.39 49.87 385.39 48.43 383.95 84.41 383.95 82.64 385.39"
              />
              <polygon
                fill="#292929"
                points="81.31 386.82 51.23 386.82 49.9 385.39 82.93 385.39 81.31 386.82"
              />

              {/* Display opening thumb notch */}
              <path
                fill="#8f9091"
                d="M278.11,362.6h94.05c0,3.63-2.95,6.58-6.58,6.58h-80.89c-3.63,0-6.58-2.95-6.58-6.58h0Z"
              />

              {/* Hinge bar trim */}
              <rect fill="#1d1d1d" x="69.09" y="350.51" width="512.11" height="12.48" rx="2" />

              {/* Keyboard Well Top Surface (Illuminated by screen glow) */}
              <rect
                x="69.09"
                y="353"
                width="512.11"
                height="10"
                fill="url(#hingeShadow)"
              />

              <defs>
                <linearGradient id="hingeShadow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a0a0f" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#acadaf" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ══════════════ 2. THE ARTICULATED 3D LID (SCREEN & VIDEO) ══════════════ */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              transformStyle: "preserve-3d",
              // Hinge pivot point aligns exactly with y = 362.77px on the 400px tall canvas
              transformOrigin: "50% 90.69%",
              transform: `rotateX(${lidRotationX}deg)`,
              willChange: "transform",
            }}
          >
            <svg
              viewBox="0 0 650 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-2xl"
            >
              {/* Outer aluminum lid chassis */}
              <path
                fill="#a4a5a7"
                d="M79.56,13.18h491.32c7.23,0,13.1,5.87,13.1,13.1v336.61H66.46V26.28c0-7.23,5.87-13.1,13.1-13.1Z"
              />

              {/* Inner display bezel rim */}
              <path
                fill="#222222"
                d="M79.96,14.24h490.45c6.83,0,12.37,5.54,12.37,12.37v336.28H67.59V26.6c0-6.83,5.54-12.37,12.37-12.37Z"
              />

              {/* Display frame border */}
              <path
                fill="#000000"
                d="M570.25,15.74H80.34c-6.12,0-11.08,4.96-11.08,11.08v336.07h512.08V26.82c0-6.12-4.96-11.08-11.08-11.08ZM575.74,345.17H74.52V27.31c0-3.31,2.68-5.99,5.99-5.99h489.24c3.31,0,5.99,2.68,5.99,5.99v317.86Z"
              />

              {/* Display black screen backdrop */}
              <rect
                fill="#000000"
                x="74.52"
                y="21.32"
                width="501.22"
                rx="5"
                ry="5"
                height="323.85"
              />

              {/* ── LIVE HARDWARE-ACCELERATED VIDEO PLAYER INSIDE SCREEN ── */}
              <foreignObject
                x="74.52"
                y="21.32"
                width="501.22"
                height="323.85"
                clipPath="url(#roundedScreen)"
              >
                <div className="w-full h-full overflow-hidden rounded-[5px] bg-black relative group">
                  <video
                    ref={videoRef}
                    src="/videos/intro.mp4"
                    autoPlay
                    loop
                    muted={muted}
                    playsInline
                    className="w-full h-full object-cover select-none pointer-events-auto"
                  />

                  {/* Specular Glare Sheen Reflection across screen */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)",
                      opacity: 0.8,
                    }}
                  />
                </div>
              </foreignObject>

              {/* Camera Notch Cutout */}
              <path
                fill="#000000"
                d="M298.14,21.02h54.07v6.5c0,1.56-1.27,2.82-2.82,2.82h-48.42c-1.56,0-2.82-1.27-2.82-2.82v-6.5h0Z"
              />

              {/* FaceTime HD Camera Lens */}
              <circle cx="325.11" cy="24.2" r="1.6" fill="#080d4c" />
              <circle cx="325.5" cy="23.8" r="0.6" fill="#38bdf8" opacity="0.8" />

              {/* Hinge base cap on lid */}
              <rect fill="#1d1d1d" x="69.09" y="350.51" width="512.11" height="12.48" />

              <defs>
                <clipPath id="roundedScreen">
                  <rect
                    fill="#ffffff"
                    x="74.52"
                    y="21.32"
                    width="501.22"
                    height="323.85"
                    rx="5"
                    ry="5"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Studio Glass Controls Bar ── */}
      <div className="mt-4 flex items-center justify-between gap-3 px-5 py-2.5 rounded-full bg-slate-900/80 dark:bg-[#10121C]/80 backdrop-blur-xl border border-white/10 shadow-xl text-xs max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium transition-all hover:scale-105 active:scale-95"
            aria-label={playing ? "Pause Video" : "Play Video"}
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? "Pause" : "Play"}</span>
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95"
            aria-label={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{muted ? "Unmute" : "Mute"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-zinc-300 text-[11px] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>MacBook Pro 16″ Liquid Retina</span>
        </div>
      </div>
    </div>
  );
}
