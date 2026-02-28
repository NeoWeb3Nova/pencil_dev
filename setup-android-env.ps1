# PowerShell Script to Configure Android Environment Variables
# Run as Administrator to set system-wide environment variables

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Android Environment Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and run: .\setup-android-env.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, run this command to elevate:" -ForegroundColor Yellow
    Write-Host "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -File .\setup-android-env.ps1'" -ForegroundColor Gray
    exit 1
}

# Android SDK default location on Windows
$androidHome = "$env:USERPROFILE\AppData\Local\Android\Sdk"

# Paths to add
$pathsToAdd = @(
    "$androidHome",
    "$androidHome\platform-tools",
    "$androidHome\tools",
    "$androidHome\tools\bin",
    "$androidHome\emulator"
)

Write-Host "Android SDK Location: $androidHome" -ForegroundColor Green
Write-Host ""

# Verify Android SDK exists
if (-not (Test-Path $androidHome)) {
    Write-Host "WARNING: Android SDK not found at $androidHome" -ForegroundColor Yellow
    Write-Host "Make sure you have installed Android SDK via Android Studio or cmdline-tools" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 0
    }
}

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "Current system PATH checked." -ForegroundColor Gray
Write-Host ""

# Add ANDROID_HOME
$existingAndroidHome = [Environment]::GetEnvironmentVariable("ANDROID_HOME", "Machine")
if ($existingAndroidHome -eq $androidHome) {
    Write-Host "✓ ANDROID_HOME already set correctly" -ForegroundColor Green
} else {
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "Machine")
    Write-Host "✓ ANDROID_HOME set to: $androidHome" -ForegroundColor Green
}

# Add paths to system PATH
$addedCount = 0
foreach ($path in $pathsToAdd) {
    if ($currentPath -like "*$path*") {
        Write-Host "✓ PATH already contains: $path" -ForegroundColor Green
    } else {
        $newPath = "$path;$currentPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        $currentPath = $newPath
        Write-Host "✓ Added to PATH: $path" -ForegroundColor Green
        $addedCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($addedCount -eq 0) {
    Write-Host "  All environment variables already configured!" -ForegroundColor Green
} else {
    Write-Host "  Added $addedCount path(s) to system PATH" -ForegroundColor Green
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Please restart your terminal/VS Code for changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "To verify, run in a NEW terminal:" -ForegroundColor Gray
Write-Host "  echo `$env:ANDROID_HOME" -ForegroundColor Gray
Write-Host "  adb --version" -ForegroundColor Gray
Write-Host ""
