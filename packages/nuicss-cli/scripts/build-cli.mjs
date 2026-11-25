#!/usr/bin/env node
/**
 * Cross-platform build script for the `nuicss` standalone CLI package.
 * 1. Syncs embedded token/data/CSS assets from `../nuicss/dist/` into `src/embedded/`.
 * 2. Regenerates `src/embedded/assets.ts`.
 * 3. Removes stale `dist/` output and compiles TypeScript cleanly.
 * 4. Copies embedded JSON/CSS files into `dist/embedded/`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');
const embeddedSrcDir = path.join(pkgRoot, 'src', 'embedded');
const nuicssDistDir = path.resolve(pkgRoot, '..', 'nuicss', 'dist');
const distDir = path.join(pkgRoot, 'dist');
const embeddedDistDir = path.join(distDir, 'embedded');

const ASSET_FILES = ['nuicss.html-data.json', 'nuicss.css-data.json', 'styles.css'];

fs.mkdirSync(embeddedSrcDir, { recursive: true });

if (fs.existsSync(nuicssDistDir)) {
  for (const file of ASSET_FILES) {
    const srcPath = path.join(nuicssDistDir, file);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`Missing built NUICSS asset at ${srcPath}. Run @nofinite/nuicss build first.`);
    }
    fs.copyFileSync(srcPath, path.join(embeddedSrcDir, file));
  }
} else {
  for (const file of ASSET_FILES) {
    const fallbackPath = path.join(embeddedSrcDir, file);
    if (!fs.existsSync(fallbackPath)) {
      throw new Error(`Missing embedded asset ${fallbackPath} and ${nuicssDistDir} does not exist.`);
    }
  }
}

const htmlData = fs.readFileSync(path.join(embeddedSrcDir, 'nuicss.html-data.json'), 'utf8');
const cssData = fs.readFileSync(path.join(embeddedSrcDir, 'nuicss.css-data.json'), 'utf8');
const baseStyles = fs.readFileSync(path.join(embeddedSrcDir, 'styles.css'), 'utf8');

const assetsTs =
  `export const HTML_DATA_STR = ${JSON.stringify(htmlData)};\n` +
  `export const CSS_DATA_STR = ${JSON.stringify(cssData)};\n` +
  `export const BASE_STYLES_STR = ${JSON.stringify(baseStyles)};\n`;

fs.writeFileSync(path.join(embeddedSrcDir, 'assets.ts'), assetsTs, 'utf8');

fs.rmSync(distDir, { recursive: true, force: true });

const require = createRequire(import.meta.url);
const tscBin = require.resolve('typescript/bin/tsc', { paths: [pkgRoot] });
execFileSync(process.execPath, [tscBin, '-p', path.join(pkgRoot, 'tsconfig.json')], {
  cwd: pkgRoot,
  stdio: 'inherit',
});

fs.mkdirSync(embeddedDistDir, { recursive: true });
for (const file of ASSET_FILES) {
  fs.copyFileSync(path.join(embeddedSrcDir, file), path.join(embeddedDistDir, file));
}
