<div align="center">

# NUI CSS

**The next-generation JIT utility CSS engine. Blazing fast, zero-configuration out of the box, and perfectly compliant with modern web standards.**

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

NUI CSS provides a highly optimized **Just-In-Time (JIT) compiler**. By reading your source files, it compiles exactly the CSS you need—and absolutely nothing more—in milliseconds.

* **Semantic Tokens:** Built-in shortcuts for scalable UI design (`.bg-surface`, `.text-muted`, `.border-subtle`).
* **Zero-Config by Default:** Drop it into Vite, PostCSS, or a `<script>` tag and instantly start using standard utilities like `.flex`, `.text-primary`, and `.p-4`.
* **Arbitrary Values:** Compile custom layouts using brackets: `w-[343px]`, `grid-cols-[200px_1fr]`, or `bg-[#ff0055]`.
* **Logic-Driven Variants:** Fully supports modern pseudo-classes and state logic (`has-[:checked]`, `peer-focus`, `group-has-[.active]`).
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

### 1. CDN (Easiest)

For prototyping or standard HTML/HTMX/Templ stacks, just include the script in your `<head>`. It automatically observes DOM mutations and injects compiled CSS in real-time.

```html
<!-- 1. The Nuicss variables and reset -->
<link rel="stylesheet" href="https://unpkg.com/@nofinite/nuicss@latest/dist/index.css" />

<!-- 2. The Nuicss JIT Runtime Engine -->
<script src="https://unpkg.com/@nofinite/nuicss@latest/dist/index.global.js"></script>
```

### 2. Vite (Recommended for SPAs)

NUI CSS integrates perfectly into Vite for HMR and instant class generation.

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

Import the CSS engine into your application's root entry file (e.g., `main.tsx` or `App.tsx`):

```tsx
// main.tsx
import '@nofinite/nuicss/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### 3. PostCSS

If you aren't using Vite, NUI CSS operates as a standard PostCSS plugin.

```js
// postcss.config.js
import nuicssPostcss from '@nofinite/nuicss/postcss';

export default {
  plugins: [
    nuicssPostcss()
  ]
};
```

Import the CSS engine in your main CSS file:

```css
/* index.css */
@import '@nofinite/nuicss/styles.css';
```

---

## Configuration & Extensibility

NUI CSS works instantly out of the box, but you can heavily customize the engine by creating a `nuicss.config.ts` (or `.js`) file in your project root.

```ts
import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset()
  ],
  // 1. Scan specific files
  content: {
    pipeline: {
      include: ['./src/**/*.{tsx,jsx,html}']
    }
  },
  // 2. Override default theme tokens
  theme: {
    colors: {
      primary: '#ff0055'
    }
  }
});
```

---

## Developer DX Features

NUI CSS comes with helper utilities designed for modern web apps.

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
## Acknowledgements

NUI CSS's underlying compilation engine is powered by the incredible [UnoCSS](https://github.com/unocss/unocss) ecosystem.

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).
