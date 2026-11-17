"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MilestoneItem {
  number: string;
  year: string;
  label: string;
  subtitle: string;
  desc: string;
  pillars: string[];
  badge: string;
}

const MILESTONES: MilestoneItem[] = [
  {
    number: "01",
    year: "2021",
    label: "Foundation",
    subtitle: "Genesis & Account Protection",
    desc: "SocialAssist established with a singular focus on account recovery, restoration, and digital identity defense across emerging social platforms.",
    pillars: [
      "Specialized Account Recovery",
      "Direct Senior Escalation",
      "Zero Intermediary Handling",
    ],
    badge: "EST. 2021 · FIRST MILESTONE",
  },
  {
    number: "02",
    year: "2022",
    label: "Expansion",
    subtitle: "Verification Infrastructure & Brand Safeguards",
    desc: "Verification support and enterprise brand protection introduced, scaling institutional compliance and executive impersonation defense.",
    pillars: [
      "Official Verification Support",
      "Brand Protection & Takedowns",
      "Dedicated Case Management",
    ],
    badge: "2022 · ECOSYSTEM GROWTH",
  },
  {
    number: "03",
    year: "2023",
    label: "Evolution",
    subtitle: "High-Volume Escrows & Programmatic Advertising",
    desc: "OTC crypto exchange services and automated advertising engines introduced to create an end-to-end multi-platform digital utility.",
    pillars: [
      "Crypto OTC Escrow (INR / USDT)",
      "Automated Advertising Engines",
      "Cross-Platform Campaign Delivery",
    ],
    badge: "2023 · SERVICE DIVERSIFICATION",
  },
  {
    number: "04",
    year: "2024+",
    label: "Network",
    subtitle: "Unified Digital Platform Ecosystem",
    desc: "Full integrated digital assistance network — one cohesive point of contact for premier account assistance, OTC escrows, and advertising worldwide.",
    pillars: [
      "Unified Assistance Network",
      "Multi-Platform Support",
      "24/7 Verified Telegram Desk",
    ],
    badge: "2024+ · GLOBAL NETWORK",
  },
];

// High-precision mechanical scroll sound synthesizer via Web Audio API
class MechanicalScrollAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastPlayTime: number = 0;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick(strength: number = 1.0) {
    if (this.isMuted || typeof window === "undefined") return;
    const now = performance.now();
    // Throttle to prevent overlapping audio (minimum 80ms gap)
    if (now - this.lastPlayTime < 80) return;
    this.lastPlayTime = now;

    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Precision mechanical detent click: 1.85kHz bandpass with fast decay
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1850, t);
      filter.Q.setValueAtTime(3.2, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(2100, t);
      osc.frequency.exponentialRampToValueAtTime(750, t + 0.012);

      // Volume is restrained and calibrated (0.04 - 0.06 max)
      const vol = Math.min(0.06, 0.04 * strength);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.016);
    } catch {
      // Ignore if browser restricts autoplay audio
    }
  }
}

const audioEngine = new MechanicalScrollAudio();

// ── Milestone Content Subcomponent ──
interface MilestoneCardContentProps {
  item: MilestoneItem;
  isLight: boolean;
  isEntering: boolean;
}

