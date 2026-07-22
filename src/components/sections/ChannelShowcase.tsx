"use client";

import { useEffect, useRef, useState } from "react";

// Channel URL — configure here
const CHANNEL_URL = "https://t.me/socialassist";

export default function ChannelShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Lazy play when visible
          if (videoRef.current) {
            videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
          }
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  return (
    <section
      id="channel"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="channel-heading"
    >
      {/* Large violet glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "70vw",
          height: "70vw",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(74,22,168,0.18) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Heading */}
        <div
          className="text-center mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase mb-3 block"
            style={{ color: "#9B5CFF", fontFamily: "var(--font-inter)" }}
          >
            Channel Experience
          </span>
          <h2
            id="channel-heading"
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Inside{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C5A7FF, #9B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SocialAssist
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(217,214,227,0.6)", fontFamily: "var(--font-inter)" }}
          >
            Explore the network, updates, services and community experience.
          </p>
        </div>

        {/* Video frame */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
            filter: visible ? "blur(0px)" : "blur(4px)",
            transition: "opacity 0.9s ease-out 0.15s, transform 0.9s ease-out 0.15s, filter 0.9s ease-out 0.15s",
          }}
        >
          {/* Outer glow ring */}
          <div
            className="rounded-3xl p-3"
            style={{
              background: "rgba(16,16,22,0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 0 80px rgba(74,22,168,0.3), 0 0 160px rgba(74,22,168,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {/* Device-inspired top bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5 rounded-t-2xl"
              style={{
                background: "rgba(8,8,12,0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Dots */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28CA42" }} />
              </div>

              {/* Title */}
              <div
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "rgba(197,167,255,0.6)", fontFamily: "var(--font-inter)" }}
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.3)" }}
                >
                  <span style={{ fontSize: 8, color: "#C5A7FF" }}>SA</span>
                </div>
                SocialAssist · Channel
              </div>

              {/* Live indicator */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#28CA42", boxShadow: "0 0 4px #28CA42" }}
                />
                <span className="text-xs" style={{ color: "rgba(217,214,227,0.4)", fontFamily: "var(--font-inter)" }}>Live</span>
              </div>
            </div>

            {/* Video container */}
            <div className="relative rounded-b-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <video
                ref={videoRef}
                src="/videos/channel.mp4"
                muted={muted}
                loop
                playsInline
                preload="none"
                className="w-full h-full object-cover"
                aria-label="SocialAssist channel showcase video"
              />

              {/* Bottom gradient */}
              <div
                className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(8,8,12,0.6), transparent)",
                }}
              />

              {/* Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: "rgba(8,8,12,0.75)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label={playing ? "Pause video" : "Play video"}
                >
                  {playing ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#C5A7FF">
                      <rect x="2" y="1" width="3" height="10" rx="1"/>
                      <rect x="7" y="1" width="3" height="10" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#C5A7FF">
                      <path d="M3 2l7 4-7 4V2z"/>
                    </svg>
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: muted ? "rgba(124,58,237,0.5)" : "rgba(8,8,12,0.75)",
                    backdropFilter: "blur(10px)",
                    border: muted ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A7FF" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA below video */}
        <div
          className="mt-8 flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.4s, transform 0.7s ease-out 0.4s",
          }}
        >
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4A16A8, #7C3AED, #9B5CFF)",
              boxShadow: "0 0 32px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            View Channel
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
