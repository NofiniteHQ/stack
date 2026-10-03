# Cross-compilation script for NUICSS Standalone CLI via Bun
$ErrorActionPreference = "Stop"

Write-Host "Building NUICSS standalone binaries..." -ForegroundColor Cyan

# 1. Ensure bin directory exists
if (!(Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

# 2. Sync embedded assets from packages/nuicss/dist
$distDir = Resolve-Path "../nuicss/dist" -ErrorAction SilentlyContinue
if ($distDir -and (Test-Path $distDir)) {
    Write-Host "  -> Syncing latest design tokens & styles from @nofinite/nuicss..." -ForegroundColor Yellow
    Copy-Item "$distDir/styles.css" "src/embedded/styles.css" -Force
    Copy-Item "$distDir/nuicss.html-data.json" "src/embedded/nuicss.html-data.json" -Force
    Copy-Item "$distDir/nuicss.css-data.json" "src/embedded/nuicss.css-data.json" -Force
}

# 3. Generate TypeScript embedded assets
Write-Host "  -> Generating in-memory assets..." -ForegroundColor Yellow
node --input-type=module -e "import fs from 'node:fs'; const html = fs.readFileSync('src/embedded/nuicss.html-data.json', 'utf8'); const css = fs.readFileSync('src/embedded/nuicss.css-data.json', 'utf8'); const styles = fs.readFileSync('src/embedded/styles.css', 'utf8'); const tsContent = 'export const HTML_DATA_STR = ' + JSON.stringify(html) + ';\nexport const CSS_DATA_STR = ' + JSON.stringify(css) + ';\nexport const BASE_STYLES_STR = ' + JSON.stringify(styles) + ';\n'; fs.writeFileSync('src/embedded/assets.ts', tsContent, 'utf8');"

# 4. Compile TypeScript library
Write-Host "  -> Compiling TypeScript distribution..." -ForegroundColor Yellow
tsc
node --input-type=module -e "import fs from 'node:fs'; for(const f of ['nuicss.html-data.json', 'nuicss.css-data.json', 'styles.css']) fs.copyFileSync('src/embedded/' + f, 'dist/embedded/' + f);"

# 5. Cross-compile standalone native executables with Bun
Write-Host "  -> Compiling Windows x64 standalone executable..." -ForegroundColor Cyan
bun build --compile --target=bun-windows-x64 --outfile=bin/nuicss-windows-amd64.exe src/index.ts

Write-Host "  -> Compiling Linux x64 standalone executable..." -ForegroundColor Cyan
bun build --compile --target=bun-linux-x64 --outfile=bin/nuicss-linux-amd64 src/index.ts

Write-Host "  -> Compiling Linux arm64 standalone executable..." -ForegroundColor Cyan
bun build --compile --target=bun-linux-arm64 --outfile=bin/nuicss-linux-arm64 src/index.ts

Write-Host "  -> Compiling macOS arm64 standalone executable..." -ForegroundColor Cyan
bun build --compile --target=bun-darwin-arm64 --outfile=bin/nuicss-darwin-arm64 src/index.ts

Write-Host "  -> Compiling macOS x64 standalone executable..." -ForegroundColor Cyan
bun build --compile --target=bun-darwin-x64 --outfile=bin/nuicss-darwin-amd64 src/index.ts

Write-Host "All standalone binaries successfully compiled into bin/" -ForegroundColor Green
Get-ChildItem bin | Select-Object Name, Length
