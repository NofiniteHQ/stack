# NUICSS CLI & Standalone Compiler

The official standalone command-line compiler, linter, codemod, and component toolkit for the **NUICSS** design system.

---

## Overview

`nuicss` is the high-performance CLI compiler and developer toolkit for the NUICSS ecosystem. Engineered for **instant native execution (under 3ms startup)** and **zero runtime dependencies**, it compiles production stylesheets, migrates legacy utility soup into semantic superclasses, lints codebase styling compliance, and scaffolds components across any web stack.

- ⚡ **Instant Native Execution:** Available as single native standalone binaries for Windows, Linux, and macOS (compiled via Bun with zero Node.js required), or as a lightweight npm package.
- 🎯 **Universal File Watcher:** Natively watches and scans `.html`, `.tsx`, `.jsx`, `.vue`, `.svelte`, `.astro`, `.php`, `.templ`, `.blade.php`, `.jinja`, `.liquid`, `.twig`, `.ejs`, `.erb`, `.hbs`, `.mdx`, and arbitrary user-defined globs.
- 🧠 **High-Throughput In-Memory Caching:** 50ms debounced build pipeline with single-file incremental re-reads and zero dropped file save events.
- 🎨 **Modular Layer Directives:** Granular stylesheet assembly via `@nuicss tokens;`, `@nuicss components;`, `@nuicss utilities;`, or unified `@nuicss;`.
- 🔄 **Local-First Resolution:** Automatically discovers and prioritizes local `node_modules/@nofinite/nuicss` in Node projects, with built-in embedded fallbacks for non-Node environments.
- 🗜️ **Production Minification:** Full-stylesheet compression powered by LightningCSS.
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

### 2. Via Package Managers

Run on-demand using your preferred package runner:

```bash
# npx
npx nuicss -i input.css -o dist/output.css --watch

# bunx
bunx nuicss -i input.css -o dist/output.css --watch
```

Or install globally:

```bash
# npm
npm install -g nuicss

# pnpm
pnpm add -g nuicss

# bun
bun add -g nuicss
```

---

## Quickstart Workflow

### 1. Initialize Configuration & IDE Autocomplete

Generate a type-safe `nuicss.config.ts` and configure native VS Code / Cursor autocomplete in `.vscode/settings.json`:

```bash
nuicss init
```

### 2. Create Your Input Stylesheet

Create your entry CSS file with the `@nuicss` directive:

```css
/* input.css */
@nuicss;

/* Or assemble modular layers independently: */
/* @nuicss tokens; */
/* @nuicss components; */
/* @nuicss utilities; */
```

### 3. Compile Stylesheets

Run one-time compilation or live watch mode:

```bash
# One-time production build with minification
nuicss -i input.css -o dist/output.css --minify

# Live watch mode
nuicss -i input.css -o dist/output.css --watch

# Live watch mode with custom template patterns
nuicss -i input.css -o dist/output.css --watch --watch-files "templates/**/*.jinja,views/**/*.liquid"
```

---

## Command Reference

| Command              | Description                                           | Example                                             |
| :------------------- | :---------------------------------------------------- | :-------------------------------------------------- |
| `compile [patterns]` | Compile stylesheets into production CSS               | `nuicss compile -i input.css -o dist/output.css -m` |
| `init`               | Initialize configuration and IDE schemas              | `nuicss init`                                       |
| `add [component]`    | Scaffold UI component and view starter markup         | `nuicss add button`, `nuicss add dialog`            |
| `check [path]`       | Lint codebase for hardcoded hex and legacy soup       | `nuicss check src/`                                 |
| `migrate [path]`     | Codemod migrating legacy utility soup to superclasses | `nuicss migrate templates/ --dry-run`               |
| `tokens`             | Inspect OKLCH color palettes and semantic tokens      | `nuicss tokens`                                     |
| `list`               | List available components across Nofinite ecosystem   | `nuicss list`                                       |
| `upgrade`            | Check and self-update nuicss to latest release        | `nuicss upgrade`, `nuicss upgrade --check`          |
| `version`            | Print installed CLI version                           | `nuicss version`                                    |

---

### Stylesheet Compilation (`nuicss compile`)

```bash
nuicss compile [patterns] [options]
```

#### Options:

- `-i, --input <file>`: Input CSS file path containing `@nuicss` directives (use `-` for stdin).
- `-o, --output <file>`: Output CSS file path (default: `dist/output.css`, use `-` for stdout).
- `-w, --watch`: Watch scanned files for changes and recompile incrementally.
- `--watch-files <patterns>`: Additional glob patterns to watch (comma-separated).
- `-m, --minify`: Compress output CSS using LightningCSS.
- `-c, --config <file>`: Path to custom configuration file (default: `nuicss.config.ts`).

#### Modular Layer Directives

NUICSS supports granular stylesheet assembly directly in your input CSS:

```css
/* 1. Only OKLCH color tokens, semantic variables, and modern reset */
@nuicss tokens;

/* 2. Only component superclasses (btn, card, input, badge, table, etc.) */
@nuicss components;

/* 3. Only scanned JIT utility classes extracted from your markup */
@nuicss utilities;

/* 4. Complete unified bundle (tokens + components + utilities) */
@nuicss;
```

---

### Component Scaffolding (`nuicss add`)

Scaffold components across the Nofinite ecosystem with clean starter markup:

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

Audit your project to ensure strict adherence to the NUICSS design system:

```bash
nuicss check src/
```

- **Hex Literal Detection:** Flags un-tokenized `#hex` literals inside styling attributes (`style="..."`, `class="bg-[#...]"`), while ignoring regular anchor links (`<a href="#section">`).
- **Superclass Optimization:** Detects 15 legacy utility clusters from Tailwind/Bootstrap and recommends their semantic NUICSS replacements.

---

### Automated Codemod Migration (`nuicss migrate`)

Transform verbose utility soup into clean superclasses automatically:

```bash
# Preview changes safely without modifying files
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
    colors: {
      primary: '#09090b',
    },
  },
});
```

---

## Non-Node Framework Integration

Because `nuicss` is available as a standalone executable, it integrates seamlessly into backend stacks without requiring `npm` or `node_modules`:

### Go (Templ / HTML Templates)

```bash
# In Makefile or dev script:
nuicss -i static/input.css -o static/styles.css --watch --watch-files "views/**/*.templ"
```

### Python (Django / Flask / Jinja)

```bash
# Watch Jinja templates and write to static assets
nuicss -i static/css/input.css -o static/css/bundle.css --watch --watch-files "templates/**/*.html"
```

### PHP (Laravel Blade / Symfony Twig)

```bash
nuicss -i resources/css/input.css -o public/css/app.css --watch --watch-files "resources/views/**/*.blade.php"
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
