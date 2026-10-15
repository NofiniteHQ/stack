# @nofinite/nui

## 3.2.0

### Minor Changes

- 9dd1513: ### Architecture & Decoupled Packages

  Extracted heavy, domain-specific enterprise modules out of `@nofinite/nui` into dedicated, framework-agnostic packages to achieve a featherweight core UI baseline.

  - **`@nofinite/markon@2.0.0`:**

    - Complete universal rich text editing suite powered by TipTap 2, lowlight, and KaTeX math formulas.
    - Framework-agnostic DOM engine (`MarkonEditor`) and React adapter (`@nofinite/markon/react`).
    - Completely decouples 28 `@tiptap/*` packages, `katex`, and `tippy.js` from the core `@nofinite/nui` package.

  - **`@nofinite/charts@1.0.0`:**

    - Universal vector data visualization suite powered by fine-grained D3 math algorithms (`d3-shape`, `d3-scale`, `d3-array`).
    - Native SVG path rendering with `curveMonotoneX` smoothing and 0ms CSS dark mode reactivity via `@nofinite/nuicss` tokens.
    - Framework-agnostic DOM class (`Chart`) and React adapters (`AreaChart`, `LineChart`, `BarChart`, `PieChart`, `DonutChart`, `ScatterChart`, `Sparkline`).
    - Decouples all 11 `@visx/*` packages from `@nofinite/nui`.

  - **`@nofinite/media@1.0.0`:**

    - Universal audio and video streaming suite powered by W3C Custom Elements and Vidstack.
    - Support for HLS streaming (`.m3u8`), DASH (`.mpd`), MP4, WebM, MP3, WAV, and audio tracks.
    - Framework-agnostic DOM player factory (`createMediaPlayer`) and React adapters (`VideoPlayer`, `AudioPlayer`).
    - Decouples `@vidstack/react` and `vidstack` from `@nofinite/nui`.

  - **`@nofinite/kanban@1.0.0`:**
    - Universal task board suite powered by Atlassian's Pragmatic Drag and Drop (`@atlaskit/pragmatic-drag-and-drop`).
    - Featherweight ~4.5 kB footprint with native pointer events, bi-directional card dragging across columns, and column reordering.
    - Framework-agnostic DOM binder (`createKanbanBoard`) and React adapter (`<Kanban>`).
    - Decouples `@hello-pangea/dnd` from `@nofinite/nui`.

  ### Core Bundle Reductions (`@nofinite/nui`)

  - **Full Package Payload:** Reduced from 2,842.65 kB down to 558.30 kB minified (172.41 kB gzipped), an **80.4% reduction**.
  - **Simple Application Footprint (Button, Badge, Card):** 32.99 kB minified / 10.70 kB gzipped.
  - **Hoisted devDependencies:** Centralized monorepo build tools (`vitest-axe`, `@storybook/test-runner`, `valibot`, etc.) to root Nx workspace configuration.
  - **Runtime Dependencies:** Streamlined from over 45 external dependencies down to 7 core primitives.

### Patch Changes

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

