"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Official Telegram paper-plane SVG
function TelegramPlaneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21.5 3.5L2.8 10.7C1.5 11.2 1.5 12 2.6 12.3L7.4 13.8L18.6 6.7C19.1 6.4 19.6 6.6 19.2 6.9L10.1 15.1H10.1L9.8 19.8C10.3 19.8 10.5 19.6 10.8 19.3L13.1 17.1L18 20.7C18.9 21.2 19.5 20.9 19.7 19.8L22.9 4.7C23.2 3.4 22.4 2.8 21.5 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface IosSlideButtonProps {
  onUnlock?: () => void;
  targetUrl?: string;
  text?: string;
  completedText?: string;
  className?: string;
}

export function IosSlideButton({
  onUnlock,
  targetUrl = "https://t.me/socialassist",
  text = "Slide to open Telegram",
  completedText = "Opening Channel...",
  className,
}: IosSlideButtonProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [maxDrag, setMaxDrag] = useState(240);

  const startXRef = useRef(0);
  const initialDragRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Recalculate max drag distance based on track and knob width
  const updateMaxDrag = useCallback(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const knobSize = 52;
      const margin = 7;
      // Distance from left margin (7px) to right margin (trackWidth - knobSize - 7px)
      const max = Math.max(0, trackWidth - knobSize - margin * 2);
      setMaxDrag(max);
    }
  }, []);

  useEffect(() => {
    updateMaxDrag();
    window.addEventListener("resize", updateMaxDrag);
    return () => window.removeEventListener("resize", updateMaxDrag);
  }, [updateMaxDrag]);

  const triggerComplete = useCallback(() => {
    setIsCompleted(true);
    setDragX(maxDrag);

    if (onUnlock) {
      onUnlock();
    } else if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    // Reset slider smoothly after completion
    setTimeout(() => {
      setIsCompleted(false);
      setDragX(0);
    }, 1800);
  }, [maxDrag, onUnlock, targetUrl]);

  // Smooth auto-slide on click if user doesn't drag
  const handleAutoSlide = useCallback(() => {
    if (isCompleted || isDragging) return;
    setIsDragging(true);

    const startTime = performance.now();
    const duration = 380; // ms

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease out quad
      const eased = t * (2 - t);
      setDragX(eased * maxDrag);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsDragging(false);
        triggerComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [isCompleted, isDragging, maxDrag, triggerComplete]);

  // Pointer event handlers (mouse & touch unified with setPointerCapture)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCompleted) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startXRef.current = e.clientX;
    initialDragRef.current = dragX;
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isCompleted) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 3) {
      hasMovedRef.current = true;
    }
    const newX = Math.max(0, Math.min(initialDragRef.current + delta, maxDrag));
    setDragX(newX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // If user merely tapped/clicked without dragging, trigger auto-slide
    if (!hasMovedRef.current) {
      handleAutoSlide();
      return;
    }

    // Dragged past 75% of track -> unlock!
    if (dragX >= maxDrag * 0.72) {
      triggerComplete();
    } else {
      // Spring back to start
      setDragX(0);
    }
  };

  // Drag progress (0 to 1)
  const progress = maxDrag > 0 ? dragX / maxDrag : 0;

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          handleAutoSlide();
        }
      }}
      role="slider"
      aria-label="Slide to open Telegram Channel"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={0}
      className={cn(
        "relative h-[66px] w-full sm:w-[340px] md:w-[360px] rounded-full overflow-hidden select-none cursor-grab active:cursor-grabbing transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        className
      )}
      style={{
        background: "linear-gradient(110deg, #42A5F5 0%, #326BEE 48%, #913CF4 100%)",
        boxShadow: isDragging
          ? "0 14px 36px -4px rgba(50, 107, 238, 0.45), 0 6px 16px -2px rgba(145, 60, 244, 0.35)"
          : "0 10px 28px -4px rgba(50, 107, 238, 0.35), 0 4px 12px -2px rgba(145, 60, 244, 0.25)",
      }}
    >
      {/* ── Shimmering iOS Text Track ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
        style={{
          paddingLeft: "58px",
          paddingRight: "20px",
          opacity: isCompleted ? 0 : Math.max(0, 1 - progress * 1.5),
        }}
      >
        <span
          className="text-[16px] sm:text-[17px] font-[650] tracking-[-0.01em] whitespace-nowrap"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.7) 75%, rgba(255,255,255,0.55) 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "ios-shimmer 2.2s infinite linear",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {text}
        </span>
      </div>

      {/* Completed State Text */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-[650] text-[16.5px] tracking-wide animate-fade-in">
          {completedText}
        </div>
      )}

      {/* ── Slide Completion Glow Bar ── */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none transition-all"
        style={{
          width: `${dragX + 26}px`,
          background: "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
        }}
      />

      {/* ── Authentic iOS Slider Knob (Draggable Pod) ── */}
      <div
        className="absolute top-[7px] w-[52px] h-[52px] rounded-full flex items-center justify-center transition-transform"
        style={{
          transform: `translate3d(${dragX}px, 0, 0)`,
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: isCompleted ? "#10B981" : "#FFFFFF",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.22), 0 1px 4px rgba(0, 0, 0, 0.12)",
          color: isCompleted ? "#FFFFFF" : "#326BEE",
        }}
      >
        {isCompleted ? (
          <Check className="w-6 h-6 text-white stroke-[2.5]" />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Telegram Plane Icon */}
            <TelegramPlaneIcon
              className={cn(
                "w-[22px] h-[22px] transition-transform duration-300",
                progress > 0.4 && "translate-x-0.5 -rotate-6"
              )}
            />
            {/* Subtle iOS arrow hint */}
            <ChevronRight
              className={cn(
                "absolute -right-1 w-3.5 h-3.5 text-sky-400/80 transition-opacity duration-200 stroke-[2.5]",
                progress > 0.3 ? "opacity-0" : "opacity-100"
              )}
            />
          </div>
        )}
      </div>

      {/* Inline styles for the iOS shimmer keyframe */}
      <style jsx>{`
        @keyframes ios-shimmer {
          0% {
            background-position: 150% 0;
          }
          100% {
            background-position: -150% 0;
          }
        }
      `}</style>
    </div>
  );
}

export default IosSlideButton;
