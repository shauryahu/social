"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";

interface CinematicLaptopProps {
  className?: string;
}

export default function CinematicLaptop({ className = "" }: CinematicLaptopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [canUnmute, setCanUnmute] = useState(false);
  const [playing, setPlaying] = useState(false);

  const { theme } = useTheme();
  const isLight = theme === "light";

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => { });
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // ── 1. Create Dedicated HTML5 Video Pipeline (MP4 + WebM Fallbacks) ──
    const vid = document.createElement("video");
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = "metadata";
    vid.crossOrigin = "anonymous";
    videoRef.current = vid;

    const urls = [
      "/videos/intro.mp4",
      "/videos/intro.webm",
      "/intro.mp4",
      "/intro.webm",
    ];
    let urlIdx = 0;
    let blobFallbackTried = false;

    const loadNextVideo = () => {
      if (urlIdx < urls.length) {
        vid.src = urls[urlIdx++];
        vid.load();
        return;
      }
      if (!blobFallbackTried) {
        blobFallbackTried = true;
        fetch(urls[0])
          .then((res) => res.blob())
          .then((blob) => {
            vid.src = URL.createObjectURL(blob);
            vid.load();
          })
          .catch(renderProceduralVideoFallback);
        return;
      }
      renderProceduralVideoFallback();
    };

    vid.addEventListener("error", loadNextVideo);
    loadNextVideo();

    function renderProceduralVideoFallback() {
      const fbCanvas = document.createElement("canvas");
      fbCanvas.width = 1280;
      fbCanvas.height = 720;
      const ctx = fbCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 1280, 720);
        grad.addColorStop(0, "#0b0a1a");
        grad.addColorStop(1, "#4b2fa0");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);
        ctx.fillStyle = "#ffffff";
        ctx.font = '800 72px "Space Grotesk", Inter, sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("SocialAssist", 640, 380);
      }
      const ft = new THREE.CanvasTexture(fbCanvas);
      ft.colorSpace = THREE.SRGBColorSpace;
      if (scrM) scrM.uniforms.map.value = ft;
      if (bleedM) bleedM.uniforms.map.value = ft;
    }

    // ── 2. High-Performance WebGL Renderer Setup ──
    const R = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    R.outputColorSpace = THREE.SRGBColorSpace;
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.05;
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || "ontouchstart" in window);
    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.5)
      : Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.0);
    R.setPixelRatio(dpr);

    const AN = R.capabilities.getMaxAnisotropy();
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

    // ── 3. Photorealistic Studio Environment (Aluminium & Glass Softboxes) ──
    const envScene = new THREE.Scene();
    envScene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(30, 32, 16),
        new THREE.MeshBasicMaterial({ color: 0x7d7f92, side: THREE.BackSide })
      )
    );

    function addSoftbox(
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      c: number,
      i: number
    ) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(c).multiplyScalar(i),
          side: THREE.DoubleSide,
        })
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    }
    addSoftbox(14, 10, 0, 14, 2, 0xffffff, 5);
    addSoftbox(3, 12, -12, 5, 4, 0xffffff, 4);
    addSoftbox(3, 12, 12, 5, 4, 0xa07bff, 5);
    addSoftbox(10, 3, 0, 3, -14, 0xffffff, 2.5);
    addSoftbox(8, 2, 0, -6, 10, 0x6d3df0, 3);

    const pmrem = new THREE.PMREMGenerator(R);
    scene.environment = pmrem.fromScene(envScene, 0.02).texture;

    // Direct Key & Rim Lights
    const dl = new THREE.DirectionalLight(0xffffff, 0.85);
    dl.position.set(3, 6, 5);
    scene.add(dl);

    const rl = new THREE.PointLight(0xa78bfa, 0, 14, 2);
    rl.position.set(-3.6, 2.2, -2.4);
    scene.add(rl);

    const rw = new THREE.PointLight(0xffffff, 0, 14, 2);
    rw.position.set(3.6, 2.8, 2.2);
    scene.add(rw);

    // ── 4. Unibody Base, Keyboard Well, Trackpad & Bevels ──
    const rig = new THREE.Group();
    scene.add(rig);

    function roundedRectShape(w: number, h: number, r: number) {
      const s = new THREE.Shape();
      const x = -w / 2,
        y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }

    function createSlab(
      w: number,
      h: number,
      r: number,
      d: number,
      b: number,
      m: THREE.Material
    ) {
      const g = new THREE.ExtrudeGeometry(roundedRectShape(w - 2 * b, h - 2 * b, r), {
        depth: d,
        bevelEnabled: true,
        bevelThickness: b,
        bevelSize: b,
        bevelSegments: 10,
        curveSegments: 48,
      });
      return new THREE.Mesh(g, m);
    }

    const alu = new THREE.MeshPhysicalMaterial({
      color: 0x3a3b43,
      metalness: 1,
      roughness: 0.3,
      clearcoat: 0.25,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.25,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x040405,
      roughness: 0.8,
      metalness: 0.1,
    });
    const keyM = new THREE.MeshPhysicalMaterial({
      color: 0x0b0c10,
      roughness: 0.5,
      metalness: 0.2,
      clearcoat: 0.15,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x030304,
      roughness: 0.06,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    });
    const padM = new THREE.MeshPhysicalMaterial({
      color: 0x4a4c57,
      metalness: 0.95,
      roughness: 0.16,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
    });

    const TOP = 0.15;
    const base = createSlab(3.4, 2.3, 0.1, 0.07, 0.025, alu);
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.055;
    rig.add(base);

    const well = new THREE.Mesh(new THREE.PlaneGeometry(2.98, 1.2), dark);
    well.rotation.x = -Math.PI / 2;
    well.position.set(0, TOP + 0.002, -0.32);
    rig.add(well);

    const pad = createSlab(1.3, 0.66, 0.06, 0.002, 0.003, padM);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, TOP + 0.002, 0.72);
    rig.add(pad);

    [
      [-1.55, -0.95],
      [1.55, -0.95],
      [-1.55, 0.95],
      [1.55, 0.95],
    ].forEach((p) => {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 24), dark);
      f.position.set(p[0], 0.015, p[1]);
      rig.add(f);
    });

    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.9, 32),
      new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: 1, roughness: 0.28 })
    );
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, 0.17, -1.13);
    rig.add(hinge);

    // Left & Right Thunderbolt / USB-C Ports
    [
      [-1, [-0.5, -0.3, -0.1]],
      [1, [-0.3, -0.1]],
    ].forEach((s) => {
      (s[1] as number[]).forEach((z: number) => {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.022, 0.09), dark);
        p.position.set((s[0] as number) * 1.7, 0.095, z);
        rig.add(p);
      });
    });

    // 3.5mm Headphone Jack
    const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 16), dark);
    jack.rotation.z = Math.PI / 2;
    jack.position.set(1.7, 0.095, 0.15);
    rig.add(jack);

    // Front Display Notch Scoop
    const notch = createSlab(0.34, 0.05, 0.024, 0.003, 0.002, dark);
    notch.rotation.x = -Math.PI / 2;
    notch.position.set(0, TOP + 0.0005, 1.09);
    rig.add(notch);

    // ── 5. Magic Keyboard (77 Individual Beveled Keys + Backlit Texture) ──
    const rows: [number, number, number[], string[]][] = [
      [
        -0.83,
        0.105,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "◉", "⏻"],
      ],
      [
        -0.64,
        0.17,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "delete"],
      ],
      [
        -0.45,
        0.17,
        [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
        ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
      ],
      [
        -0.26,
        0.17,
        [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
        ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "’", "return"],
      ],
      [
        -0.07,
        0.17,
        [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
        ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
      ],
      [
        0.12,
        0.17,
        [1, 1, 1, 1.25, 5.5, 1.25, 1, 1, 1],
        ["fn", "ctrl", "opt", "cmd", "", "cmd", "opt", "◂", "▸"],
      ],
    ];

    let totalKeys = 0;
    rows.forEach((r) => {
      totalKeys += r[2].length;
    });

    const kg = new THREE.ExtrudeGeometry(roundedRectShape(1, 1, 0.2), {
      depth: 0.9,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.035,
      bevelSegments: 3,
      curveSegments: 8,
    });
    kg.rotateX(-Math.PI / 2);
    kg.translate(0, -0.45, 0);

    const keys = new THREE.InstancedMesh(kg, keyM, totalKeys);
    const mMatrix = new THREE.Matrix4();
    const qQuat = new THREE.Quaternion();
    let keyIdx = 0;
    const u = 0.19,
      KX = -1.425,
      ZMIN = -0.8825,
      ZMAX = 0.205;

    const lc = document.createElement("canvas");
    lc.width = 2850;
    lc.height = 1088;
    const lx = lc.getContext("2d");
    if (lx) {
      lx.fillStyle = "#e4dcff";
      lx.shadowColor = "rgba(139,92,246,.95)";
      lx.shadowBlur = 10;
      lx.textBaseline = "middle";

      rows.forEach((r) => {
        let x = KX;
        r[2].forEach((w, k) => {
          const cxw = x + (w * u) / 2;
          mMatrix.compose(
            new THREE.Vector3(cxw, TOP + 0.012, r[0]),
            qQuat,
            new THREE.Vector3(w * u - 0.014, 0.034, r[1] - 0.012)
          );
          keys.setMatrixAt(keyIdx++, mMatrix);
          const t = r[3][k];
          const px = (cxw - KX) * 1000;
          const py = (r[0] - ZMIN) * 1000;
          if (t.length > 1 && w > 1) {
            lx.font = '600 19px "Space Grotesk", Inter, sans-serif';
            lx.textAlign = "left";
            lx.fillText(t, px - w * u * 500 + 16, py + (r[1] > 0.12 ? 22 : 0));
          } else {
            lx.font = `${t.length > 1 ? "600 17px" : "600 30px"} "Space Grotesk", Inter, sans-serif`;
            lx.textAlign = "center";
            lx.fillText(t, px, py);
          }
          x += w * u;
        });
      });
    }
    keys.instanceMatrix.needsUpdate = true;
    rig.add(keys);

    const lt = new THREE.CanvasTexture(lc);
    lt.anisotropy = AN;
    lt.colorSpace = THREE.SRGBColorSpace;
    const legM = new THREE.MeshBasicMaterial({
      map: lt,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      opacity: 0,
    });
    const leg = new THREE.Mesh(new THREE.PlaneGeometry(2.85, 1.0875), legM);
    leg.rotation.x = -Math.PI / 2;
    leg.position.set(0, TOP + 0.0295, (ZMIN + ZMAX) / 2);
    rig.add(leg);

    // Speaker Grilles
    const gm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 10), dark, 240);
    let gi = 0;
    [-1, 1].forEach((sd) => {
      for (let c = 0; c < 3; c++) {
        for (let z = -0.9; z < 0.25 && gi < 240; z += 0.03) {
          mMatrix.makeTranslation(sd * (1.53 + c * 0.035), TOP + 0.002, z);
          gm.setMatrixAt(gi++, mMatrix);
        }
      }
    });
    gm.instanceMatrix.needsUpdate = true;
    rig.add(gm);

    // ── 6. Precision Lid, Display Shaders, Halation & Bezel Light Bleed ──
    const H = 1.9825;
    const lid = new THREE.Group();
    lid.position.set(0, 0.185, -1.12);
    rig.add(lid);

    const shell = createSlab(3.4, H, 0.09, 0.045, 0.012, alu);
    shell.position.set(0, H / 2, -0.057);
    lid.add(shell);

    const plate = createSlab(3.36, 1.9425, 0.075, 0.004, 0.004, glassMat);
    plate.position.set(0, H / 2, 0.0005);
    lid.add(plate);

    const vt = new THREE.VideoTexture(vid);
    vt.generateMipmaps = true;
    vt.minFilter = THREE.LinearMipmapLinearFilter;
    vt.magFilter = THREE.LinearFilter;
    vt.colorSpace = THREE.SRGBColorSpace;
    vt.anisotropy = AN;

    const VSH = `
      varying vec2 vUv;
      varying vec3 vW, vN;
      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0));
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `;

    const FSH = `
      uniform sampler2D map;
      uniform float uOn, uT;
      uniform vec2 uPanel;
      varying vec2 vUv;
      varying vec3 vW, vN;

      vec3 dec(vec3 c) { return pow(c, vec3(2.2)); }
      vec3 enc(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(0.4545)); }
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec2 uv = vUv;
        vec3 V = normalize(cameraPosition - vW);
        float ndv = abs(dot(normalize(vN), V));
        vec3 c = dec(texture2D(map, uv).rgb);
        #if USE_MIP
          vec3 g = dec(texture2D(map, uv, 4.5).rgb) * 0.55 + dec(texture2D(map, uv, 6.5).rgb) * 0.45;
          c += g * 0.11;
        #endif
        vec2 q = (uv - 0.5) * vec2(2.0, 1.8);
        float vig = 1.0 - 0.15 * pow(dot(q, q) * 0.5, 1.5);
        c = c * vig + vec3(0.0012, 0.0012, 0.0022) * vig;
        vec2 p = uv * uPanel;
        float fw = max(fwidth(p.x), fwidth(p.y));
        float vis = 1.0 - smoothstep(0.22, 0.5, fw);
        vec2 f = abs(fract(p) - 0.5);
        c *= 1.0 - smoothstep(0.36, 0.5, max(f.x, f.y)) * 0.14 * vis;
        c *= mix(0.6, 1.0, smoothstep(0.12, 0.85, ndv)) * uOn;
        c += pow(1.0 - ndv, 3.0) * vec3(0.022, 0.02, 0.034);
        vec3 o = enc(c);
        o += (hash(gl_FragCoord.xy + fract(uT) * 61.0) - 0.5) * 0.007;
        gl_FragColor = vec4(o, 1.0);
      }
    `;

    const SW0 = 3.24,
      SH0 = 1.8225;
    const scrM = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: vt },
        uOn: { value: 0 },
        uT: { value: 0 },
        uPanel: { value: new THREE.Vector2(1920, 1080) },
      },
      vertexShader: VSH,
      fragmentShader: FSH,
      defines: { USE_MIP: 1 },
      side: THREE.DoubleSide,
    });

    const BW = 3.36,
      BH = 1.9425;
    const bgm = new THREE.ShapeGeometry(roundedRectShape(BW, BH, 0.075), 24);
    const bgPos = bgm.attributes.position;
    const bgUv = bgm.attributes.uv;
    for (let i = 0; i < bgPos.count; i++) {
      bgUv.setXY(i, bgPos.getX(i) / BW + 0.5, bgPos.getY(i) / BH + 0.5);
    }
    bgUv.needsUpdate = true;

    const bleedM = new THREE.ShaderMaterial({
      uniforms: { map: { value: vt }, uOn: { value: 0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader:
        "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform sampler2D map;
        uniform float uOn;
        varying vec2 vUv;
        void main() {
          vec2 q = (vUv - 0.5) * vec2(${BW}, ${BH});
          vec2 d = abs(q) - vec2(${SW0}, ${SH0}) * 0.5;
          float dist = length(max(d, 0.0));
          vec2 suv = clamp(q / vec2(${SW0}, ${SH0}) + 0.5, 0.0, 1.0);
          vec3 g = pow(texture2D(map, suv, 6.5).rgb, vec3(2.2));
          float f = exp(-dist * 34.0);
          gl_FragColor = vec4(g * f * 0.5 * uOn, 1.0);
        }
      `,
    });

    const SW = 3.24,
      SH = 1.8225;
    const sg = new THREE.ShapeGeometry(roundedRectShape(SW, SH, 0.032), 24);
    const sgPos = sg.attributes.position;
    const sgUv = sg.attributes.uv;
    for (let i = 0; i < sgPos.count; i++) {
      sgUv.setXY(i, sgPos.getX(i) / SW + 0.5, sgPos.getY(i) / SH + 0.5);
    }
    sgUv.needsUpdate = true;

    const scr = new THREE.Mesh(sg, scrM);
    scr.position.set(0, H / 2, 0.0095);
    lid.add(scr);

    const bleed = new THREE.Mesh(bgm, bleedM);
    bleed.position.set(0, H / 2, 0.009);
    bleed.renderOrder = 1;
    lid.add(bleed);

    // FaceTime HD Camera Dot & Green Activity LED
    const cd = new THREE.Mesh(new THREE.CircleGeometry(0.0075, 32), new THREE.MeshBasicMaterial({ color: 0x14151b }));
    cd.position.set(0, H / 2 + SH / 2 + 0.03, 0.01);
    lid.add(cd);

    const led = new THREE.Mesh(new THREE.CircleGeometry(0.0034, 24), new THREE.MeshBasicMaterial({ color: 0x2a2150 }));
    led.position.set(0, H / 2 + SH / 2 + 0.03, 0.0112);
    lid.add(led);

    // Rear Lid Official SocialAssist Emblem
    const LW = 0.46,
      LH = (LW * 653) / 528;
    const logoM = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
      depthWrite: false,
      color: 0xffffff,
    });
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW, LH), logoM);
    logoMesh.rotation.set(0, Math.PI, Math.PI);
    logoMesh.position.set(0, H / 2, -0.0705);
    lid.add(logoMesh);

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = () => {
      const aspect = (logoImg.naturalHeight || 1) / (logoImg.naturalWidth || 1);
      logoMesh.scale.set(1, aspect / (653 / 528), 1);
      const t = new THREE.Texture(logoImg);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = AN;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.needsUpdate = true;
      logoM.map = t;
      logoM.needsUpdate = true;
    };
    logoImg.src = "/images/socialassist-logo.png";

    // Glass Reflection & Diagonal Glare Sheen
    const rc = document.createElement("canvas");
    rc.width = 512;
    rc.height = 288;
    const rx = rc.getContext("2d");
    if (rx) {
      const rg = rx.createLinearGradient(0, 0, 512, 288);
      rg.addColorStop(0, "rgba(255,255,255,.55)");
      rg.addColorStop(0.28, "rgba(255,255,255,.12)");
      rg.addColorStop(0.5, "rgba(255,255,255,0)");
      rg.addColorStop(1, "rgba(255,255,255,.05)");
      rx.fillStyle = rg;
      rx.fillRect(0, 0, 512, 288);
    }
    const sheenTex = new THREE.CanvasTexture(rc);
    sheenTex.colorSpace = THREE.SRGBColorSpace;
    const sheen = new THREE.Mesh(
      sg,
      new THREE.MeshBasicMaterial({
        map: sheenTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
    );
    sheen.position.set(0, H / 2, 0.0105);
    lid.add(sheen);

    const sc2 = document.createElement("canvas");
    sc2.width = 1024;
    sc2.height = 256;
    const sx2 = sc2.getContext("2d");
    if (sx2) {
      const sg2 = sx2.createLinearGradient(0, 0, 1024, 0);
      sg2.addColorStop(0, "rgba(255,255,255,0)");
      sg2.addColorStop(0.5, "rgba(255,255,255,.9)");
      sg2.addColorStop(1, "rgba(255,255,255,0)");
      sx2.fillStyle = sg2;
      sx2.fillRect(0, 0, 1024, 256);
    }
    const swT = new THREE.CanvasTexture(sc2);
    swT.colorSpace = THREE.SRGBColorSpace;
    swT.repeat.set(0.45, 1);
    const glare = new THREE.Mesh(
      sg,
      new THREE.MeshBasicMaterial({
        map: swT,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
    );
    glare.position.set(0, H / 2, 0.0108);
    lid.add(glare);

    // Dynamic Video Light Source
    const VIO = 0x8b5cf6;
    const sl = new THREE.PointLight(VIO, 0, 6, 2);
    sl.position.set(0, 1, 0.6);
    lid.add(sl);

    // Contact Floor Shadow
    const scShadow = document.createElement("canvas");
    scShadow.width = scShadow.height = 256;
    const sxShadow = scShadow.getContext("2d");
    if (sxShadow) {
      const gr = sxShadow.createRadialGradient(128, 128, 10, 128, 128, 128);
      gr.addColorStop(0, "rgba(10,6,30,.6)");
      gr.addColorStop(1, "rgba(10,6,30,0)");
      sxShadow.fillStyle = gr;
      sxShadow.fillRect(0, 0, 256, 256);
    }
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 4.6),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(scShadow),
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
      })
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = -0.004;
    rig.add(sh);

    rig.position.y = -0.45;

    // ── 7. Dynamic Ambient Color Extractor (Samples Real Video Pixels) ──
    const ac = document.createElement("canvas");
    ac.width = 16;
    ac.height = 9;
    const ax = ac.getContext("2d", { willReadFrequently: true });
    let aT = 0;
    const aCol = new THREE.Color(VIO);
    const aTar = new THREE.Color(VIO);
    let aL = 0.12,
      aLt = 0.12,
      needUp = true;

    function sampleLight(now: number) {
      if (now - aT < 120 || vid.readyState < 2 || !ax) return;
      aT = now;
      try {
        ax.drawImage(vid, 0, 0, 16, 9);
        const d = ax.getImageData(0, 0, 16, 9).data;
        let r = 0,
          g = 0,
          b = 0,
          k = d.length / 4;
        for (let i = 0; i < d.length; i += 4) {
          r += d[i];
          g += d[i + 1];
          b += d[i + 2];
        }
        r /= k * 255;
        g /= k * 255;
        b /= k * 255;
        aLt = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const m = Math.max(r, g, b, 0.001);
        aTar.setRGB(0.3 + (0.7 * r) / m, 0.3 + (0.7 * g) / m, 0.3 + (0.7 * b) / m);
      } catch { }
    }

    ["loadeddata", "seeked", "canplay"].forEach((ev) => {
      vid.addEventListener(ev, () => {
        needUp = true;
      });
    });

    // ── 8. Responsive Camera & Canvas Resizing ──
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      R.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();

    // ── 9. Interactive Scroll, Mouse Parallax & Hermite Transitions ──
    const TILT = 0.26;
    const A = [0, 4.4, 7.4];
    const TA = [0, 0.2, 0];
    const TF = [0, -0.45 + 0.185 + (H / 2) * Math.cos(TILT), -1.12 - (H / 2) * Math.sin(TILT)];

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }
    function smoothstep(a: number, b: number, x: number) {
      x = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return x * x * (3 - 2 * x);
    }
    function clampVal(x: number, a: number, b: number) {
      return Math.min(b, Math.max(a, x));
    }

    let isVisible = true;
    let s = 0;
    let targetS = 0;
    let mx = 0,
      tmx = 0;
    let my = 0,
      tmy = 0;
    let lastTime = 0;
    let animId = 0;

    const onPointerMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    io.observe(container);

    let cachedBottom = 0;
    let cachedVh = typeof window !== "undefined" ? window.innerHeight : 800;

    const updateScroll = () => {
      if (!container) return;
      const r = container.getBoundingClientRect();
      const vh = window.innerHeight;
      cachedBottom = r.bottom;
      cachedVh = vh;

      // Start lid opening as block scrolls into viewport (from bottom 92% to 32%)
      const startOpen = vh * 0.92;
      const fullyOpen = vh * 0.32;

      let p = 1;
      if (r.top > fullyOpen) {
        p = (startOpen - r.top) / (startOpen - fullyOpen);
      } else if (r.bottom < vh * 0.15) {
        p = Math.max(0, r.bottom / (vh * 0.25));
      } else {
        p = 1;
      }
      targetS = clampVal(p, 0, 1);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    // ── 10. Master 120Hz Animation Loop ──
    const renderLoop = (now: number) => {
      animId = requestAnimationFrame(renderLoop);

      const dt = Math.min(50, now - lastTime || 16);
      lastTime = now;

      s += (targetS - s) * (dt * 0.0055);
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;

      const wantVideo =
        isVisible &&
        s > 0.44 &&
        targetS > 0.38 &&
        cachedBottom > cachedVh * 0.35 &&
        !document.hidden;

      if (wantVideo) {
        if (vid.paused) {
          vid.play().then(() => setPlaying(true)).catch(() => { });
        }
      } else {
        if (!vid.paused) {
          vid.pause();
          setPlaying(false);
        }
        if (s < 0.2 && vid.currentTime > 0) {
          try {
            vid.currentTime = 0;
          } catch { }
        }
      }

      setCanUnmute(wantVideo);

      if (isVisible) {
        const o = smoothstep(0.06, 0.46, s);
        const d = smoothstep(0.3, 0.8, s);
        const kk = smoothstep(0, 0.55, s);

        lid.rotation.x = lerp(Math.PI / 2, -TILT, o);
        rig.rotation.y = lerp(-0.65, 0, kk) + mx * 0.1 * (1 - d);
        rig.rotation.x = my * 0.04 * (1 - d);
        rig.position.y = -0.45 + Math.sin(now / 1100) * 0.014 * (1 - d);

        const asp = cam.aspect;
        const f = Math.max(1, 1.25 / asp);
        const D = Math.max(3.75, 6.4 / asp);
        const cA = [A[0], TA[1] + (A[1] - TA[1]) * f, TA[2] + (A[2] - TA[2]) * f];
        const cN = [TF[0], TF[1] + D * Math.sin(TILT), TF[2] + D * Math.cos(TILT)];

        cam.position.set(lerp(cA[0], cN[0], d), lerp(cA[1], cN[1], d), lerp(cA[2], cN[2], d));
        cam.lookAt(lerp(TA[0], TF[0], d), lerp(TA[1], TF[1], d), lerp(TA[2], TF[2], d));

        if (vid.readyState >= 2 && (!vid.paused || needUp)) {
          vt.needsUpdate = true;
          needUp = false;
          sampleLight(now);
        }
        scrM.uniforms.uT.value = now / 1000;

        const on = smoothstep(0.5, 0.86, o);
        scrM.uniforms.uOn.value = on;
        bleedM.uniforms.uOn.value = on;
        legM.opacity = on * 0.95;

        aCol.lerp(aTar, 0.08);
        aL += (aLt - aL) * 0.08;
        sl.color.copy(aCol);
        sl.intensity = on * (0.9 + 7 * aL);
        (sh.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - d * 0.3);

        rl.intensity = smoothstep(0.02, 0.3, s) * 26 * (1 - d);
        rw.intensity = smoothstep(0.02, 0.3, s) * 16 * (1 - d);

        (sheen.material as THREE.MeshBasicMaterial).opacity = on * 0.2;
        const gs = smoothstep(0.5, 0.95, s);
        swT.offset.x = lerp(-0.45, 1, gs);
        (glare.material as THREE.MeshBasicMaterial).opacity = Math.sin(gs * Math.PI) * 0.16 * on;

        if (glowRef.current) {
          glowRef.current.style.opacity = (smoothstep(0.25, 0.85, o) * 0.7 * (1 - d * 0.3)).toFixed(3);
        }

        R.render(scene, cam);
      }
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", updateScroll);
      ro.disconnect();
      io.disconnect();

      vid.pause();
      vid.removeEventListener("error", loadNextVideo);
      vid.src = "";
      vid.load();

      // Complete Resource Cleanup
      vt.dispose();
      lt.dispose();
      sheenTex.dispose();
      swT.dispose();
      if (logoM.map) logoM.map.dispose();
      if (scene.environment) scene.environment.dispose();

      kg.dispose();
      bgm.dispose();
      sg.dispose();
      base.geometry.dispose();
      well.geometry.dispose();
      pad.geometry.dispose();
      hinge.geometry.dispose();
      notch.geometry.dispose();
      jack.geometry.dispose();
      keys.geometry.dispose();
      leg.geometry.dispose();
      gm.geometry.dispose();
      shell.geometry.dispose();
      plate.geometry.dispose();
      scr.geometry.dispose();
      bleed.geometry.dispose();
      cd.geometry.dispose();
      led.geometry.dispose();
      logoMesh.geometry.dispose();
      sheen.geometry.dispose();
      glare.geometry.dispose();
      sh.geometry.dispose();

      alu.dispose();
      dark.dispose();
      keyM.dispose();
      glassMat.dispose();
      padM.dispose();
      legM.dispose();
      scrM.dispose();
      bleedM.dispose();
      logoM.dispose();
      (sheen.material as THREE.Material).dispose();
      (glare.material as THREE.Material).dispose();
      (sh.material as THREE.Material).dispose();

      R.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl mx-auto h-[480px] sm:h-[560px] md:h-[640px] lg:h-[700px] select-none ${className}`}
    >
      {/* ── Atmospheric Ambient Radiance Bloom ── */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 w-[min(94vw,1120px)] aspect-[16/9] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          background: isLight
            ? "radial-gradient(closest-side, rgba(167, 139, 250, 0.45), transparent)"
            : "radial-gradient(closest-side, rgba(139, 92, 246, 0.65), transparent)",
          filter: "blur(44px)",
          opacity: 0,
          transition: "opacity 0.4s ease-out",
        }}
      />

      {/* ── 3D Interactive WebGL Canvas ── */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block relative z-10 cursor-grab active:cursor-grabbing outline-none"
      />

      {/* ── Apple-Inspired Floating Sound Control Pill ── */}
      <button
        onClick={toggleMute}
        type="button"
        aria-label={muted ? "Unmute Audio" : "Mute Audio"}
        className={`absolute left-1/2 -translate-x-1/2 bottom-5 sm:bottom-7 z-20 flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm tracking-tight backdrop-blur-xl border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:scale-105 active:scale-95 ${canUnmute
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          } ${isLight
            ? "bg-slate-900/85 text-white hover:bg-purple-900/90 hover:border-purple-400/50"
            : "bg-white/10 text-white hover:bg-purple-600/30 hover:border-purple-400/60"
          }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 flex-none"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          {muted ? (
            <g>
              <path d="m23 9-6 6" />
              <path d="m17 9 6 6" />
            </g>
          ) : (
            <g>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 5a10 10 0 0 1 0 14" />
            </g>
          )}
        </svg>
        <span>{muted ? "Unmute Video" : "Mute Video"}</span>
      </button>
    </div>
  );
}
