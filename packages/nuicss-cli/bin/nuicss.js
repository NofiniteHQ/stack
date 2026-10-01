#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');

const platform = process.platform;
const arch = process.arch;

let binaryName = '';

if (platform === 'win32') {
  binaryName = 'nuicss-windows-amd64.exe';
} else if (platform === 'darwin') {
  binaryName = arch === 'arm64' ? 'nuicss-darwin-arm64' : 'nuicss-darwin-amd64';
} else if (platform === 'linux') {
  binaryName = 'nuicss-linux-amd64';
} else {
  console.error(`Unsupported operating system: ${platform}`);
  process.exit(1);
}

let binaryPath = path.join(__dirname, binaryName);

// Fallback to nuicss.exe or nuicss if specific arch binary is missing
if (!fs.existsSync(binaryPath)) {
  const fallback = platform === 'win32' ? 'nuicss.exe' : 'nuicss';
  const fallbackPath = path.join(__dirname, fallback);
  if (fs.existsSync(fallbackPath)) {
    binaryPath = fallbackPath;
  }
}

if (!fs.existsSync(binaryPath)) {
  console.error(
    `NUICSS binary not found for ${platform}-${arch} at: ${binaryPath}`
  );
  process.exit(1);
}

const result = spawnSync(binaryPath, process.argv.slice(2), {
  stdio: 'inherit',
  windowsHide: true,
});

if (result.error) {
  console.error('Failed to execute NUICSS binary:', result.error.message);
  process.exit(1);
}

process.exit(result.status !== null ? result.status : 0);
