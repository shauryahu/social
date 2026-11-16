"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";

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
    screenMesh: THREE.Mesh | null;
    screenMaterial: THREE.MeshBasicMaterial | null;
    screenLight: THREE.PointLight | null;
    videoTexture: THREE.VideoTexture | null;
    animId: number | null;
    currentOpen: number; // 0 to 1
    targetOpen: number; // 0 to 1
    entranceT: number;
    mouse: { x: number; y: number; targetX: number; targetY: number };
    isVisible: boolean;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    lidGroup: null,
    laptopRoot: null,
    screenMesh: null,
    screenMaterial: null,
    screenLight: null,
    videoTexture: null,
    animId: null,
    currentOpen: 0,
    targetOpen: 0,
    entranceT: 0,
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
        videoRef.current.play().then(() => setPlaying(true)).catch(() => { });
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════════════════
  // 1. PROCEDURAL 4K TEXTURE GENERATORS (APPLE MACBOOK PRO HIGH-FIDELITY DETAILS)
  // ══════════════════════════════════════════════════════════════════════════════

  // A. Top Case Texture: Magic Keyboard with backlit keycaps, Touch ID, speaker grilles & Force Touch trackpad
  const createTopCaseTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Base Space Grey Anodized Aluminum with subtle brushed sheen
    const baseGrad = ctx.createLinearGradient(0, 0, 2048, 1400);
    baseGrad.addColorStop(0, "#23242c");
    baseGrad.addColorStop(0.5, "#1e1f26");
    baseGrad.addColorStop(1, "#181920");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 2048, 1400);

    // Subtle edge highlight border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 2040, 1392);

    // 2. Keyboard Well (Deep black recessed tray with rounded corners)
    const kwX = 260,
      kwY = 80,
      kwW = 1528,
      kwH = 680,
      kwR = 24;
    ctx.fillStyle = "#090a0e";
    ctx.beginPath();
    ctx.roundRect(kwX, kwY, kwW, kwH, kwR);
    ctx.fill();

    // Inner shadow on keyboard well
    ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // 3. Apple Magic Keyboard (6 rows of individual chiclet keys)
    const keyRows = [
      // Row 0: Function Keys
      [
        { label: "esc", w: 1.5 },
        { label: "F1", w: 1 },
        { label: "F2", w: 1 },
        { label: "F3", w: 1 },
        { label: "F4", w: 1 },
        { label: "F5", w: 1 },
        { label: "F6", w: 1 },
        { label: "F7", w: 1 },
        { label: "F8", w: 1 },
        { label: "F9", w: 1 },
        { label: "F10", w: 1 },
        { label: "F11", w: 1 },
        { label: "F12", w: 1 },
        { label: "touchID", w: 1.5 },
      ],
      // Row 1: Numbers
      [
        { label: "~", w: 1 },
        { label: "1", w: 1 },
        { label: "2", w: 1 },
        { label: "3", w: 1 },
        { label: "4", w: 1 },
        { label: "5", w: 1 },
        { label: "6", w: 1 },
        { label: "7", w: 1 },
        { label: "8", w: 1 },
        { label: "9", w: 1 },
        { label: "0", w: 1 },
        { label: "-", w: 1 },
        { label: "=", w: 1 },
        { label: "delete", w: 1.6 },
      ],
      // Row 2: QWERTY
      [
        { label: "tab", w: 1.6 },
        { label: "Q", w: 1 },
        { label: "W", w: 1 },
        { label: "E", w: 1 },
        { label: "R", w: 1 },
        { label: "T", w: 1 },
        { label: "Y", w: 1 },
        { label: "U", w: 1 },
        { label: "I", w: 1 },
        { label: "O", w: 1 },
        { label: "P", w: 1 },
        { label: "[", w: 1 },
        { label: "]", w: 1 },
        { label: "\\", w: 1 },
      ],
      // Row 3: Home row
      [
        { label: "caps lock", w: 1.8 },
        { label: "A", w: 1 },
        { label: "S", w: 1 },
        { label: "D", w: 1 },
        { label: "F", w: 1 },
        { label: "G", w: 1 },
        { label: "H", w: 1 },
        { label: "J", w: 1 },
        { label: "K", w: 1 },
        { label: "L", w: 1 },
        { label: ";", w: 1 },
        { label: "'", w: 1 },
        { label: "return", w: 1.8 },
      ],
      // Row 4: Shift row
      [
        { label: "shift", w: 2.3 },
        { label: "Z", w: 1 },
        { label: "X", w: 1 },
        { label: "C", w: 1 },
        { label: "V", w: 1 },
        { label: "B", w: 1 },
        { label: "N", w: 1 },
        { label: "M", w: 1 },
        { label: "<", w: 1 },
        { label: ">", w: 1 },
        { label: "?", w: 1 },
        { label: "shift", w: 2.3 },
      ],
      // Row 5: Bottom Modifier Row
      [
        { label: "fn", w: 1 },
        { label: "control", w: 1.1 },
        { label: "option", w: 1.2 },
        { label: "command ⌘", w: 1.4 },
        { label: "", w: 5.4 }, // Spacebar
        { label: "command ⌘", w: 1.4 },
        { label: "option", w: 1.2 },
        { label: "◀", w: 0.9 },
        { label: "▲▼", w: 0.9 },
        { label: "▶", w: 0.9 },
      ],
    ];

    const baseKeyH = 92;
    const keyGap = 12;
    let curY = kwY + 18;

    keyRows.forEach((row, rIdx) => {
      const rowKeyH = rIdx === 0 ? 64 : baseKeyH;
      const totalUnits = row.reduce((acc, k) => acc + k.w, 0);
      const availW = kwW - 36 - (row.length - 1) * keyGap;
      const unitW = availW / totalUnits;
      let curX = kwX + 18;

      row.forEach((key) => {
        const keyW = key.w * unitW;

        // Keycap background with subtle gradient
        const keyGrad = ctx.createLinearGradient(curX, curY, curX, curY + rowKeyH);
        keyGrad.addColorStop(0, "#191a22");
        keyGrad.addColorStop(1, "#101117");
        ctx.fillStyle = keyGrad;
        ctx.beginPath();
        ctx.roundRect(curX, curY, keyW, rowKeyH, 8);
        ctx.fill();

        // Subtle keycap bevel reflection
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Key legends
        if (key.label === "touchID") {
          // Touch ID button tactile ring
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(curX + keyW / 2, curY + rowKeyH / 2, 22, 0, Math.PI * 2);
          ctx.stroke();
        } else if (key.label) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
          ctx.font = rIdx === 0 ? "500 16px -apple-system, sans-serif" : "600 22px -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(key.label, curX + keyW / 2, curY + rowKeyH / 2);
        }

        curX += keyW + keyGap;
      });

      curY += rowKeyH + keyGap;
    });

    // 4. Acoustic Laser-Drilled Speaker Grilles (Left & Right of Keyboard)
    const drawSpeakerGrill = (startX: number) => {
      ctx.fillStyle = "rgba(8, 9, 13, 0.95)";
      const cols = 12;
      const dotSpacing = 14;
      const startY = kwY + 30;
      const rows = 46;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = startX + c * dotSpacing;
          const dy = startY + r * dotSpacing;
          ctx.beginPath();
          ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    drawSpeakerGrill(60); // Left speaker
    drawSpeakerGrill(kwX + kwW + 36); // Right speaker

    // 5. Massive Force Touch Glass Trackpad
    const tpW = 740,
      tpH = 500,
      tpX = 1024 - tpW / 2,
      tpY = kwY + kwH + 42;

    const tpGrad = ctx.createLinearGradient(tpX, tpY, tpX, tpY + tpH);
    tpGrad.addColorStop(0, "#22232c");
    tpGrad.addColorStop(1, "#1a1b22");
    ctx.fillStyle = tpGrad;
    ctx.beginPath();
    ctx.roundRect(tpX, tpY, tpW, tpH, 16);
    ctx.fill();

    // Micro-etched trackpad perimeter border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 6. Display thumb opening scoop shadow on front edge
    const scoopW = 240,
      scoopH = 18,
      scoopX = 1024 - scoopW / 2,
      scoopY = 1382;
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.beginPath();
    ctx.roundRect(scoopX, scoopY, scoopW, scoopH, [10, 10, 0, 0]);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // B. Display Bezel Texture: Ultra-thin bezels, rounded top corners, camera notch & FaceTime HD lens
  const createBezelTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Deep black display glass border
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, 2048, 1320);

    // Inner active screen aperture with rounded corners (matches Liquid Retina XDR)
    ctx.clearRect(40, 40, 1968, 1240);

    // Redraw the iconic Apple Camera Notch at top center
    const notchW = 240,
      notchH = 48;
    const notchX = 1024 - notchW / 2;
    ctx.fillStyle = "#050608";
    ctx.beginPath();
    ctx.roundRect(notchX, 40, notchW, notchH, [0, 0, 16, 16]);
    ctx.fill();

    // Camera lens with blue anti-reflective glass coating
    ctx.fillStyle = "#08102a";
    ctx.beginPath();
    ctx.arc(1024, 64, 10, 0, Math.PI * 2);
    ctx.fill();

    // Blue specular reflection dot
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(1026, 62, 3, 0, Math.PI * 2);
    ctx.fill();

    // Green camera active indicator LED dot
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(1054, 64, 2.5, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // C. Apple Logo Texture for Outer Lid
  const createLidBackTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Metallic Space Grey aluminum
    const grad = ctx.createLinearGradient(0, 0, 1024, 700);
    grad.addColorStop(0, "#2a2b34");
    grad.addColorStop(0.5, "#22232a");
    grad.addColorStop(1, "#1c1d24");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 700);

    // Mirror-finish Apple Logo icon
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "300 90px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("", 512, 350);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // 2. THREE.JS 3D SCENE SETUP & PHYSICAL UNIBODY GEOMETRY
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    const s = sceneState.current;

    // Video Element
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

      if (s.screenMaterial) {
        s.screenMaterial.map = videoTexture;
        s.screenMaterial.needsUpdate = true;
      }
    });

    video.play().catch(() => { });
    videoRef.current = video;

    // Canvas size
    const width = container.clientWidth || 920;
    const height = container.clientHeight || 580;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.4);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── Apple Studio Key, Fill & Rim Lights ──
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(-5, 4, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.4);
    fillLight.position.set(5, 3, -1);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x0e111a, 1.8);
    scene.add(ambientLight);

    // Dynamic keyboard radiance point light from active screen
    const screenLight = new THREE.PointLight(0x38bdf8, 0, 5.0, 2.0);
    screenLight.position.set(0, 0.7, 0.1);
    scene.add(screenLight);

    // ── Laptop Root Group ──
    const laptopRoot = new THREE.Group();
    // Tilt slightly forward to showcase the top case keyboard & screen in Apple intro perspective
    laptopRoot.rotation.x = 0.18;
    scene.add(laptopRoot);

    // Physical dimensions (MacBook Pro 16″ aspect ratio)
    const baseW = 2.85;
    const baseD = 1.94;
    const baseH = 0.055;

    // Materials
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1e26,
      metalness: 0.86,
      roughness: 0.22,
    });

    const topCaseTexture = createTopCaseTexture();
    const topCaseMaterial = new THREE.MeshStandardMaterial({
      map: topCaseTexture,
      metalness: 0.75,
      roughness: 0.28,
    });

    // ── 1. Base Assembly ──
    const baseGroup = new THREE.Group();
    laptopRoot.add(baseGroup);

    // Unibody lower chassis
    const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    const baseMesh = new THREE.Mesh(baseGeo, aluminumMaterial);
    baseMesh.position.set(0, baseH / 2, baseD / 2);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseGroup.add(baseMesh);

    // Top case surface (Keyboard, speaker grilles, trackpad)
    const topPlateGeo = new THREE.PlaneGeometry(baseW - 0.02, baseD - 0.02);
    const topPlateMesh = new THREE.Mesh(topPlateGeo, topCaseMaterial);
    topPlateMesh.rotation.x = -Math.PI / 2;
    topPlateMesh.position.set(0, baseH + 0.001, baseD / 2);
    baseGroup.add(topPlateMesh);

    // Precision rubber feet on bottom
    const footMat = new THREE.MeshStandardMaterial({ color: 0x0c0d12, roughness: 0.8 });
    const footGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.015, 16);
    const footOffsets = [
      [-baseW / 2 + 0.18, 0.18],
      [baseW / 2 - 0.18, 0.18],
      [-baseW / 2 + 0.18, baseD - 0.18],
      [baseW / 2 - 0.18, baseD - 0.18],
    ];
    footOffsets.forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx, -0.0075, fz);
      baseGroup.add(foot);
    });

    // Display thumb scoop notch on front lip
    const scoopGeo = new THREE.BoxGeometry(0.38, 0.02, 0.03);
    const scoopMat = new THREE.MeshStandardMaterial({ color: 0x0f1016, roughness: 0.5 });
    const scoopMesh = new THREE.Mesh(scoopGeo, scoopMat);
    scoopMesh.position.set(0, baseH - 0.005, baseD - 0.005);
    baseGroup.add(scoopMesh);

    // Hinge Pivot Cylinder along back edge
    const hingeGeo = new THREE.CylinderGeometry(0.028, 0.028, 2.2, 32);
    const hingeMat = new THREE.MeshStandardMaterial({ color: 0x12131a, metalness: 0.9, roughness: 0.3 });
    const hinge = new THREE.Mesh(hingeGeo, hingeMat);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, baseH, 0);
    baseGroup.add(hinge);

    // ── 2. Articulated Lid Assembly (Liquid Retina XDR Screen) ──
    const lidGroup = new THREE.Group();
    // Pivot sits exactly on the back hinge line
    lidGroup.position.set(0, baseH, 0);
    laptopRoot.add(lidGroup);

    const lidW = baseW;
    const lidH = baseD;
    const lidThickness = 0.038;

    // Lid Back Plate (Outer aluminum shell with Apple logo)
    const lidBackTex = createLidBackTexture();
    const lidBackMat = new THREE.MeshStandardMaterial({
      map: lidBackTex,
      metalness: 0.88,
      roughness: 0.24,
    });
    const lidBackGeo = new THREE.BoxGeometry(lidW, lidThickness, lidH);
    const lidBackMesh = new THREE.Mesh(lidBackGeo, aluminumMaterial);
    lidBackMesh.position.set(0, lidThickness / 2, lidH / 2);
    lidBackMesh.castShadow = true;
    lidGroup.add(lidBackMesh);

    // Outer lid logo plate
    const logoPlateGeo = new THREE.PlaneGeometry(lidW - 0.01, lidH - 0.01);
    const logoPlateMesh = new THREE.Mesh(logoPlateGeo, lidBackMat);
    logoPlateMesh.rotation.x = Math.PI / 2;
    logoPlateMesh.position.set(0, lidThickness + 0.001, lidH / 2);
    lidGroup.add(logoPlateMesh);

    // Display Screen Glass with /videos/intro.mp4 Texture
    const screenW = lidW - 0.16;
    const screenH = lidH - 0.14;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    const screenMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.rotation.x = -Math.PI / 2;
    screenMesh.position.set(0, -0.001, lidH / 2);
    lidGroup.add(screenMesh);

    // Display Bezel with Notch Overlay
    const bezelTex = createBezelTexture();
    const bezelMat = new THREE.MeshBasicMaterial({
      map: bezelTex,
      transparent: true,
      opacity: 0.98,
    });
    const bezelMesh = new THREE.Mesh(screenGeo, bezelMat);
    bezelMesh.rotation.x = -Math.PI / 2;
    bezelMesh.position.set(0, -0.002, lidH / 2);
    lidGroup.add(bezelMesh);

    // ── 3. Floor Shadow & Specular Contact Plane ──
    const shadowGeo = new THREE.PlaneGeometry(6, 4.5);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(256, 256, 30, 256, 256, 240);
      sGrad.addColorStop(0, "rgba(0,0,0,0.48)");
      sGrad.addColorStop(0.5, "rgba(0,0,0,0.18)");
      sGrad.addColorStop(1, "transparent");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 512, 512);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.015, baseD / 2);
    scene.add(shadowMesh);

    // Store state in ref
    s.renderer = renderer;
    s.scene = scene;
    s.camera = camera;
    s.lidGroup = lidGroup;
    s.laptopRoot = laptopRoot;
    s.screenMesh = screenMesh;
    s.screenMaterial = screenMaterial;
    s.screenLight = screenLight;

    // ══════════════════════════════════════════════════════════════════════════════
    // 3. KINEMATIC MOTION ENGINE (INITIAL OPENING & SCROLL-SYNCHRONIZATION)
    // ══════════════════════════════════════════════════════════════════════════════

    const updateScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Start opening as laptop enters viewport (85% height)
      // Reaches full presentation viewing angle at 35% height
      const startOpen = windowH * 0.9;
      const fullyOpen = windowH * 0.35;
      const startClose = windowH * 0.05;
      const fullyClosed = -rect.height * 0.6;

      let p = 0;
      if (rect.top > fullyOpen) {
        p = (startOpen - rect.top) / (startOpen - fullyOpen);
      } else if (rect.top >= startClose) {
        p = 1;
      } else {
        p = (rect.top - fullyClosed) / (startClose - fullyClosed);
      }

      const clamped = Math.max(0, Math.min(1, p));
      s.targetOpen = clamped;
      setScrollProgressDisplay(Math.round(clamped * 100));

      if (videoRef.current && clamped > 0.1 && videoRef.current.paused && playing) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Mouse Parallax
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      s.mouse.targetX = x * 0.28;
      s.mouse.targetY = y * 0.16;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Resize
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

    // Visibility Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        s.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    // ── 120Hz Animation Loop with Damped Hermite Curves ──
    let lastTime = performance.now();

    const animate = (time: number) => {
      s.animId = requestAnimationFrame(animate);
      if (!s.isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Entrance opening speed ramp
      if (s.entranceT < 1) {
        s.entranceT += dt * 0.8;
      }

      // Combine entrance sequence with scroll-driven position
      const effectiveTarget = s.entranceT * s.targetOpen;
      s.currentOpen += (effectiveTarget - s.currentOpen) * (dt * 4.5);

      // Apple MacBook Pro Opening Angle: from 0 rad (closed flat) to -1.86 rad (-106° open)
      const maxAngle = 1.86;
      if (s.lidGroup) {
        s.lidGroup.rotation.x = -s.currentOpen * maxAngle;
      }

      // Dynamic keyboard screen radiance illumination
      if (s.screenLight) {
        const glowFactor = Math.max((s.currentOpen - 0.2) / 0.8, 0);
        s.screenLight.intensity = glowFactor * 4.2;
      }

      // Elevation & Framing: As lid opens, camera smoothly reframes the Liquid Retina screen
      const targetCamY = 1.1 + s.currentOpen * 0.35;
      const targetCamZ = 4.2 + s.currentOpen * 0.45;
      camera.position.y += (targetCamY - camera.position.y) * (dt * 3.2);
      camera.position.z += (targetCamZ - camera.position.z) * (dt * 3.2);

      // Mouse Parallax 3D Gyro
      s.mouse.x += (s.mouse.targetX - s.mouse.x) * (dt * 4.0);
      s.mouse.y += (s.mouse.targetY - s.mouse.y) * (dt * 4.0);

      laptopRoot.rotation.y = s.mouse.x * 0.45;
      laptopRoot.rotation.x = 0.18 - s.mouse.y * 0.28;

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
      topCaseTexture?.dispose();
      bezelTex?.dispose();
      lidBackTex?.dispose();
      shadowTex.dispose();

      baseGeo.dispose();
      topPlateGeo.dispose();
      footGeo.dispose();
      scoopGeo.dispose();
      hingeGeo.dispose();
      lidBackGeo.dispose();
      logoPlateGeo.dispose();
      screenGeo.dispose();
      shadowGeo.dispose();

      aluminumMaterial.dispose();
      topCaseMaterial.dispose();
      footMat.dispose();
      scoopMat.dispose();
      hingeMat.dispose();
      lidBackMat.dispose();
      screenMaterial.dispose();
      bezelMat.dispose();
      shadowMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [playing]);

  return (
    <div ref={sectionRef} className={`relative w-full max-w-5xl mx-auto py-6 sm:py-10 px-2 sm:px-4 ${className}`}>
      {/* ── Status & Open Progress Indicator Strip ── */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-3 px-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-medium">
            MacBook Pro 16″ Liquid Retina XDR · Apple Keynote Engine
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-zinc-500">Lid Open:</span>
          <span className="text-cyan-500 dark:text-cyan-400 font-bold tabular-nums">
            {scrollProgressDisplay}%
          </span>
        </div>
      </div>

      {/* ── 3D WebGL Canvas Container ── */}
      <div
        ref={containerRef}
        className="w-full h-[460px] sm:h-[540px] md:h-[620px] lg:h-[680px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
      />

      {/* ── Studio Glass Controls Bar ── */}
      <div className="mt-3 flex items-center justify-between gap-3 px-5 py-2.5 rounded-full bg-slate-900/80 dark:bg-[#10121C]/80 backdrop-blur-xl border border-white/10 shadow-xl text-xs max-w-md mx-auto">
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
          <span>{videoLoaded ? "4K Video Active" : "Liquid Retina XDR"}</span>
        </div>
      </div>
    </div>
  );
}
