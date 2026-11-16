# SocialAssist 2.0 — Rollback & Restoration Guide

This document guarantees that you can return to the **exact original version**, the **SocialAssist 2.0 baseline**, or any intermediate milestone at any time with 100% fidelity.

---

## 🔒 Preserved Backups

Three independent layers of backups exist on disk and in Git:

1. **Original v1.0 Untouched Physical Backup**:
   `D:\social-main\SocialAssist-Original-Backup\`
   *(Mirrored at `C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\SocialAssist-Original-Backup\`)*
   - Git Tag: `original-v1.0` (commit `5450c51`) on branch `main`.

2. **SocialAssist 2.0 Pre-Refinement Baseline**:
   `D:\social-main\SocialAssist-2.0-Backup\`
   - Git Tag: `socialassist-2.0-baseline` (commit `e070573`) on branch `feature/socialassist-2.0`.

3. **Current Apple & Nimbus UI Liquid Glass Experience**:
   - Active Branch: `refinement/iris-apple-experience`.

---

## ⚡ Instant Rollback Procedures

### To Restore Original v1.0 (Exact Pristine State):
Run the automated rollback script:
```powershell
.\rollback.ps1
```
Or double-click `rollback.bat`, or in Git:
```bash
git checkout main
git reset --hard original-v1.0
git clean -fd
```

### To Restore SocialAssist 2.0 Pre-Refinement Baseline:
```powershell
# Restore files from SocialAssist-2.0-Backup
Get-ChildItem -Path "SocialAssist-2.0-Backup" | Copy-Item -Destination . -Recurse -Force
```
Or in Git:
```bash
git checkout feature/socialassist-2.0
git reset --hard socialassist-2.0-baseline
```

---

## 🎨 Latest Delivered Upgrades

### 1. Nimbus UI — Liquid Navbar ("Waterline")
- **File**: `src/components/Navigation.tsx` & `src/app/globals.css`
- **Features**:
  - Translucent rounded pill glass capsule with dual-layer specular edge highlights.
  - Active indicator with viscous spring physics and directional stretching.
  - Organic SVG gooey filter (`#nimbus-waterline-gooey`) with trailing droplet separation and absorption.
  - Click water ripples with expanding radial gradients.
  - Hover meniscus light swelling.
  - Translucent expanded directory modal retaining visible webpage background.
  - 100% crisp typography on an elevated z-layer.
  - Zero idle CPU/GPU loops (RAF stops when settled).

### 2. 3D Official Verification Rosette
- **Asset**: `public/images/official-verification-badge.png`
- **Component**: `src/components/sections/VerificationSection.tsx`
- **Features**:
  - Centrally anchored above "Official Verification in Build Credibility. Strengthen Presence."
  - Authentic 3D blue checkmark rosette with ambient radial depth glow.

### 3. Scroll-Synchronized 3D Laptop Sequence
- **Component**: `src/components/3d/CinematicLaptop.tsx`
- **Features**:
  - Unibody graphite aluminum chassis with authentic hinge pivot.
  - Hermite smooth damping connected directly to scroll progress ($0^\circ \to 104^\circ$).
  - Real 4K `/videos/intro.mp4` playback with zero shattered glass or z-fighting artifacts.

### 4. Hero Minimal Architectural Grid & Animated Statistics
- **Components**: `src/components/HeroArchitecturalGrid.tsx`, `src/components/AnimatedStatistics.tsx`, `src/components/sections/HeroSection.tsx`
- **Features**:
  - Clean hairline grid lines fading from top to bottom.
  - Complete removal of "2.0" tag from hero logo and branding.
  - Exponential ease-out count-up statistics with reduced-motion support.

---

## 📋 What Gets Restored on Rollback
- 100% of UI, typography, layouts, and styles.
- Original components in `src/components/` and `src/components/sections/`.
- Original video assets in `public/videos/` (`channel.mp4`, `intro.mp4`, `services.mp4`).
- Original logo assets in `public/images/`.
- Original Telegram inquiry API integration in `src/app/api/telegram-inquiry/route.ts`.
- Original configurations (`next.config.ts`, `package.json`, `tailwind`, `tsconfig.json`).
- All original copy, sections, and metadata.
