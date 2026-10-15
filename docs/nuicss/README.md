# NUICSS

> The unified OKLCH design token engine, component superclasses, and standalone CSS compiler for the Nofinite ecosystem.

---

## Overview

**NUICSS** (`@nofinite/nuicss`) is the foundational styling engine and single source of truth for the entire Nofinite ecosystem. It provides:

- **Perceptually Uniform OKLCH Tokens:** Ultra-vibrant color palettes with mathematically consistent contrast ratios across light and dark modes.
- **Component Superclasses:** Pre-engineered, high-performance semantic classes (`btn`, `card`, `input`, `badge`, `table-container`, `kanban-board`, `markon-editor`) that eliminate verbose utility clusters.
- **Unified Ecosystem Styling:** A single stylesheet import powers **NUI**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Charts**, and **Nofinite Media**.
- **Zero-Node Standalone CLI:** Native standalone binary and npm package (`nuicss`) for instant CSS compilation, codebase linting, and Tailwind migrations without Node.js overhead.

---

## Quickstart

### 1. Package Installation

```bash
npm install @nofinite/nuicss
# or
pnpm add @nofinite/nuicss
```

### 2. Single Stylesheet Import

Import the unified stylesheet in your application's entrypoint (`app/layout.tsx`, `main.tsx`, or `globals.css`):

```tsx
import '@nofinite/nuicss/styles.css';
```

### 3. Quickstart CDN

For rapid prototyping or HTML pages without build steps:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/styles.css"
/>
```

---

## Modular Subpaths

For fine-grained bundle optimization, NUICSS emits modular CSS subpaths:

```tsx
// Only core tokens, reset, and base UI components
import '@nofinite/nuicss/dist/theme.css';

// Dedicated domain component stylesheets
import '@nofinite/nuicss/dist/kanban.css'; // Kanban board & DND geometry
import '@nofinite/nuicss/dist/markon.css'; // Markon editor & TipTap styles
import '@nofinite/nuicss/dist/widgets.css'; // Combined domain widget styles
```

---

## Core Semantic Superclasses

| Superclass      | Purpose                                                | Example Usage                                         |
| :-------------- | :----------------------------------------------------- | :---------------------------------------------------- |
| `btn`           | Base interactive button with OKLCH hover/active states | `<button className="btn btn-primary">Save</button>`   |
| `card`          | Elevated surface with border and subtle shadow         | `<div className="card">Content</div>`                 |
| `input`         | Accessible text input field with focus ring            | `<input className="input" placeholder="Search..." />` |
| `badge`         | Status and label indicator pill                        | `<span className="badge badge-success">Active</span>` |
| `kanban-board`  | Flex column layout and drag-and-drop drop indicators   | `<div className="kanban-board">...</div>`             |
| `markon-editor` | Markdown editor canvas, toolbar, and bubble menu       | `<div className="markon-editor">...</div>`            |

---

## The Standalone CLI & Compiler (`nuicss`)

`nuicss` is the official standalone command-line compiler and developer toolkit for NUICSS. Available as a single native binary (zero Node.js required) or on-demand via `npx nuicss`:

```bash
# 1. Initialize configuration and IDE autocomplete
nuicss init

# 2. Compile CSS with live watching and minification
nuicss -i input.css -o output.css -w -m

# 3. Lint codebase for hardcoded hex and legacy utility clusters
nuicss check src/

# 4. Migrate existing Tailwind classes to NUICSS superclasses
nuicss migrate src/ --dry-run
```

For full documentation on flags, custom watch patterns, component scaffolding, and configuration, see the [**NUICSS CLI Documentation**](./cli.md).
