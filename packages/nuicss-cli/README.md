<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.nofinite.com/brand/oss/nuicss/logos/nuicss-horizontal-white.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://cdn.nofinite.com/brand/oss/nuicss/logos/nuicss-horizontal.svg">
  <img alt="NUICSS CLI" src="https://cdn.nofinite.com/brand/oss/nuicss/logos/nuicss-horizontal.svg" width="300">
</picture>

<br/>
<br/>

**The lightning-fast standalone compiler, linter, codemod, and component toolkit for the NUICSS design system.**

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  </a>
  <a href="https://opensource.nofinite.com/nuicss">
    <img alt="Documentation" src="https://img.shields.io/badge/Docs-OpenSource-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="https://www.npmjs.com/package/nuicss">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/nuicss?style=for-the-badge&logo=npm&logoColor=white&labelColor=slategray&color=%23000133">
  </a>
</p>

</div>

---

## Overview

`nuicss` is the official standalone command-line compiler and developer toolkit for the NUICSS ecosystem. Engineered for **instant native execution ($<3\text{ms}$ startup)** and **zero runtime dependencies**, it compiles production stylesheets, migrates legacy utility soup into semantic superclasses, lints codebase styling compliance, and scaffolds components across any web stack.

- ⚡ **Instant Native Execution:** Available as single native executables for Windows, Linux, and macOS (Apple Silicon & Intel) compiled via Bun, or as a lightweight 180 kB npm package.
- 🎯 **Universal File Watcher:** Natively watches and scans `.html`, `.tsx`, `.jsx`, `.vue`, `.svelte`, `.astro`, `.php`, `.templ`, `.blade.php`, `.jinja`, `.liquid`, `.twig`, `.ejs`, `.erb`, `.hbs`, `.mdx`, and arbitrary user globs.
- 🧠 **High-Throughput In-Memory Caching:** 50ms debounced build pipeline with single-file incremental re-reads and zero dropped file save events.
- 🎨 **Modular Layer Directives:** Granular stylesheet assembly via `@nuicss tokens;`, `@nuicss components;`, `@nuicss utilities;`, or unified `@nuicss;`.
- 🔄 **Local-First Resolution:** Automatically discovers and prioritizes local `node_modules/@nofinite/nuicss` when run in Node projects, with built-in embedded fallbacks for non-Node environments.
- 🗜️ **Production Minification:** Full-stylesheet compression powered by LightningCSS.
- 🛡️ **Zero Brand Leakage:** Hardened output interception guaranteeing pristine enterprise logs.
- 🚀 **In-CLI Self-Updater:** Seamless in-terminal binary upgrades via `nuicss upgrade`.

---

## Installation

### 1. Standalone Binary (Zero Node.js Required)

Install directly with a single terminal command:

#### Windows (PowerShell):

```powershell
irm https://opensource.nofinite.com/nuicss/install.ps1 | iex
```

#### macOS & Linux (Bash/Zsh):

```bash
curl -fsSL https://opensource.nofinite.com/nuicss/install.sh | bash
```

The installer automatically downloads the native binary for your architecture, sets permissions, and registers `nuicss` in your system `PATH`.

---

### 2. Via NPM / NPX (Zero Configuration)

Run on-demand with `npx`:

```bash
npx nuicss -i input.css -o dist/output.css --watch
```

Or install globally:

```bash
# npm
npm install -g nuicss

# pnpm
pnpm add -g nuicss
```

---

## Quick Start

### 1. Initialize Configuration & VS Code Custom Data

Generate a type-safe `nuicss.config.ts` and configure VS Code autocompletion:

```bash
nuicss init
```

### 2. Create Your Input Stylesheet

```css
/* input.css */
@nuicss;

/* Or assemble modular layers independently: */
/* @nuicss tokens; */
/* @nuicss components; */
/* @nuicss utilities; */
```

### 3. Compile Stylesheets

```bash
# One-time build
nuicss -i input.css -o dist/output.css --minify

# Live watch mode with arbitrary custom template patterns
nuicss -i input.css -o dist/output.css --watch --watch-files "templates/**/*.jinja,views/**/*.liquid"
```

---

