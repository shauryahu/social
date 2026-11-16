Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Restoring SocialAssist to Original v1.0 Backup...   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$backupPath = Join-Path $PSScriptRoot "SocialAssist-Original-Backup"
if (Test-Path $backupPath) {
    Get-ChildItem -Path $backupPath | Copy-Item -Destination $PSScriptRoot -Recurse -Force
    Write-Host "[SUCCESS] Restored original files from SocialAssist-Original-Backup!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] SocialAssist-Original-Backup directory not found!" -ForegroundColor Red
}
