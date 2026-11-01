#!/usr/bin/env node
/**
 * Automated Screenshot Comparison Runner
 * Captures high-DPI screenshots across 6 applications, 8 viewports, and multiple states
 * for both Tailwind CSS v4 and NUICSS.
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire('D:/nuix/package.json');
const { chromium } = require('playwright');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BENCHMARK_ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(BENCHMARK_ROOT, 'reports');
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, 'screenshots');

// Ensure output directories exist
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// 8 Viewports
const VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080, label: 'desktop-fhd' },
  { name: '1440x900',  width: 1440, height: 900,  label: 'desktop-macbook' },
  { name: '1280x800',  width: 1280, height: 800,  label: 'laptop-compact' },
  { name: '1024x768',  width: 1024, height: 768,  label: 'tablet-landscape' },
  { name: '768x1024',  width: 768,  height: 1024, label: 'tablet-portrait' },
  { name: '390x844',   width: 390,  height: 844,  label: 'mobile-modern' },
  { name: '375x812',   width: 375,  height: 812,  label: 'mobile-standard' },
  { name: '320x568',   width: 320,  height: 568,  label: 'mobile-compact' },
];

const APP_ROUTES = [
  { id: 'saas-dashboard',  hash: '#/dashboard', label: 'SaaS Dashboard' },
  { id: 'marketing-site',  hash: '#/marketing', label: 'Marketing Website' },
  { id: 'ecommerce-store', hash: '#/ecommerce', label: 'Ecommerce Storefront' },
  { id: 'docs-site',       hash: '#/docs',      label: 'Documentation Website' },
  { id: 'editorial-site',  hash: '#/editorial', label: 'Editorial Publication' },
  { id: 'settings-app',    hash: '#/settings',  label: 'Settings Application' },
];

const FRAMEWORKS = [
  { id: 'tailwind', name: 'Tailwind CSS v4', dirName: 'tailwind-app' },
  { id: 'nuicss',   name: 'NUICSS',          dirName: 'nuicss-app' },
];

// Robust static HTTP server
function startStaticServer(baseDir) {
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, 'http://localhost');
      let reqPath = decodeURIComponent(parsedUrl.pathname);
      if (reqPath === '/') reqPath = '/index.html';

      const filePath = path.join(baseDir, reqPath);

      if (!filePath.startsWith(baseDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`File Not Found: ${reqPath}`);
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      console.log(`[Server] Static server running on http://127.0.0.1:${port}`);
      resolve({ server, port });
    });

    server.on('error', reject);
  });
}

// Trigger interactive state
async function triggerInteractiveState(page, appId, stateName) {
  try {
    if (appId === 'saas-dashboard' && stateName === 'modal-open') {
      const btn = await page.$('button:has-text("Add Customer")');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(300);
        return true;
      }
    }

    if (appId === 'marketing-site' && stateName === 'pricing-monthly') {
      const btn = await page.$('button:has-text("Monthly Billing")');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(250);
        return true;
      }
    }

    if (appId === 'ecommerce-store' && stateName === 'cart-drawer') {
      // Find cart trigger button
      const btn = await page.$('button:has-text("2"), button:has-text("Cart"), header button:has(svg.lucide-shopping-bag), button:has(svg)');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(350);
        return true;
      }
    }

    if (appId === 'docs-site' && stateName === 'category-select') {
      const btn = await page.$('button:has-text("Component Superclasses"), button:has-text("OKLCH Color Palette")');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(250);
        return true;
      }
    }

    if (appId === 'editorial-site' && stateName === 'lead-liked') {
      const btn = await page.$('button:has-text("Like"), button:has(svg.lucide-heart)');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(200);
        return true;
      }
    }

    if (appId === 'settings-app' && stateName === 'danger-modal') {
      const btn = await page.$('button:has-text("Delete Workspace")');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(300);
        return true;
      }
    }
  } catch (err) {
    console.warn(`[Trigger] Could not trigger ${stateName} on ${appId}: ${err.message}`);
  }
  return false;
}

async function run() {
  console.log('='.repeat(80));
  console.log('AUTOMATED HIGH-DPI VISUAL COMPARISON BENCHMARK RUNNER');
  console.log('='.repeat(80));

  const { server, port } = await startStaticServer(BENCHMARK_ROOT);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const manifest = {
    timestamp: new Date().toISOString(),
    viewports: VIEWPORTS,
    apps: APP_ROUTES.map(a => a.id),
    frameworks: FRAMEWORKS.map(f => f.id),
    captures: [],
  };

  let totalCaptures = 0;

  try {
    for (const app of APP_ROUTES) {
      console.log(`\n============================================================`);
      console.log(`EVALUATING DOMAIN: [${app.id.toUpperCase()}] — ${app.label}`);
      console.log(`============================================================`);

      for (const fw of FRAMEWORKS) {
        const distHtml = path.join(BENCHMARK_ROOT, fw.dirName, 'dist', 'index.html');
        if (!fs.existsSync(distHtml)) {
          console.warn(`[!] Skipping ${fw.name}: ${distHtml} not built!`);
          continue;
        }

        const outDir = path.join(SCREENSHOTS_DIR, app.id, fw.id);
        fs.mkdirSync(outDir, { recursive: true });

        const appUrl = `http://127.0.0.1:${port}/${fw.dirName}/dist/index.html${app.hash}`;
        console.log(`\n  -> [${fw.name}] Navigating to: ${appUrl}`);

        for (const vp of VIEWPORTS) {
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            deviceScaleFactor: 2.0, // High-DPI Retina
          });

          const page = await context.newPage();

          try {
            await page.goto(appUrl, { waitUntil: 'networkidle', timeout: 10000 });
          } catch (e) {
            await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
          }

          // Allow fonts and animations to settle
          await page.waitForTimeout(400);

          // 1. Dark Theme Capture (default initialized state)
          const darkFileName = `${vp.label}_${vp.name}_dark.png`;
          const darkFilePath = path.join(outDir, darkFileName);
          await page.screenshot({ path: darkFilePath, fullPage: true });
          totalCaptures++;

          manifest.captures.push({
            app: app.id,
            framework: fw.id,
            viewport: vp.name,
            viewportLabel: vp.label,
            state: 'dark',
            file: path.relative(REPORTS_DIR, darkFilePath).replace(/\\/g, '/'),
            sizeBytes: fs.statSync(darkFilePath).size,
          });

          // 2. Light Theme Capture (toggled via #theme-toggle)
          const themeBtn = await page.$('#theme-toggle');
          if (themeBtn) {
            await themeBtn.click();
            await page.waitForTimeout(300);

            const lightFileName = `${vp.label}_${vp.name}_light.png`;
            const lightFilePath = path.join(outDir, lightFileName);
            await page.screenshot({ path: lightFilePath, fullPage: true });
            totalCaptures++;

            manifest.captures.push({
              app: app.id,
              framework: fw.id,
              viewport: vp.name,
              viewportLabel: vp.label,
              state: 'light',
              file: path.relative(REPORTS_DIR, lightFilePath).replace(/\\/g, '/'),
              sizeBytes: fs.statSync(lightFilePath).size,
            });

            // Toggle back to dark
            await themeBtn.click();
            await page.waitForTimeout(200);
          }

          // 3. Interactive State Capture (FHD Desktop & Modern Mobile)
          if (vp.label === 'desktop-fhd' || vp.label === 'mobile-modern') {
            const interactiveStates = {
              'saas-dashboard': ['modal-open'],
              'marketing-site': ['pricing-monthly'],
              'ecommerce-store': ['cart-drawer'],
              'docs-site': ['category-select'],
              'editorial-site': ['lead-liked'],
              'settings-app': ['danger-modal'],
            }[app.id] || [];

            for (const stateName of interactiveStates) {
              const triggered = await triggerInteractiveState(page, app.id, stateName);
              if (triggered) {
                const stateFileName = `${vp.label}_${vp.name}_${stateName}.png`;
                const stateFilePath = path.join(outDir, stateFileName);
                await page.screenshot({ path: stateFilePath, fullPage: true });
                totalCaptures++;

                manifest.captures.push({
                  app: app.id,
                  framework: fw.id,
                  viewport: vp.name,
                  viewportLabel: vp.label,
                  state: stateName,
                  file: path.relative(REPORTS_DIR, stateFilePath).replace(/\\/g, '/'),
                  sizeBytes: fs.statSync(stateFilePath).size,
                });
              }
            }
          }

          process.stdout.write(`    [✓] ${vp.label} (${vp.name}) captured.\n`);
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const manifestPath = path.join(SCREENSHOTS_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(80));
  console.log(`ALL AUTOMATED SCREENSHOTS CAPTURED SUCCESSFULLY!`);
  console.log(`Total High-DPI Captures: ${totalCaptures}`);
  console.log(`Manifest written to: ${manifestPath}`);
  console.log('='.repeat(80));
}

run().catch((err) => {
  console.error('[Runner Fatal Error]', err);
  process.exit(1);
});
