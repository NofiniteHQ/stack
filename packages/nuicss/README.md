<div align="center">

# NUI CSS

**A zero-config, semantic utility CSS framework designed for modern web applications and effortless runtime theming.**

<p align="center">
  <a href="https://sass-lang.com/">
    <img alt="Sass Compiled" src="https://img.shields.io/badge/CSS-Zero_Config-CC6699?style=for-the-badge&logo=sass&logoColor=white">
  </a>

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

NUI CSS provides a highly optimized, ahead-of-time (AOT) compiled utility class engine. It completely eliminates build-step complexities and solves the "dark mode class soup" by leveraging semantic CSS variables. Build beautiful, responsive layouts without ever touching a configuration file.

* **Zero-Config:** Pure CSS. No PostCSS, no configuration files, and no JavaScript build steps required. Just link and build.
* **Semantic Theming:** Effortless dark mode and runtime customizability powered by native CSS variables (e.g., `bg-surface`, `text-primary`). 
* **Enterprise-Ready:** Ships with both a standard version for rapid application development and a collision-proof `nui-` prefixed version to protect distributed UI components.

---

## Installation

```bash
# pnpm
pnpm add @nofinite/nuicss

# npm
npm install @nofinite/nuicss

# yarn
yarn add @nofinite/nuicss
```

### CDN (No build step)

You can use NUICSS directly in your HTML without any package manager or build tools.

**Clean version (Standard utilities like `.flex` and `.p-4`):**

```html
<link
  rel="stylesheet"
  href="[https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/index.css](https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/index.css)"
/>

```

**Prefixed version (Collision-proof utilities like `.nui-flex` and `.nui-p-4`):**

```html
<link
  rel="stylesheet"
  href="[https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/prefixed.css](https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/prefixed.css)"
/>

```

---

## Quick Start

### 1. HTML Prototype

Simply link the CSS file from the CDN and start using the utility classes directly in your markup.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NUI CSS App</title>
  <link rel="stylesheet" href="[https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/index.css](https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/index.css)" />
</head>
<body class="bg-surface text-primary p-8">
  
  <div class="max-w-md mx-auto shadow-md rounded-lg p-6 border border-subtle">
    <h1 class="text-2xl font-bold mb-4">Hello NUI CSS</h1>
    <p class="text-muted">Building fast, semantic UIs without the configuration.</p>
  </div>

</body>
</html>

```

### 2. React / Modern Bundlers (Next.js, Vite, etc.)

If you installed via a package manager, import the utilities directly into your application's root layer (e.g., `layout.tsx`, `main.tsx`, or `App.jsx`):

```tsx
// 1. Import the styling engine
import '@nofinite/nuicss'; // Standard clean utilities (.flex, .p-4)
// import '@nofinite/nuicss/prefixed'; // Collision-proof utilities (.nui-flex, .nui-p-4)

// 2. Build your component
export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4">
      <div className="p-8 shadow-lg rounded-xl border border-default w-full max-w-lg">
        <h1 className="text-3xl font-sans font-bold text-primary mb-2">
          Welcome to NUI CSS
        </h1>
        <p className="text-muted mb-6">
          Building fast, semantic UIs without the configuration.
        </p>
        <button className="bg-primary text-inverse px-4 py-2 rounded-md hover:opacity-80 transition-all" onClick={() => window.open("https://opensource.nofinite.com/docs/nuicss", "_blank", "noreferrer")>
          Get Started
        </button>
      </div>
    </div>
  );
}

```

---

## Documentation

For full setup guides, the complete utility class reference, and theming instructions, [read documentation](https://opensource.nofinite.com/docs/nuicss).

## License

This project is licensed under the
[Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