function MilestoneCardContent({ item, isLight, isEntering }: MilestoneCardContentProps) {
  return (
    <div className="flex flex-col justify-center">
      {/* Year & Milestone Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight select-none",
            isLight
              ? "text-slate-950"
              : "bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-purple-300"
          )}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {item.year}
        </span>

        <span
          className={cn(
            "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono border select-none",
            isLight
              ? "bg-purple-100/70 text-purple-800 border-purple-200"
              : "bg-purple-900/30 text-purple-300 border-purple-700/40"
          )}
        >
          {item.badge}
        </span>
      </div>

      {/* Title & Subtitle */}
      <h4
        className={cn(
          "text-lg sm:text-xl font-bold tracking-tight mb-1",
          isLight ? "text-slate-900" : "text-white"
        )}
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {item.label}
      </h4>
      <p
        className={cn(
          "text-xs sm:text-[13px] font-semibold mb-3",
          isLight ? "text-purple-700" : "text-purple-400"
        )}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {item.subtitle}
      </p>

      {/* Description */}
      <p
        className={cn(
          "text-xs sm:text-sm leading-relaxed mb-4",
          isLight ? "text-slate-600 font-medium" : "text-zinc-400"
        )}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {item.desc}
      </p>

      {/* 3 Pillars Chips with Staggered Cascading Animation */}
      <div className="flex flex-wrap gap-2">
        {item.pillars.map((pillar, idx) => {
          const delayMs = isEntering ? 100 + idx * 70 : 0;
          return (
            <span
              key={pillar}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11.5px] font-semibold border transition-colors select-none",
                isLight
                  ? "bg-slate-100/90 text-slate-800 border-slate-200"
                  : "bg-white/[0.04] text-zinc-300 border-white/10"
              )}
              style={{
                animation: isEntering
                  ? `milestone-chip-stagger 0.36s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms backwards`
                  : "none",
                willChange: "transform, opacity",
              }}
            >
              <Check
                className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0"
                strokeWidth={2.5}
              />
              <span>{pillar}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface JourneyScrollTimelineProps {
  isLight?: boolean;
}

export default function JourneyScrollTimeline({ isLight = true }: JourneyScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Milestone transition state
  const [activeStep, setActiveStep] = useState(0);
  const [exitingStep, setExitingStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Wheel physics state
  const rotationAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const lastDetentStepRef = useRef(0);

  // Debounce accumulator for mouse-wheel gestures
  const wheelAccumulatorRef = useRef(0);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch gesture tracking state
  const touchStartYRef = useRef(0);
  const touchLastYRef = useRef(0);

  // Detect pointer capability (touch vs precision mouse)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasCoarse = window.matchMedia("(pointer: coarse)").matches;
    const hasFine = window.matchMedia("(pointer: fine)").matches;
    setIsTouchDevice(hasCoarse && !hasFine);
  }, []);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  // ── Unified Step Transition Trigger ──
  const triggerStepTransition = useCallback(
    (targetStep: number) => {
      if (targetStep === activeStep) return;
      const clamped = Math.max(0, Math.min(3, targetStep));
      if (clamped === activeStep) return;

      const dir = clamped > activeStep ? "forward" : "backward";
      setDirection(dir);
      setExitingStep(activeStep);
      setActiveStep(clamped);
      setIsTransitioning(true);

      // Rotate wheel towards the target position
      targetAngleRef.current = clamped * 1.85;
      audioEngine.playClick(1.0);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setExitingStep(null);
      }, 460);
    },
    [activeStep]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // ── Real-Time Scroll Wheel Detection & Scope Isolation ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY;

      // 1. Immediate real-time 3D wheel rotation (Zero lag!)
      targetAngleRef.current += delta * 0.007;

      // 2. Accumulate delta for milestone progression
      wheelAccumulatorRef.current += delta;

      // If currently mid-transition, absorb scroll so page doesn't stutter
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      const threshold = 60; // Clean, natural detent threshold

      if (wheelAccumulatorRef.current >= threshold) {
        if (activeStep < 3) {
          // Advance to next milestone and isolate page scroll
          e.preventDefault();
          wheelAccumulatorRef.current = 0;
          triggerStepTransition(activeStep + 1);
        } else {
          // At milestone 4 (end): do NOT preventDefault! Let page scroll down naturally!
          wheelAccumulatorRef.current = 0;
        }
      } else if (wheelAccumulatorRef.current <= -threshold) {
        if (activeStep > 0) {
          // Return to previous milestone and isolate page scroll
          e.preventDefault();
          wheelAccumulatorRef.current = 0;
          triggerStepTransition(activeStep - 1);
        } else {
          // At milestone 1 (start): do NOT preventDefault! Let page scroll up naturally!
          wheelAccumulatorRef.current = 0;
        }
      } else {
        // While within Journey interaction area, prevent parent webpage scrolling
        if ((delta > 0 && activeStep < 3) || (delta < 0 && activeStep > 0)) {
          e.preventDefault();
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeStep, isTransitioning, triggerStepTransition]);

  // ── Mobile & Tablet Natural Touch Gestures ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
        touchLastYRef.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchLastYRef.current - currentY;
      touchLastYRef.current = currentY;

      // Rotate wheel in real time with touch movement
      targetAngleRef.current += deltaY * 0.016;

      const totalSwipe = touchStartYRef.current - currentY;
      const swipeThreshold = 45;

      if (isTransitioning) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (totalSwipe >= swipeThreshold) {
        if (activeStep < 3) {
          if (e.cancelable) e.preventDefault();
          touchStartYRef.current = currentY;
          triggerStepTransition(activeStep + 1);
        }
      } else if (totalSwipe <= -swipeThreshold) {
        if (activeStep > 0) {
          if (e.cancelable) e.preventDefault();
          touchStartYRef.current = currentY;
          triggerStepTransition(activeStep - 1);
        }
      } else {
        if ((totalSwipe > 0 && activeStep < 3) || (totalSwipe < 0 && activeStep > 0)) {
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [activeStep, isTransitioning, triggerStepTransition]);

  // ── 3D Canvas Wheel rendering loop with smooth physics interpolation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Responsive physical spring lerp towards target rotation angle
      const diff = targetAngleRef.current - rotationAngleRef.current;
      rotationAngleRef.current += diff * 0.20;

      // Audio detent check during continuous wheel rolling
      const currentAngle = rotationAngleRef.current;
      const detentInterval = (Math.PI * 2) / 22; // 22 detents per revolution
      const currentDetent = Math.floor(currentAngle / detentInterval);
      if (currentDetent !== lastDetentStepRef.current) {
        lastDetentStepRef.current = currentDetent;
        if (Math.abs(diff) > 0.02) {
          audioEngine.playClick(0.7);
        }
      }

      // Canvas setup (Retina 2x resolution)
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const logicalW = 84;
      const logicalH = 138;

      if (canvas.width !== logicalW * dpr || canvas.height !== logicalH * dpr) {
        canvas.width = logicalW * dpr;
        canvas.height = logicalH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, logicalW, logicalH);

      // Dimensions of the 3D mouse scroll wheel
      const wheelW = 44;
      const radius = 54;
      const cx = logicalW / 2;
      const cy = logicalH / 2;
      const x0 = cx - wheelW / 2;
      const x1 = cx + wheelW / 2;
      const rimW = 3.5;

      // ── 1. Recessed Chassis Well Background ──
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x0 - 4, cy - radius - 6, wheelW + 8, radius * 2 + 12, 10);
      ctx.fillStyle = isLight ? "#E3E7EE" : "#0A0B0E";
      ctx.fill();

      // Inner well shadows
      const wellShadow = ctx.createLinearGradient(0, cy - radius - 6, 0, cy + radius + 6);
      wellShadow.addColorStop(0, "rgba(0, 0, 0, 0.45)");
      wellShadow.addColorStop(0.18, "rgba(0, 0, 0, 0.08)");
      wellShadow.addColorStop(0.82, "rgba(0, 0, 0, 0.08)");
      wellShadow.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = wellShadow;
      ctx.fill();
      ctx.restore();

      // Clip wheel to rounded pill boundaries
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x0, cy - radius, wheelW, radius * 2, 8);
      ctx.clip();

      // ── 2. Central Dark Charcoal Rubber Tread Body ──
      const rubberGrad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
      if (isLight) {
        rubberGrad.addColorStop(0, "#101216");
        rubberGrad.addColorStop(0.25, "#30343E");
        rubberGrad.addColorStop(0.5, "#22252C");
        rubberGrad.addColorStop(0.75, "#181A20");
        rubberGrad.addColorStop(1, "#0C0D10");
      } else {
        rubberGrad.addColorStop(0, "#08090C");
        rubberGrad.addColorStop(0.25, "#252830");
        rubberGrad.addColorStop(0.5, "#191B21");
        rubberGrad.addColorStop(0.75, "#121418");
        rubberGrad.addColorStop(1, "#060709");
      }
      ctx.fillStyle = rubberGrad;
      ctx.fillRect(x0 + rimW, cy - radius, wheelW - rimW * 2, radius * 2);

      // ── 3. Fine Horizontal Tactile Ridges (True 3D Cylindrical Perspective) ──
      const numRidges = 22;
      const angle = rotationAngleRef.current;

      for (let i = 0; i < numRidges; i++) {
        let theta = angle + (i * Math.PI * 2) / numRidges;
        theta = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (theta > Math.PI) theta -= Math.PI * 2;

        // Only draw visible front hemisphere (-PI/2 to PI/2)
        if (theta > -Math.PI / 2 + 0.05 && theta < Math.PI / 2 - 0.05) {
          const k = Math.cos(theta); // perspective foreshortening
          const ry = cy + radius * Math.sin(theta);
          const ridgeH = Math.max(1.1, 2.8 * k);

          // Subtle cylindrical curvature arc across the horizontal ridge
          const curveDepth = -2.2 * Math.sin(theta);

          ctx.beginPath();
          ctx.moveTo(x0 + rimW + 0.5, ry);
          ctx.quadraticCurveTo(cx, ry + curveDepth, x1 - rimW - 0.5, ry);
          ctx.lineWidth = ridgeH;

          // Upper highlight edge of ridge
          const highlightAlpha = Math.max(0, 0.42 * k);
          ctx.strokeStyle = `rgba(255, 255, 255, ${highlightAlpha.toFixed(3)})`;
          ctx.stroke();

          // Lower shadow edge of ridge
          ctx.beginPath();
          ctx.moveTo(x0 + rimW + 0.5, ry + ridgeH * 0.7);
          ctx.quadraticCurveTo(cx, ry + curveDepth + ridgeH * 0.7, x1 - rimW - 0.5, ry + ridgeH * 0.7);
          ctx.lineWidth = Math.max(0.8, ridgeH * 0.75);
          const shadowAlpha = Math.max(0, 0.65 * k);
          ctx.strokeStyle = `rgba(0, 0, 0, ${shadowAlpha.toFixed(3)})`;
          ctx.stroke();
        }
      }

      // ── 4. Brushed Metal Lateral Collars (Left & Right Rims) ──
      const drawMetallicCollar = (colX: number) => {
        const metalGrad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
        metalGrad.addColorStop(0, "#2B2E36");
        metalGrad.addColorStop(0.2, "#8F96A3");
        metalGrad.addColorStop(0.4, "#B8BFCB");
        metalGrad.addColorStop(0.55, "#606673");
        metalGrad.addColorStop(0.8, "#323640");
        metalGrad.addColorStop(1, "#17191E");
        ctx.fillStyle = metalGrad;
        ctx.fillRect(colX, cy - radius, rimW, radius * 2);

        // Microscopic chamfer highlight line
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(colX + (colX === x0 ? rimW - 0.7 : 0), cy - radius, 0.7, radius * 2);
      };

      drawMetallicCollar(x0);
      drawMetallicCollar(x1 - rimW);

      // ── 5. Subtle Specular Sheen & Minimal Violet Reflection Accent ──
      // Top tangent lighting sheen
      const sheenGrad = ctx.createLinearGradient(0, cy - radius * 0.6, 0, cy + radius * 0.1);
      sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.28)");
      sheenGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.08)");
      sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(x0, cy - radius, wheelW, radius * 1.2);

      // Minimal, restrained violet accent reflection kiss on the upper-right bevel
      const violetReflect = ctx.createRadialGradient(
        x1 - 6,
        cy - radius * 0.35,
        1,
        x1 - 6,
        cy - radius * 0.35,
        18
      );
      violetReflect.addColorStop(0, "rgba(168, 85, 247, 0.16)");
      violetReflect.addColorStop(0.6, "rgba(147, 51, 234, 0.06)");
      violetReflect.addColorStop(1, "rgba(147, 51, 234, 0)");
      ctx.fillStyle = violetReflect;
      ctx.fillRect(x0, cy - radius, wheelW, radius * 2);

      // ── 6. Top & Bottom Vignette Shadow Masks (Wheel entering mouse slot) ──
      const slotTop = ctx.createLinearGradient(0, cy - radius, 0, cy - radius + 22);
      slotTop.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      slotTop.addColorStop(0.6, "rgba(0, 0, 0, 0.35)");
      slotTop.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = slotTop;
      ctx.fillRect(x0, cy - radius, wheelW, 22);

      const slotBottom = ctx.createLinearGradient(0, cy + radius - 22, 0, cy + radius);
      slotBottom.addColorStop(0, "rgba(0, 0, 0, 0)");
      slotBottom.addColorStop(0.4, "rgba(0, 0, 0, 0.35)");
      slotBottom.addColorStop(1, "rgba(0, 0, 0, 0.85)");
      ctx.fillStyle = slotBottom;
      ctx.fillRect(x0, cy + radius - 22, wheelW, 22);

      ctx.restore();

      // Outer bezel perimeter hairline
      ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x0, cy - radius, wheelW, radius * 2, 8);
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isLight]);

  const current = MILESTONES[activeStep];
  const progressPercent = ((activeStep + 1) / 4) * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      data-testid="journey-scroll-timeline-container"
    >
      <div
        className={cn(
          "rounded-3xl p-6 sm:p-8 lg:p-10 border transition-colors duration-300 shadow-xl",
          isLight
            ? "bg-white/95 border-slate-200/90 shadow-slate-200/60"
            : "bg-[#0E1017]/90 border-white/10 shadow-black/60",
          "backdrop-blur-2xl"
        )}
      >
        {/* Card Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/70 dark:border-white/10">
          <div>
            <span
              className={cn(
                "text-[11px] sm:text-xs font-semibold tracking-widest uppercase block font-mono mb-1 select-none",
                isLight ? "text-purple-700" : "text-purple-400"
              )}
            >
              ✦ SocialAssist Timeline ✦
            </span>
            <h3
              className={cn(
                "text-xl sm:text-2xl font-black tracking-tight select-none",
                isLight ? "text-slate-950" : "text-white"
              )}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              The Journey
            </h3>
          </div>

          {/* Step Counter Badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full border select-none transition-colors",
                isLight
                  ? "bg-purple-50 text-purple-900 border-purple-200"
                  : "bg-purple-950/40 text-purple-300 border-purple-800/40"
              )}
            >
              {current.number} <span className="opacity-40">/</span> 04
            </span>
          </div>
        </div>

        {/* Main Stage: Physical 3D Wheel + Layered Cinematic Milestone Transition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* ── Left Column: Physical 3D Mouse Scroll Wheel ── */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div
              className={cn(
                "relative rounded-2xl p-4 flex flex-col items-center justify-center border transition-all select-none",
                isLight
                  ? "bg-slate-50/80 border-slate-200/80 shadow-inner"
                  : "bg-[#07080B] border-white/10 shadow-inner"
              )}
            >
              {/* 3D Wheel Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  style={{ width: 84, height: 138 }}
                  className="block select-none"
                  aria-hidden="true"
                />

                {/* Micro Audio Mute Button Overlay */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  title={isMuted ? "Unmute mechanical wheel click" : "Mute wheel click"}
                  className={cn(
                    "absolute -top-1 -right-1 p-1.5 rounded-full border transition-colors text-xs",
                    isLight
                      ? "bg-white text-slate-600 hover:text-purple-700 border-slate-200 shadow-xs"
                      : "bg-[#14161F] text-zinc-400 hover:text-purple-300 border-white/15 shadow-xs"
                  )}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                </button>
              </div>

              {/* Intelligent Device Scroll Hint */}
              <div className="mt-3 text-center select-none">
                <p
                  className={cn(
                    "text-[10.5px] font-mono uppercase tracking-wider font-semibold",
                    isLight ? "text-slate-500" : "text-zinc-500"
                  )}
                >
                  {isTouchDevice ? "Swipe to Explore" : "Scroll to Advance"}
                </p>
                <p
                  className={cn(
                    "text-[9.5px] mt-0.5",
                    isLight ? "text-slate-400" : "text-zinc-600"
                  )}
                >
                  Auto-synchronized
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Column: Dynamic Milestone Content with Cinematic Layered Transition ── */}
          <div className="md:col-span-8 relative min-h-[290px] flex flex-col justify-center overflow-hidden">
            {/* Exiting Milestone Layer during transition */}
            {isTransitioning && exitingStep !== null && (
              <div
                key={`exit-${exitingStep}`}
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none flex flex-col justify-center"
                style={{
                  animation: `${
                    direction === "forward" ? "milestone-exit-forward" : "milestone-exit-backward"
                  } 0.44s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  willChange: "transform, opacity, filter",
                }}
              >
                <MilestoneCardContent
                  item={MILESTONES[exitingStep]}
                  isLight={isLight}
                  isEntering={false}
                />
              </div>
            )}

            {/* Active / Entering Milestone Layer */}
            <div
              key={`enter-${activeStep}`}
              className="relative w-full flex flex-col justify-center"
              style={{
                animation: isTransitioning
                  ? `${
                      direction === "forward" ? "milestone-enter-forward" : "milestone-enter-backward"
                    } 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                  : "none",
                willChange: "transform, opacity, filter",
              }}
            >
              <MilestoneCardContent
                item={MILESTONES[activeStep]}
                isLight={isLight}
                isEntering={isTransitioning}
              />
            </div>
          </div>
        </div>

        {/* ── Footer Controls: 4 Milestone Step Pills & Smooth Progress Bar ── */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/10">
          {/* Continuous Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 rounded-full transition-all duration-400 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 4 Interactive Milestone Step Pills & Arrows */}
          <div className="flex items-center justify-between gap-2">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => triggerStepTransition(activeStep - 1)}
              disabled={activeStep === 0}
              aria-label="Previous Milestone"
              className={cn(
                "p-2 rounded-xl border transition-all disabled:opacity-30 disabled:pointer-events-none",
                isLight
                  ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
                  : "bg-white/[0.04] hover:bg-white/10 text-white border-white/10"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 4 Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 flex-1">
              {MILESTONES.map((m, idx) => {
                const isActive = idx === activeStep;
                return (
                  <button
                    key={m.number}
                    type="button"
                    onClick={() => triggerStepTransition(idx)}
                    className={cn(
                      "px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 border select-none",
                      isActive
                        ? isLight
                          ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                          : "bg-purple-600 text-white border-purple-500 shadow-sm"
                        : isLight
                        ? "bg-slate-100/80 text-slate-600 hover:text-slate-900 border-slate-200"
                        : "bg-white/[0.04] text-zinc-400 hover:text-white border-white/10"
                    )}
                  >
                    <span>{m.number}</span>
                    <span className="hidden sm:inline font-sans">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => triggerStepTransition(activeStep + 1)}
              disabled={activeStep === 3}
              aria-label="Next Milestone"
              className={cn(
                "p-2 rounded-xl border transition-all disabled:opacity-30 disabled:pointer-events-none",
                isLight
                  ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
                  : "bg-white/[0.04] hover:bg-white/10 text-white border-white/10"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
