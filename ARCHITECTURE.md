# Nofinite Ecosystem Architecture

Welcome to the architectural specification for the Nofinite open-source ecosystem. This document defines the macro system topology, packaging boundaries, styling engine invariants, and design principles governing all packages in this monorepo.

---

## 1. System Topology & Package Roles

The Nofinite ecosystem is structured as a multi-package monorepo designed for high performance, zero runtime overhead, and strict separation of concerns.

```
                      ┌────────────────────────────────────────┐
                      │                 NUICSS                 │
                      │  Sole styling & token engine (OKLCH)   │
                      └──────────────────┬─────────────────────┘
                                         │ Consumed by all
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│       NUI       │             │ Nofinite Kanban │             │ Nofinite Markon │
│ Core components │             │ Workflow boards │             │ Markdown editor │
└─────────────────┘             └─────────────────┘             └─────────────────┘
         ▼                               ▼                               ▼
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│ Nofinite Charts │             │ Nofinite Media  │             │ Nofinite Locale │
│ Visualizations  │             │ Audio & video   │             │ i18n & l10n     │
└─────────────────┘             └─────────────────┘             └─────────────────┘
```

### Official Brand Taxonomy

| Brand Name          | Package Specifier  | Core Responsibility                                                                                         |
| :------------------ | :----------------- | :---------------------------------------------------------------------------------------------------------- |
| **NUICSS**          | `@nofinite/nuicss` | Single source of truth CSS engine, OKLCH design tokens, resets, superclasses, and layout primitives.        |
| **NUI**             | `@nofinite/nui`    | Core headless & polymorphic React UI component library (buttons, modals, dialogs, inputs, tabs, dropdowns). |
| **Nofinite Charts** | `@nofinite/charts` | Modern, responsive data visualizations and chart components.                                                |
| **Nofinite Kanban** | `@nofinite/kanban` | Accessible drag-and-drop kanban boards, columns, and task cards.                                            |
| **Nofinite Markon** | `@nofinite/markon` | Modern markdown WYSIWYG editor with floating bubble menus, codeblock highlight, and task lists.             |
| **Nofinite Media**  | `@nofinite/media`  | Media player primitives (video/audio) and media token bridges.                                              |
| **Nofinite Locale** | `@nofinite/locale` | Internationalization, timezone formatting, and locale translation engines.                                  |
| **Nofinite Utils**  | `@nofinite/utils`  | Pure TypeScript utilities, collection helpers, and runtime guards.                                          |

> **Brand Invariant:** In all documentation, natural conversation, and commit summaries, engineers and AI agents must refer to packages using their official brand names (**NUICSS**, **NUI**, **Nofinite Kanban**, etc.) rather than raw npm package strings, which are reserved for code imports and CLI commands.

---

## 2. The Zero Downstream CSS Invariant

### Single Source of Truth for Styling

**NUICSS (`@nofinite/nuicss`) is the sole and absolute CSS engine for the entire ecosystem.**

All downstream packages (**NUI**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Charts**, **Nofinite Media**, **Nofinite Locale**, **Nofinite Utils**) **MUST NEVER** author, bundle, or emit independent `.css` files.

### Why Downstream Packages Never Author CSS:

1. **Zero Import Fatigue:** End users only need a single stylesheet import (`import '@nofinite/nuicss/styles.css'`) or CDN link to style all Nofinite components across their entire application.
2. **Elimination of Cascade Conflicts:** Multiple independent CSS bundles inevitably clash with `@layer` order, CSS custom property scopes, and specificity.
3. **No Bundle Duplication:** Independent build scripts bundling UnoCSS or Tailwind duplicate base resets and token maps across every package (previously injecting over 400 kB of redundant CSS).
4. **Instant Theming Across Every Library:** Because Kanban, Markon, and Charts consume semantic NUICSS superclasses (`kanban-board`, `markon-editor`, `chart-container`), switching the OKLCH theme in NUICSS automatically themes the entire ecosystem simultaneously.

