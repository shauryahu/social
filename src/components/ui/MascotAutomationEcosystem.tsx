"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  RedditIcon,
  DiscordIcon,
  WhatsAppIcon,
} from "@/components/icons/PlatformIcons";

interface PlatformDef {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
}

const PLATFORMS: PlatformDef[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    glowColor: "rgba(37, 211, 102, 0.5)",
    icon: <WhatsAppIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(37,211,102,0.4)]" />,
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    glowColor: "rgba(225, 48, 108, 0.5)",
    icon: <InstagramIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(225,48,108,0.4)]" />,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    glowColor: "rgba(24, 119, 242, 0.5)",
    icon: <FacebookIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(24,119,242,0.4)]" />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#00F2FE",
    glowColor: "rgba(0, 242, 254, 0.5)",
    icon: <TikTokIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(0,242,254,0.4)]" />,
  },
  {
    id: "discord",
    name: "Discord",
    color: "#5865F2",
    glowColor: "rgba(88, 101, 242, 0.5)",
    icon: <DiscordIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(88,101,242,0.4)]" />,
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "#FF4500",
    glowColor: "rgba(255, 69, 0, 0.5)",
    icon: <RedditIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(255,69,0,0.4)]" />,
  },
];

export default function MascotAutomationEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const levitationGlowRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linePathsRef = useRef<(SVGLineElement | null)[]>([]);
  const pulseRef = useRef<SVGCircleElement>(null);

  const [activePlatformIndex, setActivePlatformIndex] = useState(0);
  const [hoveredPlatformIndex, setHoveredPlatformIndex] = useState<number | null>(null);
  const [mascotPulse, setMascotPulse] = useState(false);

  // High-performance physics state kept in ref for 60+ FPS zero-overhead RAF loop
  const animState = useRef({
    orbitAngle: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    targetPanX: 0,
    targetPanY: 0,
    currentPanX: 0,
    currentPanY: 0,
    pulseProgress: 0,
    activeIdx: 0,
    isVisible: true,
    isHovered: false,
    orbitSpeed: 0.0065, // ~28s per full 360 revolution
  });

  // Intersection Observer to suspend RAF calculation when out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        animState.current.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Synchronize active platform index to physics loop
  useEffect(() => {
    animState.current.activeIdx = hoveredPlatformIndex !== null ? hoveredPlatformIndex : activePlatformIndex;
  }, [activePlatformIndex, hoveredPlatformIndex]);

  // Automatic cycle for active platform every 2.8s
  useEffect(() => {
    if (hoveredPlatformIndex !== null) return;
    const interval = setInterval(() => {
      setActivePlatformIndex((prev) => {
        const next = (prev + 1) % PLATFORMS.length;
        animState.current.pulseProgress = 0;
        setMascotPulse(true);
        setTimeout(() => setMascotPulse(false), 550);
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [hoveredPlatformIndex]);

  // Pointer & Touch handlers with Apple-calibrated spring parameters
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2)));

    // Subtle Apple-style perspective tilt
    animState.current.targetTiltX = -normY * 13; // rotateX
    animState.current.targetTiltY = normX * 16;  // rotateY
    animState.current.targetPanX = normX * 12;   // translateX
    animState.current.targetPanY = normY * 8;    // translateY
  }, []);

  const handlePointerLeave = useCallback(() => {
    animState.current.targetTiltX = 0;
    animState.current.targetTiltY = 0;
    animState.current.targetPanX = 0;
    animState.current.targetPanY = 0;
  }, []);

  // 60-120 FPS Main requestAnimationFrame Loop
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    // Responsive 3D orbital ellipse radii
    const rx = 138;
    const ry = 64;
    const stageWidth = 340;
    const stageHeight = 340;
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2 - 6;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const state = animState.current;

      if (state.isVisible) {
        // Orbit speed eases down when hovering a node
        const speedMultiplier = hoveredPlatformIndex !== null ? 0.3 : 1.0;
        state.orbitAngle += state.orbitSpeed * speedMultiplier * (dt / 0.016);

        // Smooth spring lerp damping towards cursor targets
        state.currentTiltX += (state.targetTiltX - state.currentTiltX) * 0.08;
        state.currentTiltY += (state.targetTiltY - state.currentTiltY) * 0.08;
        state.currentPanX += (state.targetPanX - state.currentPanX) * 0.08;
        state.currentPanY += (state.targetPanY - state.currentPanY) * 0.08;

        // Subtle harmonic floating motion for mascot
        const floatY = Math.sin(now * 0.0022) * 5.5;
        const totalMascotX = state.currentPanX;
        const totalMascotY = state.currentPanY + floatY;

        // Apply 3D perspective transform to Central Mascot
        if (mascotRef.current) {
          mascotRef.current.style.transform = `translate3d(${totalMascotX}px, ${totalMascotY}px, 20px) rotateX(${state.currentTiltX}deg) rotateY(${state.currentTiltY}deg)`;
        }

        // Dynamic specular highlight shifts across the glossy surface with cursor angle
        if (specularRef.current) {
          const specX = -state.currentTiltY * 2.2;
          const specY = -state.currentTiltX * 2.2;
          specularRef.current.style.transform = `translate3d(${specX}px, ${specY}px, 0px)`;
          specularRef.current.style.opacity = `${0.35 + Math.hypot(state.currentTiltX, state.currentTiltY) * 0.02}`;
        }

        // Soft ground shadow reacts inversely to levitation
        if (shadowRef.current) {
          const shadowScale = 1 - (floatY / 30);
          shadowRef.current.style.transform = `translate3d(${totalMascotX * 0.35}px, ${state.currentPanY * 0.2}px, 0px) scale(${shadowScale})`;
        }

        // Violet levitation glow beneath robot
        if (levitationGlowRef.current) {
          levitationGlowRef.current.style.transform = `translate3d(${totalMascotX * 0.7}px, ${totalMascotY * 0.7}px, 0px)`;
        }

        // Render each platform along the 3D tilted orbit
        const numPlatforms = PLATFORMS.length;
        const currentActiveIdx = state.activeIdx;

        let activePlatformPos = { x: centerX, y: centerY };

        PLATFORMS.forEach((_, idx) => {
          const el = platformsRef.current[idx];
          const lineEl = linePathsRef.current[idx];
          if (!el) return;

          const baseOffset = (idx * (2 * Math.PI)) / numPlatforms;
          const theta = state.orbitAngle + baseOffset;

          // 3D Orbital Ellipse coordinates
          const px = centerX + rx * Math.cos(theta);
          const py = centerY + ry * Math.sin(theta);
          const zDepth = Math.sin(theta); // -1 (back of mascot) to +1 (front of mascot)

          // Subtle parallax offset
          const parallaxX = state.currentPanX * 0.35;
          const parallaxY = state.currentPanY * 0.35;

          const finalX = px + parallaxX;
          const finalY = py + parallaxY;

          // Spatial depth layering:
          // Behind mascot: z < -0.05 -> zIndex 6, scale down, dimmed
          // In front of mascot: z >= -0.05 -> zIndex 24, scale up, full brightness
          const isBehind = zDepth < -0.05;
          const isCurrentActive = idx === currentActiveIdx;
          const isCurrentlyHovered = idx === hoveredPlatformIndex;

          const baseScale = 0.84 + (zDepth + 1) * 0.12; // 0.84 to 1.08
          const hoverBoost = isCurrentlyHovered ? 1.22 : isCurrentActive ? 1.1 : 1.0;
          const finalScale = baseScale * hoverBoost;

          const zIndex = isCurrentlyHovered ? 32 : isBehind ? 6 : 24;
          const opacity = isCurrentlyHovered ? 1.0 : isCurrentActive ? 1.0 : isBehind ? 0.72 : 0.95;

          el.style.transform = `translate3d(${finalX - 26}px, ${finalY - 26}px, ${zDepth * 30}px) scale(${finalScale})`;
          el.style.zIndex = `${zIndex}`;
          el.style.opacity = `${opacity}`;

          // Update SVG connection line
          if (lineEl) {
            lineEl.setAttribute("x1", (centerX + totalMascotX).toFixed(1));
            lineEl.setAttribute("y1", (centerY + totalMascotY).toFixed(1));
            lineEl.setAttribute("x2", finalX.toFixed(1));
            lineEl.setAttribute("y2", finalY.toFixed(1));

            if (isCurrentActive || isCurrentlyHovered) {
              lineEl.setAttribute("stroke", PLATFORMS[idx].color);
              lineEl.setAttribute("stroke-opacity", isCurrentlyHovered ? "0.75" : "0.55");
              lineEl.setAttribute("stroke-width", "1.5");
              lineEl.setAttribute("stroke-dasharray", "none");
            } else {
              lineEl.setAttribute("stroke", "rgba(255, 255, 255, 0.12)");
              lineEl.setAttribute("stroke-opacity", "0.25");
              lineEl.setAttribute("stroke-width", "1");
              lineEl.setAttribute("stroke-dasharray", "2 4");
            }
          }

          if (isCurrentActive) {
            activePlatformPos = { x: finalX, y: finalY };
          }
        });

        // Update traveling light pulse from robot towards active platform
        if (pulseRef.current) {
          state.pulseProgress += dt * 1.65; // ~0.6s pulse transit time
          if (state.pulseProgress > 1) {
            state.pulseProgress = 1;
          }

          const robotX = centerX + totalMascotX;
          const robotY = centerY + totalMascotY;

          const p = state.pulseProgress;
          // Smooth easeOutCubic curve
          const easeP = 1 - Math.pow(1 - p, 3);

          const pulseX = robotX + (activePlatformPos.x - robotX) * easeP;
          const pulseY = robotY + (activePlatformPos.y - robotY) * easeP;

          pulseRef.current.setAttribute("cx", pulseX.toFixed(1));
          pulseRef.current.setAttribute("cy", pulseY.toFixed(1));
          pulseRef.current.setAttribute("opacity", p < 0.98 ? "0.95" : "0");
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [hoveredPlatformIndex]);

  const activeColor = PLATFORMS[hoveredPlatformIndex ?? activePlatformIndex].color;
  const activeGlow = PLATFORMS[hoveredPlatformIndex ?? activePlatformIndex].glowColor;

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl p-6 sm:p-8 flex items-center justify-center border border-white/10 dark-console-box backdrop-blur-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto select-none"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(26, 26, 40, 0.7) 0%, rgba(13, 14, 22, 0.95) 100%)",
      }}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseLeave={handlePointerLeave}
      onTouchStart={(e) => {
        if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handlePointerLeave}
    >
      {/* Dynamic ambient background glow tuned to current active platform */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-700"
        style={{
          width: 300,
          height: 200,
          left: "50%",
          top: "48%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, ${activeGlow} 0%, transparent 70%)`,
          filter: "blur(54px)",
          opacity: 0.45,
        }}
      />

      {/* Main 3D Stage Container */}
      <div
        ref={stageRef}
        className="relative scale-90 sm:scale-100 origin-center transition-transform"
        style={{
          width: 340,
          height: 340,
          perspective: 1100,
          transformStyle: "preserve-3d",
          touchAction: "pan-y",
        }}
      >
        {/* Subtle elliptical orbital track guides */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="340"
          height="340"
          viewBox="0 0 340 340"
          style={{ opacity: 0.3 }}
        >
          <ellipse
            cx="170"
            cy="164"
            rx="138"
            ry="64"
            fill="none"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <ellipse
            cx="170"
            cy="164"
            rx="138"
            ry="64"
            fill="none"
            stroke="rgba(129, 140, 248, 0.14)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Dynamic connection lines and traveling pulse SVG layer */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="340"
          height="340"
          viewBox="0 0 340 340"
          style={{ zIndex: 10 }}
        >
          <defs>
            <radialGradient id="pulse-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="35%" stopColor={activeColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
            </radialGradient>
            <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines to all platforms */}
          {PLATFORMS.map((platform, idx) => (
            <line
              key={`line-${platform.id}`}
              ref={(el) => {
                linePathsRef.current[idx] = el;
              }}
              x1="170"
              y1="164"
              x2="170"
              y2="164"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}

          {/* Traveling energy data pulse */}
          <circle
            ref={pulseRef}
            cx="170"
            cy="164"
            r="4.5"
            fill="url(#pulse-gradient)"
            filter="url(#pulse-glow)"
            opacity="0"
          />
        </svg>

        {/* Soft Ambient Levitation Glow beneath mascot */}
        <div
          ref={levitationGlowRef}
          className="absolute pointer-events-none rounded-full transition-opacity duration-300"
          style={{
            width: 140,
            height: 48,
            left: 170 - 70,
            top: 200,
            background: `radial-gradient(ellipse at center, rgba(168, 85, 247, ${mascotPulse ? 0.6 : 0.35}) 0%, transparent 70%)`,
            filter: "blur(14px)",
            zIndex: 11,
          }}
        />

        {/* Soft Ground Shadow on Stage floor */}
        <div
          ref={shadowRef}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 100,
            height: 22,
            left: 170 - 50,
            top: 234,
            background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 70%)",
            filter: "blur(7px)",
            zIndex: 9,
            transition: "transform 0.05s ease-out",
          }}
        />

        {/* ==============================================================
            CENTRAL ROBOT MASCOT (3D PERSPECTIVE LAYERED PRESENTATION)
            Z-Index is set to 14:
            - Background platforms (z: 6) naturally orbit behind the robot
            - Foreground platforms (z: 24) naturally orbit in front of the robot
           ============================================================== */}
        <div
          ref={mascotRef}
          className="absolute flex items-center justify-center cursor-default"
          style={{
            width: 176,
            height: 108,
            left: 170 - 88,
            top: 164 - 54,
            zIndex: 14,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Official SocialAssist Robot Mascot PNG with glossy depth and dynamic rim lighting */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/robot-mascot.png"
              alt="SocialAssist Official Mascot"
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{
                filter: `drop-shadow(0 16px 28px rgba(0,0,0,0.65)) drop-shadow(0 0 ${mascotPulse ? "24px" : "16px"} ${activeGlow})`,
                transition: "filter 0.4s ease-out",
              }}
            />

            {/* Specular light sheen overlay that tracks cursor rotation */}
            <div
              ref={specularRef}
              className="absolute inset-0 pointer-events-none rounded-full mix-blend-screen"
              style={{
                background: "radial-gradient(circle at 45% 35%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%)",
                opacity: 0.35,
                transition: "opacity 0.2s ease-out",
              }}
            />

            {/* Subtle active pulse reaction flash over visor */}
            {mascotPulse && (
              <div
                className="absolute rounded-full pointer-events-none animate-ping"
                style={{
                  width: 50,
                  height: 35,
                  left: "50%",
                  top: "45%",
                  transform: "translate(-50%, -50%)",
                  background: activeGlow,
                  filter: "blur(8px)",
                  opacity: 0.6,
                }}
              />
            )}
          </div>
        </div>

        {/* ==============================================================
            ORBITING SOCIAL MEDIA PLATFORMS
            Dynamically positioned along the 3D tilted orbit via the RAF loop
           ============================================================== */}
        {PLATFORMS.map((platform, idx) => {
          const isActive = (hoveredPlatformIndex ?? activePlatformIndex) === idx;
          const isHovered = hoveredPlatformIndex === idx;

          return (
            <div
              key={platform.id}
              ref={(el) => {
                platformsRef.current[idx] = el;
              }}
              className="absolute flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-300"
              style={{
                width: 52,
                height: 52,
                left: 0,
                top: 0,
                background: isActive
                  ? "linear-gradient(135deg, rgba(34, 34, 48, 0.98), rgba(18, 18, 28, 0.98))"
                  : "rgba(18, 18, 26, 0.8)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: isActive
                  ? `1px solid ${platform.color}`
                  : "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: isHovered
                  ? `0 0 32px ${platform.color}90, 0 12px 24px rgba(0,0,0,0.65)`
                  : isActive
                  ? `0 0 24px ${platform.color}60, 0 8px 20px rgba(0,0,0,0.5)`
                  : "0 6px 16px rgba(0,0,0,0.35)",
                willChange: "transform, opacity",
              }}
              onMouseEnter={() => setHoveredPlatformIndex(idx)}
              onMouseLeave={() => setHoveredPlatformIndex(null)}
              onClick={() => setActivePlatformIndex(idx)}
              title={platform.name}
              aria-label={platform.name}
            >
              <div
                className="transition-transform duration-200"
                style={{
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                }}
              >
                {platform.icon}
              </div>

              {/* Active illuminated border glow */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
                  style={{
                    border: `1px solid ${platform.color}70`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
