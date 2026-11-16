# SocialAssist 2.0 — Rollback & Restoration Guide

This document guarantees that you can return to the **exact original version** or the **SocialAssist 2.0 baseline** at any time with 100% fidelity.

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

3. **Current Apple & IRIS X Cinematic Refinement**:
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

## 📋 What Gets Restored
- 100% of UI, typography, layouts, and styles.
- Original components in `src/components/` and `src/components/sections/`.
- Original video assets in `public/videos/` (`channel.mp4`, `intro.mp4`, `services.mp4`).
- Original logo assets in `public/images/`.
- Original Telegram inquiry API integration in `src/app/api/telegram-inquiry/route.ts`.
- Original configurations (`next.config.ts`, `package.json`, `tailwind`, `tsconfig.json`).
- All original copy, sections, and metadata.