### Modular Subpath Architecture

For developers who do not want the complete unified stylesheet, NUICSS exports standalone, modular CSS subpaths:

- `@nofinite/nuicss/styles.css` — Complete ecosystem stylesheet (base tokens + core + all widgets).
- `@nofinite/nuicss/kanban.css` — Kanban board layout & drag-and-drop indicator geometry.
- `@nofinite/nuicss/markon.css` — Markon editor toolbar, footer, bubble menu pill & TipTap styles.
- `@nofinite/nuicss/widgets.css` — All interactive domain widget styles combined.

Downstream package stylesheets (`@nofinite/kanban/styles.css`, `@nofinite/markon/styles.css`, `@nofinite/charts/styles.css`) are strictly maintained as thin, backward-compatible `@import '@nofinite/nuicss/styles.css'` shims for legacy compatibility.

---

## 3. Package Boundaries & Component Model

### Headless & Polymorphic Logic

- Downstream packages provide pure React component trees, state machines, keyboard navigation, and accessibility contracts.
- Components use `asChild` / `Slot` polymorphic composition to allow consumers to render custom DOM elements while retaining full behavior.
- Styling is applied purely via semantic superclasses and data attributes:
  ```tsx
  // Example: Nofinite Kanban applying NUICSS superclasses
  <div className="kanban-board" data-orientation="horizontal">
    <div className="kanban-column" data-droppable="true">
      <div className="kanban-card" data-dragging={isDragging}>
        {children}
      </div>
    </div>
  </div>
  ```

### Build & Packaging Architecture

- **Preserved Modules:** NUI and domain packages compile with `preserveModules: true` in Rollup, ensuring fine-grained tree-shaking where unused components are completely eliminated from consumer bundles.
- **Node.js Tooling Safety:** Never import raw CSS into TypeScript modules evaluated directly by Node.js tooling (such as Nx project graph processing, Vitest, or Jiti).
- **Public Package Isolation:** Public packages must remain self-contained and never import private workspace-internal development packages.

---

## 4. Documentation Strategy: Central Hub (`docs/`)

To prevent package directory clutter while ensuring documentation never drifts from code:

- **Central Markdown Ground Truth (`d:\stack\docs/`):**  
  All canonical documentation lives in the central `docs/` folder at the root of `stack`. Each subfolder (`docs/nuicss/`, `docs/kanban/`, `docs/charts/`, etc.) directly mirrors the route structure of the public documentation portal at `d:\oss-docs/content/docs/`.
- **Package `README.md`:**  
  Inside `packages/<pkg>/README.md`, maintain lean, focused documentation specifically tailored for npmjs.com and GitHub package landing pages (installation, zero-config quickstart, and direct links to full docs).
- **The Cross-Repo Docs Sync Contract:**  
  Developers working in `stack` update the pure Markdown in `docs/<pkg>/`. The `oss-docs` portal consumes this content and enriches it with interactive Next.js client components (`<ComponentPreview />`), live sandboxes, and Theme Studio pickers.

---

## 5. Release & Versioning Strategy

### Two-Tier Commit vs. Release Protocol

- **Local Commits = Safety Checkpoints:**  
  Local git commits are made frequently after each working functional step. They serve as safety savepoints to protect working code and enable instant rollback. A local commit is **not** an NPM release.
- **Changesets = Pre-Release Intent Tracking:**  
  When a feature, bugfix, or architectural consolidation is completed in `packages/*`, create a `.changeset/<name>.md` file with that commit. This records the SemVer impact (`patch`, `minor`, `major`) without modifying `package.json`.
- **Release Cuts = Batched Milestones:**  
  When ready to publish to NPM, running `npx changeset version` automatically consumes pending changesets, bumps `package.json` versions, and compiles `CHANGELOG.md` files in a clean, isolated release commit.
