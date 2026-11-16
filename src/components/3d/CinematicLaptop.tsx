"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface CinematicLaptopProps {
  className?: string;
}

export default function CinematicLaptop({ className = "" }: CinematicLaptopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [scrollProgressDisplay, setScrollProgressDisplay] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const sceneState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    lidGroup: THREE.Group | null;
    laptopRoot: THREE.Group | null;
    screenMaterial: THREE.MeshBasicMaterial | null;
    screenLight: THREE.PointLight | null;
    videoTexture: THREE.VideoTexture | null;
    animId: number | null;
    currentOpen: number; // 0 to 1 interpolated
    targetOpen: number; // 0 to 1 from scroll
    targetCameraY: number;
    targetCameraZ: number;
    mouse: { x: number; y: number; targetX: number; targetY: number };
    isVisible: boolean;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    lidGroup: null,
    laptopRoot: null,
    screenMaterial: null,
    screenLight: null,
    videoTexture: null,
    animId: null,
    currentOpen: 0,
    targetOpen: 0,
    targetCameraY: 0.9,
    targetCameraZ: 3.8,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isVisible: true,
  });

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

  // Helper to create a fallback high-res poster texture so screen is NEVER blank
  const createPosterTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Premium dark gradient background
    const grad = ctx.createLinearGradient(0, 0, 1280, 800);
    grad.addColorStop(0, "#080B14");
    grad.addColorStop(0.5, "#0D1222");
    grad.addColorStop(1, "#07080D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 800);

    // Subtle radial aura
    const radial = ctx.createRadialGradient(640, 400, 50, 640, 400, 500);
    radial.addColorStop(0, "rgba(56, 189, 248, 0.25)");
    radial.addColorStop(0.5, "rgba(139, 92, 246, 0.12)");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1280, 800);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }
    for (let y = 0; y < 800; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Brand Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 52px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SOCIALASSIST", 640, 370);

    // Subtitle
    ctx.fillStyle = "#38BDF8";
    ctx.font = "600 24px monospace";
    ctx.fillText("DIGITAL ASSISTANCE & RESOLUTION NETWORK", 640, 430);

    // Security indicator pill
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.roundRect(500, 480, 280, 44, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#E2E8F0";
    ctx.font = "500 16px system-ui";
    ctx.fillText("• High-Security Resolution Desk •", 640, 502);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    const posterTexture = createPosterTexture();

    // 1. Video Element setup
    const video = document.createElement("video");
    video.src = "/videos/intro.mp4";
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");

    let videoTexture: THREE.VideoTexture | null = null;

    video.addEventListener("loadeddata", () => {
      setVideoLoaded(true);
      videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.generateMipmaps = false;

      if (sceneState.current.screenMaterial) {
        sceneState.current.screenMaterial.map = videoTexture;
        sceneState.current.screenMaterial.needsUpdate = true;
      }
    });

    video.play().catch(() => {});
    videoRef.current = video;

    // 2. Three.js Scene Setup
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 3.8);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Apple Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(2, 5, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-4, 3, -2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.0);
    fillLight.position.set(4, 2, -1);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x0a0c16, 1.4);
    scene.add(ambientLight);

    // Screen radiance point light
    const screenLight = new THREE.PointLight(0x38bdf8, 0, 4.5, 2.0);
    screenLight.position.set(0, 0.6, 0);
    scene.add(screenLight);

    // 4. Photorealistic Laptop Geometry (Solid Precision Unibody)
    const laptopRoot = new THREE.Group();
    scene.add(laptopRoot);

    const baseW = 2.45;
    const baseD = 1.62;
    const baseH = 0.048;

    // Materials: Refined Dark Graphite / Metallic Silver Aluminum
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0x181822,
      metalness: 0.88,
      roughness: 0.26,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0d13,
      metalness: 0.7,
      roughness: 0.4,
    });

    // --- Base Body ---
    const baseGroup = new THREE.Group();
    laptopRoot.add(baseGroup);

    const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    const baseMesh = new THREE.Mesh(baseGeo, aluminumMaterial);
    baseMesh.position.set(0, baseH / 2, baseD / 2);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseGroup.add(baseMesh);

    // Thumb notch on front edge
    const notchGeo = new THREE.BoxGeometry(0.32, 0.015, 0.02);
    const notchMat = new THREE.MeshStandardMaterial({ color: 0x0a0b10, roughness: 0.5 });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(0, baseH - 0.005, baseD - 0.005);
    baseGroup.add(notchMesh);

    // Keyboard Well & Chiclet Keys
    const kbWellW = 1.82;
    const kbWellD = 0.78;
    const kbWellGeo = new THREE.PlaneGeometry(kbWellW, kbWellD);
    const kbWellMat = new THREE.MeshStandardMaterial({
      color: 0x09090e,
      roughness: 0.6,
      metalness: 0.4,
    });
    const kbWell = new THREE.Mesh(kbWellGeo, kbWellMat);
    kbWell.rotation.x = -Math.PI / 2;
    kbWell.position.set(0, baseH + 0.001, 0.58);
    baseGroup.add(kbWell);

    // Keyboard Keycaps Plate
    const keyPlateGeo = new THREE.PlaneGeometry(kbWellW - 0.04, kbWellD - 0.04);
    const keyPlateMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.35,
      metalness: 0.3,
    });
    const keyPlate = new THREE.Mesh(keyPlateGeo, keyPlateMat);
    keyPlate.rotation.x = -Math.PI / 2;
    keyPlate.position.set(0, baseH + 0.002, 0.58);
    baseGroup.add(keyPlate);

    // Trackpad
    const trackpadW = 0.88;
    const trackpadD = 0.56;
    const trackpadGeo = new THREE.PlaneGeometry(trackpadW, trackpadD);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x161720,
      roughness: 0.22,
      metalness: 0.82,
    });
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, baseH + 0.001, 1.26);
    baseGroup.add(trackpad);

    // Speaker Grilles
    const grillW = 0.18;
    const grillD = 0.76;
    const grillGeo = new THREE.PlaneGeometry(grillW, grillD);
    const grillMat = new THREE.MeshStandardMaterial({
      color: 0x101118,
      roughness: 0.7,
      metalness: 0.3,
    });
    const leftGrill = new THREE.Mesh(grillGeo, grillMat);
    leftGrill.rotation.x = -Math.PI / 2;
    leftGrill.position.set(-1.05, baseH + 0.001, 0.58);
    baseGroup.add(leftGrill);

    const rightGrill = new THREE.Mesh(grillGeo, grillMat);
    rightGrill.rotation.x = -Math.PI / 2;
    rightGrill.position.set(1.05, baseH + 0.001, 0.58);
    baseGroup.add(rightGrill);

    // --- Back Hinge Pivot ---
    const hingeGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.9, 24);
    const hingeMesh = new THREE.Mesh(hingeGeo, darkTrimMaterial);
    hingeMesh.rotation.z = Math.PI / 2;
    hingeMesh.position.set(0, baseH, 0);
    laptopRoot.add(hingeMesh);

    // --- Lid Group (Pivots exactly at Hinge Z=0, Y=baseH) ---
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, baseH, 0);
    laptopRoot.add(lidGroup);

    const lidW = baseW;
    const lidD = baseD;
    const lidH = 0.038;

    // Aluminum Back Shell
    const lidBackGeo = new THREE.BoxGeometry(lidW, lidH, lidD);
    const lidBackMesh = new THREE.Mesh(lidBackGeo, aluminumMaterial);
    lidBackMesh.position.set(0, lidH / 2, lidD / 2);
    lidBackMesh.castShadow = true;
    lidGroup.add(lidBackMesh);

    // Display Glass Surface & Bezel
    const screenW = lidW * 0.92;
    const screenH = lidD * 0.88;

    // Bezel Frame
    const bezelGeo = new THREE.PlaneGeometry(lidW * 0.97, lidD * 0.96);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.set(0, -0.001, lidD / 2);
    lidGroup.add(bezel);

    // Continuous Screen Display Mesh (Always mapped to poster or video)
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: posterTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.rotation.x = Math.PI / 2;
    screenMesh.position.set(0, -0.002, lidD / 2);
    lidGroup.add(screenMesh);

    // FaceTime Camera Dot
    const camGeo = new THREE.CircleGeometry(0.012, 16);
    const camMat = new THREE.MeshBasicMaterial({ color: 0x111624 });
    const camMesh = new THREE.Mesh(camGeo, camMat);
    camMesh.rotation.x = Math.PI / 2;
    camMesh.position.set(0, -0.002, lidD - 0.038);
    lidGroup.add(camMesh);

    // Studio Reflection Shadow Catcher Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07070a,
      roughness: 0.5,
      metalness: 0.5,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.002;
    floorMesh.receiveShadow = true;
    laptopRoot.add(floorMesh);

    // Save State
    const s = sceneState.current;
    s.renderer = renderer;
    s.scene = scene;
    s.camera = camera;
    s.lidGroup = lidGroup;
    s.laptopRoot = laptopRoot;
    s.screenMaterial = screenMaterial;
    s.screenLight = screenLight;
    s.videoTexture = videoTexture;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      s.targetOpen = 1;
      s.currentOpen = 1;
      lidGroup.rotation.x = -1.82;
      camera.position.set(0, 1.25, 4.2);
    }

    // ── 5. SCROLL SYNCHRONIZATION ──
    const updateScrollProgress = () => {
      if (prefersReducedMotion) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // When section top is at 80% viewport height, animation starts (progress 0)
      // When section center is at viewport center, animation reaches full open (progress 1)
      const startY = windowH * 0.85;
      const endY = windowH * 0.25;

      const progress = Math.min(Math.max((startY - rect.top) / (startY - endY), 0), 1);
      s.targetOpen = progress;
      setScrollProgressDisplay(Math.round(progress * 100));

      // Synchronize video play state with scroll
      if (videoRef.current) {
        if (progress > 0.05 && videoRef.current.paused && playing) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Mouse Parallax Listeners
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      s.mouse.targetX = x * 0.25;
      s.mouse.targetY = y * 0.15;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Responsive Resize Handler
    const onResize = () => {
      if (!container || !s.renderer || !s.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      s.camera.aspect = w / h;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize();

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        s.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    // ── 6. 120Hz Animation Loop with Damped Hermite Curves ──
    let lastTime = performance.now();

    const animate = (time: number) => {
      s.animId = requestAnimationFrame(animate);
      if (!s.isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Damped interpolation towards scroll progress
      const openSpeed = 5.0;
      s.currentOpen += (s.targetOpen - s.currentOpen) * (dt * openSpeed);

      // Realistic MacBook Opening Angle: from 0° (closed) to -104° (-1.82 rad) around back hinge
      const maxAngle = 1.82; // ~104 degrees
      const currentAngle = -s.currentOpen * maxAngle;
      if (s.lidGroup) {
        s.lidGroup.rotation.x = currentAngle;
      }

      // Dynamic Keyboard Radiance from Screen
      if (s.screenLight) {
        const glowFactor = Math.max((s.currentOpen - 0.2) / 0.8, 0);
        s.screenLight.intensity = glowFactor * 3.8;
      }

      // Smooth Camera Positioning from scroll
      // As laptop opens, camera gracefully raises and frames the screen
      const targetCamY = 0.85 + s.currentOpen * 0.45;
      const targetCamZ = 3.6 + s.currentOpen * 0.55;
      camera.position.y += (targetCamY - camera.position.y) * (dt * 3.5);
      camera.position.z += (targetCamZ - camera.position.z) * (dt * 3.5);

      // Soft Mouse Parallax
      s.mouse.x += (s.mouse.targetX - s.mouse.x) * (dt * 4.0);
      s.mouse.y += (s.mouse.targetY - s.mouse.y) * (dt * 4.0);

      laptopRoot.rotation.y = s.mouse.x * 0.4;
      laptopRoot.rotation.x = -s.mouse.y * 0.25;

      renderer.render(scene, camera);
    };

    s.animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      observer.disconnect();

      if (s.animId) cancelAnimationFrame(s.animId);

      video.pause();
      video.src = "";
      video.load();

      if (videoTexture) videoTexture.dispose();
      if (posterTexture) posterTexture.dispose();

      baseGeo.dispose();
      notchGeo.dispose();
      kbWellGeo.dispose();
      keyPlateGeo.dispose();
      trackpadGeo.dispose();
      grillGeo.dispose();
      hingeGeo.dispose();
      lidBackGeo.dispose();
      bezelGeo.dispose();
      screenGeo.dispose();
      camGeo.dispose();
      floorGeo.dispose();

      aluminumMaterial.dispose();
      darkTrimMaterial.dispose();
      notchMat.dispose();
      kbWellMat.dispose();
      keyPlateMat.dispose();
      trackpadMat.dispose();
      grillMat.dispose();
      bezelMat.dispose();
      screenMaterial.dispose();
      camMat.dispose();
      floorMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [playing]);

  return (
    <div ref={sectionRef} className={`relative w-full max-w-5xl mx-auto py-8 ${className}`}>
      {/* Scroll Synchronization Indicator Strip */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider text-zinc-300">
            Scroll-Synchronized 3D Hardware Presentation
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-zinc-500">Lid Open:</span>
          <span className="text-cyan-400 font-bold tabular-nums">{scrollProgressDisplay}%</span>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
      />

      {/* Studio Glass Controls Bar */}
      <div className="mt-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#10121C]/80 backdrop-blur-xl border border-white/10 shadow-lg text-xs max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            <span>{playing ? "⏸ Pause" : "▶ Play"}</span>
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
          >
            <span>{muted ? "🔇 Unmute" : "🔊 Mute"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{videoLoaded ? "4K Video Active" : "Liquid Retina Screen"}</span>
        </div>
      </div>
    </div>
  );
}
