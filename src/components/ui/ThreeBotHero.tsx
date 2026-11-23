"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

export interface LogoConfig {
  id: string;
  name: string;
  file: string;
  ring: 1 | 2;
  angleOffset: number; // in radians
  description: string;
}

export const OFFICIAL_LOGOS: LogoConfig[] = [
  // Ring 1 (Radius ~2.15, tilted +18° X, +10° Z, clockwise)
  {
    id: "instagram",
    name: "Instagram",
    file: "/assets/logos/instagram.png",
    ring: 1,
    angleOffset: 0,
    description: "Visual Storytelling & Reels",
  },
  {
    id: "tiktok",
    name: "TikTok",
    file: "/assets/logos/tiktok.png",
    ring: 1,
    angleOffset: (Math.PI * 2) / 4,
    description: "Viral Short-Form Video",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    file: "/assets/logos/whatsapp.png",
    ring: 1,
    angleOffset: (Math.PI * 2 * 2) / 4,
    description: "Direct High-Value Messaging",
  },
  {
    id: "x",
    name: "X (Twitter)",
    file: "/assets/logos/x.png",
    ring: 1,
    angleOffset: (Math.PI * 2 * 3) / 4,
    description: "Real-Time Trend Distribution",
  },

  // Ring 2 (Radius ~2.48, tilted -16° X, -10° Z, counter-clockwise)
  {
    id: "facebook",
    name: "Facebook",
    file: "/assets/logos/facebook.png",
    ring: 2,
    angleOffset: 0,
    description: "Precision Community Targeting",
  },
  {
    id: "youtube",
    name: "YouTube",
    file: "/assets/logos/youtube.png",
    ring: 2,
    angleOffset: (Math.PI * 2) / 3,
    description: "Long-Form Video Authority",
  },
  {
    id: "onlyfans",
    name: "OnlyFans",
    file: "/assets/logos/onlyfans.png",
    ring: 2,
    angleOffset: (Math.PI * 2 * 2) / 3,
    description: "Premium Creator Monetization",
  },
];

export interface ThreeBotHeroProps {
  glbPath?: string; // Optional custom GLB file path (default: procedural mascot)
  className?: string;
}

interface EyeState {
  blinkProgress: number; // 0 = open, 1 = closed
  winkProgress: number;  // 0 = normal slit, 1 = happy wink arc
  blushOpacity: number;  // 0 = none, 1 = full pink blush
  lookX: number;         // -1 to 1 horizontal glance
  lookY: number;         // -1 to 1 vertical glance
}

interface BotRig {
  root: THREE.Group;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArmPivot: THREE.Group;
  rightArm: THREE.Group;
  visorMesh: THREE.Mesh;
  visorCanvas: HTMLCanvasElement;
  visorTexture: THREE.CanvasTexture;
  updateVisor: (eyeState: EyeState) => void;
  clickableMeshes: THREE.Object3D[];
}

interface LogoTileRig {
  group: THREE.Group;
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  config: LogoConfig;
  targetScale: number;
  currentScale: number;
  isHovered: boolean;
  introProgress: number;
}

interface HeartParticle {
  mesh: THREE.Mesh;
  startTime: number;
  life: number;
  startX: number;
  startY: number;
  startZ: number;
  driftX: number;
  driftZ: number;
  scale: number;
}

// Check WebGL availability
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}

// ============================================================================
// VISOR TEXTURE GENERATOR (OBSIDIAN GLASS, SCANLINE EYES, BLUSH)
// ============================================================================

