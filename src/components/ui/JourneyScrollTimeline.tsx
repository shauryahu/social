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
    // Calibrated minimum interval between clicks to avoid sound stacking
    if (now - this.lastPlayTime < 65) return;
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

      // Precision mechanical detent click: 1.85kHz bandpass with ultra-fast decay
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1920, t);
      filter.Q.setValueAtTime(3.6, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, t);
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.011);

      const vol = Math.min(0.055, 0.038 * strength);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.014);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.015);
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
}

function MilestoneCardContent({ item, isLight }: MilestoneCardContentProps) {
  return (
    <div className="flex flex-col justify-center select-none">
      {/* Year & Milestone Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight",
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
            "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono border",
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
          "text-xs sm:text-sm leading-relaxed mb-4 max-w-xl",
          isLight ? "text-slate-600 font-medium" : "text-zinc-400"
        )}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {item.desc}
      </p>

      {/* 3 Pillars Chips */}
      <div className="flex flex-wrap gap-2">
        {item.pillars.map((pillar) => (
          <span
            key={pillar}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11.5px] font-semibold border transition-colors",
              isLight
                ? "bg-slate-100/90 text-slate-800 border-slate-200"
                : "bg-white/[0.04] text-zinc-300 border-white/10"
            )}
          >
            <Check
              className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0"
              strokeWidth={2.5}
            />
            <span>{pillar}</span>
          </span>
        ))}
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

  // Milestone transition & animation state
  const [activeStep, setActiveStep] = useState(0);
  const [secondaryStep, setSecondaryStep] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Content layers & progress bar direct DOM refs
  const primaryLayerRef = useRef<HTMLDivElement>(null);
  const secondaryLayerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepBadgeRef = useRef<HTMLSpanElement>(null);

  // Continuous Physics State (Refs for 60+ FPS zero-overhead animation)
  const currentStepRef = useRef(0);
  const offsetRef = useRef(0); // continuous float in [-1.0, 1.0]
  const targetOffsetRef = useRef(0); // where spring is heading
  const velocityRef = useRef(0); // velocity of displacement
  const secondaryStepRef = useRef(1);

  // Wheel rotation angle state
  const rotationAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const lastDetentIndexRef = useRef(0);

  // Wheel delta & settle timer
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch gesture tracking
  const touchStartYRef = useRef(0);
  const touchLastYRef = useRef(0);
  const touchActiveRef = useRef(false);

  // Toggle mechanical sound
  const handleToggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  // Update secondary milestone layer helper
  const updateSecondaryStep = useCallback((incoming: number) => {
    const clamped = Math.max(0, Math.min(3, incoming));
    if (clamped !== secondaryStepRef.current) {
      secondaryStepRef.current = clamped;
      setSecondaryStep(clamped);
    }
  }, []);

  // ── Unified Delta Accumulation & Spring Trigger ──
  const handleScrollDelta = useCallback(
    (deltaY: number, source: "wheel" | "trackpad" | "touch") => {
      const current = currentStepRef.current;

      // Input normalization based on device physics
      let norm = 0;
      if (source === "wheel") {
        norm = deltaY * 0.0035;
      } else if (source === "trackpad") {
        norm = deltaY * 0.0022;
      } else {
        norm = deltaY * 0.0042;
      }

      // 1. Direct, instant wheel rotation
      targetAngleRef.current += norm * 3.2;

      // 2. Accumulate interactive displacement
      let nextTarget = targetOffsetRef.current + norm;

      // Boundary resistance & exit unblocking
      if (current === 0 && nextTarget < 0) {
        // At start: elastic resistance or pass-through
        nextTarget = Math.max(-0.25, nextTarget * 0.35);
      } else if (current === 3 && nextTarget > 0) {
        // At end: elastic resistance or pass-through
        nextTarget = Math.min(0.25, nextTarget * 0.35);
      } else {
        nextTarget = Math.max(-1.0, Math.min(1.0, nextTarget));
      }

      targetOffsetRef.current = nextTarget;

      // Set target incoming step for the secondary layer
      if (nextTarget > 0.01 && current < 3) {
        updateSecondaryStep(current + 1);
      } else if (nextTarget < -0.01 && current > 0) {
        updateSecondaryStep(current - 1);
      }

      // Reset settle debounce timer
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }

      // Decision timer: Commit transition or Elastic Bounce-back
      settleTimerRef.current = setTimeout(() => {
        const off = offsetRef.current;
        const vel = velocityRef.current;

        // Velocity-aware threshold for committing vs bouncing back
        if (off >= 0.36 || (off >= 0.16 && vel > 0.003)) {
          if (current < 3) {
            targetOffsetRef.current = 1.0;
            audioEngine.playClick(1.0);
          } else {
            targetOffsetRef.current = 0.0;
          }
        } else if (off <= -0.36 || (off <= -0.16 && vel < -0.003)) {
          if (current > 0) {
            targetOffsetRef.current = -1.0;
            audioEngine.playClick(1.0);
          } else {
            targetOffsetRef.current = 0.0;
          }
        } else {
          // Elastic bounce-back to original position!
          targetOffsetRef.current = 0.0;
        }
      }, 130);
    },
    [updateSecondaryStep]
  );

  // ── Manual Step Button / Pill Click ──
  const jumpToStep = useCallback(
    (targetStep: number) => {
      const current = currentStepRef.current;
      if (targetStep === current) return;
      const clamped = Math.max(0, Math.min(3, targetStep));
      if (clamped === current) return;

      updateSecondaryStep(clamped);
      const isForward = clamped > current;
      targetOffsetRef.current = isForward ? 1.0 : -1.0;
      targetAngleRef.current += (isForward ? 1.85 : -1.85);
      audioEngine.playClick(1.0);
    },
    [updateSecondaryStep]
  );

  // ── Mouse Wheel & Trackpad Listener on Container ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      const current = currentStepRef.current;
      const currentOffset = offsetRef.current;

      // 1. Natural exit at boundaries:
      // At Milestone 01, if scrolling upward (delta < 0), let page scroll up naturally
      if (current === 0 && delta < 0 && Math.abs(currentOffset) < 0.05) {
        return;
      }
      // At Milestone 04, if scrolling downward (delta > 0), let page scroll down naturally
      if (current === 3 && delta > 0 && Math.abs(currentOffset) < 0.05) {
        return;
      }

      // 2. Isolate page scroll within the Journey timeline interaction
      e.preventDefault();

      // Distinguish trackpad (continuous small deltas) vs mouse wheel (larger discrete clicks)
      const isTrackpad = Math.abs(delta) < 40 && e.deltaMode === 0;
      handleScrollDelta(delta, isTrackpad ? "trackpad" : "wheel");
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [handleScrollDelta]);

  // ── Touch Gestures for Mobile & Tablets ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
        touchLastYRef.current = e.touches[0].clientY;
        touchActiveRef.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchActiveRef.current || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchLastYRef.current - currentY;
      touchLastYRef.current = currentY;

      const current = currentStepRef.current;
      const currentOffset = offsetRef.current;

      // Boundary natural exit for touch gestures
      if (current === 0 && deltaY < 0 && Math.abs(currentOffset) < 0.05) {
        return;
      }
      if (current === 3 && deltaY > 0 && Math.abs(currentOffset) < 0.05) {
        return;
      }

      if (e.cancelable) e.preventDefault();
      handleScrollDelta(deltaY, "touch");
    };

    const onTouchEnd = () => {
      touchActiveRef.current = false;
      const off = offsetRef.current;
      const vel = velocityRef.current;
      const current = currentStepRef.current;

      if (off >= 0.32 || (off >= 0.14 && vel > 0.003)) {
        if (current < 3) {
          targetOffsetRef.current = 1.0;
          audioEngine.playClick(1.0);
        } else {
          targetOffsetRef.current = 0.0;
        }
      } else if (off <= -0.32 || (off <= -0.14 && vel < -0.003)) {
        if (current > 0) {
          targetOffsetRef.current = -1.0;
          audioEngine.playClick(1.0);
        } else {
          targetOffsetRef.current = 0.0;
        }
      } else {
        targetOffsetRef.current = 0.0;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleScrollDelta]);

  // ── Unified 60 FPS RAF Loop: Spring Physics, Layers & Embedded 3D Wheel ──
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const render = (time: number) => {
      const dt = Math.min(0.032, (time - lastTime) / 1000);
      lastTime = time;

      // ── 1. Critically Damped Spring Physics for Milestone Content ──
      const diff = targetOffsetRef.current - offsetRef.current;
      const omega = 13.5; // Natural frequency for crisp Apple-like settling
      const acc = diff * omega * omega - 2 * omega * velocityRef.current;
      velocityRef.current += acc * dt;
      offsetRef.current += velocityRef.current * dt;

      // Check for committed transition completion
      if (Math.abs(targetOffsetRef.current - offsetRef.current) < 0.005 && Math.abs(velocityRef.current) < 0.005) {
        if (targetOffsetRef.current === 1.0) {
          const next = secondaryStepRef.current;
          currentStepRef.current = next;
          offsetRef.current = 0;
          targetOffsetRef.current = 0;
          velocityRef.current = 0;
          setActiveStep(next);
        } else if (targetOffsetRef.current === -1.0) {
          const prev = secondaryStepRef.current;
          currentStepRef.current = prev;
          offsetRef.current = 0;
          targetOffsetRef.current = 0;
          velocityRef.current = 0;
          setActiveStep(prev);
        } else if (targetOffsetRef.current === 0.0) {
          offsetRef.current = 0;
          velocityRef.current = 0;
        }
      }

      // ── 2. Direct DOM Transforms on Content Layers (Zero-overhead 60 FPS) ──
      const d = offsetRef.current;
      const absD = Math.abs(d);
      const sign = d >= 0 ? 1 : -1;

      const primary = primaryLayerRef.current;
      const secondary = secondaryLayerRef.current;
      const progressLine = progressLineRef.current;
      const stepBadge = stepBadgeRef.current;

      if (primary) {
        // Outgoing primary layer: moves up/down, fades, blurs to 8px, scales to 0.95
        const outY = -sign * absD * 65;
        const outScale = 1.0 - absD * 0.05;
        const outOpacity = Math.max(0, 1.0 - absD * 1.15);
        const outBlur = absD * 8.0;

        primary.style.transform = `translate3d(0, ${outY.toFixed(2)}px, 0) scale(${outScale.toFixed(3)})`;
        primary.style.opacity = outOpacity.toFixed(3);
        primary.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(2)}px)` : "none";
      }

      if (secondary) {
        if (absD > 0.001) {
          secondary.style.visibility = "visible";
          // Incoming secondary layer: emerges from opposite direction, sharpens from 8px to 0, scales from 0.94 to 1
          const inY = sign * (1.0 - absD) * 65;
          const inScale = 0.94 + absD * 0.06;
          const inOpacity = Math.min(1.0, absD * 1.15);
          const inBlur = (1.0 - absD) * 8.0;

          secondary.style.transform = `translate3d(0, ${inY.toFixed(2)}px, 0) scale(${inScale.toFixed(3)})`;
          secondary.style.opacity = inOpacity.toFixed(3);
          secondary.style.filter = inBlur > 0.1 ? `blur(${inBlur.toFixed(2)}px)` : "none";
        } else {
          secondary.style.visibility = "hidden";
        }
      }

      // Continuous progress line synchronization
      if (progressLine) {
        const floatProgress = Math.max(0, Math.min(3, currentStepRef.current + d));
        const pct = ((floatProgress + 1) / 4) * 100;
        progressLine.style.width = `${pct.toFixed(2)}%`;
      }

      // Step badge text update
      if (stepBadge) {
        const activeNum = (d > 0.5 ? Math.min(3, currentStepRef.current + 1) : d < -0.5 ? Math.max(0, currentStepRef.current - 1) : currentStepRef.current) + 1;
        stepBadge.innerText = activeNum < 10 ? `0${activeNum}` : `${activeNum}`;
      }

      // ── 3. High-Quality Physical 3D Mouse Scroll Wheel Rendering ──
      const wheelDiff = targetAngleRef.current - rotationAngleRef.current;
      rotationAngleRef.current += wheelDiff * 0.22;

      // Audio click check for physical ridges passing the contact detent
      const currentAngle = rotationAngleRef.current;
      const numTeeth = 24;
      const toothInterval = (Math.PI * 2) / numTeeth;
      const currentToothIndex = Math.floor(currentAngle / toothInterval);
      if (currentToothIndex !== lastDetentIndexRef.current) {
        lastDetentIndexRef.current = currentToothIndex;
        if (Math.abs(wheelDiff) > 0.015) {
          audioEngine.playClick(0.75);
        }
      }

      if (ctx && canvas) {
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const logicalW = 64;
        const logicalH = 168;

        if (canvas.width !== logicalW * dpr || canvas.height !== logicalH * dpr) {
          canvas.width = logicalW * dpr;
          canvas.height = logicalH * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, logicalW, logicalH);

        const wheelW = 46;
        const radius = 64; // cylinder outer radius
        const cx = logicalW / 2;
        const cy = logicalH / 2;
        const x0 = cx - wheelW / 2;
        const x1 = cx + wheelW / 2;
        const rimW = 4.5; // lateral brushed-metal collar width

        // ── A. Deep Chassis Cavity Background & Ambient Occlusion ──
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x0 - 4, cy - radius - 8, wheelW + 8, radius * 2 + 16, 12);
        ctx.fillStyle = isLight ? "#111317" : "#050608";
        ctx.fill();

        // Deep cavity inner shadow
        const cavityShadow = ctx.createLinearGradient(0, cy - radius - 8, 0, cy + radius + 8);
        cavityShadow.addColorStop(0, "rgba(0, 0, 0, 0.95)");
        cavityShadow.addColorStop(0.22, "rgba(0, 0, 0, 0.35)");
        cavityShadow.addColorStop(0.78, "rgba(0, 0, 0, 0.35)");
        cavityShadow.addColorStop(1, "rgba(0, 0, 0, 0.95)");
        ctx.fillStyle = cavityShadow;
        ctx.fill();
        ctx.restore();

        // Clip drawing to rounded pill boundaries of the wheel
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x0, cy - radius, wheelW, radius * 2, 8);
        ctx.clip();

        // ── B. Central Graphite-Black Rubber Tread Surface ──
        const rubberGrad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
        if (isLight) {
          rubberGrad.addColorStop(0, "#0B0C0F");
          rubberGrad.addColorStop(0.18, "#252932");
          rubberGrad.addColorStop(0.36, "#383E4C"); // diffuse crest highlight
          rubberGrad.addColorStop(0.52, "#232630");
          rubberGrad.addColorStop(0.75, "#15171E");
          rubberGrad.addColorStop(1, "#08090C");
        } else {
          rubberGrad.addColorStop(0, "#050607");
          rubberGrad.addColorStop(0.18, "#1C2028");
          rubberGrad.addColorStop(0.36, "#2A2F3B");
          rubberGrad.addColorStop(0.52, "#181B22");
          rubberGrad.addColorStop(0.75, "#0E1015");
          rubberGrad.addColorStop(1, "#030405");
        }
        ctx.fillStyle = rubberGrad;
        ctx.fillRect(x0 + rimW, cy - radius, wheelW - rimW * 2, radius * 2);

        // ── C. High-Precision Horizontal Tactile Ridges (3D Cylindrical Perspective) ──
        const angle = rotationAngleRef.current;

        for (let i = 0; i < numTeeth; i++) {
          let theta = angle + (i * Math.PI * 2) / numTeeth;
          theta = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (theta > Math.PI) theta -= Math.PI * 2;

          // Only draw visible front hemisphere (-PI/2 to PI/2)
          if (theta > -Math.PI / 2 + 0.05 && theta < Math.PI / 2 - 0.05) {
            const k = Math.cos(theta); // foreshortening
            const ry = cy + radius * Math.sin(theta);
            const ridgeH = Math.max(1.3, 3.4 * k);

            // True cylindrical perspective curvature across horizontal span
            const arcCurve = -3.2 * Math.sin(theta);

            // 1. Deep Recessed Shadow Trough (Groove Below Ridge)
            ctx.beginPath();
            ctx.moveTo(x0 + rimW, ry + ridgeH * 0.55);
            ctx.quadraticCurveTo(cx, ry + ridgeH * 0.55 + arcCurve, x1 - rimW, ry + ridgeH * 0.55);
            ctx.lineWidth = Math.max(1.0, 2.2 * k);
            const sAlpha = Math.min(0.95, 0.65 * k + 0.32);
            ctx.strokeStyle = `rgba(0, 0, 0, ${sAlpha.toFixed(3)})`;
            ctx.stroke();

            // 2. Ridge Solid Body
            ctx.beginPath();
            ctx.moveTo(x0 + rimW, ry);
            ctx.quadraticCurveTo(cx, ry + arcCurve, x1 - rimW, ry);
            ctx.lineWidth = ridgeH;
            ctx.strokeStyle = isLight ? "rgba(48, 54, 66, 0.98)" : "rgba(34, 38, 48, 0.98)";
            ctx.stroke();

            // 3. Ridge Highlight Crest (Illuminated Upper Edge)
            ctx.beginPath();
            ctx.moveTo(x0 + rimW, ry - ridgeH * 0.32);
            ctx.quadraticCurveTo(cx, ry - ridgeH * 0.32 + arcCurve, x1 - rimW, ry - ridgeH * 0.32);
            ctx.lineWidth = Math.max(0.95, 1.5 * k);
            const keyFactor = Math.max(0, Math.cos(theta - 0.35));
            const hAlpha = Math.min(0.85, Math.max(0, k * (0.42 + 0.48 * keyFactor)));
            ctx.strokeStyle = `rgba(255, 255, 255, ${hAlpha.toFixed(3)})`;
            ctx.stroke();
          }
        }

        // ── D. CNC Brushed-Metal Lateral Side Rails (Left & Right Collars) ──
        const drawMetalCollar = (colX: number, isLeft: boolean) => {
          const metalGrad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
          metalGrad.addColorStop(0, "#1A1D24");
          metalGrad.addColorStop(0.12, "#444B59");
          metalGrad.addColorStop(0.24, "#8F99AB");
          metalGrad.addColorStop(0.36, "#DCE3EE"); // specular key highlight
          metalGrad.addColorStop(0.48, "#F1F5F9");
          metalGrad.addColorStop(0.60, "#97A3B7");
          metalGrad.addColorStop(0.76, "#424A58");
          metalGrad.addColorStop(0.90, "#1F232B");
          metalGrad.addColorStop(1, "#0F1116");

          ctx.fillStyle = metalGrad;
          ctx.fillRect(colX, cy - radius, rimW, radius * 2);

          // Diamond-cut micro-chamfer bevel highlight line
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          const chamferX = isLeft ? colX + rimW - 0.9 : colX;
          ctx.fillRect(chamferX, cy - radius, 0.9, radius * 2);

          // Separation dark groove between collar and rubber
          ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
          const grooveX = isLeft ? colX + rimW : colX - 0.9;
          ctx.fillRect(grooveX, cy - radius, 0.9, radius * 2);
        };

        drawMetalCollar(x0, true);
        drawMetalCollar(x1 - rimW, false);

        // ── E. Studio Key-Light Specular Sheen ──
        const studioSheen = ctx.createLinearGradient(x0, 0, x1, 0);
        studioSheen.addColorStop(0, "rgba(255, 255, 255, 0)");
        studioSheen.addColorStop(0.24, "rgba(255, 255, 255, 0.18)");
        studioSheen.addColorStop(0.45, "rgba(255, 255, 255, 0.05)");
        studioSheen.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = studioSheen;
        ctx.fillRect(x0, cy - radius, wheelW, radius * 2);

        // Ultra-subtle, elegant violet kiss along the upper-right bevel
        const violetAccent = ctx.createRadialGradient(
          x1 - 4,
          cy - radius * 0.35,
          1,
          x1 - 4,
          cy - radius * 0.35,
          18
        );
        violetAccent.addColorStop(0, "rgba(168, 85, 247, 0.14)");
        violetAccent.addColorStop(0.6, "rgba(147, 51, 234, 0.05)");
        violetAccent.addColorStop(1, "rgba(147, 51, 234, 0)");
        ctx.fillStyle = violetAccent;
        ctx.fillRect(x0, cy - radius, wheelW, radius * 2);

        // ── F. Top & Bottom Ambient Occlusion Vignettes (Receding into cavity) ──
        const topCavityMask = ctx.createLinearGradient(0, cy - radius, 0, cy - radius + 28);
        topCavityMask.addColorStop(0, "rgba(0, 0, 0, 0.96)");
        topCavityMask.addColorStop(0.55, "rgba(0, 0, 0, 0.45)");
        topCavityMask.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = topCavityMask;
        ctx.fillRect(x0, cy - radius, wheelW, 28);

        const bottomCavityMask = ctx.createLinearGradient(0, cy + radius - 28, 0, cy + radius);
        bottomCavityMask.addColorStop(0, "rgba(0, 0, 0, 0)");
        bottomCavityMask.addColorStop(0.45, "rgba(0, 0, 0, 0.45)");
        bottomCavityMask.addColorStop(1, "rgba(0, 0, 0, 0.96)");
        ctx.fillStyle = bottomCavityMask;
        ctx.fillRect(x0, cy + radius - 28, wheelW, 28);

        ctx.restore(); // restore clipping

        // Outer hairline perimeter stroke
        ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x0, cy - radius, wheelW, radius * 2, 8);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isLight]);

  const current = MILESTONES[activeStep];
  const secondary = MILESTONES[secondaryStep];
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

          {/* Step Counter Badge & Audio Mute Control */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full border select-none transition-colors",
                isLight
                  ? "bg-purple-50 text-purple-900 border-purple-200"
                  : "bg-purple-950/40 text-purple-300 border-purple-800/40"
              )}
            >
              <span ref={stepBadgeRef}>{current.number}</span> <span className="opacity-40">/</span> 04
            </span>

            <button
              type="button"
              onClick={handleToggleSound}
              title={isMuted ? "Unmute mechanical wheel click" : "Mute wheel click"}
              className={cn(
                "p-1.5 rounded-full border transition-colors text-xs",
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
        </div>

        {/* ── Main Interactive Stage: Milestone Content on Left + Embedded 3D Wheel on Right ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Milestone Dynamic Content Viewport (Left Column) */}
          <div className="md:col-span-9 relative min-h-[290px] flex flex-col justify-center overflow-hidden">
            {/* Primary / Active Milestone Layer */}
            <div
              ref={primaryLayerRef}
              className="relative w-full flex flex-col justify-center will-change-transform"
            >
              <MilestoneCardContent item={current} isLight={isLight} />
            </div>

            {/* Secondary / Incoming Milestone Layer (Activated during scroll / spring) */}
            <div
              ref={secondaryLayerRef}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none flex flex-col justify-center will-change-transform"
              style={{ visibility: "hidden" }}
            >
              <MilestoneCardContent item={secondary} isLight={isLight} />
            </div>
          </div>

          {/* Embedded Physical 3D Mouse Scroll Wheel (Right Column - Directly Integrated in Container Surface) */}
          <div className="md:col-span-3 flex flex-col items-center justify-center">
            {/* Precision Recessed Mounting Slot directly in container surface */}
            <div
              className={cn(
                "relative rounded-full p-[6px] flex flex-col items-center justify-center transition-all select-none",
                isLight
                  ? "bg-gradient-to-b from-[#C8CCD4] via-[#DDE1E8] to-[#CBD0D8] shadow-[inset_0_3px_12px_rgba(0,0,0,0.32),inset_0_1px_2px_rgba(0,0,0,0.40),0_1px_0_rgba(255,255,255,0.95)] border border-slate-300/80"
                  : "bg-gradient-to-b from-[#181A22] via-[#0E1017] to-[#141620] shadow-[inset_0_3px_14px_rgba(0,0,0,0.90),inset_0_1px_3px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.06)] border border-white/5"
              )}
            >
              {/* Studio-photographed 3D mouse scroll wheel canvas */}
              <canvas
                ref={canvasRef}
                style={{ width: 64, height: 168 }}
                className="block select-none cursor-ns-resize"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* ── Footer Controls: Continuous Progress Bar + 4 Step Pills ── */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/10">
          {/* Continuous Progress Bar with Spring Smoothing */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-4">
            <div
              ref={progressLineRef}
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 rounded-full"
              style={{ width: `${progressPercent}%`, willChange: "width" }}
            />
          </div>

          {/* 4 Interactive Milestone Step Pills & Direction Arrows */}
          <div className="flex items-center justify-between gap-2">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => jumpToStep(activeStep - 1)}
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
                    onClick={() => jumpToStep(idx)}
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
              onClick={() => jumpToStep(activeStep + 1)}
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
