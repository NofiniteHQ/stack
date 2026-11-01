# Installation & Getting Started

Comprehensive setup guide for integrating **NUICSS** across modern frontend frameworks, build tools, backend template engines, and standalone environments.

---

## 1. Quick Overview

NUICSS provides first-class integrations across every major web development environment:

| Platform / Tool              | Integration Path               | Package / Asset                  | Documentation Link                                           |
| :--------------------------- | :----------------------------- | :------------------------------- | :----------------------------------------------------------- |
| **Vite**                     | `vite.config.ts` plugin        | `@nofinite/nuicss/vite`          | [Vite Setup](#3-vite-react-vue-svelte)                       |
| **Next.js (App Router)**     | `next.config.mjs` wrapper      | `@nofinite/nuicss/next`          | [Next.js Setup](#4-nextjs-app-router)                        |
| **PostCSS**                  | `postcss.config.cjs` plugin    | `@nofinite/nuicss/postcss`       | [PostCSS Setup](#5-postcss-pipeline)                         |
| **Standalone Native Binary** | Pre-compiled native executable | `nuicss-windows-amd64.exe`       | [Native CLI](#6-standalone-native-binary-zero-nodejs)        |
| **Node CLI**                 | `npx nuicss` / global install  | `nuicss` npm package             | [CLI Guide](/nuicss/cli)                                     |
| **Browser CDN**              | Single `<script>` or `<link>`  | `index.global.js` / `styles.css` | [Browser CDN](#7-browser-cdn-zero-build)                     |
| **Non-Node Backends**        | Go, Python, PHP, Ruby, Rust    | Standalone CLI + watcher         | [Backend Templates](#8-non-node-backends-go-python-php-ruby) |

---

## 2. Package Installation

Install `@nofinite/nuicss` using your preferred package manager:

```bash
# pnpm (recommended)
pnpm add @nofinite/nuicss

# npm
npm install @nofinite/nuicss

# bun
bun add @nofinite/nuicss

# yarn
yarn add @nofinite/nuicss
```

---

## 3. Vite (React, Vue, Svelte)

NUICSS includes a dedicated Vite plugin that manages virtual stylesheet injection, LightningCSS optimization, and ultra-fast HMR:

### 3.1 Configure `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // or vue(), svelte()
import nuicss from '@nofinite/nuicss/vite';

export default defineConfig({
  plugins: [react(), nuicss()],
});
```

### 3.2 Import Virtual Stylesheet

In your application entry point (`src/main.tsx`, `src/main.ts`, or `src/index.js`):

```typescript
// Import virtual NUICSS entrypoint
import 'virtual:nuicss.css';
```

> **Note on Bundling:** The Vite plugin handles base tokens, resets, component superclasses, and scanned utilities in a single optimized pass. Do not duplicate imports of `@nofinite/nuicss/styles.css` when `virtual:nuicss.css` is present.

---

## 4. Next.js (App Router)

NUICSS provides the `withNuicss` Next.js plugin for full compatibility with Next.js 16 (App Router and Turbopack/Webpack):

### 4.1 Configure `next.config.mjs`

```javascript
import { withNuicss } from '@nofinite/nuicss/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your Next.js configuration options
};

export default withNuicss(nextConfig);
```

### 4.2 Import Styles in Root Layout

In Next.js App Router (`app/layout.tsx` or `app/layout.js`), import the canonical stylesheet:

```tsx
import type { Metadata } from 'next';
import '@nofinite/nuicss/styles.css';

export const metadata: Metadata = {
  title: 'My NUICSS App',
  description:
    'Built with NUICSS semantic superclasses and OKLCH design tokens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-page text-default antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
```

---

## 5. PostCSS Pipeline

For projects built on Astro, Webpack, Rollup, or custom PostCSS pipelines:

### 5.1 Configure `postcss.config.cjs`

```javascript
const nuicss =
  require('@nofinite/nuicss/postcss').default ||
  require('@nofinite/nuicss/postcss');

module.exports = {
  plugins: [nuicss()],
};
```

### 5.2 Add Directive in Your Input CSS

In your CSS input file (e.g., `src/input.css`):

```css
@nuicss;
```

Compile with PostCSS CLI:

```bash
npx postcss src/input.css -o dist/output.css --watch
```

---

## 6. Standalone Native Binary (Zero Node.js)

For non-JavaScript developers or Docker CI/CD environments where Node.js is not installed, NUICSS distributes pre-compiled standalone single-file executables powered by Bun.

### 6.1 Download and Run

Download the native binary for your architecture from GitHub releases or our CDN:

- **Windows x64:** `nuicss-windows-amd64.exe`
- **Linux x64:** `nuicss-linux-amd64`
- **Linux ARM64:** `nuicss-linux-arm64`
- **macOS Apple Silicon:** `nuicss-darwin-arm64`
- **macOS Intel:** `nuicss-darwin-amd64`

### 6.2 One-Line Command Execution

```powershell
# Windows
.\nuicss-windows-amd64.exe -i input.css -o static/styles.css --watch
```

```bash
# Linux / macOS
chmod +x nuicss-linux-amd64
./nuicss-linux-amd64 -i input.css -o static/styles.css --watch
```

The standalone binary contains all base design tokens, OKLCH scales, and component superclasses embedded internally. It generates production-ready stylesheets with **zero external dependencies**.

---

## 7. Browser CDN (Zero Build)

For rapid prototyping, interactive code playgrounds, or static JAMstack sites:

### Option A: Runtime JIT Engine (Dynamic DOM Scanning)

Include the runtime JIT script. It automatically scans your DOM and observes dynamic DOM mutations via an internal `MutationObserver`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>NUICSS CDN Demo</title>
    <!-- Browser JIT Runtime Engine -->
    <script src="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/index.global.js"></script>
  </head>
  <body class="bg-page text-default p-8">
    <div class="card max-w-md mx-auto p-6">
      <h2 class="text-xl font-bold">Hello NUICSS!</h2>
      <p class="text-muted mt-2">
        Zero-build runtime JIT with automatic DOM mutation observation.
      </p>
      <button class="btn btn-primary mt-4">Interactive Button</button>
    </div>
  </body>
</html>
```

### Option B: Static All-in-One Stylesheet

For instant rendering without JavaScript overhead:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/styles.min.css"
/>
```

---

## 8. Non-Node Backends (Go, Python, PHP, Ruby)

NUICSS integrates cleanly with backend web frameworks:

### Directory Conventions

```
my-backend-app/
├── templates/
│   ├── layout.html
│   └── index.html
├── static/
│   └── styles.css
└── input.css
```

### Run Watcher

```bash
# Start watcher during development
nuicss -i input.css -o static/styles.css --watch-files "templates/**/*.html" --watch
```

Whenever you modify an HTML template, the watcher debounces and rebuilds `static/styles.css` in under 35ms.

---

## 9. Next Steps

- Explore [**Component Superclasses**](/nuicss/superclasses) (`btn`, `card`, `input`, `badge`, `modal`).
- Master [**Theming & Design Tokens**](/nuicss/theming) with OKLCH palettes and automatic dark mode.
- Review the [**Tailwind Migration Guide**](/nuicss/guides/tailwind-migration) for converting legacy utility codebases.
- Configure [**`nuicss.config.ts`**](/nuicss/configuration) for custom themes and content pipelines.