## Command Reference

| Command              | Description                                           | Example                                             |
| :------------------- | :---------------------------------------------------- | :-------------------------------------------------- |
| `compile [patterns]` | Compile stylesheets into production CSS               | `nuicss compile -i input.css -o dist/output.css -m` |
| `init`               | Initialize configuration and IDE schemas              | `nuicss init`                                       |
| `add [component]`    | Scaffold UI component and view starter markup         | `nuicss add button`, `nuicss add media`             |
| `check [path]`       | Lint codebase for hardcoded hex and legacy soup       | `nuicss check src/`                                 |
| `migrate [path]`     | Codemod migrating legacy utility soup to superclasses | `nuicss migrate templates/ --dry-run`               |
| `tokens`             | Inspect OKLCH color palettes and semantic tokens      | `nuicss tokens`                                     |
| `list`               | List available components across Nofinite ecosystem   | `nuicss list`                                       |
| `upgrade`            | Check and self-update nuicss to latest release        | `nuicss upgrade`, `nuicss upgrade --check`          |
| `version`            | Print installed CLI version                           | `nuicss version`                                    |

---

### Component Scaffolding (`nuicss add`)

Scaffold components across the Nofinite ecosystem with starter markup:

```bash
nuicss add button
nuicss add dialog
nuicss add card
nuicss add badge
nuicss add table
nuicss add tabs
nuicss add dropdown
nuicss add chart
nuicss add sparkline
nuicss add kanban
nuicss add editor
nuicss add media
```

---

### Codebase Linting (`nuicss check`)

Ensure compliance with the NUICSS design system:

```bash
nuicss check
```

- **Hex Literal Detection:** Flags un-tokenized `#hex` literals inside styling attributes (`style="..."`, `class="bg-[#...]"`), while ignoring regular anchor tags (`<a href="#id">`) and issue links.
- **Superclass Optimization:** Detects 15 legacy utility clusters from Tailwind/Bootstrap and recommends their semantic NUICSS replacements.

---

### Automated Codemod Migration (`nuicss migrate`)

Automatically transform verbose utility soup into clean superclasses:

```bash
# Preview changes safely
nuicss migrate src/ --dry-run

# Apply transformations in-place
nuicss migrate src/
```

---

## Configuration (`nuicss.config.ts`)

NUICSS CLI natively evaluates `.ts`, `.mts`, and `.js` configuration files via `jiti`:

```ts
// nuicss.config.ts
import { defineConfig } from '@nofinite/nuicss';

export default defineConfig({
  // Custom scan targets
  content: [
    './templates/**/*.jinja',
    './views/**/*.html',
    './src/**/*.{tsx,jsx,vue}',
  ],
  // Additional watch directories
  watchFiles: ['./content/**/*.md'],
  theme: {
    // Custom design token overrides
  },
});
```

---

## Self-Updating (`nuicss upgrade`)

Keep your standalone compiler up to date with zero friction:

```bash
# Check if an update is available
nuicss upgrade --check

# Self-update binary to the latest GitHub Release
nuicss upgrade
```

---

## Official Brand Taxonomy

| Brand Name          | Package                               | Description                             |
| :------------------ | :------------------------------------ | :-------------------------------------- |
| **NUICSS**          | `nuicss` _(CLI)_ / `@nofinite/nuicss` | The design token engine & compiler      |
| **NUI**             | `@nofinite/nui`                       | Polymorphic accessible React primitives |
| **Nofinite Charts** | `@nofinite/charts`                    | Universal vector charting suite         |
| **Nofinite Kanban** | `@nofinite/kanban`                    | Fluid drag-and-drop workflow boards     |
| **Nofinite Markon** | `@nofinite/markon`                    | Modern Markdown WYSIWYG editor          |
| **Nofinite Media**  | `@nofinite/media`                     | Glassmorphic audio/video player         |
| **Nofinite Locale** | `@nofinite/locale`                    | Internationalization & formatting       |
| **Nofinite Utils**  | `@nofinite/utils`                     | High-performance isomorphic utilities   |

---

## License

Licensed under the [MIT License](./LICENSE). Copyright © 2026 NofiniteHQ.