function createVisorCanvas(): { canvas: HTMLCanvasElement; update: (state: EyeState) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  function drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function update(state: EyeState) {
    ctx.clearRect(0, 0, 512, 512);

    // 1. Dark obsidian visor background squircle
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, "#080912");
    bgGrad.addColorStop(0.5, "#0a0b16");
    bgGrad.addColorStop(1, "#121422");
    ctx.fillStyle = bgGrad;

    // Rounded squircle container covering center of visor
    drawRoundedRect(28, 28, 456, 456, 78);
    ctx.fill();

    // 2. Glossy glass specular arc reflection across upper visor
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(28, 28, 456, 456, 78);
    ctx.clip();

    const glassGrad = ctx.createLinearGradient(120, 28, 420, 320);
    glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.24)");
    glassGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.06)");
    glassGrad.addColorStop(0.7, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glassGrad;
    ctx.fillRect(28, 28, 456, 456);
    ctx.restore();

    // Eye glance offsets
    const glanceX = state.lookX * 18;
    const glanceY = state.lookY * 12;

    // 3. Cheeks: Soft pink glowing blush circles on tap interaction
    if (state.blushOpacity > 0.02) {
      ctx.save();
      ctx.globalAlpha = state.blushOpacity * 0.85;
      const leftBlush = ctx.createRadialGradient(142 + glanceX * 0.5, 335, 0, 142 + glanceX * 0.5, 335, 44);
      leftBlush.addColorStop(0, "rgba(244, 114, 182, 0.95)");
      leftBlush.addColorStop(0.6, "rgba(244, 114, 182, 0.45)");
      leftBlush.addColorStop(1, "rgba(244, 114, 182, 0)");
      ctx.fillStyle = leftBlush;
      ctx.beginPath();
      ctx.arc(142 + glanceX * 0.5, 335, 44, 0, Math.PI * 2);
      ctx.fill();

      const rightBlush = ctx.createRadialGradient(370 + glanceX * 0.5, 335, 0, 370 + glanceX * 0.5, 335, 44);
      rightBlush.addColorStop(0, "rgba(244, 114, 182, 0.95)");
      rightBlush.addColorStop(0.6, "rgba(244, 114, 182, 0.45)");
      rightBlush.addColorStop(1, "rgba(244, 114, 182, 0)");
      ctx.fillStyle = rightBlush;
      ctx.beginPath();
      ctx.arc(370 + glanceX * 0.5, 335, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Glow filter for digital LED eyes
    ctx.shadowColor = "#C084FC";
    ctx.shadowBlur = 24;

    const eyeScaleY = Math.max(0.08, 1 - state.blinkProgress * 0.94);

    // ------------------------------------------------------------------------
    // 4. LEFT EYE (Character's Right, Viewer's Left):
    //    Rounded square with glowing horizontal scanline bars
    // ------------------------------------------------------------------------
    ctx.save();
    const leftEyeX = 186 + glanceX;
    const leftEyeY = 220 + glanceY;
    const leftEyeW = 76;
    const leftEyeH = 76 * eyeScaleY;

    ctx.translate(leftEyeX, leftEyeY);
    const leftGrad = ctx.createLinearGradient(0, -leftEyeH / 2, 0, leftEyeH / 2);
    leftGrad.addColorStop(0, "#F5E8FF");
    leftGrad.addColorStop(0.5, "#D8B4FE");
    leftGrad.addColorStop(1, "#A855F7");
    ctx.fillStyle = leftGrad;

    drawRoundedRect(-leftEyeW / 2, -leftEyeH / 2, leftEyeW, leftEyeH, 20);
    ctx.fill();

    // Horizontal scanline mask across left eye
    ctx.fillStyle = "rgba(8, 9, 18, 0.65)";
    for (let sy = -leftEyeH / 2 + 3; sy < leftEyeH / 2; sy += 7) {
      ctx.fillRect(-leftEyeW / 2 - 2, sy, leftEyeW + 4, 2.6);
    }
    ctx.restore();

    // ------------------------------------------------------------------------
    // 5. RIGHT EYE (Character's Left, Viewer's Right):
    //    Horizontal bar slit (normal) OR Happy Wink Arc on tap
    // ------------------------------------------------------------------------
    ctx.save();
    const rightEyeX = 338 + glanceX;
    const rightEyeY = 230 + glanceY;

    ctx.translate(rightEyeX, rightEyeY);

    if (state.winkProgress < 0.08) {
      // Resting State: Horizontal glowing slit matching reference image
      const rightEyeW = 80;
      const rightEyeH = 25 * eyeScaleY;
      const rightGrad = ctx.createLinearGradient(0, -rightEyeH / 2, 0, rightEyeH / 2);
      rightGrad.addColorStop(0, "#F5E8FF");
      rightGrad.addColorStop(0.5, "#D8B4FE");
      rightGrad.addColorStop(1, "#A855F7");
      ctx.fillStyle = rightGrad;

      drawRoundedRect(-rightEyeW / 2, -rightEyeH / 2, rightEyeW, rightEyeH, 12);
      ctx.fill();

      // Horizontal scanlines across right eye
      ctx.fillStyle = "rgba(8, 9, 18, 0.65)";
      for (let sy = -rightEyeH / 2 + 2; sy < rightEyeH / 2; sy += 6) {
        ctx.fillRect(-rightEyeW / 2 - 2, sy, rightEyeW + 4, 2.2);
      }
    } else {
      // Tap Interaction: Happy upward-curving wink arc
      const wP = state.winkProgress;
      ctx.strokeStyle = "#F5E8FF";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.shadowColor = "#C084FC";
      ctx.shadowBlur = 26;

      ctx.beginPath();
      ctx.moveTo(-35, 4 * (1 - wP));
      ctx.quadraticCurveTo(0, -25 * wP, 35, 4 * (1 - wP));
      ctx.stroke();

      ctx.strokeStyle = "#D8B4FE";
      ctx.lineWidth = 8;
      ctx.stroke();
    }
    ctx.restore();

    // ------------------------------------------------------------------------
    // 6. MOUTH: Cute smiling horizontal line/arc with scanlines
    // ------------------------------------------------------------------------
    ctx.save();
    const mouthX = 260 + glanceX * 0.6;
    const mouthY = 295 + glanceY * 0.6;
    ctx.translate(mouthX, mouthY);

    const mouthW = 60;
    const mouthH = 22;
    const mouthGrad = ctx.createLinearGradient(0, 0, 0, mouthH);
    mouthGrad.addColorStop(0, "#F5E8FF");
    mouthGrad.addColorStop(1, "#A855F7");
    ctx.fillStyle = mouthGrad;

    ctx.beginPath();
    ctx.moveTo(-mouthW / 2, 0);
    ctx.quadraticCurveTo(0, mouthH * 1.3, mouthW / 2, 0);
    ctx.closePath();
    ctx.fill();

    // Horizontal scanlines on mouth
    ctx.fillStyle = "rgba(8, 9, 18, 0.65)";
    for (let my = 2; my < mouthH; my += 5) {
      ctx.fillRect(-mouthW / 2 - 2, my, mouthW + 4, 2.0);
    }
    ctx.restore();
  }

  // Initial draw
  update({
    blinkProgress: 0,
    winkProgress: 0,
    blushOpacity: 0,
    lookX: 0,
    lookY: 0,
  });

  return { canvas, update };
}

// ============================================================================
// SOCIALASSIST PURPLE "S" EMBLEM BADGE GENERATOR
// ============================================================================

function createBadgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 256, 256);

  // Rounded Hexagon / Shield Shape
  const cx = 128, cy = 128, r = 96;
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Purple gradient fill
  const grad = ctx.createLinearGradient(64, 40, 192, 216);
  grad.addColorStop(0, "#8B5CF6");
  grad.addColorStop(0.5, "#7C3AED");
  grad.addColorStop(1, "#6D28D9");
  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(139, 92, 246, 0.75)";
  ctx.shadowBlur = 18;
  ctx.fill();

  // Subtle metallic rim border
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(233, 213, 255, 0.65)";
  ctx.stroke();

  // White "S" monogram inside hexagon
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 114px Inter, system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", cx, cy + 6);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ============================================================================
// CONVEX VISOR DOME GEOMETRY
// ============================================================================

