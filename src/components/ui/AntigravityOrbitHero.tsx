"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";

// ============================================================================
// CONFIGURATION & ORBITS (7 UNIQUE PLATFORMS, ZERO DUPLICATES)
// ============================================================================

interface PlatformDef {
  id: string;
  name: string;
  src: string;
  orbitIndex: 0 | 1 | 2; // 0 = inner, 1 = middle, 2 = outer
  angleOffset: number;   // initial angle in degrees
}

// Exactly 7 platforms distributed evenly across 3 carefully calculated orbits
const PLATFORMS: PlatformDef[] = [
  // Orbit 0 (Inner): 2 icons at 180° opposition
  { id: "instagram", name: "Instagram", src: "/assets/logos/instagram.png", orbitIndex: 0, angleOffset: 0 },
  { id: "tiktok", name: "TikTok", src: "/assets/logos/tiktok.png", orbitIndex: 0, angleOffset: 180 },

  // Orbit 1 (Middle): 2 icons at 180° opposition (offset 90° from inner)
  { id: "whatsapp", name: "WhatsApp", src: "/assets/logos/whatsapp.png", orbitIndex: 1, angleOffset: 70 },
  { id: "youtube", name: "YouTube", src: "/assets/logos/youtube.png", orbitIndex: 1, angleOffset: 250 },

  // Orbit 2 (Outer): 3 icons at 120° equilateral intervals
  { id: "x", name: "X", src: "/assets/logos/x.png", orbitIndex: 2, angleOffset: 20 },
  { id: "facebook", name: "Facebook", src: "/assets/logos/facebook.png", orbitIndex: 2, angleOffset: 140 },
  { id: "onlyfans", name: "OnlyFans", src: "/assets/logos/onlyfans.png", orbitIndex: 2, angleOffset: 260 },
];

interface OrbitConfig {
  duration: number; // in seconds (slow, majestic motion)
  isClockwise: boolean;
}

const ORBIT_CONFIGS: OrbitConfig[] = [
  // Orbit 0 (Inner): 40s period
  { duration: 40, isClockwise: true },
  // Orbit 1 (Middle): 48s period (counter-clockwise)
  { duration: 48, isClockwise: false },
  // Orbit 2 (Outer): 56s period (clockwise)
  { duration: 56, isClockwise: true },
];

// ============================================================================
// FIBONACCI POINT LATTICE GENERATOR (STRUCTURED, ORDERED 3D CORE)
// ============================================================================

type ParticleColorCategory = "black" | "navy" | "blue" | "cyan";

interface StructuredParticle {
  x0: number; // Base coordinates on unit ellipsoid
  y0: number;
  z0: number;
  rScale: number; // Radial shell layer (0.75 to 1.15)
  baseRadius: number;
  colorCategory: ParticleColorCategory;
  phase: number;
}

