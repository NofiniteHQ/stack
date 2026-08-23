<div align="center">

# NUI CSS v3

**The next-generation utility CSS engine. Powered by UnoCSS for blazing fast, on-demand class generation, and perfectly compliant with modern web standards.**

<p align="center">
  <a href="https://opensource.nofinite.com/docs/nuicss">
    <img alt="Documentation" src="https://img.shields.io/badge/Docs-OpenSource-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="https://www.npmjs.com/package/@nofinite/nuicss">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40nofinite%2Fnuicss?style=for-the-badge&logo=npm&logoColor=white&labelColor=slategray&color=%23000133">
  </a>
</p>

</div>

---

## Overview

NUI CSS v3 is built entirely on top of **UnoCSS**. It provides a heavily optimized preset that gives you the exact design tokens, components, and animations used by Nofinite's core libraries.

* **Framework Agnostic:** Pure CSS components with no JS dependencies. 
* **Zero-Config by Default:** Drop it into Vite, PostCSS, or a `<script>` tag and instantly start using utilities like `.flex`, `.text-primary`, and `.p-4`.
* **Arbitrary Values:** Instantly compile custom layouts using brackets: `w-[343px]`, `grid-cols-[200px_1fr]`, or `bg-[#ff0055]`.
* **Built-in Keyframes:** Ships with modern animations: `animate-zoom-in`, `animate-zoom-out`, `animate-slide-up`, `animate-slide-down`.

---

## Installation

```bash
# pnpm
pnpm add -D @nofinite/nuicss

# npm
npm install -D @nofinite/nuicss
```

---

## Setup

### 1. Vite (Recommended for SPAs)

NUI CSS integrates perfectly into Vite for HMR and instant class generation via our wrapper over the UnoCSS plugin.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { nuicssVitePlugin } from '@nofinite/nuicss';

export default defineConfig({
  plugins: [
    nuicssVitePlugin()
  ],
});
```

Import the base CSS variables and the virtual module into your application's root entry file (e.g., `main.tsx` or `App.tsx`):

```tsx
// main.tsx
import '@nofinite/nuicss/styles.css'; // Core variables and reset
import '@nofinite/nuicss/virtual.css'; // Auto-generated utility classes
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### 2. CDN (Plug and Play)

For quick prototyping or standard HTML stacks, you can use our bundled browser runtime. It automatically observes DOM mutations and injects compiled CSS in real-time, just like standard UnoCSS/Tailwind CDNs, but packed with NUI CSS tokens.

```html
<head>
  <!-- 1. The Nuicss variables and reset -->
  <link rel="stylesheet" href="https://unpkg.com/@nofinite/nuicss@latest/dist/index.css" />

  <!-- 2. The Nuicss JIT Runtime Engine -->
  <script src="https://unpkg.com/@nofinite/nuicss@latest/dist/index.global.js"></script>
</head>
```

### 3. PostCSS

If you aren't using Vite, NUI CSS operates as a standard PostCSS plugin via `@unocss/postcss`.

```js
// postcss.config.js
export default {
  plugins: {
    '@nofinite/nuicss/postcss': {}
  }
};
```

---

## Configuration & Extensibility

You can heavily customize the engine by creating a `nuicss.config.ts` (or `.js`) file in your project root. It uses standard UnoCSS configuration schemas.

```ts
// nuicss.config.ts
import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset()
  ],
  // 1. Override default theme tokens
  theme: {
    colors: {
      primary: '#ff0055'
    }
  },
  // 2. Scan specific files (NUI CSS automatically scans src/**/*.{ts,tsx} by default)
  content: {
    pipeline: {
      include: ['./src/**/*.{tsx,jsx,html}']
    }
  }
});
```

---

## Developer DX Features

### JS/TS Theme Resolver
When you need to draw on a `<canvas>` or use charting libraries, you often need the exact hex value of a CSS variable.

```ts
import { getThemeValue } from '@nofinite/nuicss';

// Safely extracts the computed value (e.g., "#2563eb")
const primaryColor = getThemeValue('color', 'primary'); 
```

### Anti-FOUC Dark Mode Sync
When implementing dark mode via the `.dark` class, users might see a Flash of Unstyled Content (FOUC) while React boots up. Inject our provided script into your HTML `<head>` to fix this perfectly.

```tsx
import { DARK_MODE_SCRIPT } from '@nofinite/nuicss';

export function Head() {
  return (
    <head>
      {/* Synchronizes localStorage and system preference synchronously */}
      <script dangerouslySetInnerHTML={{ __html: DARK_MODE_SCRIPT }} />
    </head>
  );
}
```

---

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).
