# Cross-compilation script for NUICSS Go CLI
$ErrorActionPreference = "Stop"

Write-Host "Building NUICSS standalone binaries..." -ForegroundColor Cyan

# 1. Sync embedded assets from packages/nuicss/dist
$distDir = Resolve-Path "../nuicss/dist" -ErrorAction SilentlyContinue
if ($distDir -and (Test-Path $distDir)) {
    Write-Host "  -> Syncing latest design tokens & styles from @nofinite/nuicss..." -ForegroundColor Yellow
    Copy-Item "$distDir/styles.css" "pkg/embedded/styles.css" -Force
    Copy-Item "$distDir/styles.min.css" "pkg/embedded/styles.min.css" -Force
    Copy-Item "$distDir/nuicss.html-data.json" "pkg/embedded/nuicss.html-data.json" -Force
    Copy-Item "$distDir/nuicss.css-data.json" "pkg/embedded/nuicss.css-data.json" -Force
}

$env:CGO_ENABLED = "0"

# Windows x64
Write-Host "  -> Compiling Windows amd64..."
$env:GOOS = "windows"
$env:GOARCH = "amd64"
go build -ldflags="-s -w" -o bin/nuicss-windows-amd64.exe ./cmd/nuicss

# Linux amd64
Write-Host "  -> Compiling Linux amd64..."
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -ldflags="-s -w" -o bin/nuicss-linux-amd64 ./cmd/nuicss

# Linux arm64 (AWS Graviton, Apple Silicon Docker)
Write-Host "  -> Compiling Linux arm64..."
$env:GOOS = "linux"
$env:GOARCH = "arm64"
go build -ldflags="-s -w" -o bin/nuicss-linux-arm64 ./cmd/nuicss

# macOS arm64 (Apple Silicon)
Write-Host "  -> Compiling macOS arm64..."
$env:GOOS = "darwin"
$env:GOARCH = "arm64"
go build -ldflags="-s -w" -o bin/nuicss-darwin-arm64 ./cmd/nuicss

# macOS amd64 (Intel)
Write-Host "  -> Compiling macOS amd64..."
$env:GOOS = "darwin"
$env:GOARCH = "amd64"
go build -ldflags="-s -w" -o bin/nuicss-darwin-amd64 ./cmd/nuicss

# Clean up duplicate legacy nuicss.exe if present
if (Test-Path "bin/nuicss.exe") {
    Remove-Item "bin/nuicss.exe" -Force
}

Write-Host "All binaries successfully compiled into bin/" -ForegroundColor Green
Get-ChildItem bin | Select-Object Name, Length
