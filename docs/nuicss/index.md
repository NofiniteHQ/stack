# NUICSS

> Pure semantic superclasses and OKLCH design token engine for modern web interfaces.

---

## Architectural Invariants

- **Single Source of Truth for Design Tokens & Styles:** `@nofinite/nuicss` is the sole source of truth for design tokens, OKLCH color palettes, and component superclasses across the entire ecosystem.
- **The Zero Downstream CSS Invariant:** Downstream packages (`NUI`, `Nofinite Kanban`, `Nofinite Markon`, `Nofinite Charts`, `Nofinite Media`, `Nofinite Locale`, `Nofinite Utils`) **MUST NEVER** author, compile, or bundle independent `.css` files. All component layouts, geometry, animations, drag-and-drop indicators, and token maps belong exclusively in `packages/nuicss`.
- **Universal Framework Agnostic Engine:** Fully compatible with plain HTML/CDN, Next.js (Turbopack & App Router), Vite (Vue, Svelte, React), SvelteKit, Astro, and backend template engines (HTMX, Go templates, Blade, ERB).

---

## Why NUICSS?

- **Component Superclasses**: Eliminates messy 15-class utility clusters with clean, semantic superclasses (`btn`, `card`, `input`, `badge`, `table-container`, `kanban-board`, `markon-editor`).
- **Instant On-Demand Compilation**: Powered by a high-speed JIT engine, compiling thousands of utility classes in milliseconds.
- **Turbopack & Next.js First-Class Support**: Includes `withNuicss` for seamless Turbopack alias resolution and zero-friction builds.
- **Perceptual OKLCH Design Tokens**: Harmonized design tokens (`bg-page`, `bg-surface`, `text-default`, `border-default`) for flawless dark mode transitions without color distortion.
- **Full Modern CSS Feature Set**: Supports arbitrary values (`w-[320px]`), variant grouping (`hover:(bg-primary text-white)`), responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`), and native CSS variables.

---

## Multi-Framework Usage

### 1. Plain HTML / CDN (Zero Build)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>NUICSS Vanilla App</title>
    <!-- Load NUICSS precompiled stylesheet or JIT script -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/index.css"
    />
  </head>
  <body class="bg-page text-default p-8">
    <div class="card max-w-md mx-auto p-6 space-y-4">
      <h3 class="card-title text-lg">Vanilla HTML</h3>
      <p class="card-description">
        Semantic superclasses work directly on standard HTML elements.
      </p>
      <button class="btn btn-primary">Action</button>
    </div>
  </body>
</html>
```

### 2. Vue 3

```vue
<script setup lang="ts">
import '@nofinite/nuicss/styles.css';
</script>

<template>
  <div class="card max-w-md mx-auto p-6">
    <h3 class="card-title text-lg">Vue Component</h3>
    <button class="btn btn-primary mt-4">Submit</button>
  </div>
</template>
```

### 3. Svelte 5

```svelte
<script lang="ts">
  import '@nofinite/nuicss/styles.css';
</script>

<div class="card max-w-md mx-auto p-6">
  <h3 class="card-title text-lg">Svelte Component</h3>
  <button class="btn btn-primary mt-4">Submit</button>
</div>
```

### 4. React & Next.js

```tsx
import React from 'react';
import '@nofinite/nuicss/styles.css';

export function CardExample() {
  return (
    <div className="card max-w-md mx-auto p-6">
      <h3 className="card-title text-lg">React Component</h3>
      <button className="btn btn-primary mt-4">Submit</button>
    </div>
  );
}
```

---

## Core Sections

- [**Installation & Setup**](/nuicss/installation) — Add NUICSS to Next.js (Turbopack), Vite, or PostCSS projects.
- [**CLI & Standalone Compiler**](/nuicss/cli) — Standalone compilation, live file watching, codebase linting, and automated migrations.
- [**Component Superclasses**](/nuicss/superclasses) — Complete guide to `btn`, `card`, `input`, `badge`, and layout superclasses.
- [**Theming & Design Tokens**](/nuicss/theming) — Explore OKLCH tokens, semantic surfaces, and automatic dark mode.
- [**Theme Studio**](/nuicss/theme-studio) — Interactive sandbox to customize color palettes and preview components live.
- [**Configuration**](/nuicss/configuration) — Customize `nuicss.config.ts`, presets, and content scanning pipelines.
- [**Architecture & Engine**](/nuicss/architecture) — Learn how the JIT compiler, layers, and directives operate.
- [**Utilities Reference**](/nuicss/utilities/layout) — Comprehensive reference guides for layout, flexbox, grid, spacing, and typography.
