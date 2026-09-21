---
'@nofinite/nui': minor
'@nofinite/nuicss': minor
---

# Release 3.1.0

Comprehensive release notes based on code diff audit comparing version 3.1.0 against published baselines (@nofinite/nui@3.0.7 and @nofinite/nuicss@3.0.6).

## @nofinite/nui (3.0.7 -> 3.1.0)

### New Components

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

---

## @nofinite/nuicss (3.0.6 -> 3.1.0)

### Engine Upgrade & Pipeline

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
