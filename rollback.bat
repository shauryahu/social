@echo off
echo ========================================================
echo   Restoring SocialAssist to Original v1.0 Backup...
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path 'SocialAssist-Original-Backup' | Copy-Item -Destination . -Recurse -Force"
echo.
echo [SUCCESS] Restored original files from SocialAssist-Original-Backup!
pause
