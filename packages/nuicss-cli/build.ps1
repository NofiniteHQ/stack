# Cross-compilation script for NUICSS Go CLI
$ErrorActionPreference = "Stop"

Write-Host "Building NUICSS standalone binaries..." -ForegroundColor Cyan

$env:CGO_ENABLED = "0"

# Windows x64
Write-Host "  -> Compiling Windows amd64..."
$env:GOOS = "windows"
$env:GOARCH = "amd64"
go build -ldflags="-s -w" -o bin/nuicss-windows-amd64.exe ./cmd/nuicss
Copy-Item bin/nuicss-windows-amd64.exe bin/nuicss.exe -Force

# Linux amd64
Write-Host "  -> Compiling Linux amd64..."
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -ldflags="-s -w" -o bin/nuicss-linux-amd64 ./cmd/nuicss

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

Write-Host "All binaries successfully compiled into bin/" -ForegroundColor Green
Get-ChildItem bin | Select-Object Name, Length
