# @nofinite/nuicss

## 3.2.0

### Minor Changes

- 9d90eb4: ### Unified Single-Engine Styling Architecture

  Consolidated ecosystem styles into `@nofinite/nuicss` as the single source of truth and unified styling engine across all packages.

  - **`@nofinite/nuicss`:**

    - Integrated 455 lines of Kanban board layout and drag-and-drop indicator geometry into `packages/nuicss/src/styles/theme.css` Section 15.c.
    - Integrated Markon editor toolbar, footer, and floating bubble menu pill styles (`.markon-bubble-menu`) into `theme.css` Section 6.
    - Integrated Vidstack media player OKLCH token bridge (`.nui-vidstack-player`, `--media-brand`) into `theme.css` Section 15.d.
    - Emitted dedicated modular subpaths from NUICSS: `dist/kanban.css`, `dist/markon.css`, and `dist/widgets.css`.
    - Frosted glassmorphic tooltip card popovers (`bg-surface/80`, `backdrop-blur-xl`, `saturate-150`, specular hairline highlight, glowing series swatches, boundary guards preventing clipped headers).
    - Zero-overflow legend layout with flex column container, `legendPosition="top" | "bottom"`, and adaptive plot height calculation (`plotHeight = height - 38`).
    - Adaptive horizontal bar left margins (scaling dynamically up to 35% of chart width) with smart ellipsis truncation and full label `<title>` tooltips.
    - Dynamic origin $(0, 0)$ and corner-clearing tick textAnchor alignment to eliminate overlapping text smudges.

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

### Patch Changes

- 68a0ae0: ### Dependency Upgrades & Engine Maintenance

  - **`@nofinite/nui`:**

    - Upgraded `framer-motion` to `13.4.0` (Motion v13 architecture with optimized animation pipeline).
    - Upgraded `lucide-react` to `1.47.0` (Lucide v1.x standard release).
    - Upgraded `react-hook-form` to `7.88.0` and `tailwind-merge` to `3.7.0`.
    - Removed obsolete Vidstack and KaTeX bundle extraction hooks from Vite configuration.

  - **`@nofinite/markon`:**

    - Removed unused `lucide-react` runtime dependency to reduce package size.
    - Upgraded `tailwind-merge` to `3.7.0`.

  - **`@nofinite/charts`:**

    - Upgraded `@types/d3-shape` to `3.2.0`.

  - **`@nofinite/nuicss`:**

    - Upgraded `valibot` to `1.5.0` and `postcss` to `8.5.28`.
    - Removed unused `esbuild` development dependency.

  - **`@nofinite/utils`:**
    - Upgraded `jose` to `6.2.12`, `argon2` to `0.45.1`, `uuid` to `14.0.2`, and `zeptomail` to `8.0.1`.

## 3.1.0

### Minor Changes

- 7e82dd3: # Release 3.1.0

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

## 3.0.6

### Patch Changes

- aaed9da: ### 🛠️ PostCSS HMR & Native Config Discovery

  - **Native Config Resolution**: Automatically discover `nuicss.config.{ts,js,mjs,cjs}` using `@unocss/config` without requiring manual path configuration.
  - **Enhanced PostCSS HMR**: Fixed Hot Module Replacement (HMR) reloads in the PostCSS plugin by tracking config file dependencies.
  - **Theme & Reset Refinements**: Cleaned up default CSS reset styles and optimized theme token resolution.

## 3.0.5

### Patch Changes

- eb5c75c: fix: Nuicss PostCSS wrapper natively configures UnoCSS and fixes missing Typescript declarations.

## 3.0.4

### Patch Changes

- 8bbe3ff: fix(plugin): safely unwrap postcss default export for CJS environments

## 3.0.2

### Patch Changes

- fdb9185: fix(nuicss): remove CommonJS require statements from CDN build to support direct browser execution

## 3.0.1

### Patch Changes

- e1dbb0b: fix(nuicss): include index.global.js CDN script in nx build target

## 3.0.0

### Major Changes

- 7d77e5e: **NUI CSS 3.0.0 Architecture Rewrite:**
  - **UnoCSS Integration:** Transitioned to an UnoCSS-powered underlying engine, drastically improving compilation speed and leveraging standard utilities.
  - **Zero-Configuration:** Developers can now seamlessly import `@nofinite/nuicss/styles.css` without polluting their stack with virtual module imports.
  - **Semantic Tokens:** Built-in semantic design system variables (e.g. `bg-surface`, `text-muted`, `border-subtle`).
  - **Enhanced DX:** Fully compliant with existing open source configurations. Included Vitest suite for preset robustness.

## 2.0.1

### Patch Changes

- 89e6f95: fix(nuicss): run esbuild without npx for ci/cd compatibility
- d365a79: fix(nuicss): include `browser.js` CDN bundle in automated releases

## 2.0.0

### Major Changes

- 8eb980e: NuiCSS 2.0.0 Architecture Rewrite:
  - Replaced UnoCSS dependency with a highly optimized, fully native TypeScript Just-In-Time (JIT) Engine.
  - Added comprehensive native support for `@media` breakpoints and `@container` queries natively.
  - Full Vite integration plugin (`nuicssVitePlugin`) for seamless developer experience.
  - Resolved dependency topology cycles and deadlocks in the Nx build graph.
  - Overhauled and optimized modifier generation (e.g., `group-hover/name` and `peer-focus`).