function createCurvedVisorGeometry(): THREE.BufferGeometry {
  const width = 1.36;
  const height = 1.02;
  const segmentsX = 48;
  const segmentsY = 36;
  const geom = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Smooth convex dome: center pushes forward (+Z), edges curve back (-Z)
    const normX = x / (width * 0.5);
    const normY = y / (height * 0.5);
    const cosX = Math.cos(normX * Math.PI * 0.48);
    const cosY = Math.cos(normY * Math.PI * 0.48);
    const curveZ = cosX * cosY * 0.24 - 0.08;
    pos.setZ(i, curveZ);
  }
  geom.computeVertexNormals();
  return geom;
}

// ============================================================================
// 3D MODEL BUILDER & LOADER
// ============================================================================

async function loadOrBuildBotModel(
  scene: THREE.Scene,
  glbPath?: string
): Promise<BotRig> {
  // If GLB path provided, attempt to load it seamlessly
  if (glbPath) {
    try {
      const loader = new GLTFLoader();
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(glbPath, resolve, undefined, reject);
      });
      const root = gltf.scene as THREE.Group;
      scene.add(root);

      const head = (root.getObjectByName("Head") as THREE.Group) || root;
      const leftArm = (root.getObjectByName("LeftArm") as THREE.Group) || root;
      const rightArmPivot = (root.getObjectByName("RightArmPivot") as THREE.Group) || new THREE.Group();
      const rightArm = (root.getObjectByName("RightArm") as THREE.Group) || root;
      const visorMesh = (root.getObjectByName("Visor") as THREE.Mesh) || new THREE.Mesh();

      const { canvas, update } = createVisorCanvas();
      const visorTexture = new THREE.CanvasTexture(canvas);
      visorTexture.colorSpace = THREE.SRGBColorSpace;

      const clickableMeshes: THREE.Object3D[] = [];
      root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) clickableMeshes.push(obj);
      });

      return {
        root,
        head,
        leftArm,
        rightArmPivot,
        rightArm,
        visorMesh,
        visorCanvas: canvas,
        visorTexture,
        updateVisor: (st) => {
          update(st);
          visorTexture.needsUpdate = true;
        },
        clickableMeshes,
      };
    } catch {
      console.warn("Could not load GLB model at", glbPath, "falling back to high-detail procedural 3D mascot.");
    }
  }

  // --------------------------------------------------------------------------
  // PROCEDURAL 3D BOT MASCOT (100% Matching bot-front.png / Uploaded Reference)
  // --------------------------------------------------------------------------
  const root = new THREE.Group();
  root.position.set(0, 0.12, 0);

  // 1. High-Detail PBR Materials
  // Premium Glossy White Clearcoat Shell (Apple hardware ceramic aesthetic)
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.95,
  });

  // Brushed Graphite Metallic Bezel
  const graphiteMat = new THREE.MeshStandardMaterial({
    color: 0x12141c,
    roughness: 0.45,
    metalness: 0.75,
  });

  // Visor Canvas Texture
  const { canvas, update } = createVisorCanvas();
  const visorTexture = new THREE.CanvasTexture(canvas);
  visorTexture.colorSpace = THREE.SRGBColorSpace;

  // Ultra-Smooth Obsidian Curved Glass Visor
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x05060b,
    emissiveMap: visorTexture,
    emissive: 0xffffff,
    emissiveIntensity: 1.35,
    roughness: 0.04,
    metalness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    transparent: true,
    depthWrite: true,
  });

  // 2. UNIFIED ROUNDED BODY / HEAD ORB
  // In the reference image, the bot is one single chubby white sphere
  const head = new THREE.Group();
  head.position.set(0, 0, 0);

  // Flatter in Z so front curves smoothly behind the visor
  const orbGeom = new THREE.SphereGeometry(0.92, 64, 48);
  orbGeom.scale(1.18, 1.0, 0.78);
  const orbMesh = new THREE.Mesh(orbGeom, shellMat);
  orbMesh.castShadow = true;
  orbMesh.receiveShadow = true;
  head.add(orbMesh);

  // 3. SEAMLESS CAT EARS (Standing up proud on top left and right)
  const earGeom = new THREE.ConeGeometry(0.26, 0.52, 32);
  earGeom.scale(1.0, 1.0, 0.72);

  // Left Ear
  const leftEarGroup = new THREE.Group();
  leftEarGroup.position.set(-0.48, 0.84, -0.04);
  leftEarGroup.rotation.set(-0.15, 0, 0.30);
  const leftEarMesh = new THREE.Mesh(earGeom, shellMat);
  leftEarGroup.add(leftEarMesh);
  head.add(leftEarGroup);

  // Right Ear
  const rightEarGroup = new THREE.Group();
  rightEarGroup.position.set(0.48, 0.84, -0.04);
  rightEarGroup.rotation.set(-0.15, 0, -0.30);
  const rightEarMesh = new THREE.Mesh(earGeom, shellMat);
  rightEarGroup.add(rightEarMesh);
  head.add(rightEarGroup);

  // 4. GRAPHITE RECESSED BEZEL FRAME
  const bezelGeom = createCurvedVisorGeometry();
  bezelGeom.scale(1.03, 1.03, 1.03);
  const bezelMesh = new THREE.Mesh(bezelGeom, graphiteMat);
  bezelMesh.position.set(0, 0.08, 0.63);
  head.add(bezelMesh);

  // 5. CURVED DARK GLASS VISOR SCREEN (Convex dome sitting proud on front)
  const visorGeom = createCurvedVisorGeometry();
  const visorMesh = new THREE.Mesh(visorGeom, visorMat);
  visorMesh.position.set(0, 0.08, 0.64);
  head.add(visorMesh);

  // 6. SOCIALASSIST PURPLE "S" CHEST / BELLY BADGE
  const badgeTex = createBadgeTexture();
  const badgeGeom = new THREE.PlaneGeometry(0.32, 0.32);
  const badgeMat = new THREE.MeshBasicMaterial({
    map: badgeTex,
    transparent: true,
    depthWrite: false,
  });
  const badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
  badgeMesh.position.set(0, -0.46, 0.72);
  badgeMesh.rotation.set(-0.22, 0, 0); // conforms to belly curvature
  head.add(badgeMesh);

  root.add(head);

  // 7. FLOATING CAPSULE ARMS (Rayman Style — Disconnected from body!)
  const armGeom = new THREE.CapsuleGeometry(0.17, 0.42, 16, 24);

  // Left Arm (Floating capsule at left side)
  const leftArm = new THREE.Group();
  leftArm.position.set(-1.12, -0.06, 0.04);
  leftArm.rotation.set(0.15, 0.10, 0.46);
  const leftArmMesh = new THREE.Mesh(armGeom, shellMat);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  root.add(leftArm);

  // Right Arm Pivot & Floating Capsule (Pivots up and waves on tap)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(1.12, -0.06, 0.04);

  const rightArm = new THREE.Group();
  rightArm.rotation.set(0.15, -0.10, -0.46);
  const rightArmMesh = new THREE.Mesh(armGeom, shellMat);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  rightArmPivot.add(rightArm);
  root.add(rightArmPivot);

  scene.add(root);

  // Gather all clickable meshes for raycasting
  const clickableMeshes: THREE.Object3D[] = [];
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      clickableMeshes.push(obj);
    }
  });

  return {
    root,
    head,
    leftArm,
    rightArmPivot,
    rightArm,
    visorMesh,
    visorCanvas: canvas,
    visorTexture,
    updateVisor: (st) => {
      update(st);
      visorTexture.needsUpdate = true;
    },
    clickableMeshes,
  };
}

