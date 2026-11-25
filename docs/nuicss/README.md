# NUICSS Documentation Hub

> The unified OKLCH design token engine, component superclasses, and standalone CSS compiler for the Nofinite ecosystem.

---

## Overview

**NUICSS** (`@nofinite/nuicss`) is the foundational styling engine and single source of truth for the entire Nofinite ecosystem. It provides:

- **Perceptually Uniform OKLCH Tokens:** Ultra-vibrant color palettes with mathematically consistent contrast ratios across light and dark modes.
- **Component Superclasses:** Pre-engineered, high-performance semantic classes (`btn`, `card`, `input`, `badge`, `modal`, `alert`, `table-container`, `kanban-board`, `markon-editor`) that eliminate verbose utility clusters.
- **Unified Ecosystem Styling:** A single stylesheet import powers **NUI**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Charts**, and **Nofinite Media**.
- **Zero-Node Standalone CLI:** Native standalone binary and npm package (`nuicss`) for instant CSS compilation, codebase linting, and Tailwind migrations without Node.js overhead.

---

## Documentation Index

### Getting Started

- [**Installation & Setup**](./installation.md) — Quickstart across Vite (zero-config), Next.js, PostCSS, Standalone CLI, and CDN.
- [**Standalone CLI Compiler**](./cli.md) — Command reference: `nuicss build`, `nuicss watch`, `nuicss check`, `nuicss migrate`.
- [**Configuration Reference**](./configuration.md) — Customizing `nuicss.config.ts`, themes, and scanning pipelines.
- [**IDE Setup (VS Code & Cursor)**](./ide-setup.md) — Pure native LSP autocomplete with zero marketplace plugins.

### Core Concepts & System Architecture

- [**Engine Architecture**](./architecture.md) — High-throughput JIT compiler, modular `@nuicss` layers, and `@apply`.
- [**Theming & Design Tokens**](./theming.md) — OKLCH perceptual colors, neutral-default foundations, semantic surfaces, and automatic dark mode.
- [**Component Superclasses**](./superclasses.md) — Comprehensive catalog: `btn`, `card`, `input`, `badge`, `modal`, `tabs`, `alert`.

### Migration & Guides

- [**Automated Migration Codemod**](./migration.md) — Automated codebase migration from Tailwind to NUICSS.
- [**Tailwind-to-NUICSS Migration Cheat Sheet**](./guides/tailwind-migration.md) — Side-by-side Rosetta Stone mappings.

---

## Architectural Invariants

1. **Single Source of Truth for Design Tokens & Styles:** `@nofinite/nuicss` is the sole source of truth for design tokens, OKLCH palettes, and component superclasses across the entire ecosystem.
2. **The Zero Downstream CSS Invariant:** Downstream packages (`NUI`, `Nofinite Kanban`, `Nofinite Markon`, `Nofinite Charts`, `Nofinite Media`, `Nofinite Locale`, `Nofinite Utils`) never compile or bundle independent `.css` files.
3. **Dual Syntax Support:** Every superclass supports both concise syntax (`btn`, `card`, `alert`) and namespace-isolated syntax (`nui-btn`, `nui-card`, `nui-alert`).
