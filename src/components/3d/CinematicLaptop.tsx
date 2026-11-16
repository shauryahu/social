"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface CinematicLaptopProps {
  onVideoEnd?: () => void;
  className?: string;
}

export default function CinematicLaptop({ className = "" }: CinematicLaptopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const sceneState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    lidGroup: THREE.Group | null;
    screenLight: THREE.PointLight | null;
    screenMesh: THREE.Mesh | null;
    screenMaterial: THREE.MeshBasicMaterial | null;
    videoTexture: THREE.VideoTexture | null;
    animationFrameId: number | null;
    targetLidAngle: number;
    currentLidAngle: number;
    mouse: { x: number; y: number; targetX: number; targetY: number };
    isVisible: boolean;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    lidGroup: null,
    screenLight: null,
    screenMesh: null,
    screenMaterial: null,
    videoTexture: null,
    animationFrameId: null,
    targetLidAngle: 0,
    currentLidAngle: 0,
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

  const replayOpenAnimation = useCallback(() => {
    const s = sceneState.current;
    s.currentLidAngle = 0;
    s.targetLidAngle = 0;
    setIsOpen(false);
    if (s.screenLight) s.screenLight.intensity = 0;
    setTimeout(() => {
      s.targetLidAngle = 1.82; // ~104 degrees open
      setIsOpen(true);
    }, 400);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Video Element for Intro Video
    const video = document.createElement("video");
    video.src = "/videos/intro.mp4";
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("webkit-playsinline", "true");
    video.play().catch(() => {
      // Autoplay might need user interaction for sound; muted allows play
    });
    videoRef.current = video;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // Track video progress
    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);

    // 2. Three.js Scene Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    // Deep midnight atmosphere matching Apple dark aesthetic
    scene.fog = new THREE.FogExp2(0x07070a, 0.045);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    // Position camera for cinematic three-quarter hero view
    camera.position.set(0, 1.45, 4.3);
    camera.lookAt(0, 0.35, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Apple-Grade Studio Lighting
    // Soft key overhead light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Subtle Electric Blue rim light from left
    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    blueRimLight.position.set(-4, 2.5, -2);
    scene.add(blueRimLight);

    // Soft violet accent fill light from right
    const violetFillLight = new THREE.DirectionalLight(0x8b5cf6, 1.1);
    violetFillLight.position.set(4, 1.8, -1);
    scene.add(violetFillLight);

    // Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x0e0e16, 1.2);
    scene.add(ambientLight);

    // Screen dynamic radiance point light (illuminates keyboard as screen opens)
    const screenLight = new THREE.PointLight(0xc5a7ff, 0, 4.5, 1.8);
    screenLight.position.set(0, 1.1, 0.1);
    scene.add(screenLight);

    // 4. Laptop Assembly
    const laptopRoot = new THREE.Group();
    laptopRoot.position.set(0, -0.2, 0);
    scene.add(laptopRoot);

    // Base Aluminum Chassis
    const baseW = 3.2;
    const baseD = 2.1;
    const baseH = 0.08;

    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181f,
      metalness: 0.88,
      roughness: 0.22,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0d,
      metalness: 0.7,
      roughness: 0.5,
    });

    // Base body
    const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    const baseMesh = new THREE.Mesh(baseGeo, aluminumMaterial);
    baseMesh.position.set(0, baseH / 2, 0);
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    laptopRoot.add(baseMesh);

    // Keyboard well recess
    const kbWellGeo = new THREE.BoxGeometry(2.7, 0.01, 1.15);
    const kbWellMesh = new THREE.Mesh(kbWellGeo, darkTrimMaterial);
    kbWellMesh.position.set(0, baseH + 0.002, -0.25);
    laptopRoot.add(kbWellMesh);

    // Trackpad
    const trackpadGeo = new THREE.BoxGeometry(1.15, 0.005, 0.65);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f26,
      metalness: 0.6,
      roughness: 0.35,
    });
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpadMesh.position.set(0, baseH + 0.003, 0.62);
    laptopRoot.add(trackpadMesh);

    // Keyboard keys rows
    const keysGroup = new THREE.Group();
    keysGroup.position.set(0, baseH + 0.008, -0.25);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      metalness: 0.4,
      roughness: 0.6,
    });
    // Create chiclet key rows
    const rows = 5;
    const cols = 14;
    const keyW = 0.165;
    const keyD = 0.17;
    const keyH = 0.015;
    const keyGeo = new THREE.BoxGeometry(keyW, keyH, keyD);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const kx = (c - (cols - 1) / 2) * (keyW + 0.022);
        const kz = (r - (rows - 1) / 2) * (keyD + 0.024);
        const key = new THREE.Mesh(keyGeo, keyMat);
        key.position.set(kx, 0, kz);
        keysGroup.add(key);
      }
    }
    // Space bar
    const spaceGeo = new THREE.BoxGeometry(1.0, keyH, keyD);
    const spaceKey = new THREE.Mesh(spaceGeo, keyMat);
    spaceKey.position.set(0, 0, ((rows - 1) / 2) * (keyD + 0.024));
    keysGroup.add(spaceKey);
    laptopRoot.add(keysGroup);

    // 5. Display Lid & Hinge (Pivoting around back edge)
    const lidGroup = new THREE.Group();
    // Pivot located at back edge of base
    const hingeZ = -baseD / 2;
    const hingeY = baseH;
    lidGroup.position.set(0, hingeY, hingeZ);
    laptopRoot.add(lidGroup);

    // Display Outer Lid
    const lidW = 3.2;
    const lidH = 2.05;
    const lidThickness = 0.055;

    const lidBackGeo = new THREE.BoxGeometry(lidW, lidThickness, lidH);
    const lidBackMesh = new THREE.Mesh(lidBackGeo, aluminumMaterial);
    // Offset lid center so its bottom edge rotates at hinge origin
    lidBackMesh.position.set(0, lidThickness / 2, lidH / 2);
    lidBackMesh.castShadow = true;
    lidGroup.add(lidBackMesh);

    // Display Inner Bezel
    const bezelGeo = new THREE.BoxGeometry(lidW - 0.08, 0.005, lidH - 0.08);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      metalness: 0.5,
      roughness: 0.4,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, lidThickness + 0.001, lidH / 2);
    lidGroup.add(bezelMesh);

    // Display Video Screen Mesh
    const screenW = lidW - 0.22;
    const screenH = lidH - 0.22;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    // Rotate to face upwards when lid is flat, forwards when upright
    screenMesh.rotation.x = -Math.PI / 2;
    screenMesh.position.set(0, lidThickness + 0.004, lidH / 2);
    lidGroup.add(screenMesh);

    // Glass display gloss reflection overlay
    const glassOverlayGeo = new THREE.PlaneGeometry(screenW, screenH);
    const glassOverlayMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      reflectivity: 0.6,
    });
    const glassOverlayMesh = new THREE.Mesh(glassOverlayGeo, glassOverlayMat);
    glassOverlayMesh.rotation.x = -Math.PI / 2;
    glassOverlayMesh.position.set(0, lidThickness + 0.006, lidH / 2);
    lidGroup.add(glassOverlayMesh);

    // Subtle ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    shadowMesh.receiveShadow = true;
    laptopRoot.add(shadowMesh);

    // Save references to state
    const state = sceneState.current;
    state.renderer = renderer;
    state.scene = scene;
    state.camera = camera;
    state.lidGroup = lidGroup;
    state.screenLight = screenLight;
    state.screenMesh = screenMesh;
    state.screenMaterial = screenMaterial;
    state.videoTexture = videoTexture;

    // Initially start closed (angle 0)
    lidGroup.rotation.x = 0;
    state.currentLidAngle = 0;
    state.targetLidAngle = 0;

    // Trigger the opening sequence after a brief theatrical pause
    const openTimer = setTimeout(() => {
      state.targetLidAngle = 1.82; // ~104 degrees open
      setIsOpen(true);
    }, 600);

    // 6. Interactive Mouse Parallax Handler
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      state.mouse.targetX = x * 0.35;
      state.mouse.targetY = y * 0.2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Responsive Resize Handler
    const onResize = () => {
      if (!container || !state.renderer || !state.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      state.camera.aspect = w / h;

      // Adjust camera distance for mobile so laptop fits screen
      if (w < 640) {
        state.camera.position.set(0, 1.6, 5.4);
      } else if (w < 1024) {
        state.camera.position.set(0, 1.5, 4.8);
      } else {
        state.camera.position.set(0, 1.45, 4.3);
      }

      state.camera.updateProjectionMatrix();
      state.renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize();

    // 7. IntersectionObserver for zero-overhead background pause
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (videoRef.current && videoRef.current.paused && playing) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 8. Main Render Animation Loop (60 FPS with Damped Spring Easing)
    let lastTime = performance.now();

    const animate = (time: number) => {
      state.animationFrameId = requestAnimationFrame(animate);

      if (!state.isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth damped hinge opening
      const lidDiff = state.targetLidAngle - state.currentLidAngle;
      state.currentLidAngle += lidDiff * (dt * 3.2);

      if (state.lidGroup) {
        state.lidGroup.rotation.x = state.currentLidAngle;
      }

      // Dynamic screen light radiance reacting to opening
      if (state.screenLight) {
        const openPct = Math.min(Math.max((state.currentLidAngle - 0.3) / 1.4, 0), 1);
        state.screenLight.intensity = openPct * 3.8;
      }

      // Smooth mouse damping
      state.mouse.x += (state.mouse.targetX - state.mouse.x) * (dt * 4.0);
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * (dt * 4.0);

      // Subtle float oscillation + mouse tilt
      const floatAngle = time * 0.001;
      laptopRoot.rotation.y = state.mouse.x + Math.sin(floatAngle * 0.6) * 0.03;
      laptopRoot.rotation.x = -state.mouse.y * 0.5 + Math.cos(floatAngle * 0.8) * 0.015;
      laptopRoot.position.y = -0.2 + Math.sin(floatAngle) * 0.04;

      renderer.render(scene, camera);
    };

    state.animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      clearTimeout(openTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("timeupdate", onTimeUpdate);
      observer.disconnect();

      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      video.pause();
      video.src = "";
      video.load();

      videoTexture.dispose();
      baseGeo.dispose();
      kbWellGeo.dispose();
      trackpadGeo.dispose();
      keyGeo.dispose();
      spaceGeo.dispose();
      lidBackGeo.dispose();
      bezelGeo.dispose();
      screenGeo.dispose();
      glassOverlayGeo.dispose();
      shadowGeo.dispose();

      aluminumMaterial.dispose();
      darkTrimMaterial.dispose();
      trackpadMat.dispose();
      keyMat.dispose();
      bezelMat.dispose();
      screenMaterial.dispose();
      glassOverlayMat.dispose();
      shadowMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [playing]);

  return (
    <div className={`relative w-full max-w-5xl mx-auto ${className}`}>
      {/* Three.js Container */}
      <div
        ref={containerRef}
        className="w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[600px] cursor-grab active:cursor-grabbing"
      />

      {/* Floating Apple-Style Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#111118]/85 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-xs text-zinc-300 z-20">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white/10 transition-all text-white font-medium"
          title={playing ? "Pause Intro Video" : "Play Intro Video"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span className="hidden sm:inline">{playing ? "Pause" : "Play"}</span>
        </button>

        <span className="w-px h-3.5 bg-white/15" />

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white/10 transition-all text-white font-medium"
          title={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
          <span className="hidden sm:inline">{muted ? "Unmute" : "Muted"}</span>
        </button>

        <span className="w-px h-3.5 bg-white/15" />

        {/* Replay Hinge Open Animation */}
        <button
          onClick={replayOpenAnimation}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white/10 transition-all text-purple-300 font-medium hover:text-white"
          title="Re-run opening animation"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span className="hidden md:inline">Re-Open</span>
        </button>

        {/* Intro Video Status Pill */}
        <div className="flex items-center gap-1.5 pl-1.5 text-[10px] text-zinc-400 font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-purple-500"}`} />
          <span>Intro 4K</span>
        </div>
      </div>

      {/* Discreet Video Progress Track */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