// ============================================================================
// BILLBOARD FROSTED-GLASS LOGO TILE BUILDER
// ============================================================================

function createLogoTileTexture(config: LogoConfig): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  function drawRoundedTile() {
    ctx.clearRect(0, 0, 512, 512);

    // Frosted-Glass Tile Background
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
    bgGrad.addColorStop(0, "rgba(40, 42, 60, 0.94)");
    bgGrad.addColorStop(1, "rgba(18, 19, 30, 0.96)");
    ctx.fillStyle = bgGrad;

    const r = 92;
    ctx.beginPath();
    ctx.roundRect(24, 24, 464, 464, r);
    ctx.fill();

    // Fine Apple Glass Inner Border & Specular Rim Highlight
    ctx.lineWidth = 4;
    const rimGrad = ctx.createLinearGradient(0, 24, 0, 488);
    rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    rimGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.14)");
    rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.06)");
    ctx.strokeStyle = rimGrad;
    ctx.stroke();

    // Subtle diagonal glass reflection sheen
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(24, 24, 464, 464, r);
    ctx.clip();
    const sheenGrad = ctx.createLinearGradient(0, 0, 512, 512);
    sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    sheenGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.06)");
    sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(24, 24, 464, 464);
    ctx.restore();
  }

  drawRoundedTile();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Load official logo PNG
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    drawRoundedTile();
    const pad = 100;
    const size = 512 - pad * 2;
    ctx.drawImage(img, pad, pad, size, size);
    texture.needsUpdate = true;
  };
  img.onerror = () => {
    drawRoundedTile();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 56px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.name, 256, 256);
    texture.needsUpdate = true;
  };
  img.src = config.file;

  return texture;
}

// ============================================================================
// 3D FLOATING HEARTS FACTORY (For Tap / Wink Interaction)
// ============================================================================

function createHeartGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x + 0.12, y + 0.12);
  shape.bezierCurveTo(x + 0.12, y + 0.12, x + 0.10, y, x, y);
  shape.bezierCurveTo(x - 0.15, y, x - 0.15, y + 0.18, x - 0.15, y + 0.18);
  shape.bezierCurveTo(x - 0.15, y + 0.28, x - 0.05, y + 0.38, x + 0.12, y + 0.48);
  shape.bezierCurveTo(x + 0.30, y + 0.38, x + 0.40, y + 0.28, x + 0.40, y + 0.18);
  shape.bezierCurveTo(x + 0.40, y + 0.18, x + 0.40, y, x + 0.25, y);
  shape.bezierCurveTo(x + 0.18, y, x + 0.12, y + 0.12, x + 0.12, y + 0.12);

  const geom = new THREE.ShapeGeometry(shape);
  geom.center();
  geom.scale(0.85, 0.85, 0.85);
  return geom;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ThreeBotHero({ glbPath, className = "" }: ThreeBotHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<{ name: string; desc: string } | null>(null);

  // Interaction & Physics state
  const stateRef = useRef({
    // Pointer & Spring dynamics
    pointerX: 0,
    pointerY: 0,
    isPointerActive: false,
    lastPointerMoveTime: performance.now(),
    targetHeadYaw: 0,
    targetHeadPitch: 0,
    currentHeadYaw: 0,
    currentHeadPitch: 0,
    currentArmYaw: 0,

    // Orbit parameters (comfortably fit inside 450px container)
    orbitRadius1: 2.15,
    orbitRadius2: 2.48,
    ring1Speed: 0.36, // rad/s
    ring2Speed: -0.30,
    ring1Angle: 0,
    ring2Angle: 0,
    precessionAngle: 0,
    orbitSpeedMultiplier: 1.0,
    dragVelocityX: 0,
    isDragging: false,
    dragStartX: 0,

    // Natural Blink Timer
    nextBlinkTime: performance.now() + 2500,
    blinkStartTime: 0,
    isBlinking: false,

    // Flirty Wink / Wave / Blush Tap Reaction
    isReacting: false,
    reactionStartTime: 0,
    reactionDuration: 1.1, // 1.1s total

    // Intro Animation
    introStartTime: performance.now(),
    introDuration: 2.4, // 2.4s slow push-in
    isIntroActive: true,
    reducedMotion: false,

    // Hovered Logo
    hoveredLogoId: null as string | null,
  });

  // Initialize and mount Three.js Scene
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    if (!mountRef.current) return;
    const container = mountRef.current;

    // Check system prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    stateRef.current.reducedMotion = reducedMotionQuery.matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.15, 5.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 2. Custom Apple Studio Lighting & Crisp Specular Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (warm studio softbox from top-front-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(3.5, 4.2, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Left Studio Softbox (crisp white streak reflections across glossy shell)
    const leftSoftbox = new THREE.DirectionalLight(0xf1f5f9, 1.9);
    leftSoftbox.position.set(-4.0, 2.5, 2.5);
    scene.add(leftSoftbox);

    // Pink & Violet Rim Lights (matching SocialAssist brand aesthetics)
    const pinkRim = new THREE.DirectionalLight(0xec4899, 1.8);
    pinkRim.position.set(-3.0, 1.5, -3.5);
    scene.add(pinkRim);

    const violetRim = new THREE.DirectionalLight(0x8b5cf6, 2.0);
    violetRim.position.set(3.0, 1.8, -3.5);
    scene.add(violetRim);

    // Under-body pink levitation fill light
    const floorLight = new THREE.PointLight(0xd946ef, 1.4, 5);
    floorLight.position.set(0, -1.2, 0);
    scene.add(floorLight);

    // 3. Studio Floor: Soft Contact Shadow, Pink Glow, Concentric Light Rings
    const floorGroup = new THREE.Group();
    floorGroup.position.set(0, -1.35, 0);

    // Soft Contact Shadow Plane directly beneath bot
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d")!;
    const shadowGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.88)");
    shadowGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.35)");
    shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    sCtx.fillStyle = shadowGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    floorGroup.add(shadowPlane);

    // Floor Pink Levitation Glow Plane
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gCtx = glowCanvas.getContext("2d")!;
    const floorGlowGrad = gCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    floorGlowGrad.addColorStop(0, "rgba(236, 72, 153, 0.45)");
    floorGlowGrad.addColorStop(0.6, "rgba(168, 85, 247, 0.16)");
    floorGlowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    gCtx.fillStyle = floorGlowGrad;
    gCtx.fillRect(0, 0, 256, 256);

    const floorGlowTex = new THREE.CanvasTexture(glowCanvas);
    const floorGlowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({ map: floorGlowTex, transparent: true, opacity: 0.6, depthWrite: false })
    );
    floorGlowPlane.rotation.x = -Math.PI / 2;
    floorGlowPlane.position.y = 0.01;
    floorGroup.add(floorGlowPlane);

    // Concentric Thin Pink Light Rings on Floor
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });

    const ring1 = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.37, 64), ringMat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.02;
    floorGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.RingGeometry(2.1, 2.12, 64), ringMat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.02;
    floorGroup.add(ring2);

    scene.add(floorGroup);

    // 4. Load or Build 3D Bot Mascot
    let botRig: BotRig | null = null;
    loadOrBuildBotModel(scene, glbPath).then((rig) => {
      botRig = rig;
    });

    // 5. Build Orbiting Billboard Frosted-Glass Logo Tiles
    const logoTileRigs: LogoTileRig[] = [];
    const tileGeom = new THREE.PlaneGeometry(0.56, 0.56);

    OFFICIAL_LOGOS.forEach((cfg, idx) => {
      const tileTex = createLogoTileTexture(cfg);
      tileTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const tileMat = new THREE.MeshStandardMaterial({
        map: tileTex,
        transparent: true,
        roughness: 0.15,
        metalness: 0.1,
        depthWrite: true,
      });

      const tileMesh = new THREE.Mesh(tileGeom, tileMat);
      tileMesh.castShadow = true;

      const tileGroup = new THREE.Group();
      tileGroup.add(tileMesh);
      scene.add(tileGroup);

      logoTileRigs.push({
        group: tileGroup,
        mesh: tileMesh,
        material: tileMat,
        config: cfg,
        targetScale: 1.0,
        currentScale: 0.01,
        isHovered: false,
        introProgress: 0,
      });
    });

    // 6. Floating Hearts Particle System (for Tap Wink Reaction)
    const heartGeom = createHeartGeometry();
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    const activeHearts: HeartParticle[] = [];
    for (let i = 0; i < 6; i++) {
      const hMesh = new THREE.Mesh(heartGeom, heartMat.clone());
      hMesh.visible = false;
      scene.add(hMesh);
      activeHearts.push({
        mesh: hMesh,
        startTime: 0,
        life: 0,
        startX: 0,
        startY: 0,
        startZ: 0,
        driftX: (Math.random() - 0.5) * 0.4,
        driftZ: (Math.random() - 0.5) * 0.3,
        scale: 0.6 + Math.random() * 0.4,
      });
    }

    // Trigger Wink & Heart Shower Function
    function triggerFlirtyWink() {
      const now = performance.now();
      stateRef.current.isReacting = true;
      stateRef.current.reactionStartTime = now;

      // Spawn 5-6 floating hearts around the bot's head
      activeHearts.forEach((h, i) => {
        h.startTime = now + i * 85;
        h.life = 0;
        h.startX = (Math.random() - 0.5) * 0.45;
        h.startY = 0.55 + Math.random() * 0.2;
        h.startZ = 0.2 + (Math.random() - 0.5) * 0.2;
        h.driftX = (Math.random() - 0.5) * 0.5;
        h.driftZ = (Math.random() - 0.5) * 0.35;
        h.mesh.visible = true;
        h.mesh.position.set(h.startX, h.startY, h.startZ);
        (h.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
      });
    }

    // 7. Raycasting for Interaction (Click bot to wink, hover/click logos)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-999, -999);

    function onPointerMove(e: PointerEvent) {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      pointer.x = x;
      pointer.y = y;

      const state = stateRef.current;
      state.pointerX = x;
      state.pointerY = y;
      state.isPointerActive = true;
      state.lastPointerMoveTime = performance.now();

      // Horizontal Dragging with smooth inertia
      if (state.isDragging) {
        const deltaX = e.clientX - state.dragStartX;
        state.dragVelocityX = deltaX * 0.008;
        state.dragStartX = e.clientX;
      }

      // Check hover on logos
      raycaster.setFromCamera(pointer, camera);
      const logoMeshes = logoTileRigs.map((r) => r.mesh);
      const intersects = raycaster.intersectObjects(logoMeshes, false);

      let foundHoverId: string | null = null;
      let hoveredItem: LogoConfig | null = null;
      logoTileRigs.forEach((r) => (r.isHovered = false));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const hitRig = logoTileRigs.find((r) => r.mesh === hit);
        if (hitRig) {
          hitRig.isHovered = true;
          foundHoverId = hitRig.config.id;
          hoveredItem = hitRig.config;
          container.style.cursor = "pointer";
        }
      } else {
        container.style.cursor = state.isDragging ? "grabbing" : "default";
      }

      state.hoveredLogoId = foundHoverId;
      if (hoveredItem) {
        setActiveTooltip({ name: hoveredItem.name, desc: hoveredItem.description });
      } else {
        setActiveTooltip(null);
      }
    }

    function onPointerDown(e: PointerEvent) {
      stateRef.current.isDragging = true;
      stateRef.current.dragStartX = e.clientX;
      stateRef.current.dragVelocityX = 0;

      // Check click on 3D bot mascot
      if (botRig) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

        const hitBot = raycaster.intersectObjects(botRig.clickableMeshes, true);
        if (hitBot.length > 0) {
          triggerFlirtyWink();
        }
      }

      // Check click on logo tile (spring pop punch)
      const hitLogos = raycaster.intersectObjects(
        logoTileRigs.map((r) => r.mesh),
        false
      );
      if (hitLogos.length > 0) {
        const hitRig = logoTileRigs.find((r) => r.mesh === hitLogos[0].object);
        if (hitRig) {
          hitRig.currentScale = 1.42; // spring pop punch
        }
      }
    }

    function onPointerUp() {
      stateRef.current.isDragging = false;
      container.style.cursor = "default";
    }

    function onPointerLeave() {
      stateRef.current.isPointerActive = false;
      stateRef.current.isDragging = false;
      stateRef.current.hoveredLogoId = null;
      logoTileRigs.forEach((r) => (r.isHovered = false));
      setActiveTooltip(null);
      container.style.cursor = "default";
    }

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);

    // 8. ResizeObserver & Page Visibility / Intersection Handling
    let isVisibleOnScreen = true;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // 9. Main 60-120 FPS Animation Loop
    let animId: number;
    let prevTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      if (isVisibleOnScreen && document.visibilityState === "visible") {
        const state = stateRef.current;

        // --------------------------------------------------------------------
        // A. INTRO PUSH-IN & STAGGERED EMERGENCE
        // --------------------------------------------------------------------
        const introElapsed = (now - state.introStartTime) / 1000;
        let introFactor = 1.0;

        if (state.isIntroActive && !state.reducedMotion) {
          introFactor = Math.min(1.0, introElapsed / state.introDuration);
          const expoOut = 1 - Math.pow(2, -10 * introFactor);
          camera.position.z = 6.8 - expoOut * 1.3; // from 6.8 to 5.5

          // Bot scales in with soft overshoot (back-out) over 1.2s
          if (botRig) {
            const botIntroP = Math.min(1.0, introElapsed / 1.2);
            const c1 = 1.70158;
            const c3 = c1 + 1;
            const backOut = 1 + c3 * Math.pow(botIntroP - 1, 3) + c1 * Math.pow(botIntroP - 1, 2);
            const botScale = Math.max(0.01, backOut);
            botRig.root.scale.set(botScale, botScale, botScale);
          }

          if (introElapsed >= state.introDuration) {
            state.isIntroActive = false;
          }
        } else {
          camera.position.z = 5.5;
          if (botRig) botRig.root.scale.set(1, 1, 1);
        }

        // --------------------------------------------------------------------
        // B. HEAD / BOT TURNS FIRST, ARMS FOLLOW WITH SECONDARY LAG
        // --------------------------------------------------------------------
        const timeSinceMove = now - state.lastPointerMoveTime;
        const isIdle = timeSinceMove > 3000 || !state.isPointerActive;

        if (isIdle) {
          // Gentle self-driven look-around
          state.targetHeadYaw = Math.sin(now * 0.0009) * 0.28;
          state.targetHeadPitch = Math.cos(now * 0.0013) * 0.14;
        } else {
          // Turns toward pointer
          state.targetHeadYaw = state.pointerX * 0.55;
          state.targetHeadPitch = state.pointerY * 0.32;
        }

        // Critically damped spring on head/body
        state.currentHeadYaw += (state.targetHeadYaw - state.currentHeadYaw) * (dt * 7.5);
        state.currentHeadPitch += (state.targetHeadPitch - state.currentHeadPitch) * (dt * 7.5);

        // Arms follow with secondary lag
        state.currentArmYaw += (state.currentHeadYaw * 0.5 - state.currentArmYaw) * (dt * 4.0);

        // Subtle camera parallax from pointer
        const targetCamX = state.isPointerActive ? state.pointerX * 0.22 : 0;
        const targetCamY = state.isPointerActive ? 0.15 + state.pointerY * 0.16 : 0.15;
        camera.position.x += (targetCamX - camera.position.x) * (dt * 3.0);
        camera.position.y += (targetCamY - camera.position.y) * (dt * 3.0);
        camera.lookAt(0, 0.12, 0);

        // --------------------------------------------------------------------
        // C. FLIRTY WINK / BLUSH / WAVE / HEARTS REACTION
        // --------------------------------------------------------------------
        let winkP = 0;
        let blushP = 0;
        let waveZ = 0;
        let waveX = 0;
        let headTiltZ = 0;
        let headLeanX = 0;

        if (state.isReacting) {
          const reactElapsed = (now - state.reactionStartTime) / 1000;
          const u = reactElapsed / state.reactionDuration;

          if (u <= 1.0) {
            const env = Math.sin(u * Math.PI);

            // Morph into wink arc over 0.15s, hold, then morph back
            if (u < 0.18) {
              winkP = u / 0.18;
            } else if (u < 0.8) {
              winkP = 1.0;
            } else {
              winkP = 1 - (u - 0.8) / 0.2;
            }

            blushP = env;
            headTiltZ = env * 0.14;
            headLeanX = env * 0.16;

            // Right arm raises and waves
            waveX = -env * 1.35;
            waveZ = Math.sin(reactElapsed * 20) * 0.32 * env;
          } else {
            state.isReacting = false;
          }
        }

        // Natural random blink every 2.0 to 5.5s
        let blinkP = 0;
        if (!state.isReacting) {
          if (now >= state.nextBlinkTime && !state.isBlinking) {
            state.isBlinking = true;
            state.blinkStartTime = now;
            state.nextBlinkTime = now + 2000 + Math.random() * 3500;
          }
          if (state.isBlinking) {
            const bElapsed = (now - state.blinkStartTime) / 1000;
            const bDuration = 0.18;
            if (bElapsed <= bDuration) {
              blinkP = Math.sin((bElapsed / bDuration) * Math.PI);
            } else {
              state.isBlinking = false;
            }
          }
        }

        // Apply transforms to Bot Rig
        if (botRig) {
          // Head / Body rotations
          botRig.head.rotation.y = state.currentHeadYaw;
          botRig.head.rotation.x = -state.currentHeadPitch + headLeanX;
          botRig.head.rotation.z = headTiltZ;

          // Floating arms follow with secondary lag
          botRig.leftArm.rotation.y = state.currentArmYaw;
          botRig.rightArmPivot.rotation.x = waveX;
          botRig.rightArmPivot.rotation.z = waveZ;

          // Gentle harmonic hover floating & breathing
          const hoverY = Math.sin(now * 0.0024) * 0.045;
          botRig.root.position.y = 0.12 + hoverY;

          // Update Visor Screen
          botRig.updateVisor({
            blinkProgress: blinkP,
            winkProgress: winkP,
            blushOpacity: blushP,
            lookX: state.isPointerActive ? state.pointerX : state.currentHeadYaw / 0.55,
            lookY: state.isPointerActive ? state.pointerY : state.currentHeadPitch / 0.32,
          });
        }

        // Animate Floating Hearts
        activeHearts.forEach((h) => {
          if (!h.mesh.visible) return;
          const hElapsed = (now - h.startTime) / 1000;
          const hDuration = 1.05;

          if (hElapsed >= 0 && hElapsed <= hDuration) {
            const p = hElapsed / hDuration;
            const curY = h.startY + p * 1.25;
            const curX = h.startX + h.driftX * p + Math.sin(p * 8) * 0.06;
            const curZ = h.startZ + h.driftZ * p;

            const scale = Math.sin(p * Math.PI) * h.scale;
            h.mesh.position.set(curX, curY, curZ);
            h.mesh.scale.set(scale, scale, scale);
            h.mesh.quaternion.copy(camera.quaternion);

            const mat = h.mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.sin(p * Math.PI) * 0.95;
          } else if (hElapsed > hDuration) {
            h.mesh.visible = false;
          }
        });

        // --------------------------------------------------------------------
        // D. 360° ORBIT WITH OPPOSING RINGS, BILLBOARDING & DEPTH CUES
        // --------------------------------------------------------------------
        const targetMultiplier = state.hoveredLogoId ? 0.25 : 1.0;
        state.orbitSpeedMultiplier += (targetMultiplier - state.orbitSpeedMultiplier) * (dt * 4.0);

        // Drag inertia with smooth decay
        state.dragVelocityX *= 0.94;
        const dragInc = state.dragVelocityX;

        // Precession of rings
        state.precessionAngle += dt * 0.08;

        state.ring1Angle += (state.ring1Speed * state.orbitSpeedMultiplier * dt) + dragInc;
        state.ring2Angle += (state.ring2Speed * state.orbitSpeedMultiplier * dt) - dragInc;

        // Tilted Ring 1 Normal Plane (tilted ~18° X, 10° Z)
        const tiltX1 = Math.PI * 0.10;
        const tiltZ1 = Math.PI * 0.06;

        // Tilted Ring 2 Normal Plane (tilted ~ -16° X, -10° Z)
        const tiltX2 = -Math.PI * 0.09;
        const tiltZ2 = -Math.PI * 0.06;

        logoTileRigs.forEach((rig, idx) => {
          const isRing1 = rig.config.ring === 1;
          const currentOrbitAngle = (isRing1 ? state.ring1Angle : state.ring2Angle) + rig.config.angleOffset;
          const radius = isRing1 ? state.orbitRadius1 : state.orbitRadius2;
          const tiltX = isRing1 ? tiltX1 : tiltX2;
          const tiltZ = isRing1 ? tiltZ1 : tiltZ2;

          // Staggered Intro emergence from bot chest (120ms stagger)
          const logoIntroStart = idx * 0.12;
          let emergenceR = radius;
          let emergenceScale = 1.0;

          if (state.isIntroActive && !state.reducedMotion) {
            const lElapsed = Math.max(0, introElapsed - logoIntroStart);
            const lProgress = Math.min(1.0, lElapsed / 0.85);
            const expoL = 1 - Math.pow(2, -8 * lProgress);
            emergenceR = radius * expoL;
            emergenceScale = expoL;
          }

          // Compute raw 2D circular position on tilted plane
          const rawX = Math.cos(currentOrbitAngle) * emergenceR;
          const rawZ = Math.sin(currentOrbitAngle) * emergenceR;

          // Apply tilt & slow precession rotations
          const pos = new THREE.Vector3(rawX, 0, rawZ);
          pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), tiltX);
          pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), tiltZ);
          pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), state.precessionAngle * (isRing1 ? 1 : -1));

          // Gentle independent vertical harmonic bob per icon
          const bob = Math.sin(now * 0.0022 + idx * 1.2) * 0.06;
          pos.y += bob + 0.14;

          rig.group.position.copy(pos);

          // Billboarding: logo tile always faces camera directly
          rig.mesh.quaternion.copy(camera.quaternion);

          // Depth cues: icons behind the bot are dimmer and slightly smaller
          const isBehind = pos.z < -0.15;
          const depthScale = isBehind ? 0.88 : 1.08;
          const depthOpacity = isBehind ? 0.58 : 0.98;

          // Hover spring scale
          const hoverScale = rig.isHovered ? 1.30 : 1.0;
          rig.targetScale = depthScale * hoverScale * emergenceScale;

          rig.currentScale += (rig.targetScale - rig.currentScale) * (dt * 9.0);
          rig.mesh.scale.set(rig.currentScale, rig.currentScale, rig.currentScale);

          rig.material.opacity = rig.isHovered ? 1.0 : depthOpacity;
        });

        // 8. Render Frame
        renderer.render(scene, camera);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 10. Clean up geometries, textures, materials, and listeners on unmount
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [glbPath]);

  // If WebGL is unsupported, render clean static fallback
  if (!webglSupported) {
    return (
      <div
        className={`relative rounded-3xl p-6 sm:p-8 flex items-center justify-center border border-white/10 dark-console-box backdrop-blur-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto ${className}`}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(26, 26, 40, 0.7) 0%, rgba(13, 14, 22, 0.95) 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/robot-mascot.png"
          alt="SocialAssist 3D Robot Mascot"
          className="w-48 h-auto object-contain pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative rounded-3xl p-4 sm:p-6 flex items-center justify-center border border-white/10 dark-console-box backdrop-blur-2xl shadow-2xl overflow-hidden w-full max-w-lg mx-auto select-none ${className}`}
      style={{
        height: 450,
        background: "radial-gradient(circle at 50% 50%, rgba(28, 28, 44, 0.75) 0%, rgba(12, 13, 20, 0.98) 100%)",
        touchAction: "pan-y",
      }}
      role="region"
      aria-label="Interactive 3D SocialAssist Robot Mascot with 360-degree orbiting platform logos. Tap the robot to trigger a flirty wink, blush, and floating hearts."
    >
      {/* Background ambient lighting halo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 240,
          left: "50%",
          top: "48%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 75%)",
          filter: "blur(54px)",
          opacity: 0.65,
        }}
      />

      {/* Interactive WebGL Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full block cursor-default outline-none"
        style={{
          touchAction: "pan-y",
        }}
      />

      {/* Apple-Grade Floating Glass Tooltip on Logo Hover */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-full border border-white/15 backdrop-blur-xl shadow-lg transition-all duration-300 flex items-center gap-2 ${
          activeTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        style={{
          background: "rgba(18, 19, 32, 0.85)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px rgba(168, 85, 247, 0.2)",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse" />
        <span className="text-xs font-semibold tracking-wide text-white font-mono">
          {activeTooltip?.name}
        </span>
        <span className="text-[11px] text-zinc-400 font-sans hidden sm:inline">
          · {activeTooltip?.desc}
        </span>
      </div>
    </div>
  );
}
