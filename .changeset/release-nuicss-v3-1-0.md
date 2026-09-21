---
'@nofinite/nuicss': minor
---

# Release 3.1.0

Comprehensive release notes based on code diff audit comparing version 3.1.0 against published baseline (@nofinite/nuicss@3.0.6).

### Engine Upgrade & Modern Pipeline

- Upgraded compiler engine to `@unocss/preset-wind4` (UnoCSS v65 + Tailwind 4 CSS theme compatibility) with LightningCSS processing.
- Layered reset architecture (`@layer base`) preventing style bleeding and selector wars.

### Design Tokens & OKLCH Color Architecture

- Migrated design tokens from legacy sRGB / HEX literals to native wide-gamut OKLCH P3 color palettes (`var(--color-primary)`, `var(--bg-surface)`, etc.).
- Added dedicated chart color tokens (`--chart-1` to `--chart-5`) with semantic fill and stroke variables.
- Added fluid typography, fluid spacing scales, and native CSS container query primitives (`@container`).
- Enhanced dark mode contrast and added high contrast theme definitions.

### Component Superclass Architecture

- Modularized component class definitions into 5 core shortcut modules:
  - `primitives.ts`: `btn`, `badge` variants (`badge-default`, `badge-primary`, `badge-success`, `badge-warning`, `badge-danger`, `badge-outline`), `card`, `avatar`, `divider`, `kbd`.
  - `forms.ts`: `input`, `textarea`, `select`, `checkbox`, `switch`, `slider`, `pin-input`.
  - `overlays.ts`: `modal`, `dialog`, `drawer`, `tooltip`, `popover`, `dropdown`, `toast`.
  - `media.ts`: `image`, `video-player`, `audio-player`, `carousel`.
  - `widgets.ts`: `data-grid`, `kanban`, `table-container`, `stat-card`, `timeline`, `tree-view`, `breadcrumb`, `pagination`.
- Protected shortcut names against collision with pseudo-variant modifiers in runtime scripts.

### Developer Tooling & Framework Integrations

- Built-in Tailwind Migration Codemod CLI (`nuicss migrate` / `bin/nuicss.js`) to automatically translate Tailwind v3/v4 utility classes to NUICSS superclasses and tokens.
- Next.js Turbopack plugin (`@nofinite/nuicss/next`) and SSR critical CSS extractor (`@nofinite/nuicss/ssr`) with LRU caching.
- Modular static CSS bundles: `dist/components.css`, `dist/primitives.css`, `dist/forms.css`, `dist/overlays.css`, `dist/widgets.css`, `dist/media.css`, and minified variants.
- Generated native VS Code and Cursor HTML/CSS custom data (`dist/nuicss.html-data.json`, `dist/nuicss.css-data.json`) for automatic IDE autocomplete and hovering.
- Machine-readable LLM documentation assets (`llms.txt`, `llms-full.txt`, `llms-components.json`).
- Strict monorepo package isolation eliminating internal aliases.
