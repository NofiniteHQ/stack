# @nofinite/nui

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
