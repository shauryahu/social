# SocialAssist 2.0 — Rollback & Restoration Guide

This document guarantees that you can return to the **exact original version** of the SocialAssist website at any time with 100% fidelity.

---

## 🔒 Preserved Backups

Two independent, full backups of the original baseline (code, media, videos, configs, styles) exist:

1. **Local Physical Backup Directory**:
   `D:\social-main\SocialAssist-Original-Backup\`
   *(Also mirrored at `C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\SocialAssist-Original-Backup\`)*

2. **Git Baseline Tag**:
   Tag: `original-v1.0` (commit `5450c51`) on branch `main`.

---

## ⚡ Instant Rollback Options

### Option 1: One-Click Script (Recommended)
Run the automated rollback script from PowerShell inside `d:\social-main`:

```powershell
.\rollback.ps1
```

Or double-click:
```cmd
rollback.bat
```

### Option 2: Physical File Restore from Original Backup
If you want to manually restore all files directly from the untouched backup:

```powershell
# In PowerShell:
Get-ChildItem -Path "SocialAssist-Original-Backup" | Copy-Item -Destination . -Recurse -Force
```

### Option 3: Git Instant Rollback
```bash
git checkout main
git reset --hard original-v1.0
git clean -fd
```

---

## 📋 What Gets Restored
- 100% of original UI, typography, layouts, and styles.
- Original components in `src/components/` and `src/components/sections/`.
- Original video assets in `public/videos/` (`channel.mp4`, `intro.mp4`, `services.mp4`).
- Original logo assets in `public/images/`.
- Original Telegram inquiry API integration in `src/app/api/telegram-inquiry/route.ts`.
- Original configurations (`next.config.ts`, `package.json`, `tailwind`, `tsconfig.json`).
- All original copy, sections, and metadata.