- e68b2df: # Release 3.1.0

  Comprehensive release notes based on code diff audit comparing version 3.1.0 against published baseline (@nofinite/nui@3.0.7).

  ### New Enterprise Components

  - **DataGrid**: Enterprise tabular data display engine supporting sortable column headers, text and multiselect column filters, interactive column resizing via draggable splitters, virtualized scrolling for high-volume datasets, and single/multi row selection models.
  - **Kanban**: Drag-and-drop workflow management component featuring dynamic columns, reorderable card items, swimlanes, and custom card render props.
  - **Editor**: Rich text block editor built upon ProseMirror and Tiptap. Features block math typesetting (LaTeX via KaTeX), interactive slash commands menu (`/slash`), collapsible content blocks, resizable image nodes with aspect ratio locks, code blocks with syntax highlighting, and persistent IndexedDB local auto-save (`useAutoSave`).
  - **BubbleMenu**: Contextual floating toolbar anchoring to active text selections with inline formatting controls (bold, italic, strike, code, links).
  - **FloatingArrow**: Contoured SVG popover and tooltip pointer arrow with subpixel geometric alignment and border stroke rendering.
  - **LinkPreview**: Card component displaying OpenGraph title, description, and thumbnail metadata for external URLs with graceful fallback states.

  ### Component Refactoring & Design Token Alignment

  - **Badge**: Replaced legacy Tailwind utility clusters and hardcoded text colors with canonical `@nofinite/nuicss` superclasses (`badge-default`, `badge-primary`, `badge-success`, `badge-warning`, `badge-danger`, `badge-outline`).
  - **Card**: Migrated to canonical compound architecture (`Card.Header`, `Card.Body`, `Card.Footer`) backed by the `card` superclass token.
  - **Modal & DialogProvider**: Structured dialog layout into canonical `Modal.Header`, `Modal.Body`, and `Modal.Footer`. Added `hideCloseButton={true}` on binary confirmation modals, integrated `backdrop-blur-sm` with `bg-overlay` for glassmorphic visual separation.
  - **Button**: Standardized on canonical button superclasses (`btn`, `btn-primary`, `btn-secondary`, etc.). Added `loading` prop alias to prevent invalid DOM attribute warnings.
  - **PinInput**: Adopted native `pin-input` superclass and semantic states.
  - **Resizable**: Integrated container resize observers and ergonomic splitters.
  - **Chart Suite**: Refactored `AreaChart`, `BarChart`, `DonutChart`, `LineChart`, `PieChart`, and `ScatterChart` to eliminate hardcoded HEX literals (`#3b82f6`, etc.) in favor of semantic NUICSS `--chart-1` through `--chart-5` CSS variables.
  - **ColorPicker**: Refined transparent alpha rendering and checkerboard backdrop.

  ### Build, Types & Testing

  - Unified standalone stylesheet `dist/styles.css` (139 kB) bundling all component styles.
  - Preserved individual component modules in `dist/components/*` for ESM/CJS tree-shaking.
  - Migrated Storybook to 10.6.0 with standardized 9-tier component hierarchy and autodocs.
  - Mocked `HTMLCanvasElement` context in vitest setup to ensure 100% test reliability.

## 3.0.7

### Patch Changes

- df8dcd8: ### 🚀 Standalone "Zero-Config" CSS Architecture

  - **Independent Bundled CSS**: All component styles, animations, and semantic design tokens are now compiled into a standalone `@nofinite/nui/styles.css` file at build-time. End users no longer need to install or configure `@nofinite/nuicss` or UnoCSS in their application.
  - **Root Import Simplification**: Getting started only requires a single root import:
    ```tsx
    import '@nofinite/nui/styles.css';
    ```
  - **Framer Motion Type Alignment**: Resolved TypeScript typing conflicts between `HTMLMotionProps` and React HTML attributes across all interactive components (`Modal`, `Tabs`, `MegaMenu`, etc.).
  - **Direct Component Exports**: Flattened entrypoint exports directly in `index.ts` for cleaner module resolution and tree-shaking.

## 3.0.6

### Patch Changes

- 2a2a36d: refactor(nui): implement semantic design tokens and fix polymorphic asChild DOM leakage across all components

## 3.0.5

### Patch Changes

- 96fb026: fix: remove redundant AnimatePresence in TabsRoot to prevent framer-motion mode wait warnings

## 3.0.4

### Patch Changes

- 5ebc05e: fix: add .npmignore to prevent pnpm publish from ignoring dist folders

## 3.0.3

### Patch Changes

- 6fcf4a0: fix(build): ensure all 68 components are properly exported from the package entry point

## 3.0.2

### Patch Changes

- f7a2dfc: fix(build): correctly resolve Vite output directory for rollup

## 3.0.1

### Patch Changes

- 037d327: fix: explicitly externalize dependencies to prevent build crash and ensure dist is generated

## 2.0.3

### Patch Changes

- Fix: @nofinite/nui/styles.css import resolved

## 2.0.2

### Patch Changes

- Fix: css token resolved

## 2.0.0

### Major Changes

- Introduced a new design token system, added new components, enhanced existing ones, and shipped the global nui.\* API for dialogs and toasts.

## 1.1.2

### Patch Changes

- Fix: import css filename changed

## 1.1.1

### Patch Changes

- Fix: folder restructured

## 1.0.2

### Patch Changes

- fix: ensure build output is included in npm package

## 1.0.1

### Patch Changes

- fix: include dist files in npm package

## 1.0.0

### Major Changes

- Initial public release of the NUI.
