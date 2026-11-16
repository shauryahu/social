"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting (Soft Key, Rim Blue & Subtle Violet Fill)
    const ambientLight = new THREE.AmbientLight(0x0a1128, 1.2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3.5, 12, 1.8);
    blueLight.position.set(-3.5, 2.5, 3);
    scene.add(blueLight);

    const violetLight = new THREE.PointLight(0x818cf8, 2.8, 12, 1.8);
    violetLight.position.set(3.5, -1.5, 3);
    scene.add(violetLight);

    const topSilverLight = new THREE.DirectionalLight(0xe2e8f0, 1.4);
    topSilverLight.position.set(0, 5, 4);
    scene.add(topSilverLight);

    // 3. 3D Elements Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ── Object A: Large Floating 3D Protective Glass Shield (Left Background) ──
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.6);
    shieldShape.quadraticCurveTo(1.3, 1.3, 1.4, 0.2);
    shieldShape.quadraticCurveTo(1.3, -1.0, 0, -1.8);
    shieldShape.quadraticCurveTo(-1.3, -1.0, -1.4, 0.2);
    shieldShape.quadraticCurveTo(-1.3, 1.3, 0, 1.6);

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
    shieldGeo.center();

    const glassShieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32,
      roughness: 0.14,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.45,
      reflectivity: 0.7,
      clearcoat: 0.9,
    });

    const shieldMesh = new THREE.Mesh(shieldGeo, glassShieldMat);
    shieldMesh.position.set(-3.2, 0.4, -1.8);
    shieldMesh.rotation.set(0.15, 0.45, -0.1);
    rootGroup.add(shieldMesh);

    // ── Object B: Large 3D Verification Rosette Star (Upper Right Background) ──
    const starShape = new THREE.Shape();
    const points = 16;
    const outerR = 1.3;
    const innerR = 1.05;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    starGeo.center();

    const metallicBadgeMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.82,
      roughness: 0.26,
    });

    const starMesh = new THREE.Mesh(starGeo, metallicBadgeMat);
    starMesh.position.set(3.4, 1.2, -2.0);
    starMesh.rotation.set(-0.2, -0.4, 0.15);
    rootGroup.add(starMesh);

    // ── Object C: Floating Translucent Interface Slabs (Midground) ──
    const slabGeo = new THREE.BoxGeometry(1.6, 1.0, 0.05);
    const slabMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.8,
    });

    const slab1 = new THREE.Mesh(slabGeo, slabMat);
    slab1.position.set(-2.4, -1.6, -1.0);
    slab1.rotation.set(-0.25, 0.5, 0.15);
    rootGroup.add(slab1);

    const slab2 = new THREE.Mesh(slabGeo, slabMat);
    slab2.position.set(2.6, -1.8, -1.2);
    slab2.rotation.set(0.3, -0.45, -0.1);
    rootGroup.add(slab2);

    // ── Object D: Gyroscopic Orbital Rings ──
    const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.position.copy(shieldMesh.position);
    ring1.rotation.set(1.2, 0.3, 0);
    rootGroup.add(ring1);

    // ── Object E: Subtle Ambient Dust Luminescence (Depth of Field) ──
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // 4. Parallax & Motion State
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isVisible = true;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // IntersectionObserver to pause rendering when scrolled past hero
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 5. Render Loop (Subtle Organic Floating & Gentle Parallax)
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = (performance.now() - startTime) * 0.001;

      // Damped mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Extremely subtle, luxurious float
      shieldMesh.rotation.y = 0.45 + Math.sin(elapsed * 0.35) * 0.12;
      shieldMesh.position.y = 0.4 + Math.sin(elapsed * 0.5) * 0.1;

      starMesh.rotation.z = Math.sin(elapsed * 0.25) * 0.15;
      starMesh.rotation.y = -0.4 + Math.cos(elapsed * 0.3) * 0.1;
      starMesh.position.y = 1.2 + Math.cos(elapsed * 0.45) * 0.08;

      ring1.rotation.z += 0.003;
      ring1.position.y = shieldMesh.position.y;

      slab1.rotation.y = 0.5 + Math.sin(elapsed * 0.4) * 0.08;
      slab2.rotation.y = -0.45 + Math.cos(elapsed * 0.35) * 0.08;

      particles.rotation.y = elapsed * 0.015;

      rootGroup.position.x = mouseX * 0.7;
      rootGroup.position.y = -mouseY * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      shieldGeo.dispose();
      starGeo.dispose();
      slabGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();

      glassShieldMat.dispose();
      metallicBadgeMat.dispose();
      slabMat.dispose();
      ringMat.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 75%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 75%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}