function generateStructuredField(count: number): StructuredParticle[] {
  const particles: StructuredParticle[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle (~2.39996 rad)

  for (let i = 0; i < count; i++) {
    // 1. Fibonacci spherical distribution (uniform, non-chaotic spacing)
    const yNorm = 1 - (i / (count - 1)) * 2; // Linear from +1 to -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    const theta = phi * i;

    // Unit sphere coordinates
    const ux = Math.cos(theta) * radiusAtY;
    const uy = yNorm;
    const uz = Math.sin(theta) * radiusAtY;

    // 2. Controlled concentric shell layering for natural depth
    // 70% on primary outer shell, 20% on inner core, 10% on halo dust
    let shell = 1.0;
    if (i % 5 === 0) {
      shell = 0.78 + (i % 3) * 0.05; // Inner core
    } else if (i % 11 === 0) {
      shell = 1.12 + (i % 2) * 0.05; // Faint outer halo
    } else {
      shell = 0.94 + ((i * 7) % 13) * 0.01; // Primary shell
    }

    // Ellipsoidal scaling (slightly wider horizontally, perfectly symmetrical)
    const x0 = ux * 1.16 * shell;
    const y0 = uy * 1.00 * shell;
    const z0 = uz * 0.92 * shell;

    // 3. Strict, controlled color hierarchy:
    // Dominant Black/Graphite (~72%), Deep Navy (~16%), Electric Blue (~9%), Cyan (~3%)
    let colorCategory: ParticleColorCategory = "black";
    if (i % 31 === 0) {
      colorCategory = "cyan"; // Sparse accents
    } else if (i % 11 === 0) {
      colorCategory = "blue"; // Restrained secondary highlights
    } else if (i % 6 === 0) {
      colorCategory = "navy"; // Transition depth
    } else {
      colorCategory = "black"; // Dominant graphite
    }

    // 4. Sizing: clean micro-dots (1.0px to 1.8px base)
    let baseRadius = 1.1 + (i % 4) * 0.22;
    if (colorCategory === "blue" || colorCategory === "cyan") {
      baseRadius = 1.35 + (i % 3) * 0.25;
    }

    particles.push({
      x0,
      y0,
      z0,
      rScale: shell,
      baseRadius,
      colorCategory,
      phase: (i * 0.45) % (Math.PI * 2),
    });
  }

  return particles;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AntigravityOrbitHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Generate 720 structured Fibonacci lattice particles (clean, high density, locked 60fps)
  const particles = useMemo(() => generateStructuredField(720), []);

  // Mouse tilt tracking with smooth spring damping
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Canvas render loop + Mascot Parallax
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Continuous slow 3D rotation
    let rotY = 0;

    const render = (time: number) => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        // Damped mouse follow
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;

        // Slow, elegant, continuous rotation (~0.0016 rad/frame = ~65s full revolution)
        rotY += 0.0016;

        const tiltX = 0.04 + mouse.y * 0.12;
        const tiltY = rotY + mouse.x * 0.16;

        const cosY = Math.cos(tiltY);
        const sinY = Math.sin(tiltY);
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);

        // Core radius sized to frame the mascot gracefully without clipping
        const isMobile = width < 640;
        const baseCoreR = isMobile ? 88 : 130;
        const centerX = width / 2;
        const centerY = height / 2;
        const fov = 420;

        // Subtle micro-scale breathing oscillation (1.5% amplitude)
        const breathe = 1 + 0.015 * Math.sin(time * 0.0012);
        const coreR = baseCoreR * breathe;

        // Update Central Mascot 3D parallax & floating hover via DOM ref for 60fps performance
        if (mascotRef.current) {
          const mascotTiltX = -mouse.y * 10; // -10deg to +10deg tilt
          const mascotTiltY = mouse.x * 14;  // -14deg to +14deg turn
          const mascotHoverY = Math.sin(time * 0.0016) * 5; // smooth 5px hovering
          mascotRef.current.style.transform = `translate3d(-50%, calc(-50% + ${mascotHoverY}px), 0) perspective(900px) rotateX(${mascotTiltX}deg) rotateY(${mascotTiltY}deg)`;
        }

        // 1. Subtle central ambient glow behind the core and mascot
        const haloGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          coreR * 0.2,
          centerX,
          centerY,
          coreR * 1.35
        );
        haloGrad.addColorStop(
          0,
          isLight ? "rgba(168, 85, 247, 0.08)" : "rgba(168, 85, 247, 0.12)"
        );
        haloGrad.addColorStop(
          0.5,
          isLight ? "rgba(37, 99, 235, 0.03)" : "rgba(56, 189, 248, 0.04)"
        );
        haloGrad.addColorStop(1, "rgba(37, 99, 235, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreR * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // 2. Project 3D particles
        const projected: {
          px: number;
          py: number;
          pz: number;
          scale: number;
          r: number;
          category: ParticleColorCategory;
        }[] = [];

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // 3D Rotation: Y (continuous) then X (tilt)
          const x1 = p.x0 * cosY + p.z0 * sinY;
          const z1 = -p.x0 * sinY + p.z0 * cosY;

          const y2 = p.y0 * cosX - z1 * sinX;
          const z2 = p.y0 * sinX + z1 * cosX;
          const x2 = x1;

          // Perspective projection
          const pz = z2 * coreR;
          const scale = fov / (fov + pz);
          const px = centerX + x2 * coreR * scale;
          const py = centerY + y2 * coreR * scale;

          projected.push({
            px,
            py,
            pz,
            scale,
            r: p.baseRadius * scale,
            category: p.colorCategory,
          });
        }

        // Sort by Z for authentic depth layering
        projected.sort((a, b) => a.pz - b.pz);

        // 3. Draw subtle constellation micro-lines between immediate Fibonacci neighbors
        ctx.lineWidth = 0.45;
        for (let i = 0; i < projected.length; i += 2) {
          const p1 = projected[i];
          if (p1.pz < -coreR * 0.15) continue; // Only connect front particles

          for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
            const p2 = projected[j];
            const dx = p1.px - p2.px;
            const dy = p1.py - p2.py;
            const distSq = dx * dx + dy * dy;

            if (distSq < 600) {
              const lineAlpha = (1 - distSq / 600) * 0.08;
              ctx.strokeStyle =
                p1.category === "blue" || p2.category === "blue" || p1.category === "cyan" || p2.category === "cyan"
                  ? `rgba(37, 99, 235, ${lineAlpha * 1.5})`
                  : isLight
                    ? `rgba(14, 17, 24, ${lineAlpha})`
                    : `rgba(148, 163, 184, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }

        // 4. Render particles with strict color hierarchy
        for (let i = 0; i < projected.length; i++) {
          const pt = projected[i];
          const depthNorm = Math.max(0.15, Math.min(1, (pt.pz + coreR) / (coreR * 2)));

          ctx.beginPath();
          ctx.arc(pt.px, pt.py, Math.max(0.7, pt.r), 0, Math.PI * 2);

          if (pt.category === "black") {
            // Dominant Graphite/Black (solid structural presence)
            const alpha = 0.72 + depthNorm * 0.26;
            ctx.fillStyle = isLight
              ? `rgba(12, 14, 20, ${alpha})`
              : `rgba(215, 222, 235, ${alpha * 0.85})`;
            ctx.shadowBlur = 0;
          } else if (pt.category === "navy") {
            // Subtle Transition Depth
            const alpha = 0.60 + depthNorm * 0.25;
            ctx.fillStyle = isLight
              ? `rgba(24, 32, 52, ${alpha})`
              : `rgba(148, 163, 184, ${alpha})`;
            ctx.shadowBlur = 0;
          } else if (pt.category === "blue") {
            // Restrained Electric Blue Accents
            const alpha = 0.82 + depthNorm * 0.18;
            ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.shadowColor = "#3B82F6";
            ctx.shadowBlur = 4 * pt.scale;
          } else {
            // Very Sparse Cyan Sparks
            const alpha = 0.90 + depthNorm * 0.1;
            ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.shadowColor = "#22D3EE";
            ctx.shadowBlur = 5 * pt.scale;
          }

          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [particles, isLight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[500px] md:h-[520px] flex items-center justify-center select-none overflow-visible"
      role="region"
      aria-label="Google Antigravity-inspired structured 3D particle core with 360-degree orbiting platform icons"
    >
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }

        /* Responsive Orbit Dimensions */
        @media (max-width: 639px) {
          .orbit-ring-0 { width: 210px; height: 210px; }
          .orbit-ring-1 { width: 260px; height: 260px; }
          .orbit-ring-2 { width: 310px; height: 310px; }
        }
        @media (min-width: 640px) {
          .orbit-ring-0 { width: 320px; height: 320px; }
          .orbit-ring-1 { width: 415px; height: 415px; }
          .orbit-ring-2 { width: 500px; height: 500px; }
        }
      `}</style>

      {/* 1. Core Canvas (Lattice Particle Field rendered directly on webpage) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none z-10"
      />

      {/* 2. Official SocialAssist Robot Mascot (Centerpiece with 3D Parallax & Floating Hover) */}
      <div
        ref={mascotRef}
        className="absolute top-1/2 left-1/2 z-15 flex flex-col items-center justify-center pointer-events-auto cursor-pointer group transition-shadow duration-300"
        style={{
          width: "auto",
          transform: "translate3d(-50%, -50%, 0)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        title="SocialAssist AI Mascot"
      >
        {/* Soft Ambient Lilac/Purple Underglow Disc */}
        <div
          className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 rounded-full pointer-events-none transition-all duration-500"
          style={{
            width: "130px",
            height: "26px",
            background: isLight
              ? "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.35) 0%, rgba(124, 58, 237, 0.15) 50%, transparent 80%)"
              : "radial-gradient(ellipse at center, rgba(192, 132, 252, 0.45) 0%, rgba(147, 51, 234, 0.20) 50%, transparent 80%)",
            filter: "blur(10px)",
          }}
        />

        {/* Mascot High-Fidelity Cutout Image */}
        <img
          src="/images/robot-mascot.png"
          alt="SocialAssist AI Robot Mascot"
          width={745}
          height={458}
          className="w-[138px] sm:w-[172px] md:w-[195px] h-auto object-contain select-none transition-transform duration-300 group-hover:scale-105"
          style={{
            filter: isLight
              ? "drop-shadow(0 14px 20px rgba(124, 58, 237, 0.22)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))"
              : "drop-shadow(0 16px 28px rgba(168, 85, 247, 0.32)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))",
          }}
          draggable={false}
        />
      </div>

      {/* 3. Three Controlled Orbital Rings (Sized to stay comfortably within bounds) */}
      {ORBIT_CONFIGS.map((cfg, orbitIdx) => {
        const orbitAnim = cfg.isClockwise ? "orbit-cw" : "orbit-ccw";
        const counterAnim = cfg.isClockwise ? "counter-cw" : "counter-ccw";
        const ringPlatforms = PLATFORMS.filter((p) => p.orbitIndex === orbitIdx);

        return (
          <div
            key={orbitIdx}
            className={`orbit-ring-${orbitIdx} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none`}
            style={{
              border: isLight
                ? "1px solid rgba(15, 23, 42, 0.05)"
                : "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {ringPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="absolute top-0 left-1/2 h-1/2 -ml-4.5 sm:-ml-5 md:-ml-5.5 origin-bottom flex flex-col justify-start items-center pointer-events-auto"
                style={
                  {
                    "--start-angle": `${platform.angleOffset}deg`,
                    animation: `${orbitAnim} ${cfg.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                {/* Floating Glass Tile (Each platform appears exactly once) */}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border -mt-4.5 sm:-mt-5 md:-mt-5.5 flex items-center justify-center relative z-20 transition-all duration-300 hover:scale-120 cursor-pointer backdrop-blur-xl group"
                  style={
                    {
                      "--counter-offset": `${-platform.angleOffset}deg`,
                      animation: `${counterAnim} ${cfg.duration}s linear infinite`,
                      backgroundColor: isLight
                        ? "rgba(255, 255, 255, 0.90)"
                        : "rgba(16, 18, 28, 0.90)",
                      borderColor: isLight
                        ? "rgba(0, 0, 0, 0.08)"
                        : "rgba(255, 255, 255, 0.12)",
                      boxShadow: isLight
                        ? "0 8px 18px -3px rgba(0, 0, 0, 0.08), 0 3px 6px -2px rgba(0, 0, 0, 0.04)"
                        : "0 8px 22px rgba(0, 0, 0, 0.45)",
                    } as React.CSSProperties
                  }
                  title={platform.name}
                >
                  <img
                    src={platform.src}
                    alt={platform.name}
                    width={22}
                    height={22}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Re-export for compatibility
export { AntigravityOrbitHero as OrbitingCirclesGlobeDemo };
