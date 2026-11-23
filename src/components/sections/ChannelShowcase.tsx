"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowRight,
} from "lucide-react";

// Channel URL — official SocialAssist VIP Desk
const CHANNEL_URL = "https://t.me/socialassist";

export default function ChannelShowcase() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Lazy play when visible
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => setPlaying(true))
              .catch(() => {});
          }
        }
      },
      { threshold: 0.18 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = (e?: ReactMouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekRatio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetTime = seekRatio * (videoRef.current.duration || 1);
      videoRef.current.currentTime = targetTime;
      setProgress(seekRatio * 100);
    }
  };

  const toggleFullscreen = (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section
      id="channel"
      ref={ref}
      className={`relative z-10 pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 md:px-8 transition-colors duration-500 ${
        isLight ? "bg-transparent" : "bg-[#07070A]"
      }`}
      aria-labelledby="channel-heading"
    >
      {/* ── 1. Subtle Square Grid Pattern (Dark Mode Only) ── */}
      {!isLight && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(80, 110, 170, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(80, 110, 170, 0.055) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      )}

      {/* ── 2. Cinematic Ambient Glows (Dark Mode Only) ── */}
      {!isLight && (
        <>
          {/* Upper-left soft blue glow */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 sm:-top-32 sm:-left-32 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full pointer-events-none blur-[90px] sm:blur-[120px] transition-opacity duration-700 -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(22, 141, 235, 0.12) 0%, transparent 70%)",
            }}
          />

          {/* Lower-right soft lavender glow */}
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 sm:-bottom-32 sm:-right-32 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full pointer-events-none blur-[90px] sm:blur-[120px] transition-opacity duration-700 -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(135, 61, 245, 0.12) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      <div className="relative max-w-5xl mx-auto z-10">
        {/* ── 3. Heading Section ── */}
        <div
          className="text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          {/* Badge: CHANNEL EXPERIENCE */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-mono shadow-xs transition-colors ${
                isLight
                  ? "bg-[#EFF6FF] text-[#168DEB] border border-[#C7DFFF] shadow-[0_2px_8px_rgba(22,141,235,0.08)]"
                  : "bg-blue-950/40 text-blue-300 border border-blue-800/40"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#168DEB]" strokeWidth={1.8} />
              <span>Channel Experience</span>
              <Sparkles className="w-3.5 h-3.5 text-[#873DF5]" strokeWidth={1.8} />
            </span>
          </div>

          {/* Main Heading: Inside SocialAssist */}
          <h2
            id="channel-heading"
            className={`text-4xl sm:text-5xl md:text-[56px] lg:text-[60px] font-extrabold tracking-[-1.5px] leading-tight mb-4 sm:mb-5 ${
              isLight ? "text-[#101522]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Inside{" "}
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#168DEB] via-[#326BEE] to-[#873DF5] font-extrabold">
              SocialAssist
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className={`text-[17px] sm:text-[18px] md:text-[19px] max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12 font-normal ${
              isLight ? "text-[#586780]" : "text-zinc-300"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Explore the network, updates, services and community experience.
          </p>
        </div>

        {/* ── 4. Video Showcase Outer Glass Frame ── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
            filter: visible ? "blur(0px)" : "blur(4px)",
            transition: "opacity 0.9s ease-out 0.15s, transform 0.9s ease-out 0.15s, filter 0.9s ease-out 0.15s",
          }}
          className="relative"
        >
          {/* Soft blue-violet ambient glow around frame */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 sm:-inset-6 rounded-[36px] sm:rounded-[44px] pointer-events-none -z-10 blur-[40px] sm:blur-[60px] opacity-75 transition-opacity duration-700"
            style={{
              background: isLight
                ? "radial-gradient(ellipse at 50% 50%, rgba(135, 61, 245, 0.16) 0%, rgba(22, 141, 235, 0.12) 40%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(135, 61, 245, 0.3) 0%, rgba(22, 141, 235, 0.18) 40%, transparent 70%)",
            }}
          />

          {/* White/light glass surface container */}
          <div
            className={`relative rounded-[28px] sm:rounded-[36px] p-2.5 sm:p-4 md:p-5 border transition-all duration-700 ${
              isLight
                ? "bg-white/95 border-[#E3E8F2] shadow-[0_24px_70px_-15px_rgba(16,24,40,0.08),0_2px_8px_rgba(16,24,40,0.04)]"
                : "bg-[#0d0f18]/95 border-white/10 shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_2px_8px_rgba(255,255,255,0.02)]"
            } backdrop-blur-2xl`}
          >
            {/* ── Video Window Container ── */}
            <div
              ref={containerRef}
              className="relative rounded-2xl sm:rounded-[24px] overflow-hidden bg-[#0d0f18] group"
              style={{ aspectRatio: "16/9" }}
            >
              {/* Device Header Bar */}
              <div
                className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/[0.08] select-none"
                style={{ background: "#191923" }}
              >
                {/* Window Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28CA42]" />
                </div>

                {/* Center Title */}
                <div className="flex items-center gap-2 text-xs font-medium text-[#B8B5C8] font-mono">
                  <div className="w-4 h-4 rounded bg-[#713CF6]/30 flex items-center justify-center text-[9px] font-bold text-[#A78BFA]">
                    SA
                  </div>
                  <span>SocialAssist · Channel</span>
                </div>

                {/* Right Live Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
                  </span>
                  <span className="text-xs font-mono text-[#B8B5C8]">Live</span>
                </div>
              </div>

              {/* Video Player */}
              <video
                ref={videoRef}
                src="/videos/channel.mp4"
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
                aria-label="SocialAssist channel showcase video"
              />

              {/* Minimalist Gradient Overlay at Bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85 transition-opacity duration-300"
                aria-hidden="true"
              />

              {/* Play/Pause Large Center Watermark on Pause */}
              {!playing && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-[#191923]/90 border border-white/20 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* ── Playback Controls Bar ── */}
              <div className="absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-4 flex flex-col gap-2 z-20">
                {/* Interactive Progress Scrubber */}
                <div
                  onClick={handleSeek}
                  className="relative w-full h-1.5 sm:h-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer overflow-hidden transition-all group/bar"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#168DEB] via-[#4F46E5] to-[#873DF5] rounded-full transition-all duration-100 will-change-[width]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white text-xs">
                  {/* Left Controls: Play/Pause & Timestamp */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-8 h-8 rounded-full bg-[#191923]/80 hover:bg-[#191923] border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                      aria-label={playing ? "Pause video" : "Play video"}
                    >
                      {playing ? (
                        <Pause className="w-3.5 h-3.5 text-white fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                      )}
                    </button>
                    <span className="font-mono text-[11px] text-white/80 hidden sm:inline">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls: Mute/Unmute & Fullscreen */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-full bg-[#191923]/80 hover:bg-[#191923] border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                      aria-label={muted ? "Unmute video" : "Mute video"}
                    >
                      {muted ? (
                        <VolumeX className="w-3.5 h-3.5 text-white" strokeWidth={1.8} />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-white" strokeWidth={1.8} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full bg-[#191923]/80 hover:bg-[#191923] border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                      aria-label="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-white" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. View Channel Button ── */}
        <div
          className="mt-7 sm:mt-8 flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.35s, transform 0.7s ease-out 0.35s",
          }}
        >
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 bg-[#F0EBFF] hover:bg-[#E8DEFF] text-[#101522] border border-[#DDD0FF] shadow-[0_4px_16px_rgba(113,60,246,0.12)] hover:shadow-[0_8px_24px_rgba(113,60,246,0.2)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View Channel</span>
            <ArrowRight
              className="w-4 h-4 text-[#713CF6] transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
