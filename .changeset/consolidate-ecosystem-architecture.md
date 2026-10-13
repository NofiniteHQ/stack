---
'@nofinite/nuicss': minor
'@nofinite/kanban': minor
'@nofinite/markon': minor
'@nofinite/charts': minor
'@nofinite/media': patch
'@nofinite/nui': patch
---

### Unified Single-Engine Styling Architecture

Consolidated ecosystem styles into `@nofinite/nuicss` as the single source of truth and unified styling engine across all packages.

- **`@nofinite/nuicss`:**

  - Integrated 455 lines of Kanban board layout and drag-and-drop indicator geometry into `packages/nuicss/src/styles/theme.css` Section 15.c.
  - Integrated Markon editor toolbar, footer, and floating bubble menu pill styles (`.markon-bubble-menu`) into `theme.css` Section 6.
  - Integrated Vidstack media player OKLCH token bridge (`.nui-vidstack-player`, `--media-brand`) into `theme.css` Section 15.d.
  - Emitted dedicated modular subpaths from NUICSS: `dist/kanban.css`, `dist/markon.css`, and `dist/widgets.css`.

- **`@nofinite/kanban`:**

  - Migrated drag-and-drop styles to NUICSS.
  - Converted `dist/styles.css` to a backward-compatible `@import '@nofinite/nuicss/styles.css'` shim.

- **`@nofinite/markon`:**

  - Standardized codeblock language selector to 16 categorized languages.
  - Replaced heading dropdown with symmetrical icon-only typography selector.
  - Fixed image corner resize anchor and prevented drag-duplication on drop.
  - Converted `dist/markon.css` to a backward-compatible `@import '@nofinite/nuicss/styles.css'` shim.

- **`@nofinite/charts`:**

  - Removed duplicate 196 kB copy of NUICSS from chart bundle.
  - Converted `dist/styles.css` to a lightweight backward-compatible shim.

- **`@nofinite/media`:**

  - Aligned media player tokens with NUICSS `--color-primary` and `--bg-surface` design tokens.

- **`@nofinite/nui`:**
  - Standardized CodeBlock to 16 programming languages with categorized optgroups and NUICSS superclasses.
