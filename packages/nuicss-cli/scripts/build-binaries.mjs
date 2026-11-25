#!/usr/bin/env node
/**
 * Cross-platform standalone binary compiler for the `nuicss` CLI.
 * 1. Runs `build-cli.mjs` so embedded assets and `CLI_VERSION` match `package.json`.
 * 2. Resolves the Bun executable across Linux, macOS, and Windows (including npm/pnpm shims).
 * 3. Compiles standalone binaries for all 5 release targets into `bin/`.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');

const TARGETS = [
  ['bun-windows-x64', 'bin/nuicss-windows-amd64.exe'],
  ['bun-linux-x64', 'bin/nuicss-linux-amd64'],
  ['bun-linux-arm64', 'bin/nuicss-linux-arm64'],
  ['bun-darwin-arm64', 'bin/nuicss-darwin-arm64'],
  ['bun-darwin-x64', 'bin/nuicss-darwin-amd64'],
];

function findExecutableOnPath(names) {
  const pathEnv = process.env.PATH || process.env.Path || '';
  const dirs = pathEnv.split(path.delimiter).filter(Boolean);
  for (const dir of dirs) {
    for (const name of names) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  return null;
}

function resolveBunBinary() {
  const isWin = process.platform === 'win32';
  const exeName = isWin ? 'bun.exe' : 'bun';

  const explicit = process.env.BUN_BIN || process.env.BUN_PATH;
  if (explicit && fs.existsSync(explicit)) {
    return explicit;
  }

  const directCandidates = [];
  if (process.env.BUN_INSTALL) {
    directCandidates.push(path.join(process.env.BUN_INSTALL, 'bin', exeName));
  }
  directCandidates.push(path.join(os.homedir(), '.bun', 'bin', exeName));

  if (isWin) {
    if (process.env.APPDATA) {
      directCandidates.push(
        path.join(
          process.env.APPDATA,
          'npm',
          'node_modules',
          'bun',
          'bin',
          'bun.exe'
        )
      );
    }
    if (process.env.LOCALAPPDATA) {
      directCandidates.push(
        path.join(process.env.LOCALAPPDATA, 'bun', 'bin', 'bun.exe')
      );
    }
  }

  const pathDirect = findExecutableOnPath(isWin ? ['bun.exe'] : ['bun']);
  if (pathDirect) {
    return pathDirect;
  }

  if (isWin) {
    const shimPath = findExecutableOnPath(['bun.cmd', 'bun.ps1']);
    if (shimPath) {
      const siblingExe = path.join(
        path.dirname(shimPath),
        'node_modules',
        'bun',
        'bin',
        'bun.exe'
      );
      if (fs.existsSync(siblingExe)) {
        return siblingExe;
      }
    }
  }

  for (const candidate of directCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  if (isWin) {
    const cmdShim = findExecutableOnPath(['bun.cmd']);
    if (cmdShim) {
      return cmdShim;
    }
  }

  throw new Error(
    'Unable to locate the bun executable. Install Bun (https://bun.sh) or set BUN_INSTALL / BUN_BIN.'
  );
}

execFileSync(process.execPath, [path.join(__dirname, 'build-cli.mjs')], {
  cwd: pkgRoot,
  stdio: 'inherit',
});

const bunBin = resolveBunBinary();
fs.mkdirSync(path.join(pkgRoot, 'bin'), { recursive: true });

for (const [target, outfile] of TARGETS) {
  const args = [
    'build',
    '--compile',
    `--target=${target}`,
    `--outfile=${outfile}`,
    'src/index.ts',
  ];
  if (process.platform === 'win32' && /\.(cmd|bat)$/i.test(bunBin)) {
    execFileSync(
      process.env.ComSpec || 'cmd.exe',
      ['/d', '/s', '/c', bunBin, ...args],
      {
        cwd: pkgRoot,
        stdio: 'inherit',
      }
    );
  } else {
    execFileSync(bunBin, args, {
      cwd: pkgRoot,
      stdio: 'inherit',
    });
  }
}
